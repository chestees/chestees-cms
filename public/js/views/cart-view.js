define( function( require ) {
	
	var Marionette = require( 'marionette' );
	var Handlebars = require( 'handlebars' );
	var Moment     = require( 'moment' );

	var tmplCart   = require( 'text!/templates/cart.html' );

	var CartView = Marionette.ItemView.extend({
		template: Handlebars.compile( tmplCart )
		, ui: {

		}
		, events: {

		}
		, className: 'cart-item row row-item'
		, templateHelpers: function() {
			var cartDate = moment( this.model.get( 'DateAdded' ) ).format( 'dddd, MMMM Do YYYY, h:mm:ss a' );
			return {
				cartDate: cartDate	
			};
		}
		, onRender: function( options ) {
			if( this.model.get( 'Purchased' ) ) {
				this.$el.addClass( 'bg-success' );
			}
		}
	});

	return CartView;
});