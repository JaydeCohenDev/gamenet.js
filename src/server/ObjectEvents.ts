import { Socket } from "socket.io";
import NetObj from "../NetObj";
import { GameNetNamespace } from "../GameNet";

export function sendObjSpawnEvent(obj: NetObj, gameSocket: GameNetNamespace) {
    const data = obj.Serialize();
    gameSocket.emit("objSpawned", obj.Id, obj.constructor.name, data);
}

export function sendObjToClient(obj: NetObj, client: Socket) {
    const data = obj.Serialize();
    client.emit("objSpawned", obj.Id, obj.constructor.name, data);
}