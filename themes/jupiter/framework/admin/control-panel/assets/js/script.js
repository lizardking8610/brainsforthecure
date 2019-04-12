jQuery("#revoke_button").click(function() {
    if (confirm("Are you sure?")) {
        jQuery("#apikey").val("");
    }
});

jQuery(document).ready(function($) {
    var $uploader = $('.uploader'),
        dragging = false,
        activeClass = 'is-drag';
    $uploader.on('dragover', doEnter);
    $uploader.on('dragleave', doLeave);

    function doEnter() {
        $uploader.addClass(activeClass);
    }

    function doLeave() {
        $uploader.removeClass(activeClass);
    }

    function add_log(message) {
        console.log(new Date().getTime() + ': ' + message);
    }

    function add_file(id, file) {
        var file_name = file.name;
        var clean_name = file_name.replace(/.zip/g, "");
        var template = '' + '<div class="file" id="uploadFile' + id + '">' + '<div class="info">' + '<span class="filename" title="Size: ' + file.size + 'bytes - Mimetype: ' + file.type + '">' + clean_name + ' Template</span><br /><small><span class="status">Waiting</span></small>' + '</div>' + '<div class="bar">' + '<div class="progress" style="width:0%"></div>' + '</div>' + '</div>';
        $('#fileList').prepend(template);
    }

    function update_file_status(id, status, message) {
        $('#uploadFile' + id).find('span.status').html(message).addClass(status);
    }

    function update_file_progress(id, percent) {
        $('#uploadFile' + id).find('div.progress').width(percent);
    }
    // Upload Plugin itself
    $('#drag-and-drop-zone').dmUploader({
        url: ajaxurl,
        dataType: 'json',
        allowedTypes: '*',
        extraData: {
            action: 'abb_install_template_action',
            abb_install_template_security: $("#abb_install_template_security").val()
        },
        onInit: function() {
            add_log('File uploader initialized');
        },
        onBeforeUpload: function(id) {
            add_log('Starting the upload of #' + id);
            update_file_status(id, 'uploading', 'Uploading...');
        },
        onNewFile: function(id, file) {
            doLeave();
            add_log('New file added to queue #' + id);
            add_file(id, file);
        },
        onComplete: function() {
            add_log('All pending tranfers finished');
        },
        onUploadProgress: function(id, percent) {
            var percentStr = percent + '%';
            update_file_progress(id, percentStr);
        },
        onUploadSuccess: function(id, data) {
            add_log('Upload of file #' + id + ' completed');
            add_log('Server Response for file #' + id + ': ' + JSON.stringify(data));
            update_file_status(id, 'success', 'Upload Completed');
            update_file_progress(id, '100%');
            $.ajax({
                url: ajaxurl,
                type: "POST",
                data: "action=abb_get_templates_action",
                success: function(res) {
                    $("#template-list").html(res);
                    mk_import_demos();
                    mk_delete_template();
                }
            });
        },
        onUploadError: function(id, message) {
            add_log('Failed to Upload file #' + id + ': ' + message);
            update_file_status(id, 'error', message);
        },
        onFileTypeError: function(file) {
            add_log('File \'' + file.name + '\' cannot be added: must be a .zip archive');
        },
        onFileSizeError: function(file) {
            add_log('File \'' + file.name + '\' cannot be added: size excess limit');
        },
        onFallbackMode: function(message) {
            alert('Browser not supported(do something else here!): ' + message);
        }
    });

    function mk_import_demos() {
        $('.mk-import-content-btn').click(function(e) {
            var $serilized = 'template=' + $(this).parents('form').find("input[name='template']").val() + '&';
            $serilized += $(this).parents('form').find("input[type='checkbox']").map(function() {
                return this.name + "=" + this.checked;
            }).get().join("&");
            var $import_true = confirm('Are you sure to import dummy content? We highly encourage you to do this action in a fresh WordPress installation!');
            if ($import_true == false) return false;
            $('.import_message').html('<div class="updated settings-error"><div class="import-content-loading">Please be patient while template is being imported. This process may take a couple of minutes.</div></div>');
            var data = {
                action: 'abb_import_demo_action',
                options: $serilized
            };
            $.post(ajaxurl, data, function(response) {
                response = $.parseJSON(response);
                if(response.status == 'error'){
                    $('.import_message').html('<div class="error settings-error">' + response.message + '</div>');    
                }else{
                    var message = '<ol>';
                    $.each(response.message , function(key, value){
                        message += '<li>'+value+'</li>';
                    });
                    message += '</ol>';
                    $('.import_message').html('<div class="updated settings-error"><strong>' + message + '</strong></div>');    
                }
                
            });
            $("html, body").animate({
                scrollTop: 0
            }, "fast");
            e.preventDefault();
        });
    }
    mk_import_demos();

    function mk_delete_template() {
        $('.mk-delete-template-btn').click(function(e) {
            var $delete_template = confirm('Are you sure to delete this template from your server?');
            if ($delete_template == false) return false;
            var data = {
                action: 'abb_delete_template',
                abb_install_template_security: $("#abb_install_template_security").val(),
                template: $(this).parents('form').find("input[name='template']").val()
            };
            $.post(ajaxurl, data, function(response) {
                $("#template-list").html(response);
                mk_delete_template();
                mk_import_demos();
            });
            e.preventDefault();
        });
    }
    mk_delete_template();
});



/* Restore the latest DB
****************/
jQuery(document).ready(function($) {
    jQuery.ajax({
        type: "POST",
        url: ajaxurl,
        data: { action: 'abb_is_restore_db' },
        dataType: "json",
        success: function(response) {
            var data           = response.data,
            list_of_backups    = [],
            latest_backup_file = null,
            created_date       = "";
            $btnRestore        = "";

            list_of_backups = data.list_of_backups;

            if (list_of_backups == null) {
                console.log("List Of Backups is NULL!");
            } else if (list_of_backups.length == 0) {
                console.log("List Of Backups is EMPTY!");
            } else {
                latest_backup_file = data.latest_backup_file;
                created_date = latest_backup_file.created_date;
                $btnRestore = '<a class="mk-restore-template-holder"><span class="mk-restore--text mk-restore-btn">Restore from Last Backup</span><span class="mk-tooltip--text">Restore theme settings to this version: <span class="mk-tooltip--created-date">' + created_date + '</span></span></a>';
                jQuery('.mk-installed-template .mk-restore-template-wrapper').append($btnRestore);
                jQuery('.mk-new-templates .mk-restore-template-holder').hide();
                console.log("Restore Buttons Created Successfully!");
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log("Fail: ", XMLHttpRequest);
        }
    });

    jQuery(document).on( "click", ".mk-restore-btn", function() {
        console.log("Click in .mk-restore-btn");
        jQuery.ajax({
            type: "POST",
            url: ajaxurl,
            data: { action: 'abb_is_restore_db' },
            dataType: "json",
            success: function(response) {
                var created_date = response.data.latest_backup_file.created_date;
                swal({
                    title: mk_cp_textdomain.restore_settings,
                    text: "<p>" + mk_cp_textdomain.you_are_trying_to_restore_your_theme_settings_to_this_date + "<strong class='mk-tooltip-restore--created-date'>" + created_date + "</strong>. Are you sure?</p>",
                    type: "warning",
                    showCancelButton: true,
                    html: true,
                    confirmButtonColor: "#32d087",
                    confirmButtonText: mk_cp_textdomain.restore,
                    closeOnConfirm: false
                }, function () {
                    jQuery.ajax({
                        type: "POST",
                        url: ajaxurl,
                        data: { action: 'abb_restore_latest_db' },
                        dataType: "json",
                        success: function(response) {
                            console.log(response.message);
                            location.reload();
                        },
                        error: function(XMLHttpRequest, textStatus, errorThrown) {
                            console.log("Fail: ", XMLHttpRequest);
                        }
                    });
                });
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                console.log("Fail: ", XMLHttpRequest);
            }
        });
    });
});

/* System Status generate report
****************/
jQuery('a.debug-report').click(function() {
    var report = '';
    jQuery('#status thead, #status tbody').each(function() {
        if (jQuery(this).is('thead')) {
            var label = jQuery(this).find('th:eq(0)').data('export-label') || jQuery(this).text();
            report = report + "\n### " + jQuery.trim(label) + " ###\n\n";
        } else {
            jQuery('tr', jQuery(this)).each(function() {
                var label = jQuery(this).find('td:eq(0)').data('export-label') || jQuery(this).find('td:eq(0)').text();
                var the_name = jQuery.trim(label).replace(/(<([^>]+)>)/ig, ''); // Remove HTML
                var the_value = jQuery.trim(jQuery(this).find('td:eq(2)').text());
                var value_array = the_value.split(', ');
                if (value_array.length > 1) {
                    // If value have a list of plugins ','
                    // Split to add new line
                    var output = '';
                    var temp_line = '';
                    jQuery.each(value_array, function(key, line) {
                        temp_line = temp_line + line + '\n';
                    });
                    the_value = temp_line;
                }
                report = report + '' + the_name + ': ' + the_value + "\n";
            });
        }
    });
    try {
        jQuery("#debug-report").slideDown();
        jQuery("#debug-report textarea").val(report).focus().select();
        //jQuery(this).fadeOut();
        return false;
    } catch (e) {
        console.log(e);
    }
    return false;
});

jQuery(document).ready(function($){
    $('.status_table tr td.help').each(function() {
        var $this = $(this),
            tooltipWidth = $this.find('.mk-tooltip--text').outerWidth();
        if( tooltipWidth > 300 ){
            $this.find('.mk-tooltip--text').css({
                'white-space': 'inherit',
                'width': '300px'
            });
        }else {
            $this.find('.mk-tooltip--text').css({
                'margin-top': '-29px',
            });
        }
        var tooltipHeight = $this.find('.mk-tooltip--text').innerHeight();
        if( tooltipWidth > 300 ){
            $this.find('.mk-tooltip--text').css({
                'margin-top': -tooltipHeight/2,
            });
        }
        $this.find('.mk-tooltip--link').hover(function() {
            $(this).siblings('.mk-tooltip--text').animate({
                'opacity': 1
            }, 100);
        }, function() {
            $(this).siblings('.mk-tooltip--text').animate({
                'opacity': 0
            }, 100);
        });
    });


    $('.cp-update-notice .close-button').on("click", function(e) {
        e.preventDefault();

        var $this = $(this),
            $new_version = $this.attr('data-new-version');
            
            console.log($new_version);

            $.ajax({
                url: ajaxurl,
                type: 'POST',
                dataType: 'json',
                data: {
                  'action': 'mk_dismiss_update_notice',
                  'version': $new_version,
                },
                success: function(data) {
                 $this.parent().fadeOut();
                }
            });

            




    });

});