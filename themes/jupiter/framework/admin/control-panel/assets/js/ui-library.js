(function($) {

	"use strict";


	/*---------------------------------------------------------------------------------*/
	/* Checkbox
	/*---------------------------------------------------------------------------------*/

	$(document).on('click', '.mka-checkbox', function() {

		// Cache
		var $ripple = $(this).siblings('.mka-checkbox-skin').find('.mka-checkbox-ripple');
		var $bullet = $(this).siblings('.mka-checkbox-skin').find('.mka-checkbox-bullet');
		var $bullet_inactive = $(this).siblings('.mka-checkbox-skin').find('.mka-checkbox-bullet-inactive');
		var is_checked = $(this).attr('checked') || false;

		// Bullet Animate
		if ( is_checked ) {
			TweenLite.to( $bullet, 0.3, { css: { scale: 1, opacity: 1 }, ease: Power1.easeOut, delay: 0 });
			TweenLite.to( $bullet_inactive, 0.3, { css: {  opacity: 0 }, ease: Power1.easeOut, delay: 0 });
		} else {
			TweenLite.to( $bullet, 0.3, { css: { scale: 0.1, opacity: 0 }, ease: Power1.easeOut, delay: 0 });
			TweenLite.to( $bullet_inactive, 0.3, { css: {  opacity: 1 }, ease: Power1.easeOut, delay: 0 });
		}

		// Background Animate
		TweenLite.to( $ripple, 0, { css: { scale: 0.1, opacity: 0 }, ease: Power1.easeOut, delay: 0 });
		TweenLite.to( $ripple, 0.3, { css: { scale: 1, opacity: 1 }, ease: Power1.easeOut, delay: 0 });
		TweenLite.to( $ripple, 0.3, { css: { scale: 1, opacity: 0 }, ease: Power1.easeOut, delay: 0.2 });
		
	});


	/*---------------------------------------------------------------------------------*/
	/* Range Slider
	/*---------------------------------------------------------------------------------*/

	$('.mka-range-input').rangeslider({

	    polyfill: false,

	    // Default CSS classes
	    rangeClass: 'rangeslider',
	    disabledClass: 'rangeslider--disabled',
	    horizontalClass: 'rangeslider--horizontal',
	    verticalClass: 'rangeslider--vertical',
	    fillClass: 'rangeslider__fill',
	    handleClass: 'rangeslider__handle',

	    // Callback function
	    onInit: function() {
	    	this.$element.closest('.mka-wrap').find('.mka-range-val').val(this.value);
	    },

	    // Callback function
	    onSlide: function(position, value) {
	    	this.$element.closest('.mka-wrap').find('.mka-range-val').val(value);
	    },

	    // Callback function
	    onSlideEnd: function(position, value) {

	    }

	});
	
	$(document).on('click', '.mka-range-overlay-btn', function() {
		var $range = $(this).closest('.mka-wrap').find('.mka-range');
		var is_range_slider_hidden = $range.css('display') === 'none'  ? true : false;
		if ( is_range_slider_hidden ) {
			$range.show();
			is_range_slider_hidden = false;
		} else {
			$range.hide();
			is_range_slider_hidden = true;
		}
	});
	$(document).on('click', function(e) {
		if ( $(e.target).hasClass('mka-range') || $(e.target).closest('.mka-range-wrap').length == 0 ) {
			$('.mka-range').hide();
		}
	});

	$(document).on('mouseenter', '.mka-range', function() {
		var $ripple = $(this).find('.rangeslider__ripple-handle');
		TweenLite.to( $ripple, 0, { css: { scale: 0.1, opacity: 0 }, ease: Power1.easeOut, delay: 0 });
		TweenLite.to( $ripple, 0.3, { css: { scale: 1, opacity: 1 }, ease: Power1.easeOut, delay: 0 });
	});
	$(document).on('mouseleave', '.mka-range', function() {
		var $ripple = $(this).find('.rangeslider__ripple-handle');
		TweenLite.to( $ripple, 0.3, { css: { scale: 0.1, opacity: 0 }, ease: Power1.easeOut, delay: 0 });
	});

	// The code for range slider scale effect when it is pressed was writter inside the Plugin's soruce
	// due to the limitations, The custom codes are flagged and can be found searching for "***Edited***"


	/*---------------------------------------------------------------------------------*/
	/* Toggle
	/*---------------------------------------------------------------------------------*/

	$(document).on('click', '.mka-toggle', function() {
		var $input = $(this).find('.mka-toggle-input');
		var $bullet = $(this).find('.mka-toggle-bullet');
		var $ripple = $(this).find('.mka-toggle-bullet-ripple');
		if ( $input.val() === 'true' ) {
			TweenLite.to( $bullet, 0.3, { css: { x: '0%' }, ease: Power1.easeOut, delay: 0 });
			TweenLite.to( $ripple, 0, { css: { scale: 0.1, opacity: 0 }, ease: Power1.easeOut, delay: 0 });
			TweenLite.to( $ripple, 0.3, { css: { scale: 1, opacity: 1 }, ease: Power1.easeOut, delay: 0.05 });
			TweenLite.to( $ripple, 0.2, { css: { opacity: 0 }, ease: Power1.easeOut, delay: 0.3 });
			$(this).removeClass('mka-toggle--active');
			$input.val('false');
		} else {
			TweenLite.to( $bullet, 0.3, { css: { x: '99.5%' }, ease: Power1.easeOut, delay: 0 });
			TweenLite.to( $ripple, 0, { css: { scale: 0.1, opacity: 0 }, ease: Power1.easeOut, delay: 0 });
			TweenLite.to( $ripple, 0.3, { css: { scale: 1, opacity: 1 }, ease: Power1.easeOut, delay: 0.1 });
			TweenLite.to( $ripple, 0.2, { css: { opacity: 0 }, ease: Power1.easeOut, delay: 0.3 });
			$(this).addClass('mka-toggle--active');
			$input.val('true');
		}
	});


	/*---------------------------------------------------------------------------------*/
	/* Image Upload
	/*---------------------------------------------------------------------------------*/

	$(document).on('click', '.mka-image-upload-view-btn', function(e) {
		e.preventDefault();
		var $input = $(this).closest('.mka-wrap').find('.mka-textfield');
		var $view = $(this).closest('.mka-wrap').find('.mka-image-upload-view');
		var is_view_open = $view.css('display') !== 'none'  ? true : false;
		if ( $.trim( $input.val() ).length > 0 ) {
			if ( is_view_open ) {
				$view.hide().find('img').remove();
			} else {
				$view.find('img').remove();
				$view.addClass('mka-image-upload-view--loading');
				$view.show();
				$('<img src="' + $input.val() + '" />').load(function() {
					var $img = $(this);
					$view.removeClass('mka-image-upload-view--loading');
					$view.append( $img );
				});
			}
			
		}
	});

	$(document).on('click', function(e) {
		if ( $(e.target).closest('.mka-image-upload-wrap').length == 0 ) {
			$('.mka-image-upload-view').hide();
		}
	});


	/*---------------------------------------------------------------------------------*/
	/* Options Box
	/*---------------------------------------------------------------------------------*/

	$(document).on('click', '.mka-options-item-wrap', function(e) {
		$(this).addClass('mka-options-item-wrap--active').siblings().removeClass('mka-options-item-wrap--active');
		var $ripple = $(this).find('.mka-options-item-ripple');
		TweenLite.to( $ripple, 0, { css: { scale: 1, opacity: 0 }, ease: Power1.easeOut, delay: 0 });
		TweenLite.to( $ripple, 0.3, { css: { scaleX: 1.2, scaleY: 1.6, opacity: 1 }, ease: Power1.easeOut, delay: 0 });
		TweenLite.to( $ripple, 0.2, { css: { scaleX: 1.4, scaleY: 1.8, opacity: 0 }, ease: Power1.easeOut, delay: 0.2 });
	});


	/*---------------------------------------------------------------------------------*/
	/* Select Box
	/*---------------------------------------------------------------------------------*/

	$(document).on('click', '.mka-select-box', function(e) {
		var $list = $(this).closest('.mka-wrap').find('.mka-select-list-wrap');
		var is_list_open = $list.css('display') !== 'none'  ? true : false;
		if ( is_list_open ) {
			$list.hide();
		} else {
			TweenLite.to( $list, 0, { css: { 'transform-origin': 'top', scaleY: 0.1, scaleX: 1, opacity: 0 }, ease: Power1.easeOut, delay: 0 });
			TweenLite.to( $list, 0.1, { css: { scaleX: 1, opacity: 0.5, display: 'block' }, ease: Power4.easeInOut, delay: 0.0 });
			TweenLite.to( $list, 0.2, { css: { scaleY: 1, opacity: 1, display: 'block' }, ease: Power4.easeInOut, delay: 0 });
			var anim_index = 0,
				$anim_elements = $list.find('.mka-select-list-item').css('opacity', '0');
			var interval = setInterval( function() {
				TweenLite.to( $anim_elements.eq(anim_index), 0, { css: { y: -10 , opacity: 0 }, ease: Power1.easeOut, delay: 0 });
				TweenLite.to( $anim_elements.eq(anim_index), 0.2, { css: { y: 0 , opacity: 1 }, ease: Power4.easeOut, delay: 0 });
				if ( ++anim_index > $anim_elements.size() ) clearInterval(interval);
			}, 25);
		}
	});
	$(document).on('click', function(e) {
		if ( $(e.target).hasClass('mka-select') || $(e.target).closest('.mka-select').length == 0 ) {
			$('.mka-select-box-list-wrap').hide();
		}
	});
	$(document).on('click', '.mka-select-list-item', function(e) {
		var $list = $(this).closest('.mka-wrap').find('.mka-select-list-wrap');
		var $select_box = $(this).closest('.mka-wrap').find('.mka-select-box');
		var $select_box_value = $(this).closest('.mka-wrap').find('.mka-select-box-value');
		var value = $(this).attr('data-value');
		var text = $(this).text();
		$select_box.text( text );
		$select_box_value.val(value);
		$list.hide();
	});


	/*---------------------------------------------------------------------------------*/
	/* Search Box
	/*---------------------------------------------------------------------------------*/

	$('.mka-search-box').on('keypress', function(e) {
		var $search = $(this).closest('.mka-search');
		var $list = $(this).closest('.mka-wrap').find('.mka-search-list');
		$search.addClass('mka-search--active');
		setTimeout( function() {
			$list.show();
			$search.removeClass('mka-search--active');
		}, 2000);
	});
	$(document).on('click', function(e) {
		if ( $(e.target).hasClass('mka-search-wrap') || $(e.target).closest('.mka-search-wrap').length == 0 ) {
			$('.mka-search-list').hide();
		}
	});


	/*---------------------------------------------------------------------------------*/
	/* Font Field
	/*---------------------------------------------------------------------------------*/

	$(document).on('click', '.mka-font-filter-selected', function(e) {
		var $list = $(this).siblings('.mka-font-filter-list');
		var $list_items = $list.children();
		TweenLite.to( $list, 0, { css: { 'transform-origin': 'top', scaleY: 0.1, scaleX: 0.6, opacity: 0 }, ease: Power1.easeOut, delay: 0 });
		TweenLite.to( $list, 0.2, { css: { scaleX: 1, opacity: 0.5, display: 'block' }, ease: Power4.easeInOut, delay: 0.0 });
		TweenLite.to( $list, 0.2, { css: { scaleY: 1, opacity: 1, display: 'block' }, ease: Power4.easeInOut, delay: 0 });

		var anim_index = 0,
			$anim_elements = $list_items;
		$list_items.css('opacity', '0');
		var interval = setInterval( function() {
			TweenLite.to( $anim_elements.eq(anim_index), 0, { css: { y: -10 , opacity: 0 }, ease: Power1.easeOut, delay: 0 });
			TweenLite.to( $anim_elements.eq(anim_index), 0.2, { css: { y: 0 , opacity: 1 }, ease: Power4.easeOut, delay: 0 });
			if ( ++anim_index > $anim_elements.size() ) clearInterval(interval);
		}, 50);
	});
	$(document).on('click', '.mka-font-filter-item', function(e) {
		var $selected = $(this).parent().siblings('.mka-font-filter-selected');
		var value = $(this).attr('data-value');
		var text = $(this).text();
		$selected.text( text ).attr('data-value', value);
		$(this).addClass('mka-font-filter-item--selected').siblings().removeClass('mka-font-filter-item--selected');
		TweenLite.to( $('.mka-font-filter-list'), 0.2, { css: { scaleY: 0.1, scaleX: 0.9, opacity: 0, display: 'none' }, ease: Power4.easeInOut, delay: 0.0 });
		TweenLite.to( $('.mka-font-filter-list').children(), 0.1, { css: {  opacity: 0 }, ease: Power4.easeOut, delay: 0.0 });
	});
	$(document).on('click', function(e) {
		if ( $(e.target).hasClass('mka-font-filter') || $(e.target).closest('.mka-font-filter').length == 0 ) {
			TweenLite.to( $('.mka-font-filter-list'), 0.2, { css: { scaleY: 0.1, scaleX: 0.9, opacity: 0, display: 'none' }, ease: Power4.easeInOut, delay: 0.0 });
			TweenLite.to( $('.mka-font-filter-list').children(), 0.1, { css: {  opacity: 0 }, ease: Power4.easeOut, delay: 0.0 });
		}
	});
	$('.mka-font-field').on('keypress', function(e) {
		var $font_field = $(this).closest('.mka-font');
		var $list = $(this).closest('.mka-wrap').find('.mka-font-list');
		$font_field.addClass('mka-font--active');
		setTimeout( function() {
			$list.show();
			$font_field.removeClass('mka-font--active');
		}, 2000);
	});
	$(document).on('click', function(e) {
		if ( $(e.target).hasClass('mka-font-filter') || $(e.target).closest('.mka-font-filter').length === 1  || $(e.target).closest('.mka-font-wrap').length == 0  ) {
			$('.mka-font-list').hide();
		}
	});


	/*---------------------------------------------------------------------------------*/
	/* Tip Info
	/*---------------------------------------------------------------------------------*/
	
	$(document).on('click', '.mka-tip', function(e) {
		e.preventDefault();
		var $content = $(this).closest('.mka-wrap').find('.mka-tip-content');
		var $ripple = $(this).closest('.mka-wrap').find('.mka-tip-ripple');
		var is_tip_open = $content.css('display') !== 'none'  ? true : false;
		if ( is_tip_open ) {
			TweenLite.to( $content, 0.2, { css: { y: 0, opacity: 0, 'clip-path': 'circle(5% at 9% -9%)', display: 'none' }, ease: Power1.easeInOut, delay: 0 });
		} else {
			TweenLite.to( $content, 0, { css: { y: 0, opacity: 0, 'clip-path': 'circle(5% at 9% -9%)' }, ease: Power4.easeOut, delay: 0 });
			TweenLite.to( $content, 0.3, { css: { y: 0, opacity: 1, 'clip-path': 'circle(150% at 9% -9%)', display: 'block' }, ease: Power1.easeInOut, delay: 0.0 });
		}
		TweenLite.to( $ripple, 0, { css: { scale: 0.1, opacity: 0 }, ease: Power1.easeOut, delay: 0 });
		TweenLite.to( $ripple, 0.3, { css: { scale: 1, opacity: 1 }, ease: Power1.easeOut, delay: 0 });
		TweenLite.to( $ripple, 0.2, { css: { scale: 1, opacity: 0 }, ease: Power1.easeOut, delay: 0.2 });
	});
	$(document).on('click', function(e) {
		if (  $(e.target).closest('.mka-tip-wrap').length == 0  ) {
			var $content = $('.mka-tip-content');
			TweenLite.to( $content, 0.2, { css: { y: 0, opacity: 0, 'clip-path': 'circle(5% at 9% -9%)', display: 'none' }, ease: Power1.easeInOut, delay: 0 });
		}
	});


	/*---------------------------------------------------------------------------------*/
	/* Custom List
	/*---------------------------------------------------------------------------------*/

	// Edit
	$(document).on('click', '.mka-clist-edit', function(e) {
		e.preventDefault();

		// Ripple Effect
		var $ripple = $(this).find('.mka-clist-edit-ripple');
		TweenLite.to( $ripple, 0, { css: { scale: 0.1, opacity: 0 }, ease: Power1.easeOut, delay: 0 });
		TweenLite.to( $ripple, 0.2, { css: { scale: 1, opacity: 1 }, ease: Power1.easeOut, delay: 0 });
		TweenLite.to( $ripple, 0.2, { css: { scale: 1, opacity: 0 }, ease: Power1.easeOut, delay: 0.1 });

		// Edit Functionality
		var $list_item = $(this).closest('.mka-clist-item');
		var $list_item_inner = $list_item.find('.mka-clist-item-inner');
		var $add_box = $(this).closest('.mka-wrap').find('.mka-clist-addbox-clone').clone(true, true).removeClass('mka-clist-addbox-clone');
		var $add_box_apply_btn = $add_box.find('.mka-clist-item-apply-btn');
		var $add_box_cancel_btn = $add_box.find('.mka-clist-item-cancel-btn');
		var $addbox_selectbox = $add_box.find('.mka-select-box-value');
		var $addbox_url = $add_box.find('.mka-clist-addbox-social-url');
		var $social_title = $list_item.find('.mka-clist-social-title');
		var $url = $list_item.find('.mka-clist-social-url');

		$addbox_url.val( $url.text() );
		$addbox_selectbox.val( $social_title.text() );
		$addbox_selectbox.siblings('.mka-select-box').text( $social_title.text() );

		$list_item.css('height', $list_item.outerHeight() + 'px' ).addClass('mka-clist-item--edit');
		$list_item_inner.hide().css('opacity', 0);
		$add_box.appendTo( $list_item ).css('opacity', '0').css('display', 'inline-block');

		TweenLite.to( $add_box, 0, { css: { opacity: 0 }, ease: Power1.easeOut, delay: 0.1 });
		TweenLite.to( $list_item, 0.1, { css: { height: 90 }, ease: Power4.easeOut, delay: 0.1 });
		TweenLite.to( $add_box, 0.1, { css: { opacity: 1 }, ease: Power1.easeOut, delay: 0.2 });
		TweenLite.from( $add_box_apply_btn, 0.1, { css: { scale: 0.01, opacity: 1 }, ease: Power1.easeOut, delay: 0.3	 });
		TweenLite.from( $add_box_cancel_btn, 0.1, { css: { scale: 0.01, opacity: 1 }, ease: Power1.easeOut, delay: 0.3	 });

		TweenLite.to( $list_item, 0, { css: { overflow: 'visible' }, ease: Power1.easeOut, delay: 0.2 });

	});

	// Remove
	$(document).on('click', '.mka-clist-remove', function(e) {
		e.preventDefault();

		// Ripplle Effect
		var $ripple = $(this).find('.mka-clist-remove-ripple');
		TweenLite.to( $ripple, 0, { css: { scale: 0.1, opacity: 0 }, ease: Power1.easeOut, delay: 0 });
		TweenLite.to( $ripple, 0.2, { css: { scale: 1, opacity: 1 }, ease: Power1.easeOut, delay: 0 });
		TweenLite.to( $ripple, 0.2, { css: { scale: 1, opacity: 0 }, ease: Power1.easeOut, delay: 0.1 });

		// Functionality
		var $list_item = $(this).closest('.mka-clist-item');
		TweenLite.to( $list_item, 0.1, { css: { height: 0 }, ease: Power4.easeOut, delay: 0.2 });
		setTimeout(function() {
			$list_item.remove();
		}, 300);

	});

	// Add
	$(document).on('click', '.mka-clist-add', function(e) {
		e.preventDefault();
		var $add_button = $(this);
		var $add_button_text = $add_button.find('.mka-clist-add-text');
		var $list_item = $(this).closest('.mka-wrap').find('.mka-clist-item-clone').clone(true, true).removeClass('mka-clist-item-clone').addClass('mka-clist-item--edit mka-clist-item--add');
		var $list_item_inner = $list_item.find('.mka-clist-item-inner');
		var $add_box = $(this).closest('.mka-wrap').find('.mka-clist-addbox-clone').clone(true, true).removeClass('mka-clist-addbox-clone');
		var $add_box_apply_btn = $add_box.find('.mka-clist-item-apply-btn');
		var $add_box_cancel_btn = $add_box.find('.mka-clist-item-cancel-btn');
		var $list = $(this).closest('.mka-wrap').find('.mka-clist-list');

		$add_button.css({
			top: $add_button.position().top,
			bottom: 'auto',
		});

		$list_item_inner.hide().css('opacity', 0);
		$list_item.append( $add_box );
		$list_item.appendTo( $list ).css('height', '0');
		$add_box.css('opacity', '0').css('display', 'inline-block');

		TweenLite.to( $add_button_text, 0, { css: { opacity: 0 }, ease: Power1.easeOut, delay: 0 });
		TweenLite.to( $add_button, 0.2, { css: { scale: 0.01, display: 'none' }, ease: Power1.easeOut, delay: 0 });

		TweenLite.to( $add_box, 0, { css: { opacity: 0 }, ease: Power1.easeOut, delay: 0.1 });
		TweenLite.to( $list_item, 0.1, { css: { height: 90 }, ease: Power4.easeOut, delay: 0.1 });
		TweenLite.to( $add_box, 0.1, { css: { opacity: 1 }, ease: Power1.easeOut, delay: 0.2 });
		TweenLite.from( $add_box_apply_btn, 0.1, { css: { scale: 0.01, opacity: 1 }, ease: Power1.easeOut, delay: 0.2 });
		TweenLite.from( $add_box_cancel_btn, 0.1, { css: { scale: 0.01, opacity: 1 }, ease: Power1.easeOut, delay: 0.2 });

		TweenLite.to( $list_item, 0, { css: { overflow: 'visible' }, ease: Power1.easeOut, delay: 0.2 });

	});

	$(document).on('click', '.mka-clist-item-apply-btn', function(e) {
		e.preventDefault();
		var $add_button = $(this).closest('.mka-wrap').find('.mka-clist-add');
		var $add_button_text = $add_button.find('.mka-clist-add-text');
		var $list_item = $(this).closest('.mka-clist-item');
		var $add_box = $(this).closest('.mka-clist-addbox');
		var $filed_selectbox = $add_box.find('.mka-select-box-value');
		var $filed_url = $add_box.find('.mka-clist-addbox-social-url');
		var $list_item_inner = $list_item.find('.mka-clist-item-inner');
		var $title = $list_item.find('.mka-clist-social-title');
		var $url = $list_item.find('.mka-clist-social-url');

		if ( $filed_selectbox.val() == "" ) {
			$filed_selectbox.closest('.mka-select-wrap').addClass('mka-select-wrap--error');
			return;
		}
		if ( $filed_url.val() == "" ) {
			$filed_url.addClass('mka-textfield--error');
			return;
		}
		$title.text( $filed_selectbox.val() );
		$url.text( $filed_url.val() );

		TweenLite.to( $list_item, 0, { css: { overflow: 'hidden' }, ease: Power1.easeOut, delay: 0 });

		TweenLite.to( $add_box, 0.1, { css: { opacity: 0, display: 'none' }, ease: Power1.easeOut, delay: 0 });
		TweenLite.to( $list_item, 0.1, { css: { height: 48 }, ease: Power1.easeOut, delay: 0 });
		TweenLite.to( $list_item_inner, 0.1, { css: { display: 'inline-block', opacity: 1 }, ease: Power1.easeOut, delay: 0.1 });

		$add_button.css({
			top: 'auto',
			bottom: '',
		});
		TweenLite.to( $add_button_text, 0, { css: { opacity: 1 }, ease: Power1.easeOut, delay: 0.2 });
		TweenLite.to( $add_button, 0.2, { css: { scale: 1, display: 'block' }, ease: Power1.easeOut, delay: 0.2 });

		setTimeout( function() {
			$add_box.remove();
			$list_item.removeClass('mka-clist-item--edit');
		}, 500);

	});


	$(document).on('click', '.mka-clist-item-cancel-btn', function(e) {
		e.preventDefault();
		var $add_button = $(this).closest('.mka-wrap').find('.mka-clist-add');
		var $add_button_text = $add_button.find('.mka-clist-add-text');
		var $list_item = $(this).closest('.mka-clist-item');
		var $add_box = $(this).closest('.mka-clist-addbox');
		var $list_item_inner = $list_item.find('.mka-clist-item-inner');

		TweenLite.to( $list_item, 0, { css: { overflow: 'hidden' }, ease: Power1.easeOut, delay: 0 });

		$add_button.css({
			top: 'auto',
			bottom: '',
		});
		TweenLite.to( $add_button_text, 0, { css: { opacity: 1 }, ease: Power1.easeOut, delay: 0.2 });
		TweenLite.to( $add_button, 0.2, { css: { scale: 1, display: 'block' }, ease: Power1.easeOut, delay: 0.2 });

		// If cancel is in Add New
		if ( $(this).closest('.mka-clist-item--add').length ) {
			
			TweenLite.to( $add_box, 0.1, { css: { opacity: 0, display: 'none' }, ease: Power1.easeOut, delay: 0 });
			TweenLite.to( $list_item, 0.1, { css: { height: 0, opacity: 0 }, ease: Power1.easeOut, delay: 0 });
			setTimeout( function() {
				$add_box.remove();
				$list_item.remove();
			}, 200);

		// If cancel is in Edit
		} else {

			TweenLite.to( $add_box, 0.1, { css: { opacity: 0, display: 'none' }, ease: Power1.easeOut, delay: 0 });
			TweenLite.to( $list_item, 0.1, { css: { height: 48 }, ease: Power1.easeOut, delay: 0 });
			TweenLite.to( $list_item_inner, 0.1, { css: { display: 'inline-block', opacity: 1 }, ease: Power1.easeOut, delay: 0.1 });
			setTimeout( function() {
				$add_box.remove();
				$list_item.removeClass('mka-clist-item--edit');
			}, 500);

		}

	});



	/*---------------------------------------------------------------------------------*/
	/* Tip Info
	/*---------------------------------------------------------------------------------*/

	$('.mka-modal-warning-btn').on('click', function(e) {
		e.preventDefault();
		$('body').mk_modal({
			title:  'This is a warning title',
	        text: 'this is a warning message',
	        type: 'warning',
	        showCancelButton: true,
	        showConfirmButton: true,
	        showCloseButton: true,
	        showLearnmoreButton: false,
	        showProgress: false,
	        confirmButtonText: 'OK',
	        cancelButtonText: 'Cancel',
			onComplete: function() {
				console.log('Completed');
			}
		});
	});

	$('.mka-modal-error-btn').on('click', function(e) {
		e.preventDefault();
		$('body').mk_modal({
			title:  'This is a error title',
	        text: 'this is a error message',
	        type: 'error',
	        showCancelButton: true,
	        showConfirmButton: true,
	        showCloseButton: true,
	        showLearnmoreButton: true,
	        showProgress: false,
	        confirmButtonText: 'OK',
	        cancelButtonText: 'Cancel',
			onComplete: function() {
				console.log('Completed');
			}
		});
	});

	$('.mka-modal-success-btn').on('click', function(e) {
		e.preventDefault();
		$('body').mk_modal({
			title:  'This is a success title',
	        text: 'this is a success message',
	        type: 'success',
	        showCancelButton: true,
	        showConfirmButton: true,
	        showCloseButton: true,
	        showLearnmoreButton: false,
	        showProgress: false,
	        confirmButtonText: 'OK',
	        cancelButtonText: 'Cancel',
			onComplete: function() {
				console.log('Completed');
			}
		});
	});



	

	
	

})(jQuery);