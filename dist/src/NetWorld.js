"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class NetWorld {
    constructor() {
        this._netObjects = {};
    }
    get NetObjects() { return this._netObjects; }
    Spawn(type, id) {
        var _a;
        let spawnedObj = new type(this, id);
        this._netObjects[spawnedObj.Id] = spawnedObj;
        spawnedObj.OnSpawned();
        spawnedObj.onDestroyed = () => {
            var _a;
            spawnedObj.OnDestroyed();
            delete this._netObjects[spawnedObj.Id];
            (_a = this.onObjectDestroyed) === null || _a === void 0 ? void 0 : _a.call(this, spawnedObj);
        };
        (_a = this.onObjectSpawned) === null || _a === void 0 ? void 0 : _a.call(this, spawnedObj);
        return spawnedObj;
    }
}
exports.default = NetWorld;
