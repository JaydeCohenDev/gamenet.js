import { v4 } from "uuid";
import NetWorld from "./NetWorld";
import NetRoom from "./NetRoom";

export default class NetObj {
    public onDestroyed?: () => void;

    protected _id: string;
    public get Id(): string { return this._id; }

    protected _world: NetWorld;
    public get World(): NetWorld { return this._world; }

    public Rooms: NetRoom[] = [];

    constructor(world: NetWorld, id?: string) {
        this._id = id ? id : v4();
        this._world = world;
    }

    public OnSpawned(): void { }
    public OnDestroyed(): void { }

    public Destroy(): void {
        this.onDestroyed?.();
    }

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

    public Deserialize(data: any): void {
        const syncVarNames = Reflect.getOwnMetadata('syncvars', Reflect.getPrototypeOf(this)!);
        syncVarNames.forEach((name: string) => {
            (this as any)[name] = data.vars.find((v: any) => v.name === name).value;
        });
    }
}