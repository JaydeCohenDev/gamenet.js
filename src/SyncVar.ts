
import 'reflect-metadata';
import RegisterNetObj from './NetObjectRegistry';

export const syncVarCallbacks = {
    onSyncVarChange: (obj: any, propName: string, oldValue: any, newValue: any) => { }
};

/**
 * A decorator function to synchronize a class property with metadata and handle property changes.
 *
 * This function is used to decorate a class property and manage its synchronization state.
 * It logs the class name and property name, maintains a list of synchronized variables,
 * and sets up getter and setter methods to handle property changes.
 *
 * @example
 * ```typescript
 * class MyClass {
 *     @syncvar()
 *     myProperty: string;
 * }
 * ```
 */
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

        const initialValue = target[propertyName];

        Reflect.deleteProperty(target, propertyName);

        Reflect.defineProperty(target, propertyName, {
            get: function () {
                return this[`_${propertyName}`];
            },
            set: function (value: any) {
                const oldVal = this[`_${propertyName}`];
                this[`_${propertyName}`] = value;

                const metadataKey = `_initialized_${propertyName}`;

                const isInitialized = Reflect.hasMetadata(metadataKey, this);

                if (isInitialized) {
                    syncVarCallbacks.onSyncVarChange?.(this, propertyName, oldVal, value);
                } else {
                    Reflect.defineMetadata(metadataKey, true, this);
                }

            }
        });



        RegisterNetObj(target.constructor);

        console.log(Reflect.getOwnMetadata('syncvars', target));
    }
} 