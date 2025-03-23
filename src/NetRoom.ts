import NetObj from "./NetObj";
import NetWorld from "./NetWorld";

/**
 * Represents a networked room that can contain multiple network objects (NetObj).
 * Provides methods to add, remove, and spawn network objects within the room.
 * 
 * @class NetRoom
 * @export
 */
export default class NetRoom {

    protected _netObjects: NetObj[] = [];
    /**
     * Gets the array of NetObj instances.
     * 
     * @returns {NetObj[]} An array of NetObj instances.
     */
    public get NetObjects(): NetObj[] { return this.NetObjects; }

    /**
     * Creates an instance of NetRoom.
     * 
     * @param Name - The name of the room.
     * @param World - The world associated with the room.
     */
    public constructor(public readonly Name: string, public readonly World: NetWorld) { }

    /**
     * Adds a NetObj to the current NetRoom.
     * 
     * @param {NetObj} obj - The network object to be added to the room.
     * @returns {void}
     */
    public Add(obj: NetObj) {
        console.log(`${obj.Id} added to room ${this.Name}`);
        obj.Rooms.push(this);
        this._netObjects.push(obj);
    }

    /**
     * Removes the specified NetObj from the current NetRoom.
     * 
     * @param {NetObj} obj - The object to be removed from the room.
     */
    public Remove(obj: NetObj) {
        console.log(`${obj.Id} removed from room ${this.Name}`);
        obj.Rooms.splice(obj.Rooms.indexOf(this), 1);
        this._netObjects.splice(this._netObjects.indexOf(obj), 1);
    }


    /**
     * Spawns a new object of the specified type within the NetRoom.
     *
     * @template T - The type of the object to be spawned, which extends NetObj.
     * @param type - The constructor of the object to be spawned. It should accept a NetWorld and an optional id as parameters.
     * @param id - An optional identifier for the object to be spawned.
     * @returns The newly spawned object of type T.
     */
    public Spawn<T extends NetObj>(type: { new(world: NetWorld, id?: string): T; }, id?: string): T {
        const obj = this.World.Spawn(type, id);
        this.Add(obj);
        return obj;
    }

}