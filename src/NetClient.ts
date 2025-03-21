import { Socket } from 'socket.io-client';
import { IGameClientToServerEvents, IGameServerToClientEvents } from './GameEvents';
import NetWorld from './NetWorld';
import { GetNetObjType } from './NetObjectRegistry';
import { rpcCallbacks } from './RPC';

export default class NetClient {

    protected _world: NetWorld;
    public get World(): NetWorld { return this._world; }

    public constructor(io: Socket<IGameServerToClientEvents, IGameClientToServerEvents>) {
        this._world = new NetWorld();

        rpcCallbacks.onServerRPC = (objId, methodName, args) => {
            io.emit("emitServerRPC", objId, methodName, args);
        }

        io.on("connect", () => {
            console.log("Connected to server!");
        });

        io.on("disconnect", () => {
            console.log("Disconnected from server!");
        });

        io.on("objSpawned", (id: string, typeName: string, data: any) => {
            const netObj = GetNetObjType(typeName);
            this._world.Spawn(netObj, id).Deserialize(data);
        });

        io.on("objDestroyed", (id: string) => {
            this._world.NetObjects[id].Destroy();
        });

        io.on("objSync", (id: string, data: any) => {
            this._world.NetObjects[id].Deserialize(data);
        });

        io.on("emitClientRPC", (objId: string, methodName: string, args: any[]) => {
            const obj = this._world.NetObjects[objId];
            if (!obj) return;

            (obj as any)[methodName](...args);
        });
    }

}