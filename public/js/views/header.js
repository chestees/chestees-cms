define( function( require ) {

	var Marionette 		= require( 'marionette' );

	//TEMPLATE
	var tmplHeader = require( 'text!/templates/header.html' );

	options = {};
	var HeaderView = Marionette.ItemView.extend({
		template: _.template( tmplHeader )
		, ui: {
			'logo': '#logo'
		}
		, events: {
			'click @ui.logo': 'showHome'
		}
		, className: ''
		, initialize: function( options ) {
			this.app = options;
		}
		, render: function() {
			this.$el.html( this.template( options ) );
			return this;
		}
		, showHome: function() {
			app.router.navigate( '/' );
		}
	});

	return HeaderView;
});