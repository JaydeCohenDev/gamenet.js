import { Namespace, Server as SocketIOServer } from 'socket.io';
import NetWorld from './NetWorld';
import { IGameClientToServerEvents, IGameServerToClientEvents, IGameInterServerEvents as IGameInterServerEvents, IGameSocketData } from './GameEvents';
import { syncVarCallbacks } from './SyncVar';
import NetObj from './NetObj';
import { rpcCallbacks } from './RPC';

export default class NetServer {

    protected _defaultWorld: NetWorld;
    public get DefaultWorld(): NetWorld { return this._defaultWorld; }
    protected _gameSocket: Namespace<IGameClientToServerEvents, IGameServerToClientEvents, IGameInterServerEvents, IGameSocketData>;

    public constructor(io: SocketIOServer) {
        this._gameSocket = io.of('/game');

        this._gameSocket.on("connection", (socket) => {
            socket.on("disconnect", () => {

            });

            socket.on("emitServerRPC", (objId: string, methodName: string, args: any[]) => {
                console.log(`Server RPC: ${objId}.${methodName}(${args.join(", ")})`);
                const obj = this._defaultWorld.NetObjects[objId];
                if (!obj) return;

                (obj as any)[methodName](...args);
            });
        });

        syncVarCallbacks.onSyncVarChange = (obj, propName, oldValue, newValue) => {
            //console.log(`${obj.constructor.name}:${propName} changed from ${oldValue} to ${newValue}`);
            const data = (obj as NetObj).Serialize();
            this._gameSocket.volatile.emit("objSync", obj.Id, data);
        }

        rpcCallbacks.onClientRPC = (objId, methodName, args) => {
            console.log(`Client RPC: ${objId}.${methodName}(${args.join(", ")})`);
            this._gameSocket.volatile.emit("emitClientRPC", objId, methodName, args);
        }

        this._defaultWorld = new NetWorld();

        this._defaultWorld.onObjectSpawned = (obj) => {
            this._gameSocket.volatile.emit("objSpawned", obj.Id, "TestObj", { test: "data" });
        }

        this._defaultWorld.onObjectDestroyed = (obj) => {
            this._gameSocket.volatile.emit("objDestroyed", obj.Id);
        }
    }
}