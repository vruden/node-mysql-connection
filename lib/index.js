"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const connection_1 = require("./connection");
const connections = {};
exports.createConnection = function (config) {
    if (!/^\w+$/.test(config.name)) {
        throw new Error('The name should contain letters, digits and/or underscore characters only.');
    }
    if (connections[config.name]) {
        return connections[config.name];
    }
    return connections[config.name] = new connection_1.Connection(config);
};
exports.getConnection = function (name) {
    if (!connections[name]) {
        throw new Error(`Connection ${name} is not initialized.`);
    }
    return connections[name];
};
//# sourceMappingURL=index.js.map