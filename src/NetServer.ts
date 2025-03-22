import { Namespace, Socket, Server as SocketIOServer } from 'socket.io';
import NetWorld from './NetWorld';
import { IGameClientToServerEvents, IGameServerToClientEvents, IGameInterServerEvents as IGameInterServerEvents, IGameSocketData } from './GameEvents';
import { syncVarCallbacks } from './SyncVar';
import NetObj from './NetObj';
import { rpcCallbacks } from './RPC';
import { SetNetEnvironment } from './GameNet';

export default class NetServer {

    protected _defaultWorld: NetWorld;
    public get DefaultWorld(): NetWorld { return this._defaultWorld; }
    protected _gameSocket: Namespace<IGameClientToServerEvents, IGameServerToClientEvents, IGameInterServerEvents, IGameSocketData>;

    public constructor(io: SocketIOServer) {

        SetNetEnvironment('server');

        this._gameSocket = io.of('/game');

        this._gameSocket.on("connection", (socket) => {


            console.log(`A new client connected with ID: ${socket.id}`);

            this.sendCurrentState(socket);

            socket.on("disconnect", () => {
                console.log(`client with ID: ${socket.id} disconnected`);
            });

            socket.on("emitServerRPC", (objId: string, methodName: string, args: any[]) => {
                console.trace();
                const objName = this.DefaultWorld.NetObjects[objId].constructor.name;
                console.log(`Server RPC: ${objName}.${methodName}(${args.join(", ")})`);
                const obj = this._defaultWorld.NetObjects[objId];
                if (!obj) return;

                (obj as any)[methodName](...args);
            });
        });

        syncVarCallbacks.onSyncVarChange = (obj, propName, oldValue, newValue) => {
            console.log(`${obj.constructor.name}:${propName} changed from '${oldValue}' to '${newValue}'`);
            const data = (obj as NetObj).Serialize();
            this._gameSocket.emit("objSync", obj.Id, data);
        }

        rpcCallbacks.onClientRPC = (objId, methodName, args) => {
            console.log(`Client RPC: ${objId}.${methodName}(${args.join(", ")})`);
            this._gameSocket.volatile.emit("emitClientRPC", objId, methodName, args);
        }

        this._defaultWorld = new NetWorld();

        this._defaultWorld.onObjectSpawned.push((obj) => this.sendObjSpawnEvent(obj));

        this._defaultWorld.onObjectDestroyed.push((obj) => {
            this._gameSocket.volatile.emit("objDestroyed", obj.Id);
        });
    }

    protected sendObjSpawnEvent(obj: NetObj, socket?: Socket) {
        const data = obj.Serialize();
        console.log(`objSpawned id:${obj.Id} type:${obj.constructor.name}`, data)

        if (socket) { // send to specific client
            socket.emit("objSpawned", obj.Id, obj.constructor.name, data);
        } else { // send to all
            this._gameSocket.volatile.emit("objSpawned", obj.Id, obj.constructor.name, data);
        }

    }

    protected sendCurrentState(socket: Socket) {
        console.log('sending current state to client');
        for (const id in this.DefaultWorld.NetObjects) {
            const obj = this.DefaultWorld.NetObjects[id];
            console.log(id, obj);
            this.sendObjSpawnEvent(obj, socket);
        }
    }
}