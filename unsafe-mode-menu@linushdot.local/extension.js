/* exported init */
const ExtensionUtils = imports.misc.extensionUtils;
const {Gio} = imports.gi;

// Version detection and init
const Config = imports.misc.config;
const [majorVersion, minorVersion] =
        Config.PACKAGE_VERSION.split('.').map(s => Number(s));

const constTitle = 'Unsafe Mode';

//
// Implementation for Gnome Shell >=43
//
if (majorVersion >= 43) {
    function init() {
        return new Extension();
    }

    const {GObject} = imports.gi;
    const QuickSettings = imports.ui.quickSettings;
    const QuickSettingsMenu = imports.ui.main.panel.statusArea.quickSettings;

    const UnsafeModeToggle = GObject.registerClass(
    class UnsafeModeToggle extends QuickSettings.QuickToggle {
        _init() {
            if (majorVersion == 43) {
                super._init({
                    label: constTitle,
                    iconName: 'channel-insecure-symbolic',
                    toggleMode: true,
                });
            } else { // Gnome Shell 44+
                super._init({
                    title: constTitle,
                    iconName: 'channel-insecure-symbolic',
                    toggleMode: true,
                });
                this.label = constTitle;
            }

            // listen for changes to unsafe mode
            global.context.bind_property('unsafe-mode', this, 'checked',
                GObject.BindingFlags.BIDIRECTIONAL | GObject.BindingFlags.SYNC_CREATE);

            // bind to state setting
            ExtensionUtils.getSettings().bind('state', global.context, 'unsafe-mode',
                Gio.SettingsBindFlags.DEFAULT);

            // add to menu
            QuickSettingsMenu._addItems([this]);
        }
    });

    class Extension {
        constructor() {
            this._toggle = null;
        }

        enable() {
            // enable unsafe mode if configured
            if(ExtensionUtils.getSettings().get_boolean('enable-on-startup'))
                global.context.unsafe_mode = true;

            this._toggle = new UnsafeModeToggle();
        }

        disable() {
            this._toggle.destroy();
            this._toggle = null;
        }
    }

//
// Implementation for Gnome Shell 42
//
} else {
    function init() {
        return new ExtensionBefore43();
    }

    const PanelMenu = imports.ui.panelMenu;
    const PopupMenu = imports.ui.popupMenu;
    const Main = imports.ui.main;

    class ExtensionBefore43 {
        constructor() {
            this._menuItem = null;
        }

        enable() {
            // enable unsafe mode if configured
            if(ExtensionUtils.getSettings().get_boolean('enable-on-startup'))
                global.context.unsafe_mode = true;

            // create switch menu item which toggles unsafe mode
            this._menuItem = new PopupMenu.PopupSwitchMenuItem(_("Unsafe Mode"), global.context.unsafe_mode);
            this._menuItem.connect('toggled', () => {
                global.context.unsafe_mode = this._menuItem.state;
            });

            // insert it after nightLight in status bar menu
            let insertAfter = Main.panel.statusArea.aggregateMenu._nightLight.menu;
            let pos = Main.panel.statusArea.aggregateMenu.menu._getMenuItems().findIndex(menu => menu === insertAfter);
            Main.panel.statusArea.aggregateMenu.menu.addMenuItem(this._menuItem, pos+1);

            // listen for external changes to unsafe mode
            global.context.connect('notify::unsafe-mode', () => {
                if(this._menuItem != null)
                    this._menuItem.setToggleState(global.context.unsafe_mode);
            });

            // bind to state setting
            ExtensionUtils.getSettings().bind('state', global.context, 'unsafe-mode',
                Gio.SettingsBindFlags.DEFAULT);
        }

        disable() {
            this._menuItem.destroy();
            this._menuItem = null;
        }
    }
}
