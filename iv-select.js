// IvSelect.js - هسته اصلی با رفع مشکلات hover و کلیک

class IvSelect {
    constructor(element, options = {}) {
        if (!element || element.tagName !== 'SELECT') {
            throw new Error('IvSelect: عنصر ورودی باید یک <select> باشد');
        }

        this.id = 'iv-select-' + Math.random().toString(36).substring(2, 9);
        this.value_el = element;
        this.isMultiple = element.multiple;
        this.focusedIndex = -1;
        this.isOpen = false;
        
        // تنظیمات پیش‌فرض
        this.settings = {
            placeholder: element.dataset.ivPlaceholder || 'انتخاب کنید...',
            closeAfterClick: element.dataset.ivCloseAfterClick !== 'false',
            theme: options.theme || 'light',
            searchable: options.searchable !== false,
            disabled: element.disabled || false,
            maxSelectedItems: options.maxSelectedItems || null,
            ...options
        };

        this.themeManager = options.themeManager || window.IvSelectThemeManager;
        
        if (!this.themeManager) {
            throw new Error('IvSelect: سیستم تم پیدا نشد! لطفاً IvSelectThemeManager.js را اضافه کنید.');
        }

        this.styles = this.themeManager.getTheme(this.settings.theme);
        this.themeManager.injectGlobalStyles();
        
        this.init();
    }

    init() {
        this.ensureEmptyOption();
        this.createStructure();
        this.bindEvents();
        this.syncValue();
        
        if (this.settings.disabled) {
            this.disable();
        }
    }

    ensureEmptyOption() {
        const hasEmptyOption = Array.from(this.value_el.options).some(opt => opt.value === "");
        
        if (!hasEmptyOption && !this.isMultiple) {
            const emptyOpt = document.createElement('option');
            emptyOpt.value = "";
            emptyOpt.textContent = this.settings.placeholder;
            emptyOpt.selected = true;
            this.value_el.insertBefore(emptyOpt, this.value_el.firstChild);
        }
    }

    createStructure() {
        // مخفی کردن سلکت اصلی
        this.value_el.style.display = 'none';
        this.value_el.classList.add('iv-select-hidden');

        // کانتینر اصلی
        this.main_el = document.createElement('div');
        this.main_el.className = 'iv-select';
        this.main_el.id = this.id;
        this.main_el.style.cssText = this.styles.container;

        // ویو - کل منطقه کلیک پذیر
        this.view_el = document.createElement('div');
        this.view_el.className = 'iv-select-view';
        this.view_el.style.cssText = this.styles.view;

        // کانتینر متن
        this.text_container = document.createElement('div');
        this.text_container.className = 'iv-select-text-container';
        this.text_container.style.cssText = 'display:flex; flex-wrap:wrap; align-items:center; gap:4px; flex:1;';

        // فیلد جستجو
        this.search_el = document.createElement('input');
        this.search_el.type = 'text';
        this.search_el.className = 'iv-select-search';
        this.search_el.style.cssText = this.styles.search;
        this.search_el.placeholder = this.settings.placeholder;
        this.search_el.disabled = this.settings.disabled;
        this.search_el.setAttribute('autocomplete', 'off');
        this.search_el.setAttribute('readonly', !this.settings.searchable);
        
        if (!this.settings.searchable) {
            this.search_el.style.display = 'none';
        }

        // کانتینر آپشن‌ها
        this.options_container = document.createElement('div');
        this.options_container.className = 'iv-select-options';
        this.options_container.style.cssText = this.styles.options;
        this.options_container.style.display = 'none';

        // ساختار DOM
        this.view_el.appendChild(this.text_container);
        this.view_el.appendChild(this.search_el);
        this.main_el.appendChild(this.view_el);
        this.main_el.appendChild(this.options_container);

        // قرار دادن در DOM
        this.value_el.parentNode.insertBefore(this.main_el, this.value_el.nextSibling);

        // رندر آپشن‌ها
        this.renderOptions();
    }

    renderOptions() {
        this.options_container.innerHTML = '';
        
        const options = Array.from(this.value_el.options);
        
        if (options.length === 0) {
            const emptyDiv = document.createElement('div');
            emptyDiv.style.cssText = this.styles.emptyMessage;
            emptyDiv.textContent = 'آیتمی یافت نشد';
            this.options_container.appendChild(emptyDiv);
            return;
        }

        options.forEach((opt, index) => {
            // مخفی کردن گزینه خالی از لیست دراپ‌داون
            if (opt.value === "") {
                return;
            }
            
            const div = document.createElement('div');
            div.className = 'iv-select-option';
            div.style.cssText = this.styles.optionItem;
            div.textContent = opt.text;
            div.dataset.value = opt.value;
            div.dataset.index = index;
            
            // hover با mouseenter
            div.addEventListener('mouseenter', (e) => {
                e.stopPropagation();
                this.highlightOption(index);
            });
            
            div.onclick = (e) => {
                e.stopPropagation();
                this.selectOption(opt.value);
            };
            
            this.options_container.appendChild(div);
        });
        
        this.updateOptionHighlighting();
    }

    bindEvents() {
        // کلیک روی کل view_el برای باز کردن منو
        this.view_el.addEventListener('click', (e) => {
            if (this.settings.disabled) return;
            
            // اگه روی دکمه حذف کلیک شده، منو باز نشه
            if (e.target.closest('.iv-delete-btn')) {
                e.stopPropagation();
                return;
            }
            
            this.toggle();
            
            if (this.settings.searchable && this.isOpen) {
                this.search_el.removeAttribute('readonly');
                setTimeout(() => this.search_el.focus(), 50);
            }
        });

        // جلوگیری از بسته شدن منو هنگام کلیک روی search
        this.search_el.addEventListener('click', (e) => {
            e.stopPropagation();
            if (this.settings.disabled) return;
            
            if (!this.isOpen) {
                this.open();
            }
            
            if (this.settings.searchable) {
                this.search_el.removeAttribute('readonly');
                this.search_el.focus();
            }
        });

        // جستجو
        this.search_el.addEventListener('input', (e) => {
            if (this.settings.disabled) return;
            if (!this.settings.searchable) return;
            
            this.filterOptions(e.target.value);
            if (!this.isOpen) {
                this.open();
            }
        });

        // کیبورد نویگیشن
        this.search_el.addEventListener('keydown', (e) => {
            if (this.settings.disabled) return;
            
            // جلوگیری از تایپ وقتی searchable=false
            if (!this.settings.searchable && e.key.length === 1) {
                e.preventDefault();
            }
            
            this.handleKeyboardNavigation(e);
        });

        // بستن با کلیک خارج
        this.documentClickHandler = (e) => {
            if (!this.main_el.contains(e.target)) {
                if (this.isOpen) {
                    this.close();
                }
            }
        };
        document.addEventListener('click', this.documentClickHandler);
    }

    handleKeyboardNavigation(e) {
        const visibleItems = this.getVisibleOptions();
        if (visibleItems.length === 0) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                if (!this.isOpen) this.open();
                this.focusedIndex = this.focusedIndex + 1;
                if (this.focusedIndex >= visibleItems.length) {
                    this.focusedIndex = 0;
                }
                this.updateFocus(visibleItems);
                break;
                
            case 'ArrowUp':
                e.preventDefault();
                if (!this.isOpen) this.open();
                this.focusedIndex = this.focusedIndex - 1;
                if (this.focusedIndex < 0) {
                    this.focusedIndex = visibleItems.length - 1;
                }
                this.updateFocus(visibleItems);
                break;
                
            case 'Enter':
                e.preventDefault();
                if (this.focusedIndex > -1 && visibleItems[this.focusedIndex]) {
                    this.selectOption(visibleItems[this.focusedIndex].dataset.value);
                }
                break;
                
            case 'Home':
                e.preventDefault();
                this.focusedIndex = 0;
                this.updateFocus(visibleItems);
                break;
                
            case 'End':
                e.preventDefault();
                this.focusedIndex = visibleItems.length - 1;
                this.updateFocus(visibleItems);
                break;
                
            case 'Escape':
                e.preventDefault();
                this.close();
                break;
                
            case 'Tab':
                this.close();
                break;
        }
    }

    filterOptions(searchTerm) {
        const term = searchTerm.toLowerCase();
        let hasVisibleItems = false;
        let firstVisibleIndex = -1;
        
        Array.from(this.options_container.children).forEach((div, index) => {
            if (!div.dataset.value) return;
            
            const matches = div.textContent.toLowerCase().includes(term);
            div.style.display = matches ? 'block' : 'none';
            if (matches) {
                hasVisibleItems = true;
                if (firstVisibleIndex === -1) {
                    firstVisibleIndex = index;
                }
            }
        });

        // نمایش پیام در صورت عدم نتیجه
        const emptyDiv = this.options_container.querySelector('.iv-select-empty');
        if (!hasVisibleItems) {
            if (!emptyDiv) {
                const newEmptyDiv = document.createElement('div');
                newEmptyDiv.className = 'iv-select-empty';
                newEmptyDiv.style.cssText = this.styles.emptyMessage;
                newEmptyDiv.textContent = 'نتیجه‌ای یافت نشد';
                this.options_container.appendChild(newEmptyDiv);
            }
            this.focusedIndex = -1;
        } else {
            if (emptyDiv) emptyDiv.remove();
            // فوکوس روی اولین آیتم
            this.focusedIndex = 0;
            const visibleItems = this.getVisibleOptions();
            this.updateFocus(visibleItems);
        }
    }

    selectOption(value) {
        if (this.settings.disabled) return;

        const option = Array.from(this.value_el.options).find(o => o.value === value);
        if (!option) return;

        if (this.isMultiple) {
            if (this.settings.maxSelectedItems) {
                const currentSelected = Array.from(this.value_el.selectedOptions).filter(o => o.value !== "");
                if (!option.selected && currentSelected.length >= this.settings.maxSelectedItems) {
                    this.showMessage(`حداکثر ${this.settings.maxSelectedItems} آیتم می‌توانید انتخاب کنید`);
                    return;
                }
            }
            
            option.selected = !option.selected;
        } else {
            // در حالت تکی، گزینه خالی رو از حالت انتخاب خارج کن
            const emptyOption = Array.from(this.value_el.options).find(o => o.value === "");
            if (emptyOption) {
                emptyOption.selected = false;
            }
            
            this.value_el.value = value;
            option.selected = true;
            
            // بستن دراپ‌داون بعد از انتخاب
            this.close();
        }

        this.value_el.dispatchEvent(new Event('change', { bubbles: true }));
        this.syncValue();
        
        this.search_el.value = '';
        this.filterOptions('');
    }

    syncValue() {
        this.text_container.innerHTML = '';
        
        const selectedOptions = Array.from(this.value_el.selectedOptions)
            .filter(opt => opt.value !== "");
        
        selectedOptions.forEach(opt => {
            const item = this.createSelectedItem(opt);
            this.text_container.appendChild(item);
        });

        // تنظیم placeholder
        if (selectedOptions.length === 0) {
            const emptyOption = Array.from(this.value_el.options).find(o => o.value === "");
            this.search_el.placeholder = emptyOption ? emptyOption.textContent : this.settings.placeholder;
        } else {
            this.search_el.placeholder = '';
        }
        
        this.updateOptionHighlighting();
    }

    createSelectedItem(opt) {
        const item = document.createElement('span');
        item.className = 'iv-selected-item';
        item.style.cssText = this.styles.selectedItem;
        
        const textSpan = document.createElement('span');
        textSpan.textContent = opt.text;
        
        const deleteBtn = document.createElement('span');
        deleteBtn.className = 'iv-delete-btn';
        deleteBtn.style.cssText = this.styles.deleteBtn;
        deleteBtn.innerHTML = '×';
        deleteBtn.setAttribute('aria-label', 'حذف');
        
        deleteBtn.onclick = (e) => {
            e.stopPropagation();
            if (this.settings.disabled) return;
            
            if (this.isMultiple) {
                this.selectOption(opt.value);
            } else {
                // در حالت تکی، انتخاب رو به گزینه خالی برگردون
                const emptyOption = Array.from(this.value_el.options).find(o => o.value === "");
                if (emptyOption) {
                    this.value_el.value = "";
                    emptyOption.selected = true;
                    this.value_el.dispatchEvent(new Event('change', { bubbles: true }));
                    this.syncValue();
                }
            }
        };
        
        item.appendChild(textSpan);
        item.appendChild(deleteBtn);
        
        return item;
    }

    updateOptionHighlighting() {
        const selectedValues = Array.from(this.value_el.selectedOptions).map(o => o.value);
        
        Array.from(this.options_container.children).forEach(div => {
            if (!div.dataset.value) return;
            
            const isSelected = selectedValues.includes(div.dataset.value);
            if (isSelected) {
                div.style.cssText = this.styles.optionItem + this.styles.optionSelected;
            } else {
                div.style.cssText = this.styles.optionItem;
            }
        });
    }

    getVisibleOptions() {
        return Array.from(this.options_container.children)
            .filter(div => div.dataset.value && div.style.display !== 'none');
    }

    highlightOption(index) {
        const items = this.getVisibleOptions();
        
        // پیدا کردن ایندکس واقعی در آرایه آیتم‌های قابل مشاهده
        const visibleIndex = items.findIndex(item => 
            parseInt(item.dataset.index) === index
        );
        
        if (visibleIndex !== -1) {
            this.focusedIndex = visibleIndex;
            this.updateFocus(items);
        }
    }

    updateFocus(items) {
        const themeData = this.themeManager.getTheme(this.settings.theme);
        
        // اول همه رو به حالت عادی برگردون
        items.forEach(item => {
            item.style.background = '';
            item.style.paddingLeft = '16px';
        });
        
        // بعد آیتم فوکوس شده رو هایلایت کن
        if (this.focusedIndex > -1 && items[this.focusedIndex]) {
            const focusedItem = items[this.focusedIndex];
            focusedItem.style.background = themeData.optionHover;
            focusedItem.style.paddingLeft = '20px';
            
            // اسکرول به آیتم فوکوس شده
            focusedItem.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'nearest' 
            });
        }
    }

    toggle() {
        this.isOpen ? this.close() : this.open();
    }

    open() {
        if (this.settings.disabled) return;
        
        this.options_container.style.display = 'block';
        this.isOpen = true;
        this.main_el.style.borderBottomLeftRadius = '0';
        this.main_el.style.borderBottomRightRadius = '0';
        
        // فوکوس روی اولین آیتم
        const visibleItems = this.getVisibleOptions();
        if (visibleItems.length > 0) {
            this.focusedIndex = 0;
            this.updateFocus(visibleItems);
        }
        
        // اسکرول به آیتم انتخاب شده
        const selectedOption = Array.from(this.options_container.children).find(div => {
            return div.dataset?.value && Array.from(this.value_el.selectedOptions).some(opt => opt.value === div.dataset.value);
        });
        
        if (selectedOption) {
            setTimeout(() => {
                selectedOption.scrollIntoView({ block: 'center' });
            }, 50);
        }
    }

    close() {
        this.options_container.style.display = 'none';
        this.isOpen = false;
        this.focusedIndex = -1;
        this.main_el.style.borderBottomLeftRadius = this.styles.borderRadius || '8px';
        this.main_el.style.borderBottomRightRadius = this.styles.borderRadius || '8px';
        
        this.search_el.value = '';
        this.search_el.setAttribute('readonly', !this.settings.searchable);
        this.filterOptions('');
    }

    setTheme(themeName) {
        if (this.themeManager.getTheme(themeName)) {
            this.settings.theme = themeName;
            this.styles = this.themeManager.getTheme(themeName);
            this.applyStyles();
        }
    }

    applyStyles() {
        this.main_el.style.cssText = this.styles.container;
        this.view_el.style.cssText = this.styles.view;
        this.search_el.style.cssText = this.styles.search;
        this.options_container.style.cssText = this.styles.options;
        this.options_container.style.display = 'none';
        
        this.renderOptions();
        this.syncValue();
    }

    disable() {
        this.settings.disabled = true;
        this.search_el.disabled = true;
        this.view_el.style.opacity = '0.6';
        this.view_el.style.cursor = 'not-allowed';
        this.main_el.style.background = '#f9fafb';
        this.close();
    }

    enable() {
        this.settings.disabled = false;
        this.search_el.disabled = false;
        this.view_el.style.opacity = '';
        this.view_el.style.cursor = 'pointer';
        this.main_el.style.background = '';
    }

    showMessage(msg) {
        const msgEl = document.createElement('div');
        msgEl.style.cssText = `
            position:absolute;
            bottom:100%;
            left:0;
            width:100%;
            padding:6px 12px;
            background:#ef4444;
            color:white;
            font-size:12px;
            border-radius:4px;
            margin-bottom:4px;
            z-index:10000;
            animation: ivSelectFadeIn 0.2s ease;
        `;
        msgEl.textContent = msg;
        
        this.main_el.style.position = 'relative';
        this.main_el.appendChild(msgEl);
        
        setTimeout(() => {
            msgEl.remove();
        }, 2000);
    }

    setValue(value) {
        if (this.isMultiple && Array.isArray(value)) {
            Array.from(this.value_el.options).forEach(opt => {
                opt.selected = value.includes(opt.value);
            });
        } else {
            this.value_el.value = value;
        }
        
        this.value_el.dispatchEvent(new Event('change', { bubbles: true }));
        this.syncValue();
    }

    getValue() {
        if (this.isMultiple) {
            return Array.from(this.value_el.selectedOptions)
                .filter(o => o.value !== "")
                .map(o => o.value);
        }
        return this.value_el.value;
    }

    updateOptions(options) {
        this.value_el.innerHTML = '';
        
        // اضافه کردن گزینه خالی
        const emptyOpt = document.createElement('option');
        emptyOpt.value = "";
        emptyOpt.textContent = this.settings.placeholder;
        emptyOpt.selected = true;
        this.value_el.appendChild(emptyOpt);
        
        // اضافه کردن گزینه‌های جدید
        options.forEach(({ value, text, selected = false }) => {
            const opt = document.createElement('option');
            opt.value = value;
            opt.textContent = text;
            opt.selected = selected;
            this.value_el.appendChild(opt);
        });

        this.renderOptions();
        this.syncValue();
    }

    clear() {
        if (this.isMultiple) {
            Array.from(this.value_el.options).forEach(opt => opt.selected = false);
        } else {
            const emptyOption = Array.from(this.value_el.options).find(o => o.value === "");
            if (emptyOption) {
                this.value_el.value = "";
                emptyOption.selected = true;
            }
        }
        
        this.value_el.dispatchEvent(new Event('change', { bubbles: true }));
        this.syncValue();
    }

    destroy() {
        document.removeEventListener('click', this.documentClickHandler);
        
        if (this.main_el && this.main_el.parentNode) {
            this.main_el.parentNode.removeChild(this.main_el);
        }
        this.value_el.style.display = '';
        this.value_el.classList.remove('iv-select-hidden');
    }
}

// تابع کمکی
function ivSelect(selector, options = {}) {
    const elements = document.querySelectorAll(selector);
    const instances = [];
    
    elements.forEach(el => {
        instances.push(new IvSelect(el, options));
    });
    
    return instances.length === 1 ? instances[0] : instances;
}

if (typeof window !== 'undefined') {
    window.IvSelect = IvSelect;
    window.ivSelect = ivSelect;
}

export { IvSelect, ivSelect };
export default IvSelect;