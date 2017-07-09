'use strict';

var Router = require('../../helpers/router');
var httpApi = require('../../helpers/httpApi');

/**
 * Binds api with modules and creates common url.
 * - End point: `/api/multisignatures`
 * - Public API:
 * 	- get	/pending
 * 	- post	/sign
 * 	- put	/
 * 	- get	/accounts
 * @memberof module:multisignatures
 * @requires helpers/Router
 * @requires helpers/httpApi
 * @constructor
 * @param {Object} multisignaturesModule - Module multisignatures instance.
 * @param {scope} app - Network app.
 */
// Constructor
function MultisignaturesHttpApi (multisignaturesModule, app) {

	var router = new Router();

	router.map(multisignaturesModule.shared, {
		'get /pending': 'pending',
		'post /sign': 'sign',
		'put /': 'addMultisignature',
		'get /accounts': 'getAccounts'
	});

	httpApi.registerEndpoint('/api/multisignatures', app, router, multisignaturesModule.isLoaded);
}

module.exports = MultisignaturesHttpApi;
