define( function( require ) {
	
	var Marionette = require( 'marionette' );
	var Handlebars = require( 'handlebars' );

	var ShirtsCollection = require( 'js/collections/shirts-collection' );
	var ShirtView        = require( 'js/views/shirts-view' );
	
	var ShirtCollectionView = Marionette.CollectionView.extend({
		childView: ShirtView
		, initialize: function( options ) {
			this.app = options;
			this.collection = new ShirtsCollection();
			this.collection.fetch();
		}
		, className: 'summary'
	});

	return ShirtCollectionView;
});