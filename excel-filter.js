// ExcelFilter.js - سیستم فیلتر پیشرفته برای جداول (نسخه نهایی)

class ExcelFilter {
    constructor(tableElement, options = {}) {
        if (!tableElement || tableElement.tagName !== 'TABLE') {
            throw new Error('ExcelFilter: عنصر ورودی باید یک <table> باشد');
        }

        this.table = tableElement;
        this.id = 'excel-filter-' + Math.random().toString(36).substring(2, 9);
        
        this.settings = {
            theme: options.theme || 'light',
            placeholder: 'فیلتر...',
            searchable: true,
            caseSensitive: false,
            exactMatch: false,
            showFilterIcon: true,
            showSearchBox: true,
            showSelectAll: true,
            showClearButton: true,
            showItemCount: true,
            maxHeight: '300px',
            width: '280px',
            ...options
        };

        this.themeManager = options.themeManager || window.IvSelectThemeManager;
        
        if (!this.themeManager) {
            throw new Error('ExcelFilter: سیستم تم پیدا نشد! لطفاً IvSelectThemeManager.js را اضافه کنید.');
        }

        this.currentTheme = this.themeManager.themes[this.settings.theme] || this.themeManager.themes.light;
        this.originalHeaderRow = null;
        this.filterRow = null;
        this.filters = new Map();
        this.activeMenu = null;
        this.menuZIndex = 999999;
        this.resultMessage = null;
        
        this.init();
    }

    init() {
        this.saveOriginalHeader();
        this.ensureTableStructure();
        this.createFilterRow();
        this.applyThemeToTable();
        this.bindEvents();
        this.applyFilters();
    }

    saveOriginalHeader() {
        // پیدا کردن یا ایجاد thead
        let thead = this.table.querySelector('thead');
        if (!thead) {
            thead = document.createElement('thead');
            this.table.prepend(thead);
        }

        // پیدا کردن یا ایجاد ردیف عنوان
        let headerRow = thead.querySelector('tr');
        if (!headerRow) {
            // اگر ردیف عنوان وجود نداشت، از اولین ردیف جدول استفاده کن
            const firstRow = this.table.querySelector('tbody tr');
            if (firstRow) {
                headerRow = document.createElement('tr');
                const cells = firstRow.querySelectorAll('td');
                cells.forEach((cell, index) => {
                    const th = document.createElement('th');
                    th.textContent = `ستون ${index + 1}`;
                    headerRow.appendChild(th);
                });
                thead.appendChild(headerRow);
            }
        }

        // ذخیره ردیف عنوان اصلی
        this.originalHeaderRow = headerRow;
        
        // مخفی کردن ردیف عنوان اصلی
        this.originalHeaderRow.style.display = 'none';
    }

    ensureTableStructure() {
        if (!this.table.querySelector('tbody')) {
            const tbody = document.createElement('tbody');
            const rows = this.table.querySelectorAll('tr:not(thead tr)');
            rows.forEach(row => tbody.appendChild(row.cloneNode(true)));
            rows.forEach(row => row.remove());
            this.table.appendChild(tbody);
        }
    }

    createFilterRow() {
        const thead = this.table.querySelector('thead');
        
        // حذف ردیف فیلتر قبلی اگر وجود دارد
        if (this.filterRow && this.filterRow.parentNode) {
            this.filterRow.remove();
        }
        
        // ایجاد ردیف جدید برای فیلترها
        this.filterRow = document.createElement('tr');
        this.filterRow.className = 'excel-filter-header';
        
        const headers = this.originalHeaderRow.querySelectorAll('th');
        
        headers.forEach((th, index) => {
            const columnName = th.textContent.trim();
            const td = document.createElement('td');
            td.className = 'excel-filter-cell';
            td.setAttribute('data-column-index', index);
            td.setAttribute('data-column-name', columnName);
            td.style.cssText = `
                padding: 8px 10px;
                background: ${this.currentTheme.bg};
                border-bottom: 2px solid ${this.currentTheme.border};
                position: relative;
                min-width: 80px;
            `;
            
            const filterButton = this.createFilterButton(columnName, `column_${index}`, index);
            td.appendChild(filterButton);
            
            this.filterRow.appendChild(td);
        });
        
        thead.appendChild(this.filterRow);
    }

    applyThemeToTable() {
        // استایل خود جدول
        this.table.style.cssText = `
            width: 100%;
            border-collapse: collapse;
            background: ${this.currentTheme.bg};
            color: ${this.currentTheme.text};
            font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: ${this.currentTheme.shadow};
        `;

        // استایل ردیف عنوان اصلی (مخفی)
        if (this.originalHeaderRow) {
            const headers = this.originalHeaderRow.querySelectorAll('th');
            headers.forEach(th => {
                th.style.cssText = `
                    padding: 12px;
                    text-align: right;
                    font-weight: 600;
                    font-size: 13px;
                    color: ${this.currentTheme.text};
                    background: ${this.currentTheme.hover};
                    border-bottom: 2px solid ${this.currentTheme.border};
                `;
            });
        }

        // استایل سلول‌های بدنه جدول
        const rows = this.table.querySelectorAll('tbody tr');
        rows.forEach((row) => {
            // حذف event listenerهای قبلی با clone
            const newRow = row.cloneNode(true);
            row.parentNode.replaceChild(newRow, row);
            
            newRow.style.background = this.currentTheme.bg;
            
            const cells = newRow.querySelectorAll('td');
            cells.forEach(cell => {
                cell.style.cssText = `
                    padding: 10px 12px;
                    border-bottom: 1px solid ${this.currentTheme.border}30;
                    color: ${this.currentTheme.text};
                `;
            });

            // اضافه کردن event listenerهای جدید
            newRow.addEventListener('mouseenter', () => {
                newRow.style.background = this.currentTheme.hover;
            });
            newRow.addEventListener('mouseleave', () => {
                newRow.style.background = this.currentTheme.bg;
            });
        });
    }

    createFilterButton(columnName, fieldName, columnIndex) {
        const container = document.createElement('div');
        container.className = 'excel-filter-container';
        container.style.cssText = `
            display: flex;
            align-items: center;
            width: 100%;
            position: relative;
        `;
        
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'excel-filter-button';
        button.setAttribute('data-column-index', columnIndex);
        button.setAttribute('data-field', fieldName);
        button.setAttribute('data-column-name', columnName);
        
        button.style.cssText = `
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
            padding: 6px 10px;
            background: transparent;
            border: 1px solid transparent;
            border-radius: 4px;
            cursor: pointer;
            font-size: 13px;
            color: ${this.currentTheme.text};
            transition: all 0.2s;
            font-weight: 500;
            
            &:hover {
                background: ${this.currentTheme.hover};
                border-color: ${this.currentTheme.border};
            }
            
            &.active {
                background: ${this.currentTheme.selected};
                border-color: ${this.currentTheme.primary};
                color: ${this.currentTheme.primary};
            }
        `;
        
        const nameSpan = document.createElement('span');
        nameSpan.textContent = columnName;
        nameSpan.style.cssText = `
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            flex: 1;
            text-align: right;
            margin-left: 6px;
        `;
        button.appendChild(nameSpan);
        
        const iconSpan = document.createElement('span');
        iconSpan.innerHTML = '▼';
        iconSpan.style.cssText = `
            font-size: 10px;
            opacity: 0.7;
            margin-right: 4px;
            transition: transform 0.2s;
        `;
        button.appendChild(iconSpan);
        
        const badgeSpan = document.createElement('span');
        badgeSpan.className = 'excel-filter-badge';
        badgeSpan.style.cssText = `
            display: none;
            margin-right: 6px;
            padding: 2px 6px;
            background: ${this.currentTheme.primary};
            color: white;
            border-radius: 12px;
            font-size: 11px;
            font-weight: bold;
            min-width: 18px;
            text-align: center;
        `;
        button.appendChild(badgeSpan);
        
        container.appendChild(button);
        
        button.onclick = (e) => {
            e.stopPropagation();
            e.preventDefault();
            
            if (this.activeMenu) {
                this.activeMenu.remove();
                this.activeMenu = null;
            }
            
            this.showFilterMenu(button, columnIndex, fieldName, columnName);
        };
        
        return container;
    }

    // ... بقیه متدها مثل showFilterMenu, createMenuElement, createFilterMenuItem, filterMenuItems, 
    // getUniqueColumnValues, updateFilterButtonState, applyFilters, showFilterResult, 
    // clearAllFilters, closeAllMenus, bindEvents مثل قبل هستند ...

    showFilterMenu(button, columnIndex, fieldName, columnName) {
        this.closeAllMenus();
        
        const uniqueValues = this.getUniqueColumnValues(columnIndex);
        const currentFilters = this.filters.get(fieldName) || { values: [] };
        
        // محاسبه موقعیت منو
        const rect = button.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
        
        // ایجاد منو
        const menu = this.createMenuElement(columnName, uniqueValues, currentFilters.values, fieldName, button);
        
        // محاسبه موقعیت
        let top = rect.bottom + scrollTop + 5;
        let left = rect.left + scrollLeft;
        
        // بررسی فضای پایین
        const spaceBelow = window.innerHeight - rect.bottom;
        const estimatedHeight = 400;
        
        if (spaceBelow < estimatedHeight) {
            top = rect.top + scrollTop - estimatedHeight - 5;
        }
        
        // بررسی فضای سمت راست
        const spaceRight = window.innerWidth - rect.right;
        if (spaceRight < parseInt(this.settings.width)) {
            left = Math.max(10, rect.right + scrollLeft - parseInt(this.settings.width));
        }
        
        // محدود کردن به لبه صفحه
        left = Math.max(10, Math.min(left, window.innerWidth - parseInt(this.settings.width) - 10));
        
        menu.style.top = top + 'px';
        menu.style.left = left + 'px';
        
        document.body.appendChild(menu);
        
        // نمایش با انیمیشن
        setTimeout(() => {
            menu.style.opacity = '1';
            menu.style.transform = 'translateY(0)';
        }, 10);
        
        this.activeMenu = menu;
        
        // فوکوس روی جستجو
        setTimeout(() => {
            const searchInput = menu.querySelector('.excel-filter-search');
            if (searchInput) searchInput.focus();
        }, 150);
    }

    createMenuElement(columnName, uniqueValues, selectedValues, fieldName, button) {
        const menu = document.createElement('div');
        menu.className = 'excel-filter-menu';
        menu.dataset.field = fieldName;
        
        menu.style.cssText = `
            position: absolute;
            background: ${this.currentTheme.bg};
            border: 1px solid ${this.currentTheme.border};
            border-radius: 8px;
            box-shadow: 0 8px 30px rgba(0,0,0,0.2);
            z-index: ${this.menuZIndex};
            width: ${this.settings.width};
            opacity: 0;
            transform: translateY(-5px);
            transition: opacity 0.2s ease, transform 0.2s ease;
            pointer-events: auto;
            font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
        `;

        const content = document.createElement('div');
        content.style.cssText = `
            padding: 16px;
            background: ${this.currentTheme.bg};
            border-radius: 8px;
        `;

        // هدر
        const header = document.createElement('div');
        header.style.cssText = `
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 16px;
            padding-bottom: 12px;
            border-bottom: 2px solid ${this.currentTheme.border};
        `;

        const title = document.createElement('span');
        title.style.cssText = `
            font-weight: 600;
            color: ${this.currentTheme.text};
            font-size: 14px;
        `;
        title.textContent = `فیلتر: ${columnName}`;

        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '✕';
        closeBtn.style.cssText = `
            background: ${this.currentTheme.hover};
            border: none;
            font-size: 14px;
            cursor: pointer;
            color: ${this.currentTheme.textLight};
            padding: 6px 10px;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
            
            &:hover {
                background: ${this.currentTheme.deleteHover};
                color: white;
            }
        `;
        closeBtn.onclick = () => this.closeAllMenus();

        header.appendChild(title);
        header.appendChild(closeBtn);
        content.appendChild(header);

        // جستجو
        if (this.settings.showSearchBox) {
            const searchContainer = document.createElement('div');
            searchContainer.style.cssText = `
                margin-bottom: 16px;
                position: relative;
            `;

            const searchIcon = document.createElement('span');
            searchIcon.innerHTML = '🔍';
            searchIcon.style.cssText = `
                position: absolute;
                right: 10px;
                top: 50%;
                transform: translateY(-50%);
                color: ${this.currentTheme.textLight};
                font-size: 14px;
                z-index: 1;
                pointer-events: none;
            `;

            const searchBox = document.createElement('input');
            searchBox.type = 'text';
            searchBox.className = 'excel-filter-search';
            searchBox.placeholder = 'جستجو...';
            searchBox.style.cssText = `
                width: 100%;
                padding: 10px 35px 10px 12px;
                border: 1px solid ${this.currentTheme.border};
                border-radius: 6px;
                font-size: 13px;
                outline: none;
                background: ${this.currentTheme.bg};
                color: ${this.currentTheme.text};
                box-sizing: border-box;
                transition: all 0.2s;
                
                &:focus {
                    border-color: ${this.currentTheme.primary};
                    box-shadow: 0 0 0 3px ${this.currentTheme.primary}20;
                }
            `;

            searchContainer.appendChild(searchIcon);
            searchContainer.appendChild(searchBox);
            content.appendChild(searchContainer);
        }

        // دکمه‌های انتخاب
        if (this.settings.showSelectAll) {
            const actions = document.createElement('div');
            actions.style.cssText = `
                display: flex;
                gap: 8px;
                margin-bottom: 16px;
            `;

            const selectAllBtn = document.createElement('button');
            selectAllBtn.textContent = 'انتخاب همه';
            selectAllBtn.style.cssText = `
                flex: 1;
                padding: 8px 12px;
                background: ${this.currentTheme.hover};
                border: 1px solid ${this.currentTheme.border};
                border-radius: 6px;
                cursor: pointer;
                font-size: 12px;
                color: ${this.currentTheme.text};
                transition: all 0.2s;
                
                &:hover {
                    background: ${this.currentTheme.selected};
                    border-color: ${this.currentTheme.primary};
                }
            `;

            const clearAllBtn = document.createElement('button');
            clearAllBtn.textContent = 'پاک کردن همه';
            clearAllBtn.style.cssText = selectAllBtn.style.cssText;

            selectAllBtn.onclick = (e) => {
                e.stopPropagation();
                const checkboxes = menu.querySelectorAll('.excel-filter-item input[type="checkbox"]');
                checkboxes.forEach(cb => cb.checked = true);
            };

            clearAllBtn.onclick = (e) => {
                e.stopPropagation();
                const checkboxes = menu.querySelectorAll('.excel-filter-item input[type="checkbox"]');
                checkboxes.forEach(cb => cb.checked = false);
            };

            actions.appendChild(selectAllBtn);
            actions.appendChild(clearAllBtn);
            content.appendChild(actions);
        }

        // لیست مقادیر
        const listContainer = document.createElement('div');
        listContainer.style.cssText = `
            max-height: ${this.settings.maxHeight};
            overflow-y: auto;
            margin-bottom: 16px;
            border: 1px solid ${this.currentTheme.border}30;
            border-radius: 6px;
            background: ${this.currentTheme.bg};
        `;

        // نمایش تعداد آیتم‌ها
        if (this.settings.showItemCount) {
            const countInfo = document.createElement('div');
            countInfo.className = 'excel-filter-count';
            countInfo.style.cssText = `
                padding: 8px 12px;
                background: ${this.currentTheme.hover};
                border-bottom: 1px solid ${this.currentTheme.border};
                font-size: 12px;
                color: ${this.currentTheme.textLight};
                font-weight: 500;
            `;
            countInfo.textContent = `${uniqueValues.length} آیتم`;
            listContainer.appendChild(countInfo);
        }

        // اضافه کردن آیتم‌ها
        uniqueValues.forEach(value => {
            const item = this.createFilterMenuItem(value, selectedValues.includes(value));
            listContainer.appendChild(item);
        });

        content.appendChild(listContainer);

        // دکمه اعمال فیلتر
        const applyBtn = document.createElement('button');
        applyBtn.textContent = 'اعمال فیلتر';
        applyBtn.style.cssText = `
            width: 100%;
            padding: 10px 16px;
            background: ${this.currentTheme.primary};
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 13px;
            font-weight: 500;
            transition: all 0.2s;
            
            &:hover {
                opacity: 0.9;
                transform: translateY(-1px);
                box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            }
            
            &:active {
                transform: translateY(0);
            }
        `;

        applyBtn.onclick = (e) => {
            e.stopPropagation();
            
            const selectedValues = [];
            menu.querySelectorAll('.excel-filter-item input[type="checkbox"]:checked').forEach(cb => {
                selectedValues.push(cb.value);
            });
            
            this.filters.set(fieldName, {
                values: selectedValues
            });
            
            this.updateFilterButtonState(button, selectedValues.length);
            this.applyFilters();
            this.closeAllMenus();
        };

        content.appendChild(applyBtn);
        menu.appendChild(content);

        // اتصال رویداد جستجو
        const searchInput = menu.querySelector('.excel-filter-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                e.stopPropagation();
                this.filterMenuItems(menu, e.target.value);
            });

            searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.closeAllMenus();
                }
                if (e.key === 'Enter') {
                    applyBtn.click();
                }
                e.stopPropagation();
            });
        }

        return menu;
    }

    createFilterMenuItem(value, checked = false) {
        const item = document.createElement('div');
        item.className = 'excel-filter-item';
        item.style.cssText = `
            display: flex;
            align-items: center;
            padding: 8px 12px;
            cursor: pointer;
            border-bottom: 1px solid ${this.currentTheme.border}15;
            transition: background 0.15s;
            background: ${this.currentTheme.bg};
            
            &:hover {
                background: ${this.currentTheme.optionHover || this.currentTheme.hover};
            }
            
            &:last-child {
                border-bottom: none;
            }
        `;

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = value;
        checkbox.checked = checked;
        checkbox.style.cssText = `
            margin-left: 12px;
            cursor: pointer;
            width: 16px;
            height: 16px;
            accent-color: ${this.currentTheme.primary};
        `;

        const label = document.createElement('span');
        label.textContent = value || '(خالی)';
        label.style.cssText = `
            flex: 1;
            font-size: 13px;
            color: ${this.currentTheme.text};
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            line-height: 1.4;
        `;

        item.appendChild(checkbox);
        item.appendChild(label);

        item.addEventListener('click', (e) => {
            if (e.target !== checkbox) {
                checkbox.checked = !checkbox.checked;
            }
            e.stopPropagation();
        });

        return item;
    }

    filterMenuItems(menu, searchTerm) {
        const term = searchTerm.toLowerCase();
        const items = menu.querySelectorAll('.excel-filter-item');
        let visibleCount = 0;
        
        items.forEach(item => {
            const label = item.querySelector('span').textContent.toLowerCase();
            const shouldShow = label.includes(term);
            item.style.display = shouldShow ? 'flex' : 'none';
            if (shouldShow) visibleCount++;
        });
        
        const countInfo = menu.querySelector('.excel-filter-count');
        if (countInfo) {
            const totalItems = items.length;
            countInfo.textContent = `${visibleCount} از ${totalItems} آیتم`;
        }
    }

    getUniqueColumnValues(columnIndex) {
        const values = new Set();
        const rows = this.table.querySelectorAll('tbody tr');
        
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells && cells[columnIndex]) {
                const value = cells[columnIndex].textContent.trim();
                if (value !== '') {
                    values.add(value);
                }
            }
        });
        
        return Array.from(values).sort((a, b) => a.localeCompare(b, 'fa'));
    }

    updateFilterButtonState(button, selectedCount) {
        const badge = button.querySelector('.excel-filter-badge');
        const icon = button.querySelector('span:first-child + span');
        
        if (selectedCount > 0) {
            button.classList.add('active');
            badge.style.display = 'inline-block';
            badge.textContent = selectedCount;
            if (icon) {
                icon.style.opacity = '1';
                icon.innerHTML = '✓';
            }
        } else {
            button.classList.remove('active');
            badge.style.display = 'none';
            if (icon) {
                icon.style.opacity = '0.7';
                icon.innerHTML = '▼';
            }
        }
    }

    applyFilters() {
        const rows = this.table.querySelectorAll('tbody tr');
        let visibleCount = 0;
        
        rows.forEach(row => {
            let showRow = true;
            
            for (const [field, filter] of this.filters) {
                if (!filter.values || filter.values.length === 0) continue;
                
                const columnIndex = parseInt(field.replace('column_', ''));
                const cells = row.querySelectorAll('td');
                
                if (!cells || !cells[columnIndex]) {
                    showRow = false;
                    break;
                }
                
                const cellValue = cells[columnIndex].textContent.trim();
                
                if (!filter.values.includes(cellValue)) {
                    showRow = false;
                    break;
                }
            }
            
            row.style.display = showRow ? '' : 'none';
            if (showRow) visibleCount++;
        });
        
        this.showFilterResult(visibleCount, rows.length);
    }

    showFilterResult(visible, total) {
        // حذف پیغام قبلی
        if (this.resultMessage && this.resultMessage.parentNode) {
            this.resultMessage.remove();
        }
        
        // اگر فیلتری فعال نیست، پیغام را نشان نده
        if (this.filters.size === 0) return;
        
        let hasActiveFilter = false;
        for (const [_, filter] of this.filters) {
            if (filter.values && filter.values.length > 0) {
                hasActiveFilter = true;
                break;
            }
        }
        
        if (!hasActiveFilter) return;
        
        // ایجاد پیغام جدید
        const message = document.createElement('div');
        message.className = 'excel-filter-result';
        message.style.cssText = `
            padding: 10px 16px;
            margin-top: 12px;
            background: ${this.currentTheme.hover};
            border: 1px solid ${this.currentTheme.border};
            border-radius: 6px;
            font-size: 13px;
            color: ${this.currentTheme.text};
            display: flex;
            align-items: center;
            justify-content: space-between;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        `;
        
        const countSpan = document.createElement('span');
        countSpan.innerHTML = `<strong>${visible}</strong> از <strong>${total}</strong> رکورد`;
        
        const clearBtn = document.createElement('button');
        clearBtn.textContent = 'پاک کردن فیلترها';
        clearBtn.style.cssText = `
            padding: 6px 12px;
            background: transparent;
            border: 1px solid ${this.currentTheme.border};
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            color: ${this.currentTheme.text};
            transition: all 0.2s;
            
            &:hover {
                background: ${this.currentTheme.deleteHover};
                color: white;
                border-color: ${this.currentTheme.deleteHover};
            }
        `;
        
        clearBtn.onclick = () => {
            this.clearAllFilters();
        };
        
        message.appendChild(countSpan);
        message.appendChild(clearBtn);
        
        // اضافه کردن پیغام بعد از جدول
        this.table.parentNode.insertBefore(message, this.table.nextSibling);
        this.resultMessage = message;
    }

    clearAllFilters() {
        this.filters.clear();
        
        this.table.querySelectorAll('.excel-filter-button').forEach(button => {
            button.classList.remove('active');
            const badge = button.querySelector('.excel-filter-badge');
            if (badge) badge.style.display = 'none';
            
            const icon = button.querySelector('span:first-child + span');
            if (icon) {
                icon.style.opacity = '0.7';
                icon.innerHTML = '▼';
            }
        });
        
        this.table.querySelectorAll('tbody tr').forEach(row => {
            row.style.display = '';
        });
        
        // حذف پیغام
        if (this.resultMessage && this.resultMessage.parentNode) {
            this.resultMessage.remove();
            this.resultMessage = null;
        }
    }

    closeAllMenus() {
        if (this.activeMenu) {
            this.activeMenu.style.opacity = '0';
            this.activeMenu.style.transform = 'translateY(-5px)';
            setTimeout(() => {
                if (this.activeMenu && this.activeMenu.parentNode) {
                    this.activeMenu.parentNode.removeChild(this.activeMenu);
                }
                this.activeMenu = null;
            }, 150);
        }
        
        document.querySelectorAll('.excel-filter-menu').forEach(menu => {
            if (menu !== this.activeMenu) {
                menu.remove();
            }
        });
    }

    bindEvents() {
        // کلیک خارج
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.excel-filter-container') && 
                !e.target.closest('.excel-filter-menu')) {
                this.closeAllMenus();
            }
        });

        // جلوگیری از بسته شدن با کلیک روی منو
        document.addEventListener('mousedown', (e) => {
            if (e.target.closest('.excel-filter-menu')) {
                e.stopPropagation();
            }
        }, true);
        
        // اسکرول - آپدیت موقعیت منو
        window.addEventListener('scroll', (e) => {
            if (this.activeMenu) {
                const field = this.activeMenu.dataset.field;
                const button = document.querySelector(`.excel-filter-button[data-field="${field}"]`);
                if (button) {
                    const rect = button.getBoundingClientRect();
                    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
                    
                    let top = rect.bottom + scrollTop + 5;
                    let left = rect.left + scrollLeft;
                    
                    const spaceBelow = window.innerHeight - rect.bottom;
                    if (spaceBelow < 400) {
                        top = rect.top + scrollTop - 400 - 5;
                    }
                    
                    this.activeMenu.style.top = top + 'px';
                    this.activeMenu.style.left = left + 'px';
                }
            }
        }, { passive: true });
        
        // تغییر سایز پنجره
        window.addEventListener('resize', () => {
            this.closeAllMenus();
        });
    }

    destroy() {
        // نمایش دوباره ردیف عنوان اصلی
        if (this.originalHeaderRow) {
            this.originalHeaderRow.style.display = '';
        }
        
        // حذف ردیف فیلتر
        if (this.filterRow && this.filterRow.parentNode) {
            this.filterRow.remove();
        }
        
        // پاک کردن فیلترها
        this.filters.clear();
        this.closeAllMenus();
        
        // نمایش همه ردیف‌ها
        this.table.querySelectorAll('tbody tr').forEach(row => {
            row.style.display = '';
        });
        
        // حذف پیغام
        if (this.resultMessage && this.resultMessage.parentNode) {
            this.resultMessage.remove();
            this.resultMessage = null;
        }
    }
}

function excelFilter(tableSelector, options = {}) {
    const tables = document.querySelectorAll(tableSelector);
    const instances = [];
    
    tables.forEach(table => {
        instances.push(new ExcelFilter(table, options));
    });
    
    return instances.length === 1 ? instances[0] : instances;
}

if (typeof window !== 'undefined') {
    window.ExcelFilter = ExcelFilter;
    window.excelFilter = excelFilter;
}

export { ExcelFilter, excelFilter };
export default ExcelFilter;