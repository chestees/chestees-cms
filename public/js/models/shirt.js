define( function( require ) {

	var Backbone = require( 'backbone' );

	var ShirtModel = Backbone.Model.extend({
	 	urlRoot: '/api/shirts',
	 	defaults: {
			'product': '',
			'image_index': ''
		}
	  	, initialize: function() {
	  		console.log('Shirt Model Rendered' );
	  	}
	  	, idAttribute: 'ProductID'
	});

	return ShirtModel;
});