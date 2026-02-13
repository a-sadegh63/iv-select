// IvSelect.themes.js - سیستم تم ایزوله

const IvSelectThemeManager = {
    // تعریف تم‌های آماده
    themes: {
        light: {
            primary: '#2563eb',
            primaryLight: '#3b82f6',
            bg: '#ffffff',
            border: '#e2e8f0',
            text: '#0f172a',
            textLight: '#64748b',
            hover: '#f8fafc',
            selected: '#eff6ff',
            selectedBorder: '#bfdbfe',
            shadow: '0 1px 3px rgba(0,0,0,0.1)',
            optionHover: '#f1f5f9',
            deleteHover: '#ef4444',
            deleteText: '#64748b',
            borderRadius: '8px'
        },
        
        dark: {
            primary: '#60a5fa',
            primaryLight: '#93c5fd',
            bg: '#1e1e2e',
            border: '#313244',
            text: '#cdd6f4',
            textLight: '#9399b2',
            hover: '#313244',
            selected: '#2a2a3c',
            selectedBorder: '#45475a',
            shadow: '0 4px 6px rgba(0,0,0,0.3)',
            optionHover: '#3a3a4e',
            deleteHover: '#f38ba8',
            deleteText: '#9399b2',
            borderRadius: '8px'
        },
        
        modern: {
            primary: '#6366f1',
            primaryLight: '#818cf8',
            bg: '#ffffff',
            border: '#e5e7eb',
            text: '#111827',
            textLight: '#6b7280',
            hover: '#f9fafb',
            selected: '#eef2ff',
            selectedBorder: '#c7d2fe',
            shadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
            optionHover: '#f3f4f6',
            deleteHover: '#dc2626',
            deleteText: '#6b7280',
            borderRadius: '8px'
        },
        
        ocean: {
            primary: '#0891b2',
            primaryLight: '#06b6d4',
            bg: '#f0f9ff',
            border: '#bae6fd',
            text: '#0c4a6e',
            textLight: '#0369a1',
            hover: '#e0f2fe',
            selected: '#dbeafe',
            selectedBorder: '#7dd3fc',
            shadow: '0 4px 6px -1px rgba(8,145,178,0.1)',
            optionHover: '#e6f3fe',
            deleteHover: '#dc2626',
            deleteText: '#0284c7',
            borderRadius: '8px'
        },
        
        midnight: {
            primary: '#818cf8',
            primaryLight: '#a5b4fc',
            bg: '#0f172a',
            border: '#1e293b',
            text: '#e2e8f0',
            textLight: '#94a3b8',
            hover: '#1e293b',
            selected: '#2d3a4f',
            selectedBorder: '#475569',
            shadow: '0 4px 6px rgba(0,0,0,0.4)',
            optionHover: '#334155',
            deleteHover: '#ef4444',
            deleteText: '#94a3b8',
            borderRadius: '8px'
        },
        
        forest: {
            primary: '#22c55e',
            primaryLight: '#4ade80',
            bg: '#f0fdf4',
            border: '#bbf7d0',
            text: '#166534',
            textLight: '#22c55e',
            hover: '#dcfce7',
            selected: '#bbf7d0',
            selectedBorder: '#86efac',
            shadow: '0 4px 6px -1px rgba(34,197,94,0.1)',
            optionHover: '#dcfce7',
            deleteHover: '#dc2626',
            deleteText: '#16a34a',
            borderRadius: '8px'
        }
    },

    // متد دریافت تم با استایل‌های کامل
    getTheme(themeName = 'light') {
        const t = this.themes[themeName] || this.themes.light;
        
        return {
            // استایل‌های اصلی
            container: `
                position:relative;
                background:${t.bg};
                border:1px solid ${t.border};
                border-radius:${t.borderRadius};
                color:${t.text};
                font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                font-size:14px;
                line-height:1.5;
                transition:all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                box-shadow:${t.shadow};
                box-sizing:border-box;
            `,
            
            view: `
                padding:8px 12px;
                min-height:42px;
                cursor:pointer;
                display:flex;
                flex-wrap:wrap;
                align-items:center;
                gap:6px;
                border-radius:${t.borderRadius};
                transition:background 0.15s;
                box-sizing:border-box;
                
                &:hover {
                    background:${t.hover}40;
                }
            `,
            
            search: `
                border:none;
                outline:none;
                padding:6px 0;
                flex:1 1 60px;
                min-width:60px;
                background:transparent;
                font-size:14px;
                color:${t.text};
                font-family:inherit;
                box-sizing:border-box;
                
                &::placeholder {
                    color:${t.textLight};
                    opacity:0.8;
                }
            `,
            
            options: `
                display:none;
                position:absolute;
                width:100%;
                max-height:300px;
                z-index:9999;
                overflow-y:auto;
                top:calc(100% + 4px);
                left:0;
                background:${t.bg};
                border:1px solid ${t.border};
                border-radius:${t.borderRadius};
                box-shadow:${t.shadow.replace('0 1px', '0 10px')};
                box-sizing:border-box;
                scrollbar-width:thin;
                scrollbar-color:${t.textLight} ${t.hover};
                
                &::-webkit-scrollbar {
                    width:6px;
                }
                &::-webkit-scrollbar-track {
                    background:${t.hover};
                    border-radius:${t.borderRadius};
                }
                &::-webkit-scrollbar-thumb {
                    background:${t.textLight};
                    border-radius:${t.borderRadius};
                    &:hover {
                        background:${t.primary};
                    }
                }
            `,
            
            optionItem: `
                padding:10px 16px;
                cursor:pointer;
                transition:all 0.15s;
                color:${t.text};
                position:relative;
                border-bottom:1px solid ${t.border}40;
                box-sizing:border-box;
                word-break:break-word;
                
                &:last-child {
                    border-bottom:none;
                }
                
                &:hover {
                    background:${t.optionHover} !important;
                    padding-left:20px;
                }
            `,
            
            selectedItem: `
                display:inline-flex;
                align-items:center;
                background:${t.selected};
                color:${t.text};
                border-radius:${t.borderRadius};
                padding:4px 10px;
                font-size:12px;
                font-weight:500;
                margin:2px;
                border:1px solid ${t.selectedBorder};
                transition:all 0.2s;
                line-height:1.5;
                gap:4px;
                box-sizing:border-box;
                max-width:100%;
                
                &:hover {
                    background:${t.hover};
                    border-color:${t.textLight};
                }
            `,
            
            deleteBtn: `
                margin-left:4px;
                cursor:pointer;
                font-weight:600;
                color:${t.deleteText};
                padding:0 4px;
                border-radius:4px;
                transition:all 0.15s;
                font-size:16px;
                line-height:1;
                display:inline-flex;
                align-items:center;
                justify-content:center;
                
                &:hover {
                    background:${t.deleteHover};
                    color:white;
                    transform:scale(1.1);
                }
            `,
            
            optionSelected: `
                color:${t.primary};
                background:${t.selected};
                font-weight:600;
                
                &::before {
                    content:'✓';
                    position:absolute;
                    right:12px;
                    color:${t.primary};
                    font-weight:bold;
                }
            `,
            
            emptyMessage: `
                padding:20px 16px;
                text-align:center;
                color:${t.textLight};
                font-style:italic;
                cursor:default;
            `,
            
            loading: `
                padding:20px 16px;
                text-align:center;
                color:${t.textLight};
            `,
            
            // متغیرهای تم برای استفاده در کد
            borderRadius: t.borderRadius,
            optionHover: t.optionHover,
            primary: t.primary
        };
    },

    // اضافه کردن تم جدید
    registerTheme(name, themeConfig) {
        this.themes[name] = {
            ...this.themes.light, // استایل‌های پیش‌فرض
            ...themeConfig
        };
    },

    // تزریق انیمیشن‌های گلوبال (یک بار)
    injectGlobalStyles() {
        const styleId = 'iv-select-global-styles';
        if (document.getElementById(styleId)) return;
        
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            @keyframes ivSelectFadeIn {
                from { opacity:0; transform:translateY(-8px); }
                to { opacity:1; transform:translateY(0); }
            }
            
            @keyframes ivSelectScaleIn {
                from { opacity:0; transform:scale(0.9); }
                to { opacity:1; transform:scale(1); }
            }
            
            .iv-select * {
                box-sizing:border-box;
            }
            
            .iv-select-hidden {
                display:none !important;
            }
            
            .iv-select-options {
                animation:ivSelectFadeIn 0.2s ease;
            }
            
            .iv-selected-item {
                animation:ivSelectScaleIn 0.2s ease;
            }
        `;
        document.head.appendChild(style);
    },

    // لیست تم‌های موجود
    listThemes() {
        return Object.keys(this.themes);
    }
};

// اضافه کردن به window
if (typeof window !== 'undefined') {
    window.IvSelectThemeManager = IvSelectThemeManager;
}

export { IvSelectThemeManager };
export default IvSelectThemeManager;