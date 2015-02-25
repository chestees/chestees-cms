define( function( require ) {
	
	var Marionette = require( 'marionette' );
	var Handlebars = require( 'handlebars' );
	var Moment     = require( 'moment' );
	var HighCharts = require( 'highcharts' );

	var CartView = require( 'js/views/cart-view' );
	var tmplCartCollection = require( 'text!/templates/cart-collection.html' );
	
	var CartCollectionView = Marionette.CompositeView.extend({
		childView: CartView
		, template: Handlebars.compile( tmplCartCollection )
		, ui: {
			'chartModal': '.modal',
			'btnChart': '.show-chart',
			'chart': '.chart'
		}
		, events: {
			'click @ui.btnChart': 'showChart'
		}
		, initialize: function( options ) {
			this.app = options;
			this.collection = this.app.cartCollection;

			this.purchased = 0;
			this.nonPurchased = 0;
			
			this.listenTo( this.collection, "sort", this.render );
		}
		, id: 'shirts'
		, onRender: function() {
			_.each( this.collection.models, _.bind( function( model ) {
				if( model.get( 'Purchased' ) ) {
					this.purchased++;
				} else {
					this.nonPurchased++;
				}
			}, this ) );
		}
		, buildChart: function() {
			var total        = this.purchased + this.nonPurchased;
			var purchased    = this.purchased/total;
			var nonPurchased = this.nonPurchased/total;

			Highcharts.setOptions({
				lang: {
					numericSymbols: null
				}
			});
			this.ui.chart.highcharts({
				chart: {
					type: 'pie',
					options3d: {
						enabled: true,
						alpha: 45,
						beta: 0
					}
				},
				title: {
					text: ''
				},
				tooltip: {
					pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
				},
				plotOptions: {
					pie: {
						allowPointSelect: true,
						cursor: 'pointer',
						depth: 35,
						dataLabels: {
							enabled: true,
							format: '{point.name}'
						}
					}
				},
				series: [{
						type: 'pie',
						name: 'Purchase Percentage',
						data: [
							['Purchased', purchased],
							['Non Purchased', nonPurchased],
					]
				}]
			});
		}
		, showChart: function() {
			this.buildChart();
			this.ui.chartModal.modal( 'show' );
		}
	});

	return CartCollectionView;
});