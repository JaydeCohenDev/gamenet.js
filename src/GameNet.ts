import syncvar from "./SyncVar";
import { toServer, toClients } from "./RPC";
import { BroadcastOperator, Namespace } from "socket.io";
import { IGameClientToServerEvents, IGameInterServerEvents, IGameServerToClientEvents, IGameSocketData } from "./GameEvents";
import NetObj from "./NetObj";
import { DecorateAcknowledgementsWithMultipleResponses } from "socket.io/dist/typed-events";

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

// {

//     public targetRelevant(obj: NetObj): BroadcastOperator<DecorateAcknowledgementsWithMultipleResponses<IGameServerToClientEvents>, IGameSocketData> | GameNetNamespace {
//         if (obj.Rooms.length === 0) return this;
//         else {
//             return this.to(obj.Rooms[0].name);
//         }
//     }
// }

export { syncvar, toServer, toClients };