var express     = require('express');
var sql         = require('mssql');
var serveStatic = require('serve-static');
var _           = require('underscore');
var auth        = require('basic-auth');
var config      = require( 'config' );
var app         = express();

// Authentication 
app.use( function( req, res, next ) {
	var user = auth( req );
	if ( !user || user.name !== 'chestees' || user.pass !== config.BASIC_AUTH_PW ) {
		res.writeHead( 401, { 'WWW-Authenticate': 'Basic realm="Chestees Admin"' } );
		res.end();
	} else {
		next();
	}
} );

app.use( require('skipper')() );
app.use( serveStatic('public') );

app.set('port', ( process.env.PORT || 5000 ) );

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});

require( './routes/order-detail' )( app );

sql.connect( config, function( err ) {
	if( err ) {
		console.log("Error: " + err );
	}
	
	var shirtListing = new sql.Request();
	var cartItems    = new sql.Request();
	var salesListing = new sql.Request();
	var orders       = new sql.Request();
	var orderItems   = new sql.Request();
	
	// Shirts listing
	app.use('/api/shirts', function( req, res ) {
		shirtListing.query( 'SELECT ProductID, Product, Image_Index FROM tblProduct ' +
			'WHERE Active = 1 AND Private = 0 AND CategoryID = 1 ' +
			'ORDER BY DisplayOrder'
			, function( err, recordset ) {
				app.shirtListing = recordset;
				res.send( app.shirtListing );
				if( err ) {
					console.log("Error: " + err );
				}
			}
		);
	});

	// Cart item
	app.use('/api/cart', function( req, res ) {
		var VisitorId = req.query.VisitorId;
		if( VisitorId ) {
			cartItems.input( 'VisitorId', VisitorId );
			// Cart items by visitor
			cartItems.query( 'SELECT C.CustomerID, C.VisitorID, C.Purchased, C.DateAdded, C.CartID, ' +
				'P.Product, P.Image_Index, C.Price, S.SizeAbbr, Y.Style, C.Quantity ' +
				'FROM (((tblCart C INNER JOIN tblProduct P ON C.ProductID = P.ProductID) ' +
					'INNER JOIN tblProductSize S ON C.ProductSizeID = S.ProductSizeID) ' +
					'INNER JOIN tblProductStyle Y ON C.ProductStyleID = Y.ProductStyleID) ' +
				'WHERE C.VisitorID = ' + VisitorId
				, function( err, recordset ) {
					app.cartItems = recordset;
					res.send( app.cartItems );
					if( err ) {
						console.log("Error: " + err );
					}
				}
			);
		} else {
			cartItems.query( 'SELECT TOP 25 C.CustomerID, C.VisitorID, C.Purchased, C.DateAdded, C.CartID, ' +
				'P.Product, P.Image_Index, C.Price, S.SizeAbbr, Y.Style, C.Quantity ' +
				'FROM (((tblCart C INNER JOIN tblProduct P ON C.ProductID = P.ProductID) ' +
					'INNER JOIN tblProductSize S ON C.ProductSizeID = S.ProductSizeID) ' +
					'INNER JOIN tblProductStyle Y ON C.ProductStyleID = Y.ProductStyleID) ' +
				'ORDER BY C.DateAdded DESC'
				, function( err, recordset ) {
					app.cartItems = recordset;
					res.send( app.cartItems );
					if( err ) {
						console.log("Error: " + err );
					}
				}
			);
		}
	});

	// Orders listing
	app.use('/api/orders', function( req, res ) {
		var OrderId = req.query.OrderId;
		var ProductId = req.query.ProductId;
		var showAll = req.query.showAll;

		if( OrderId ) {
			orders.input( 'OrderId', OrderId );
			// Order Items listing
			orders.query( 'SELECT O.OrderID, P.Product, P.ProductID, P.Image_Index, C.Quantity, C.Price, ' +
				'S.SizeAbbr, Y.Style ' +
				'FROM ((((tblOrder O INNER JOIN relCartToOrder R ON O.OrderID = R.OrderID ' +
				'INNER JOIN tblCart C ON R.CartID = C.CartID ) ' +
				'INNER JOIN tblProduct P ON P.ProductID = C.ProductID ) ' +
				'INNER JOIN tblProductSize S ON C.ProductSizeID = S.ProductSizeID) ' +
				'INNER JOIN tblProductStyle Y ON C.ProductStyleID = Y.ProductStyleID) ' +
				'WHERE O.OrderID = ' + OrderId
				, function( err, recordset ) {
					app.orders = recordset;
					res.send( app.orders );
					if( err ) {
						console.log("Error: " + err );
					}
				}
			);
		} else if( ProductId ) {
			orders.input( 'ProductId', ProductId );
			// Orders by product
			orders.query( 'SELECT C.CartID, C.ProductID, C.Quantity, P.Product, P.Image_Index, C.Price, ' +
				'O.OrderID, O.DateOrdered ' +
				'FROM tblOrder O INNER JOIN relCartToOrder R ON O.OrderID = R.OrderID ' +
				'INNER JOIN tblCart C ON R.CartID = C.CartID ' +
				'INNER JOIN tblProduct P ON P.ProductID = C.ProductID ' +
				'WHERE P.ProductID = ' + ProductId,
				function( err, recordset ) {
					app.orders = recordset;
					res.send( app.orders );
					if( err ) {
						console.log("Error: " + err );
					}
				}
			);
		 } else if( showAll ) {
		 	console.log( 'Executing orders all' );
		 	var order    = new sql.Request();

			// Orders - ALL
			order.execute( 'usp_Chestees_Orders_All', _.bind( function( err, recordset, returnValue ) {
				
				// console.log( 'Orders: ' + JSON.stringify( recordset[0] ) + '\n' );

				var orders      = recordset[0];

				// console.log('Length: ' + recordset.length); // count of recordsets returned by the procedure 
				// console.log('Length [0]: ' + recordset[0].length); // count of rows contained in first recordset 

				if( err ) {
					console.log("Error: " + err );
				} else {
					res.send( orders );
				}
			}, this ) );
		} else {
			var order    = new sql.Request();
			var page     = req.query.Page || 1;
			var pageSize = req.query.PageSize || 50;
			var orderBy  = req.query.OrderBy || 'DateAdded';

			order.input( 'Search', sql.NVarChar, 0 );
			order.input( 'Page', sql.Int, page );
			order.input( 'PageSize', sql.Int, pageSize );
			order.input( 'OrderBy', sql.NVarChar, orderBy );

			order.execute( 'usp_Chestees_Orders', _.bind( function( err, recordset, returnValue ) {
				
				// console.log( '1: ' + JSON.stringify( recordset[0] ) + '\n');
				console.log( '2: ' + JSON.stringify( recordset[1][0] ) + '\n' );

				var orders      = recordset[0];
				app.ordersCount = recordset[1][0];

				// console.log('Length: ' + recordset.length); // count of recordsets returned by the procedure 
				// console.log('Length [0]: ' + recordset[0].length); // count of rows contained in first recordset 

				if( err ) {
					console.log("Error: " + err );
				} else {
					res.send( orders );
				}
			}, this ) );
		}
	});

	app.use( '/api/count/orders', function( req, res ) {
		res.send( app.ordersCount );
	});

	// Product sales list. List all orders of each product.
	// app.use('/api/orders/:ProdId', function( req, res ) {
	// 	var ProductId = req.params.ProdId;

	// 	salesListing.input( 'ProdId', ProductId );
		
	// 	salesListing.query( 'SELECT C.CartID, C.ProductID, C.Quantity, P.Product, P.Image_Index, C.Price, ' +
	// 		'O.OrderID, O.DateOrdered ' +
	// 		'FROM tblOrder O INNER JOIN relCartToOrder R ON O.OrderID = R.OrderID ' +
	// 		'INNER JOIN tblCart C ON R.CartID = C.CartID ' +
	// 		'INNER JOIN tblProduct P ON P.ProductID = C.ProductID ' +
	// 		'WHERE P.ProductID = @ProdId',
	// 		function( err, recordset ) {
	// 			app.salesListing = recordset;
	// 			res.send( app.salesListing );
	// 			if( err ) {
	// 				console.log("Error: " + err );
	// 			}
	// 		}
	// 	);
	// });
});