// @ts-nocheck
/**
 * Environment detection utility using CommonJS
 */

/**
 * Checks if code is running in a Node.js environment
 */
function isNodeJS() {
    try {
        return typeof process !== 'undefined' &&
            process.versions != null &&
            process.versions.node != null;
    } catch (e) {
        return false;
    }
}

/**
 * Checks if code is running in a browser environment
 */
function isBrowser() {
    return typeof window !== 'undefined' && typeof document !== 'undefined';
}

/**
 * Gets the current runtime environment as a string
 */
function getRuntimeEnvironment() {
    if (isNodeJS()) return 'node';
    if (isBrowser()) return 'browser';
    return 'unknown';
}

// Create constants
const IS_NODE = isNodeJS();
const IS_BROWSER = isBrowser();

// Network environment indicators
const IS_NET_SERVER = IS_NODE;
const IS_NET_CLIENT = IS_BROWSER;

console.log(`Environment detected: ${getRuntimeEnvironment()}`);
console.log(`IS_NET_SERVER: ${IS_NET_SERVER}, IS_NET_CLIENT: ${IS_NET_CLIENT}`);

// CommonJS exports
module.exports = {
    isNodeJS,
    isBrowser,
    getRuntimeEnvironment,
    IS_NODE,
    IS_BROWSER,
    IS_NET_SERVER,
    IS_NET_CLIENT
};