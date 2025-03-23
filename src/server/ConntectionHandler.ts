import { Socket } from "socket.io";
import { GameNetNamespace } from "../GameNet";
import NetWorld from "../NetWorld";
import { isRelevantFor, sendObjToClient } from "./ObjectEvents";

/**
 * Manages connections to the server
 */
export default class ConnectionHandler {
    protected _gameSocket: GameNetNamespace;
    protected world: NetWorld;

    protected _connectedClients: Socket[] = [];

    /**
     * A list of all currently connected clients.
     */
    public get ConnectedClients(): Socket[] { return this._connectedClients; }

    /**
     * 
     * @param gameSocket the server namespace socket that handles the connection.
     * @param world the world that contains all the NetObjects 
     */
    constructor(gameSocket: GameNetNamespace, world: NetWorld) {
        this._gameSocket = gameSocket;
        this.world = world;

        this._gameSocket.on("connection", (socket) => {
            console.log(`A new client connected with ID: ${socket.id}`);

            this._connectedClients.push(socket);

            this.SendCurrentState(socket);

            socket.on("disconnect", () => {
                console.log(`client with ID: ${socket.id} disconnected`);
                this._connectedClients.splice(this._connectedClients.indexOf(socket), 1);
            });

            socket.on("emitServerRPC", (objId: string, methodName: string, args: any[]) => {
                console.trace();
                const objName = this.world.NetObjects[objId].constructor.name;
                console.log(`Server RPC: ${objName}.${methodName}(${args.join(", ")})`);
                const obj = this.world.NetObjects[objId];
                if (!obj) return;

                (obj as any)[methodName](...args);
            });
        });

    }

    /**
     * Sends the current world state to the target client. Only objects
     * that are relevant to them will be sent.
     * 
     * Todo: Don't send objects they already know about? (room join)
     * 
     * @param socket client to send to
     */
    public SendCurrentState(socket: Socket) {

        console.log('sending current state to client');
        for (const id in this.world.NetObjects) {

            const obj = this.world.NetObjects[id];

            if (isRelevantFor(obj, socket)) {
                console.log(`sending obj with id: ${obj.Id}`);
                sendObjToClient(obj, socket);
            }

        }
    }
}