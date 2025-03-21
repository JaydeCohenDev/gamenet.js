
import 'reflect-metadata';
import RegisterNetObj from './NetObjectRegistry';

export const syncVarCallbacks = {
    onSyncVarChange: (obj: any, propName: string, oldValue: any, newValue: any) => { }
};

export default function syncvar() {
    return (target: any, propertyName: any) => {
        const className: string = Reflect.get(target, 'constructor').name;
        console.log(`${className}:${propertyName}`);

        const syncVars = Reflect.getOwnMetadata('syncvars', target);
        if (syncVars) {
            syncVars.push(propertyName);
        } else {
            Reflect.defineMetadata('syncvars', [propertyName], target);
        }

        Reflect.deleteProperty(target, propertyName);

        Reflect.defineProperty(target, propertyName, {
            get: function () {
                return this[`_${propertyName}`];
            },
            set: function (value: any) {
                const oldVal = this[`_${propertyName}`];
                this[`_${propertyName}`] = value;
                syncVarCallbacks.onSyncVarChange?.(this, propertyName, oldVal, value);
            }
        });



        RegisterNetObj(target.constructor);

        console.log(Reflect.getOwnMetadata('syncvars', target));
    }
} 