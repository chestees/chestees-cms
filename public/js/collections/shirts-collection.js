define( function( require ) {

	var Backbone    = require( 'backbone' );
	var ShirtsModel = require( 'js/models/shirt' );

	var ShirtsCollection = Backbone.Collection.extend({
		model: ShirtsModel
		, url: '/api/shirts'
		, initialize: function() {
			console.log('Shirt Collection Initialized');
			this.listenTo( this, "sort", this.render );
		}
		, comparator: function( model ) {
			// return -model.get( 'thumbs' );
		}
	});

	return ShirtsCollection;
});