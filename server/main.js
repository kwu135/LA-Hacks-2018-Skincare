var bodyParser = require('body-parser');
var express = require('express');
let cors = require('cors');
let DatabaseManager = require('./database-manager.js');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors());

let database = new DatabaseManager();

/* Register a new user */
app.post('/signup', function(req, res) {
	console.log(req.body);
	// Check parameters aren't null
	if (!req.body.fname || !req.body.lname || !req.body.email || !req.body.pw) {
		res.status("400");
		res.send("Missing registration details.");
		return;
	}
	// Attempt registration
	database.addUser(req.body.fname, req.body.lname, req.body.email, req.body.pw).then((success) => {
		if (success) {
			res.status(200);
			res.send({ success: true });
		} else {
			res.status(500);
			res.send({ success: false });
		}
	}).catch((err) => {
		console.log(err);
		res.status(500);
		res.send({ success: false });
	});
});

/* Authenticate a user */
app.post('/login', function(req, res) {
	console.log(req.body);
	// Check parameters aren't null
	if (!req.body.email || !req.body.pw) {
		res.status("400");
		res.send("Missing login details.");
		return;
	}
	// Attempt login
	database.authenticateUser(req.body.email, req.body.pw).then((userInfo) => {
		if (userInfo) {
			res.status(200);
			res.send({
				"fname": userInfo.fname,
				"lname": userInfo.lname,
				"email": userInfo.email,
				"sessionToken": userInfo.sessionToken
			});
		} else {
			res.status(500);
			res.send("Invalid login details.");
		}
	}).catch((err) => {
		console.log(err);
		res.status(500);
		res.send("Login error.");
	});
});

/* Add a product to user's routine */
app.post('/add-product', function(req, res) {
	console.log(req.body);
	// Check parameters aren't null
	if (!req.body.productName || !req.body.category ||
		!req.body.ingredients || !req.body.email || !req.body.sessionToken) {
		res.status(400);
		res.send("Missing product information.");
		return;
	}
	// Add new product
	database.addProduct(req.body.productName, req.body.category, req.body.ingredients, req.body.email,
		req.body.sessionToken).then((success) => {
		if (success) {
			res.status(200);
			res.send({ success: true });
		} else {
			res.status(500);
			res.send({ success: false });
		}
	}).catch((err) => {
		console.log(err);
		res.status(500);
		res.send({ success: false });
	});
});

app.post('/get-product-list', function(req, res) {
	console.log(req.body);
	if (!req.body.email || !req.body.sessionToken) {
		res.status(400);
		res.send("Missing user information.");
		return;
	}

	database.getProductList(req.body.email, req.body.sessionToken).then((productList) => {
		if (productList != null) {
			res.status(200);
			res.send({
				productList: productList,
				success: true
			});
		} else {
			res.status(500);
			res.send({ success: false });
		}
	}).catch((err) => {
		console.log(err);
		res.status(500);
		res.send({ success: false });
	});
});

app.listen(3000);


