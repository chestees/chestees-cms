define( function( require ) {

	var Backbone    = require( 'backbone' );
	var OrdersModel = require( 'js/models/orders' );

	var OrdersCollection = Backbone.Collection.extend({
		model: OrdersModel
		, url: '/api/orders'
		, initialize: function() {
			console.log('Orders Collection Initialized');
			// this.listenTo( this, "sort", this.render );
		}
		, comparator: function( model ) {
			return -moment( model.get( 'DateOrdered' ) );
		}
	});

	return OrdersCollection;
});