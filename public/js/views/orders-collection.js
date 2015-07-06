define( function( require ) {
	
	var Marionette = require( 'marionette' );
	var Handlebars = require( 'handlebars' );
	var Moment     = require( 'moment' );

	var OrdersCollection = require( 'js/collections/orders' );

	var tmplOrdersCollection = require( 'text!/templates/orders-collection.html' );
	var OrdersView = require( 'js/views/orders' );
	
	var OrdersCollectionView = Marionette.CompositeView.extend({
		childView: OrdersView
		, childViewContainer: '.cart-container'
		, template: Handlebars.compile( tmplOrdersCollection )
		, ui: {
			recordCount: '.record-count'
			, btnNext: '.btn-next'
			, btnPrevious: '.btn-previous'
		}
		, events: {
			'click @ui.btnNext': 'paging'
			, 'click @ui.btnPrevious': 'paging'
		}
		, initialize: function( options ) {
			this.app = options.app;
			this.collection = this.app.ordersCollection;
			this.page = this.app.appModel.get( 'ordersPage' );
			
			this.listenTo( this.collection, "change", this.render );
		}
		, id: 'orders'
		, childViewOptions: function() {
			return {
				'app': this.app
			}
		}
		, onRender: function() {
			if( !this.app.appModel.has( 'ordersRecordCount' ) ) {
				this.getOrderCount();
			} else {
				this.ui.recordCount.text( this.app.appModel.get( 'ordersRecordCount' ) );
			}
		}
		, paging: function( $event ) {
			var page = $event.currentTarget.dataset.page;

			if( page === 'next' ) {
				this.page++;	
			} else if( page === 'previous' ) {
				this.page--;
			}
			
			this.collection = new OrdersCollection( {
				page: this.page
				, pageSize: 50
				, orderBy: 'DateOrdered'
			} );
			this.collection.fetch().done( _.bind( function() {
				this.render();
			}, this ) );
		}
		, getOrderCount: function() {
			var RecordCountModel = Backbone.Model.extend( {
				url: '/api/count/orders'
			} );

			this.recordCountModel = new RecordCountModel();

			this.recordCountModel.fetch().done( _.bind( function() {
				var recordCount = this.recordCountModel.get( 'recordCount' );
				this.ui.recordCount.text( recordCount );
				this.app.appModel.set( {
					ordersRecordCount: recordCount
				} )
			}, this ) );
		}
	});

	return OrdersCollectionView;
});