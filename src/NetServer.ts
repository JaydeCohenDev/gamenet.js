import { Socket, Server as SocketIOServer } from 'socket.io';
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
import NetRoom from './NetRoom';

export default class NetServer {

    protected _defaultWorld: NetWorld;
    public get DefaultWorld(): NetWorld { return this._defaultWorld; }
    protected _gameSocket: GameNetNamespace;

    protected _connectionHandler: ConnectionHandler;

    public constructor(io: SocketIOServer, config?: IGameNetConfig) {

        SetNetEnvironment('server');

        const namespace = config?.namespace ?? '/game';
        this._gameSocket = io.of(namespace) as GameNetNamespace;

        this._defaultWorld = new NetWorld();

        this._connectionHandler = new ConnectionHandler(this._gameSocket, this._defaultWorld);
        new SyncVarHandler(this._gameSocket)
        new RPCHandler(this._gameSocket);

        this._defaultWorld.onObjectSpawned.push((obj) => sendObjSpawnEvent(obj, this._gameSocket));

        this._defaultWorld.onObjectDestroyed.push((obj) => {
            this._gameSocket.volatile.emit("objDestroyed", obj.Id);
        });
    }

    public JoinNetRoom(socket: Socket, room: NetRoom) {
        console.log(`${socket.id} joined room ${room.Name}`);
        socket.join(room.Name);

        // Send room data to client
        this._connectionHandler.SendCurrentState(socket);
    }

    public LeaveNetRoom(socket: Socket, room: NetRoom) {
        socket.leave(room.Name);
        console.log(`${socket.id} left room ${room.Name}`);

        // Clear room data on client
    }

    public GetConnectedClients(): Socket[] {
        return this._connectionHandler.ConnectedClients;
    }

}