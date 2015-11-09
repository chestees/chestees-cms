define( function( require ) {
	
	var Marionette = require( 'marionette' );
	var Handlebars = require( 'handlebars' );
	var Moment     = require( 'moment' );
	var HighCharts = require( 'highcharts' );

	var tmplChart = require( 'text!/templates/chart.html' );

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
			if( this.year === 'all' ) {
				this.year = 2015;
				this.showAll = true;
			}
			this.months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
		}
		, onRender: function( options ) {
			Highcharts.setOptions({
				lang: {
					numericSymbols: null
				}
			});

			$.ajax({
				type: 'get'
				, url: '/api/orders?showAll=' + this.showAll
				, dataType: 'json'
				, contentType: 'application/json'
				, data: {}
				, success: _.bind( function ( data ) {
					numRecords = data.length;
					var year = moment().year();
					var yearDiff;
					var yearStart;
					var yearEnd;
					var orders;
					var monthTotal;
					var yearData;;
					this.series = [];

					if( this.showAll ) {
						this.chartTitle = 'Montly Sales: Total Amounts';
						while ( year > 2007 ) {
							yearData = []
							yearDiff = this.year - year;
							yearStart = moment( year, 'YYYY' ).startOf( 'year' );
							yearEnd = moment( year, 'YYYY' ).endOf( 'year' );
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
								
								yearData.push( monthTotal );

							}, this ) );

							this.series.push( { 'data': yearData, 'name': year } );
							year = year - 1;
						};
					} else {
						this.chartTitle = this.year + ' Montly Sales: Total Amounts';
						yearData = [];
						yearDiff = year - this.year;
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
							yearData.push( monthTotal );
						}, this ) );
						this.series.push( { 'data': yearData, 'name': this.year } );
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
					text: this.chartTitle
				},
				legend: {
					enabled: true
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
						return this.x + ', ' + this.series.name + ': $' + this.y.toFixed( 2 );
					}
				},
				plotOptions: {
					series: {
						shadow: false,
						lineWidth: 1,
						states: {
							hover: {
								enabled: true,
								lineWidth: 2
							}
						},
						marker: {
							enabled: true,
							symbol: 'circle',
							radius: 2,
							fillColor: '#000000',
							lineColor: '#000000',
							states: {
								hover: {
									fillColor: '#ff0000',
									radius: 3
								}
							}
						}
					}
				},
				series: this.series
			});
		}
	});

	return MonthlyView;
});