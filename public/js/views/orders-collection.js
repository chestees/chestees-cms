define( function( require ) {
	
	var Marionette = require( 'marionette' );
	var Moment     = require( 'moment' );

	var OrdersView = require( 'js/views/orders' );
	
	var OrdersCollectionView = Marionette.CollectionView.extend({
		childView: OrdersView
		, initialize: function( options ) {
			this.app = options;
			this.collection = this.app.ordersCollection;
			// this.listenTo( this.collection, "sort", this.render );
		}
		, id: 'orders'
	});

	return OrdersCollectionView;
});