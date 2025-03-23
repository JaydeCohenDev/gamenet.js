import { v4 } from "uuid";
import NetWorld from "./NetWorld";
import NetRoom from "./NetRoom";

/**
 * Represents a network object within a NetWorld.
 * 
 * @remarks
 * This class provides the basic structure and functionality for network objects,
 * including unique identification, association with a NetWorld, room management,
 * and lifecycle methods such as spawning and destruction.
 * 
 * @example
 * ```typescript
 * const netWorld = new NetWorld();
 * const netObj = new NetObj(netWorld);
 * netObj.onDestroyed = () => console.log('Object destroyed');
 * netObj.Destroy(); // Logs 'Object destroyed'
 * ```
 */
export default class NetObj {
    /**
     * Optional callback function that is invoked when the object is destroyed.
     */
    public onDestroyed?: () => void;

    protected _id: string;
    /**
     * Gets the unique identifier of the network object.
     * 
     * @returns {string} The unique identifier of the network object.
     */
    public get Id(): string { return this._id; }

    protected _world: NetWorld;
    /**
     * Gets the NetWorld instance associated with this object.
     * 
     * @returns {NetWorld} The NetWorld instance.
     */
    public get World(): NetWorld { return this._world; }

    /**
     * An array of NetRoom objects representing the rooms.
     */
    public Rooms: NetRoom[] = [];

    /**
     * Creates an instance of NetObj.
     * 
     * @param world - The NetWorld instance to which this object belongs.
     * @param id - An optional unique identifier for the object. If not provided, a new UUID will be generated.
     */
    constructor(world: NetWorld, id?: string) {
        this._id = id ? id : v4();
        this._world = world;
    }

    /**
     * This method is called when the object is spawned.
     * Override this method to add custom behavior when the object is created.
     */
    public OnSpawned(): void { }

    /**
     * This method is called when the object is destroyed.
     * Override this method to implement custom destruction logic.
     */
    public OnDestroyed(): void { }


    /**
     * Destroys the object and triggers the `onDestroyed` callback if it is defined.
     * 
     * @remarks
     * This method should be called when the object is no longer needed and should be cleaned up.
     * 
     * @example
     * ```typescript
     * const netObj = new NetObj();
     * netObj.onDestroyed = () => console.log('Object destroyed');
     * netObj.Destroy(); // Logs 'Object destroyed'
     * ```
     */
    public Destroy(): void {
        this.onDestroyed?.();
    }

    /**
     * Serializes the current object by extracting the values of properties
     * marked with the 'syncvars' metadata key.
     *
     * @returns An object containing the serialized properties and their values.
     */
    public Serialize(): {} {
        const syncVarNames = Reflect.getOwnMetadata('syncvars', Reflect.getPrototypeOf(this)!);
        return {
            vars: syncVarNames.map((name: string) => {
                return {
                    name,
                    value: (this as any)[name]
                }
            })
        };
    }

    /**
     * Deserializes the provided data and assigns the values to the corresponding synchronized variables.
     *
     * @param data - The data object containing the serialized values.
     * @remarks
     * This method uses reflection to get the names of the synchronized variables (syncvars) and assigns
     * the corresponding values from the provided data object to the instance's properties.
     */
    public Deserialize(data: any): void {
        const syncVarNames = Reflect.getOwnMetadata('syncvars', Reflect.getPrototypeOf(this)!);
        syncVarNames.forEach((name: string) => {
            (this as any)[name] = data.vars.find((v: any) => v.name === name).value;
        });
    }
}