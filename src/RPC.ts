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

/**
 * A decorator function that modifies a method to handle remote procedure calls (RPC).
 * When the method is called, it checks if the code is running on a client or server.
 * If running on a client, it triggers the `onServerRPC` callback with the method details.
 * If running on a server, it executes the original method.
 */
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

/**
 * A decorator function that modifies a method to handle RPC (Remote Procedure Call) logic.
 * 
 * When applied to a method, it intercepts the method call and performs different actions
 * based on whether the code is running on a server or a client.
 * 
 * - On the server (`IS_NET_SERVER` is true), it triggers the `onClientRPC` callback with the
 *   current instance, method name, and arguments.
 * - On the client (`IS_NET_SERVER` is false), it executes the original method with the provided arguments.
 */
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