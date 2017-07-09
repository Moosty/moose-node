'use strict';

var async = require('async');
var extend = require('extend');
var jsonSql = require('json-sql')();
jsonSql.setDialect('postgresql');
var sandboxHelper = require('../helpers/sandbox.js');

// Private fields
var library, self, __private = {}, shared = {};

__private.loaded = false;
__private.SINGLE_QUOTES = /'/g;
__private.SINGLE_QUOTES_DOUBLED = '\'\'';
__private.DOUBLE_QUOTES = /"/g;
__private.DOUBLE_QUOTES_DOUBLED = '""';

/**
 * Initializes library with scope content.
 * @class
 * @classdesc Main Sql methods.
 * @param {setImmediateCallback} cb - Callback function.
 * @param {scope} scope - App instance.
 */
// Constructor
function Sql (cb, scope) {
	library = {
		logger: scope.logger,
		db: scope.db,
	};
	self = this;

	setImmediate(cb, null, self);
}

// Private methods
/**
 * Adds scape values based on input type.
 * @private
 * @param {*} what
 * @return {string}
 * @throws {string} Unsupported data (with type)
 */
__private.escape = function (what) {
	switch (typeof what) {
	case 'string':
		return '\'' + what.replace(
			__private.SINGLE_QUOTES, __private.SINGLE_QUOTES_DOUBLED
		) + '\'';
	case 'object':
		if (what == null) {
			return 'null';
		} else if (Buffer.isBuffer(what)) {
			return 'X\'' + what.toString('hex') + '\'';
		} else {
			return ('\'' + JSON.stringify(what).replace(
				__private.SINGLE_QUOTES, __private.SINGLE_QUOTES_DOUBLED
			) + '\'');
		}
		break;
	case 'boolean':
		return what ? '1' : '0'; // 1 => true, 0 => false
	case 'number':
		if (isFinite(what)) { return '' + what; }
	}
	throw 'Unsupported data ' + typeof what;
};

/**
 * Adds double quotes to input string.
 * @private
 * @param {string} str
 * @return {string}
 */
__private.escape2 = function (str) {
	return '"' + str.replace(__private.DOUBLE_QUOTES, __private.DOUBLE_QUOTES_DOUBLED) + '"';
};


/**
 * Calls helpers.sandbox.callMethod().
 * @implements module:helpers#callMethod
 * @param {function} call - Method to call.
 * @param {*} args - List of arguments.
 * @param {function} cb - Callback function.
 */
Sql.prototype.sandboxApi = function (call, args, cb) {
	sandboxHelper.callMethod(shared, call, args, cb);
};

// Events
/**
 * Modules are not required in this file.
 * @param {modules} scope - Loaded modules.
 */
Sql.prototype.onBind = function (scope) {
};

/**
 * Sets to true private variable loaded.
 */
Sql.prototype.onBlockchainReady = function () {
	__private.loaded = true;
};

// Shared API
/**
 * @implements {__private.query.call}
 * @param {Object} req
 * @param {function} cb
 */
shared.select = function (req, cb) {
	var config = extend({}, req.body);
	__private.query.call(this, 'select', config, cb);
};

/**
 * @implements {__private.query.call}
 * @param {Object} req
 * @param {function} cb
 */
shared.batch = function (req, cb) {
	var config = extend({}, req.body);
	__private.query.call(this, 'batch', config, cb);
};

/**
 * @implements {__private.query.call}
 * @param {Object} req
 * @param {function} cb
 */
shared.insert = function (req, cb) {
	var config = extend({}, req.body);
	__private.query.call(this, 'insert', config, cb);
};

/**
 * @implements {__private.query.call}
 * @param {Object} req
 * @param {function} cb
 */
shared.update = function (req, cb) {
	var config = extend({}, req.body);
	__private.query.call(this, 'update', config, cb);
};

/**
 * @implements {__private.query.call}
 * @param {Object} req
 * @param {function} cb
 */
shared.remove = function (req, cb) {
	var config = extend({}, req.body);
	__private.query.call(this, 'remove', config, cb);
};

// Export
module.exports = Sql;
