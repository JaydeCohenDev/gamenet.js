import { io as IO, Socket } from 'socket.io-client';
import { IGameClientToServerEvents, IGameServerToClientEvents } from './GameEvents';
import NetWorld from './NetWorld';
import { GetNetObjType } from './NetObjectRegistry';
import { rpcCallbacks } from './RPC';
import { SetNetEnvironment } from './GameNet';
import { IGameNetConfig } from './Config';

export default class NetClient {

    public onConnected: (() => void)[] = [];
    public onDisconnected: (() => void)[] = [];

    protected _world: NetWorld;
    public get World(): NetWorld { return this._world; }

    public constructor(serverAddress: "http://127.0.0.1:3037", config?: IGameNetConfig) {

        const namespace = config?.namespace ?? '/game';

        const io: Socket<IGameServerToClientEvents, IGameClientToServerEvents>
            = IO(`${serverAddress}${namespace}`);

        SetNetEnvironment('client');

        this._world = new NetWorld();

        rpcCallbacks.onServerRPC = (obj, methodName, args) => {
            console.log('sending server RPC');
            io.emit("emitServerRPC", obj.Id, methodName, args);
        }

        io.on("connect", () => {
            this._world = new NetWorld();
            console.log("Connected to server!");

            this.onConnected.forEach(callback => callback());
        });

        io.on("disconnect", () => {
            this._world = new NetWorld();
            console.log("Disconnected from server!");

            this.onDisconnected.forEach(callback => callback());
        });

        io.on("objSpawned", (id: string, typeName: string, data: any) => {

            if (this._world.NetObjects[id]) {
                console.log('Net object already spawned... deserializing instead of spawning.');
                this._world.NetObjects[id].Deserialize(data);
                return;
            }

            console.log(`objSpawned id:${id} typeName:${typeName}`, data);
            const netObj = GetNetObjType(typeName);
            const obj = this._world.Spawn(netObj, id);
            obj.Deserialize(data);
            this._world.onObjectSpawned.forEach(callback => callback(obj));
        });

        io.on("objDestroyed", (id: string) => {
            console.log(`objDestroyed id:${id}`);
            this._world.NetObjects[id].Destroy();
        });

        io.on("objSync", (id: string, data: any) => {
            console.log(`objSync id:${id}`, data);
            this._world.NetObjects[id]?.Deserialize(data);
        });

        io.on("emitClientRPC", (objId: string, methodName: string, args: any[]) => {
            console.log(`emitClientRPC objId:${objId} methodName:${methodName}`, args);
            const obj = this._world.NetObjects[objId];
            if (!obj) return;

            (obj as any)[methodName](...args);
        });
    }

}