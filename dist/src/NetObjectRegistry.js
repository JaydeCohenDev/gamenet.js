"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetNetObjType = void 0;
const registeredNetObjects = {};
function RegisterNetObj(type) {
    if (registeredNetObjects[type.name])
        return;
    registeredNetObjects[type.name] = type;
    console.log(`Registered NetObj: ${type.name}`);
}
exports.default = RegisterNetObj;
function GetNetObjType(typeName) {
    return registeredNetObjects[typeName];
}
exports.GetNetObjType = GetNetObjType;
