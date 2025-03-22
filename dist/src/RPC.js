"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toClients = exports.toServer = exports.rpcCallbacks = void 0;
const GameNet_1 = require("./GameNet");
exports.rpcCallbacks = {
    onClientRPC: undefined,
    onServerRPC: undefined
};
function toServer() {
    return function (classPrototype, methodName, descriptor) {
        const oldMethod = descriptor.value;
        descriptor.value = function (...args) {
            var _a;
            if (GameNet_1.IS_NET_CLIENT) {
                (_a = exports.rpcCallbacks.onServerRPC) === null || _a === void 0 ? void 0 : _a.call(exports.rpcCallbacks, this._id, methodName, args);
            }
            else {
                return oldMethod.apply(this, ...args);
            }
        };
    };
}
exports.toServer = toServer;
function toClients() {
    return function (classPrototype, methodName, descriptor) {
        const oldMethod = descriptor.value;
        descriptor.value = function (...args) {
            var _a;
            if (GameNet_1.IS_NET_SERVER) {
                (_a = exports.rpcCallbacks.onClientRPC) === null || _a === void 0 ? void 0 : _a.call(exports.rpcCallbacks, this._id, methodName, args);
            }
            else {
                return oldMethod.apply(this, ...args);
            }
        };
    };
}
exports.toClients = toClients;
