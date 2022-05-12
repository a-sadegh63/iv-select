$(document).on('click', '.iv-select-text', function(e) {
    ivSelectDropDown($(e.target), true, false);
});

$(document).on('click', '.iv-select-options option', function(e) {
    var target_el = $(e.target);
    var value_el = target_el.parent().parent().find('.iv-select-value');
    var search_el = target_el.parent().parent().find('.iv-select-search');
    if (value_el.prop('multiple') === true) {
        var current_value = value_el.val();
        if (!Array.isArray(current_value)) {
            current_value = [current_value];
        }
        current_value.push(target_el.val());
        value_el.val(current_value);
    } else {
        value_el.val(target_el.val());
    }
    if (target_el.data('iv_closeAfterClick')) {
        target_el.parent().hide(200);
    }
    search_el.val('');
});

$(document).on('click', '.iv-del-item', function(e) {
    var target_el = $(e.target);
    var item_container = target_el.parent();
    var del_item = item_container.data('iv_itemValue');
    var iv_value_el = target_el.parent().parent().nextAll('select.iv-select-value');
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
    iv_value_el.parent().find('.iv-select-options').hide(200);
    item_container.remove();
});

$(document).on('keyup', '.iv-select-search', function(e) {
    var target = $(e.target);
    var search = target.val();
    var options = target.parent('div.iv-select-options').children('option');
    options.removeClass('w3-border-bottom');
    options.hide();
    const result = options.filter(index => $(options[index]).text().toLowerCase().indexOf(search.toLowerCase()) > -1);
    result.show();
    result.last().addClass('w3-border-bottom');
});

$(document).on('click', function() {
    if (
        $('.iv-select-options:hover').length == 0 &&
        $('.iv-select-text:hover').length == 0 &&
        $('.iv-select-icon:hover').length == 0 &&
        $('.iv-select-search:hover').length == 0
    ) {
        $('.iv-select-options').hide(200);
    }
});

function ivSelectDropDown(iv_input, clear_filter = true, auto_hide = false) {
    var options_container = iv_input.nextAll('div.iv-select-options');
    var search_el = iv_input.next('input.iv-select-search');
    var options = options_container.children('option');
    setTimeout(function() { search_el.focus() }, 100);
    $('.iv-select-text').nextAll('div.iv-select-options').not(options_container).hide();
    if (clear_filter) options.show();
    if (options_container.is(':hidden')) {
        options_container.show();
        options_container.css({
            position: 'absolute',
            width: iv_input.outerWidth() + 'px'
        });
        options_container.hide();
        options_container.show(200);
    } else if (auto_hide) {
        options_container.hide(200);
    }
    $('div.iv-select-options').not(options_container).hide(200);
}

function addIvItem(item_text, item_val) {
    var container_node = $('<div/>').attr({
        class: 'iv-selected-item w3-card w3-blue-gray w3-round w3-small'
    });
    container_node.data('iv_itemValue', item_val);
    container_node.css('width', 'fit-content');
    var text_node = $('<span/>').attr({
        class: 'w3-padding-small'
    });
    text_node.html(item_text + '&nbsp;');
    var btn_node = $('<i/>').attr({
        class: 'fas fa-times iv-del-item w3-red w3-padding-small w3-hover-black',
        style: 'cursor:pointer;border-bottom-left-radius:4px;border-top-left-radius:4px;'
    });
    return (container_node.append(text_node, btn_node));
}

(function($) {
    var originalFn = $.fn.val;
    $.fn.val = function(value) {
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
        if (value_text.length === 0) value_text = '&nbsp;';
        this.empty().append(value_option);
        iv_text_el.empty().append(value_text);
        this.trigger('change');
        return (originalFn.apply(this, arguments));
    };
})(jQuery);

$.fn.extend({
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
            $(this).removeAttr('style');
            $(this).removeAttr('class');
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
        name,
        id = "",
        placeholder = "برای جستجو تایپ نمایید",
        text_el_class = "w3-input w3-border",
        text_el_style = "min-width:200px;background-color:white;",
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
        cloned_iv.children('select.iv-select-value').attr('name', name);
        if (id != '') {
            cloned_iv.children('select.iv-select-value').attr('id', id);
        } else {
            cloned_iv.children('select.iv-select-value').removeAttr('id');
        }
        cloned_iv.children('input.iv-select-search').attr('placeholder', placeholder);
        cloned_iv.children('input.iv-select-text').attr({
            class: 'iv-select-text ' + text_el_class,
            style: text_el_style
        });
        cloned_iv.children('div.iv-select-options').attr({
            class: 'iv-select-options ' + options_container_class,
            style: options_container_style
        });
        if (remove_unselected) {
            cloned_iv.children('div.iv-select-options').children('option').filter(function() {
                if ($(this).val() != value) {
                    $(this).remove();
                }
            });
        }
        cloned_iv.children('div.iv-select-options').children('option').each(function() {
            $(this).attr('style', option_style);
            $(this).addClass(option_class);
            $(this).data('iv_closeAfterClick', close_after_click);
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
        placeholder = "برای جستجو تایپ نمایید",
        style_for_text = "",
        class_for_text = "w3-input w3-border",
        class_for_search = "w3-block",
        search_style = "",
        class_for_value = "",
        class_for_container = "",
        class_for_opts_container = "",
        style_for_opts_container = "",
        class_for_options = "w3-block w3-button w3-hover-blue w3-border-left w3-border-right",
        option_style = "",
        keep_existing_class = 'toValue', // possible values: toText, toValue, toContainer
        close_after_click = true,
        no_search_element = false
    } = {}) {
        if (this.length == 0) return;
        this.each(function() {
            var args = {
                placeholder,
                style_for_text,
                class_for_text,
                class_for_search,
                search_style,
                class_for_value,
                class_for_container,
                class_for_opts_container,
                style_for_opts_container,
                class_for_options,
                option_style,
                keep_existing_class,
                close_after_click,
                no_search_element
            }
            var existing_class = '';
            var select_el = $(this);
            if (select_el[0].tagName != 'SELECT') return;
            if (select_el.hasClass('iv-select-value')) return;
            existing_class = select_el.attr('class');
            if (existing_class !== undefined && existing_class != '') {
                switch (args.keep_existing_class) {
                    case 'toValue':
                        args.class_for_value += ' ' + existing_class;
                        break;
                    case 'toText':
                        args.class_for_text += ' ' + existing_class;
                        break;
                    case 'toContainer':
                        args.class_for_container += ' ' + existing_class;
                        break;
                }
            }
            const value = select_el.val();
            var options = select_el.children('option');
            var multiple;
            options.last().addClass('w3-border-bottom');
            options.each(function() {
                $(this).addClass(args.class_for_options);
                $(this).attr('style', args.option_style);
            });
            if (select_el.prop('multiple') === true) multiple = 'multiple';
            var iv_select = $('<div/>').attr({
                class: 'iv-select ' + args.class_for_container,
            });
            var text_element = $('<div/>').attr({
                class: 'iv-select-text ' + args.class_for_text,
                style: 'min-width:200px;background-color:white;' + args.style_for_text,
            });
            if (!args.no_search_element) {
                var search_element = $('<input>').attr({
                    class: 'iv-select-search ' + args.class_for_search,
                    autocomplete: 'off',
                    style: args.search_style,
                    placeholder: args.placeholder
                });
            }
            var attributes = select_el[0].attributes;
            var value_element;
            $.each( attributes, function( index, attribute ) {
                var attr_name = attribute.name;
                var attr_value = attribute.nodeValue;
                value_element = $('<select>').attr({ [attr_name]: attr_value });
            });
            value_element.attr({
                style: 'display:none;',
                class: 'iv-select-value ' + args.class_for_value,
                multiple: multiple
            });
            var options_element = $('<div/>').attr({
                class: 'iv-select-options ' + args.class_for_opts_container,
                style: 'display:none;' + args.style_for_opts_container,
            });
            options.data('iv_closeAfterClick', args.close_after_click);
            if (args.no_search_element) {
                options_element.append(options);
            } else {
                options_element.append(search_element, options);
            }
            iv_select.append(text_element, value_element, options_element);
            iv_select.find('select.iv-select-value').val(value);
            select_el.replaceWith(iv_select);
        });
    }
});
