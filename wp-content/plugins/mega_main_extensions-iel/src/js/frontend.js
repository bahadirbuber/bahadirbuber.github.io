/* 
 * Function for Mega Main Extensions.
 */

/* 
 * INIT function
 */
function mega_main_extensions_init () {
	mme_hide_animated_elements();
	mme_viewport_animation();
	mme_resize_gallery_grid();
	mme_pagination();
	mme_prettyphoto_bind();
	mme_click_triger();
	mme_parallax_bg();
	mme_fullwidth();
	mme_google_visualization();
	mme_show_overflow();
	mme_video_background();
	mme_flexslider();
	mme_toggle();
	mme_functions_in_data();
}
/*  
 * FUNCTIONS
 */
/* 
 * Find data-mm_function and execute function by name in the first argument.
 */
function mme_functions_in_data () {
	jQuery( '*[data-mm_function]' ).each( function( index, element ) {
		args_string = jQuery( this ).attr( 'data-mm_function' );
		args = JSON.parse( args_string.replace( /\'/g, '\"' ) );
		var defaults = {
				function_name: 'mme_fullwidth'
		};
		args = jQuery.extend( {}, defaults, args );
			execute_function_by_name( args[ 'function_name' ], window, args );
	});
}

/* 
 * Execute function by name in the first argument.
 */
function execute_function_by_name( function_name, context, args ) {
	var args = [].slice.call( arguments ).splice(2);
	var namespaces = function_name.split(".");
	var func = namespaces.pop();
	for( var i = 0; i < namespaces.length; i++ ) {
		context = context[ namespaces[ i ] ];
	}
	if ( typeof context[ func ] !== 'undefined' && jQuery.isFunction( context[ func ] ) ) {
		return context[ func ].apply( context, args );
	} else {
		console.log( 'undefined function "' + func + '"' );
	}
}

/* 
 * Hide all elements that then must be animated on mouse scroll.
 */
function mme_hide_animated_elements () {
	jQuery( '.mme_animation[data-mme_animation]').each( function( index, element ) {
		jQuery( element ).addClass( 'no-animated' );
	});
}

/* 
 * Animate (show) all the elements that have come into the viewport.
 */
function mme_viewport_animation () {
	jQuery( '.mme_animation.no-animated:in-viewport(-1)').each( function( index, element ) {
		if ( !jQuery( this ).hasClass( 'animated' ) ) {
			setTimeout( 
				function (){
					animation_name = jQuery( element ).attr( 'data-mme_animation' );
					jQuery( element ).removeClass( 'no-animated ' ).addClass( 'animated ' + animation_name );
				},
				( 1 + index * 100 )
			);
		}
	});
}

/* 
 * Resize some elements of the gallery_grid on window resize.
 */
function mme_resize_gallery_grid () {
	jQuery( '.row_gallery:visible' ).each( function ( index, element ) {
		sample_height = jQuery( element ).find( '.item-prop-2x2:visible:first-child' ).height();
		jQuery( element ).find( '.item-prop-1x2, .item-prop-2x2' ).not( ':first-child' ).each( function( index, element ) {
			jQuery( element ).height( sample_height + 1 );
		});
		jQuery( element ).find( '.item-prop-1x1, .item-prop-2x1' ).each( function( index, element ) {
			jQuery( element ).height( ( sample_height / 2 ) + 1 );
		});

	});
}

/* 
 * AJAX pagination for posts.
 */
function mme_pagination () {
	var mme_container = [];
	var mme_shortcode_atts = [];
	jQuery( '[data-mme_shortcode_atts]' ).unbind().on( 'click', function ( index_2, element_2 ) {
		index_2.preventDefault();
		button_height = jQuery( this ).outerHeight();
		mme_loading_indicator = '<span class="mme_loading_indicator primary_theme_color_before-border" style="width: ' + button_height + 'px;height: ' + button_height + 'px;"></span>';
		mme_shortcode_atts[ index_2 ] = jQuery.parseJSON( jQuery( this ).attr( 'data-mme_shortcode_atts' ) );
		mme_container[ index_2 ] = jQuery( this ).closest( '.mme_container' );


		if ( jQuery( mme_container[ index_2 ] ).find( '.mme_active_sc_page[data-mme_paged="' + mme_shortcode_atts[ index_2 ].paged + '"]' ).length ) {
			// do nothing
		} else if ( jQuery( mme_container[ index_2 ] ).find( '[data-mme_paged="' + mme_shortcode_atts[ index_2 ].paged + '"]' ).length ) {
			jQuery( 'html,body' ).animate({
				scrollTop: mme_container[ index_2 ].offset().top - 90
			}, 600);
			// active row
			jQuery( mme_container[ index_2 ] ).find( '.mme_active_sc_page' ).removeClass( 'mme_active_sc_page' );
			jQuery( mme_container[ index_2 ] ).find( '[data-mme_paged="' + mme_shortcode_atts[ index_2 ].paged + '"]' ).addClass( 'mme_active_sc_page' );
			// active button
			jQuery( mme_container[ index_2 ] ).find( '.mme_active' ).removeClass( 'mme_active' );
			jQuery( this ).addClass( 'mme_active' );
		} else {
			if ( mme_shortcode_atts[ index_2 ].pagination_type == 'load_more' ) {
				jQuery( this ).replaceWith( mme_loading_indicator );
			} else if ( mme_shortcode_atts[ index_2 ].pagination_type == 'pagination' ) {
				jQuery( this ).parent().append( mme_loading_indicator );
				jQuery( 'html,body' ).animate({
					scrollTop: mme_container[ index_2 ].offset().top - 90
				}, 600);
			}
			jQuery.ajax({
				url: window.location.origin + window.location.pathname + '?mm_page=do_shortcode',
				dataType: 'html',
				cache: false,
				global: false,
				type: 'POST',
				data: mme_shortcode_atts[ index_2 ],
				success: function( data ) {
					jQuery( mme_container[ index_2 ] ).find( '.mme_pagination' ).remove();
					mme_active_sc_page_element = jQuery( mme_container[ index_2 ] ).find( '.mme_active_sc_page' );
					jQuery( mme_container[ index_2 ] ).append( jQuery( data ).children() );
					jQuery( '.mme_loading_indicator' ).remove();
					mme_active_sc_page_element.removeClass( 'mme_active_sc_page' );
					mega_main_extensions_init();
				},
				error: function () {
					jQuery( '.mme_loading_indicator' ).remove();
				},
			});
		}
	});
}

/* 
 * prettyphoto trigger.
 */
function mme_prettyphoto_bind () {
	if ( typeof prettyPhoto !== 'undefined' ) {
		jQuery('a[data-rel*="prettyPhoto"]').prettyPhoto({
			hook: 'data-rel',
			slideshow: 4000,
			autoplay: false,
			deeplinking: false,
			social_tools: false
		});
	}
}

/* 
 * click trigger, Mark the element that was clicked.
 */
function mme_click_triger () {
	jQuery( 'body' ).click( function( e ) {  
		if ( jQuery( e.target ).hasClass( 'mme_event-click' ) || jQuery( e.target ).closest( '.mme_container' ).hasClass( 'mme_event-click_parent' ) || jQuery( e.target ).closest( '.mme_flip_box' ).hasClass( 'mme_event-click' ) ) {
			/* Clear all */
			jQuery( '.mme_event-click' ).removeClass( 'mme_event-click' );
			jQuery( '.mme_event-click_parent' ).removeClass( 'mme_event-click_parent' );
			/* removeClasses */
			jQuery( e.target ).removeClass( 'mme_event-click' );
			jQuery( e.target ).closest( '.mme_container' ).removeClass( 'mme_event-click_parent' );
			/* Exception for the mme_flip_box */
			jQuery( e.target ).closest( '.mme_flip_box' ).removeClass( 'mme_event-click' );
		} else {
			/* Clear all */
			jQuery( '.mme_event-click' ).removeClass( 'mme_event-click' );
			jQuery( '.mme_event-click_parent' ).removeClass( 'mme_event-click_parent' );
			/* addClasses */
			jQuery( e.target ).addClass( 'mme_event-click' );
			jQuery( e.target ).closest( '.mme_container' ).addClass( 'mme_event-click_parent' );
			/* Exception for the mme_flip_box */
			jQuery( e.target ).closest( '.mme_flip_box' ).addClass( 'mme_event-click' );				
		}
	});
}

/* 
 * Change background-position for parallax sections.
 */
function mme_parallax_bg ( selector, args ) {
	// recheck 'selector'
	if ( typeof selector != 'undefined' ) {
		selector = selector;
	} else {
		selector = '.mme_parallax_bg';
	}
	jQuery(window).on( 'scroll', function(){
		jQuery( selector + ':in-viewport(-1)' ).each( function () {
			// recheck 'args'
			if ( typeof args != 'undefined' ) {
				arguments = args;
			} else {
				args_string = jQuery( this ).attr( 'data-mm_function_args' );
				arguments = JSON.parse( args_string.replace( /\'/g, '\"' ) );
			}
			// calculations
			scrollTop = jQuery(window).scrollTop();
			windowHeight = jQuery(window).height();
			// edge_of_screen_top = scrollTop;
			edge_of_screen_bottom = scrollTop + windowHeight;
			edge_of_element_top = jQuery( this ).offset().top;
			// edge_of_element_bottom = edge_of_element_top + currentEls.height();
			top_pass = edge_of_screen_bottom - edge_of_element_top;

			// bg_pos_hor
			if ( arguments[ 1 ] == '0' ) {
				bg_pos_hor = '50% ';
			} else {
				bg_pos_hor = top_pass * arguments[ 1 ] + 'px ';
			}

			// bg_pos_ver
			if ( arguments[ 0 ] == '0' ) {
				bg_pos_ver = '50% ';
			} else {
				bg_pos_ver = top_pass * arguments[ 0 ] + 'px ';
			}

			// repos bg image
			jQuery( this ).css('background-position', bg_pos_hor + bg_pos_ver );
		});
	});
};

/* 
 * Change absolute position of elements to make them fullwidth.
 */
function mme_fullwidth ( selector ) {
	// recheck 'selector'
	if ( typeof selector != 'undefined' ) {
		selector = selector;
	} else {
		selector = '.display_type-fullwidth';
	}
	body_width = jQuery( 'body' ).width();
	if ( jQuery( 'body' ).hasClass( 'mm_coercive_styles-enable' ) ) {
		rules_priority = ' !important';
	} else {
		rules_priority = '';
	}
	jQuery( selector ).each( function ( index, element ) {
		offset_left = 0 - jQuery( element ).parent().offset().left;
		jQuery( element ).css({ 'width' : body_width + 'px' + rules_priority, 'left': offset_left + 'px', 'right' : 'auto' + rules_priority });
	});
};

/* 
 * Change overflow hidden property to visible for all parents of an element.
 */
function mme_show_overflow ( selector ) {
	// recheck 'selector'
	if ( typeof selector != 'undefined' ) {
		selector = selector;
	} else {
		selector = '.show_overflow';
	}
	jQuery( selector ).each( function ( index, element ) {
		jQuery( element ).parents().css({ 'overflow': 'visible' });
	});
};

/* 
 * Function for "mme_toggle" shortcode
 */
function mme_toggle ( selector ) {
	jQuery( '.mme_toggle' ).each( function ( index, element ) {
		jQuery( element ).find( '> .head' ).on( 'click', function ( el ) {
			if ( jQuery( element ).hasClass( 'in_the_group' ) && !jQuery( element ).hasClass( 'mme_active' ) ) {
				jQuery( '.mme_toggle.in_the_group' ).removeClass( 'mme_active' );
			}
			jQuery( element ).toggleClass( 'mme_active' );
		});
	});
};

/* 
 * FlexSlider components.
 */
function mme_flexslider ( selector, args ) {
	// defaults
	var defaults = {
			namespace: 'mm_flex-',
			prevText: '',
			nextText: '',
			selector: '.mme_slides > *',
			animationSpeed: 400
	};
	// recheck 'selector'
	if ( typeof selector != 'undefined' ) {
		selector = selector;
	} else {
		selector = '.mme_slider';
	}
	jQuery( selector ).each( function ( index, element ) {
		// recheck 'args'
		if ( typeof args != 'undefined' ) {
			options = args;
		} else {
			options_string = jQuery( this ).attr( 'data-mm_function_args' );
			options = JSON.parse( options_string.replace( /\'/g, '\"' ) );
		}
		options = jQuery.extend( {}, defaults, options );
		// find height of biggest slide and set the same height for all other slides
		jQuery(window).on( 'load resize orientationchange', function(){
			if ( jQuery( element ).hasClass( 'type-circle_tabs' ) ) {
				// do nothing
			} else {
				heights = jQuery( element ).find( options.selector ).map( function ()
				{
					jQuery( this ).height( 'auto' );
					return jQuery( this ).height();
				}).get();
				maxHeight = Math.max.apply( null, heights );
				jQuery( element ).find( options.selector ).height( maxHeight );
			}
		});
		// make flexslider
		jQuery( element ).find( '.mme_slider_slides' ).flexslider( options );
	});
};

/* 
 * typed.js
 */
function mme_typed_text ( args ) {
//	jQuery(function(){
		if ( typeof args[ 'stringsElement' ] == 'string' ) {
			args[ 'stringsElement' ] = jQuery( args[ 'stringsElement' ] );
		}
		jQuery( args[ 'selector' ] ).typed( args );
//	});
}

/* 
 * countup.js
 */
function mme_countup ( args ) {
//	jQuery( '[id*="mme_counter"]' ).text('0');
	jQuery( args[ 'selector' ] + ':in-viewport(-1)').each( function( index, element ) {
		if ( !jQuery( this ).hasClass( 'animated' ) ) {
			jQuery( element ).removeClass( 'no-animated' ).addClass( 'animated' );
			if (( args[ 'stop' ] % 1) != 0) {
				decimals = args[ 'stop' ].toString().split(".")[1].length;  
			} else {
				decimals = 0;
			}
			countup = new CountUp( this, args[ 'start' ], args[ 'stop' ], decimals, args[ 'duration' ], args );
			countup.start();
		}
	});
	jQuery(window).on( 'scroll', function(){
		jQuery( args[ 'selector' ] + ':in-viewport(-1)').each( function( index, element ) {
			if ( !jQuery( this ).hasClass( 'animated' ) ) {
				jQuery( element ).removeClass( 'no-animated' ).addClass( 'animated' );
				if (( args[ 'stop' ] % 1) != 0) {
					decimals = args[ 'stop' ].toString().split(".")[1].length;  
				} else {
					decimals = 0;
				}
				countup = new CountUp( this, args[ 'start' ], args[ 'stop' ], decimals, args[ 'duration' ], args );
				countup.start();
			}
		});
	});
}

/* 
 * Google Visualization
 */
function mme_google_visualization ( selector, args ) {
	// defaults
	var defaults = {
		// dynamic
		chartType: 'LineChart',
		containerId: 'mme_chart',
		options: {},
		dataTable: [
			['Quantity', 'Supply', 'Demand'],
			['10', 800, 100],
			['50', 300, 300],
			['90', 100, 800],
		]
		// static
	};

	// recheck 'selector'
	if ( typeof selector != 'undefined' ) {
		selector = selector;
	} else {
		selector = '.mme_chart';
	}
	if ( jQuery( selector ).length > 0 ) {
		// Add API script
		page_protocol = window.location.protocol;
		link_to_api = page_protocol + '//www.google.com/jsapi?key=AIzaSyAPl89jxT67L2TrYN-IEk3CmNUyvufn4YQ';
		if ( jQuery( 'script[src="' + link_to_api + '"]' ).length == 0 ) {
			var tag = document.createElement( 'script' );
			tag.src = link_to_api;
			var firstScriptTag = document.getElementsByTagName( 'script' )[ 0 ];
			firstScriptTag.parentNode.insertBefore( tag, firstScriptTag );
		}

		// draw each selector
		function draw_charts () {
			var wrap = [];
			jQuery( selector ).each( function ( index, element ) {
				// recheck 'args'
				if ( typeof args != 'undefined' ) {
					options = args;
				} else {
					options_string = jQuery( this ).attr( 'data-mm_function_args' );
					options = JSON.parse( options_string.replace( /\'/g, '\"' ) );
				}
				options = jQuery.extend( {}, defaults, options );
				if ( 
					( ( typeof options.options.height != 'undefined' ) && ( options.options.height == 0 ) )
					|| ( ( typeof options.options.height == 'undefined' ) && ( ( options.chartType == 'PieChart' && ( typeof options.options.theme != 'undefined' ) ) || options.chartType == 'Map' ) )
				) {
					options.options.height = jQuery( this ).width();
					jQuery( this ).height( options.options.height );
				}
				// check dataTable. if attr table is null - try to use content table
				if ( options.dataTable == null || ( typeof options.editor != 'undefined' ) ) {
					html_data = jQuery(element).parent().html();
					regexp = /\<div class="mme_chart_index"\>(.*?)\<\/div\>/gi;
					matches = html_data.match( regexp );
					data_table = [];
					jQuery.each( matches, function( key, val ) {
						data_table[ key ] = JSON.parse( val.replace( regexp, '$1' ) );
					});
					if ( typeof options.haxis_labels != 'undefined' ) {
						data_table.unshift( JSON.parse( options.haxis_labels ) );
					}
					if ( typeof data_table == 'object' && data_table != null && data_table.length > 0 ) {
						if ( options.chartType == 'GeoChart' ) { // for geo chart type
							id = 0;
							jQuery.each( data_table, function( key, val ) {
								if ( typeof val[ 'region' ] != 'undefined' ) {
									id++;
									data_table[ key ][ 0 ] = val[ 'region' ];
									data_table[ key ][ 1 ] = id;
									if ( typeof val[ 'content' ] != 'undefined' ) {
										data_table[ key ][ 2 ] = val[ 'content' ];
									} else {
										data_table[ key ][ 2 ] = '';
									}
									if ( typeof data_table[ key ][ 'color' ] != 'undefined' ) {
										options[ 'options' ][ 'colorAxis' ][ 'colors' ].push( data_table[ key ][ 'color' ] );
									} else {
										options[ 'options' ][ 'colorAxis' ][ 'colors' ].push( '#3498DB' );
									}
									if ( typeof data_table[ key ][ 'extra' ] != 'undefined' ) {
										options[ 'options' ][ 'extra' ].push( data_table[ key ][ 'extra' ] );
									} else {
										options[ 'options' ][ 'extra' ].push( false );
									}
									delete data_table[ key ][ 'region' ];
									delete data_table[ key ][ 'id' ];
									delete data_table[ key ][ 'content' ];
									delete data_table[ key ][ 'color' ];
									delete data_table[ key ][ 'extra' ];
									data_table[ key ] = jQuery.map( data_table[ key ], function( value, inde ) { return [value]; });
								}
							});
							options.dataTable = data_table;
						} else if ( options.chartType == 'Map' ) { // for map chart type
							id = 0;
							options[ 'options' ][ 'icons' ] = {};
							jQuery.each( data_table, function( key, val ) {
								if ( typeof val[ 'address' ] != 'undefined' ) {
									id++;
									data_table[ key ][ 0 ] = val[ 'address' ];
									if ( typeof val[ 'content' ] != 'undefined' ) {
										options[ 'options' ][ 'showTip' ] = true;
										data_table[ key ][ 1 ] = val[ 'content' ];
									} else {
										data_table[ key ][ 1 ] = '';
									}
									if ( typeof data_table[ key ][ 'marker' ] != 'undefined' ) {
										data_table[ key ][ 2 ] = 'marker-' + id;
										options[ 'options' ][ 'icons' ][ 'marker-' + id ] = {};
										options[ 'options' ][ 'icons' ][ 'marker-' + id ][ 'normal' ] = val[ 'marker' ];
										options[ 'options' ][ 'icons' ][ 'marker-' + id ][ 'selected' ] = val[ 'marker' ];
									} else {
										data_table[ key ][ 2 ] = 'default';
										options[ 'options' ][ 'icons' ][ 'default' ] = null;
									}

									delete data_table[ key ][ 'address' ];
									delete data_table[ key ][ 'content' ];
									delete data_table[ key ][ 'marker' ];
									data_table[ key ] = jQuery.map( data_table[ key ], function( value, inde ) { return [value]; });
								}
							});
							options.dataTable = data_table;
						} else { // for all other types of charts
							// Find maximum number of cells among all rows. $max_columns
							max_columns = 0;
							jQuery.each( data_table, function( row_key, row ) {
								if ( typeof row == 'object' ) {
									columns_number_in_row = count( row );
									if ( max_columns < columns_number_in_row ) {
										max_columns = columns_number_in_row;
									}
								}
							});
							// Add null value for each empty cell.
							jQuery.each( data_table, function( row_key, row ) {
								if ( typeof row == 'object' ) {
									columns_number_in_row = count( row );
								} else {
									columns_number_in_row = 0;
								}
								if ( max_columns > columns_number_in_row ) {
									difference = max_columns - columns_number_in_row;
									for ( i = 0; i < difference; i++ ) { 
										row.push( null );
									}
									data_table[ row_key ] = row;
								}
							});
							// Transpose.
							transposed_array = [];
							jQuery.each( data_table, function( row_key, row ) {
								jQuery.each( row, function( column_key, cell ) {
									if ( typeof cell != 'object' ) {
										if ( typeof transposed_array[ column_key ] == 'undefined' ) {
											transposed_array[ column_key ] = [];
										}
										if ( row_key != 0 ) {
											if ( !isNaN( cell ) && cell != null ) {
												cell = cell * 1;
											}
										}
										transposed_array[ column_key ][ row_key ] = cell;
									}
								});
							});
							data_table = transposed_array;
							options.dataTable = data_table;
						}
					}
				}
				// start to drow chart
				wrap[ index ] = new google.visualization.ChartWrapper( options );
				if ( typeof options.options.format != 'undefined' && options.options.format.toLowerCase() == 'svg+png' ) {
					function to_svg_png() {
						title_container = jQuery( '#' + wrap[ index ].getContainerId() ).parent().find( '.chart_title_link' );
						title_text = title_container.text();
						title_container.html( '<a href="' + wrap[ index ].getChart().getImageURI() + '" target="_blank">' + title_text + '</a>' );
					}
					google.visualization.events.addListener( wrap[ index ], 'ready', to_svg_png );
					if ( ( jQuery( element ).parent().find( '.chart_title_link' ).length == 0 ) && ( options.options.title != '' ) ) {
						jQuery( element ).before( '<div class="chart_title_link mme_title mme_alignment-center">' + options.options.title + '</div>' );
						wrap[ index ].setOption( 'title', '' );
					}
				} else if ( typeof options.options.format != 'undefined' && options.options.format.toLowerCase() == 'png' ) {
					function to_png() {
						jQuery( '#' + wrap[ index ].getContainerId() ).html( '<img src="' + wrap[ index ].getChart().getImageURI() + '" alt="' +  wrap[ index ].getOption( 'title' ) + '" title="' +  wrap[ index ].getOption( 'title' ) + '">' );
					}
					google.visualization.events.addListener( wrap[ index ], 'ready', to_png );
				}
				// Add listeners. actions.
				if ( options.chartType == 'GeoChart' ) {
					google.visualization.events.addListener( wrap[ index ], 'select', function( x ) {
						selected = wrap[ index ].getChart().getSelection();
						if ( typeof selected[ 0 ] != 'undefined' && typeof selected[ 0 ][ 'row' ] != 'undefined' ) {
							selected_row = selected[ 0 ][ 'row' ];
							extra = wrap[ index ].getOption( 'extra' );
							if ( typeof extra[ selected_row ] != 'undefined' && extra[ selected_row ] !== false ) {
								document.location = extra[ selected_row ]; 
							}
						}
					});
				}
				wrap[ index ].draw();
//				jQuery(window).on( 'resize orientationchange click', function(){
				jQuery(window).on( 'resize orientationchange', function(){
					wrap[ index ].draw();
				});
			});
		}
		google.load( 'visualization', '1', { packages:['corechart','map'], 'key' : 'AIzaSyAPl89jxT67L2TrYN-IEk3CmNUyvufn4YQ', 'callback' : draw_charts } );
	}
};

/* 
 * Video background.
 */
function mme_video_background ( selector, args ) {
	// defaults
	defaults = {
		// dynamic
		videoId: '2XX5zDThC3U',
		loop: 1,
		end: 1000000,
		start: 0,
		quality: 'large',
		// static
		block_id: 'mme_video_block',
		width: jQuery(window).width(),
		ratio: 16/9,
		mute: 1,
		repeat: 1,
		autoplay: 1
	};

	// recheck 'selector'
	if ( typeof selector != 'undefined' ) {
		selector = selector;
	} else {
		selector = '.mme_video_section .mme_background_block';
	}

	// make array of video elements
	var list_of_videos = [];
	jQuery( selector ).each( function ( index, element ) {
		// recheck 'args'
		if ( typeof args != 'undefined' ) {
			options = args;
		} else {
			options_string = jQuery( this ).attr( 'data-mm_function_args' );
			options = JSON.parse( options_string.replace( /\'/g, '\"' ) );
		}
		options[ 'width' ] = jQuery( this ).width();
		options = jQuery.extend( {}, defaults, options );
		list_of_videos[ index ] = options;
	});

	// to Create new YT.Player object
	window.onYouTubeIframeAPIReady = function() {
		if( ( typeof list_of_videos === 'undefined' ) || ( list_of_videos.length == 0 ) ) {
			return;
		}
		// Add API script
		page_protocol = window.location.protocol;
		link_to_api = page_protocol + '//www.youtube.com/iframe_api';
		if ( jQuery( 'script[src="' + link_to_api + '"]' ).length == 0 ) {
			var tag = document.createElement( 'script' );
			tag.src = link_to_api;
			var firstScriptTag = document.getElementsByTagName( 'script' )[ 0 ];
			firstScriptTag.parentNode.insertBefore( tag, firstScriptTag );
		}
		// Call players
		jQuery.each( list_of_videos, function( key, options ) {
			var player = create_player( options );
		});
	}

	// to Create new YT.Player object
	function create_player( options ) {
		if ( typeof YT === 'undefined' ) { return };
		temp_player = new YT.Player( options.block_id, {
			width: options.width,
			height: Math.ceil(options.width / options.ratio),
			videoId: options.videoId,
			playerVars: {
				// dynamic
				end: options.end,
				loop: options.loop,
				start: options.start,
				suggestedQuality: options.quality,
				// static
				autoplay: 1,
				controls: 0,
				disablekb: 1,
				fs: 0,
				modestbranding: 1,
				origin: window.location.origin,
				playsinline: 1,
				rel: 0,
				showinfo: 0,
				wmode: 'transparent'
			},
			events: {
				'onReady': on_player_ready,
				'onStateChange': on_player_state_change
			}
		});
		return temp_player;
	}

	// to play video if API ready
	window.on_player_ready = function(e) {
		options_string = jQuery( e.target.getIframe() ).parent().attr( 'data-mm_function_args' );
		options = JSON.parse( options_string.replace( /\'/g, '\"' ) );
		options = jQuery.extend( {}, defaults, options );
		options[ 'width' ] = jQuery( '#' + options.block_id ).parent().width();

		jQuery(window).on('resize orientationchange', function() {
			video_bg_resize( options );
		})
		jQuery( e.target.getIframe() ).parent().find( '.play_pause' ).unbind().on( 'click', function(button) {
			button.preventDefault();
			if ( e.target.getPlayerState() == 0 ) {
				e.target.seekTo( options.start );
			}
			if ( e.target.getPlayerState() == 1 ) {
				e.target.pauseVideo();
			}
			if ( e.target.getPlayerState() == 2 ) {
				e.target.playVideo();
			}
		});
		jQuery( e.target.getIframe() ).parent().find( '.mute' ).unbind().on('click', function( button ) {
			button.preventDefault();
			if ( e.target.isMuted() ) {
				e.target.unMute()
				jQuery( this ).removeClass( 'is_muted' );
			} else {
				e.target.mute();
				jQuery( this ).addClass( 'is_muted' );
			}
		});

		video_bg_resize( options );
		if ( options.mute ) {
			e.target.mute();
			jQuery( jQuery( e.target.getIframe() ).parent().find( '.mute' ) ).addClass( 'is_muted' );
		}
		e.target.setPlaybackQuality( options.quality );
		e.target.seekTo( options.start );
		e.target.playVideo();
	}

	// to repeat if video end
	window.on_player_state_change = function(e) {
		options_string = jQuery( e.target.getIframe() ).parent().attr( 'data-mm_function_args' );
		options = JSON.parse( options_string.replace( /\'/g, '\"' ) );
		options = jQuery.extend( {}, defaults, options );
		options[ 'width' ] = jQuery( '#' + options.block_id ).parent().width();
		if ( e.data === 0 && options.loop ) { // video ended and repeat option is set true
			e.target.seekTo(options.start); // restart
		}
		if ( ( e.target.getPlayerState() == 1 ) || ( e.target.getPlayerState() == 2 ) ) {
			jQuery( '#' + options.block_id ).parent().removeClass( 'show_replacement_image' );
		} else {
			jQuery( '#' + options.block_id ).parent().addClass( 'show_replacement_image' );
		}
	}

	// to resize iFrame
	video_bg_resize = function( options ) {
		var width = jQuery( '#' + options.block_id ).parent().width(),
			pWidth, // player width, to be defined
			height = jQuery( '#' + options.block_id ).parent().height(),
			pHeight, // player height, tbd
			resPlayer = jQuery( '#' + options.block_id );
		if (width / options.ratio < height) {
			pWidth = Math.ceil(height * options.ratio);
			resPlayer.width(pWidth).height(height).css({left: (width - pWidth) / 2, top: 0});
		} else {
			pHeight = Math.ceil(width / options.ratio);
			resPlayer.width(width).height(pHeight).css({left: 0, top: (height - pHeight) / 2});
		}
	}

	// call initial function
	onYouTubeIframeAPIReady( list_of_videos );		
}; // function mme_video_background END

/* 
 * INIT
 */
jQuery(document).ready(function(){
	mega_main_extensions_init();
	/* 
	 * EVENTS
	 */
	jQuery(window).on( 'scroll endOfCounting', function(){
		mme_viewport_animation();
	});

	jQuery(window).on( 'resize orientationchange', function(){
		mme_resize_gallery_grid();
		mme_parallax_bg();
		mme_fullwidth();
	});

	jQuery(window).on( 'vc_reload', function(){
		mega_main_extensions_init();
	});

	/* 
	 * Mega Smooth scroll.
	 */
	if ( jQuery( '.mega_smooth_scroll_trigger' ).length ){
		function ms_init(){if(!document.body)return;var e=document.body;var t=document.documentElement;var n=window.innerHeight;var r=e.scrollHeight;ms_root=document.compatMode.indexOf("CSS")>=0?t:e;ms_activeElement=e;ms_initdone=true;if(top!=self){ms_frame=true}else if(r>n&&(e.offsetHeight<=n||t.offsetHeight<=n)){ms_root.style.height="auto";if(ms_root.offsetHeight<=n){var i=document.createElement("div");i.style.clear="both";e.appendChild(i)}}if(!ms_fixedback){e.style.backgroundAttachment="scroll";t.style.backgroundAttachment="scroll"}if(ms_keyboardsupport){ms_addEvent("keydown",ms_keydown)}}function ms_scrollArray(e,t,n,r){r||(r=1e3);ms_directionCheck(t,n);ms_que.push({x:t,y:n,lastX:t<0?.99:-.99,lastY:n<0?.99:-.99,start:+(new Date)});if(ms_pending){return}var i=function(){var s=+(new Date);var o=0;var u=0;for(var a=0;a<ms_que.length;a++){var f=ms_que[a];var l=s-f.start;var c=l>=ms_animtime;var h=c?1:l/ms_animtime;if(ms_pulseAlgorithm){h=ms_pulse(h)}var p=f.x*h-f.lastX>>0;var d=f.y*h-f.lastY>>0;o+=p;u+=d;f.lastX+=p;f.lastY+=d;if(c){ms_que.splice(a,1);a--}}if(t){var v=e.scrollLeft;e.scrollLeft+=o;if(o&&e.scrollLeft===v){t=0}}if(n){var m=e.scrollTop;e.scrollTop+=u;if(u&&e.scrollTop===m){n=0}}if(!t&&!n){ms_que=[]}if(ms_que.length){setTimeout(i,r/ms_framerate+1)}else{ms_pending=false}};setTimeout(i,0);ms_pending=true}function ms_wheel(e){if(!ms_initdone){ms_init()}var t=e.target;var n=ms_overflowingAncestor(t);if(!n||e.defaultPrevented||ms_isNodeName(ms_activeElement,"embed")||ms_isNodeName(t,"embed")&&/\.pdf/i.test(t.src)){return true}var r=e.wheelDeltaX||0;var i=e.wheelDeltaY||0;if(!r&&!i){i=e.wheelDelta||0}if(Math.abs(r)>1.2){r*=ms_stepsize/120}if(Math.abs(i)>1.2){i*=ms_stepsize/120}ms_scrollArray(n,-r,-i);e.preventDefault()}function ms_keydown(e){var t=e.target;var n=e.ctrlKey||e.altKey||e.metaKey;if(/input|textarea|embed/i.test(t.nodeName)||t.isContentEditable||e.defaultPrevented||n){return true}if(ms_isNodeName(t,"button")&&e.keyCode===ms_key.spacebar){return true}var r,i=0,s=0;var o=ms_overflowingAncestor(ms_activeElement);var u=o.clientHeight;if(o==document.body){u=window.innerHeight}switch(e.keyCode){case ms_key.up:s=-ms_arrowscroll;break;case ms_key.down:s=ms_arrowscroll;break;case ms_key.spacebar:r=e.shiftKey?1:-1;s=-r*u*.9;break;case ms_key.pageup:s=-u*.9;break;case ms_key.pagedown:s=u*.9;break;case ms_key.home:s=-o.scrollTop;break;case ms_key.end:var a=o.scrollHeight-o.scrollTop-u;s=a>0?a+10:0;break;case ms_key.left:i=-ms_arrowscroll;break;case ms_key.right:i=ms_arrowscroll;break;default:return true}ms_scrollArray(o,i,s);e.preventDefault()}function ms_mousedown(e){ms_activeElement=e.target}function ms_setCache(e,t){for(var n=e.length;n--;)ms_cache[ms_uniqueID(e[n])]=t;return t}function ms_overflowingAncestor(e){var t=[];var n=ms_root.scrollHeight;do{var r=ms_cache[ms_uniqueID(e)];if(r){return ms_setCache(t,r)}t.push(e);if(n===e.scrollHeight){if(!ms_frame||ms_root.clientHeight+10<n){return ms_setCache(t,document.body)}}else if(e.clientHeight+10<e.scrollHeight){overflow=getComputedStyle(e,"").getPropertyValue("overflow");if(overflow==="scroll"||overflow==="auto"){return ms_setCache(t,e)}}}while(e=e.parentNode)}function ms_addEvent(e,t,n){window.addEventListener(e,t,n||false)}function ms_removeEvent(e,t,n){window.removeEventListener(e,t,n||false)}function ms_isNodeName(e,t){return e.nodeName.toLowerCase()===t.toLowerCase()}function ms_directionCheck(e,t){e=e>0?1:-1;t=t>0?1:-1;if(ms_direction.x!==e||ms_direction.y!==t){ms_direction.x=e;ms_direction.y=t;ms_que=[]}}function ms_pulse_(e){var t,n,r;e=e*ms_pulseScale;if(e<1){t=e-(1-Math.exp(-e))}else{n=Math.exp(-1);e-=1;r=1-Math.exp(-e);t=n+r*(1-n)}return t*ms_pulseNormalize}function ms_pulse(e){if(e>=1)return 1;if(e<=0)return 0;if(ms_pulseNormalize==1){ms_pulseNormalize/=ms_pulse_(1)}return ms_pulse_(e)}var ms_framerate=150;var ms_animtime=500;var ms_stepsize=150;var ms_pulseAlgorithm=true;var ms_pulseScale=6;var ms_pulseNormalize=1;var ms_keyboardsupport=true;var ms_arrowscroll=50;var ms_frame=false;var ms_direction={x:0,y:0};var ms_initdone=false;var ms_fixedback=true;var ms_root=document.documentElement;var ms_activeElement;var ms_key={left:37,up:38,right:39,down:40,spacebar:32,pageup:33,pagedown:34,end:35,home:36};var ms_que=[];var ms_pending=false;var ms_cache={};setInterval(function(){ms_cache={}},10*1e3);var ms_uniqueID=function(){var e=0;return function(t){return t.ms_uniqueID||(t.ms_uniqueID=e++)}}();jQuery.browser.chrome=/chrome/.test(navigator.userAgent.toLowerCase());if(jQuery.browser.chrome){ms_addEvent("mousedown",ms_mousedown);ms_addEvent("mousewheel",ms_wheel);ms_addEvent("load",ms_init)};
	} // mega_smooth_scroll_trigger END

}); // jQuery(document).ready END