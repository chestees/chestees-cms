define( function( require ) {

	var Backbone    = require( 'backbone' );
	var URI         = require( 'URI' );
	var OrdersModel = require( 'js/models/orders' );

	var OrdersCollection = Backbone.Collection.extend({
		model: OrdersModel
		, url: function() {
			return URI( 'api/orders' ).query( this.params );
		}
		, initialize: function( options ) {
			var page      = options.page;
			var pageSize  = options.pageSize;
			this.orderBy  = options.orderBy;

			this.params = {
				Page: page
				, PageSize: pageSize
				, OrderBy: this.orderBy
			};
			// this.listenTo( this, "sort", this.render );
		}
		, comparator: function( model ) {
			return -moment( model.get( this.orderBy ) );
		}
	});

	return OrdersCollection;
});