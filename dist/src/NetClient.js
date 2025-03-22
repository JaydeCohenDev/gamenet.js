"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const NetWorld_1 = __importDefault(require("./NetWorld"));
const NetObjectRegistry_1 = require("./NetObjectRegistry");
const RPC_1 = require("./RPC");
class NetClient {
    get World() { return this._world; }
    constructor(io) {
        this._world = new NetWorld_1.default();
        RPC_1.rpcCallbacks.onServerRPC = (objId, methodName, args) => {
            io.emit("emitServerRPC", objId, methodName, args);
        };
        io.on("connect", () => {
            console.log("Connected to server!");
        });
        io.on("disconnect", () => {
            console.log("Disconnected from server!");
        });
        io.on("objSpawned", (id, typeName, data) => {
            const netObj = (0, NetObjectRegistry_1.GetNetObjType)(typeName);
            this._world.Spawn(netObj, id).Deserialize(data);
        });
        io.on("objDestroyed", (id) => {
            this._world.NetObjects[id].Destroy();
        });
        io.on("objSync", (id, data) => {
            this._world.NetObjects[id].Deserialize(data);
        });
        io.on("emitClientRPC", (objId, methodName, args) => {
            const obj = this._world.NetObjects[objId];
            if (!obj)
                return;
            obj[methodName](...args);
        });
    }
}
exports.default = NetClient;
