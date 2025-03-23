import { Socket } from "socket.io";
import NetObj from "../NetObj";
import { GameNetNamespace } from "../GameNet";

export function sendObjSpawnEvent(obj: NetObj, gameSocket: GameNetNamespace) {
    const data = obj.Serialize();

    targetRelevant(gameSocket, obj).emit("objSpawned", obj.Id, obj.constructor.name, data);
}

export function sendObjToClient(obj: NetObj, client: Socket) {
    if (!isRelevantFor(obj, client)) return;

    const data = obj.Serialize();
    client.emit("objSpawned", obj.Id, obj.constructor.name, data);
}

export function targetRelevant(gameSocket: GameNetNamespace, obj: NetObj) {
    if (obj.Rooms.length === 0)
        return gameSocket;
    else {
        return gameSocket.to(obj.Rooms.map((room => room.Name)));
    }
}

export function isRelevantFor(obj: NetObj, client: Socket) {

    if (obj.Rooms.length === 0)
        return true;

    for (const room of obj.Rooms) {
        if (client.rooms.has(room.Name)) {
            return true;
        }
    }

    return false;

}