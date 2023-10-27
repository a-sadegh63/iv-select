# iv-select
iv-select is a simple, light and fast jQuery replacement for html select boxes  
  
***Key Features of iv_select***  
* Enhancing native selects with search.  
* Enhancing native selects with a better multi-select interface.  
* Extremely simple and light. only 36 kB. (22.5 kB minified version)
* Styled with [w3.css](https://www.w3schools.com/w3css/default.asp)  
* Use native jQuery val function to set select value  
* Use the iv_settings object to hold project properties and every element's settings and styles  
* Use tooltip to handle invalid user enties  
* Various extended functions
  
***Usage***  
1. **convert HTML select to iv_select**  
`$('select').iv_selectConvert(); //convert all HTML selects to iv_select`  
`$('#select-id').iv_selectConvert(); //convert specific HTML select to iv_select`  
`$('.class-name').iv_selectConvert(); //convert all selects with specific class name to iv_select`  
2. **get and set value of the iv_select**  
`$('#select-id').val(); //use jQuery native val function to get iv_select value`
`$('#select-id').val('volvo'); //use jQuery native val function to get iv_select value`
`$('#select-id').val(['volvo', 'saab']); //set value of a multiple HTML select`  
3. **Initialize value**  
to set initialize value (default value) for iv_select, you must have a data-iv-init-value attribute in the HTML select before converting it to iv_select.  
4. **Override settings globally**
The iv select uses the iv_settings object to hold project properties and every element's settings and styles. If you override every property of the
iv_settings object, the settings globally changed for each iv select

***Function Reference***  
| function          | arguments                                                                             | return value                                        |
|-------------------|---------------------------------------------------------------------------------------|-----------------------------------------------------|
| iv_updateOptions  | new_options; a string contains HTML codes of new option tags                          | void                                                |
| iv_getOptions     | none                                                                                  | a string contains HTML codes of the option tags     |
| iv_getValuesArray | none                                                                                  | an array contains whole possible values             |
| iv_cloneSelect    | {                                                                                     | jQuery object; cloned iv_select                     |
|                   |   name,                                                                               |                                                     |
|                   |   id = "",                                                                            |                                                     |
|                   |   placeholder = "Type to search",                                                     |                                                     |
|                   |   text_el_class = "w3-input w3-border",                                               |                                                     |
|                   |   text_el_style = "min-width:200px;background-color:white;",                          |                                                     |
|                   |   container_class = "",                                                               |                                                     |
|                   |   container_style = "",                                                               |                                                     |
|                   |   options_container_class = "",                                                       |                                                     |
|                   |   options_container_style = "",                                                       |                                                     |
|                   |   option_class = "w3-block w3-button w3-hover-blue w3-border-left w3-border-right",   |                                                     |
|                   |   option_style = "",                                                                  |                                                     |
|                   |   remove_unselected = true,                                                           |                                                     |
|                   |   close_after_click = true                                                            |                                                     |
|                   | } = {}                                                                                |                                                     |
| is_ivSelect       | none                                                                                  | bool; specifies the selector is an iv_select or not |
| iv_textEl         | none                                                                                  | jQuery object; text element of iv_select            |
| iv_selectConvert  | {                                                                                     | void; converts selector to iv_select                |
|                   |   placeholder = "Type to search",                                                     |                                                     |
|                   |   text_el_class = "w3-input w3-border",                                               |                                                     |
|                   |   text_el_style = "min-width:200px;background-color:white;",                          |                                                     |
|                   |   class_for_search = "w3-block",                                                      |                                                     |
|                   |   search_style = "",                                                                  |                                                     |
|                   |   class_for_value = "",                                                               |                                                     |
|                   |   container_class = "",                                                               |                                                     |
|                   |   options_container_class = "",                                                       |                                                     |
|                   |   options_container_style = "",                                                       |                                                     |
|                   |   option_class = "w3-block w3-button w3-hover-blue w3-border-left w3-border-right",   |                                                     |
|                   |   option_style = "",                                                                  |                                                     |
|                   |   keep_existing_class = 'toValue', //possible values: toText, toValue, toContainer    |                                                     |
|                   |   close_after_click = true                                                            |                                                     |
|                   |   no_search_element = false                                                           |                                                     |
|                   | } = {}                                                                                |                                                     |
   
***Changelog***  
[7c41495](https://github.com/a-sadegh63/iv-select/commit/7c41495ee821a5be7c83ccdbfe16cd59e9b02d16)
* when the iv-select has an empty value, the val() function always returns an empty string on the single HTML selects and an empty array on the multiple HTML selects  

[25aa5c0](https://github.com/a-sadegh63/iv-select/commit/25aa5c0939c491977fb11ba1d0935d8708865621)
* clicking on the iv-select items opens the options container  
* the min-width property was removed from the iv-select text element 

[6ad80a4](https://github.com/a-sadegh63/iv-select/commit/6ad80a46cea7c3be3f14b5a741844f91047b42df)
* change the disabled iv-select style to be more like other inputs on the disabled status  

[2a6ba24](https://github.com/a-sadegh63/iv-select/commit/2a6ba24813d7f5dd45933b98ec8e4549061c39f1)
* search element positioning is changed, the search element is stuck on top of the options container when scrolling  
  
[74c7a80](https://github.com/a-sadegh63/iv-select/commit/74c7a8034930ee7cccca27fd1882dab6aa53fbfd)
* fix the iv-select validation function
* change the iv-select tooltip style
* fix HTML 5 validation when the iv-select is empty and is required

[7b7b053](https://github.com/a-sadegh63/iv-select/commit/7b7b053a75756a243e79fa663981461ae6f8072f)
* change elements orders to fix absolute positioning
  
***Demo***  
* <a href="https://iranvba.com/iv-select-%d8%ac%d8%a7%db%8c%da%af%d8%b2%db%8c%d9%86-jquery-%d8%a8%d8%b1%d8%a7%db%8c-%d8%ac%d8%b9%d8%a8%d9%87-%d8%a7%d9%86%d8%aa%d8%ae%d8%a7%d8%a8-html/" target="_blank">iv-select on Iranvba.com (persian)</a> 
* <a href="https://iranvba.com/iv_select/" target="_blank">Official demo</a>  
* <a href="https://www.jqueryscript.net/form/enhance-select-searchable-iv.html" target="_blank">iv_select on jqueryscript</a>
