import NetObj from "./NetObj";
import NetWorld from "./NetWorld";

export default class NetRoom {

    protected _netObjects: NetObj[] = [];
    public get NetObjects(): NetObj[] { return this.NetObjects; }

    public constructor(public readonly Name: string, public readonly World: NetWorld) { }

    public Add(obj: NetObj) {
        console.log(`${obj.Id} added to room ${this.Name}`);
        obj.Rooms.push(this);
        this._netObjects.push(obj);
    }

    public Remove(obj: NetObj) {
        console.log(`${obj.Id} removed from room ${this.Name}`);
        obj.Rooms.splice(obj.Rooms.indexOf(this), 1);
        this._netObjects.splice(this._netObjects.indexOf(obj), 1);
    }

    public Spawn<T extends NetObj>(type: { new(world: NetWorld, id?: string): T; }, id?: string): T {
        const obj = this.World.Spawn(type, id);
        this.Add(obj);
        return obj;
    }

}