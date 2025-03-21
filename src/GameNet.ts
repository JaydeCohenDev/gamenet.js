import syncvar from "./SyncVar";
import { toServer, toClients } from "./RPC";

export let IS_NET_SERVER = true;
export let IS_NET_CLIENT = false;

export { syncvar, toServer, toClients };