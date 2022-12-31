jQuery(document).on('click', '.iv-select-text', function(e) {
    var target_el = jQuery(e.target);
    if ( ! target_el.hasClass('iv-select-text') ) {
        target_el = target_el.parent().parent();
    }
    if ( target_el.next('.iv-select-value').prop('disabled') ) return;
    ivSelectDropDown( target_el, true );
});

function ivSelectDropDown(iv_input, clear_filter = true) {
    var options_container = iv_input.nextAll('div.iv-select-options');
    var search_el = iv_input.nextAll('input.iv-select-search');
    var options = options_container.children('option');
    setTimeout(function() { search_el.focus() }, 100);
    jQuery('.iv-select-text').nextAll('div.iv-select-options').not(options_container).hide();
    jQuery('.iv-select-text').nextAll('input.iv-select-search').not(search_el).hide();
    if (clear_filter) options.show();
    if (options_container.is(':hidden')) {
        options_container.show();
        var iv_input_pos = iv_input.offset();
        var search_el_height = search_el.outerHeight();
        options_container.css({
            position: 'absolute',
            width: iv_input.outerWidth() + 'px',
            // top: iv_input_pos.top + iv_input.outerHeight() + search_el_height
        });
        search_el.css({
            width: iv_input.outerWidth() + 'px',
        });
        options_container.hide();
        search_el.hide();
        search_el.show(100);
        options_container.show(200);
    } else {
        options_container.hide(200);
        search_el.hide(200);
    }
    jQuery('div.iv-select-options').not(options_container).hide(200);
}

const ivSelectOninvalid = (iv_value_dom, err_message) => {
    var text_el = jQuery(iv_value_dom).iv_textEl();
    text_el.attr( 'title', err_message );
    var position = text_el.offset();
    if ( text_el.next('span.iv-tooltip').length != 0 ) {
        text_el.next('span.iv-tooltip').remove();
    }
    text_el.after( 
        jQuery('<span style="position:absolute;background-color:#42414d;color:white;' + 
          'font-size:13px;padding:18px;left:' + position.left + 'px;width:250px"' + 
          ' class="iv-tooltip w3-round-large">' + err_message + '</span>') 
    );
    jQuery(iv_value_dom).on( 'invalid', function () {
        var text_el = jQuery(iv_value_dom).iv_textEl();
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
        if ( jQuery(iv_select).is_ivSelect() ) {
            if ( prop_value ) {
                jQuery(iv_select).iv_textEl().css('background-color', '#f1f1f1');
            } else {
                jQuery(iv_select).iv_textEl().css('background-color', 'white');
            }
        }
    }
};

jQuery(document).on('click', '.iv-select-options option', function(e) {
    var target_el = jQuery(e.target);
    var value_el = target_el.parent().parent().find('.iv-select-value');
    var search_el = target_el.parent().parent().find('.iv-select-search');
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
    search_el.hide(200);
});

jQuery(document).on('click', '.iv-del-item', function(e) {
    var target_el = jQuery(e.target);
    var iv_value_el = target_el.parent().parent().nextAll('select.iv-select-value');
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

jQuery(document).on('keyup', '.iv-select-search', function(e) {
    var target = jQuery(e.target);
    var search = target.val();
    var options = target.next('div.iv-select-options').children('option');
    options.removeClass('w3-border-bottom');
    options.hide();
    const result = options.filter(index => jQuery(options[index]).text().toLowerCase().indexOf(search.toLowerCase()) > -1);
    result.show();
    result.last().addClass('w3-border-bottom');
});

jQuery(document).on('click', function(e) {
    if (
        jQuery('.iv-select-options:hover').length == 0 &&
        jQuery('.iv-select-text:hover').length == 0 &&
        jQuery('.iv-select-icon:hover').length == 0 &&
        jQuery('.iv-select-search:hover').length == 0
    ) {
        jQuery('.iv-select-options').hide(200);
        jQuery('.iv-select-search').hide(200);
    }
    if ( jQuery(e.target).hasClass('iv-tooltip') ) {
        jQuery('.iv-tooltip').hide('fade');
    }
});

function addIvItem(item_text, item_val) {
    if ( item_text == '' ) return '&nbsp;';
    var container_node = jQuery('<div/>').attr({
        class: 'iv-selected-item w3-card w3-blue-gray w3-round w3-small'
    });
    container_node.data('iv_itemValue', item_val);
    container_node.attr('style', 'width:fit-content;display:inline-block;margin-left:1px;margin-right:1px;');
    var text_node = jQuery('<span/>').attr({
        style: 'padding:2px 8px;'
    });
    text_node.html(item_text + '&nbsp;');
    var btn_node = jQuery('<button/>').attr({
        class: 'iv-del-item w3-hover-black w3-round w3-red w3-button',
        style: 'padding:2px 8px;cursor:pointer;font-weight:900',
        type: 'button'
    });
    btn_node.html('&times;');
    return (container_node.append(text_node, btn_node));
}

(function(jQuery) {
    var originalFn = jQuery.fn.val;
    jQuery.fn.val = function(value) {
        if (!this.hasClass('iv-select-value') || value === undefined) return originalFn.apply(this, arguments);
        var options = this.nextAll('div.iv-select-options').children('option');
        var iv_text_el = this.prevAll('div.iv-select-text');
        var value_text = [];
        var value_option = '';
        if (this.prop('multiple') !== true) {
            if (Array.isArray(value)) value = value[0];
        }
        options.each(function() {
            if (Array.isArray(value)) {
                if (value.indexOf(jQuery(this).val()) != -1) {
                    jQuery(this).removeClass('w3-white');
                    jQuery(this).addClass('w3-light-gray');
                    value_text.push(addIvItem(jQuery(this).text(), jQuery(this).val()));
                    jQuery(this).prop("selected", true);
                    value_option += jQuery(this)[0].outerHTML;
                } else {
                    jQuery(this).prop("selected", false);
                    jQuery(this).addClass('w3-white');
                    jQuery(this).removeClass('w3-light-gray');
                }
            } else {
                if (jQuery(this).val() == value) {
                    jQuery(this).removeClass('w3-white');
                    jQuery(this).addClass('w3-light-gray');
                    value_text.push(addIvItem(jQuery(this).text(), jQuery(this).val()));
                    jQuery(this).prop("selected", true);
                    value_option += jQuery(this)[0].outerHTML;
                } else {
                    jQuery(this).prop("selected", false);
                    jQuery(this).addClass('w3-white');
                    jQuery(this).removeClass('w3-light-gray');
                }
            }
        });
        if ( value_text.length === 0 ) value_text = '&nbsp;';
        if ( this.attr('required') ) {
            if ( value == '' ) {
                this[0].setCustomValidity('Please fill out this field');
            }
        }
        this.empty().append(value_option);
        iv_text_el.empty().append(value_text);
        originalFn.apply(this, arguments);
    };
})(jQuery);

jQuery.fn.extend({
    iv_updateOptions: function(new_options) {
        if (!this.hasClass('iv-select-value')) return;
        var options_container = this.nextAll('div.iv-select-options');
        options_container.empty().append(new_options);
    },
    iv_getOptions: function() {
        if (!this.hasClass('iv-select-value')) return;
        var options_container = this.nextAll('div.iv-select-options');
        var option_nodes = options_container.children('option');
        var option_html = '';
        option_nodes.each( function() {
            jQuery(this).removeAttr('style');
            jQuery(this).removeAttr('class');
            option_html = option_html + this.outerHTML;
        });
        return option_html;
    },
    iv_getValuesArray: function() {
        if (!this.hasClass('iv-select-value')) return;
        var options_container = this.nextAll('div.iv-select-options');
        var option_nodes = options_container.children('option');
        const opt_values = [];
        option_nodes.each( function() {
            opt_values.push(this.value);
        });
        return opt_values;
    },
    iv_cloneSelect: function({
        name = "",
        id = "",
        placeholder = "Type to search",
        text_el_class = "w3-block w3-border",
        text_el_style = "background-color:white;cursor:pointer!important;padding:7px 8px;",
        container_class = "",
        container_style = "",
        options_container_class = "",
        options_container_style = "",
        option_class = "w3-block w3-button w3-hover-blue w3-border-left w3-border-right",
        option_style = "",
        remove_unselected = true,
        close_after_click = true
    } = {}) {
        if (!this.hasClass('iv-select-value')) return;        
        var value = this.val();
        var iv_select_container = this.parent('div.iv-select');
        var cloned_iv = iv_select_container.clone();
        cloned_iv.attr({
            class: 'iv-select ' + container_class,
            style: container_style
        });
        if ( name != '' ) {
            cloned_iv.children('select.iv-select-value').attr('name', name);
        }
        if ( id != '' ) {
            cloned_iv.children('select.iv-select-value').attr('id', id);
        } else {
            cloned_iv.children('select.iv-select-value').removeAttr('id');
        }
        if ( cloned_iv.children('select.iv-select-value').prop('multiple') === true ) {
            cloned_iv.children('select.iv-select-value').children('option').each(function() {
                jQuery(this).attr('selected', true);
            });
        }
        cloned_iv.children('input.iv-select-search').attr('placeholder', placeholder);
        cloned_iv.children('div.iv-select-text').attr({
            class: 'iv-select-text ' + text_el_class,
            style: text_el_style
        });
        cloned_iv.children('div.iv-select-options').attr({
            class: 'iv-select-options ' + options_container_class,
            style: options_container_style
        });
        if (remove_unselected) {
            cloned_iv.children('div.iv-select-options').children('option').filter(function() {
                if (jQuery(this).val() != value) {
                    jQuery(this).remove();
                }
            });
        }
        cloned_iv.children('div.iv-select-options').children('option').each(function() {
            jQuery(this).attr('style', option_style);
            jQuery(this).addClass(option_class);
            jQuery(this).data('iv_closeAfterClick', close_after_click);
        });
        return cloned_iv;
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
    iv_selectConvert: function({
        placeholder = "Type to search",
        text_el_class = "w3-block w3-border",
        text_el_style = "",
        class_for_search = "w3-block",
        search_style = "",
        class_for_value = "",
        container_class = "",
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
            var existing_class = '';
            var select_el = jQuery(this);
            if (select_el[0].tagName != 'SELECT') return;
            if (select_el.hasClass('iv-select-value')) return;
            existing_class = select_el.attr('class');
            if (existing_class !== undefined && existing_class != '') {
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
            var first_value = select_el.val();
            var options = select_el.children('option');
            var multiple;
            options.last().addClass('w3-border-bottom');
            options.each(function() {
                jQuery(this).addClass(args.option_class);
                jQuery(this).attr('style', args.option_style);
            });
            if (select_el.prop('multiple') === true) multiple = 'multiple';
            var iv_select = jQuery('<div/>').attr({
                class: 'iv-select ' + args.container_class,
            });
            var tabindex = select_el.attr('tabindex');
            if ( tabindex !== 'undefined' && tabindex !== false ) {
                iv_select.attr('tabindex', tabindex);
                select_el.removeAttr('tabindex');
            }
            var text_element = jQuery('<div/>').attr({
                class: 'iv-select-text ' + args.text_el_class,
                style: 'background-color:white;cursor:pointer!important;padding:7px 8px;' + args.text_el_style,
            });
            if (!args.no_search_element) {
                var search_element = jQuery('<input>').attr({
                    class: 'iv-select-search ' + args.class_for_search,
                    autocomplete: 'off',
                    style: "display:none;position:absolute;" + args.search_style,
                    placeholder: args.placeholder
                });
            }
            var attributes = select_el[0].attributes;
            var value_element = jQuery('<select>');
            jQuery.each( attributes, function( index, attribute ) {
                var attr_name = attribute.name;
                var attr_value = attribute.nodeValue;
                value_element.attr({ [attr_name]: attr_value });
            });
            value_element.attr({
                style: 'display:none;',
                class: 'iv-select-value ' + args.class_for_value,
                multiple: multiple
            });
            var options_element = jQuery('<div/>').attr({
                class: 'iv-select-options ' + args.options_container_class,
                style: 'display:none;' + args.options_container_style,
            });
            options.data('iv_closeAfterClick', args.close_after_click);
            options_element.append(
                jQuery('<option/>').attr({
                    class: 'w3-hide',
                    value: ''
                })
            );
            options_element.append(options);
            if (args.no_search_element) {
                iv_select.append(text_element, value_element, options_element);
            } else {
                iv_select.append(text_element, value_element, search_element, options_element);
            }
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
            select_el.replaceWith(iv_select);
        });
    }
});
