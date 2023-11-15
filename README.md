# Unsafe Mode Menu

Simple GNOME extension to change the Gnome Shell unsafe-mode via the quick
settings menu/panel menu. Currently runs on Gnome Shell 42-44.

Find support for later Gnome Shell versions in the `main` branch of this
repository.

## Install/Update

Clone this repository and copy the extension to your extensions folder.

```
git clone https://github.com/linushdot/unsafe-mode-menu.git
cd unsafe-mode-menu
mkdir -p ~/.local/share/gnome-shell/extensions/
cp -r unsafe-mode-menu@linushdot.local ~/.local/share/gnome-shell/extensions/
```

Then restart the shell and enable the extension from https://extensions.gnome.org/local/.
Also on this page the following preferences can be modified.

## Preferences

- Enable on Startup: enable unsafe mode when extension is enabled or when
Gnome Shell is started with the extension enabled

## Screenshot Gnome Shell 43

![Screenshot Gnome Shell 43](screenshot43.png)

## Screenshot Gnome Shell 42

![Screenshot Gnome Shell 42](screenshot42.png)

## Changing Unsafe Mode via dconf

With the extension enabled unsafe mode can be read and changed using `dconf`:
```
dconf read /org/gnome/shell/extensions/unsafe-mode-menu/state
dconf write /org/gnome/shell/extensions/unsafe-mode-menu/state <true|false>
```

## Use Cases

Since Gnome 41 unsafe mode is necessary to let applications access certain
[private D-Bus APIs](https://gitlab.gnome.org/GNOME/gnome-shell/-/merge_requests/1970)
of the Gnome Shell. This mostly concerns:

- API for Screenshots (also sometimes used for screen sharing):
most applications now use a
[new interface](https://flatpak.github.io/xdg-desktop-portal/) instead, but
legacy applications may need unsafe mode for this
- Calling the `org.gnome.Shell.Eval` method to execute javascript inside
Gnome Shell: This is useful for keybindings or for controlling the Gnome
Shell from a script.

An example for the latter is changing to the secondary input source using a
command:

```
gdbus call --session --dest org.gnome.Shell \
    --object-path /org/gnome/Shell \
    --method org.gnome.Shell.Eval \
    "imports.ui.status.keyboard.getInputSourceManager().inputSources[1].activate()"
```