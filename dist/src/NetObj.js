"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
class NetObj {
    get Id() { return this._id; }
    get World() { return this._world; }
    constructor(world, id) {
        this._id = id ? id : (0, uuid_1.v4)();
        this._world = world;
    }
    OnSpawned() { }
    OnDestroyed() { }
    Destroy() {
        var _a;
        (_a = this.onDestroyed) === null || _a === void 0 ? void 0 : _a.call(this);
    }
    Serialize() {
        const syncVarNames = Reflect.getOwnMetadata('syncvars', Reflect.getPrototypeOf(this));
        return {
            vars: syncVarNames.map((name) => {
                return {
                    name,
                    value: this[name]
                };
            })
        };
    }
    Deserialize(data) {
        const syncVarNames = Reflect.getOwnMetadata('syncvars', Reflect.getPrototypeOf(this));
        syncVarNames.forEach((name) => {
            this[name] = data.vars.find((v) => v.name === name).value;
        });
    }
}
exports.default = NetObj;
