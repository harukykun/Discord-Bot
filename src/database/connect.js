const { Sequelize, DataTypes, Op } = require('sequelize');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

let sequelize = null;
const modelRegistry = {};

const MAX_RETRIES = 5;
const BASE_DELAY_MS = 3000;

/**
 * Creates a Sequelize instance and connects to PostgreSQL.
 * Retries up to MAX_RETRIES times with exponential backoff.
 * Called from bot.js on startup.
 */
async function connect() {
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
            console.log(chalk.blue(chalk.bold(`Database`)), (chalk.white(`>>`)), chalk.red(`PostgreSQL`), chalk.green(`is connecting... (attempt ${attempt}/${MAX_RETRIES})`));

            sequelize = new Sequelize(process.env.DATABASE_URL, {
                dialect: 'postgres',
                logging: false,
                pool: {
                    max: 5,
                    min: 0,
                    acquire: 30000,
                    idle: 10000,
                },
                retry: {
                    max: 3,
                },
                dialectOptions: {
                    ssl: process.env.DATABASE_SSL === 'false' ? false : {
                        require: true,
                        rejectUnauthorized: false
                    }
                },
                define: {
                    freezeTableName: true,
                    timestamps: false
                }
            });

            await sequelize.authenticate();
            console.log(chalk.blue(chalk.bold(`Database`)), (chalk.white(`>>`)), chalk.red(`PostgreSQL`), chalk.green(`is ready!`));

            // Load all models from models directory to ensure they are registered
            const modelsDir = path.join(__dirname, 'models');
            if (fs.existsSync(modelsDir)) {
                fs.readdirSync(modelsDir).forEach(file => {
                    if (file.endsWith('.js')) {
                        require(path.join(modelsDir, file));
                    }
                });
            }

            // Initialize all registered models
            for (const [name, modelDef] of Object.entries(modelRegistry)) {
                if (!modelDef._initialized) {
                    modelDef._initModel(sequelize);
                }
            }

            // Sync all models with database (creates tables if not exist)
            await sequelize.sync({ alter: false });
            console.log(chalk.blue(chalk.bold(`Database`)), (chalk.white(`>>`)), chalk.red(`PostgreSQL`), chalk.green(`tables synced!`));

            // Start periodic health check to auto-reconnect if DB goes down
            startHealthCheck();

            return;

        } catch (err) {
            console.log(chalk.red(`[ERROR]`), chalk.white(`>>`), chalk.red(`PostgreSQL`), chalk.white(`>>`), chalk.red(`Failed to connect (attempt ${attempt}/${MAX_RETRIES})`), chalk.white(`>>`), chalk.red(`Error: ${err.message || err}`));

            if (attempt < MAX_RETRIES) {
                const delay = BASE_DELAY_MS * Math.pow(2, attempt - 1);
                console.log(chalk.yellow(`Retrying in ${delay / 1000}s...`));
                await new Promise(resolve => setTimeout(resolve, delay));
            } else {
                console.log(chalk.red(`[FATAL] All ${MAX_RETRIES} connection attempts failed. Bot will continue WITHOUT database.`));
                console.log(chalk.red(`Database features will be unavailable until connection is restored.`));
                // Do NOT process.exit — let the bot run without DB so Discord stays online
                // The health check will keep trying to reconnect
                startHealthCheck();
            }
        }
    }
}

/**
 * Periodically checks database connectivity and reconnects if needed.
 */
let healthCheckInterval = null;
function startHealthCheck() {
    if (healthCheckInterval) return; // Already running

    healthCheckInterval = setInterval(async () => {
        if (!sequelize) return;
        try {
            await sequelize.authenticate();
        } catch (err) {
            console.log(chalk.yellow(`[DB Health] Connection lost, attempting to reconnect...`));
            try {
                await sequelize.authenticate();
                console.log(chalk.green(`[DB Health] Reconnected successfully!`));
            } catch (retryErr) {
                console.log(chalk.red(`[DB Health] Reconnection failed: ${retryErr.message || retryErr}`));
            }
        }
    }, 60000); // Check every 60 seconds
}

/**
 * Get the Sequelize instance
 */
function getSequelize() {
    return sequelize;
}

/**
 * Wraps a Sequelize instance to provide a data object 
 * that behaves like a Mongoose document (with .save(), direct property access, etc.)
 */
function wrapInstance(instance) {
    if (!instance) return null;

    const handler = {
        get(target, prop) {
            // Special methods
            if (prop === 'save') {
                return async function () {
                    // Sync all changed values back to the instance
                    const rawData = target._changedProps || {};
                    for (const [key, value] of Object.entries(rawData)) {
                        target._instance.set(key, value);
                        if (typeof target._instance.changed === 'function') {
                            target._instance.changed(key, true);
                        }
                    }
                    await target._instance.save();
                    // Update internal data
                    const vals = target._instance.get({ plain: true });
                    for (const key of Object.keys(vals)) {
                        target._data[key] = vals[key];
                    }
                    target._changedProps = {};
                    return target._proxy;
                };
            }

            if (prop === 'deleteOne' || prop === 'remove' || prop === 'delete') {
                return async function () {
                    await target._instance.destroy();
                    return target._proxy;
                };
            }

            if (prop === 'toObject' || prop === 'toJSON') {
                return function () {
                    return { ...target._data, ...(target._changedProps || {}) };
                };
            }

            if (prop === '_id' || prop === 'id') {
                return target._data.id;
            }

            if (prop === '_instance') {
                return target._instance;
            }

            if (prop === '_proxy') {
                return target._proxy;
            }

            if (prop === 'markModified') {
                return function () { }; // no-op for compatibility
            }

            // Check changed props first
            if (target._changedProps && prop in target._changedProps) {
                return target._changedProps[prop];
            }

            // Then check data
            if (prop in target._data) {
                return target._data[prop];
            }

            // Check if it's a Sequelize instance method
            if (target._instance && typeof target._instance[prop] === 'function') {
                return target._instance[prop].bind(target._instance);
            }

            return undefined;
        },

        set(target, prop, value) {
            if (!target._changedProps) target._changedProps = {};
            target._changedProps[prop] = value;
            target._data[prop] = value;
            // Also set on the instance directly
            if (target._instance) {
                try {
                    target._instance.set(prop, value);
                    if (typeof target._instance.changed === 'function') {
                        target._instance.changed(prop, true);
                    }
                } catch (e) {
                    // Ignore if not a valid attribute
                }
            }
            return true;
        }
    };

    const data = instance.get({ plain: true });
    const target = {
        _instance: instance,
        _data: data,
        _changedProps: {},
        _proxy: null
    };

    const proxy = new Proxy(target, handler);
    target._proxy = proxy;
    return proxy;
}

/**
 * Convert Mongoose-style sort array to Sequelize order
 * Mongoose: .sort([['Money', 'descending']])
 * Sequelize: [['Money', 'DESC']]
 */
function convertSort(sort) {
    if (!sort) return undefined;
    if (Array.isArray(sort)) {
        return sort.map(s => {
            if (Array.isArray(s)) {
                const dir = s[1] === 'descending' || s[1] === 'desc' || s[1] === -1 ? 'DESC' : 'ASC';
                return [s[0], dir];
            }
            return s;
        });
    }
    // Object format: { field: -1 } or { field: 1 }
    if (typeof sort === 'object') {
        return Object.entries(sort).map(([key, value]) => {
            const dir = value === -1 || value === 'descending' || value === 'desc' ? 'DESC' : 'ASC';
            return [key, dir];
        });
    }
    return undefined;
}

/**
 * Convert Mongoose-style query to Sequelize where clause.
 * Handles simple key-value pairs and MongoDB comparison operators.
 */
function convertQuery(query) {
    if (!query) return {};
    const where = {};
    for (const [key, value] of Object.entries(query)) {
        const fieldName = key === '_id' ? 'id' : key;

        if (value !== null && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
            // Check for MongoDB operators
            const opMap = {
                '$lt': Op.lt,
                '$gt': Op.gt,
                '$lte': Op.lte,
                '$gte': Op.gte,
                '$ne': Op.ne,
                '$in': Op.in,
                '$nin': Op.notIn,
            };

            const conditions = {};
            let hasOperators = false;
            for (const [opKey, opValue] of Object.entries(value)) {
                if (opMap[opKey]) {
                    conditions[opMap[opKey]] = opValue;
                    hasOperators = true;
                }
            }

            if (hasOperators) {
                where[fieldName] = conditions;
            } else {
                where[fieldName] = value;
            }
        } else {
            where[fieldName] = value;
        }
    }
    return where;
}

/**
 * Creates a model wrapper that provides Mongoose-compatible API
 * but uses Sequelize under the hood.
 */
function createModel(modelDef) {
    const wrapper = {
        _model: null,
        _initialized: false,
        _modelDef: modelDef,

        _initModel(seq) {
            if (this._initialized) return;
            this._model = seq.define(modelDef.name, modelDef.fields, {
                tableName: modelDef.name,
                timestamps: false,
                freezeTableName: true,
                ...(modelDef.options || {})
            });
            this._initialized = true;
        },

        /**
         * Mongoose-compatible findOne
         */
        findOne(query, callback) {
            const where = convertQuery(query);
            const self = this;

            const chainable = {
                async exec() {
                    if (!self._model) {
                        console.warn(`[WARN] findOne() called before model ${self._modelDef.name} was initialized!`);
                        return null;
                    }
                    const result = await self._model.findOne({ where });
                    return wrapInstance(result);
                },
                async then(resolve, reject) {
                    try {
                        const result = await chainable.exec();
                        if (callback) callback(null, result);
                        resolve(result);
                    } catch (err) {
                        if (callback) callback(err, null);
                        if (reject) reject(err);
                        else throw err;
                    }
                },
                [Symbol.toStringTag]: 'Promise',
                catch(fn) {
                    return chainable.then(undefined, fn);
                }
            };

            if (callback) {
                chainable.exec().then(res => callback(null, res)).catch(err => callback(err, null));
            }

            return chainable;
        },

        /**
         * Mongoose-compatible find - returns a chainable query-like object
         */
        find(query) {
            const where = query ? convertQuery(query) : {};
            const self = this;
            let _sort = null;
            let _limit = null;

            const chainable = {
                sort(sortArg) {
                    _sort = sortArg;
                    return chainable;
                },
                limit(n) {
                    _limit = n;
                    return chainable;
                },
                lean() {
                    // In Sequelize, plain objects are returned via get({plain: true})
                    // We'll handle this in exec/then
                    chainable._lean = true;
                    return chainable;
                },
                _lean: false,
                async exec() {
                    if (!self._model) {
                        console.warn(`[WARN] find() called before model ${self._modelDef.name} was initialized!`);
                        return [];
                    }
                    const options = { where };
                    if (_sort) options.order = convertSort(_sort);
                    if (_limit) options.limit = _limit;
                    const results = await self._model.findAll(options);
                    if (chainable._lean) {
                        return results.map(r => r.get({ plain: true }));
                    }
                    return results.map(r => wrapInstance(r));
                },
                async then(resolve, reject) {
                    try {
                        const result = await chainable.exec();
                        resolve(result);
                    } catch (err) {
                        if (reject) reject(err);
                        else throw err;
                    }
                },
                // Make it awaitable
                [Symbol.toStringTag]: 'Promise',
                catch(fn) {
                    return chainable.then(undefined, fn);
                }
            };
            return chainable;
        },

        /**
         * Create a new document (Mongoose-compatible)
         */
        async create(data) {
            const result = await this._model.create(data);
            return wrapInstance(result);
        },

        /**
         * Mongoose-compatible findOneAndUpdate
         */
        async findOneAndUpdate(query, update, options) {
            const where = convertQuery(query);
            const upsert = options && options.upsert;
            const returnNew = options && (options.new || options.returnDocument === 'after');

            let instance = await this._model.findOne({ where });

            if (!instance && upsert) {
                // Create new record with query + update data
                const createData = { ...query, ...update };
                // Handle $set, $inc, etc.
                if (update.$set) Object.assign(createData, update.$set);
                if (update.$inc) {
                    for (const [key, val] of Object.entries(update.$inc)) {
                        createData[key] = val;
                    }
                }
                delete createData.$set;
                delete createData.$inc;
                delete createData.$push;
                delete createData.$pull;
                instance = await this._model.create(createData);
                return wrapInstance(instance);
            }

            if (!instance) return null;

            // Handle MongoDB update operators
            const updateData = {};
            if (update.$set) {
                Object.assign(updateData, update.$set);
            }
            if (update.$inc) {
                for (const [key, val] of Object.entries(update.$inc)) {
                    const currentVal = instance.get(key) || 0;
                    updateData[key] = currentVal + val;
                }
            }
            if (update.$push) {
                for (const [key, val] of Object.entries(update.$push)) {
                    const currentArr = instance.get(key) || [];
                    updateData[key] = [...currentArr, val];
                }
            }
            if (update.$pull) {
                for (const [key, val] of Object.entries(update.$pull)) {
                    const currentArr = instance.get(key) || [];
                    updateData[key] = currentArr.filter(item => JSON.stringify(item) !== JSON.stringify(val));
                }
            }

            // Direct field updates (not operators)
            for (const [key, val] of Object.entries(update)) {
                if (!key.startsWith('$')) {
                    updateData[key] = val;
                }
            }

            await instance.update(updateData);
            if (returnNew) {
                await instance.reload();
            }
            return wrapInstance(instance);
        },

        /**
         * Mongoose-compatible findOneAndDelete
         */
        async findOneAndDelete(query) {
            const where = convertQuery(query);
            const instance = await this._model.findOne({ where });
            if (!instance) return null;
            const data = wrapInstance(instance);
            await instance.destroy();
            return data;
        },

        /**
         * Mongoose-compatible deleteOne
         */
        async deleteOne(query) {
            const where = convertQuery(query);
            const count = await this._model.destroy({ where, limit: 1 });
            return { deletedCount: count };
        },

        /**
         * Mongoose-compatible deleteMany
         */
        async deleteMany(query) {
            const where = query ? convertQuery(query) : {};
            const count = await this._model.destroy({ where });
            return { deletedCount: count };
        },

        /**
         * Mongoose-compatible updateOne
         */
        async updateOne(query, update, options) {
            const where = convertQuery(query);
            const instance = await this._model.findOne({ where });

            if (!instance) {
                if (options && options.upsert) {
                    const createData = { ...query };
                    if (update.$set) Object.assign(createData, update.$set);
                    for (const [k, v] of Object.entries(update)) {
                        if (!k.startsWith('$')) createData[k] = v;
                    }
                    await this._model.create(createData);
                    return { modifiedCount: 1 };
                }
                return { modifiedCount: 0 };
            }

            // Handle MongoDB update operators
            const updateData = {};
            if (update.$set) Object.assign(updateData, update.$set);
            if (update.$inc) {
                for (const [key, val] of Object.entries(update.$inc)) {
                    const currentVal = instance.get(key) || 0;
                    updateData[key] = currentVal + val;
                }
            }
            for (const [key, val] of Object.entries(update)) {
                if (!key.startsWith('$')) updateData[key] = val;
            }

            await instance.update(updateData);
            return { modifiedCount: 1 };
        },

        /**
         * Mongoose-compatible countDocuments
         */
        async countDocuments(query) {
            const where = query ? convertQuery(query) : {};
            return await this._model.count({ where });
        },

        /**
         * Mongoose-compatible aggregate (basic support)
         */
        async aggregate(pipeline) {
            // Basic support - most uses in this bot are simple
            console.warn('aggregate() called - limited PostgreSQL support, returning empty array');
            return [];
        },

        /**
         * Constructor-like behavior for `new Model(data)` compatibility.
         * Since we can't use `new` on an object literal, commands that use
         * `new Schema({...})` pattern should be handled via a build() function.
         */
        build(data) {
            const instance = this._model.build(data);
            return wrapInstance(instance);
        }
    };

    // Register model for later initialization
    modelRegistry[modelDef.name] = wrapper;

    console.log(`[DEBUG] createModel called for ${modelDef.name}. sequelize is ${sequelize ? 'SET' : 'NULL'}`);

    // If sequelize is already initialized, initialize this model immediately
    if (sequelize) {
        wrapper._initModel(sequelize);
    }// 2. Constructor calls: new Schema({...}).save()
    return new Proxy(function () { }, {
        get(target, prop) {
            return wrapper[prop];
        },
        set(target, prop, value) {
            wrapper[prop] = value;
            return true;
        },
        construct(target, args) {
            // `new Schema(data)` → build an unsaved instance
            const data = args[0] || {};
            const instance = wrapper._model.build(data);
            return wrapInstance(instance);
        },
        apply(target, thisArg, args) {
            // Schema(data) without new → also build
            const data = args[0] || {};
            const instance = wrapper._model.build(data);
            return wrapInstance(instance);
        }
    });
}

module.exports = connect;
module.exports.connect = connect;
module.exports.getSequelize = getSequelize;
module.exports.createModel = createModel;
module.exports.wrapInstance = wrapInstance;
module.exports.DataTypes = DataTypes;
module.exports.Op = Op;