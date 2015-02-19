define( function( require ) {
	
	var Marionette = require( 'marionette' );
	var Handlebars = require( 'handlebars' );
	var Moment     = require( 'moment' );

	var tmplProductSummary = require( 'text!/templates/product-summary.html' );

	var ProductSummaryView = Marionette.ItemView.extend({
		template: Handlebars.compile( tmplProductSummary )
		, ui: {

		}
		, events: {

		}
		, className: 'product-summary'
		, templateHelpers: function() {
			// var cartDate = moment( this.model.get( 'DateAdded' ) ).format( 'dddd, MMMM Do YYYY, h:mm:ss a' );
			return {
				// cartDate: cartDate	
			};
		}
		, initialize: function() {
			$.ajax({
				type: 'get'
				, url: '/api/shirts'
				, dataType: 'json'
				, contentType: 'application/json'
				, data: {}
				, success: _.bind( function ( data ) {
					numRecords = data.length;
					_.each( data, _.bind( function( item, key ) {
						this.model = item;
						this.buildShirtList( item, key );
						console.log( item );
					}, this ) );
				}, this )
				, error: _.bind( function( res ) {
					console.log( 'error', res );
				}, this )
				, complete: _.bind( function () {
				
				}, this )
			});
		}
		, onRender: function( options ) {
			console.log( );
		}
		, buildShirtList: function( shirt ) {
			this.$el.append( '<h1>' + shirt.Product + '</h1>' );
		}
	});

	return ProductSummaryView;
});