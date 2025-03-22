"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncVarCallbacks = void 0;
require("reflect-metadata");
const NetObjectRegistry_1 = __importDefault(require("./NetObjectRegistry"));
exports.syncVarCallbacks = {
    onSyncVarChange: (obj, propName, oldValue, newValue) => { }
};
function syncvar() {
    return (target, propertyName) => {
        const className = Reflect.get(target, 'constructor').name;
        console.log(`${className}:${propertyName}`);
        const syncVars = Reflect.getOwnMetadata('syncvars', target);
        if (syncVars) {
            syncVars.push(propertyName);
        }
        else {
            Reflect.defineMetadata('syncvars', [propertyName], target);
        }
        Reflect.deleteProperty(target, propertyName);
        Reflect.defineProperty(target, propertyName, {
            get: function () {
                return this[`_${propertyName}`];
            },
            set: function (value) {
                var _a;
                const oldVal = this[`_${propertyName}`];
                this[`_${propertyName}`] = value;
                (_a = exports.syncVarCallbacks.onSyncVarChange) === null || _a === void 0 ? void 0 : _a.call(exports.syncVarCallbacks, this, propertyName, oldVal, value);
            }
        });
        (0, NetObjectRegistry_1.default)(target.constructor);
        console.log(Reflect.getOwnMetadata('syncvars', target));
    };
}
exports.default = syncvar;
