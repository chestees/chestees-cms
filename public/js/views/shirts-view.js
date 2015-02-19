define( function( require ) {
	
	var Marionette = require( 'marionette' );
	var $          = require( 'jquery' );
	var Handlebars = require( 'handlebars' );
	var Moment     = require( 'moment' );

	var tmplShirtListing   = require( 'text!/templates/shirt-listing.html' );

	var ShirtsView = Marionette.ItemView.extend({
		template: Handlebars.compile( tmplShirtListing )
		, ui: {
			'summaryListing': '.summary-listing'
			, 'summaryNumbers': '.summary-numbers'
			, 'showSales': '.show-sales'
		}
		, events: {
			'click @ui.showSales': 'toggleSales'
		}
		, className: 'summary-item row row-item'
		, templateHelpers: function() {
			// var cartDate = moment( this.model.get( 'DateAdded' ) ).format( 'dddd, MMMM Do YYYY, h:mm:ss a' );
			// return {
			// 	cartDate: cartDate	
			// };
		}
		, initialize: function() {
			this.totalSales = 0;
			this.numSold    = 0;
		}
		, onRender: function( options ) {
			$.ajax({
				type: 'get'
				, url: '/api/orders/' + this.model.get( 'ProductID' )
				, dataType: 'json'
				, contentType: 'application/json'
				, data: {}
				, success: _.bind( function ( data ) {
					numRecords = data.length;
				}, this )
				, error: _.bind( function( res ) {
					console.log( 'error', res );
				}, this )
				, complete: _.bind( function () {
					
				}, this )
			}).done( _.bind( function( data ) {
				if( numRecords > 0 ) {
					_.each( data, _.bind( function( item, key ) {
						this.buildShirtList( item, key );
					}, this ) );
				} else {
					this.ui.summaryListing.append( '<li>Not one single sale.</li>' );
				}

				this.ui.summaryNumbers.append( 'Total Sold: $' + this.totalSales.toFixed(2) + '( ' + this.numSold + ' )' );
			}, this ) );
		}
		, buildShirtList: function( item ) {
			var cartId = item.CartID;
			var orderId = item.OrderID;
			var orderDate = moment( item.DateOrdered ).format( 'MMM D, YYYY, h:mm:ss a' );
			var price = item.Price;
			var quantity = item.Quantity;

			this.totalSales = this.totalSales + ( price * quantity );
			this.numSold = this.numSold + quantity;

			this.ui.summaryListing.append( '<li class="summary-list-item">Order: ' + orderId + ', Cart: ' + cartId + ', ' + orderDate + '</li>' );
		}
		, toggleSales: function() {
			if( this.ui.summaryListing.hasClass( 'hidden' ) ) {
				this.ui.summaryListing.removeClass( 'hidden' );
				this.ui.showSales.text( 'Hide Sales' );
			} else {
				this.ui.summaryListing.addClass( 'hidden' );
				this.ui.showSales.text( 'Show Sales' );
			}
		}
	});

	return ShirtsView;
});