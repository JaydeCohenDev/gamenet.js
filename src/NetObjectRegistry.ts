import NetObj from "./NetObj";
import NetWorld from "./NetWorld";

const registeredNetObjects: { [typeName: string]: new (world: NetWorld, id?: string) => NetObj } = {};

export default function RegisterNetObj<T extends NetObj>(type: { new(world: NetWorld, id?: string): T; }): void {
    if (registeredNetObjects[type.name]) return;

    registeredNetObjects[type.name] = type;

    console.log(`Registered NetObj: ${type.name}`);
}

export function GetNetObjType(typeName: string): new (world: NetWorld, id?: string) => NetObj {
    return registeredNetObjects[typeName];
}