import { IS_NET_CLIENT, IS_NET_SERVER } from "./GameNet";
import NetObj from "./NetObj";

interface IRpcCallbacks {
    onClientRPC?: (obj: NetObj, methodName: string, args: any[]) => void;
    onServerRPC?: (obj: NetObj, methodName: string, args: any[]) => void;
}

export const rpcCallbacks: IRpcCallbacks = {
    onClientRPC: undefined,
    onServerRPC: undefined
};

export function toServer() {
    return function (classPrototype: any, methodName: any, descriptor: any) {
        const oldMethod = descriptor.value;

        descriptor.value = function (...args: any[]) {
            if (IS_NET_CLIENT) {
                console.log('RPC runnign on client');
                rpcCallbacks.onServerRPC?.(this, methodName, args);
            } else {
                console.log('RPC runnign on server');
                return oldMethod.apply(this, args);
            }
        }
    }
}

export function toClients() {
    return function (classPrototype: any, methodName: any, descriptor: any) {
        const oldMethod = descriptor.value;

        descriptor.value = function (...args: any[]) {
            if (IS_NET_SERVER) {
                rpcCallbacks.onClientRPC?.(this, methodName, args);
            } else {
                return oldMethod.apply(this, args);
            }
        }
    }
} 