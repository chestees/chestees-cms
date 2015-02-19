var express     = require('express');
var sql         = require('mssql');
var serveStatic = require('serve-static');

var app = express();

app.use( serveStatic('public') );

app.set('port', (process.env.PORT || 4000));

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});

var config = {
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	server: process.env.DB_SERVER,
	database: process.env.DB_NAME,
	port: process.env.DB_PORT
}

sql.connect( config, function( err ) {
	if( err ) {
		console.log("ERR: " + err );
	}
	
	var shirtListing = new sql.Request();
	var cartListing  = new sql.Request();
	var salesListing = new sql.Request();
	var orders       = new sql.Request();
	
	// Shirts listing
	shirtListing.query( 'SELECT ProductID, Product, Image_Index FROM tblProduct ' +
		'WHERE Active = 1 AND Private = 0 AND CategoryID = 1 ' +
		'ORDER BY DisplayOrder'
		, function( err, recordset ) {
			app.shirtListing = recordset;
		}
	);

	app.use('/api/shirts', function( req, res ) {
		res.send( app.shirtListing );
	});

	// Cart listing
	cartListing.query( 'SELECT TOP 25 C.CustomerID, C.VisitorID, C.Purchased, C.DateAdded, C.CartID, ' +
		'P.Product, P.Image_Index, C.Price, S.SizeAbbr, Y.Style, C.Quantity ' +
		'FROM (((tblCart C INNER JOIN tblProduct P ON C.ProductID = P.ProductID) ' +
			'INNER JOIN tblProductSize S ON C.ProductSizeID = S.ProductSizeID) ' +
			'INNER JOIN tblProductStyle Y ON C.ProductStyleID = Y.ProductStyleID) ' +
		'ORDER BY C.DateAdded DESC'
		, function( err, recordset ) {
			app.cartListing = recordset;
		}
	);

	app.use('/api/cart', function( req, res ) {
		res.send( app.cartListing );
	});

	// Orders listing
	orders.query( 'SELECT C.CartID, C.ProductID, C.Quantity, P.Product, P.Image_Index, C.Price, ' +
			'O.OrderID, O.DateOrdered, O.PurchaseAmount, O.ShippingCost, O.DiscountAmount, O.TotalAmount ' +
			'FROM tblOrder O INNER JOIN relCartToOrder R ON O.OrderID = R.OrderID ' +
			'INNER JOIN tblCart C ON R.CartID = C.CartID ' +
			'INNER JOIN tblProduct P ON P.ProductID = C.ProductID'
		, function( err, recordset ) {
			app.orders = recordset;
		}
	);
	app.use('/api/orders', function( req, res ) {
		res.send( app.orders );
	});

	// Product sales list. List all orders of each product.
	app.use('/api/orders/:ProdId', function( req, res ) {
		var ProductId = req.params.ProdId;

		salesListing.input( 'ProdId', ProductId );
		
		salesListing.query( 'SELECT C.CartID, C.ProductID, C.Quantity, P.Product, P.Image_Index, C.Price, ' +
			'O.OrderID, O.DateOrdered ' +
			'FROM tblOrder O INNER JOIN relCartToOrder R ON O.OrderID = R.OrderID ' +
			'INNER JOIN tblCart C ON R.CartID = C.CartID ' +
			'INNER JOIN tblProduct P ON P.ProductID = C.ProductID ' +
			'WHERE P.ProductID = @ProdId',
			function( err, recordset ) {
				app.salesListing = recordset;
				res.send( app.salesListing );
			}
		);
	});
});

// app.use('/*', function  (req, res) {
//   res.redirect('404.html');
// } );