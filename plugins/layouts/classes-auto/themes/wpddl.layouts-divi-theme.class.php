<?php

class WPDD_LayoutsTheme_divi extends WPDD_LayoutsTheme{

    protected $has_been_removed = false;

	protected function run_hooks() {
		add_filter( 'ddl-render_tab_cell', array( $this, 'render_tab_cell_js' ), 10, 3 );
		add_filter( 'ddl-accordion_open', array( $this, 'render_accordion_cell_js' ), 10, 2 );

		add_action( 'ddl_before_frontend_render_cell', array( $this, 'remove_extra_instances_divi_builder' ), 10, 2 );

		remove_action( 'woocommerce_before_main_content', 'et_divi_output_content_wrapper', 10 );
		remove_action( 'woocommerce_after_main_content', 'et_divi_output_content_wrapper_end', 10 );

		add_filter( 'get_the_archive_title', array( $this, 'divi_woocommerce_show_page_title' ), 10, 1 );

		add_filter('toolset_add_registered_styles', array(&$this, 'add_register_styles'));
		add_filter('toolset_add_registered_script', array(&$this, 'add_register_script'));

		add_action( 'wp_enqueue_scripts', array( $this, 'frontend_enqueue' ) );

		$this->hook_enqueue_backend_scripts();
		$this->hook_enqueue_backend_styles();
	}

	public function render_tab_cell_js( $output, $cell, $tab_id ) {
		ob_start(); ?>
		<script type="text/javascript">
            jQuery( document ).ready( function( $ ) {
                $( '#<?php echo $tab_id; ?>' + ' a' ).click( function( e ) {
                    e.preventDefault();
                    $( this ).tab( 'show' );
                } )
            } );
		</script>
		<?php
		$output = $output . ob_get_clean();

		return $output;
	}

	public function render_accordion_cell_js( $content, $cell ) {
		$cell_id = $cell->get_unique_identifier();
		ob_start(); ?>

		<script type="text/javascript">
            jQuery(document).ready(function($) {
                $('#<?php echo $cell_id; ?> .panel a').on('click', function(e){
                    e.preventDefault();

                    $('#<?php echo $cell_id; ?> .panel a').each(function(i){
                        var tt = $(this).attr('href');
                        $(this).addClass('collapsed');
                        $(tt).removeClass('in').addClass('collapse');
                    });

                    var t = $(this).attr("href");

                    if($(this).hasClass('collapsed')) {
                        $(this).removeClass('collapsed');
                        $(t).removeClass('collapse').addClass('in');
                    } else {
                        $(this).addClass('collapsed');
                        $(t).addClass('collapse').removeClass('in');
                    }

                });
            });
		</script>

		<?php
		$content = $content.ob_get_clean();

		return $content;
	}

	public function divi_woocommerce_show_page_title( $title ) {
		if ( self::is_woocommerce_active() && is_woocommerce() ) {
			if ( is_shop() ) {
				/**
				 * WooCommerce shop plays dual; as a shop page and an archive.
				 * By default, Views short code for archive title output different stuff,
				 * while, theme shows Shop Page title.
				 *
				 * Here, the title is modified to return the title of Shop Page.
				 */
				$shop_page_id = get_option( 'woocommerce_shop_page_id' );
				$title = sprintf( __( '%s', 'ddl-layouts' ), get_the_title( $shop_page_id ) );
			} else if ( is_product_category() ) {
				/**
				 * Just like the above, we need to strip-off the stuff other than the category name, from the title.
				 */
				$title = sprintf( __( '%s', 'ddl-layouts' ), single_cat_title( '', false ) );
			}
		}

		return $title;

	}

	/**
	 * Removes extra instances of Divi Front-end Builder.
	 *
	 * These are invoked by `the_content` filter, added in /themes/Divi/includes/builder/frontend-builder/view.php
	 * Mainly the callback depends on is_main_query() and adds FE builder instance.
	 * Since, the cells (mentioned in $content_cells below) play with the main query, the above callback is trapped.
	 * We need to remove the filter after first execution, for these particular cells.
	 *
	 * @since 1.5
	 */
	public function remove_extra_instances_divi_builder($cell, $renderer) {
		// Cells playing with main query and causing `the_content` filter to be trapped.

		if(isset($_GET['et_fb']) && $_GET['et_fb'] === '1' ) {
			$content_cells = array(
				'cell-text',
				'cell-content-template',
				'views-content-grid-cell',
				'post-loop-views-cell'
			);

			if ( in_array( $cell->get_cell_type(), $content_cells ) && $this->has_been_removed === false ) {
				// Remove the filter
				remove_filter( 'the_content', 'et_fb_app_boot', 1 );
				$this->has_been_removed = true;
			}

			if ( $cell->get_cell_type() === 'cell-post-content' && $this->has_been_removed === true ) {
				add_filter( 'the_content', 'et_fb_app_boot', 1 );
				$this->has_been_removed = false;
			}
		}
	}

	public function frontend_enqueue(){
		do_action( 'toolset_enqueue_styles', array( 'divi-overrides-css' ) );
		do_action( 'toolset_enqueue_scripts', array( 'divi-overrides' ) );

		if( isset( $_GET['toolset_editor'] ) ){
			do_action( 'toolset_enqueue_styles', array( 'divi-overrides-admin-css' ) );
			do_action( 'toolset_enqueue_scripts', array( 'divi-overrides-admin' ) );
		}
	}

	public function add_register_styles( $styles ){

		$styles['divi-overrides-css'] = new WPDDL_style( 'divi-overrides-css', WPDDL_RES_RELPATH . '/css/themes/divi-overrides.css', array(), WPDDL_VERSION, 'screen');
		$styles['divi-overrides-admin-css'] = new WPDDL_style( 'divi-overrides-admin-css', WPDDL_RES_RELPATH . '/css/themes/divi-backend-overrides.css', array(), WPDDL_VERSION, 'screen');

		return $styles;
	}

	public function add_register_script( $script ){

		$script['divi-overrides'] = new WPDDL_script( 'divi-overrides', WPDDL_RES_RELPATH . '/js/themes/divi-frontend-overrides.js', array('underscore', 'jquery'), WPDDL_VERSION, true);
		$script['divi-overrides-admin'] = new WPDDL_script( 'divi-overrides-admin', WPDDL_RES_RELPATH . '/js/themes/divi-admin-overrides.js', array('underscore', 'jquery'), WPDDL_VERSION, true);

		return $script;
	}

	protected function hook_enqueue_backend_scripts() {

		add_action( 'admin_enqueue_scripts', array( $this, 'admin_enqueue' ), 1 );

	}

	protected function hook_enqueue_backend_styles() {

		add_action( 'admin_enqueue_scripts', array( $this, 'admin_styles' ), 1 );

	}

	public function admin_styles(){
		do_action( 'toolset_enqueue_styles', array( 'divi-overrides-admin-css' ) );
	}

	public function admin_enqueue(){
		do_action( 'toolset_enqueue_scripts', array( 'divi-overrides-admin' ) );
	}
}