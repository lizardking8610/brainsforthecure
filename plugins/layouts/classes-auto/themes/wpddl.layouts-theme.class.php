<?php

abstract class WPDD_LayoutsTheme{
	protected $name;
	protected $slug;

	public function __construct( $name, $slug ) {
		$this->name = $name;
		$this->slug = $slug;
		add_action( 'init', array($this, 'run') );
	}

	public function run(){
		$this->run_hooks();
	}

	protected abstract function run_hooks();
}