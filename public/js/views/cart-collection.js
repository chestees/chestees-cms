define( function( require ) {
	
	var Marionette = require( 'marionette' );
	var Moment     = require( 'moment' );

	var CartView = require( 'js/views/cart-view' );
	
	var CartCollectionView = Marionette.CollectionView.extend({
		childView: CartView
		, initialize: function( options ) {
			this.app = options;
			this.collection = this.app.cartCollection;
			this.listenTo( this.collection, "sort", this.render );
		}
		, id: 'shirts'
	});

	return CartCollectionView;
});