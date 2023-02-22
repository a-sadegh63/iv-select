const iv_elements = {
    main_el: 0, //main element iv-select class
    view_el: 1, //view element iv-select-view class
    text_el: 2, //text element iv-select-text class
    search_el: 3, //search element iv-select-search class
    value_el: 4, //value element iv-select-value class
    options_el: 5, //options container element iv-select-options class
    item_el: 6, //selected item element iv-selected-item class
    delete_button: 7, //delete button element iv-del-button class
};

const iv_settings = {
    main_el: {
        styles: {
            position: 'relative',
        },
        classes: 'iv-select w3-round'
    },
    view_el: {
        styles: {
            
        },
        classes: 'iv-select-view w3-row w3-padding-small'
    },
    text_el: {
        styles: {
            width: 'auto',
        },
        classes: 'iv-select-text w3-col'
    },
    search_el: {
        styles: {
            border: 'none',
            width: 'auto',
        },
        classes: 'iv-select-search w3-col w3-mobile'
    },
    value_el: {
        styles: {
            display: 'none',
        },
        classes: 'iv-select-value'
    },
    options_el: {
        styles: {
            display: 'none',
            position: 'absolute',
            width: '100%'
        },
        classes: 'iv-select-options'
    },
}

$(document).on('click', '.iv-select-view', function(e) {
    var target_el = $(e.target);
    var options_container = target_el.iv_findElement( iv_elements.options_el );
    var value_el = target_el.iv_findElement( iv_elements.value_el );
    var search_el = target_el.iv_findElement( iv_elements.search_el );
    if ( value_el.prop('disabled') ) return;
    ivSelectDropDown( options_container, search_el, true );
});

function ivSelectDropDown( options_container, search_el, clear_filter = true ) {
    search_el.val('');
    var options = options_container.children('option');
    setTimeout(function() { search_el.focus() }, 100);
    $('div.iv-select-options').not(options_container).hide();
    // $('input.iv-select-search').not(search_el).hide();
    if (clear_filter) options.show();
    options_container.toggle(200);
    $('div.iv-select-options').not(options_container).hide(200);
}

const ivSelectOninvalid = (iv_value_dom, err_message) => {
    var text_el = $(iv_value_dom).iv_textEl();
    text_el.attr( 'title', err_message );
    var position = text_el.offset();
    if ( text_el.next('span.iv-tooltip').length != 0 ) {
        text_el.next('span.iv-tooltip').remove();
    }
    text_el.after( 
        $('<span style="position:absolute;background-color:#42414d;color:white;' + 
          'font-size:13px;padding:18px;left:' + position.left + 'px;width:250px"' + 
          ' class="iv-tooltip w3-round-large">' + err_message + '</span>') 
    );
    $(iv_value_dom).on( 'invalid', function () {
        var text_el = $(iv_value_dom).iv_textEl();
        if ( text_el.next('span.iv-tooltip').length != 0 ) {
            text_el.next('span.iv-tooltip').show();
            setTimeout(function() {
                text_el.next('span.iv-tooltip').hide();
            }, 5000);    
        }
        if ( text_el[0].getBoundingClientRect().bottom > window.innerHeight ) {
            text_el[0].scrollIntoView(false);
        }
        if ( text_el[0].getBoundingClientRect().top < 0 ) {
            text_el[0].scrollIntoView();
        } 
    });
}

jQuery.propHooks.disabled = {
    set: function ( iv_select, prop_value ) {
        if ( $(iv_select).is_ivSelect() ) {
            if ( prop_value ) {
                $(iv_select).iv_textEl().css('background-color', '#f1f1f1');
            } else {
                $(iv_select).iv_textEl().css('background-color', 'white');
            }
        }
    }
};

$(document).on('click', '.iv-select-options option', function(e) {
    var target_el = $(e.target);
    var value_el = target_el.parent().parent().find('.iv-select-value');
    var search_el = target_el.prevAll('.iv-select-search');
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
    if (target_el.data('iv_closeAfterClick')) {
        target_el.parent().hide(200);
    }
    search_el.val('');
});

$(document).on('click', '.iv-del-button', function(e) {
    var target_el = $(e.target);
    var iv_value_el = target_el.iv_findElement( iv_elements.value_el );
    if ( iv_value_el.prop('disabled') ) return;
    var item_container = target_el.parent();
    var del_item = item_container.data('iv_itemValue');
    if (iv_value_el.prop('multiple') === true) {
        var current_value = iv_value_el.val();
        if (Array.isArray(current_value)) {
            const index = current_value.indexOf(del_item);
            if (index != -1) {
                current_value.splice(index, 1);
                iv_value_el.val(current_value)
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
    var search = target.val();
    var options = target.iv_findElement( iv_elements.options_el ).children('option');
    options.removeClass('w3-border-bottom');
    options.hide();
    const result = options.filter(index => $(options[index]).text().toLowerCase().indexOf(search.toLowerCase()) > -1);
    result.show();
    result.last().addClass('w3-border-bottom');
});

$(document).on('click', function(e) {
    if (
        $('.iv-select-options:hover').length == 0 &&
        $('.iv-select-text:hover').length == 0 &&
        $('.iv-select-icon:hover').length == 0 &&
        $('.iv-select-search:hover').length == 0
    ) {
        $('.iv-select-options').hide(200);
    }
    if ( $(e.target).hasClass('iv-tooltip') ) {
        $('.iv-tooltip').hide('fade');
    }
});

function addIvItem(item_text, item_val) {
    if ( item_text == '' ) return '';
    var container_node = $('<div/>').attr({
        class: 'iv-selected-item w3-cell-row w3-col w3-card w3-blue-gray w3-round w3-small'
    });
    container_node.data('iv_itemValue', item_val);
    container_node.attr('style', 'width:fit-content;margin-left:1px;margin-right:1px;white-space:nowrap;');
    var text_node = $('<span/>').attr({
        class: 'w3-cell',
        style: 'padding:2px 8px;'
    });
    text_node.html(item_text + '&nbsp;');
    var btn_node = $('<button/>').attr({
        class: 'iv-del-button w3-hover-black w3-round w3-red w3-button w3-cell',
        style: 'padding:2px 8px;font-weight:900',
        type: 'button'
    });
    btn_node.html('&times;');
    return (container_node.append(text_node, btn_node));
}

(function($) {
    var originalFn = $.fn.val;
    $.fn.val = function(value) {
        if (!this.hasClass('iv-select-value') || value === undefined) return originalFn.apply(this, arguments);
        var options = this.iv_findElement( iv_elements.options_el ).children('option'); 
        var iv_text_el = this.iv_findElement( iv_elements.text_el ); 
        var value_text = [];
        var value_option = '';
        if (this.prop('multiple') !== true) {
            if (Array.isArray(value)) value = value[0];
        }
        options.each(function() {
            if (Array.isArray(value)) {
                if (value.indexOf($(this).val()) != -1) {
                    $(this).removeClass('w3-white');
                    $(this).addClass('w3-light-gray');
                    value_text.push(addIvItem($(this).text(), $(this).val()));
                    $(this).prop("selected", true);
                    value_option += $(this)[0].outerHTML;
                } else {
                    $(this).prop("selected", false);
                    $(this).addClass('w3-white');
                    $(this).removeClass('w3-light-gray');
                }
            } else {
                if ($(this).val() == value) {
                    $(this).removeClass('w3-white');
                    $(this).addClass('w3-light-gray');
                    value_text.push(addIvItem($(this).text(), $(this).val()));
                    $(this).prop("selected", true);
                    value_option += $(this)[0].outerHTML;
                } else {
                    $(this).prop("selected", false);
                    $(this).addClass('w3-white');
                    $(this).removeClass('w3-light-gray');
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
        if ( Array.isArray(value_text) ) {
            jQuery.each( value_text, function () {
                if ( this instanceof Object && this !== null ) {
                    $(this).insertBefore( iv_text_el.children('.iv-select-search') );
                }
            });
        }         
        originalFn.apply(this, arguments);
    };
})(jQuery);

$.fn.extend({
    iv_updateOptions: 
    /**
     * With this function you able to replace iv-select options with new options
     * @param {object} new_options jQuery object from new option elements
     */
    function( new_options ) {
        var options_container = this.iv_findElement( iv_elements.options_el );
        if ( options_container !== false ) {
            options_container.empty().append(new_options);
        }
    },
    iv_getPossibleValues: 
    /**
     * With this function you able to get iv-select possible values array
     * @returns {false|array}
     */
    function() {
        var options_container = this.iv_findElement( iv_elements.options_el );
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
    iv_cloneSelect: 
    function({
        name = "",
        id = "",
        placeholder = "Select an option",
        text_el_class = "",
        text_el_style = "",
        container_class = "",
        container_style = "",
        options_container_class = "",
        options_container_style = "",
        option_class = "",
        option_style = "",
        remove_unselected = true,
        close_after_click = true
    } = {}) {
        var iv_elements = this.iv_findElement( 'all' );
        if ( iv_elements === false ) return false;
        var value = iv_elements.value_el.val();
        iv_elements.main_el.addClass( container_class );
        iv_elements.main_el.css( iv_elements.main_el.attr('style') + container_style );
        if ( name != '' ) {
            iv_elements.value_el.attr( 'name', name) ;
        } else {
            iv_elements.value_el.removeAttr('name');
        }
        if ( id != '' ) {
            iv_elements.value_el.attr('id', id);
        } else {
            iv_elements.value_el.removeAttr('id');
        }
        if ( iv_elements.value_el.prop('multiple') === true ) {
            iv_elements.options_el.children('option').each(function() {
                $(this).attr('selected', true);
            });
        }
        iv_elements.search_el.attr('placeholder', placeholder);
        iv_elements.search_el.data('iv_placeholder', placeholder);

        iv_elements.text_el.addClass( text_el_class );
        iv_elements.text_el.css( iv_elements.text_el.attr('style') + text_el_style );

        iv_elements.options_el.addClass( options_container_class );
        iv_elements.options_el.css( iv_elements.options_el.attr('style') + options_container_style );

        if ( remove_unselected ) {
            iv_elements.options_el.children('option').filter(function() {
                if ($(this).val() != value) {
                    $(this).remove();
                }
            });
        }
        iv_elements.options_el.children('option').each(function() {
            $(this).attr( 'style', $(this).attr('style') + option_style );
            $(this).addClass( option_class );
            $(this).data( 'iv_closeAfterClick', close_after_click );
        });
        var cloned_id = iv_elements.main_el.append( iv_elements.view_el, iv_elements.value_el, iv_elements.options_el );
        return cloned_id;
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
        if (this.hasClass('iv-select-search')) return true;
        return false;
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
            options_el: 5, //options container element iv-select-options class
            item_el: 6, //selected item element iv-selected-item class
            delete_button: 7, //delete button element iv-del-button class
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
                iv_element = this.parent().parent().parent().parent();
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
                return iv_element.children('.iv-select-view').children('.iv-select-search');
            case iv_elements.value_el :
                return iv_element.children('.iv-select-value');
            case iv_elements.options_el :
                return iv_element.children('.iv-select-options');
            case iv_elements.item_el :
                return iv_element.children('.iv-select-view').children('.iv-select-text').children('.iv-selected-item');
            case iv_elements.delete_button :
                return iv_element.children('.iv-select-view').find('.iv-del-button');
            case 'all' :
                return {
                    main_el: iv_element,
                    view_el: iv_element.children('.iv-select-view'),
                    text_el: iv_element.children('.iv-select-view').children('.iv-select-text'),
                    search_el: iv_element.children('.iv-select-view').children('.iv-select-search'),
                    value_el: iv_element.children('.iv-select-value'),
                    options_el: iv_element.children('.iv-select-options'),
                    item_el: iv_element.children('.iv-select-view').children('.iv-select-text').children('.iv-selected-item'),
                    delete_button: iv_element.children('.iv-select-view').find('.iv-del-button')
                };
        }
    },
    iv_selectConvert: function({
        placeholder = "Select an option",
        text_el_class = "",
        text_el_style = "",
        class_for_search = "",
        search_style = "",
        class_for_value = "",
        container_class = "w3-white",
        options_container_class = "",
        options_container_style = "",
        option_class = "w3-block w3-button w3-hover-blue w3-border-left w3-border-right",
        option_style = "",
        keep_existing_class = 'toValue', // possible values: toText, toValue, toContainer
        close_after_click = true,
        no_search_element = false
    } = {}) {
        if (this.length == 0) return;
        this.each(function() {
            var args = {
                placeholder,
                text_el_style,
                text_el_class,
                class_for_search,
                search_style,
                class_for_value,
                container_class,
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

            //Determining the new iv-select element for existing class in the select element
            var existing_class = select_el.attr('class');
            if ( existing_class !== undefined && existing_class != '' ) {
                switch (args.keep_existing_class) {
                    case 'toValue':
                        args.class_for_value += ' ' + existing_class;
                        break;
                    case 'toText':
                        args.text_el_class += ' ' + existing_class;
                        break;
                    case 'toContainer':
                        args.container_class += ' ' + existing_class;
                        break;
                }
            }

            //add main element
            var iv_select = $('<div/>');
            iv_select.addClass( iv_settings.main_el.classes );
            iv_select.css( iv_settings.main_el.styles );
            if ( args.container_class != '' ) {
                iv_select.addClass( args.container_class );
            }

            //add view element
            var view_element = $('<div/>');
            view_element.addClass( iv_settings.view_el.classes );
            
            //add text element
            var text_element = $('<div/>');
            text_element.addClass( iv_settings.text_el.classes );
            text_element.css( iv_settings.text_el.styles );
            if ( args.text_el_style != '' ) {
                text_element.attr( 'style', args.text_el_style );
            }
            if ( args.text_el_class != '' ) {
                text_element.addClass( args.text_el_class );
            }

            view_element.append( text_element );
            //add search element
            if ( ! args.no_search_element ) {
                var search_element = $('<input>').attr({
                    autocomplete: 'off',
                    placeholder: args.placeholder
                });
                search_element.data( 'iv_placeholder', placeholder );
                search_element.addClass( iv_settings.search_el.classes );
                search_element.css( iv_settings.search_el.styles );
                if ( args.search_style != '' ) {
                    search_element.attr( 'style', search_element.attr('style') + args.search_style );
                }
                if ( class_for_search != '' ) {
                    search_element.addClass( args.class_for_search );
                }
                text_element.append( search_element );
            } else {
                text_element.css({width: '100%'});
                iv_select.css({'min-width': '100px', padding:'7px 8px'});
            }

            //start convert to iv-select
            //add tabindex to main el
            var tabindex = select_el.attr('tabindex');
            if ( tabindex !== 'undefined' && tabindex !== false ) {
                iv_select.attr('tabindex', tabindex);
                select_el.removeAttr('tabindex');
            }
            //add value element
            var attributes = select_el[0].attributes;
            var value_element = $('<select>');
            $.each( attributes, function( index, attribute ) {
                var attr_name = attribute.name;
                var attr_value = attribute.nodeValue;
                value_element.attr({ [attr_name]: attr_value });
            });
            value_element.css( iv_settings.value_el.styles );
            value_element.addClass( iv_settings.value_el.classes );
            if ( args.class_for_value != '' ) {
                value_element.addClass( args.class_for_value );
            }
            var multiple;
            if (select_el.prop('multiple') === true) multiple = 'multiple';
            value_element.attr({
                multiple: multiple
            });

            //add option container element
            var options_container = $('<div/>').attr({
                class: 'iv-select-options ' + args.options_container_class,
                style: 'display:none;position:absolute;width:100%;' + args.options_container_style,
            });
            options_container.addClass( iv_settings.options_el.classes );
            options_container.css( iv_settings.options_el.styles );
            if ( args.search_style != '' ) {
                options_container.attr( 'style', options_container.attr('style') + args.options_container );
            }
            //add value null option
            options_container.append(
                $('<option/>').attr({
                    class: 'w3-hide',
                    value: ''
                })
            );
            //add options to container
            var options = select_el.children('option');
            options.data('iv_closeAfterClick', args.close_after_click);
            options.last().addClass('w3-border-bottom');
            options.each(function() {
                $(this).addClass(args.option_class);
                $(this).attr('style', args.option_style);
            });
            options_container.append(options);

            //add elements to the main container
            iv_select.append( view_element, value_element, options_container );

            //set value of the iv-select
            var first_value = select_el.val();
            if ( select_el.data('iv-init-value') !== undefined ) {
                if (select_el.prop('multiple') === false) {
                    first_value = select_el.data('iv-init-value');
                } else {
                    first_value = select_el.data('iv-init-value').split('|');
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
