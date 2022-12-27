/* exported init */

// Version detection and init
const Config = imports.misc.config;
const [majorVersion, minorVersion] =
        Config.PACKAGE_VERSION.split('.').map(s => Number(s));

function init() {
    if (majorVersion >= 43) {
        return new Extension();
    } else {
        return new ExtensionBefore43();
    }
}

//
// Implementation for Gnome Shell >=43
//
const {Gio, GObject} = imports.gi;
const QuickSettings = imports.ui.quickSettings;
const QuickSettingsMenu = imports.ui.main.panel.statusArea.quickSettings;

const UnsafeModeToggle = GObject.registerClass(
class UnsafeModeToggle extends QuickSettings.QuickToggle {
    _init() {
        super._init({
            label: 'Unsafe Mode',
            iconName: 'channel-insecure-symbolic',
            toggleMode: true,
        });

        // listen for changes to unsafe mode
        global.context.bind_property('unsafe-mode', this, 'checked',
            GObject.BindingFlags.BIDIRECTIONAL | GObject.BindingFlags.SYNC_CREATE);

        // add to menu
        QuickSettingsMenu._addItems([this]);
    }
});

class Extension {
    constructor() {
        this._toggle = null;
    }

    enable() {
        this._toggle = new UnsafeModeToggle();
    }

    disable() {
        this._toggle.destroy();
        this._toggle = null;
    }
}

//
// Implementation for Gnome Shell 41,42
//
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;
const Main = imports.ui.main;

class ExtensionBefore43 {
    constructor() {
        this._menuItem = null;
    }

    enable() {
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
    }

    disable() {
        this._menuItem.destroy();
        this._menuItem = null;
    }
}