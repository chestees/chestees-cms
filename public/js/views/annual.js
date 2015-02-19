define( function( require ) {
	
	var Marionette = require( 'marionette' );
	var Handlebars = require( 'handlebars' );
	var Moment     = require( 'moment' );
	var HighCharts = require( 'highcharts' );

	var tmplChart = require( 'text!/templates/chart.html' );

	Highcharts.setOptions({
		lang: {
			numericSymbols: null
		}
	});

	var AnnualView = Marionette.ItemView.extend({
		template: Handlebars.compile( tmplChart )
		, ui: {
			'chart': '#chart'
		}
		, events: {}
		, className: 'annual row'
		, templateHelpers: function() {
			// var cartDate = moment( this.model.get( 'DateAdded' ) ).format( 'dddd, MMMM Do YYYY, h:mm:ss a' );
			// return {
			// 	cartDate: cartDate	
			// };
		}
		, initialize: function() {}
		, onRender: function( options ) {
			$.ajax({
				type: 'get'
				, url: '/api/orders/'
				, dataType: 'json'
				, contentType: 'application/json'
				, data: {}
				, success: _.bind( function ( data ) {
					numRecords = data.length;
					var year = moment().year();
					var yearStart;
					var yearEnd;
					var orders;
					this.dataYears = [];
					this.xAxisYears = [];
					var yearTotal;

					while ( year > 2007 ) {
						yearTotal = 0;
						yearStart = moment( year, 'YYYY' ).startOf( 'year' );
						yearEnd = moment( year, 'YYYY' ).endOf( 'year' );
						
						orders = _.filter( data, _.bind( function( item ) {
							if( moment( item.DateOrdered ).isBetween( yearStart, yearEnd ) ) {
								return( item );
							}
						}, this ) );
						_.each( orders, function( order ) {
							yearTotal = yearTotal + order.TotalAmount;
						});
						this.dataYears.push( yearTotal );
						this.xAxisYears.push( year );

						year = year - 1;
					}
				}, this )
				, error: _.bind( function( res ) {
					console.log( 'error', res );
				}, this )
				, complete: _.bind( function () {
					
				}, this )
			}).done( _.bind( function( data ) {
				this.buildChart();
			}, this ) );

			
		}
		, buildChart: function() {
			this.ui.chart.highcharts({
				chart: {
					type: 'line',
					marginBottom: 70,
					backgroundColor:'#eee',
					borderWidth: 1,
					borderColor: '#a2a2a2',
					plotBackgroundColor: '#fff',
					plotBorderWidth: 1,
					plotBorderColor: '#a2a2a2'
				},
				title: {
					text: 'Annual Sales: Total Amounts'
				},
				legend: {
					enabled: false
				},
				xAxis: {
					categories: this.xAxisYears,
					reversed: true
				},
				yAxis: [{
					title: false,
					gridLineWidth: 1,
					floor: 0,
					labels: {
						format: '${value}'
					}	
				}],
				tooltip: {
					formatter: function () {
						return this.x + ': $' + this.y.toFixed( 2 );
					}
				},
				plotOptions: {
				},
				series: [{
					data: this.dataYears
				}]
			});
		}
	});

	return AnnualView;
});