# Dynamically display map layers using checkbox buttons
In this module we will go through the steps required to dynamically show or hide the data layers on the map we have been building so far. This module then will first show you how to combine the layers of a [PMTiles](./../2_PMTiles-map/) and a [COG](./../3_Cloud-Optimized-GeoTIFF/) data sources, and will then illustrate how to dynamically render the two.

## Rendering PMTiles and COG files simultaneously
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
    // create the PMTiles rotocol and a source to it
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

![Displaying data from a COG file on a Base Map Using MapLibre](./tutorial_4_1.png)

## Toggling layers
The HTML code above renders the data _simultaneously_ and on top of each other. While this allows us to see all the sources at once, there are certain situations when being able to toggle layers on and off can be beneficial to understand out data. Therefore, to dynamically render a layer, we can use Maplibre Map object method [setLayoutProperty](https://maplibre.org/maplibre-gl-js/docs/API/classes/Map/#setlayoutproperty). With this method we can set the value of a layout property; one such property is the ``visibility`` field, which controls whether a layer is rendered or not using the values ``visible`` or ``none``, respectively.

So, the first step to 