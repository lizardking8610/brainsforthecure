<?php

/**
 * Check current options and compare with the latest option from previous session. Only runs for
 * Ajax request.
 *
 * @author      Ayub Adiputra <ayub@artbees.net>
 * @copyright   Artbees LTD (c)
 * @link        http://artbees.net
 * @since       Version 5.6
 * @package     artbees
 */

class Mk_Check_Theme_Options {

    /**
     * Constructor function to add Ajax action for check current options and comparasion.
     */
    function __construct() {
        // Ajax action.
        add_action( 'wp_ajax_mk_current_theme_options', array( &$this, 'current_theme_options' ) );
        add_action( 'wp_ajax_mk_compare_theme_options', array( &$this, 'compare_theme_options' ) );
    }

    /**
     * Check current theme options when Jupiter Theme Options page loaded.
     */
    public function current_theme_options() {
        $current_options = get_option( THEME_OPTIONS, array() );
        $this->message( 'Initialize theme options data.', true, $current_options );
    }

    /**
     * Compare current theme options with the latest theme options from the previous session.
     * @return bool False, to stop function execution.
     */
    public function compare_theme_options() {
        try {
            $latest_options  = get_option( THEME_OPTIONS, array() );
            $current_options = ( isset( $_POST['options'] ) ? json_decode( stripslashes( $_POST['options'] ), true ) : array() );

            // Check if the options are in array format.
            if ( ! is_array( $latest_options ) || ! is_array( $current_options ) ) {
                throw new Exception( 'Both of the options should be in array format.' );
            }

            // Check if the latest_options is not empty.
            if ( empty( $latest_options ) && ! empty( $current_options ) ) {
                $this->message( 'Theme options have been reset.', true, array( 'reload' => true ) );
            } elseif ( ! empty( $latest_options ) && empty( $current_options ) ) {
                $this->message( 'Theme options have been set.', true, array( 'reload' => true ) );
            } elseif ( empty( $latest_options ) ) {
                throw new Exception( 'Theme options are empty.' );
            }

            // Check the differences between latest and previous options.
            $latest_ser  = array_map( 'serialize', $latest_options );
            $current_ser = array_map( 'serialize', $current_options );
            $result      = array_map( 'unserialize', array_diff_assoc( $latest_ser, $current_ser ) );

            if ( empty( $result ) ) {
                throw new Exception( 'Theme options are up to date.' );
            }

            // Get all changed fields.
            $fields = $this->fields_theme_options( $result );

            if ( empty( $fields ) ) {
                throw new Exception( "Can't get all the fields or null." );
            }

            $data = array(
                'fields'  => $fields,
                'result'  => $result,
                'options' => $latest_options,
            );

            $this->message( 'Get latest theme options.', true, $data );

        } catch ( Exception $e ) {
            $this->message( $e->getMessage(), false );
            return false;
        }
    }

    /**
     * Get theme options fields such as type and value.
     * @param  array $result The changed theme options.
     * @return array         The changed theme options type and value.
     */
    private function fields_theme_options( $result = array() ) {

        if ( ! is_array( $result ) ) {
            return null;
        }

        // Collect the theme options id.
        $field_id = implode( '|', array_keys( $result ) );

        // Get all theme options settings in string.
        $page     = include_once THEME_ADMIN . '/theme-options/masterkey.php';
        $page_opt = ( ! empty( $page['options'] ) ) ? $page['options'] : array();
        $json_opt = json_encode( $page_opt );

        // Find the patterns.
        $preg_pro = preg_match_all( '/\{[^\}\[]+id\"\:\"(' . $field_id . ')\b(.*?)[^\{|^\]]+((\}(?=\,\{))|(\}(?!\,\")))/s', $json_opt, $results );
        $patterns = ( ! empty( $results[0] ) ) ? $results[0] : null;

        if ( empty( $patterns ) ) {
            return null;
        }

        $field_options = array();
        foreach ( $patterns as $key => $value ) {
            $value = json_decode( $value, true );
            if ( ! empty( $value['id'] ) && ! empty( $value['type'] ) ) {
                $field_options[ $value['id'] ]['type']  = $value['type'];
                $field_options[ $value['id'] ]['value'] = $result[ $value['id'] ];
            }
        }

        return $field_options;
    }

    /**
     * Return response contains debug message, status, and data.
     * @param  string $message Message for debugging.
     * @param  bool   $status  Process status.
     * @param  mixed  $data    Return data from process.
     * @return json            Contain message, status, and returned data.
     */
    public function message( $message, $status, $data = null ) {
        $response = array(
            'message' => $message,
            'status'  => $status,
            'data'    => $data,
        );
        header( 'Content-Type: application/json' );
        wp_die( json_encode( $response ) );
    }

}

new Mk_Check_Theme_Options();