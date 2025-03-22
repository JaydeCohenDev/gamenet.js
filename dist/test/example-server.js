"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const NetServer_1 = __importDefault(require("../src/NetServer"));
const example_netobj_1 = __importDefault(require("./example-netobj"));
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(server);
io.on("connection", (socket) => {
    console.log("a user connected");
});
const gameServer = new NetServer_1.default(io);
const testObj = gameServer.DefaultWorld.Spawn(example_netobj_1.default);
setTimeout(() => {
    testObj.myString = "testing 123";
    console.log('CALLING RPC');
    testObj.RPCToClients(123);
}, 5000);
app.listen(3037, () => {
    console.log('Server is running on port 3037');
});
// console.log(test.Serialize());
// const sourceData = {
//     myString: "Hello World!",
//     myNum: 123,
//     myBool: true,
//     myArray: [
//         1, 2, "asdf", 2, 3, {
//             ping: 'pong'
//         }
//     ]
// }
// const clientData = {
//     myString: "Hello World!",
//     myNum: 123,
//     myBool: true,
//     myArray: [
//         1, 2, "asdf", 2, 3, {
//             ping: 'pong',
//             pong: 'ping'
//         }
//     ]
// }
// let delta = JD.diff(clientData, sourceData);
// if (delta) {
//     const fixed = JD.applyDiff(clientData, delta);
//     console.log('applying delta: ', delta);
//     console.log('fixed data: ', fixed);
// }
