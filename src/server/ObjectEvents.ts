import { Socket } from "socket.io";
import NetObj from "../NetObj";
import { GameNetNamespace } from "../GameNet";

/**
 * Sends an object spawn event to relevant game sockets.
 *
 * This function serializes the given object and emits an "objSpawned" event
 * to the relevant game sockets within the provided game namespace.
 *
 * @param obj - The object to be spawned, which must implement the `NetObj` interface.
 * @param gameSocket - The game namespace socket to which the event will be emitted.
 */
export function sendObjSpawnEvent(obj: NetObj, gameSocket: GameNetNamespace) {
    const data = obj.Serialize();

    targetRelevant(gameSocket, obj).emit("objSpawned", obj.Id, obj.constructor.name, data);
}

/**
 * Sends a serialized object to a client if the object is relevant for the client.
 *
 * @param obj - The object to be sent to the client.
 * @param client - The client socket to which the object will be sent.
 */
export function sendObjToClient(obj: NetObj, client: Socket) {
    if (!isRelevantFor(obj, client)) return;

    const data = obj.Serialize();
    client.emit("objSpawned", obj.Id, obj.constructor.name, data);
}

/**
 * Determines the relevant game socket based on the rooms associated with the given object.
 *
 * @param gameSocket - The GameNetNamespace instance representing the game socket.
 * @param obj - The NetObj instance containing information about the object, including its associated rooms.
 * @returns The game socket instance if the object has no associated rooms, otherwise a socket targeting the specified rooms.
 */
export function targetRelevant(gameSocket: GameNetNamespace, obj: NetObj) {
    if (obj.Rooms.length === 0)
        return gameSocket;
    else {
        return gameSocket.to(obj.Rooms.map((room => room.Name)));
    }
}

/**
 * Determines if a given object is relevant for a specific client.
 *
 * @param obj - The object to check relevance for. It contains a list of rooms.
 * @param client - The client socket to check against the object's rooms.
 * @returns `true` if the object is relevant for the client, otherwise `false`.
 */
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