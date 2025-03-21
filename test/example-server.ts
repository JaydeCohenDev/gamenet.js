import express from 'express';
import { createServer } from 'http'
import { Server } from 'socket.io';
import NetServer from '../src/NetServer';
import TestNetObj from './example-netobj';

const app = express();
const server = createServer(app);
const io = new Server(server);

io.on("connection", (socket) => {
    console.log("a user connected");
});

const gameServer = new NetServer(io);

const testObj = gameServer.DefaultWorld.Spawn(TestNetObj);

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
