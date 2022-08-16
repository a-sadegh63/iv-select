# iv-select
iv-select is a simple, light and fast jQuery replacement for html select boxes  
  
***Key Features of iv_select***  
* Enhancing native selects with search.  
* Enhancing native selects with a better multi-select interface.  
* Extremely simple and light. only 16.7 kB. (11.9 kB minified version)
* Styled with [w3.css](https://www.w3schools.com/w3css/default.asp)  
* Use native jQuery val function to set select value  
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
  
***Function Reference***  
| function          | arguments                                                                             | return value                                        |
|-------------------|---------------------------------------------------------------------------------------|-----------------------------------------------------|
| iv_updateOptions  | new_options; a string contains HTML codes of new option tags                          | void                                                |
| iv_getOptions     | none                                                                                  | a string contains HTML codes of the option tags     |
| iv_getValuesArray | none                                                                                  | an array contains whole possible values             |
| iv_cloneSelect    | {                                                                                     | jQuery object; cloned iv_select                     |
|                   |   name,                                                                               |                                                     |
|                   |   id = "",                                                                            |                                                     |
|                   |   placeholder = "برای جستجو تایپ نمایید",                                             |                                                     |
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
|                   |   placeholder = "برای جستجو تایپ نمایید",                                             |                                                     |
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
   
***Demo***  