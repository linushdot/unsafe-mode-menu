const {Adw, Gtk, Gio} = imports.gi;

const ExtensionUtils = imports.misc.extensionUtils;

function init(metadata) {
}

// Preferences Window
function fillPreferencesWindow(window) {
    const settings = ExtensionUtils.getSettings();

    // Preferences page with single group and row
    const page = new Adw.PreferencesPage();
    window.add(page);
    const group = new Adw.PreferencesGroup();
    page.add(group);
    const row = new Adw.ActionRow({
        title: 'Enable on Startup',
        subtitle: 'Enable unsafe mode when extension is loaded'
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
