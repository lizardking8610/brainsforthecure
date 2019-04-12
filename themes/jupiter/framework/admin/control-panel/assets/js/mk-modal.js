// ---------------------------------
// ---------- MK Modal ----------
// ---------------------------------
// This plugin is used to output messages in Jupiter WordPress Theme's Admin Panel
// ------------------------

;(function ( $, window, document ) {

    var pluginName = 'mk_modal';

    // Create the plugin constructor
    function Modal ( element, options ) {

        /*
            Provide local access to the DOM node(s) that called the plugin,
            as well local access to the plugin name and default options.
        */
        this.element = element;
        this._name = pluginName;
        this._defaults = $.fn.mk_modal.defaults;

        /*
            Extending options & defaults
        */
        this.options = $.extend( {}, this._defaults, options );

        /*
            Abracadabra!
        */
        this.init();
    }

    // Avoid Plugin.prototype conflicts
    $.extend(Modal.prototype, {

        // Init logic
        init: function () {
            var template = this.templateInit();
            var $template = this.bindEvents(template);
            this.open($template);
        },

        templateInit: function () {
            var template = this.templateBuilder();
            return template;
        },

        templateBuilder: function (options) {
            var options = this.options;
            var html = '';

            html += '<div class="mka-modal-wrap">';
                html += '<div id="mka-modal" class="mka-modal mka-modal--' + options.type + '">';
                    if ( options.showCloseButton ) {
                    html += '<a href="#" class="mka-modal-close-btn"></a>';
                    }
                    if ( options.showProgress ) {
                    html += '<div class="mka-modal-progress">';
                        html += '<div class="mka-modal-progress-bar"></div>';
                    html += '</div>';
                    }
                    html += '<div class="mka-modal-content">';
                        html += '<span class="mka-modal-icon"></span>';
                        html += '<h3 class="mka-modal-title">' + options.title + '</h3>';
                        html += '<div class="mka-modal-desc">';
                            html += options.text;
                        html += '</div>';
                        html += '<div class="mka-modal-footer">';
                            if ( options.showConfirmButton ) {
                            html += '<div class="mka-wrap mka-modal-ok-btn-wrap">';
                                html += '<input type="button" class="mka-button mka-button--blue mka-button--small mka-modal-ok-btn" value="AGREE">';
                            html += '</div>';
                            }
                            if ( options.showCancelButton ) {
                            html += '<div class="mka-wrap mka-modal-cancel-btn-wrap">';
                                html += '<input type="button" class="mka-button mka-button--gray mka-button--small mka-modal-cancel-btn" value="DISCARD">';
                            html += '</div>';
                            }
                            if ( options.showLearnmoreButton ) {
                            html += '<a href="#" class="mka-modal-readmore-btn">More Help</a>';
                            }
                        html += '</div>';
                    html += '</div>';
                html += '</div>';
            html += '</div>';

            return html;
        },

        open: function(template) {

            var $modal = $(this.element).children('#mka-modal');
                isModalAdded = $modal.length;
            if ( isModalAdded ) {
                $modal.replaceWith(template);
            } else {
                $(this.element).append(template);
            }

            template.find('.mka-modal').css({
                marginTop: function() {
                    return - $(this).outerHeight() / 2 + 'px';
                }
            })

        },

        close: function(template) {

            $(this.element).find('.mka-modal-wrap').remove();

        },

        // Bind events that trigger methods
        bindEvents: function(template) {
            var plugin = this;
            var $modal = $(template);
            var $closeBtn = $modal.find('.mka-modal-close-btn');
            var $confirmBtn = $modal.find('.mka-modal-ok-btn-wrap');

            // Close Button
            $closeBtn.on('click' + '.' + plugin._name, function(e) {
                e.preventDefault();
                plugin.close();
            });

            $confirmBtn.on('click' + '.' + plugin._name, function(e) {
                e.preventDefault();
                plugin.callback();
            });

            return $modal;

        },

        // Unbind events that trigger methods
        unbindEvents: function() {
            this.$element.off('.'+this._name);
        },


        // Create custom methods
        someOtherFunction: function() {
            alert('I promise to do something cool!');
            this.callback();
        },

        callback: function() {
            // Cache onConfirm option
            var onConfirm = this.options.onConfirm;

            if ( typeof onConfirm === 'function' ) {
                onConfirm.call(this.element);
            }
        }

    });

    /*
        Create a lightweight plugin wrapper around the "Plugin" constructor,
        preventing against multiple instantiations.
    */
    $.fn.mk_modal = function ( options ) {

        new Modal( this, options );

        /*
            "return this;" returns the original jQuery object. This allows
            additional jQuery methods to be chained.
        */
        return this;
    };

    /*
        Attach the default plugin options directly to the plugin object. This
        allows users to override default plugin options globally, instead of
        passing the same option(s) every time the plugin is initialized.

        For example, the user could set the "property" value once for all
        instances of the plugin with
        "$.fn.pluginName.defaults.property = 'myValue';". Then, every time
        plugin is initialized, "property" will be set to "myValue".
    */
    $.fn.mk_modal.defaults = {
        parent: 'body',
        title:  '',
        text: '',
        type: 'error',
        showCancelButton: false,
        showConfirmButton: true,
        showCloseButton: true,
        showLearnmoreButton: true,
        showProgress: false,
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        closeOnConfirm: false,
        closeOnCancel: false,
        onConfirm: null,
        onCancel: null,
    };

})( jQuery, window, document );