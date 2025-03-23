import { Socket } from "socket.io";
import { GameNetNamespace } from "../GameNet";
import NetWorld from "../NetWorld";
import { isRelevantFor, sendObjSpawnEvent, sendObjToClient } from "./ObjectEvents";

export default class ConnectionHandler {
    protected _gameSocket: GameNetNamespace;
    protected _defaultWorld: NetWorld;

    protected _connectedClients: Socket[] = [];
    public get ConnectedClients(): Socket[] { return this._connectedClients; }

    constructor(gameSocket: GameNetNamespace, defaultWorld: NetWorld) {
        this._gameSocket = gameSocket;
        this._defaultWorld = defaultWorld;

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
                const objName = this._defaultWorld.NetObjects[objId].constructor.name;
                console.log(`Server RPC: ${objName}.${methodName}(${args.join(", ")})`);
                const obj = this._defaultWorld.NetObjects[objId];
                if (!obj) return;

                (obj as any)[methodName](...args);
            });
        });

    }

    public SendCurrentState(socket: Socket) {

        console.log('sending current state to client');
        for (const id in this._defaultWorld.NetObjects) {

            const obj = this._defaultWorld.NetObjects[id];

            if (isRelevantFor(obj, socket)) {
                console.log(`sending obj with id: ${obj.Id}`);
                sendObjToClient(obj, socket);
            }

        }
    }
}