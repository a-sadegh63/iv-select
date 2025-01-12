const iv_elements = {
    main_el: 0, //main element iv-select class
    view_el: 1, //view element iv-select-view class
    text_el: 2, //text element iv-select-text class
    search_el: 3, //search element iv-select-search class
    value_el: 4, //value element iv-select-value class
    options_container_el: 5, //options container element iv-select-options class
    item_el: 6, //selected item element iv-selected-item class
    delete_button: 7, //delete button element iv-del-button class
    options_el: 8, //option elements
    selected_item_text: 9 //selected item text span iv-selected-item-text class
};

const iv_settings = {
    placeholder: 'Select an option',
    main_el: {
        styles: {
            position: 'relative',
        },
        classes: 'w3-white w3-round'
    },
    view_el: {
        styles: {
            padding: '8px'
        },
        classes: 'w3-row'
    },
    text_el: {
        styles: {
            width: 'auto',
            display: 'flex',
            'align-items': 'center',
            'flex-wrap': 'wrap',
            'flex-item': ''
        },
        classes: 'w3-col'
    },
    search_el: {
        styles: {
            border: 'none',
            'align-self': 'flex-start'
        },
        classes: 'w3-col'
    },
    value_el: {
        styles: {
            display: 'none',
        },
        classes: 'iv-select-value'
    },
    item_el: {
        styles: {
            'width': 'fit-content',
            'margin-left': '1px',
            'margin-right': '1px',
        },
        classes: 'w3-cell-row w3-col w3-card w3-blue-gray w3-round w3-small'
    },
    selected_item_text: {
        styles: {
            padding:'2px 8px'
        },
    },
    delete_button: {
        styles: {
            padding:'2px 8px',
            'font-weight': 900,
            float: 'inline-end'
        },
        classes: 'w3-hover-black w3-round w3-red w3-button'
    },
    options_container_el: {
        styles: {
            display: 'none',
            position: 'absolute',
            width: '100%',
            'max-height': '235px',
            'z-index': '10',
            'overflow-y': 'auto',
            'overflow-x': 'hidden',
            'word-break': 'break-all',
            'border-top': 'hidden',
            'border-right': '1px solid #ccc !important',
            'border-left': '1px solid #ccc !important',
            'border-bottom': '1px solid #ccc !important',
            'border-radius': '0 0 4px 4px',
            'outline': 'none !important',
            'box-shadow': '0 0 10px #719ECE',
            'font-size': '13px',
            'background-color': 'white!important'
        },
        classes: 'w3-white'
    },
    options_el: {
        styles: {
            height: '23.5px'
        },
        classes: 'w3-block w3-button w3-hover-blue w3-border-left w3-border-right'
    },
    inline_styles: {
        ".iv-select-text:focus": {
            "border-top": "1px solid #ccc !important",
            "border-right": "1px solid #ccc !important",
            "border-left": "1px solid #ccc !important",
            "border-bottom": "hidden",
        },
        ".iv-select-view": {
            "cursor": "text",
        },
        ".iv-select-search:focus": {
            "outline": "none",
        },
        ".iv-select-options option": {
            "padding": "2px 0px!important",
            "text-align": "inherit",
        },
        ".iv-option-focused": {
            "background-color": "lightblue"
        },
        '.w3-col': {
            'float': 'inherit'
        }

    }
}

const bar_class = 'w3-bar-item';

$(document).ready(function() {
    //add inline styles
    var inline_css = '';
    for ( var css_selector in iv_settings.inline_styles ) {
        inline_css += `${css_selector}{\n`;
        for ( var prop in iv_settings.inline_styles[css_selector] ) {
            inline_css += `\t${prop}:${iv_settings.inline_styles[css_selector][prop]};\n`;
        }
        inline_css += `}\n`;
    }
    var inline_css_obj = $('<style/>').attr( 'id', 'iv-select-styles' );
    inline_css_obj.html( inline_css );
    $('head').append( inline_css_obj );
});

$(document).on('click', '.iv-select-topbar', function(e) {
    var iv_width = $(this).outerWidth();
    var options_container = $(this).iv_findElement( iv_elements.options_container_el );
    options_container.css( 'max-width', iv_width );
    options_container.css( 'top', $(this).offset().top + $(this).outerHeight() );
    options_container.css( 'left', $(this).offset().left );
});

$(document).on('keydown', '.iv-select-view', function(e) {
    var target_el = $(e.target);
    var options_container = target_el.iv_findElement( iv_elements.options_container_el );
    var value_el = target_el.iv_findElement( iv_elements.value_el );
    if ( value_el.prop('disabled') ) return;
    if ( options_container.is(":visible") ) {
        var key_code = e.keyCode || e.which;
        keyboardFocus( options_container, key_code );
    }
});

function keyboardFocus( options_container, key_code ) {
    const container_top = options_container.offset().top;
    var new_focus_el, old_focus_el;
    old_focus_el = $();
    if ( key_code == 38 ) { //up key pressed
        if ( options_container.children('.iv-option-focused').length != 0 ) {
            old_focus_el = options_container.children('.iv-option-focused');
            new_focus_el = options_container.children('.iv-option-focused').prevAll(':visible:first');
            if ( new_focus_el.length == 0 ) {
                new_focus_el = options_container.find(':visible:last');
            }
        } else {
            if ( options_container[0].scrollTop > 0 ) {
                options_container.find(':visible').each( function () {
                    if ( $(this).offset().top - container_top <= $(this).outerHeight() ) {
                        new_focus_el = $(this);
                    }
                });
            } else {
                new_focus_el = options_container.find(':visible:last');
            }
        }
    }
    if ( key_code == 40 ) { //down key pressed
        if ( options_container.children('.iv-option-focused').length != 0 ) {
            old_focus_el = options_container.children('.iv-option-focused');
            new_focus_el = options_container.children('.iv-option-focused').nextAll(':visible:first');
            if ( new_focus_el.length == 0 ) {
                new_focus_el = options_container.find(':visible:first');
            }
        } else {
            if ( options_container[0].scrollTop > 0 ) {
                options_container.find(':visible').each( function () {
                    if ( $(this).offset().top - container_top <= $(this).outerHeight() ) {
                        new_focus_el = $(this);
                    }
                });
            } else {
                new_focus_el = options_container.find(':visible:first');
            }
        }
    }
    if ( key_code == 40 || key_code == 38 ) {
        old_focus_el.removeClass('iv-option-focused');
        new_focus_el.addClass('iv-option-focused');
        options_container.scrollTop( options_container[0].scrollTop + new_focus_el.offset().top - container_top );
        options_container.children().css( 'pointer-events', 'none' );
    }
}

$(document).on('keyup', '.iv-select-view', function(e) {
    var key_code = e.keyCode || e.which;
    if ( key_code == 40 || key_code == 38 ) {
        return;
    }
    var target_el = $(e.target);
    var options_container = target_el.iv_findElement( iv_elements.options_container_el );
    const container_top = options_container.offset().top;
    var focus_el = $();
    if ( key_code == 36 ) { //home key pressed
        focus_el = options_container.find(':visible:first');
    }
    if ( key_code == 35 ) { //end key pressed
        focus_el = options_container.find(':visible:last');
    }
    // options_container.children().removeClass('iv-option-focused');
    if ( focus_el.length > 0 ) {
        focus_el.addClass('iv-option-focused');
        options_container.scrollTop( options_container[0].scrollTop + focus_el.offset().top - container_top );
    }
    if ( key_code == 13 ) { //enter key pressed
        if ( options_container.children('.iv-option-focused').length > 0 ) {
            var value_el = target_el.iv_findElement( iv_elements.value_el );
            var focused_value = options_container.children('.iv-option-focused').val();
            var old_values = value_el.val();
            if ( value_el.prop('multiple') === true ) {
                if ( old_values.length != 0 ) {
                    const found = old_values.find( (element) => element == focused_value );
                    if ( found === undefined ) {
                        old_values.push(focused_value);
                    }
                }
            } else {
                old_values = focused_value;
            }
            value_el.val(old_values);
        }
        options_container.hide( 200 );
    }
});

$(document).on('click', '.iv-select', function(e) {
    var target_el = $(e.target);
    if ( 
        target_el.hasClass('iv-selected-item-text') || 
        target_el.hasClass('iv-del-button') ||
        target_el.hasClass('iv-selected-item') ||
        target_el.hasClass('iv-tooltip')
    ) {
        return;
    }
    var main_el = target_el;
    target_el.iv_findElement( iv_elements.search_el ).focus();
    $('.iv-tooltip').hide('fade');
    ivDropOptionsDown( main_el );
});

function ivDropOptionsDown( main_el ) {
    var options_container = main_el.iv_findElement( iv_elements.options_container_el );
    $('.iv-select-options').not(options_container[0]).hide(); //hide other options containers
    var value_el = main_el.iv_findElement( iv_elements.value_el );
    if ( value_el.prop('disabled') ) return;
    if ( options_container.is(":visible") ) {
        options_container.hide(200, function() {
            main_el.css({
                'border-bottom-right-radius': '4px',
                'border-bottom-left-radius': '4px',
            });
        });
    } else {
        options_container.show(200, function() {
            main_el.css({
                'border-bottom-right-radius': '0px',
                'border-bottom-left-radius': '0px',
            });
        });
        if ( options_container.children('.w3-dark-gray').length != 0 ) {
            options_container.scrollTop(
                options_container.children('.w3-dark-gray')[0].offsetTop
            );            
        } else {
            options_container[0].scrollTop = 0;
        }
    }
}

jQuery.propHooks.disabled = {
    set: function ( iv_select, prop_value ) {
        if ( $(iv_select).is_ivSelect() ) {
            if ( prop_value ) {
                $( iv_select ).iv_findElement( iv_elements.view_el ).css( 'background-color', '#f8f8f8' );
                $( iv_select ).iv_findElement( iv_elements.search_el ).prop( 'disabled', true );
            } else {
                $( iv_select ).iv_findElement( iv_elements.view_el ).css('background-color', 'unset');
                $( iv_select ).iv_findElement( iv_elements.search_el ).prop( 'disabled', false );
            }
        }
    }
};

$(document).on( 'mouseenter', '.iv-select-options option', function(e) {
    $(this).attr( 'title', $(this).text() );
});

$(document).on('click', '.iv-select-options option', function(e) {
    var target_el = $(e.target);
    var value_el = target_el.iv_findElement( iv_elements.value_el );
    var search_el = target_el.iv_findElement( iv_elements.search_el );
    var main_el = target_el.iv_findElement( iv_elements.main_el );
    const main_width = main_el.outerWidth();
    if (value_el.prop('multiple') === true) {
        var current_value = value_el.val();
        if (!Array.isArray(current_value)) {
            current_value = [current_value];
        }
        const index = current_value.indexOf(target_el.val());
        if (index == -1) {
            current_value.push(target_el.val());
            value_el.val(current_value);
        }
    } else {
        value_el.val(target_el.val());
    }
    value_el.trigger('change');
    if ( target_el.parent()[0].dataset.iv_close_after_click === 'true' ) {
        target_el.parent().hide(200);
    }
    search_el.val('');
    search_el.trigger('keyup');
    main_el.css({
        'border-bottom-right-radius': '',
        'border-bottom-left-radius': '',
    });
    main_el.css( 'min-width', main_width ); //fix width when option width is shorter than initial width
});

$(document).on('click', '.iv-del-button', function(e) {
    var target_el = $(e.target);
    var iv_value_el = target_el.iv_findElement( iv_elements.value_el );
    if ( iv_value_el.prop('disabled') ) return;
    var item_container = target_el.parent();
    var del_item = item_container.data('iv_itemValue');
    if ( iv_value_el.prop('multiple') === true ) {
        var current_value = iv_value_el.val();
        if (Array.isArray(current_value)) {
            const index = current_value.indexOf( del_item.toString() );
            if (index != -1) {
                current_value.splice(index, 1);
                iv_value_el.val( current_value )
            }
        } else {
            iv_value_el.val([]);
        }
    } else {
        iv_value_el.val('');
    }
    iv_value_el.trigger('change');
    iv_value_el.parent().find('.iv-select-options').hide(200);
    item_container.remove();
});

$(document).on('keyup', 'input.iv-select-search', function(e) {
    var target = $(e.target);
    if ( $.inArray(e.keyCode, [37, 38, 39, 40, 9, 13, 16, 17, 18, 20]) != -1 ) {
        return;
    }
    target.width( target.prop('scrollWidth') );
    var search = target.val();
    if ( search == '' ) return;
    var options = target.iv_findElement( iv_elements.options_el );
    var options_container = target.iv_findElement( iv_elements.options_container_el );
    options.removeClass('w3-border-bottom');
    const result = options.filter(index => $(options[index]).text().toLowerCase().indexOf(search.toLowerCase()) > -1);
    if ( result.length != 0 ) {
        options.hide();
        options_container.show();
        result.show();
        result.last().addClass('w3-border-bottom');
    } 
});

$(document).on('click', function(e) {
    if (
        $('.iv-select:hover').length == 0 &&
        $('.iv-select-options:hover').length == 0 &&
        $('.iv-select-view:hover').length == 0 &&
        $('.iv-selected-item:hover').length == 0 &&
        $('.iv-selected-item:hover').length == 0 &&
        $('.iv-del-button:hover').length == 0 &&
        $('.iv-select-search:hover').length == 0
    ) {
        $('.iv-select-options').hide(200);
        $('.iv-select').css({
            'border-bottom-right-radius': '',
            'border-bottom-left-radius': '',
        });
        $('input.iv-select-search').map( function () {
            if ( $(this).val() != '' ) {
                $(this).val('');
                $(this).trigger('keyup');
            }
        });
        $('.iv-select').css( 'min-width', 'unset' );
    }
    if ( $(e.target).hasClass('iv-tooltip') ) {
        $('.iv-tooltip').hide('fade');
    }
    $('.iv-option-focused').each( function() {
        $(this).removeClass('iv-option-focused');
    });
    $('.iv-select-options').children().css( 'pointer-events', 'unset' );
});

function addIvItem(item_text, item_val) {
    if ( item_text == '' ) return '';
    //add container node
    var container_node = $('<div/>').attr({
        class: 'iv-selected-item'
    });
    container_node.addClass( iv_settings.item_el.classes );
    container_node[0].dataset.iv_itemValue = item_val;
    container_node.css( iv_settings.item_el.styles );

    //add selected item text
    var text_node = $('<span/>').attr({
        class: 'iv-selected-item-text',
    });
    text_node.addClass( iv_settings.selected_item_text.classes );
    text_node.css( iv_settings.selected_item_text.styles );
    text_node.html(item_text + '&nbsp;');

    //add delete button
    var btn_node = $('<button/>').attr({
        class: 'iv-del-button',
        style: 'padding:2px 8px;font-weight:900',
        type: 'button'
    });
    btn_node.addClass( iv_settings.delete_button.classes );
    btn_node.css( iv_settings.delete_button.styles );
    btn_node.html('&times;');
    
    return (container_node.append(text_node, btn_node));
}

(function($) {
    var originalFn = $.fn.val;
    $.fn.val = function(value) {
        if ( ! this.hasClass('iv-select-value') || value === undefined ) return originalFn.apply(this, arguments);
        var options = this.iv_findElement( iv_elements.options_container_el ).children('option'); 
        var iv_text_el = this.iv_findElement( iv_elements.text_el ); 
        var iv_search_el = this.iv_findElement( iv_elements.search_el );
        var value_text = [];
        var value_option = '';
        if ( this.prop('multiple') !== true ) {
            if (Array.isArray(value)) value = value[0];
        }
        options.each(function() {
            if (Array.isArray(value)) {
                if (value.indexOf($(this).val()) != -1) {
                    $(this).addClass('w3-dark-gray');
                    value_text.push(addIvItem($(this).text(), $(this).val()));
                    $(this).prop("selected", true);
                    value_option += $(this)[0].outerHTML;
                } else {
                    $(this).prop("selected", false);
                    $(this).removeClass('w3-dark-gray');
                }
            } else {
                if ($(this).val() == value) {
                    $(this).addClass('w3-dark-gray');
                    value_text.push(addIvItem($(this).text(), $(this).val()));
                    $(this).prop("selected", true);
                    value_option += $(this)[0].outerHTML;
                } else {
                    $(this).prop("selected", false);
                    $(this).removeClass('w3-dark-gray');
                }
            }
        });
        // if ( value_text.length === 0 ) value_text = '&nbsp;';
        if ( this.attr('required') ) {
            if ( value == '' ) {
                this[0].setCustomValidity('Please fill out this field');
            }
        }
        this.empty().append(value_option);
        iv_text_el.empty().append( value_text );
        iv_text_el.append( iv_search_el );
        if ( ! value || value.length === 0 ) {
            iv_search_el.attr( 'placeholder', iv_search_el[0].dataset.iv_placeholder );
        } else {
            iv_search_el.css( 'width', '0.75em' );
            iv_search_el.removeAttr('placeholder');
        }
        iv_search_el.val('');
        iv_search_el.trigger('keyup');
        originalFn.apply(this, arguments);
    };
})(jQuery);

$.fn.extend({
    iv_updateOptions:
    /**
     * این تابع مقادیر iv-select را با گزینه‌های جدید جایگزین می‌کند
     * @param {object} new_options یک آبجکت شامل مقادیر جدید برای گزینه‌ها
     */
    function(new_options) {
        var options_container = this.iv_findElement(iv_elements.options_container_el);
        if (options_container !== false) {
            // پاک‌سازی و افزودن گزینه‌های جدید
            options_container.empty();
            
            // افزودن گزینه‌ها بر اساس آبجکت ورودی
            $.each(new_options, function(key, value) {
                options_container.append(
                    $('<option/>').attr('value', key).text(value)
                );
            });
            
            // افزودن گزینه null اگر اولین گزینه وجود ندارد
            if (options_container.children().first().val() !== '') {
                options_container.prepend(
                    $('<option/>').attr({
                        class: 'w3-hide',
                        value: ''
                    }).text('انتخاب کنید')
                );
            }
            
            // افزودن کلاس‌ها به گزینه‌ها
            options_container.children('option').each(function() {
                $(this).addClass(iv_settings.options_el.classes);
            });
            var old_val = this.val();
            this.val(old_val);
        }
    },
    iv_getPossibleValues: 
    /**
     * With this function you able to get iv-select possible values array
     * @returns {false|array}
     */
    function() {
        var options_container = this.iv_findElement( iv_elements.options_container_el );
        if ( options_container === false ) {
            return false;
        }
        var option_nodes = options_container.children('option');
        const opt_values = [];
        option_nodes.each( function() {
            opt_values.push(this.value);
        });
        return opt_values;
    },
    iv_clone: 
    function({
        name = "",
        id = "",
        placeholder = "Select an option",
        main_el_class = "",
        main_el_style = {},
        view_el_class = "",
        view_el_style = {},
        options_container_class = "",
        options_container_style = {},
        option_class = "",
        option_style = {},
        remove_unselected = true,
        close_after_click = true
    } = {}) {
        var main_el = this.iv_findElement( iv_elements.main_el );
        if ( main_el === false ) return false;
        var cloned_iv = main_el.clone().iv_findElement( 'all' );
        var value = cloned_iv.value_el.val();
        cloned_iv.main_el.addClass( main_el_class );
        cloned_iv.main_el.css( main_el_style );
        if ( name != '' ) {
            cloned_iv.value_el.attr( 'name', name ) ;
        } else {
            cloned_iv.value_el.removeAttr('name');
        }
        if ( id != '' ) {
            cloned_iv.value_el.attr('id', id);
        } else {
            cloned_iv.value_el.removeAttr('id');
        }

        //fix cloned iv value 
        if ( cloned_iv.value_el.prop('multiple') === true ) {
            cloned_iv.value_el.children('option').each(function() {
                $(this).attr( 'selected', true );
            });
        }

        cloned_iv.search_el.attr('placeholder', placeholder);
        cloned_iv.search_el.data('iv_placeholder', placeholder);

        cloned_iv.view_el.addClass( view_el_class );
        cloned_iv.view_el.css( view_el_style );

        cloned_iv.options_container_el.addClass( options_container_class );
        cloned_iv.options_container_el.css( options_container_style );
        cloned_iv.options_container_el[0].dataset.iv_close_after_click = close_after_click;

        if ( remove_unselected ) {
            cloned_iv.options_el.filter(function() {
                if ( $(this).val() != value ) {
                    $(this).remove();
                }
            });
        }
        cloned_iv.options_el.each(function() {
            $(this).css( option_style );
            $(this).addClass( option_class );
        });
        return cloned_iv.main_el;
    },
    is_ivSelect: function() {
        if (!this.hasClass('iv-select-value')) return false;
        return true;
    },
    iv_textEl: function() {
        if (!this.hasClass('iv-select-value')) return false;
        return this.prevAll('div.iv-select-text');
    },
    iv_isIvConstruct: function() {
        switch ( true ) {
            case this.hasClass('iv-select') :
            case this.hasClass('iv-select-view') :
            case this.hasClass('iv-select-text') :
            case this.hasClass('iv-select-search') :
            case this.hasClass('iv-select-value') :
            case this.hasClass('iv-select-options') :
            case this.hasClass('iv-selected-item') :
            case this.hasClass('iv-del-button') :
            case this.hasClass('iv-selected-item-text') :
            case this.parent().hasClass('iv-select-options') :
                return true;
            default :
                return false;
        }
    },
    iv_setInvalid: function( err_message ) {
        if ( ! this.iv_isIvConstruct ) return;
        var text_el = this.iv_findElement( iv_elements.view_el );
        text_el.attr( 'title', err_message );
        var view_width = text_el.outerWidth();
        if ( text_el.next('span.iv-tooltip').length != 0 ) {
            text_el.next('span.iv-tooltip').remove();
        }
        text_el.after( 
            $('<span style="position:absolute;background-color:rgb(30, 29, 34);color:white;' + 
              'font-size:13px;padding:18px;width:' + view_width + 'px;min-width:250px"' + 
              ' class="iv-tooltip w3-round-large">' + err_message + '</span>') 
        );
        this.on( 'invalid', function () {
            var text_el = $(this).iv_findElement( iv_elements.view_el );
            if ( text_el.next('span.iv-tooltip').length != 0 ) {
                text_el.next('span.iv-tooltip').show();
                setTimeout(function() {
                    text_el.next('span.iv-tooltip').hide();
                }, 3000);    
            }
            if ( text_el[0].getBoundingClientRect().bottom > window.innerHeight ) {
                text_el[0].scrollIntoView(false);
            }
            if ( text_el[0].getBoundingClientRect().top < 0 ) {
                text_el[0].scrollIntoView();
            } 
        });
    },
    iv_clearInvalid: function() {
        this.each(function() {
            var target_el = $(this).iv_findElement(iv_elements.value_el);
            if (target_el != false) {
                target_el[0].setCustomValidity('');
            }
            // check if element is a radio box
            if (this.type === 'radio') {
                var groupName = this.name;
                $('input[name="' + groupName + '"]').each(function() {
                    this.setCustomValidity('');
                });
            } else if (typeof this.setCustomValidity !== "undefined") { 
                this.setCustomValidity('');
            }
        });
    },    
    iv_getVal: function () {
        if ( this.iv_isIvConstruct() ) {
            var value_el = this.iv_findElement( iv_elements.value_el );
            return value_el.val();
        }
        return undefined;
    },
    iv_setVal: function ( value ) {
        if ( this.iv_isIvConstruct() ) {
            var value_el = this.iv_findElement( iv_elements.value_el );
            value_el.val( value );
        }
        return undefined;
    },
    iv_findElement: 
    /**
     * With this function, you can find a specific **iv_select** element associated with an element
     * @param {number|string} find_what Specifies which **iv_select** element the function must find. 
     * ***Optional***;  
     * Default value of this parameter is ***all*** string which means the function returns an array 
     * of all **iv_select** elements associated with the current element.
     *  find_what = {
            main_el: 0, //main element iv-select class
            view_el: 1, //view element iv-select-view class
            text_el: 2, //text element iv-select-text class
            search_el: 3, //search element iv-select-search class
            value_el: 4, //value element iv-select-value class
            options_container_el: 5, //options container element iv-select-options class
            item_el: 6, //selected item element iv-selected-item class
            delete_button: 7, //delete button element iv-del-button class
            options_el: 8, //option elements
            selected_item_text: 9 //selected item text span iv-selected-item-text class
        };
     * @returns {array|false} A jQuery array of all/specific **iv_select** elements associated with the
     * current element or false when the present part is not an **iv_select** element
     */
    function( find_what = 'all' ) {
        var iv_element;
        switch ( true ) {
            case this.hasClass('iv-select') :
                iv_element = this;
                break;
            case this.hasClass('iv-select-view') :
                iv_element = this.parent();
                break;
            case this.hasClass('iv-select-text') :
                iv_element = this.parent().parent();
                break;
            case this.hasClass('iv-select-search') :
                iv_element = this.parent().parent().parent();
                break;
            case this.hasClass('iv-select-value') :
                iv_element = this.parent();
                break;
            case this.hasClass('iv-select-options') :
                iv_element = this.parent();
                break;
            case this.hasClass('iv-selected-item') :
                iv_element = this.parent().parent().parent();
                break;
            case this.hasClass('iv-del-button') :
            case this.hasClass('iv-selected-item-text') :
                iv_element = this.parent().parent().parent().parent();
                break;
            case this.parent().hasClass('iv-select-options') :
                iv_element = this.parent().parent();
                break;
            default :
                return false;
        }
        switch ( find_what ) {
            case iv_elements.main_el :
                return iv_element;
            case iv_elements.view_el :
                return iv_element.children('.iv-select-view');
            case iv_elements.text_el :
                return iv_element.children('.iv-select-view').children('.iv-select-text');
            case iv_elements.search_el :
                return iv_element.children('.iv-select-view').children('.iv-select-text').children('.iv-select-search');
            case iv_elements.value_el :
                return iv_element.children('.iv-select-value');
            case iv_elements.options_container_el :
                return iv_element.children('.iv-select-options');
            case iv_elements.item_el :
                return iv_element.children('.iv-select-view').children('.iv-select-text').children('.iv-selected-item');
            case iv_elements.delete_button :
                return iv_element.children('.iv-select-view').find('.iv-del-button');
            case iv_elements.options_el :
                return iv_element.children('.iv-select-options').children('option');
            case iv_elements.selected_item_text :
                return iv_element.children('.iv-select-view').find('.iv-selected-item-text');    
            case 'all' :
                return {
                    main_el: iv_element,
                    view_el: iv_element.children('.iv-select-view'),
                    text_el: iv_element.children('.iv-select-view').children('.iv-select-text'),
                    search_el: iv_element.children('.iv-select-view').children('.iv-select-search'),
                    value_el: iv_element.children('.iv-select-value'),
                    options_container_el: iv_element.children('.iv-select-options'),
                    item_el: iv_element.children('.iv-select-view').children('.iv-select-text').children('.iv-selected-item'),
                    delete_button: iv_element.children('.iv-select-view').find('.iv-del-button'),
                    options_el: iv_element.children('.iv-select-options').children('option'),
                    selected_item_text: iv_element.children('.iv-select-view').find('.iv-selected-item-text'),
                };
        }
    },
    iv_selectConvert: 
    function({
        placeholder = iv_settings.placeholder,
        main_el_class = "",
        main_el_style = {},
        view_el_class = "",
        view_el_style = {},
        value_el_class = "",
        options_container_class = "",
        options_container_style = {},
        option_class = "",
        option_style = {},
        keep_existing_class = 'toValue', // possible values: toView, toValue, toMain
        close_after_click = true,
        no_search_element = false
    } = {}) {
        if (this.length == 0) return;
        this.each(function() {
            var args = {
                placeholder,
                main_el_class,
                main_el_style,
                view_el_style,
                view_el_class,
                value_el_class,
                options_container_class,
                options_container_style,
                option_class,
                option_style,
                keep_existing_class,
                close_after_click,
                no_search_element
            }
            var select_el = $(this);
            if (select_el[0].tagName != 'SELECT') return;
            if (select_el.hasClass('iv-select-value')) return;

            var v_disabled = false;
            if ( select_el.prop('disabled') ) v_disabled = true;

            //add main element
            var iv_select = $('<div/>');
            iv_select.addClass( 'iv-select' );
            iv_select.addClass( iv_settings.main_el.classes );
            iv_select.css( iv_settings.main_el.styles );
            iv_select.addClass( args.main_el_class );
            iv_select.css( args.main_el_style );

            //add view element
            var view_element = $('<div/>');
            view_element.addClass( 'iv-select-view' );
            view_element.addClass( iv_settings.view_el.classes );
            view_element.css( iv_settings.view_el.styles );
            view_element.css( 'style', args.view_el_style );
            view_element.addClass( args.view_el_class );
            if ( v_disabled ) {
                view_element.css( 'background-color', '#f8f8f8' );
            }

            //add value element
            var value_element = select_el.clone( true, true );
            value_element.css( iv_settings.value_el.styles );
            value_element.addClass( iv_settings.value_el.classes );
            value_element.addClass( args.value_el_class );

            //Determining the new iv-select element for existing class in the select element
            var existing_class = select_el.attr('class');
            if ( existing_class !== undefined && existing_class != '' ) {
                var re = new RegExp('\\b' + bar_class + '\\b', 'gi');
                if ( existing_class.match(re) ) {
                    existing_class.replace( re, '' );
                    iv_select.addClass( bar_class );
                    iv_select.addClass( 'iv-select-topbar' );
                    view_element.css( {padding: 'unset'} );
                    iv_select.css( 'position', 'static' );
                }
                switch ( args.keep_existing_class ) {
                    case 'toValue':
                        value_element.addClass( existing_class );
                        break;
                    case 'toView':
                        view_element.addClass( existing_class );
                        break;
                    case 'toMain':
                        iv_select.addClass( existing_class );
                        break;
                }
            }
            
            //add text element
            var text_element = $('<div/>');
            text_element.addClass( 'iv-select-text' );
            text_element.addClass( iv_settings.text_el.classes );
            text_element.css( iv_settings.text_el.styles );

            view_element.append( text_element );
            //add search element
            if ( ! args.no_search_element ) {
                var search_element = $('<input>').attr({
                    autocomplete: 'off',
                    placeholder: args.placeholder
                });
                search_element[0].dataset.iv_placeholder = placeholder;
                search_element.addClass( 'iv-select-search' );
                search_element.addClass( iv_settings.search_el.classes );
                search_element.css( iv_settings.search_el.styles );
                if ( v_disabled ) {
                    search_element.prop( 'disabled', true );
                }
                text_element.append( search_element );
            } else {
                text_element.css({width: '100%'});
                if ( main_el_style['min-width'] === undefined ) iv_select.css({'min-width': '100px'});
                if ( main_el_style.padding === undefined ) iv_select.css({padding:'7px 8px'});
            }

            //start convert to iv-select
            //add tabindex to main el
            var tabindex = select_el.attr('tabindex');
            if ( tabindex !== 'undefined' && tabindex !== false ) {
                iv_select.attr('tabindex', tabindex);
                select_el.removeAttr('tabindex');
            }

            //add option container element
            var options_container = $('<div/>').attr({
                class: 'iv-select-options'
            });
            options_container.addClass( iv_settings.options_container_el.classes );
            options_container.css( iv_settings.options_container_el.styles );
            options_container.addClass( args.options_container_class );
            options_container.css( args.options_container_style );

            //add value null option
            options_container.append(
                $('<option/>').attr({
                    class: 'w3-hide',
                    value: ''
                })
            );
            options_container[0].dataset.iv_close_after_click = args.close_after_click;

            //add options to container
            var options = select_el.children('option');
            options.last().addClass('w3-border-bottom');
            options.each(function() {
                $(this).addClass( iv_settings.options_el.classes );
                $(this).css( iv_settings.options_el.styles );
                $(this).addClass( args.option_class );
                $(this).css( args.option_style );
            });
            options_container.append(options);
            
            //add elements to the main container
            iv_select.append( view_element, value_element, options_container );

            //set value of the iv-select
            var first_value = select_el.val();
            if ( select_el.data('iv-init-value') !== undefined ) {
                let init_value = select_el.data('iv-init-value').toString();
                if ( select_el.prop('multiple') === false ) {
                    first_value = init_value;
                } else {
                    if ( init_value.includes('|') ) {
                        first_value = init_value.split('|');
                    } else {
                        first_value = init_value;
                    }
                }
            }
            if ( first_value ) {
                iv_select.find('select.iv-select-value').val(first_value);
            } else {
                iv_select.find('select.iv-select-value').val('');
            }

            //replace element with iv-select
            select_el.replaceWith(iv_select);
        });
    }
});