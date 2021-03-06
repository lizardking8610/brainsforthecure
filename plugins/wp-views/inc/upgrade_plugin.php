<?php

    define ('VIEWS_UPDATE_URL', 'https://toolset.com/?views_plugin_info=1');

    $views_plugins = array('WP Views',);


    add_filter('pre_set_site_transient_update_plugins', 'check_for_views_plugin_updates');
    add_filter('plugins_api', 'get_views_plugin_page', 1, 3);
    
    function check_for_views_plugin_updates($value) {
        // called when the update_plugins transient is saved.
        
        global $views_plugins, $WPV_settings;
        
        if(empty($views_plugins)) return $value;
        
	    if ( function_exists( 'get_plugins' )) {

            
            $plugins = get_plugins();
            // Filter Views plugins
            foreach ($plugins as $key => $plugin) {
                if (!in_array($plugin['Name'], $views_plugins)) {
                    unset($plugins[$key]);
                }
            }
            
            $request = wp_remote_post(VIEWS_UPDATE_URL, array(
                'timeout' => 15,
                'body' => array(
                    'action' => 'update_information',
                    // TODO: Set these keys as false by default
                    'subscription_email' => isset( $WPV_settings->subscription_email ) ? $WPV_settings->subscription_email : false,
                    'subscription_key' => isset( $WPV_settings->subscription_key ) ? $WPV_settings->subscription_key : false,
                    'plugins' => $plugins,
                    'lc' => get_option('WPLANG'),
                    )));
            // TODO we're not returning anything as WP_Error yet
            if ( is_wp_error($request) ) {
                $res = false;
            } else {
                $res = maybe_unserialize($request['body']);
            }
            
            if ($res !== false) {        
                // check for VIEWS plugins
                foreach ($plugins as $key => $plugin) {
                    if(!empty($res[$key])){
                        $value->response[$key] = $res[$key];
                    } else {
                        if (isset($value->response[$key])) {
                            unset($value->response[$key]);
                        }
                    }
                }
            }
        }
        
        return $value;
    }
    
    function get_views_plugin_page($state, $action, $args) {
        global $WPV_settings, $views_plugins;

        $res = false;

        if (isset($args->slug) && $args->slug == "views_all" || @in_array(str_replace('_', ' ', $args->slug), $views_plugins)) {

            if (!isset($args->installed)) {
                $args->installed = "";
            }
            $body_array = array(
                'action' => $action,
                'request' => serialize( $args ),
                'slug' => $args->slug,
                'installed' => $args->installed,
                // TODO: Set these keys as false by default
                'subscription_email' => isset( $WPV_settings->subscription_email ) ? $WPV_settings->subscription_email : false,
                'subscription_key' => isset( $WPV_settings->subscription_key ) ? $WPV_settings->subscription_key : false,
                'lc' => get_option( 'WPLANG' ),
            );

            $request = wp_remote_post(VIEWS_UPDATE_URL, array( 'timeout' => 15, 'body' => $body_array) );
            if ( is_wp_error($request) ) {
                $res = new WP_Error('plugins_api_failed', __('An Unexpected HTTP Error occurred during the API request.', 'wpv-views'), $request->get_error_message() );
            } else {
                $res = maybe_unserialize($request['body']);
                if ( false === $res )
                    $res = new WP_Error('plugins_api_failed', __('An unknown error occurred.', 'sitepress'), $request['body']);
            }
        }
        
        return $res;
    }
?>