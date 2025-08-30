# Draw Contours and Lines on a Map
Sometimes being able to draw your own lines or contours on a map can be useful to, for example, show directions or highlight regions of interest. In this tutorial we will go though the steps to draw lines from mouse clicks.

## Adding New Source and Layer for the Lines
To show lines or contours in MapLibre, we are first going to add a new source and layer for the user input. To do so, we are going to use a source of type ``geojson`` and a layer of type ``line``. To dynamically change the lines to render, we are also going to link the source ``data`` with an object visible globally. So, when using as reference the source code from the [last tutorial](./../4_layer-list/), when declaring source and layer names we are going to add the new variables mentioned above:

```html
<html>
  <body>
    <script>
      ...

      // we declare the layers name here
      ...
      const route_sourceId = 'route'
      const route_layerId = 'route'
      const data = {
          'type': 'Feature',
          'properties': {},
          'geometry': {
              'type': 'LineString',
              'coordinates': []
            }
          }
      ...
    </script>
  </body>
</html>
```

Then, when adding all other source and layers in the ``map.on('load')`` callback, we are going to add our new source and layers for the user input:

```html
<html>
  <body>
    <script>
      // add sources + layers
      map.on('load', () => {
        ...
        map.addSource(route_sourceId, {
            type: 'geojson',
            data: data
        });
        map.addLayer({
            id: route_layerId,
            type: 'line',
            source: route_sourceId,
            layout: {
                visibility: 'visible',
                'line-join': 'round',
                'line-cap': 'round'
            },
            paint: {
                'line-color': '#888',
                'line-width': 8
            }
        });
        map.setLayoutProperty(route_layerId, 'visibility', 'visible');
      });
      ...
    </script>
  </body>
</html>
```

## Capturing the Mouse Clicks
With the source and layers setup, we can now dd code to capture the user clicks, to then push them to the ``data`` objeect to render. Capturing the mouse clicks can be done via the ``map.on('click')`` callback, which exposes an [``MapMouseEvent``](https://maplibre.org/maplibre-gl-js/docs/API/classes/MapMouseEvent/) object through which we can access the user the geographic location on the map of the mouse click:

```html
<html>
  <body>
    <script>
      ...
      map.on('click', (e) => {
        const data = map.getSource(route_layerId)._data;
        const coord = e.lngLat.wrap()
        data.geometry.coordinates.push([coord.lng, coord.lat])
        map.getSource(route_layerId).setData(data);
      });
      ...
    </script>
  </body>
</html>
```

## Setting the Lines Color
The code above would already be sufficient to start drawing lines on a map. However, we are going to go one step further and we will add a ui element to choose the lines color from a list of default colors. To do that, first we need to add the corresponding UI elements in the ``body`` of our page (e.g., the same place where have added the ``map`` container). Please refer to the [complete example](./index.html) for the css classes used for this new element. 

```html
<html>
  <body>
    <h1>Draw a route on a map</h1>
    ...
    <div class="map-overlay top">
      <div class="map-overlay-inner">
        <fieldset>
          <label>Choose a color for the lines</label>
          <div id="colorpicker"></div>
        </fieldset>
      </div>
    </div>
  </body>
</html>
```

Once the ``colorpicker`` element is declared, we can populate it with the default colors and add some interaction to it via an ``EventListener``. We will do that right after the code section where we have setup the ``map.on('click')`` callback. Each time we click on a color then, we assign that to the lines rendered on the map, doing so via a call to the [``setPaintProperty()``](https://maplibre.org/maplibre-gl-js/docs/API/classes/Map/#setpaintproperty) method of the ``map`` element, to assign the new ``line-color``

```html
<html>
  <body>
    <script>
      ...
     // setup the colors
      const colorpicker = document.getElementById('colorpicker');
      const colors = [
          '#ffffcc',
          '#a1dab4',
          '#41b6c4',
          '#2c7fb8',
          '#253494',
          '#fed976',
          '#feb24c',
          '#fd8d3c',
          '#f03b20',
          '#bd0026'
      ];

      colors.forEach((color) => {
          const swatch = document.createElement('button');
          swatch.style.backgroundColor = color;
          swatch.addEventListener('click', () => {
            map.setPaintProperty(route_layerId, 'line-color', swatch.style.backgroundColor);
          });
          colorpicker.appendChild(swatch);
      });
    </script>
  </body>
</html>
```

## Putting it All Together
That's it! You can now draw lines and shapes on a map, choosing the color to use (and potentially other paint properties). As before, the complete example code used in this tutorial can be found in the [index.html](./index.html) file in this folder. Opening it in a browser should render something like the following image:

![Drawing lines and contours on a MapLibre map](./tutorial_5_1.png)