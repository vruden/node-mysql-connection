import { EventEmitter } from 'events';
import * as mysql from 'mysql';
import * as _ from 'lodash';

export interface IConfig {
    connection: mysql.IConnectionConfig;
    name?: string;
    customFormat?: boolean;
    /**
     * Do you want console.log's about what the program is doing?
     */
    verbose?: boolean;

    /**
     * Time To Live for a cache key in seconds (0 = infinite)
     */
    TTL?: number;

    /**
     * Do you want to use SELECT SQL caching?
     */
    caching?: boolean;
}

interface IQueryCallback {
    (err: mysql.IError, results?: any, fields?: mysql.IFieldInfo[], sql?: string): void;
}

interface IQueryFunction {
    (sql: string): mysql.IQuery;
    (sql: string, callback: IQueryCallback): mysql.IQuery;
    (sql: string, values: any[]): mysql.IQuery;
    (sql: string, values: any[], callback: IQueryCallback): mysql.IQuery;
    (sql: string, values: any): mysql.IQuery;
    (sql: string, values: any, callback: IQueryCallback): mysql.IQuery;
}

interface IConnection {
    getConfig(): IConfig;
    getPool(): mysql.IPool;
    query: IQueryFunction;
}

export class Connection extends EventEmitter implements IConnection {
    private pool: mysql.IPool;
    private config: IConfig;

    constructor(config: IConfig) {
        super();

        if (config.customFormat) {
            config.connection.queryFormat = this.customFormat;
        }

        this.config = config;

        this.pool = mysql.createPool(config.connection);

        if (config.verbose) {
            console.log(`Initialize ${config.name} connection`);
        }
    }

    private customFormat(query, values) {
        if (!values) return query;
        return query.replace(/\:\:(\w+)/g, function (txt, key) {
            if (values.hasOwnProperty(key)) {
                return this.escapeId(values[key]);
            }
            return txt;
        }.bind(this)).replace(/\:(\w+)/g, function (txt, key) {
            if (values.hasOwnProperty(key)) {
                return this.escape(values[key]);
            }
            return txt;
        }.bind(this));
    }

    getConfig() {
        return this.config;
    }

    getPool() {
        return this.pool;
    }

    query(sql: string): mysql.IQuery;
    query(sql: string, callback: IQueryCallback): mysql.IQuery;
    query(sql: string, values: any[]): mysql.IQuery;
    query(sql: string, values: any[], callback: IQueryCallback): mysql.IQuery;
    query(sql: string, values: any): mysql.IQuery;
    query(sql: string, values: any = undefined, callback?: IQueryCallback): mysql.IQuery {
        if (_.isFunction(values)) {
            callback = values;
            values = undefined;
        }

        const query = this.pool.query(sql, values, function (err, results, fields) {
            if (err) {
                // err.queryString = query.sql;
            }

            callback && callback(err, results, fields, query.sql);
        });

        return query;
    }
}