define( function( require ) {

	var Marionette = require( 'marionette' );

	var tmplAside = require( 'text!/templates/aside.html' );

	var AsideView = Marionette.ItemView.extend({
		template: _.template( tmplAside )
		, ui: {
			'sideNavigation': '.side-navigation'
		}
		, initialize: function() {
			
		}
		, onRender: function() {
			this.$el.html( this.template( options ) );
			// this.ui.sideNavigation.affix({
			// 	offset: {
			// 		top: 50
			// 	}
			// });
			return this;
		}
	});
	return AsideView;
});