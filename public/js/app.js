define( function( require ) {

	var Marionette = require( 'marionette' );
	var Bootstrap  = require( 'bootstrap' );
	var Handlebars = require( 'handlebars' );

	var app = new Marionette.Application();

	var Router           = require( 'js/routing/router' );
	var CartCollection   = require( 'js/collections/cart-collection' );
	var OrdersCollection = require( 'js/collections/orders' );
	// var MainLayout       = require( 'js/views/mainLayout' );
	
	app.addRegions({
		body: 'body'
	});

	app.addInitializer(function() {
		app.cartCollection = new CartCollection();
		app.ordersCollection = new OrdersCollection( {
			page: 1
			, pageSize: 50
			, orderBy: 'DateOrdered'
		} );

		var appModel = Backbone.Model.extend();
		app.appModel = new appModel({
			printView: false
			, ordersPage: 1
		});

		app.cartCollection.fetch().done( function() {
			// app.mainLayout = new MainLayout( app );
			// app.body.show( app.mainLayout );
			app.router = new Router( app );

			Backbone.history.start();
		});
	});

	app.on('start', function() {
		console.log('App Started');
	});

	return app;
});