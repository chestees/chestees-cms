define( function( require ) {

	var Backbone     = require( 'backbone' );
	var Marionette   = require( 'marionette' );
	var HeaderView   = require( 'js/views/header' );
	var AsideView    = require( 'js/views/aside' );
	
	var tmplMainLayout 		 = require( 'text!/templates/mainLayout.html' );

	mainLayoutView = Marionette.LayoutView.extend({
		template: _.template( tmplMainLayout )
		, className: 'layout container-fluid'
		, regions: {
			header:    'header'
			, aside:   'aside'
			, article: 'article'
		}
		, initialize: function( options ) {
			this.app = options;
		}
		, onRender: function() {
			this.header.show( new HeaderView( this.app ) );
			this.aside.show( new AsideView() );

			console.log('Main Layout Rendered');
		}
	});

	return mainLayoutView;
});