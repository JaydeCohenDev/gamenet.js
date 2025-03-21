import NetObj from "./NetObj";

export default class NetWorld {

    public onObjectSpawned?: (obj: NetObj) => void;
    public onObjectDestroyed?: (obj: NetObj) => void;

    protected _netObjects: { [key: string]: NetObj } = {};
    public get NetObjects(): { [key: string]: NetObj } { return this._netObjects; }

    public Spawn<T extends NetObj>(type: { new(world: NetWorld, id?: string): T; }, id?: string): T {
        let spawnedObj = new type(this, id);
        this._netObjects[spawnedObj.Id] = spawnedObj;

        spawnedObj.OnSpawned();
        spawnedObj.onDestroyed = () => {

            spawnedObj.OnDestroyed();
            delete this._netObjects[spawnedObj.Id];
            this.onObjectDestroyed?.(spawnedObj);

        };

        this.onObjectSpawned?.(spawnedObj);
        return spawnedObj;
    }

}