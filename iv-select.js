$(document).on('click', '.iv-select-text', function(e) {
    ivSelectDropDown( $(e.target), true, false );
});

$(document).on('click', '.iv-select-options option', function(e) {
    var target_el = $(e.target);
    var text_el = target_el.parent().parent().find('.iv-select-text');
    var value_el = target_el.parent().parent().find('.iv-select-value');
    var search_el = target_el.parent().parent().find('.iv-select-search');
    if ( value_el.iv_isMultiple() ) {

    } else {
        text_el.html(addIvItem(target_el.text()));
        value_el.val(target_el.val());
        search_el.val('');
        value_el.trigger('change');
        target_el.parent().hide(200);
        search_el.hide(200);
        target_el.prop("selected", true);
        target_el.parent().find('option').not(e.target).prop("selected", false);    
    }
});

function addIvItem(item_text) {
    return( 
        '<div class="iv-selected-item w3-card w3-cell w3-blue-gray w3-round">' +
        '<span class="w3-padding-small">' + item_text + 
        '&nbsp;</span><i class="fas fa-times iv-del-item w3-red w3-padding-small w3-hover-black"' + 
        'style="cursor:pointer;border-bottom-left-radius: 4px;border-top-left-radius: 4px;"></i></div>'
    )
}

$(document).on( 'keyup', '.iv-select-search', function(e) {
    var target = $(e.target);
    target.nextAll('input.iv-select-value').data( 'iv_keyup', true );
    ivSelectDropDown( target );
    var search = target.val();
    target.nextAll( 'div.iv-select-options' ).children('option').filter(function() {
        if ( $(this).text().indexOf(search) > -1 ) {
            $(this).show();
        } else {
            $(this).hide();            
        }
    });
});

$(document).on('click', function() {
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
        $('.iv-select-value').each( function () {
            if ( $(this).data('iv_keyup') == true ) $(this).iv_hasValidValue();
        });
    }
});

//update iv select to selected option on document load
$('.iv-select').each(function() {
    var options_container = $(this).find( 'div.iv-select-options' );
    var iv_text_el = $(this).find( 'input.iv-select-text' );
    var iv_value_el = $(this).find( 'input.iv-select-value' );
    var clear_val = true;
    if ( options_container.find(":selected").length != 0 ) {
        var selected_text = options_container.find(":selected").text();
        var selected_value = options_container.find(":selected").val();
        iv_text_el.text(selected_text);
        iv_value_el.val(selected_value);
        iv_value_el.trigger('change');
        clear_val = false;
    } else if ( iv_value_el.val() != '' ) {
        var options = options_container.children('option');
        options.each( function() {
            if ( iv_value_el.val() == $(this).val() ) {
                $(this).prop("selected", true);
                iv_text_el.text( $(this).text() );
                iv_value_el.change();
                clear_val = false;
            }
        });
    } 
    if ( clear_val ) {
        iv_text_el.val('');
        iv_value_el.val('');
    }
});

function ivSelectDropDown( iv_input, clear_filter = true, auto_hide = false ) {
    var options_container = iv_input.nextAll('div.iv-select-options');
    var search_el = iv_input.next('input.iv-select-search');
    var options = options_container.children('option');
    var iv_container = iv_input.parent('div.iv-select');
    $('.iv-select-text').nextAll('div.iv-select-options').not(options_container).hide();
    if (clear_filter) options.show();
    if (options_container.is(':hidden')) {
        search_el.show(200);
        options_container.attr( 
            'style', 
            'position:absolute;width:' + iv_container.width() + 'px;' 
        );
        options_container.show(200);
    } else if (auto_hide) {
        options_container.hide(200);
        search_el.hide(200);
    }
}

$.fn.extend({
    iv_setValue : function ( value ) {
        if ( ! this.hasClass('iv-select-value') ) return;
        var iv_text = this.prevAll('input.iv-select-text');
        var options_container = this.nextAll('div.iv-select-options');
        var target_option = options_container.find('option[value="' + value + '"]');
        if ( target_option.length != 0 ) {
            options_container.find('option').prop("selected", false);
            target_option.prop("selected", true);
            iv_text.val( target_option.text() );
            this.val( target_option.val() );
        } else {
            options_container.find('option').prop("selected", false);
            iv_text.val( '' );
            this.val( '' );
        }
    },
    iv_updateOptions : function ( new_options ) {
        if ( ! this.hasClass('iv-select-value') ) return;
        var options_container = this.nextAll('div.iv-select-options');
        options_container.empty().append( new_options );
    },
    iv_cloneSelect : function ( 
        {
            name,
            placeholder = "برای جستجو تایپ نمایید",
            input_class = "",
            input_style = "",
            container_class = "", 
            container_style = "",
            options_container_class = "",
            options_container_style = "",
            option_class = "w3-block w3-button",
            option_style = "",
            remove_unselected = true
        } = {}
        ) {
        if ( ! this.hasClass('iv-select-value') ) return;
        var value = this.val();
        var iv_select_container = this.parent('div.iv-select');
        var cloned_iv = iv_select_container.clone();
        cloned_iv.addClass(container_class);
        cloned_iv.attr('style', container_style);
        cloned_iv.children('input.iv-select-value').attr('name', name);
        cloned_iv.children('input.iv-select-text').attr('style', input_style);
        cloned_iv.children('input.iv-select-text').attr('placeholder', placeholder);
        cloned_iv.children('input.iv-select-text').addClass(input_class);
        cloned_iv.children('div.iv-select-options').addClass(options_container_class);
        cloned_iv.children('div.iv-select-options').attr('style', options_container_style);
        if ( remove_unselected ) {
            cloned_iv.children('div.iv-select-options').children('option').filter(function() {
                if ( $(this).val() != value ) {
                    $(this).remove();
                }
            });
        }
        cloned_iv.children('div.iv-select-options').children('option').each(function() {
            $(this).attr('style', option_style);
            $(this).addClass(option_class);
        });
        return cloned_iv;
    },
    is_ivSelect : function () {
        if ( ! this.hasClass('iv-select-value') ) return false;
        return true;
    },
    iv_textEl : function () {
        if ( ! this.hasClass('iv-select-value') ) return false;
        return this.prevAll('input.iv-select-text');
    },
    iv_hasValidValue : function () {
        if ( ! this.hasClass('iv-select-value') ) return false;
        var check = false;
        var text_el = this.iv_textEl();
        var options = this.nextAll('div.iv-select-options').children('option');
        options.each( function() {
            if ( text_el.val() == $(this).text() ) {
                check = true;
            }
        });
        if ( ! check ) {
            if ( text_el.val() != '') {
                this.iv_setValue( options.filter(function() {
                    if ( $(this).text().indexOf(text_el.val()) > -1 ) {
                        return $(this);
                    }
                }).first().val() );
            } else {
                this.iv_setValue('');
            }
        }
    },
    iv_selectConvert : function (
        {
            placeholder = "برای جستجو تایپ نمایید",
            text_style = "",
            text_class = "w3-input w3-border",
            search_class = "w3-input w3-border w3-border-blue",
            search_style = "",
            value_class = "",
            container_class = "", 
            options_container_class = "",
            options_container_style = "",
            option_class = "w3-block w3-button w3-white w3-hover-blue w3-border-left w3-border-right w3-border-blue",
            option_style = "",
            keep_existing_class = 'toValue', // possible values: toText, toValue, toContainer
        } = {}
    ) {
        if (this[0].tagName != 'SELECT') return;
        var name = '';
        var existing_class = this.attr('class');
        if ( existing_class !== undefined && existing_class != '') {
            switch (keep_existing_class) {
                case 'toValue' :
                    value_class += ' ' + existing_class;
                    break;
                case 'toText' :
                    search_class += ' ' + existing_class;
                    break;
                case 'toContainer' :
                    container_class += ' ' + existing_class;
                    break;
            }
        }
        var id = '';
        if ( this.attr('id') !== undefined && this.attr('id') != '' ) {
            id = "id='" + this.attr('id') + "'";
        }
        var value = this.val();
        var value_text = '';
        var new_option = '';
        var options = this.children('option');
        options.last().addClass('w3-border-bottom');
        options.each(function() {
            $(this).addClass(option_class);
            $(this).attr('style', option_style);
            if ( $(this).val() == value ) {
                $(this).attr("selected", 'selected');
                value_text = $(this).text();
            } else {
                $(this).prop("selected", false);
            }
            new_option = new_option + $(this)[0].outerHTML;
        });
        if ( this.attr('name') !== undefined ) name = 'name="' + this.attr('name') + '"';
        var iv_text_el = '<div class="iv-select-text w3-display-container w3-padding ' + text_class + 
                         '" style="' + text_style + '">' + addIvItem(value_text) + '</div>';
        var iv_search_el = '<input type="text" class="iv-select-search ' + search_class +
                           '" autocomplete="off" style="display:none" placeholder="' + placeholder + 
                           '" style="' + search_style + '">';
        var iv_value_el = '<input ' + id + ' type="hidden" ' + name + ' class="iv-select-value ' + value_class + 
                          '" value="' + value + '">';
        this.replaceWith( 
            '<div class="iv-select ' + container_class + '">' + iv_text_el + iv_search_el + iv_value_el + 
            '<div class="iv-select-options ' + options_container_class + '" style="display:none;' + options_container_style + '">' + 
            new_option + '</div>' 
        );
    },
    iv_isMultiple : function () {
        if ( ! this.hasClass('iv-select-value') ) return false;
        var iv_contaniner = this.parent('.iv-select');
        if ( iv_contaniner.data('multiple') === true ) {
            return true;
        } else {
            return false;
        }
    }
});