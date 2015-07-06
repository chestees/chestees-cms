var sql = require( 'mssql' ),
	_   = require('underscore');

module.exports = function( app ) {
    sql.connect( config, _.bind( function( err ) {
		if( err ) {
			console.log("ERR: " + err );
		}

		// Product query by Id
		app.use( '/api/order/:orderId', function( req, res ) {

			var order = new sql.Request();

			order.input('OrderId', sql.Int, req.params.orderId );

			order.execute( 'usp_Chestees_OrderDetail', _.bind( function( err, recordset, returnValue ) {
				
				// console.log( '1: ' + JSON.stringify( recordset[0] ) + '\n');
				// console.log( '2: ' + JSON.stringify( recordset[1] ) + '\n' );
				
				app.order          = recordset[0][0];
				app.order.Products = recordset[1];

				// console.log('Length: ' + recordset.length); // count of recordsets returned by the procedure 
				// console.log('Length [0]: ' + recordset[0].length); // count of rows contained in first recordset 
				// console.log(returnValue); // procedure return value 
				// console.log(recordset.returnValue); // same as previous line 

				if( err ) {
					console.log("Error: " + err );
				} else {
					res.send( app.order );
				}
			}, this ) );
			
		});
	}, this ) );
};