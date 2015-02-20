define( function( require ) {

	var Marionette = require( 'marionette' );
	var Moment     = require( 'moment' );

	var tmplAside = require( 'text!/templates/aside.html' );

	var AsideView = Marionette.ItemView.extend({
		template: _.template( tmplAside )
		, ui: {
			'sideNavigation': '.side-navigation'
			, 'btn': '.btn'
			, 'btnGroup': 'btn-group'
			, 'annualSalesYears': '.annual-sales-years'
			, 'monthlySalesYears': '.monthly-sales-years'
			, 'dropdownMenu': '.dropdown-menu'
		}
		, events: {
			'click @ui.btn': 'navigate'
		}
		, initialize: function() {
			
		}
		, className: 'row'
		, onRender: function() {
			var width;
			this.buildYearsNav();
			
			_.delay( _.bind( function() {
				width = this.$el.parent().outerWidth();
				height = this.ui.btn.outerHeight();
				this.ui.btn.css( 'width', width-20 );
				this.ui.dropdownMenu.css( {
					'margin-left': width-20
					, 'margin-top': height*-1
					, 'z-index': 5000
				} )
			}, this ), 100 );
		}
		, navigate: function( $event ) {
			window.location = $event.currentTarget.dataset.link;
		}
		, buildYearsNav: function() {
			var year = moment().year();

			while( year > 2007 ) {
				this.ui.annualSalesYears.append( '<li><a href="#/reporting/annual/'+ year +'">'+ year +'</a></li>' );
				this.ui.monthlySalesYears.append( '<li><a href="#/reporting/monthly/'+ year +'">'+ year +'</a></li>' );
				year = moment( year, 'YYYY' ).subtract( 1, 'year').year();
			}
		}
	});
	return AsideView;
});