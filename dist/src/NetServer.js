"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const NetWorld_1 = __importDefault(require("./NetWorld"));
const SyncVar_1 = require("./SyncVar");
const RPC_1 = require("./RPC");
class NetServer {
    get DefaultWorld() { return this._defaultWorld; }
    constructor(io) {
        this._gameSocket = io.of('/game');
        this._gameSocket.on("connection", (socket) => {
            socket.on("disconnect", () => {
            });
            socket.on("emitServerRPC", (objId, methodName, args) => {
                console.log(`Server RPC: ${objId}.${methodName}(${args.join(", ")})`);
                const obj = this._defaultWorld.NetObjects[objId];
                if (!obj)
                    return;
                obj[methodName](...args);
            });
        });
        SyncVar_1.syncVarCallbacks.onSyncVarChange = (obj, propName, oldValue, newValue) => {
            //console.log(`${obj.constructor.name}:${propName} changed from ${oldValue} to ${newValue}`);
            const data = obj.Serialize();
            this._gameSocket.volatile.emit("objSync", obj.Id, data);
        };
        RPC_1.rpcCallbacks.onClientRPC = (objId, methodName, args) => {
            console.log(`Client RPC: ${objId}.${methodName}(${args.join(", ")})`);
            this._gameSocket.volatile.emit("emitClientRPC", objId, methodName, args);
        };
        this._defaultWorld = new NetWorld_1.default();
        this._defaultWorld.onObjectSpawned = (obj) => {
            this._gameSocket.volatile.emit("objSpawned", obj.Id, "TestObj", { test: "data" });
        };
        this._defaultWorld.onObjectDestroyed = (obj) => {
            this._gameSocket.volatile.emit("objDestroyed", obj.Id);
        };
    }
}
exports.default = NetServer;
