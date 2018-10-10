'use strict'

var DDLayout = DDLayout || {};

//Models namespace / paths
DDLayout.models = {};
DDLayout.models.abstract = {};
DDLayout.models.cells = {};
DDLayout.models.collections = {};

//Views namespaces / paths
DDLayout.views = {};
DDLayout.views.abstract = {};

// AMD scripts loading
DDLayout_settings.DDL_JS.ns = head;
DDLayout_settings.DDL_JS.ns.js(
    // Dependecies
    DDLayout_settings.DDL_JS.lib_path + "backbone_overrides.js"
    , DDLayout_settings.DDL_JS.lib_path + "he/he.min.js"
    , DDLayout_settings.DDL_JS.common_rel_path + "/res/lib/jstorage.min.js"
    , DDLayout_settings.DDL_JS.common_rel_path + "/utility/js/keyboard.min.js"
    , DDLayout_settings.DDL_JS.editor_lib_path + 'parent-helper.js'
    //DDLayout_settings.DDL_JS.editor_lib_path + "preview-manager.js",

    // Models
    , DDLayout_settings.DDL_JS.editor_lib_path + "models/abstract/Element.js"
    , DDLayout_settings.DDL_JS.frontend_editor_lib_path + 'models/Parent.js'
    , DDLayout_settings.DDL_JS.editor_lib_path + "models/collections/Cells.js"
    , DDLayout_settings.DDL_JS.editor_lib_path + "models/collections/Rows.js"
    , DDLayout_settings.DDL_JS.editor_lib_path + "models/cells/Cell.js"
    , DDLayout_settings.DDL_JS.editor_lib_path + "models/cells/Row.js"
    , DDLayout_settings.DDL_JS.editor_lib_path + "models/cells/Spacer.js"
    , DDLayout_settings.DDL_JS.editor_lib_path + "models/cells/Layout.js"
    , DDLayout_settings.DDL_JS.editor_lib_path + "models/cells/Container.js"
    , DDLayout_settings.DDL_JS.editor_lib_path + "models/cells/Tabs.js"
    , DDLayout_settings.DDL_JS.editor_lib_path + "models/cells/Tab.js"
    , DDLayout_settings.DDL_JS.editor_lib_path + "models/cells/Accordion.js"
    , DDLayout_settings.DDL_JS.editor_lib_path + "models/cells/Panel.js"
    , DDLayout_settings.DDL_JS.editor_lib_path + "models/cells/ThemeSectionRow.js"

    // Collections
    , DDLayout_settings.DDL_JS.editor_lib_path + "models/collections/Rows.js"
    , DDLayout_settings.DDL_JS.editor_lib_path + "models/collections/Cells.js"

    // Views
    , DDLayout_settings.DDL_JS.frontend_editor_lib_path + 'views/FrontendEditorToolbarView.js'
    , DDLayout_settings.DDL_JS.frontend_editor_lib_path + "views/abstract/ElementView.js"
    , DDLayout_settings.DDL_JS.frontend_editor_lib_path + "views/abstract/CollectionView.js"
    , DDLayout_settings.DDL_JS.frontend_editor_lib_path + "views/ContainerView.js"
    , DDLayout_settings.DDL_JS.frontend_editor_lib_path + "views/ParentLayoutView.js"
    , DDLayout_settings.DDL_JS.frontend_editor_lib_path + "views/ContextMenuView.js"
    , DDLayout_settings.DDL_JS.frontend_editor_lib_path + "views/CellView.js"
    , DDLayout_settings.DDL_JS.frontend_editor_lib_path + "views/CellsView.js"
    , DDLayout_settings.DDL_JS.frontend_editor_lib_path + "views/RowsView.js"
    , DDLayout_settings.DDL_JS.frontend_editor_lib_path + "views/RowView.js"
    , DDLayout_settings.DDL_JS.frontend_editor_lib_path + "views/ContainerRowView.js"
    , DDLayout_settings.DDL_JS.frontend_editor_lib_path + "views/TabsTabView.js"
    , DDLayout_settings.DDL_JS.frontend_editor_lib_path + "views/TabsView.js"
    , DDLayout_settings.DDL_JS.frontend_editor_lib_path + "views/AccordionPanelView.js"
    , DDLayout_settings.DDL_JS.frontend_editor_lib_path + "views/AccordionView.js"
    , DDLayout_settings.DDL_JS.frontend_editor_lib_path + "views/SpacerView.js"
    , DDLayout_settings.DDL_JS.frontend_editor_lib_path + "views/LayoutView.js"
    , DDLayout_settings.DDL_JS.frontend_editor_lib_path + "views/ThemeSectionRowView.js"
    , DDLayout_settings.DDL_JS.editor_lib_path + "views/UndoRedo.js"
    , DDLayout_settings.DDL_JS.editor_lib_path + "views/KeyHandler.js"
    , DDLayout_settings.DDL_JS.editor_lib_path + "views/SaveState.js"
    , DDLayout_settings.DDL_JS.editor_lib_path + "ddl-wpml-box.js"
    , DDLayout_settings.DDL_JS.editor_lib_path + 'ddl-saving-saved-box.js'

    // Dialogs
    , DDLayout_settings.DDL_JS.dialogs_lib_path + "default-dialog.js"
    , DDLayout_settings.DDL_JS.dialogs_lib_path + "dialog-repeating-fields.js"
    , DDLayout_settings.DDL_JS.dialogs_lib_path + "html-properties/HtmlAttributesHandler.js"
    , DDLayout_settings.DDL_JS.dialogs_lib_path + "css-cell-dialog.js"
    , DDLayout_settings.DDL_JS.dialogs_lib_path + "row-edit-dialog.js"
    , DDLayout_settings.DDL_JS.dialogs_lib_path + "container-edit-dialog.js"
    , DDLayout_settings.DDL_JS.dialogs_lib_path + 'theme-section-row-edit-dialog.js'
    , DDLayout_settings.DDL_JS.dialogs_lib_path + 'tab-edit-dialog.js'
    , DDLayout_settings.DDL_JS.dialogs_lib_path + 'panel-edit-dialog.js'
    , DDLayout_settings.DDL_JS.editor_lib_path + 'ddl-edit-tabs.js'
    , DDLayout_settings.DDL_JS.editor_lib_path + 'ddl-edit-accordion.js',
    // Backbone doesn't support inheritance of default attributes
    // let's tell all cells that should inherit defaults from element
    // and allow attributes override
    function () {
        _.each(DDLayout.models.cells, function (item, key, list) {
            if (list.hasOwnProperty(key)) {
                _.defaults(DDLayout.models.cells[key].prototype.defaults, DDLayout.models.abstract.Element.prototype.defaults);
            }
            else {
                console.info("Your model should inherit from Element object");
            }
        });
    }
)

DDLayout.AdminPage = function () {
    var self = this,
        layout_views = {},
        dialog = null,
        layouts = {},
        response_count = 0;

    _.extend( DDLayout.AdminPage.prototype, new DDLayout.AdminPageAbstract(jQuery) );
    
    self.go_to_editor_menu_selector = '.js-edit-layout-menu';

    self.SPECIAL_CELLS_OPTIONS = DDLayout_settings.DDL_JS.SPECIAL_CELLS_OPTIONS;
    self.DONT_RE_RENDER = [
        'Panel',
        'Tab'
    ];

    self.init = function () {

        _.bindAll(self, 'open_info_dialog');
        self.toolbar = new DDLayout.views.FrontendEditorToolbarView();
        self.htmlAttributesHandler = new DDLayout.HtmlAttributesHandler;
        self.wpml_handler = new DDLayout.WPMLBoxHandler();
        self.dialog = new DDLayout.DefaultDialog();
        self.errors_div = jQuery('.js-ddl-message-container');

        // init models
        var elements = jQuery('.js-hidden-json-textarea');

        elements.each(function(){
            var base64 = jQuery(this).text(),
                json = jQuery.parseJSON(WPV_Toolset.Utils.editor_decode64( base64) );

            layouts[json.slug] = new DDLayout.models.cells.Layout(json);

            // init views
            layout_views[json.slug] = new DDLayout.views.LayoutView({
                model: layouts[json.slug]
            });
        });

        self.open_edit_layouts_dropdown();

        self.listenTo(self, 'open-Cell-dialog', self.open_cell_dialog);
        self.listenTo(self, 'open-Row-dialog', self.show_row_dialog);
        self.listenTo(self, 'open-Tab-dialog', self.show_tab_dialog);
        self.listenTo(self, 'open-Accordion-dialog', self.show_accordion_dialog);
        self.listenTo(self, 'open-Panel-dialog', self.show_panel_dialog);
        self.listenTo(self, 'open-Tabs-dialog', self.show_tabs_dialog);
        self.listenTo(self, 'open-Container-dialog', self.show_container_dialog);
        self.listenTo(self, 'open-ThemeSectionRow-dialog', self.show_theme_section_row_dialog);

        self.listenTo(self, 'open-info-dialog', self.open_info_dialog);
        self.listenTo(self, 'ddl-events-over-on', self.events_over_on);
        self.listenTo(self, 'ddl-events-over-off', self.events_over_off);
        self.listenTo(self, 'context-menu-opened', self.openContextMenu);
        self.listenTo(self, 'context-menu-closed', self.closeContextMenu);
        self.listenTo( self, 'layout_element_model_changed_from_dialog', self.save_layout_from_dialog );
        self.listenTo( self, 'save_layout', self.save_layout );

        self.listenTo( self, 'layout_update_additional_css_classes_array', self.update_css_classes_array );
        self.listenTo( self, 'layout_generate_chosen_selector', self.run_chosen_selector );

        Toolset.hooks.addFilter('ddl_save_layout_params', function(params, instance){
            params.post_id = DDLayout_settings.DDL_JS.current_post;
            return params;
        });

        jQuery(document).on('cbox_closed', self.save_and_close_handler);
        jQuery(document).on('cbox_complete', self.dialog_complete_handler);
        jQuery(document).on('cbox_open', self.dialog_open_handler);
        jQuery(document).on('cbox_load', self.dialog_load_handler);
        jQuery(document).on('cbox_cleanup', self.dialog_close_handler);

        _.defer( function(){
            _.each(layouts, function(layout){
                self.init_wpml_vars(layout);
            });
        });

        self.undo_redo = new DDLayout.UndoRedo();
        self._save_state = new DDLayout.SaveState();

        self.init_hover_events();
    };


    self.update_css_classes_array = function(css_classes_tosave){

        if( typeof DDLayout_settings !== 'undefined' &&
            css_classes_tosave !== null &&
            jQuery.isArray( css_classes_tosave ) === true &&
            DDLayout_settings.DDL_JS &&
            jQuery.isArray( DDLayout_settings.DDL_JS.layouts_css_properties.additionalCssClasses ) === true )
        {
            var all_classes = DDLayout_settings.DDL_JS.layouts_css_properties.additionalCssClasses.concat( css_classes_tosave );
            DDLayout_settings.DDL_JS.layouts_css_properties.additionalCssClasses = all_classes.filter(function (item, pos) {return all_classes.indexOf(item) == pos});
        }

    };

    self.run_chosen_selector = function( array_with_classes, $context ){
        var chosen_args = {
            'width': "555px",
            'no_results_text': 'Press Enter to add new entry:',
            'display_selected_options': false,
            'display_disabled_options': false
        };

        if( $context ){
            jQuery('select.js-toolset-chosen-select', $context ).toolset_chosen_multiple( chosen_args, DDLayout_settings.DDL_JS.layouts_css_properties.additionalCssClasses, array_with_classes );
        } else {
            jQuery('select.js-toolset-chosen-select', jQuery('#ddl-row-edit') ).toolset_chosen_multiple( chosen_args, DDLayout_settings.DDL_JS.layouts_css_properties.additionalCssClasses, array_with_classes );
        }

    };



    self.resetContextMenu = function( event ){
        event.stopPropagation();

        if( !self.instance_layout_view ) return false;

        try{
            if( self.instance_layout_view.context_menu_opened === false ){
                return false;
            }

            self.instance_layout_view.contextMenuReset(event);

        } catch( e ){

            return false;

        }

        return false;
    };

    self.openContextMenu = function( event ){

        if( !self.instance_layout_view ) return false;

        try{

            if( self.instance_layout_view.context_menu_opened ){
                return false;
            }

            self.instance_layout_view.openContextMenu();

        } catch( e ){

            return false;

        }

        return false;
    };

    self.closeContextMenu = function( event ){

        if( !self.instance_layout_view ) return false;

        try{

            if( self.instance_layout_view.context_menu_opened === false ){
                return false;
            }
            self.instance_layout_view.closeContextMenu(  );
            self.instance_layout_view.clearOverlay(  );
            self.events_over_on( );

        } catch( e ){

            return false;

        }

        return false;

    };

    self.dialog_complete_handler = function(){

    };

    self.dialog_open_handler = function(){

    };

    self.dialog_close_handler = function(){
        if( self.is_saving === false ){
            self.init_hover_events();
        }
    };

    self.save_and_close_handler = function( event ){
        if( self.is_saving && self.dialog_will_close ){
            jQuery('body').loaderOverlay('hide');
            jQuery('body').loaderOverlay('show');
        }
    };

    self.dialog_load_handler = function(){
        jQuery('body').loaderOverlay('hide');
    };

    self.get_layouts = function(){
        return layouts;
    };

    self.get_layouts_as_array = function(){
        return _.toArray( layouts );
    };

    self.init_hover_events = function(){
        self.events_over_off();
        self.events_over_on();
    };

    self.events_over_on = function () {
        // Draw overlay & context menu vor Visual editor cells only
        jQuery(document).on('mouseenter', '.js-ddl-frontend-editor-cell', self.handle_over);
        // Draw overlay & context menu vor Visual editor cells only
        jQuery(document).on('mouseleave', '.js-ddl-frontend-editor-cell', self.handle_out);
    };
    self.events_over_off = function(){
        // Draw overlay & context menu vor Visual editor cells only
        jQuery(document).off('mouseenter', '.js-ddl-frontend-editor-cell',self.handle_over);
        // Draw overlay & context menu vor Visual editor cells only
        jQuery(document).off('mouseleave', '.js-ddl-frontend-editor-cell', self.handle_out);
    };
    self.handle_over = function(event){
        // console.log( 'check parent', jQuery(this).is(event.target), jQuery(this).prop('class'), jQuery(event.target).prop('class') );

        event.stopPropagation();
        event.stopImmediatePropagation();

        var slug = event.currentTarget.dataset.layout_slug,
            type = event.currentTarget.dataset.type;


        self.set_current(slug);


        try{
            self.get_current().renderOverlay(event);
        } catch( e ){
            console.log( e.message );
        }

    };
    self.handle_out = function(event){
        // console.log( 'check child leave', jQuery(this).is(event.target), jQuery(this).prop('class'), jQuery(event.target).prop('class') );

        event.stopPropagation();
        event.stopImmediatePropagation();

        try{
            self.get_current().clearOverlay(event);
        } catch( e ){
            console.log( e.message );
        }

        if( self.is_saving === false ){
            self.set_current(null);
        }
    };

    self.set_current = function( slug ){
        self.instance_layout_view = layout_views[slug];
    };

    self.get_current = function(){
        return self.instance_layout_view;
    };

    self.get_all_instances = function(){
        return layout_views;
    };

    self.before_open_dialog = function(){
        self.closeContextMenu();
        jQuery('body').loaderOverlay('hide');
        jQuery('body').loaderOverlay('show');
    };

    self.save_layout = function( caller ){
        var layout_len = _.toArray(layout_views).length;

        self.is_saving = true;
        jQuery('body').loaderOverlay('hide');
        jQuery('body').loaderOverlay('show');

        self.trigger('ddl-events-over-off');

        _.each(layout_views, function( layout_view ) {
            try{
                layout_view.saveLayout( function( response, model, el ){
                    console.log( arguments );
                    response_count++;
                    if( response_count === layout_len ){
                        self.is_saving = false;
                        response_count = 0;
                        jQuery('body').loaderOverlay('hide');
                        self.trigger('ddl-events-over-on');
                        _.delay(function(){
                            self.errors_div.find('.ddl-messages').fadeOut(400, function(){

                            });
                        }, 6000);
                    }
                }, caller, {action:'save_layout_data_front_end'} );
            } catch( e ){
                console.log( e.message );
            }
        });

    };

    self.save_layout_from_dialog = function (caller, element, model_cached, css_saved, dialog_instance) {

        var element_model = element.model,
            current_view = element,
            element_layout = jQuery( element.el ).data('layout_slug');

        if( _.isString( element_layout ) && element_layout !== self.instance_layout_view.model.get('slug') ){
            self.set_current( element_layout );
        }

        self.is_saving = true;
        self.dialog_will_close = jQuery(caller).data('close') === 'yes';

        if( self.DONT_RE_RENDER.indexOf( element.model.get('kind') ) !== -1 ){
            self.reset_ajax( null );
            return;
        }

        self.instance_layout_view.model.trigger('save_layout_to_server',

            function ( response, model, el ) {

                if( response && response.Data && response.Data.current_element_html ){

                    if( element_model.get('kind') === 'Row' && jQuery( current_view.el ).parent().hasClass('container') ){
                        var index = jQuery( current_view.el ).parent().index(),
                            $parent = jQuery( current_view.el ).parent(),
                            $new_parent = jQuery( current_view.el ).parent().parent();

                        $parent.remove();
                        var new_el = $new_parent.insertAtIndex( index, jQuery(response.Data.current_element_html) );

                    } else {
                        var new_el = jQuery( response.Data.current_element_html ).replaceAll( current_view.$el );
                        jQuery('.nav-tabs').show();
                        jQuery('.tab-content').show();
                    }

                    current_view.setElement( Toolset.hooks.applyFilters( 'ddl-save_layout_from_dialog_content_updated', new_el, element_model )  );

                    jQuery( current_view.el ).data( 'layout_slug', self.instance_layout_view.model.get('slug') );

                    if (element instanceof Backbone.View) {
                        dialog_instance.setCachedElement( element_model.toJSON() );
                    }
                }

                self.reset_ajax(caller);

            }, caller, {element_model : element_model, action : 'render_element_changed'} );
    };

    self.reset_ajax = function(caller){
        _.defer(function(){
            self.is_saving = false;
            if( self.dialog_will_close === true ){
                jQuery('body').loaderOverlay('hide');
                self.dialog_will_close = false;
                self.set_current(null);
                self.init_hover_events();
            }
        });
    };

    self.save_state_changed = function( state ){
        if( state ){
            // console.log('has been saved');
        }
    };

    /**
     * @deprecated
     * @param options
     * @param model
     */
    self.open_info_dialog = function( options, model ){

        var self = this, main_view = self.get_current(), model = model.toJSON();
        model.layout = main_view ? _.extend( {}, main_view.model.toJSON() ) : {};
        model.link = '';

        if( DDLayout_settings.DDL_JS.user_dismissed_dialogs ){
            self.redirect_user( model );
            return;
        }

        dialog = new DDLayout.DialogView({
            title:  DDLayout_settings.DDL_JS.strings.cell_not_editable_in_front_end_title.replace('%CELL%', model.cell_type),
            modal:false,
            resizable: false,
            draggable: false,
            position: {my: "center", at: "center", of: window},
            width: options.width ? options.width : 250,
            selector: '#ddl-info-dialog-tpl',
            template_object: model,
            dialogClass: 'ddl-dialogs-container wp-core-ui',
            buttons: [
                {
                    text: DDLayout_settings.DDL_JS.strings.dialog_cancel,
                    icons: {},
                    class: 'cancel button',
                    click: function() {

                        dialog.dialog_close();

                    }
                },
                {
                    text: DDLayout_settings.DDL_JS.strings.cell_edit_back_end_button.replace('%CELL%', model.cell_type),
                    icons: {},
                    class: 'backend button button-primary',
                    click: function() {

                        dialog.dialog_close();

                        _.defer(function () {
                            self.redirect_user(model);
                        });

                    }
                }
            ],
        });


        dialog.$el.on('ddldialogclose', function (event) {

            dialog.remove();

            if( options.callback instanceof Function ){
                options.callback.call( self, event, options, model, self );
            }

            self.handle_dismiss_dialog();

        });

        dialog.dialog_open();
    };

    /**
     * @deprecated
     * @param model
     */
    self.redirect_user = function( model ){
        var edit_url = self.get_edit_url( model ),
        win = window.open(edit_url, '_blank');
        win.focus();
    };

    /**
     * @deprecated
     */
    self.handle_dismiss_dialog = function(){

        var $checkbox = jQuery('input[name="ddl_popup_blocked_dismiss"]', this.$el );

        console.log( 'checkbox is checked ', $checkbox.is(':checked') );

        if( $checkbox.is(':checked') ){
            var params = {
                'action': 'ddl_dialog_dismiss',
                'ddl_dialog_dismiss_nonce' : jQuery('input[name="ddl_dialog_dismiss_nonce"]').val(),
                'dismiss_dialog' : true,
                'dismiss_dialog_option' : 'ddl_dismiss_dialog_message'
            };
            WPV_Toolset.Utils.do_ajax_post(params, {
                success:function( response, obj ){
                    console.log('success', arguments);
                },
                error: function( response, obj ){
                    console.log('error', arguments);
                },
                fail:function( response, obj ){
                    console.log('fail', arguments);
                }
            });
        }
    };

    self.get_edit_url = function( model ){
        var options = self.SPECIAL_CELLS_OPTIONS[model.cell_type];

        if( !options  ) return '';

        if( model.cell_type == 'child_layout' ){
            var post_id = model.layout.id;
        } else {
            var post_id = model.content[options.field];
        }

        return options.url.replace('%POST_ID%', post_id);
    };

    self.toolset_resource_nice_name = function( model ){
        var options = self.SPECIAL_CELLS_OPTIONS[model.cell_type];

        if( !options  ) return '';

        return options.nice_name;
    };

    self.open_edit_layouts_dropdown = function(){
        var $button = jQuery('.js-ddl-button-edit'),
            layouts_links_data = DDLayout_settings.DDL_JS.layouts;

        if( layouts_links_data.length < 2 ){
            return;
        }

        var template = _.template( jQuery('#tpl-toolset-frontend-etid-layouts-menu').html() );
        layouts_links_data = self.map_layouts_links( layouts_links_data);

        jQuery(document).on('mouseup', '*:not(.js-edit-layout-menu-anchor)', function(event){
            if( jQuery(event.target).is('a') ){
                return true;
            }

            event.stopPropagation();

            if( jQuery(event.target).hasClass('js-ddl-button-edit') ){
                return;
            } else if( jQuery(event.target).hasClass('js-ddl-button-edit') === false && self.go_to_editor_menu_visible ) {
                jQuery(self.go_to_editor_menu_selector).remove();
                self.go_to_editor_menu_visible = false;
            }
        });

        $button.on('click', function(event){

            if( self.go_to_editor_menu_visible === true ){
                jQuery(self.go_to_editor_menu_selector).remove();
                self.go_to_editor_menu_visible = false;
                return;
            }

            jQuery( this ).parent().append( template({layouts:layouts_links_data}) );

            jQuery('.js-edit-layout-menu', jQuery( this ).parent() ).css({
                opacity:1,
                right:'56px'
            }).show();

            self.go_to_editor_menu_visible = true;

        });

    };

    self.map_layouts_links = function( layouts_links_data ){

            var layouts_array = _.map(_.toArray(layouts), function(v){
                return v.toJSON()
            });

            _.each(layouts_links_data, function(layout, index, list){

                var match = _.filter(layouts_array, function(v){
                        return +v.id === +layout.id;
                });
                if( match[0].layout_type === 'private' && DDLayout_settings.DDL_JS.post_title ){
                    var name = match[0].name;
                    name = name.replace( DDLayout_settings.DDL_JS.current_post, DDLayout_settings.DDL_JS.post_title );
                    layouts_links_data[index].name = name;
                } else {
                    layouts_links_data[index].name = match[0].name;
                }
            });

        return layouts_links_data;
    };

    self.init();
};

DDLayout.AdminPage.cell_reset_events_on_close = true;

DDLayout_settings.DDL_JS.ns.ready(function () {
    WPV_Toolset.Utils.loader = WPV_Toolset.Utils.loader || new WPV_Toolset.Utils.Loader;
    DDLayout.AdminPage.Rows = {};
    jQuery(document).trigger('DLLayout.admin.before.ready');
    DDLayout.ddl_admin_page = new DDLayout.AdminPage();
    jQuery(document).trigger('DLLayout.admin.ready');
    WPV_Toolset.Utils.eventDispatcher.trigger('dd-layout-main-object-init');
});