import { syncvar, toClients, toServer } from "../src/GameNet";
import NetObj from "../src/NetObj";

export default class TestNetObj extends NetObj {

    @syncvar()
    public myString = "Hello World!";

    @toServer()
    public RPCToServer(test: string): void {
        console.log('hello on server!');
    }

    @toClients()
    public RPCToClients(param: number): void {
        console.log('hello on clients!');
    }

}