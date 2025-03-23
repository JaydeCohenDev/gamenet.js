import { GameNetNamespace } from "../GameNet";
import { rpcCallbacks } from "../RPC";
import { targetRelevant } from "./ObjectEvents";

/**
 * Handles Remote Procedure Calls (RPC) for the game server.
 */
export default class RPCHandler {

    /**
     * Constructs an instance of the RPCHandler class.
     * 
     * @param _gameSocket - The GameNetNamespace instance used for handling game socket communications.
     * 
     * The constructor sets up an RPC callback for handling client RPC calls. When a client RPC is received,
     * it logs the RPC details and emits an "emitClientRPC" event to the relevant target.
     */
    public constructor(protected _gameSocket: GameNetNamespace) {

        rpcCallbacks.onClientRPC = (obj, methodName, args) => {

            console.log(`Client RPC: ${obj.Id}.${methodName}(${args.join(", ")})`);
            targetRelevant(this._gameSocket, obj).emit("emitClientRPC", obj.Id, methodName, args);
        }

    }
}