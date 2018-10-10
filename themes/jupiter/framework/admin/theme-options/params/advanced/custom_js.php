<?php
$advanced_section[] = array(
    "type" => "sub_group",
    "id" => "mk_options_custom_js",
    "name" => __("Advanced / Custom JS", "mk_framework") ,
    "desc" => __("", "mk_framework") ,
    "fields" => array(
        array(
            "name" => __("Custom JS", "mk_framework") ,
            "desc" => __("Enter custom JS to modify/add Theme JS functionalities.", "mk_framework") ,
            "id" => "custom_js",
            "default" => '',
            "rows" => 30,
            "type" => "textarea"
        ) ,
    ) ,
);
