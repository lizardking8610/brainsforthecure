<?php

class WPDD_ThemesFactory{
	private $theme_name;
	private $theme_slug;
	protected $running_instance = null;

	public function __construct() {
		$this->theme_name = $this->get_theme_name();
		$this->theme_slug = $this->get_theme_slug();
		$this->running_instance = $this->load_class();
	}

	private function get_theme_name( ){
		$theme = wp_get_theme();
		$name = $theme->get('Name');
		return $name;
	}

	private function get_theme_slug( ){
		$slug = str_replace('-', '_', sanitize_title( $this->theme_name ) );
		return $slug;
	}

	private function is_theme_integration_active(){
		if( defined( 'TOOLSET_INTEGRATION_PLUGIN_THEME_NAME' ) && TOOLSET_INTEGRATION_PLUGIN_THEME_NAME === $this->theme_name ){
			return true;
		} else {
			return false;
		}
	}

	private function load_class(){

		$class = $this->get_class_name_string();

		if( class_exists( $class ) && !$this->is_theme_integration_active() ){
			$instance = new $class( $this->theme_name, $this->theme_slug );
			return $instance;
		}

		return null;
	}

	private function get_class_name_string(){
		return 'WPDD_LayoutsTheme_' . $this->theme_slug;
	}
}