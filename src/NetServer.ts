import { Socket, Server as SocketIOServer } from 'socket.io';
import NetWorld from './NetWorld';
import { GameNetNamespace, SetNetEnvironment } from './GameNet';
import ConnectionHandler from './server/ConntectionHandler';
import { sendObjSpawnEvent } from './server/ObjectEvents';
import SyncVarHandler from './server/SyncVarHandler';
import RPCHandler from './server/RPCHandler';
import { IGameNetConfig } from './Config';
import NetRoom from './NetRoom';

/**
 * Represents a network server for managing game connections and interactions.
 * 
 * This class is responsible for setting up the network environment, handling client connections,
 * managing game rooms, and synchronizing game state across connected clients.
 * 
 * @remarks
 * The server initializes the network environment to 'server', sets up the game socket namespace,
 * creates a new instance of `NetWorld`, and initializes connection, synchronization, and RPC handlers.
 * It also sets up event listeners for object spawning and destruction within the game world.
 * 
 * @example
 * ```typescript
 * import NetServer from './NetServer';
 * import { Server } from 'socket.io';
 * 
 * const io = new Server();
 * const netServer = new NetServer(io);
 * 
 * // Handle a client joining a room
 * netServer.JoinNetRoom(clientSocket, gameRoom);
 * 
 * // Handle a client leaving a room
 * netServer.LeaveNetRoom(clientSocket, gameRoom);
 * 
 * // Retrieve the list of connected clients
 * const clients = netServer.GetConnectedClients();
 * ```
 */
export default class NetServer {

    protected _world: NetWorld;
    /**
     * Gets the current instance of the NetWorld.
     * 
     * @returns {NetWorld} The current NetWorld instance.
     */
    public get World(): NetWorld { return this._world; }
    protected _gameSocket: GameNetNamespace;

    protected _connectionHandler: ConnectionHandler;

    /**
     * Creates an instance of the NetServer.
     * 
     * @param io - The Socket.IO server instance.
     * @param config - Optional configuration for the game network.
     * 
     * Initializes the network environment to 'server', sets up the game socket namespace,
     * creates a new NetWorld instance, and initializes connection, synchronization, and RPC handlers.
     * Also sets up event listeners for object spawning and destruction within the game world.
     */
    public constructor(io: SocketIOServer, config?: IGameNetConfig) {

        SetNetEnvironment('server');

        const namespace = config?.namespace ?? '/game';
        this._gameSocket = io.of(namespace) as GameNetNamespace;

        this._world = new NetWorld();

        this._connectionHandler = new ConnectionHandler(this._gameSocket, this._world);
        new SyncVarHandler(this._gameSocket)
        new RPCHandler(this._gameSocket);

        this._world.onObjectSpawned.push((obj) => sendObjSpawnEvent(obj, this._gameSocket));

        this._world.onObjectDestroyed.push((obj) => {
            this._gameSocket.volatile.emit("objDestroyed", obj.Id);
        });
    }

    /**
     * Handles a socket joining a network room.
     * 
     * @param socket - The socket instance representing the client connection.
     * @param room - The network room that the socket is joining.
     */
    public JoinNetRoom(socket: Socket, room: NetRoom) {
        console.log(`${socket.id} joined room ${room.Name}`);
        socket.join(room.Name);

        // Send room data to client
        this._connectionHandler.SendCurrentState(socket);
    }

    /**
     * Handles the process of a socket leaving a network room.
     *
     * @param socket - The socket instance representing the client connection.
     * @param room - The network room that the socket is leaving.
     */
    public LeaveNetRoom(socket: Socket, room: NetRoom) {
        socket.leave(room.Name);
        console.log(`${socket.id} left room ${room.Name}`);

        // Clear room data on client
    }

    /**
     * Retrieves the list of currently connected clients.
     *
     * @returns {Socket[]} An array of connected client sockets.
     */
    public GetConnectedClients(): Socket[] {
        return this._connectionHandler.ConnectedClients;
    }

}