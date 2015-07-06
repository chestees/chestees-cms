define( function( require ) {
	
	var Marionette = require( 'marionette' );
	var Handlebars = require( 'handlebars' );
	var Moment     = require( 'moment' );

	var tmplOrdersPrint = require( 'text!/templates/orders-print.html' );
	var tmplOrdersListingCartPrint = require( 'text!/templates/orders-listing-cart-print.html' );

	var OrderPrintView = Marionette.ItemView.extend({
		template: false
		, className: 'order-print container'
		// , templateHelpers: function() {
		// 	var data = this.getData();
		// 	// var DateOrdered = moment( this.model.get( 'DateOrdered' ) ).format( 'M/D/YYYY' );
		// 	// var PurchaseAmount = '$' + this.model.get( 'PurchaseAmount' ).toFixed( 2 );
		// 	// var ShippingCost = '$' + this.model.get( 'ShippingCost' ).toFixed( 2 );
		// 	// var DiscountAmount = '$' + this.model.get( 'DiscountAmount' ).toFixed( 2 );
		// 	// var TotalAmount = '$' + this.model.get( 'TotalAmount' ).toFixed( 2 );
		// 	return {
		// 		// DateOrdered: this.model.get( 'DateOrdered' )
		// 		// , PurchaseAmount: PurchaseAmount
		// 		// , ShippingCost: ShippingCost
		// 		// , DiscountAmount: DiscountAmount
		// 		// , TotalAmount: TotalAmount
		// 	};
		// }
		, initialize: function( options ) {
			this.app = options.app;
			this.orderId = options.orderId;
			// this.model = _.find( this.app.ordersCollection.models, _.bind( function( model ) {
			// 	if( this.orderId === model.get( 'OrderID' ) ) {
			// 		return model;
			// 	}
			// }, this ) );

			// Get products ordered
		}
		, onRender: function( options ) {
			$.ajax({
				type: 'get'
				, url: '/api/order/' + this.orderId
				, dataType: 'json'
				, contentType: 'application/json'
				, data: {}
				, success: _.bind( function ( data ) {
					data.DateOrdered = moment( data.DateOrdered ).format( 'M/D/YYYY' );
					data.PurchaseAmount = '$' + data.PurchaseAmount.toFixed( 2 );
					data.ShippingCost = '$' + data.ShippingCost.toFixed( 2 );
					data.DiscountAmount = '$' + data.DiscountAmount.toFixed( 2 );
					data.TotalAmount = '$' + data.TotalAmount.toFixed( 2 );
					
					this.$el.append( Handlebars.compile( tmplOrdersPrint )( data ) );
				}, this )
				, error: _.bind( function( res ) {
					console.log( 'error', res );
				}, this )
				, complete: _.bind( function () {
				}, this )
			});
		}
	});

	return OrderPrintView;
});