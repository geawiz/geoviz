# Displaying a Base Map Using MapLibre

## Introduction
In this tutorial we are going to display a base map in our HTML page using [MapLibre GL JS](https://maplibre.org/maplibre-gl-js/docs/). For the [HTML example](#putting-it-all-together) we will use the CDN distribution of the library. For the [Vue example](#bonus-a-vue-3-component-to-display-a-base-map-using-maplibre) we assume you have installed the library via ``pnpm`` (or ``npm``) (see [here](./../website/package.json) for a ``package.json`` example file).

## Adding a DIV as Map Container
To add a map to our page, as a first step we are going to declare a ``div`` element that will act as the map container. Additionally, we are going to tag the ``div`` with a specific ``id`` to later reference it in the page script. The code below shows a very simply HTML body, with a header and a ``div`` in it:

```html
<body>
  <h1>Displaying a Base Map Using MapLibre</h1>
  <!-- This is the div used to insert the map in the page, tagged as "map" -->
  <div id="map"></div>
</body>
```

## Linking the DIV With a Maplibregl Map Element
Once the ``div`` is declared ans tagged, we need to bind it to a [``maplibregl.Map``](https://maplibre.org/maplibre-gl-js/docs/API/classes/Map/) object. To do so, add the following code to your script section of the HTML page:

```html
<body>
   <!-- code declaring a div goes here -->

  <script>
    // here we add a map to the div tagged above
    const map = new maplibregl.Map({
      container: 'map', // this is the id referring to the "div" in our page body
      style: 'https://geovizbucket.s3.us-west-2.amazonaws.com/osm_basempa_style.json', // this is the style used to load the base map
      center: [8.542810246023732, 47.371741515957304],
      zoom: 14
    });
  </script>

</body>
```
Here we declare a ``maplibregl.Map`` object, we bind it to the element tagged as ``map`` (i.e., the ``div`` declared in the previous step), and we give it a given style. We further center the map and give a starting zoom.

The Maplibre style document is a JSON object with specific (nested) properties that specify how your map is going to be displayed. You can read further information on the [documentation page](https://maplibre.org/maplibre-style-spec/). A style document will specify, for example, which source to use to load the base map (e.g., ``openstreetmap`` tiles), the type (e.g., ``raster``) and, additionally, which ``layers`` to load with the map.

Concretely, the style linked in the example below contains the following properties:
```JSON
{
    "version": 8,
    "sources": {
        "osmtiles": {
            "type": "raster",
            "tiles": [
                "https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            ],
            "tileSize": 256,
            "attribution": "© OpenStreetMap contributors"
        }
    },
    "layers": [
        {
            "id": "osm-basemap",
            "type": "raster",
            "source": "osmtiles"
        }
    ]
}
```
This style JSON instructs Maplibre to load raster tiles of size 256x256 pixels from OpenStreetMap (and correctly credit its contributors). Additionally, the only layer we are going to display for this map is the ``osm-basemap``.

## Adding Controls to the Map
As a final step, we are going to add mouse controls over the map. To do so, we invoke the [``addControl``](https://maplibre.org/maplibre-gl-js/docs/API/classes/Map/#addcontrol) method of our ``map`` object.

```html
<body>
  <!-- code declaring a div goes here -->

  <script>
    // code adding Linking a maplibregl Map element foes here

    // add zoom and rotation controls to the map.
    map.addControl(new maplibregl.NavigationControl({
        visualizePitch: true,
        visualizeRoll: true,
        showZoom: true,
        showCompass: true
    }));
  </script>

</body>
```

## Putting it All Together
At this point it should be clear that displaying a base-map with MapLibre is rather straightforward and can be achieved with few lines of code. The complete example code used in this first tutorial can be found in the [index.html](./index.html) file in this folder. If you open the file in a browser, you should see something like the following image:

![Displaying a Base Map Using MapLibre](./tutorial_1.png)

## A Vue.js Component to Display a Base Map Using MapLibre
While it is important to understand the basics of adding a MapLibre base-map to a HTML page, a perhaps more modern way of achieving the same is through a [Vue.js](https://vuejs.org) component. Specifically, we are going to use Vue 3 and its [composition API](https://vuejs.org/guide/introduction.html#composition-api), which can then also be used as the blue-print for other modern reactive UI frameworks.

The steps for displaying a base-map using Vue component are identical to the ones detailed for the HTML case. First we declare and tag a ``div`` in the body of the page. We then bind it to a [``maplibregl.Map``](https://maplibre.org/maplibre-gl-js/docs/API/classes/Map/) object in the ``onMounted()`` [lifecycle hook](https://vuejs.org/api/composition-api-lifecycle#onmounted) of the component, and we then finally add mouse controls over the rendered map.

The complete and commented code for the component is in the [Map.vue](./Map.vue) file in this tutorial folder.