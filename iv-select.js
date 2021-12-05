$(document).on('click', '.iv-select-text', function (e) {
    console.log($(e.target).outerWidth())
    ivSelectDropDown($(e.target), true, false);
});

$(document).on('click', '.iv-select-options option', function (e) {
    var target_el = $(e.target);
    var value_el = target_el.parent().parent().find('.iv-select-value');
    var search_el = target_el.parent().parent().find('.iv-select-search');
    if (value_el.prop('multiple') === true)  {
        var current_value = value_el.val();
        if ( ! Array.isArray(current_value) ) {
            current_value = [current_value];
        }
        current_value.push(target_el.val());
        value_el.val(current_value);
    } else {
        value_el.val(target_el.val());
    }
    if ( target_el.data('iv_closeAfterClick') ) {
        target_el.parent().hide(200);
        target_el.parent().parent().find('input.iv-select-search').hide(200);
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
            console.log(item_container)
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
    item_container.remove();
});

$(document).on('keyup', '.iv-select-search', function (e) {
    var target = $(e.target);
    target.nextAll('input.iv-select-value').data('iv_keyup', true);
    ivSelectDropDown(target);
    var search = target.val();
    var options = target.nextAll('div.iv-select-options').children('option');
    options.removeClass('w3-border-bottom');
    options.hide();
    const result = options.filter(index => $(options[index]).text().toLowerCase().indexOf(search.toLowerCase()) > -1);
    result.show();
    result.last().addClass('w3-border-bottom');
});

$(document).on('click', function () {
    if (
        $('.iv-select-options:hover').length == 0
        &&
        $('.iv-select-text:hover').length == 0
        &&
        $('.iv-select-icon:hover').length == 0
        &&
        $('.iv-select-search:hover').length == 0
    ) {
        $('.iv-select-options').hide(200);
        $('.iv-select-search').hide(200);
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
        search_el.show(200);
        options_container.show();
        options_container.attr(
            'style',
            'position:absolute;width:' + iv_input.outerWidth() + 'px;'
        );
        options_container.hide();
        options_container.show(200);
    } else if (auto_hide) {
        options_container.hide(200);
        search_el.hide(200);
    }
}

function addIvItem(item_text, item_val) {
    var container_node = $('<div/>').attr({
        class : 'iv-selected-item w3-card w3-cell w3-blue-gray w3-round'
    });
    container_node.data('iv_itemValue', item_val);
    var text_node = $('<span/>').attr({
        class : 'w3-padding-small'
    });
    text_node.html(item_text + '&nbsp;');
    var btn_node = $('<i/>').attr({
        class : 'fas fa-times iv-del-item w3-red w3-padding-small w3-hover-black',
        style : 'cursor:pointer;border-bottom-left-radius:4px;border-top-left-radius:4px;'
    });
    return(container_node.append(text_node, btn_node));
}

(function ($) {
    var originalFn = $.fn.val;
    $.fn.val = function (value) {
        if ( ! this.hasClass('iv-select-value') || value === undefined ) return originalFn.apply(this, arguments);
        var options = this.nextAll('div.iv-select-options').children('option');
        var iv_text_el = this.prevAll('div.iv-select-text');
        var value_text = [];
        var value_option = '';
        if ( this.prop('multiple') !== true ) {
            if ( Array.isArray(value) ) value = value[0];
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
        if ( value_text.length === 0 ) value_text = '&nbsp;';
        this.empty().append(value_option);
        iv_text_el.empty().append(value_text);
        return( originalFn.apply(this, arguments) );
    };
})(jQuery);

$.fn.extend({
    iv_updateOptions: function (new_options) {
        if (!this.hasClass('iv-select-value')) return;
        var options_container = this.nextAll('div.iv-select-options');
        options_container.empty().append(new_options);
    },
    iv_cloneSelect: function (
        {
            name,
            placeholder = "برای جستجو تایپ نمایید",
            text_el_class = "",
            text_el_style = "",
            container_class = "",
            container_style = "",
            options_container_class = "",
            options_container_style = "",
            option_class = "w3-block w3-button",
            option_style = "",
            remove_unselected = true
        } = {}
    ) {
        if (!this.hasClass('iv-select-value')) return;
        var value = this.val();
        var iv_select_container = this.parent('div.iv-select');
        var cloned_iv = iv_select_container.clone();
        cloned_iv.attr({
            class : 'iv-select ' + container_class,
            style : container_style
        });
        cloned_iv.children('input.iv-select-value').attr('name', name);
        cloned_iv.children('input.iv-select-search').attr('placeholder', placeholder);
        cloned_iv.children('input.iv-select-text').attr({
            class : 'iv-select-text ' + text_el_class,
            style : text_el_style
        });
        cloned_iv.children('div.iv-select-options').attr({
            class : 'iv-select-options ' + options_container_class,
            style : options_container_style
        });
        if (remove_unselected) {
            cloned_iv.children('div.iv-select-options').children('option').filter(function () {
                if ($(this).val() != value) {
                    $(this).remove();
                }
            });
        }
        cloned_iv.children('div.iv-select-options').children('option').each(function () {
            $(this).attr('style', option_style);
            $(this).addClass(option_class);
        });
        return cloned_iv;
    },
    is_ivSelect: function () {
        if (!this.hasClass('iv-select-value')) return false;
        return true;
    },
    iv_textEl: function () {
        if (!this.hasClass('iv-select-value')) return false;
        return this.prevAll('div.iv-select-text');
    },
    iv_selectConvert: function (
        {
            placeholder = "برای جستجو تایپ نمایید",
            text_style = "",
            text_class = "w3-input w3-border w3-display-container w3-padding",
            search_class = "w3-input w3-border-left w3-border-right",
            search_style = "",
            value_class = "",
            container_class = "",
            options_container_class = "",
            options_container_style = "",
            option_class = "w3-block w3-button w3-white w3-hover-blue w3-border-left w3-border-right",
            option_style = "",
            keep_existing_class = 'toValue', // possible values: toText, toValue, toContainer
            close_after_click = true
        } = {}
    ) {
        if (this.length == 0) return;
        if (this[0].tagName != 'SELECT') return;
        if (this.hasClass('iv-select-value')) return;
        var existing_class = this.attr('class');
        if (existing_class !== undefined && existing_class != '') {
            switch (keep_existing_class) {
                case 'toValue':
                    value_class += ' ' + existing_class;
                    break;
                case 'toText':
                    text_class += ' ' + existing_class;
                    break;
                case 'toContainer':
                    container_class += ' ' + existing_class;
                    break;
            }
        }
        const value = this.val();
        var options = this.children('option');
        var multiple;
        options.last().addClass('w3-border-bottom');
        options.each(function () {
            $(this).addClass(option_class);
            $(this).attr('style', option_style);
        });
        if (this.prop('multiple') === true) multiple = 'multiple';
        var iv_select = $('<div/>').attr({
            class : 'iv-select ' + container_class,
        });
        var text_element = $('<div/>').attr({
            class : 'iv-select-text ' + text_class,
            style : text_style,
        });
        var search_element = $('<input>').attr({
            class : 'iv-select-search ' + search_class,
            autocomplete : 'off',
            style : 'display:none;' + search_style,
            placeholder : placeholder
        });
        var value_element = $('<select>').attr({
            id : (this.attr('id') !== undefined && this.attr('id') != '') ? this.attr('id') : null,
            name : (this.attr('name') !== undefined) ? this.attr('name') : null,
            style : 'display:none;',
            class : 'iv-select-value ' + value_class, 
            multiple : multiple
        });
        var options_element = $('<div/>').attr({
            class : 'iv-select-options ' + options_container_class,
            style : 'display:none;' + options_container_style,
        });
        options.data('iv_closeAfterClick', close_after_click);
        options_element.append(options);
        iv_select.append(text_element, search_element, value_element, options_element);
        iv_select.find('select.iv-select-value').val(value);
        this.replaceWith(iv_select);        
    }
});