var crypto = require('crypto');
var Q = require('q');

const Datastore = require('@google-cloud/datastore');
const projectId = 'skincare-199709';
const keyFilename = "/Users/yunalee/Desktop/Skincare-fea4f318f260.json"
const datastore = new Datastore({projectId: projectId, keyFilename: keyFilename});

class DatabaseManager
{
	/* Adds a new user to database */
	addUser(fname, lname, email, pw) {
		var deferred = Q.defer();
		const userKey = datastore.key('User');
		// Check for duplicate entity
		const query = datastore.createQuery('User').filter('email', '=', email);
		datastore.runQuery(query).then(results => {
			if (results[0].length > 0) {
				deferred.reject("Email is already in use.");
				return;
			}
			// New user entity
			const entity = {
				key: userKey,
				data: [
					{name: 'fname', value: fname},
					{name: 'lname', value: lname},
					{name: 'email', value: email},
					{name: 'pw', value: pw},
					{name: 'productList', value: []},
					{name: 'sessionToken', value: ""}
				]
			};
			// Add entity to database
			return datastore.save(entity).then(() => {
				console.log('User %d created successfully.', userKey.id);
				deferred.resolve(true);
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
		const query = datastore.createQuery('User').filter('email', '=', email);
		let userKey;
		let cookie;
		let transaction = null;
		let userInfo;
		return datastore.runQuery(query).then(results => {
			// Get user information
			let user = results[0][0];
			userKey = user[datastore.KEY];
			userInfo = results[0][0];
			const userpw = results[0][0].pw;
			// Check password
			if (pw === userpw) {
				transaction = datastore.transaction();
				cookie = this.generate_key();
				return transaction.run();
			} else {
				Promise.reject("Password mismatch");
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
			return {
				"fname": userInfo.fname,
				"lname": userInfo.lname,
				"email": userInfo.email,
				"sessionToken": cookie
			}
		});
	}

	validateSessionToken(email, sessionToken) {
		console.log(email)
		console.log(sessionToken)

		const query = datastore.createQuery('User').filter('email', '=', email);
		return datastore.runQuery(query).then(results => {
			// Get user information
			let user = results[0][0];
			if (sessionToken === user.sessionToken) {
				return user[datastore.KEY];
			} else {
				return "";
			}
		});
	}

	/* Adds a new product to user's routine */
	addProduct(productName, category, ingredients, email, sessionToken) {
		let deferred = Q.defer();
		const productKey = datastore.key('Product');
		let userKey;
		let transaction = null;

		this.validateSessionToken(email, sessionToken).then((tempUserKey) => {
			if (tempUserKey !== "") {
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
					{name: 'ingredients', value: ingredients}
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
			if (!transaction) {
				transaction.rollback();
			}
			deferred.reject("transaction failed");
		});

		return deferred.promise;
	}

	getProductList(email, sessionToken) {
		let deferred = Q.defer();

		this.validateSessionToken(email, sessionToken).then((tempUserKey) => {
			if (tempUserKey !== "") {
				const query = datastore.createQuery('User').filter('email', '=', email);
				return datastore.runQuery(query);
			} else {
				deferred.reject("Invalid session token");
				return;
			}
		}).then(results => {
			deferred.resolve(results[0][0].productList);
		});

		return deferred.promise;
	}


	// getUserProducts(userId) {
 //    const query = datastore.createQuery('User').filter('email', '=', email);
 //    datastore.runQuery(query).then(results => {
 //        const products = results[0][0].products;

 //        for (var i = products.length - 1; i >= 0; i--) {
 //            //const query = datastore.createQuery('Product').filter('products[i]
 //        }
 //        else return false;
 //    });
	// }
}

module.exports = DatabaseManager;

