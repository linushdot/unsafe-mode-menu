/* exported init */

const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;
const Main = imports.ui.main;

class Extension {
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

function init() {
    return new Extension();
}
