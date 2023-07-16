# Unsafe Mode Menu

Simple GNOME extension to change the Gnome Shell unsafe-mode via the quick
settings menu/panel menu. Currently runs on Gnome Shell 42-44.

If you want to try it on a newer version you need to add `"<version>"` to the
list of supported versions in `unsafe-mode-menu@linushdot.local/metadata.json`
before installing it. If it just works or if there are bugs with the new Gnome
Shell feel free to open an issue here and I will see if I can update the
extension.

## Install/Update

Clone this repository and copy the extension to your extensions folder.

```
git clone https://github.com/linushdot/unsafe-mode-menu.git
cd unsafe-mode-menu
mkdir -p ~/.local/share/gnome-shell/extensions/
cp -r unsafe-mode-menu@linushdot.local ~/.local/share/gnome-shell/extensions/
```

Then restart the shell and enable the extension from https://extensions.gnome.org/local/.

## Screenshot Gnome Shell 43

![Screenshot Gnome Shell 43](screenshot43.png)

## Screenshot Gnome Shell 42

![Screenshot Gnome Shell 42](screenshot42.png)
