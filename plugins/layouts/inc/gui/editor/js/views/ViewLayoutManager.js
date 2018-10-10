var DDLayout = DDLayout || {};

jQuery(document).on('DLLayout.admin.before.ready', function(){
    DDLayout.ViewLayoutManager = function( layout_id, layout_name )
    {
        var self = this
            , $button = jQuery('.js-view-layout')
            , id = layout_id
            , name = layout_name
            , $preview_link = jQuery('.js-layout-preview-link')
            , admin
            , layout_view
            , layout_model, save_state
            , option_name = DDLayout_settings.DDL_JS.POPUP_MESSAGE_OPTION;

        self.init = function()
        {
            jQuery(document).on('mousedown', $button.selector, function(event){
                event.preventDefault();
                WPV_Toolset.Utils.loader.loadShow( jQuery(this).parent(), true).css({
                    float:'right',
                    position:'relative',
                    top:'4px'
                });

                admin = DDLayout.ddl_admin_page;
                layout_view = admin.instance_layout_view;
                layout_model = layout_view.model;
                save_state = admin._save_state;

                self.load_items(event );
            });

            self.handle_link_open();
        }

        self.load_items = function( event )
        {
            var params = {
                action:'view_layout_from_editor'
                , 'ddl-view-layout-nonce' : DDLayout_settings.DDL_JS['ddl-view-layout-nonce']
                , layout_id : id
            };

            WPV_Toolset.Utils.do_ajax_post(params, {
                success: function (response) {
                    WPV_Toolset.Utils.loader.loadHide();
                    self.route_actions( response, event );
                },
                error: function (response) {
                    WPV_Toolset.Utils.loader.loadHide();
                    WPV_Toolset.messages.container.wpvToolsetMessage({

                        text: response.error,
                        type: 'error',
                        stay: true,
                        close: false,
                        onOpen: function() {
                            jQuery('html').addClass('toolset-alert-active');
                        },
                        onClose: function() {
                            jQuery('html').removeClass('toolset-alert-active');
                        }
                    });
                }
            });
        };

        self.handle_link_open = function(){
            jQuery(document).on('click', $preview_link.selector,function(e){
                self.handle_post_preview( e, jQuery(this).prop('href'), self.get_layout_type() );
            });
        };

        self.handle_post_preview = function (e, href, layout_type) {

            e.preventDefault();
            var template = _.template(jQuery('#js-virtual-form-tpl').html()),
                params = {
                    href: href,
                    name_prefix: layout_type !== '' ? layout_type + '_' : ''
                },
                target = 'wp-preview-' + id,
                form = template(params);

            jQuery(e.target).append(form);

            var $form = jQuery('#js-virtual-form-preview');

            jQuery('#js-layout-preview-json').val( JSON.stringify( layout_model.toJSON() ) );
            $form.attr('target', target).submit().attr('target', '');
            $form.remove();
            return false;

        };

        self.route_actions = function( data, event )
        {
            if ( data.hasOwnProperty('Data') && data.Data.hasOwnProperty('parent') && data.Data.parent === true ) {

                if( data.Data.hasOwnProperty('count_assignments') &&  data.Data.count_assignments > 0 ){

                    self.handle_message(data.message, "#ddl-layout-children-assignment_display", data.Data);

                } else {
                    self.handle_message(data.message, "#ddl-layout-children-no-assignment_display", data.Data);
                }

            }
            else if (data.hasOwnProperty('Data') && data.Data.length === 1 && data.Data[0].href != '#') {
                self.handleLink(data.Data[0], "#ddl-layout-not-assigned-to-any", data.message, event );
            }
            else if(data.hasOwnProperty('Data') && data.Data.length === 1 && data.Data[0].href == '#'){
                self.handle_message(data.no_preview_message, "#ddl-layout-not-assigned-to-any");
            }
            else if (data.hasOwnProperty('Data') && data.Data.length > 1) {
                self.handle_links(data.Data, "#ddl-layout-assigned-to-many");
            }
            else if (data.hasOwnProperty('layout_type') && data.layout_type === 'private') {
                var prev_state = save_state.requires_save,
                    type = self.get_layout_type();
                save_state.requires_save = true;
                self.handle_post_preview( event, data.post_url, type );
                save_state.requires_save = prev_state;
            }
            else
            {
                self.handle_message(data.message, "#ddl-layout-not-assigned-to-any");
            }
        };

        self.get_layout_type = function( ){
            if( layout_model.get('layout_type') === 'private' ){
                return layout_model.get('layout_type');
            } else if( layout_model.is_parent() ){
                return 'parent';
            } else {
                return '';
            }
            return '';
        };

        self.handle_dialog= function( data, template_id )
        {
            var template = jQuery(template_id).html(),
                tpl = WPV_Toolset.Utils._template(template, data );

            jQuery("#js-view-layout-dialog-container").html( tpl );

            jQuery.colorbox({
                href: '#js-view-layout-dialog-container',
                inline: true,
                open: true,
                closeButton: false,
                fixed: true,
                top: false,

                onComplete: function () {

                },
                onCleanup: function () {

                }
            });
        };

        self.handle_links = function( data, template_id )
        {
            var links = {links:data, layout_name:name};
            self.handle_dialog( links, template_id );
        };

        self.handle_message = function( data, template_id, children ){
            var message = {message:data, layout_name:name};

            if( typeof children !== 'undefined' && children.hasOwnProperty('items') ){
                message.children = children.items;
            }

            self.handle_dialog( message, template_id );

        };

        self.handleLink = function( data, template_id, message, event )
        {
            if( data.href == '' )
            {
                self.handle_message( message, template_id );
            }
            else
            {
                if( self.handle_post_preview( event, data.href, self.get_layout_type() ) === true ){

                    var popup = window.open( data.href );

                    if(  !popup && !jQuery.jStorage.get(option_name)  ){
                        self.popup_blocked_dialog();
                    }
                }

            }

        };

        self.popup_blocked_dialog = function(data){

            var dialog = new DDLayout.ViewLayoutManager.DialogView({
                title:  DDLayout_settings.DDL_JS.strings.popup_blocked,
                modal:false,
                width: 400,
                selector: '#ddl-generic-dialog-tpl',
                template_object: {
                    layout_name: layout_model.get('name'),
                },
                buttons: [
                    {
                        text: DDLayout_settings.DDL_JS.strings.dialog_close,
                        icons: {
                            secondary: ""
                        },
                        click: function () {
                            jQuery(this).ddldialog("close");
                        }
                    },
                ]
            });

            dialog.$el.on('ddldialogclose', function (event) {

                if( jQuery('#disable-popup-message').is(':checked') ){
                    jQuery.jStorage.set(option_name, true);
                }

                dialog.remove();
            });

            dialog.dialog_open();
        };

        self.init();
    };


    DDLayout.ViewLayoutManager.DialogView = DDLayout.DialogView.extend({
        close: function (event, dom, view) {

        },
        open: function (event, dom, view) {

        },
        beforeOpen: function (event, dom, view) {

        },
        beforeClose: function (event, dom, view) {

        },
        create: function (event, dom, view) {

        },
        focus: function (event, dom, view) {

        },
        refresh: function (event, dom, view) {

        }
    });
});
