define( function( require ) {

	var Backbone = require( 'backbone' );

	var CartModel = Backbone.Model.extend({
	 	urlRoot: '/api/cart',
	 	defaults: {}
	  	, initialize: function() {
	  		console.log('Shirt Model Rendered' );
	  	}
	  	, idAttribute: 'ProductID'
	});

	return CartModel;
});