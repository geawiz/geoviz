# Use PMTiles for serverless rendering of Vector Data on a Map.
This module explains how to display vector data on a map. We follow a serverless approach that hosts a PMTiles files on a AWS S3 storage platform and displays it in our web app that is based on MapLibre. PMTiles is a single-file archive format for pyramids of tiled data. Using HTTP Range Requests the reader can only fetch the relevant tile inside a PMTiles archive on-demand.

## Create PMTiles
We create a PMTiles archive based that contains Swiss ZIP codes. This [Jupyter Notebook](./prepare_vector_tiles.ipynb) provides step-by-step instructions on how to first download the ZIP codes as `.shp` files, then transform them into a suitable geographic projection and ultimately store them as PMTiles. You can either run the notebook on your local machine or on [Google Colab](https://colab.google).

## Upload PMTiles to S3
Once the PMTiles file is created, we simply have to drag-and-drop it into the AWS S3 storage bucket created in the [Getting Started](../README.md) module.

## Display PMTiles on Map
TODO: @Fabrizio