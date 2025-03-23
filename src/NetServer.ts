import { Server as SocketIOServer } from 'socket.io';
import NetWorld from './NetWorld';
import { syncVarCallbacks } from './SyncVar';
import NetObj from './NetObj';
import { rpcCallbacks } from './RPC';
import { GameNetNamespace, SetNetEnvironment } from './GameNet';
import ConnectionHandler from './server/ConntectionHandler';
import { sendObjSpawnEvent } from './server/ObjectEvents';
import SyncVarHandler from './server/SyncVarHandler';
import RPCHandler from './server/RPCHandler';
import { IGameNetConfig } from './Config';

export default class NetServer {

    protected _defaultWorld: NetWorld;
    public get DefaultWorld(): NetWorld { return this._defaultWorld; }
    protected _gameSocket: GameNetNamespace;

    public constructor(io: SocketIOServer, config?: IGameNetConfig) {

        SetNetEnvironment('server');

        const namespace = config?.namespace ?? '/game';
        this._gameSocket = io.of(namespace);

        this._defaultWorld = new NetWorld();

        new ConnectionHandler(this._gameSocket, this._defaultWorld);
        new SyncVarHandler(this._gameSocket)
        new RPCHandler(this._gameSocket);

        this._defaultWorld.onObjectSpawned.push((obj) => sendObjSpawnEvent(obj, this._gameSocket));

        this._defaultWorld.onObjectDestroyed.push((obj) => {
            this._gameSocket.volatile.emit("objDestroyed", obj.Id);
        });
    }

}