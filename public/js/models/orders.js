define( function( require ) {

	var Backbone = require( 'backbone' );

	var OrdersModel = Backbone.Model.extend({
	 	urlRoot: '/api/shirts',
	 	defaults: {}
	  	, initialize: function() {
	  		console.log('Orders Model Rendered' );
	  	}
	  	, idAttribute: 'OrderID'
	});

	return OrdersModel;
});