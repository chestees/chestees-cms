define( function( require ) {
	'use strict';

	var Marionette  = require( 'marionette' );

	var MainLayout       = require( 'js/views/mainLayout' );

	var CartView       = require( 'js/views/cart-collection' );
	var Orders         = require( 'js/views/orders-collection' );
	var OrderPrint     = require( 'js/views/orders-print' );
	var ProductSummary = require( 'js/views/shirts-collection' );
	var Annual         = require( 'js/views/annual' );
	var Monthly        = require( 'js/views/monthly' );
	var Query          = require( 'js/views/query' );

	var Router = Marionette.AppRouter.extend({
		initialize: function( options ) {
			this.app = options;
			this.app.mainLayout = new MainLayout( this.app );
			this.app.body.show( this.app.mainLayout );
		}
		, routes: {
			'': 'cart',
			'cart': 'cart',
			'orders': 'orders',
			'order-print/:orderId': 'orderPrint',
			'reporting/product': 'productSummary',
			'reporting/annual': 'annual',
			'reporting/monthly/:year': 'monthly',
			'reporting/query': 'query'
		}
		, checkMainlayout: function() {
			if( this.app.appModel.get( 'printView' ) ) {
				this.app.appModel.set( { printView: false } );
				this.app.mainLayout = new MainLayout( this.app );
				this.app.body.show( this.app.mainLayout );
			}
		}
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
			this.app.mainLayout.article.show( new Monthly( { app: this.app, year: year } ) );	
		}
		, orders: function() {
			this.checkMainlayout();
			this.app.ordersCollection.fetch().done( _.bind( function() {
				this.app.mainLayout.article.show( new Orders( { app: this.app } ) );
			}, this ) );
		}
		, orderPrint: function( orderId ) {
			this.app.router.navigate( 'order-print/' + orderId );
			this.app.appModel.set( { printView: true } );
			this.app.mainLayout.destroy();
			this.app.body.show( new OrderPrint( { app: this.app, orderId: orderId } ) );
		}
		, query: function() {
			this.app.ordersCollection.fetch().done( _.bind( function() {
				this.app.mainLayout.article.show( new Query( this.app ) );
			}, this ) );
		}
	});
	return Router;
});