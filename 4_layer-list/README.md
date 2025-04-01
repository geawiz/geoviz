# Dynamically Display Map Layers Using Checkboxes
In this module we will go through the steps required to dynamically show or hide the data layers on the map we have been building so far. This module then will first show you how to combine the layers of a [PMTiles](./../2_PMTiles-map/) and a [COG](./../3_Cloud-Optimized-GeoTIFF/) data sources, and will then illustrate how to dynamically render the two.

## Rendering PMTiles and COG Files Simultaneously
As we have previously learnt, the first step to load data from either a [PMTiles](./../2_PMTiles-map/) or a [COG](./../3_Cloud-Optimized-GeoTIFF/) files is to correctly load the protocols scripts in the Head of our HTML page:

```html
<head>
  <title>GeoViz: Displaying data from a PMTiles file on a Base Map Using MapLibre</title>
  ...
  <script src="https://unpkg.com/pmtiles@3.2.0/dist/pmtiles.js"></script>
  <script src="https://unpkg.com/@geomatico/maplibre-cog-protocol/dist/index.js"></script>
  ...
</head>
```

With the scripts loaded, we can then go ahead and add both protocols to our ``map`` element:

```html
<body>
   <!-- code declaring a div goes here -->

  <script>
    // create the PMTiles protocol and a source to it
    const protocol = new pmtiles.Protocol()
    // add PM Tiles protocol
    maplibregl.addProtocol("pmtiles", protocol.tile)
    // this is the url of your PMTiles file uploaded in the AWS S3 bucket
    const PMTILES_URL = "https://geovizbucket.s3.us-west-2.amazonaws.com/swiss_gemeinden.pmtiles"
    // Associate a PMTiles instance with the protocol
    const p = new pmtiles.PMTiles(PMTILES_URL)
    protocol.add(p)
    
    // create the COG protocol
    maplibregl.addProtocol('cog', MaplibreCOGProtocol.cogProtocol);
    
    //  Fetch header to center the map
    p.getHeader().then(header => {
      // here we add a map to the div tagged above
      const map = new maplibregl.Map({
        container: "map",
        style: "https://geovizbucket.s3.us-west-2.amazonaws.com/osm_basempa_style.json",
        center: [header.centerLon, header.centerLat],
        zoom: header.maxZoom - 3
      });
      // add controls here
      // ...
    });
  </script>

</body>
```

Finally, we can add the source and layers for both protocols:

```html
<body>
   <!-- code declaring a div goes here -->

  <script>
    // create the protocol and a source to it
    //...
    const PMTILES_URL = "https://geovizbucket.s3.us-west-2.amazonaws.com/swiss_gemeinden.pmtiles"
    // ...

    // here we add a map to the div tagged above
    //  Fetch header to center the map
    p.getHeader().then(header => {
      const map = new maplibregl.Map({
        container: "map",
        style: "https://geovizbucket.s3.us-west-2.amazonaws.com/osm_basempa_style.json",
        center: [header.centerLon, header.centerLat],
        zoom: header.maxZoom - 3,
      });
      // add controls here
      // ...

      // add sources + layers
      map.on('load', () => {

        // add PMTiles source
        const pmtiles_sourceId = "swiss_gemeinden"
        map.addSource(pmtiles_sourceId, {
          type: "vector",
          url: `pmtiles://${PMTILES_URL}`
        });
        // add PMTiles layer
        const pmtiles_layerId = "gdf_gemeinden"
        map.addLayer({
          id: pmtiles_layerId,
          source: pmtiles_sourceId,
          "source-layer": pmtiles_layerId,
          type: "fill",
          paint: {
            "fill-color": "blue",
            "fill-outline-color": "red",
            "fill-opacity": 0.3
          }
        });

        // add COG source
        const cog_sourceId = 'imageSource'
        map.addSource(cog_sourceId, {
          type: 'raster',
          url: 'cog://https://geovizbucket.s3.us-west-2.amazonaws.com/output_cog_small_jpeg.tif',
          tileSize: 512,
          minzoom: 5,
          maxzoom: 20
        });
        // add COG layer
        const cog_layerId = 'imageLayer'
        map.addLayer({
          id: cog_layerId,
          source: cog_sourceId,
          type: 'raster',
          paint: {
            'raster-opacity': 0.7
          }
        });
      });
    });
  </script>

</body>
```

The final result should look like the following image:

![Displaying data from a PMTiles and COG files on a Base Map Using MapLibre](./tutorial_4_1.png)

## Toggling Layers
The HTML code above renders the data _simultaneously_ and on top of each other. While this allows us to see both layers at once, there are certain situations when being able to toggle them on and off can be beneficial to understand our data. To dynamically render a layer, use the [setLayoutProperty](https://maplibre.org/maplibre-gl-js/docs/API/classes/Map/#setlayoutproperty) method on the MapLibre Map object. By setting the layer’s ``visibility`` property to either ``visible`` or ``none``, you can control whether the layer is rendered on the map.

To control the visibility we are going to add a list of checkboxes to the map. As we are using plain HTML, we will render a checkbox using a ``input`` element and a ``label`` element, linking its ``checked`` status to the layer visibility:

```html
<div>
  <input type="checkbox" id="my-toggle">
  <label for="my-toggle">Toggle me!</label>
</div>
```

Back to our example, first we are going to declare the layers names outside of the ``map.on('load')`` callback, as we will reuse those variables later to setup the checkboxes. We are then going to add the checkboxes to our map in the ``map.on('idle')`` callback. In order to create exactly one checkbox per layer, we iterate over all the layers added to the map, and for each we add an ``input`` and ``label`` element. To link it to the actual layer, we assign the layer name to the ``input`` id, as this will be useful later when interacting with the element. It is important to notice that the ``map.on('load')`` callback is executed each time the map is done rendering, e.g., when zooming or panning. Therefore, we also need to make sure that our checkboxes are added only once (and ideally on the first call to the callback); this can be easily achieved by making sure that ``input`` with a given id is only added once to the page. The checkboxes are added to the ``checkboxes`` element on the page: this is a simple ``div`` element in the top-right corner of the page that acts as a container for all the ``input`` elements. Please refer to the [index.html](./index.html) file in this folder for further details on how style and place on the page the ``checkboxes`` element via its CSS properties.

```html
<body>
   <!-- code declaring a div goes here -->

  <script>
    // create the protocol and a source to it
    //...
    const PMTILES_URL = "https://geovizbucket.s3.us-west-2.amazonaws.com/swiss_gemeinden.pmtiles"
    // ...

    // here we add a map to the div tagged above
    //  Fetch header to center the map
    p.getHeader().then(header => {
      const map = new maplibregl.Map({
        container: "map",
        style: "https://geovizbucket.s3.us-west-2.amazonaws.com/osm_basempa_style.json",
        center: [header.centerLon, header.centerLat],
        zoom: header.maxZoom - 3,
      });
      // add controls here
      // ...

      // we declare the layers name here, as they will be used later on in the building the checkboxes
      const pmtiles_sourceId = "swiss_gemeinden";
      const pmtiles_layerId = "gdf_gemeinden";
      const cog_sourceId = 'imageSource'
      const cog_layerId = 'imageLayer'

      // add sources + layers
      map.on('load', () => {
        // add sources and layers
        // ...
      });

      // once the map is in idle, we start assembling the checkboxes
      map.on('idle', () => {

        // here we declare the layers we want to make toggable and their title to show in screen
        const layersId = [pmtiles_layerId, cog_layerId];
        const layersTitle = ['pmtiles', 'cog'];

        // for each layer we setup a checkbox
        for (const [index, id] of layersId.entries()){

            // Avoid re-adding the layers each time the map is rendered
            if (document.getElementById(id)) {
                continue;
            }

            // Create a checkbox.
            const div = document.createElement('div');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox'
            checkbox.id = id; // this id matches the layer name, and links this element to the layer
            checkbox.checked = map.getLayoutProperty(id, 'visibility') === 'visible'; // set the initial value of the checkbox depending on whether the layer is currently shown or not
            // add a label for it
            const label = document.createElement('label');
            label.id = 'toggle_' + id;
            label.for = id;
            label.textContent = layersTitle[index];
            // add to the checkbox list in the page
            const checkboxes = document.getElementById('checkboxes');
            checkboxes.appendChild(div);
            div.appendChild(checkbox);
            div.appendChild(label)
        }
      });
    });
  </script>

</body>
```

Finally, we need to setup the interaction between the checkboxes and the layers rendering. This is done by adding the relevant logic to the ``checkbox.onclick()`` callback, which is the callback that gets executed each time the checkbox is clicked. The idea here is to link the ``checked`` value of the checkbox to the ``visibility`` property of the layer associated to it, via a call to the ``setLayoutProperty()`` method of the ``map`` element.  

```html
<body>
  <script>

      // ...

      // once the map is in idle, we start assembling the checkboxes
      map.on('idle', () => {

        // here we declare the layers we want to make toggable and their title to show in screen
        const layersId = [pmtiles_layerId, cog_layerId];
        const layersTitle = ['pmtiles', 'cog'];

        // for each layer we setup a checkbox
        for (const [index, id] of layersId.entries()){

            // Create a checkbox.
            // ...

            // react on checkbox interaction -> click
            checkbox.onclick = function (e) {
                const clickedLayer = this.id;
                const checked = this.checked;
                const visibility = checked ? "visible" : "none"
                map.setLayoutProperty(clickedLayer, 'visibility', visibility);
            };

            // add to the checkbox list in the page
            // ...
        }
      });

    // ...
  </script>

</body>
```

## Putting it All Together
That's it! You can now choose which layer to choose by toggling its name on the checkbox list in the upper right corner of the map. As before, the complete example code used in this tutorial can be found in the [index.html](./index.html) file in this folder. Opening it in a browser should render something like the following image (please note the checkboxes in the upper right corner of the page):

![Toggling layers on a MapLibre map](./tutorial_4_2.png)

## A Vue.js Component to Dynamically Display Map Layers Using Checkboxes
As for previous tutorials we are going to illustrate how to achieve the same steps detailed above in a [Vue.js](https://vuejs.org) component via its [composition API](https://vuejs.org/guide/introduction.html#composition-api). The [reactivity](https://vuejs.org/guide/essentials/reactivity-fundamentals.html) nature of Vue components is actually particularly suited to the task of dynamically render layers. While the steps to achieve this are quite similar the HTML case, we will leverage Vue [``ref``](https://vuejs.org/guide/essentials/reactivity-fundamentals.html#ref) variable and [``watchers``](https://vuejs.org/guide/essentials/watchers.html) to monitor the state of the checkboxes and react to any changes.

The complete component code is slightly longer and more complex than previous ones, and therefore we decided to avoid pasting it here. Instead, please find the complete, documented component in the [Map.vue](./Map.vue) file in this tutorial folder.
