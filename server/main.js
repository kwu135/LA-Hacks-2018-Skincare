var bodyParser = require('body-parser');
var crypto = require('crypto');
var express = require('express');
var q = require('q');

var generate_key = function() {
    var sha = crypto.createHash('sha256');
    sha.update(Math.random().toString());
    return sha.digest('hex');
};

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

const Datastore = require('@google-cloud/datastore');
const projectId = 'skincare-199709';
const keyFilename = "/Users/yunalee/Desktop/LA-Hacks-2018-Skincare/server/Skincare-fea4f318f260.json"
const datastore = new Datastore({projectId: projectId, keyFilename: keyFilename});

/* Functions for database */

class DatabaseManager
{
	addUser(fname, lname, email, pw) {
		const userKey = datastore.key('User');
		const entity = {
			key: userKey,
			data: [
				{name: 'fname', value: fname},
				{name: 'lname', value: lname},
				{name: 'email', value: email},
				{name: 'pw', value: pw},
				{name: 'sessionToken', value: ""}
			]
		};
		datastore.save(entity)
			.then(() => {
				console.log('Task ${userKey.id} created successfully.');
				return true;
			})
			.catch(err => {
				console.error('ERROR:', err);
				return false;
			});
	}

	authenticateUser(email, pw) {
		const query = datastore.createQuery('User').filter('email', '=', email);
		let userKey;
		let cookie;
		let transaction = null;
		let userInfo;
		return datastore.runQuery(query).then(results => {
			let user = results[0][0];
			userKey = user[datastore.KEY];
			userInfo = results[0][0];
			const userpw = results[0][0].pw;
			if (pw == userpw) {
				transaction = datastore.transaction();
				cookie = generate_key();
				return transaction.run();
			} else {
				Promise.reject("Password mismatch");
			}
		}).then(() => transaction.get(userKey)).then( results => {
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
		})
	}

}

let database = new DatabaseManager();

/* Exposed to client */

app.get('/', function(req, res){
   res.send("Hello world!");
});

app.post('/signup', function(req, res) {
	console.log(req.body);
	if (!req.body.fname || !req.body.lname || !req.body.email || !req.body.pw) {
		res.status("400");
		res.send("Missing registration details.");
	} else {
		let success = database.addUser(req.body.fname, req.body.lname, req.body.email, req.body.pw);
		if (success) {
			res.send("Registration success!");
		} else {
			res.send("Invalid registration details.");
		}
	}
});

app.post('/login', function(req, res) {
	console.log(req.body);
	if (!req.body.email || !req.body.pw) {
		res.status("400");
		res.send("Missing login details.");
	} else {
		database.authenticateUser(req.body.email, req.body.pw).then((userInfo) => {
			if (userInfo) {
				res.status("200");
				res.send({
					"fname": userInfo.fname,
					"lname": userInfo.lname,
					"email": userInfo.email,
					"sessionToken": userInfo.sessionToken
				});
			} else {
				res.status("404");
				res.send("Invalid login details.");
			}
		}).catch((err) => {
			console.log(err);
			res.status("404");
			res.send("Login error.");
		});
	}
});

app.listen(3000);


