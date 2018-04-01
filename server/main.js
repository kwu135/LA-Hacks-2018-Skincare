var bodyParser = require('body-parser');
var express = require('express');
let cors = require('cors');
var md5 = require('md5');
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

/* Creates a new product and adds to user's routine */
app.post('/create-new-product', function(req, res) {
	console.log(req.body);
	// Check parameters aren't null
	if (!req.body.productName || !req.body.category ||
		!req.body.ingredients || !req.body.email || !req.body.sessionToken) {
		res.status(400);
		res.send("Missing information.");
		return;
	}
	// Add new product
	const productHash = md5(req.body.productName);
	database.createNewProduct(req.body.productName, req.body.category, req.body.ingredients,
		req.body.email, req.body.sessionToken).then((success) => {
		if (success) {
			res.status(200);
			res.send({ success: true, err: "", data: productHash });
		} else {
			res.status(500);
			res.send({ success: false, err: "Failed to add new product to database.", data: productHash });
		}
	}).catch((err) => {
		console.log(err);
		res.status(500);
		res.send({ success: false, err: err, data: productHash });
	});
});

/* Add a product to user's routine */
app.post('/add-product-to-routine', function(req, res) {
	console.log(req.body);
	// Check parameters aren't null
	if (!req.body.productHash || !req.body.email || !req.body.sessionToken) {
		req.status(400);
		req.send("Missing information.");
		return;
	}
	// Add product
	database.addProductToRoutine(req.body.productHash, req.body.email,
		req.body.sessionToken).then((success) => {
		if (success) {
			res.status(200);
			res.send({ success: true, err: "" });
		} else {
			res.status(500);
			res.send({ success: false, err: "Failed to add product to routine." });
		}
	}).catch((err) => {
		console.log(err);
		res.status(500);
		res.send({ success: false, err: err });
	});
});

/* Get a user's list of products */
app.post('/get-product-list', function(req, res) {
	console.log(req.body);
	if (!req.body.email || !req.body.sessionToken) {
		res.status(400);
		res.send("Missing user information.");
		return;
	}
	// Get product list
	database.getProductList(req.body.email, req.body.sessionToken).then((productList) => {
		if (productList != null) {
			res.status(200);
			res.send({success: true, err: "", data: productList});
		} else {
			res.status(500);
			res.send({ success: false, err: "Failed to retrieve product list." });
		}
	}).catch((err) => {
		console.log(err);
		res.status(500);
		res.send({ success: false, err: err });
	});
});

/* Get all information about specified product */
app.get('/product-info', function(req, res) {
	if (!req.query.productHash) {
		res.status(400);
		res.send("Missing product hash.");
		return;
	}
	// Get product info
	database.getProductInfo(req.query.productHash).then((productInfo) => {
		if (productInfo != null) {
			res.status(200);
			res.send({success: true, err: "", data: productInfo});
		} else {
			res.status(500);
			res.send({success: false, err: "Failed to retrieve product info."});
		}
	}).catch((err) => {
		console.log(err);
		res.status(500);
		res.send({ success: false, err: err });
	});
});

app.listen(3000);


