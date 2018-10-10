<?php
if (defined('WPDDL_VERSION')) return;

/** {ENCRYPTION PATCH HERE} **/

define( 'WPDDL_VERSION', '2.0.1' );
define( 'WPDDL_VERSION_OPTION', 'ddl_layouts_plugin_version' );
define( 'WPDDL_VERSIONS_COMPARE_OPTION', 'ddl_layouts_plugin_versions_compare' );
define( 'LAYOUTS_PLUGIN_NAME', 'Toolset Layouts' );
define( 'WPDDL_NOTES_URL', 'https://wp-types.com/version/layouts-2-0-1/' );
define( 'WPDDL_ABSPATH', dirname(__FILE__) );
define( 'WPDDL_RELPATH', plugins_url() . '/' . basename(dirname(__FILE__) ) );

require_once WPDDL_ABSPATH . '/inc/constants.php';

$autoloader_dir = WPDDL_VENDOR_ABSPATH;
if ( version_compare( PHP_VERSION, '5.3.0' ) >= 0 ) {
	$autoloader = $autoloader_dir . '/autoload.php';
} else {
	$autoloader = $autoloader_dir . '/autoload_52.php';
}
require_once $autoloader;

require WPDDL_ONTHEGO_RESOURCES . 'loader.php';
onthego_initialize( WPDDL_ONTHEGO_RESOURCES, WPDDL_RELPATH . '/vendor/toolset/onthego-resources/' );

require_once WPDDL_TOOLSET_COMMON_ABSPATH . '/loader.php';
toolset_common_initialize(WPDDL_TOOLSET_COMMON_ABSPATH, WPDDL_TOOLSET_COMMON_RELPATH);

add_action( 'plugins_loaded', 'ddl_register_layouts_plugin_version' );

if( !function_exists('ddl_register_layouts_plugin_version') ){

	function ddl_register_layouts_plugin_version()
	{
		$previous_version = get_option( WPDDL_VERSION_OPTION, '1.8.9' );
		$version_compare = version_compare( $previous_version, WPDDL_VERSION );

		if( $version_compare === 0 ){
			return;
		} else {
			// register current version
			update_option( WPDDL_VERSION_OPTION, WPDDL_VERSION );
			// track if last update operation was an upgrade (-1) or downgrade (1)
			update_option( WPDDL_VERSIONS_COMPARE_OPTION, $version_compare );
		}
	}
}


add_action( 'after_setup_theme', 'wpddl_plugin_setup', 11 );

if ( !function_exists('wpddl_plugin_setup') ){
    function wpddl_plugin_setup()
    {
        require_once dirname( __FILE__ ) . DIRECTORY_SEPARATOR . 'classes/wpddl.admin.class.php';

        if (file_exists(dirname(__FILE__) . DIRECTORY_SEPARATOR . 'classes/wpddl.admin-embedded.class.php') && defined('WPDDL_EMBEDDED') && (defined('WPDDL_DEVELOPMENT') === false && defined('WPDDL_PRODUCTION') === false)) {

            require_once dirname( __FILE__ ) . DIRECTORY_SEPARATOR . 'classes/wpddl.admin-embedded.class.php';

        } else if (file_exists(dirname(__FILE__) . DIRECTORY_SEPARATOR . 'classes/wpddl.admin-plugin.class.php') && (defined('WPDDL_DEVELOPMENT') || defined('WPDDL_PRODUCTION'))) {

            require_once dirname( __FILE__ ) . DIRECTORY_SEPARATOR . 'classes/wpddl.admin-plugin.class.php';
        }
        require_once WPDDL_INC_ABSPATH . '/help_links.php';
        require_once WPDDL_INC_ABSPATH . '/api/ddl-features-api.php';


        require_once WPDDL_TOOLSET_COMMON_ABSPATH . '/utility/dialogs/toolset.dialog-boxes.class.php';

        require_once WPDDL_CLASSES_ABSPATH . '/wpddl.class.php';

        require_once WPDDL_CLASSES_ABSPATH . '/wpddl.scripts.class.php';


	    $private_layouts = new WPDDL_Private_Layout();
	    $private_layouts->add_hooks();

        if( file_exists( WPDDL_CLASSES_ABSPATH . '/wpddl.PluginLayouts-helper.class.php' ) && ( defined('WPDDL_DEVELOPMENT') || defined('WPDDL_PRODUCTION') ) ){
            require_once WPDDL_CLASSES_ABSPATH . '/wpddl.PluginLayouts-helper.class.php';
        }

        require_once WPDDL_LAYOUTS_EXTRA_MODULES . '/wddl.extra-loader.class.php';

        require_once WPDDL_GUI_ABSPATH . '/dialogs/dialogs.php';

        require_once WPDDL_GUI_ABSPATH . '/dialogs/wpddl.create-cell-dialog.class.php';
        require_once WPDDL_GUI_ABSPATH . '/editor/editor.php';
        require_once WPDDL_GUI_ABSPATH . '/frontend-editor/editor.php';
	    require_once WPDDL_INC_ABSPATH . '/api/ddl-cells-api.php';
        require_once WPDDL_INC_ABSPATH . '/api/ddl-fields-api.php';

        require_once WPDDL_INC_ABSPATH . '/api/ddl-theme-api.php';
        require_once WPDDL_INC_ABSPATH . '/api/ddl-shortcodes.php';

//include_once WPDDL_RES_ABSPATH. '/log_console.php';

// Add theme export menu.
        require_once WPDDL_INC_ABSPATH . '/theme/wpddl.theme-support.class.php';
    }
}

if (file_exists(dirname(__FILE__) . DIRECTORY_SEPARATOR . 'classes/wpddl.layouts-helper.class.php') && defined('WPDDL_EMBEDDED') === false && (defined('WPDDL_DEVELOPMENT') === true || defined('WPDDL_PRODUCTION') === true)) {

	require_once dirname(__FILE__) . DIRECTORY_SEPARATOR . 'classes/wpddl.layouts-helper.class.php';

}

// init plugin
WPDD_LayoutsPlugin::getInstance( new WPDDL_WPML_Support() );