define( function( require ) {
	'use strict';

	var Marionette  = require( 'marionette' );

	var CartView       = require( 'js/views/cart-collection' );
	var Orders         = require( 'js/views/orders-collection' );
	var ProductSummary = require( 'js/views/shirts-collection' );
	var Annual         = require( 'js/views/annual' );
	var Monthly        = require( 'js/views/monthly' );
	var Query          = require( 'js/views/query' );

	var Router = Marionette.AppRouter.extend({
		initialize: function( options ) {
			this.app = options;
		}
		, routes: {
			'': 'home',
			'cart': 'cart',
			'orders': 'orders',
			'reporting/product': 'productSummary',
			'reporting/annual': 'annual',
			'reporting/monthly/:year': 'monthly',
			'reporting/query': 'query'
		}
		, home: function() {}
		, cart: function() {
			this.app.mainLayout.article.show( new CartView( this.app ) );
		}
		, productSummary: function() {
			this.app.mainLayout.article.show( new ProductSummary( this.app ) );
		}
		, annual: function() {
			this.app.mainLayout.article.show( new Annual( this.app ) );
		}
		, monthly: function( year ) {
			this.app.mainLayout.article.show( new Monthly( { 'app': this.app, 'year': year } ) );	
		}
		, orders: function() {
			this.app.ordersCollection.fetch().done( _.bind( function() {
				this.app.mainLayout.article.show( new Orders( this.app ) );
			}, this ) );
		}
		, query: function() {
			this.app.ordersCollection.fetch().done( _.bind( function() {
				this.app.mainLayout.article.show( new Query( this.app ) );
			}, this ) );
		}
	});
	return Router;
});