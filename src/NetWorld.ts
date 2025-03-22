import NetObj from "./NetObj";

export default class NetWorld {

    public onObjectSpawned: ((obj: NetObj) => void)[] = [];
    public onObjectDestroyed: ((obj: NetObj) => void)[] = [];

    protected _netObjects: { [key: string]: NetObj } = {};
    public get NetObjects(): { [key: string]: NetObj } { return this._netObjects; }

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

    public GetAllObjects(): NetObj[] {
        const result: NetObj[] = [];

        for (const id in this._netObjects) {
            const obj = this._netObjects[id];
            result.push(obj);
        }

        return result;
    }

}