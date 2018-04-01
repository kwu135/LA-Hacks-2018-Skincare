var crypto = require('crypto');
var Q = require('q');
var md5 = require('md5');

const Datastore = require('@google-cloud/datastore');
const projectId = 'skincare-199709';
const keyFilename = "/Users/yunalee/Desktop/Skincare-fea4f318f260.json"
const datastore = new Datastore({projectId: projectId, keyFilename: keyFilename});

class DatabaseManager
{
	/* Adds a new user to database */
	addUser(fname, lname, email, pw) {
		var deferred = Q.defer();
		let cookie;

		const userKey = datastore.key('User');
		// Check for duplicate entity
		const query = datastore.createQuery('User').filter('email', '=', email);
		datastore.runQuery(query).then(results => {
			if (results[0].length > 0) {
				deferred.reject("Email is already in use.");
				return;
			}
			// New user entity
			cookie = this.generate_key();
			const entity = {
				key: userKey,
				data: [
					{name: 'fname', value: fname},
					{name: 'lname', value: lname},
					{name: 'email', value: email},
					{name: 'pw', value: pw},
					{name: 'productList', value: []},
					{name: 'flaggedProductList', value: []},
					{name: 'sessionToken', value: cookie}
				]
			};
			// Add entity to database
			return datastore.save(entity).then(() => {
				console.log('User %d created successfully.', userKey.id);
				deferred.resolve({
					"fname": fname,
					"lname": lname,
					"email": email,
					"sessionToken": cookie
				});
			});
		});
		return deferred.promise;
	}

	/* Generates a unique session key */
	generate_key() {
    var sha = crypto.createHash('sha256');
    sha.update(Math.random().toString());
    return sha.digest('hex');
	};

	/* Checks login information with database */ 
	authenticateUser(email, pw) {
		let deferred = Q.defer();
		const query = datastore.createQuery('User').filter('email', '=', email);
		let userKey;
		let cookie;
		let transaction = null;
		let userInfo;
		
		datastore.runQuery(query).then(results => {
			if (results[0].length == 0) {
				deferred.reject("Invalid email");
				return;
			}
			// Get user information
			let user = results[0][0];
			userKey = user[datastore.KEY];
			userInfo = results[0][0];
			console.log(userInfo);
			const userpw = results[0][0].pw;
			// Check password
			if (pw === userpw) {
				transaction = datastore.transaction();
				cookie = this.generate_key();
				return transaction.run();
			} else {
				deferred.reject("Password mismatch");
				return;
			}
		}).then(() => transaction.get(userKey)).then(results => {
			const user = results[0];
			user.sessionToken = cookie;
			transaction.save({
				key: userKey,
				data: user
			});
			return transaction.commit();
		}).then(() => {
			deferred.resolve({
				"fname": userInfo.fname,
				"lname": userInfo.lname,
				"email": userInfo.email,
				"sessionToken": cookie
			});
		}).catch(() => {
			if (transaction != null) {
				transaction.rollback();
			}
			deferred.reject("transaction failed");
		});

		return deferred.promise;
	}

	validateSessionToken(email, sessionToken) {
		const query = datastore.createQuery('User').filter('email', '=', email);
		return datastore.runQuery(query).then(results => {
			// Get user information
			let user = results[0][0];
			if (sessionToken === user.sessionToken) {
				return user;
			} else {
				return "";
			}
		});
	}

	/* Adds a new product to user's routine */
	createNewProduct(productName, category, ingredients, email, sessionToken) {
		let deferred = Q.defer();
		const productKey = datastore.key('Product');
		let userKey;
		let transaction = null;

		// Validate session token
		this.validateSessionToken(email, sessionToken).then((tempUser) => {
			let tempUserKey = tempUser[datastore.KEY];
			if (tempUserKey !== "") {
				// Check for duplicate product entities
				userKey = tempUserKey;
				const query = datastore.createQuery('Product').filter('name', '=', productName);
				return datastore.runQuery(query);
			} else {
				deferred.reject("Invalid session token");
				return;
			}
		}).then(results => {
			if (results[0].length > 0) {
				deferred.reject("Product already in database.");
				return;
			}
			// New product entity
			const entity = {
				key: productKey,
				data: [
					{name: 'name', value: productName},
					{name: 'category', value: category},
					{name: 'ingredients', value: ingredients},
					{name: 'hash', value: md5(productName).substring(0, 10)}
				]
			};
			// Add product to database
			return datastore.save(entity).then(() => {
				transaction = datastore.transaction();
				return transaction.run();
			}).then(() => transaction.get(userKey)).then(results => {
				const user = results[0];
				if (!user.productList) {
					user.productList = [productName];
				} else {
					user.productList.push(productName);
				}
				transaction.save({
					key: userKey,
					data: user
				});
				return transaction.commit();
			});
		}).then(() => {
			deferred.resolve(true);
		}).catch(() => {
			if (transaction != null) {
				transaction.rollback();
			}
			deferred.reject("transaction failed");
		});

		return deferred.promise;
	}

	addProductToRoutine(productHash, email, sessionToken) {
		let deferred = Q.defer();
		let userKey;
		let transaction = null;
		let productName;

		// Validate session token
		this.validateSessionToken(email, sessionToken).then((tempUser) => {
			let tempUserKey = tempUser[datastore.KEY];
			if (tempUserKey !== "") {
				userKey = tempUserKey;
				// Get product name from hash
				const query = datastore.createQuery('Product').filter('hash', '=', productHash);
				return datastore.runQuery(query);
			} else {
				deferred.reject("Invalid session token");
				return;
			}
		}).then((results) => {
			// Product hash not in database
			if (results[0].length == 0) {
				deferred.reject("Product does not exist.");
				return;
			}
			// Get product name from hash
			productName = results[0][0].name;
			transaction = datastore.transaction();
			return transaction.run();
		}).then(() => transaction.get(userKey)).then(results => {
			// Add product to user's list
			const user = results[0];
			if (!user.productList) {
				user.productList = [productName];
			} else {
				user.productList.push(productName);
			}
			transaction.save({
				key: userKey,
				data: user
			});
			return transaction.commit();
		}).then(() => {
			deferred.resolve(true);
		}).catch((err) => {
			if (transaction != null) {
				transaction.rollback();
			}
			console.log(err);
			deferred.reject("transaction failed");
		});

		return deferred.promise;
	}

	removeProductFromRoutine(productHash, email, sessionToken) {
		let deferred = Q.defer();
		let userKey;
		let transaction = null;
		let productName;

		// Validate session token
		this.validateSessionToken(email, sessionToken).then((tempUser) => {
			let tempUserKey = tempUser[datastore.KEY];
			if (tempUserKey !== "") {
				userKey = tempUserKey;
				// Get product name from hash
				const query = datastore.createQuery('Product').filter('hash', '=', productHash);
				return datastore.runQuery(query);
			} else {
				deferred.reject("Invalid session token");
				return;
			}
		}).then((results) => {
			// Product hash not in database
			if (results[0].length == 0) {
				deferred.reject("Product does not exist.");
				return;
			}
			// Get product name from hash
			productName = results[0][0].name;
			transaction = datastore.transaction();
			return transaction.run();
		}).then(() => transaction.get(userKey)).then(results => {
			// Remove product from user's list
			const user = results[0];
			if (!user.productList) {
				deferred.reject("Product is not on user's list.");
				return;
			} else {
				const index = user.productList.indexOf(productName);
				if (index == -1) {
					deferred.reject("Product is not on user's list.");
					return;
				}
				user.productList.splice(index, 1);
			}
			transaction.save({
				key: userKey,
				data: user
			});
			return transaction.commit();
		}).then(() => {
			deferred.resolve(true);
		}).catch((err) => {
			if (transaction != null) {
				transaction.rollback();
			}
			console.log(err);
			deferred.reject("transaction failed");
		});

		return deferred.promise;
	}

	getProductList(email, sessionToken) {
		let deferred = Q.defer();

		this.validateSessionToken(email, sessionToken).then((tempUser) => {
			let tempUserKey = tempUser[datastore.KEY];
			if (tempUserKey !== "") {
				const query = datastore.createQuery('User').filter('email', '=', email);
				return datastore.runQuery(query);
			} else {
				deferred.reject("Invalid session token");
				return;
			}
		}).then(results => {
			deferred.resolve({
				productList: results[0][0].productList,
				flaggedProductList: results[0][0].flaggedProductList
			});
		});

		return deferred.promise;
	}

	getProductInfo(productHash) {
		const query = datastore.createQuery('Product').filter('hash', '=', productHash);
		return datastore.runQuery(query).then(results => {
			const info = results[0][0];
			delete info.hash;
			return info;
		});
	}

	addThreatFlagToProduct(productHash, email, sessionToken) {
		let deferred = Q.defer();
		let userKey;
		let transaction = null;
		let productName;

		// Validate session token
		this.validateSessionToken(email, sessionToken).then((tempUser) => {
			let tempUserKey = tempUser[datastore.KEY];
			if (tempUserKey !== "") {
				userKey = tempUserKey;
				// Get product name from hash
				const query = datastore.createQuery('Product').filter('hash', '=', productHash);
				return datastore.runQuery(query);
			} else {
				deferred.reject("Invalid session token");
				return;
			}
		}).then((results) => {
			// Product hash not in database
			if (results[0].length == 0) {
				deferred.reject("Product does not exist.");
				return;
			}
			// Get product name from hash
			productName = results[0][0].name;
			transaction = datastore.transaction();
			return transaction.run();
		}).then(() => transaction.get(userKey)).then(results => {
			// Add product to user's list
			const user = results[0];
			if (!user.flaggedProductList) {
				user.flaggedProductList = [productName];
			} else {
				user.flaggedProductList.push(productName);
			}
			transaction.save({
				key: userKey,
				data: user
			});
			return transaction.commit();
		}).then(() => {
			deferred.resolve(true);
		}).catch((err) => {
			if (transaction != null) {
				transaction.rollback();
			}
			console.log(err);
			deferred.reject("transaction failed");
		});

		return deferred.promise;
	}

	removeThreatFlagToProduct(productHash, email, sessionToken) {
		let deferred = Q.defer();
		let userKey;
		let transaction = null;
		let productName;

		// Validate session token
		this.validateSessionToken(email, sessionToken).then((tempUser) => {
			let tempUserKey = tempUser[datastore.KEY];
			if (tempUserKey !== "") {
				userKey = tempUserKey;
				// Get product name from hash
				const query = datastore.createQuery('Product').filter('hash', '=', productHash);
				return datastore.runQuery(query);
			} else {
				deferred.reject("Invalid session token");
				return;
			}
		}).then((results) => {
			// Product hash not in database
			if (results[0].length == 0) {
				deferred.reject("Product does not exist.");
				return;
			}
			// Get product name from hash
			productName = results[0][0].name;
			transaction = datastore.transaction();
			return transaction.run();
		}).then(() => transaction.get(userKey)).then(results => {
			// Remove product from user's list
			const user = results[0];
			if (!user.flaggedProductList) {
				deferred.reject("Product is not on user's list.");
				return;
			} else {
				const index = user.flaggedProductList.indexOf(productName);
				if (index == -1) {
					deferred.reject("Product is not on user's list.");
					return;
				}
				user.flaggedProductList.splice(index, 1);
			}
			transaction.save({
				key: userKey,
				data: user
			});
			return transaction.commit();
		}).then(() => {
			deferred.resolve(true);
		}).catch((err) => {
			if (transaction != null) {
				transaction.rollback();
			}
			console.log(err);
			deferred.reject("transaction failed");
		});

		return deferred.promise;
	}

	checkProductInLists(productHash, email, sessionToken) {
		let deferred = Q.defer();
		let user;
		let productName;

		// Validate session token
		this.validateSessionToken(email, sessionToken).then((tempUser) => {
			user = tempUser;
			const query = datastore.createQuery('Product').filter('hash', '=', productHash);
			return datastore.runQuery(query);
		}).then((results) => {
			// Product hash not in database
			if (results[0].length == 0) {
				deferred.reject("Product does not exist.");
				return;
			}
			// Get product name from hash
			productName = results[0][0].name;

			// Check if product is in user's product list
			let inProductList = false;
			if (user.productList) {
				const index = user.productList.indexOf(productName);
				if (index > -1) {
					inProductList = true;
				}
			}
			// Check if product is in user's flagged list
			let inFlaggedProductList = false;
			if (user.flaggedProductList) {
				const index = user.flaggedProductList.indexOf(productName);
				if (index > -1) {
					inFlaggedProductList = true;
				}
			}
			deferred.resolve({
				inProductList: inProductList, 
				inFlaggedProductList: inFlaggedProductList
			});
		});

		return deferred.promise;
	}

	productSearch(queryString) {
		console.log(queryString);
		const query = datastore.createQuery('Product').filter('name', '>=', queryString).filter('name', '<', queryString + "\ufffd");
		
		return datastore.runQuery(query).then(results => {
			const searchResults = results[0];
			searchResults.forEach(function(element) {
				delete element.hash;
			});
			return searchResults;
		});
	}
}

module.exports = DatabaseManager;

