import { GameNetNamespace } from "../GameNet";
import { rpcCallbacks } from "../RPC";
import { targetRelevant } from "./ObjectEvents";

export default class RPCHandler {

    public constructor(protected _gameSocket: GameNetNamespace) {

        rpcCallbacks.onClientRPC = (obj, methodName, args) => {

            console.log(`Client RPC: ${obj.Id}.${methodName}(${args.join(", ")})`);
            targetRelevant(this._gameSocket, obj).emit("emitClientRPC", obj.Id, methodName, args);
        }

    }
}