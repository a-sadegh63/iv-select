$(document).on("click",".iv-select-text",(function(e){$(e.target).next(".iv-select-value").prop("disabled")||ivSelectDropDown($(e.target),!0,!1)}));const ivSelectOninvalid=async(iv_value_dom,err_message)=>{var text_el=$(iv_value_dom).iv_textEl();text_el.attr("title",err_message);var position=text_el.offset(),width=text_el.outerWidth();0!=text_el.next("span.iv-tooltip").length&&text_el.next("span.iv-tooltip").remove(),text_el.after($('<span style="position:absolute;background-color:#42414d;color:white;font-size:13px;padding:18px;left:'+position.left+"px;width:"+width+'px" class="iv-tooltip w3-round">'+err_message+"</span>")),$(iv_value_dom).on("invalid",(function(){var text_el=$(iv_value_dom).iv_textEl();0!=text_el.next("span.iv-tooltip").length&&text_el.next("span.iv-tooltip").show(),text_el[0].getBoundingClientRect().bottom>window.innerHeight&&text_el[0].scrollIntoView(!1),text_el[0].getBoundingClientRect().top<0&&text_el[0].scrollIntoView()}))};function ivSelectDropDown(iv_input,clear_filter=!0,auto_hide=!1){var options_container=iv_input.nextAll("div.iv-select-options"),search_el=iv_input.next("input.iv-select-search"),options=options_container.children("option");setTimeout((function(){search_el.focus()}),100),$(".iv-select-text").nextAll("div.iv-select-options").not(options_container).hide(),clear_filter&&options.show(),options_container.is(":hidden")?(options_container.show(),options_container.css({position:"absolute",width:iv_input.outerWidth()+"px"}),options_container.hide(),options_container.show(200)):auto_hide&&options_container.hide(200),$("div.iv-select-options").not(options_container).hide(200)}function addIvItem(item_text,item_val){var container_node=$("<div/>").attr({class:"iv-selected-item w3-card w3-blue-gray w3-round w3-small"});container_node.data("iv_itemValue",item_val),container_node.css("width","fit-content");var text_node=$("<span/>").attr({class:"w3-padding-small"});text_node.html(item_text+"&nbsp;");var btn_node=$("<i/>").attr({class:"fas fa-times iv-del-item w3-red w3-padding-small w3-hover-black",style:"cursor:pointer;border-bottom-left-radius:4px;border-top-left-radius:4px;"});return container_node.append(text_node,btn_node)}jQuery.propHooks.disabled={set:function(iv_select,prop_value){$(iv_select).is_ivSelect()&&(prop_value?$(iv_select).iv_textEl().css("background-color","#d5d5d5"):$(iv_select).iv_textEl().css("background-color","white"))}},$(document).on("click",".iv-select-options option",(function(e){var target_el=$(e.target),value_el=target_el.parent().parent().find(".iv-select-value"),search_el=target_el.parent().parent().find(".iv-select-search");if(!0===value_el.prop("multiple")){var current_value=value_el.val();Array.isArray(current_value)||(current_value=[current_value]);const index=current_value.indexOf(target_el.val());-1==index&&(current_value.push(target_el.val()),value_el.val(current_value))}else value_el.val(target_el.val());value_el.trigger("change"),target_el.data("iv_closeAfterClick")&&target_el.parent().hide(200),search_el.val("")})),$(document).on("click",".iv-del-item",(function(e){var target_el=$(e.target),iv_value_el=target_el.parent().parent().nextAll("select.iv-select-value");if(!iv_value_el.prop("disabled")){var item_container=target_el.parent(),del_item=item_container.data("iv_itemValue");if(!0===iv_value_el.prop("multiple")){var current_value=iv_value_el.val();if(Array.isArray(current_value)){const index=current_value.indexOf(del_item);-1!=index&&(current_value.splice(index,1),iv_value_el.val(current_value))}else iv_value_el.val([])}else iv_value_el.val("");iv_value_el.trigger("change"),iv_value_el.parent().find(".iv-select-options").hide(200),item_container.remove()}})),$(document).on("keyup",".iv-select-search",(function(e){var target=$(e.target),search=target.val(),options=target.parent("div.iv-select-options").children("option");options.removeClass("w3-border-bottom"),options.hide();const result=options.filter(index=>$(options[index]).text().toLowerCase().indexOf(search.toLowerCase())>-1);result.show(),result.last().addClass("w3-border-bottom")})),$(document).on("click",(function(){0==$(".iv-select-options:hover").length&&0==$(".iv-select-text:hover").length&&0==$(".iv-select-icon:hover").length&&0==$(".iv-select-search:hover").length&&$(".iv-select-options").hide(200),0==$(".iv-tooltip:hover").length&&setTimeout((function(){$(".iv-tooltip").hide()}),3e3)})),function($){var originalFn=$.fn.val;$.fn.val=function(value){if(!this.hasClass("iv-select-value")||void 0===value)return originalFn.apply(this,arguments);var options=this.nextAll("div.iv-select-options").children("option"),iv_text_el=this.prevAll("div.iv-select-text"),value_text=[],value_option="";!0!==this.prop("multiple")&&Array.isArray(value)&&(value=value[0]),options.each((function(){Array.isArray(value)?-1!=value.indexOf($(this).val())?($(this).removeClass("w3-white"),$(this).addClass("w3-light-gray"),value_text.push(addIvItem($(this).text(),$(this).val())),$(this).prop("selected",!0),value_option+=$(this)[0].outerHTML):($(this).prop("selected",!1),$(this).addClass("w3-white"),$(this).removeClass("w3-light-gray")):$(this).val()==value?($(this).removeClass("w3-white"),$(this).addClass("w3-light-gray"),value_text.push(addIvItem($(this).text(),$(this).val())),$(this).prop("selected",!0),value_option+=$(this)[0].outerHTML):($(this).prop("selected",!1),$(this).addClass("w3-white"),$(this).removeClass("w3-light-gray"))})),0===value_text.length&&(value_text="&nbsp;"),this.empty().append(value_option),iv_text_el.empty().append(value_text),originalFn.apply(this,arguments)}}(jQuery),$.fn.extend({iv_updateOptions:function(new_options){var options_container;this.hasClass("iv-select-value")&&this.nextAll("div.iv-select-options").empty().append(new_options)},iv_getOptions:function(){if(this.hasClass("iv-select-value")){var options_container,option_nodes=this.nextAll("div.iv-select-options").children("option"),option_html="";return option_nodes.each((function(){$(this).removeAttr("style"),$(this).removeAttr("class"),option_html+=this.outerHTML})),option_html}},iv_getValuesArray:function(){if(!this.hasClass("iv-select-value"))return;var options_container,option_nodes=this.nextAll("div.iv-select-options").children("option");const opt_values=[];return option_nodes.each((function(){opt_values.push(this.value)})),opt_values},iv_cloneSelect:function({name:name,id:id="",placeholder:placeholder="برای جستجو تایپ نمایید",text_el_class:text_el_class="w3-input w3-border",text_el_style:text_el_style="min-width:200px;background-color:white;",container_class:container_class="",container_style:container_style="",options_container_class:options_container_class="",options_container_style:options_container_style="",option_class:option_class="w3-block w3-button w3-hover-blue w3-border-left w3-border-right",option_style:option_style="",remove_unselected:remove_unselected=!0,close_after_click:close_after_click=!0}={}){if(this.hasClass("iv-select-value")){var value=this.val(),iv_select_container,cloned_iv=this.parent("div.iv-select").clone();return cloned_iv.attr({class:"iv-select "+container_class,style:container_style}),cloned_iv.children("select.iv-select-value").attr("name",name),""!=id?cloned_iv.children("select.iv-select-value").attr("id",id):cloned_iv.children("select.iv-select-value").removeAttr("id"),!0===cloned_iv.children("select.iv-select-value").prop("multiple")&&cloned_iv.children("select.iv-select-value").children("option").each((function(){$(this).attr("selected",!0)})),cloned_iv.children("input.iv-select-search").attr("placeholder",placeholder),cloned_iv.children("div.iv-select-text").attr({class:"iv-select-text "+text_el_class,style:text_el_style}),cloned_iv.children("div.iv-select-options").attr({class:"iv-select-options "+options_container_class,style:options_container_style}),remove_unselected&&cloned_iv.children("div.iv-select-options").children("option").filter((function(){$(this).val()!=value&&$(this).remove()})),cloned_iv.children("div.iv-select-options").children("option").each((function(){$(this).attr("style",option_style),$(this).addClass(option_class),$(this).data("iv_closeAfterClick",close_after_click)})),cloned_iv}},is_ivSelect:function(){return!!this.hasClass("iv-select-value")},iv_textEl:function(){return!!this.hasClass("iv-select-value")&&this.prevAll("div.iv-select-text")},iv_isIvConstruct:function(){return!!this.hasClass("iv-select-search")},iv_selectConvert:function({placeholder:placeholder="برای جستجو تایپ نمایید",style_for_text:style_for_text="",class_for_text:class_for_text="w3-input w3-border",class_for_search:class_for_search="w3-block",search_style:search_style="",class_for_value:class_for_value="",class_for_container:class_for_container="",class_for_opts_container:class_for_opts_container="",style_for_opts_container:style_for_opts_container="",class_for_options:class_for_options="w3-block w3-button w3-hover-blue w3-border-left w3-border-right",option_style:option_style="",keep_existing_class:keep_existing_class="toValue",close_after_click:close_after_click=!0,no_search_element:no_search_element=!1}={}){0!=this.length&&this.each((function(){var args={placeholder:placeholder,style_for_text:style_for_text,class_for_text:class_for_text,class_for_search:class_for_search,search_style:search_style,class_for_value:class_for_value,class_for_container:class_for_container,class_for_opts_container:class_for_opts_container,style_for_opts_container:style_for_opts_container,class_for_options:class_for_options,option_style:option_style,keep_existing_class:keep_existing_class,close_after_click:close_after_click,no_search_element:no_search_element},existing_class="",select_el=$(this);if("SELECT"==select_el[0].tagName&&!select_el.hasClass("iv-select-value")){if(void 0!==(existing_class=select_el.attr("class"))&&""!=existing_class)switch(args.keep_existing_class){case"toValue":args.class_for_value+=" "+existing_class;break;case"toText":args.class_for_text+=" "+existing_class;break;case"toContainer":args.class_for_container+=" "+existing_class}var first_value=select_el.val(),options=select_el.children("option"),multiple;options.last().addClass("w3-border-bottom"),options.each((function(){$(this).addClass(args.class_for_options),$(this).attr("style",args.option_style)})),!0===select_el.prop("multiple")&&(multiple="multiple");var iv_select=$("<div/>").attr({class:"iv-select "+args.class_for_container}),tabindex=select_el.attr("tabindex");"undefined"!==tabindex&&!1!==tabindex&&(iv_select.attr("tabindex",tabindex),select_el.removeAttr("tabindex"));var text_element=$("<div/>").attr({class:"iv-select-text "+args.class_for_text,style:"min-width:200px;background-color:white;"+args.style_for_text});if(!args.no_search_element)var search_element=$("<input>").attr({class:"iv-select-search "+args.class_for_search,autocomplete:"off",style:args.search_style,placeholder:args.placeholder});var attributes=select_el[0].attributes,value_element;$.each(attributes,(function(index,attribute){var attr_name=attribute.name,attr_value=attribute.nodeValue;void 0===value_element?value_element=$("<select>").attr({[attr_name]:attr_value}):value_element.attr({[attr_name]:attr_value})})),value_element.attr({style:"display:none;",class:"iv-select-value "+args.class_for_value,multiple:multiple});var options_element=$("<div/>").attr({class:"iv-select-options "+args.class_for_opts_container,style:"display:none;"+args.style_for_opts_container});options.data("iv_closeAfterClick",args.close_after_click),args.no_search_element?options_element.append(options):options_element.append(search_element,options),iv_select.append(text_element,value_element,options_element),void 0!==select_el.data("iv-init-value")&&(first_value=select_el.data("iv-init-value")),iv_select.find("select.iv-select-value").val(first_value),select_el.replaceWith(iv_select)}}))}});
