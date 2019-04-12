<?php
function mk_adminpanel_textdomain($which_page)
{
    $template_management_textdomain = array(
        'important_notice'                                                 => __('Important Notice', 'mk_framework'),
        'restore_settings'                                                 => __('Restore Settings', 'mk_framework'),
        'installing_sample_data_will_delete_all_data_on_this_website'      => __('Installing a new template will remove all current data on your website. Do you want to proceed?', 'mk_framework'),
        'you_are_trying_to_restore_your_theme_settings_to_this_date'       => __('You are trying to Restore your theme settings to this date: ', 'mk_framework'),
        'yes_install'                                                      => __('Yes, install ', 'mk_framework'),
        'restore'                                                          => __('Restore ', 'mk_framework'),
        'install_sample_data'                                              => __('Install sample data', 'mk_framework'),
        'uninstalling_template_will_remove_all_your_contents_and_settings' => __('Uninstalling template will remove all you current data and settings. Do you want to proceed?', 'mk_framework'),
        'yes_uninstall'                                                    => __('Yes, uninstall ', 'mk_framework'),
        'template_uninstalled'                                             => __('Template uninstalled', 'mk_framework'),
        'hooray'                                                           => __('All Done!', 'mk_framework'),
        'template_installed_successfully'                                  => __('Template is successfully installed.', 'mk_framework'),
        'something_wierd_happened_please_try_again'                        => __('Something wierd happened , Please try again', 'mk_framework'),
        'oops'                                                             => __('Something went wrong!', 'mk_framework'),
        'error_in_network_please_check_your_connection_and_try_again'      => __('Error in network , please check your connection and try again', 'mk_framework'),
        'preview'                                                          => __('Preview', 'mk_framework'),
        'install'                                                          => __('Install', 'mk_framework'),
        'uninstall'                                                        => __('Uninstall', 'mk_framework'),
        'downloading_sample_package_data'                                  => __('Downloading sample package data', 'mk_framework'),
        'install_required_plugins'                                         => __('Install required plugins', 'mk_framework'),
        'install_sample_data'                                              => __('Installing in progress...', 'mk_framework'),
        'installled'                                                       => __('Installed', 'mk_framework'),
        'include_images_and_videos'                                        => __('Include Images and Videos?', 'mk_framework'),
        'would_you_like_to_import_images_and_videos_as_preview'            => __('Would you like to import images and videos as preview? * Notice that all images are <strong>strictly copyrighted</strong> and you need to acquire the license in case you want to use them on your project. {param}', 'mk_framework'),
        'insufficient_system_resource'                                     => __('Insufficient system resource', 'mk_framework'),
        'insufficient_system_resource_notes'                               => __('Your system resource is not enough. Please contact our support or {param} here.', 'mk_framework'),
        'continue_without_media'                                           => __('Continue without Media', 'mk_framework'),
        'do_not_include'                                                   => __('Do not Include', 'mk_framework'),
        'include'                                                          => __('Include', 'mk_framework'),

        // Error Handling Section
        'whoops'                                                           => __('Whoops!', 'mk_framework'),
        'dont_panic'                                                       => __('There seems to be an inconsistency in installing procedure. Don’t panic though—here we’ve listed some possible solutions for you to get back on track.<br>( Warning number : {param}) {param} ', 'mk_framework'),
        'error_in_network_please_check_your_connection_and_try_again'      => __('Error in network , Please check your connection and try again', 'mk_framework'),

    );

    $addon_management_textdomain = array(
        'installing_notice'                           => __('Installing Notice', 'mk_framework'),
        'are_you_sure_you_want_to_install'            => __('Are you sure you want to install <strong>{param}</strong> ?', 'mk_framework'),

        'oops'                                        => __('Oops ..', 'mk_framework'),
        'something_wierd_happened_please_retry_again' => __('Something wierd happened , please retry again', 'mk_framework'),

        'all_done'                                    => __('All Done!', 'mk_framework'),
        'addon_is_successfully_installed'             => __('<strong>{param}</strong> is successfully installed.', 'mk_framework'),

        'important_notice'                            => __('Important Notice', 'mk_framework'),
        'are_you_sure_you_want_to_remove_addon'       => __('Are you sure you want to remove <strong>{param}</strong> Add-on? <br> Note that all any data regarding this add-on will be lost.', 'mk_framework'),
        'conitune'                                    => __('Continue ', 'mk_framework'),

        'deactivating_notice'                         => __('Deactivating Notice ', 'mk_framework'),
        'addon_deactivate_successfully'               => __('<strong>{param}</strong> deactivated successfully.', 'mk_framework'),

        'deactivate'                                  => __('Deactivate', 'mk_framework'),
        'activate'                                    => __('Activate', 'mk_framework'),
        'something_went_wrong'                        => __('Something went wrong!', 'mk_framework'),
    );
    $plugin_management_textdomain = array(
        'installing_notice'                                  => __('Installing Notice', 'mk_framework'),
        'are_you_sure_you_want_to_install'                   => __('Are you sure you want to install <strong>{param}</strong> ?', 'mk_framework'),

        'oops'                                               => __('Oops ..', 'mk_framework'),
        'something_wierd_happened_please_retry_again'        => __('Something wierd happened , please retry again', 'mk_framework'),

        'all_done'                                           => __('All Done!', 'mk_framework'),
        'plugin_is_successfully_installed'                   => __('<strong>{param}</strong> Plugin is successfully installed.', 'mk_framework'),
        'plugin_is_successfully_installed_bulk'              => __('{param} plugins installed successfully.', 'mk_framework'),
        'plugin_is_successfully_installed_activated'         => __('Plugin successfully added and activated.', 'mk_framework'),
        'plugin_is_successfully_updated'                     => __('Plugin successfully updated.', 'mk_framework'),

        'important_notice'                                   => __('Important Notice', 'mk_framework'),
        'are_you_sure_you_want_to_remove_plugin'             => __('Are you sure you want to remove <strong>{param}</strong> Plugin? <br> Note that the plugin files will be removed from your server!', 'mk_framework'),
        'conitune'                                           => __('Continue ', 'mk_framework'),

        'deactivating_notice'                                => __('Deactivating Notice', 'mk_framework'),
        'plugin_deactivate_successfully'                     => __('Plugin deactivated successfully.', 'mk_framework'),
        'plugin_directory_not_writable'                      => __('Plugin directory is not writable.', 'mk_framework'),
        'plugin_directory_not_writable_rppm01x01'            => __('Plugin parent directory is not writable - RPPM01x01.', 'mk_framework'),
        'plugin_directory_not_removable'                     => __('Can not remove directory of plugin.', 'mk_framework'),
        'plugin_directory_not_removable_rppm01x01_directory' => __('Can not remove directory of plugin - RPPM01x01-Directory.', 'mk_framework'),
        'plugin_directory_not_removable_rppm01x01_file'      => __('Can not remove directory of plugin - RPPM01x01-File.', 'mk_framework'),
        'plugin_param_not_exist'                             => __('The plugin ({param}) you are looking for is not exist.', 'mk_framework'),
        'plugin_remove_not_exist'                            => __('Plugin you want to remove is not exist.', 'mk_framework'),
        'plugin_remove_not_exist_rppm01x01'                  => __('Plugin you want to remove is not exist  - RPPM01x01.', 'mk_framework'),
        'plugin_list_not_array'                              => __('Plugin list is not an array , use install method instead.', 'mk_framework'),
        'plugin_list_empty'                                  => __('Plugin list is empty.', 'mk_framework'),
        'plugin_source_not_found_or_invalid'                 => __('Plugins source not found or it have invalid url.', 'mk_framework'),
        'plugin_path_is_not_found'                           => __('Can not find {param} plugin path.', 'mk_framework'),
        'plugin_path_is_not_found_in_active_list'            => __('Can not find plugin path in activate plugin func.', 'mk_framework'),
        'plugin_head_is_not_found'                           => __('Can not find plugin head file name.', 'mk_framework'),

        'deactivate'                                         => __('Deactivate', 'mk_framework'),
        'remove'                                             => __('Remove', 'mk_framework'),
        'activate'                                           => __('Activate', 'mk_framework'),
        'something_went_wrong'                               => __('Something went wrong!', 'mk_framework'),
        'successfull'                                        => __('Successfull', 'mk_framework'),
    );
    switch ($which_page) {
        case 'template-management':
            return $template_management_textdomain;
            break;
        case 'addon-management':
            return $addon_management_textdomain;
            break;
        case 'plugin-management':
            return $plugin_management_textdomain;
            break;
    }
}
