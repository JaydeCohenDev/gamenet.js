import syncvar from "./SyncVar";
import { toServer, toClients } from "./RPC";
import { Namespace } from "socket.io";
import { IGameClientToServerEvents, IGameInterServerEvents, IGameServerToClientEvents, IGameSocketData } from "./GameEvents";

/**
 * A boolean flag indicating whether the current environment is a network server.
 * 
 * @remarks
 * This flag is set to `false` by default. It should be set to `true` if the code is running
 * in a network server environment.
 */
export let IS_NET_SERVER = false;

/**
 * A boolean flag indicating whether the current environment is a network client.
 * 
 * @remarks
 * This flag is used to determine if the code is running in a network client context.
 * It is initially set to `false` and can be updated based on the environment.
 */
export let IS_NET_CLIENT = false;

/**
 * Sets the network environment to either "server" or "client".
 *
 * @param env - The environment to set. Must be either "server" or "client".
 * @throws Will throw an error if the environment is not "server" or "client".
 */
export function SetNetEnvironment(env: "server" | "client") {
    switch (env) {
        case 'server':
            IS_NET_SERVER = true;
            break;
        case 'client':
            IS_NET_CLIENT = true;
            break;
        default:
            throw (`unhandled environment ${env}`);
    }
}

/**
 * Represents a namespace for the GameNet application.
 * 
 * This type is a specialized `Namespace` that defines the events and data
 * structures used for communication between game clients and servers, 
 * inter-server communication, and socket data.
 * 
 * @typeParam IGameClientToServerEvents - The events sent from the game client to the server.
 * @typeParam IGameServerToClientEvents - The events sent from the game server to the client.
 * @typeParam IGameInterServerEvents - The events used for communication between servers.
 * @typeParam IGameSocketData - The data structure associated with the game socket.
 */
export type GameNetNamespace = Namespace<
    IGameClientToServerEvents,
    IGameServerToClientEvents,
    IGameInterServerEvents,
    IGameSocketData>;

export { syncvar, toServer, toClients };