# GeoViz

This is the main repo for ``GeoViz`` tutorials.

# Vue 3 + TypeScript + Vite + Vuetify

This website is built using [Vue 3](https://vuejs.org), TypeScript and [Vite](https://vitejs.dev). [Vuetify](https://vuetifyjs.com/en/) is used as the Component Framework and UI library.

## Recommended Setup

- [VS Code](https://code.visualstudio.com/) + [Vue - Official](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (previously Volar) and disable Vetur.

## How to develop and build
First run ``pnpn install`` to install all dependencies required to build.

Then use one of the following scripts:
- ``npm run dev``: serves a development version of this website.
- ``npm run build``: builds the static website in a subfolder called ``dist``.
- ``npm run preview``": previews what gets build at previous step -- on a localhost server.
- ``npm run deploy``: deploys the static website to the specified github page and folder. This page only checks in the ``docs`` folder, so you will have to commit any changes you'll have elsewhere in the repo.
