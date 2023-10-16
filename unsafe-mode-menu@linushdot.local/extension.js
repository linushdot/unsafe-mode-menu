import GObject from 'gi://GObject';
import Gio from 'gi://Gio';

import * as QuickSettings from 'resource:///org/gnome/shell/ui/quickSettings.js';

import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';

const UnsafeModeIndicator = GObject.registerClass(
class UnsafeModeIndicator extends QuickSettings.SystemIndicator {
    _init(extensionObject) {
        super._init();
    }
});

const UnsafeModeToggle = GObject.registerClass(
class UnsafeModeToggle extends QuickSettings.QuickToggle {
    _init(extensionObject) {
        super._init({
            title: 'Unsafe Mode',
            iconName: 'channel-insecure-symbolic',
            toggleMode: true,
        });

        // listen for changes to unsafe mode
        global.context.bind_property('unsafe-mode', this, 'checked',
            GObject.BindingFlags.BIDIRECTIONAL | GObject.BindingFlags.SYNC_CREATE);

        // bind to state setting
        this._settings = extensionObject.getSettings();
        this._settings.bind('state', global.context, 'unsafe-mode', Gio.SettingsBindFlags.DEFAULT);
    }
});

export default class UnsafeModeMenuExtension extends Extension {
    enable() {
        this._indicator = new UnsafeModeIndicator(this);
        this._indicator.quickSettingsItems.push(new UnsafeModeToggle(this));

        Main.panel.statusArea.quickSettings.addExternalIndicator(this._indicator);

        // enable unsafe mode if configured
        if(this.getSettings().get_boolean('enable-on-startup'))
            global.context.unsafe_mode = true;
    }

    disable() {
        this._indicator.quickSettingsItems.forEach(item => item.destroy());
        this._indicator.destroy();
        this._indicator = null;
    }
}
