define( function( require ) {
	
	var Marionette = require( 'marionette' );
	var Handlebars = require( 'handlebars' );
	var Moment     = require( 'moment' );

	var tmplQuery  = require( 'text!/templates/query.html' );

	var QueryView = Marionette.ItemView.extend({
		template: Handlebars.compile( tmplQuery )
		, ui: {
			'startDate': '#start-date',
			'endDate': '#end-date',
			'orderTable': '.order-table',
			'orderTableBody': '.order-table > tbody',
			'query': '.submit'
		}
		, events: {
			'click @ui.query': 'query'
		}
		, className: 'query row'
		, initialize: function( options ) {
			this.app = options;
			this.ordersCollection = options.ordersCollection;
		}
		, onRender: function() {
			var startDate = moment().startOf( 'year' ).format( 'MM/DD/YYYY' );
			var endDate = moment().format( 'MM/DD/YYYY' );
			this.ui.startDate.datepicker({
				defaultDate: startDate
			}).val( startDate );
			this.ui.endDate.datepicker({
				defaultDate: endDate
			}).val( endDate );
			this.query();
		}
		, query: function() {
			this.ui.orderTableBody.empty();

			this.startDate = moment( this.ui.startDate.val() );
			this.endDate = moment( this.ui.endDate.val() );
			
			var ordersCollection    = _.clone( this.ordersCollection.models );
			var totalPurchaseAmount = 0;
			var totalShipping       = 0;
			var totalDiscount       = 0;
			var totalTotalAmount    = 0;

			if( this.startDate && this.endDate ) {
				ordersCollection = _.filter( ordersCollection, _.bind( function( model ) {
					var dateOrdered = moment( model.get( 'DateOrdered' ) );
					if( dateOrdered >= this.startDate && dateOrdered <= this.endDate ) {
						return model;
					}
				}, this ) );
			}
			_.each( ordersCollection, _.bind( function( model ) {
				var dateOrdered    = moment( model.get( 'DateOrdered' ) ).format( 'MMM D, YYYY' );
				var orderId        = model.get( 'OrderID' );
				var purchaseAmount = '$' + model.get( 'PurchaseAmount' ).toFixed( 2 );
				var discount       = model.get( 'DiscountAmount' );
				var shippingCost   = '$' + model.get( 'ShippingCost' ).toFixed( 2 );
				var totalAmount    = '$' + model.get( 'TotalAmount' ).toFixed( 2 );

				totalPurchaseAmount = totalPurchaseAmount + model.get( 'PurchaseAmount' );
				totalShipping       = totalShipping + model.get( 'ShippingCost' );
				totalDiscount       = totalDiscount + model.get( 'DiscountAmount' );
				totalTotalAmount    = totalTotalAmount + model.get( 'TotalAmount' );

				if( discount === 0 ) {
					discount = '---';
				} else {
					discount = '$' + discount.toFixed( 2 );
				}
				this.ui.orderTableBody.append(
					'<tr><td>' + dateOrdered + '</td>' +
					'<td>' + orderId + '</td>' +
					'<td>' + purchaseAmount + '</td>' +
					'<td>' + shippingCost + '</td>' +
					'<td>' + discount + '</td>' +
					'<td>' + totalAmount + '</td></tr>'
				)
			}, this ) );

			this.ui.orderTableBody.prepend(
				'<tr><td></td>' +
				'<td></td>' +
				'<td>$' + totalPurchaseAmount.toFixed( 2 ) + '</td>' +
				'<td>$' + totalShipping.toFixed( 2 ) + '</td>' +
				'<td>$' + totalDiscount.toFixed( 2 ) + '</td>' +
				'<td>$' + totalTotalAmount.toFixed( 2 ) + '</td></tr>'
			)
		}
	});

	return QueryView;
});