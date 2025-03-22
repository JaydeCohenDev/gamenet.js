"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toClients = exports.toServer = exports.syncvar = exports.IS_NET_CLIENT = exports.IS_NET_SERVER = void 0;
const SyncVar_1 = __importDefault(require("./SyncVar"));
exports.syncvar = SyncVar_1.default;
const RPC_1 = require("./RPC");
Object.defineProperty(exports, "toServer", { enumerable: true, get: function () { return RPC_1.toServer; } });
Object.defineProperty(exports, "toClients", { enumerable: true, get: function () { return RPC_1.toClients; } });
exports.IS_NET_SERVER = true;
exports.IS_NET_CLIENT = false;
