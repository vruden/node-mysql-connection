import { Connection, IConfig } from './connection';

const connections = {};

export let createConnection = function (config: IConfig): Connection {
    if (!/^\w+$/.test(config.name)) {
        throw new Error('The name should contain letters, digits and/or underscore characters only.');
    }

    if (connections[config.name]) {
        return connections[config.name];
    }

    return connections[config.name] = new Connection(config);
};

export let getConnection = function (name: string): Connection {
    if (!connections[name]) {
        throw new Error(`Connection ${name} is not initialized.`);
    }

    return connections[name];
};