export interface IGameServerToClientEvents {
    objSpawned: (objId: string, objType: string, objData: any) => void;
    objDestroyed: (objId: string) => void;
    objSync: (objId: string, objData: any) => void;
    emitClientRPC: (objId: string, methodName: string, args: any[]) => void;
}

export interface IGameClientToServerEvents {
    emitServerRPC: (objId: string, methodName: string, args: any[]) => void;
}

export interface IGameInterServerEvents {

}

export interface IGameSocketData {

}