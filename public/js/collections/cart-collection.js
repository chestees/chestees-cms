define( function( require ) {

	var Backbone    = require( 'backbone' );
	var CartModel = require( 'js/models/cart-model' );

	var CartCollection = Backbone.Collection.extend({
		model: CartModel
		, url: '/api/cart'
		, initialize: function() {
			console.log('Cart Collection Initialized');
			this.listenTo( this, "sort", this.render );
		}
		, comparator: function( model ) {
			// return -model.get( 'thumbs' );
		}
	});

	return CartCollection;
});