# Use PMTiles for serverless rendering of Vector Data on a Map.
This module explains how to render vector on a map. We follow a serverless approach that hosts a PMTiles files on a AWS S3 storage platform and display it in our Web app that is based on MapLibre. PMTiles is a single-file archive format for pyramids of tiled data. Using HTTP Range Requests the reader can only fetch the relevant tile or metadata inside a PMTiles archive on-demand.

## Create PMTiles
We create a PMTiles archive based that contains Swiss ZIP codes. This [Jupyter Notebook](./prepare_vector_tiles.ipynb) provides step-by-step instructions on how to first download the ZIP codes as `.shp` files, then transform them into a suitable geographic projection and ultimately store them as PMTiles.

## Upload PMTiles to S3
Drag

## Display PMTiles on Map
