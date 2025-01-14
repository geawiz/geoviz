# GeoViz

This is the main repo for the ``GeoViz`` tutorials.

# Tech stack

The [website](site) is built using [Vue 3](https://vuejs.org), TypeScript and [Vite](https://vitejs.dev). [Vuetify](https://vuetifyjs.com/en/) is used as the Component Framework and UI library.

The [data processing](dataprocessing) scripts use either Python or shell commands/scripts.

## Recommended Setup

- [VS Code](https://code.visualstudio.com/) + [Vue - Official](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (previously Volar) and disable Vetur.

## Develop and build the site
Move to the [website](site) folder 

````
~ cd site
```` 

and then run 

````
~ pnpn install
```` 

to install all dependencies required to build.

Then to develop run

````
~ npm run dev
````

(or clikc theplay icon in the ``NPM SCRIPT`` panel on the left side of VSCode)
which serves a development version of this website. This allows you to use hot-reloading and make changes on the fly.

## Deply the site

When happy with the local changes, run 

````
~ npm run build
````

This command builds the static website in the folder [docs](docs).

In the end, commit all changes, including the newly built [docs](docs) folder. This will change the live website to the latest built version. 

# License
Licensed under the [MIT license](LICENSE).