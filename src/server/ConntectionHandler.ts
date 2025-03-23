import { Socket } from "socket.io";
import { GameNetNamespace } from "../GameNet";
import NetWorld from "../NetWorld";
import { sendObjSpawnEvent, sendObjToClient } from "./ObjectEvents";

export default class ConnectionHandler {
    protected _gameSocket: GameNetNamespace;
    protected _defaultWorld: NetWorld;

    constructor(gameSocket: GameNetNamespace, defaultWorld: NetWorld) {
        this._gameSocket = gameSocket;
        this._defaultWorld = defaultWorld;

        this._gameSocket.on("connection", (socket) => {
            console.log(`A new client connected with ID: ${socket.id}`);

            this.sendCurrentState(socket);

            socket.on("disconnect", () => {
                console.log(`client with ID: ${socket.id} disconnected`);
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

    protected sendCurrentState(socket: Socket) {
        console.log('sending current state to client');
        for (const id in this._defaultWorld.NetObjects) {
            const obj = this._defaultWorld.NetObjects[id];
            console.log(`sending obj with id: ${id}`);
            sendObjToClient(obj, socket);
        }
    }
}