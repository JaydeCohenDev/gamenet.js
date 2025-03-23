import { Socket } from "socket.io";
import NetObj from "../NetObj";
import { GameNetNamespace } from "../GameNet";

export function sendObjSpawnEvent(obj: NetObj, gameSocket: GameNetNamespace) {
    const data = obj.Serialize();

    targetRelevant(gameSocket, obj).emit("objSpawned", obj.Id, obj.constructor.name, data);
}

export function sendObjToClient(obj: NetObj, client: Socket) {
    const data = obj.Serialize();
    if (obj.Rooms.length === 0)
        client.emit("objSpawned", obj.Id, obj.constructor.name, data);
}

export function targetRelevant(gameSocket: GameNetNamespace, obj: NetObj) {
    if (obj.Rooms.length === 0)
        return gameSocket;
    else {
        return gameSocket.to(obj.Rooms.map((room => room.Name)));
    }
}