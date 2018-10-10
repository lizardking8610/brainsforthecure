<?php
class WPDDL_HelpVideos extends Toolset_HelpVideosFactoryAbstract{

    protected function define_toolset_videos(){
        return  array(
            'layout_template' =>  array(
                'name' => 'layouts_template',
                'url' => 'https://d7j863fr5jhrr.cloudfront.net/Layouts-1-9-for+Template.mp4',
                'screens' => array('toolset_page_dd_layouts_edit'),
                'element' => '.toolset-video-box-wrap',
                'title' => __('Render Views Content Templates with Layouts', 'ddl-layouts'),
                'width' => '820px',
                'height' => '470px'
            ),
            'archive_layout' =>  array(
                'name' => 'layouts_archive',
                'url' => 'https://d7j863fr5jhrr.cloudfront.net/Using-Layouts-for-Archives.mp4',
                'screens' => array('toolset_page_dd_layouts_edit'),
                'element' => '.toolset-video-box-wrap',
                'title' => __('Render Views WordPress Archives with Layouts', 'ddl-layouts'),
                'width' => '820px',
                'height' => '470px'
            ),
            'content_layout' =>  array(
	            'name' => 'content_layout',
	            'url' => $this->get_content_layout_video_url(),
	            'screens' => array('toolset_page_dd_layouts_edit'),
	            'element' => '.toolset-video-box-private-wrap',
	            'title' => __('Design single pages and posts using Layouts plugin', 'ddl-layouts'),
	            'width' => '820px',
	            'height' => '470px'
            ),
        );
    }
    private function get_content_layout_video_url(){

	    if( apply_filters( 'ddl-is_integrated_theme', false ) ){
		    return 'https://d7j863fr5jhrr.cloudfront.net/Layouts-Integrated.mp4';
	    } else {
		    return 'https://d7j863fr5jhrr.cloudfront.net/Layouts-Non-Integrated.mp4';
	    }

    }
}
add_action( 'init', array("WPDDL_HelpVideos", "getInstance") );