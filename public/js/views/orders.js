define( function( require ) {
	
	var Marionette = require( 'marionette' );
	var Handlebars = require( 'handlebars' );
	var Moment     = require( 'moment' );

	var tmplOrdersListing     = require( 'text!/templates/orders-listing.html' );
	var tmplOrdersListingCart = require( 'text!/templates/orders-listing-cart.html' );

	var OrdersView = Marionette.ItemView.extend({
		template: Handlebars.compile( tmplOrdersListing )
		, ui: {
			'thumbnails': '.thumbnails'
			, 'cart': '.cart'
			, 'print': '.print'
		}
		, events: {
			'click @ui.print': 'print'
		}
		, className: 'order-item row row-item'
		, templateHelpers: function() {
			var orderDate = moment( this.model.get( 'DateOrdered' ) ).format( 'dddd, MMMM Do YYYY, h:mm:ss a' );
			var purchaseAmount = '$' + this.model.get("PurchaseAmount").toFixed( 2 );
			var totalAmount = '$' + this.model.get("TotalAmount").toFixed( 2 );
			return {
				orderDate: orderDate,
				totalAmount: totalAmount
			};
		}
		, initialize: function( options ) {
			this.app = options.app;
			this.orderId = this.model.get( 'OrderID' );
		}
		, onRender: function( options ) {
			$.ajax({
				type: 'get'
				, url: '/api/orders?OrderId=' + this.orderId
				, dataType: 'json'
				, contentType: 'application/json'
				, data: {}
				, success: _.bind( function ( data ) {
					var image;
					_.each( data, _.bind( function( item ) {
						if( !this.isDestroyed ) {
							template = Handlebars.compile( tmplOrdersListingCart )
							this.ui.cart.append( template( {
								'Image_Index': item.Image_Index,
								'SizeAbbr': item.SizeAbbr,
								'Style': item.Style,
								'Price': '$' + item.Price.toFixed( 2 ),
								'Quantity': 'Qty: ' + item.Quantity
							} ) );
						}
					}, this ) );
				}, this )
				, error: _.bind( function( res ) {
					console.log( 'error', res );
				}, this )
				, complete: _.bind( function () {
				}, this )
			});
		}
		, print: function() {
			this.app.router.print = true;
			this.app.router.orderPrint( this.orderId );
		}
	});

	return OrdersView;
});