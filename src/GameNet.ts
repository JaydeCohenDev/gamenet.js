import syncvar from "./SyncVar";
import { toServer, toClients } from "./RPC";

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

export { syncvar, toServer, toClients };