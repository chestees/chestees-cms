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

	var MonthlyView = Marionette.ItemView.extend({
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
		, initialize: function( options ) {
			this.year = options.year;
			this.months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
		}
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
					var yearDiff = year - this.year;
					var yearStart;
					var yearEnd;
					var orders;
					this.dataYears = [];
					this.xAxisYears = [];
					var monthTotal;

					yearStart = moment( this.year, 'YYYY' ).startOf( 'year' );
					yearEnd = moment( this.year, 'YYYY' ).endOf( 'year' );
					// Filter orders for the selected year
					orders = _.filter( data, _.bind( function( item ) {
						if( moment( item.DateOrdered ).isBetween( yearStart, yearEnd ) ) {
							return( item );
						}
					}, this ) );

					_.each( this.months, _.bind( function( month ) {
						monthTotal = 0;
						var monthStart = moment( month, 'MMM' ).startOf( 'month' ).subtract( yearDiff, 'years');
						var monthEnd   = moment( month, 'MMM' ).endOf( 'month' ).subtract( yearDiff, 'years');
						// Filter orders for the month in the loop
						var filtered = _.filter( orders, function( order ) {
							if( moment( order.DateOrdered ).isBetween( monthStart, monthEnd ) ) {
								return( order );
							}
						} );
						_.each( filtered, function( order ) {
							monthTotal = monthTotal + order.TotalAmount;	
						});
						this.dataYears.push( monthTotal );
					}, this ) );
					
					this.xAxisYears.push( year );

					year = year - 1;

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
					text: this.year + ' Montly Sales: Total Amounts'
				},
				legend: {
					enabled: false
				},
				xAxis: {
					categories: this.months
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

	return MonthlyView;
});