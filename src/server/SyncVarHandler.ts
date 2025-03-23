import { GameNetNamespace } from "../GameNet";
import NetObj from "../NetObj";
import { syncVarCallbacks } from "../SyncVar";
import { targetRelevant } from "./ObjectEvents";

export default class SyncVarHandler {

    public constructor(protected _gameSocket: GameNetNamespace) {

        syncVarCallbacks.onSyncVarChange = (obj, propName, oldValue, newValue) => {

            console.log(`${obj.constructor.name}:${propName} changed from '${oldValue}' to '${newValue}'`);
            const data = (obj as NetObj).Serialize();
            targetRelevant(this._gameSocket, obj).emit("objSync", obj.Id, data);

        }
    }
}