import syncvar from "./SyncVar";
import { toServer, toClients } from "./RPC";
import { Namespace } from "socket.io";
import { IGameClientToServerEvents, IGameInterServerEvents, IGameServerToClientEvents, IGameSocketData } from "./GameEvents";

export let IS_NET_SERVER = false;
export let IS_NET_CLIENT = false;

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

export type GameNetNamespace = Namespace<
    IGameClientToServerEvents,
    IGameServerToClientEvents,
    IGameInterServerEvents,
    IGameSocketData>;

export { syncvar, toServer, toClients };