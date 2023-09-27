import Adw from 'gi://Adw';
import Gtk from 'gi://Gtk';
import Gio from 'gi://Gio';

import ExtensionPreferences from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';

export default class UnsafeModeMenuExtensionPreferences extends ExtensionPreferences {

    // Preferences Window
    fillPreferencesWindow(window) {
        const settings = this.getSettings();

        // Preferences page with single group and row
        const page = new Adw.PreferencesPage();
        window.add(page);
        const group = new Adw.PreferencesGroup();
        page.add(group);
        const row = new Adw.ActionRow({
            title: 'Enable on Startup',
            subtitle: 'Enable unsafe mode when extension is enabled'
        });
        group.add(row);

        // Switch and binding
        const toggle = new Gtk.Switch({
            active: settings.get_boolean('enable-on-startup'),
            valign: Gtk.Align.CENTER,
        });
        settings.bind('enable-on-startup', toggle, 'active',
            Gio.SettingsBindFlags.DEFAULT);
        row.add_suffix(toggle);
        row.activatable_widget = toggle;

        // Make sure the window does not outlive the settings object
        window._settings = settings;
    }

}
