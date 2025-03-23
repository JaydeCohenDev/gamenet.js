import { GameNetNamespace } from "../GameNet";
import { rpcCallbacks } from "../RPC";

export default class RPCHandler {

    public constructor(protected _gameSocket: GameNetNamespace) {

        rpcCallbacks.onClientRPC = (objId, methodName, args) => {

            console.log(`Client RPC: ${objId}.${methodName}(${args.join(", ")})`);
            this._gameSocket.volatile.emit("emitClientRPC", objId, methodName, args);

        }

    }
}