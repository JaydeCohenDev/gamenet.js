import NetObj from "./NetObj";
import NetRoom from "./NetRoom";

/**
 * Represents a networked world containing network objects and rooms.
 * 
 * The `NetWorld` class manages the lifecycle of network objects (`NetObj`) and rooms (`NetRoom`).
 * It provides methods to spawn and destroy objects, add rooms, and retrieve objects based on type or identifier.
 * 
 * @remarks
 * This class maintains collections of network objects and rooms, and provides events for object spawning and destruction.
 * 
 * @example
 * ```typescript
 * const netWorld = new NetWorld();
 * const room = netWorld.AddRoom('room1');
 * 
 * class MyNetObj extends NetObj {
 *     constructor(world: NetWorld, id?: string) {
 *         super(world, id);
 *     }
 * }
 * 
 * const myObj = netWorld.Spawn(MyNetObj, 'myObjId');
 * ```
 */
export default class NetWorld {

    /**
     * An array of callback functions that are invoked when a new object is spawned in the network world.
     * Each callback function receives a `NetObj` instance representing the spawned object.
     */
    public onObjectSpawned: ((obj: NetObj) => void)[] = [];

    /**
     * An array of callback functions that are invoked when a `NetObj` is destroyed.
     * Each callback function receives the destroyed `NetObj` as an argument.
     */
    public onObjectDestroyed: ((obj: NetObj) => void)[] = [];

    protected _netObjects: { [key: string]: NetObj } = {};

    /**
     * Gets the collection of network objects.
     * 
     * @returns An object where the keys are strings representing the object identifiers
     * and the values are instances of `NetObj`.
     */
    public get NetObjects(): { [key: string]: NetObj } { return this._netObjects; }

    protected _rooms: { [key: string]: NetRoom } = {};

    /**
     * Gets the collection of rooms.
     * 
     * @returns An object where the keys are room identifiers and the values are instances of `NetRoom`.
     */
    public get Rooms(): { [key: string]: NetRoom } { return this.Rooms; }

    /**
     * Adds a new room to the network world.
     * 
     * @param name - The name of the room to be added.
     * @returns The newly created NetRoom instance.
     * @throws Will throw an error if a room with the given name already exists.
     */
    public AddRoom(name: string): NetRoom {
        if (this._rooms[name])
            throw (`unable to create room ${name}. Room already exits!`);

        this._rooms[name] = new NetRoom(name, this);
        return this._rooms[name];
    }

    /**
     * Spawns a new instance of a NetObj-derived class and manages its lifecycle within the NetWorld.
     *
     * @template T - The type of the object to be spawned, which must extend NetObj.
     * @param id - An optional identifier for the spawned object.
     * @returns The newly spawned object of type T.
     *
     * @remarks
     * This method creates a new instance of the specified type, adds it to the internal collection of network objects,
     * and triggers the `OnSpawned` event on the object. It also sets up a destruction callback that triggers the
     * `OnDestroyed` event and removes the object from the internal collection when it is destroyed.
     *
     * @example
     * ```typescript
     * class MyNetObj extends NetObj {
     *     constructor(world: NetWorld, id?: string) {
     *         super(world, id);
     *     }
     * }
     *
     * const netWorld = new NetWorld();
     * const myObj = netWorld.Spawn(MyNetObj, 'myObjId');
     * ```
     */
    public Spawn<T extends NetObj>(type: { new(world: NetWorld, id?: string): T; }, id?: string): T {
        let spawnedObj = new type(this, id);
        this._netObjects[spawnedObj.Id] = spawnedObj;

        spawnedObj.OnSpawned();
        spawnedObj.onDestroyed = () => {

            spawnedObj.OnDestroyed();
            delete this._netObjects[spawnedObj.Id];
            this.onObjectDestroyed.forEach(callback => callback(spawnedObj));

        };

        this.onObjectSpawned.forEach(callback => callback(spawnedObj));
        return spawnedObj;
    }

    /**
     * Retrieves all objects of a specified type from the network objects.
     *
     * @template T - The type of objects to retrieve, extending from NetObj.
     * @returns An array of objects that are instances of the specified type.
     */
    public GetObjectsOfType<T extends NetObj>(type: { new(...args: any[]): T }): T[] {
        const result: T[] = [];

        for (const id in this._netObjects) {
            const obj = this._netObjects[id];
            if (obj instanceof type) {
                result.push(obj as T);
            }
        }

        return result;
    }

    /**
     * Retrieves all network objects in the current world.
     *
     * @returns {NetObj[]} An array of all network objects.
     */
    public GetAllObjects(): NetObj[] {
        const result: NetObj[] = [];

        for (const id in this._netObjects) {
            const obj = this._netObjects[id];
            result.push(obj);
        }

        return result;
    }

}