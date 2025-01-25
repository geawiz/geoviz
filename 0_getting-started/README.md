# Getting Started
The following steps have been tested on a macOS system running Sequoia 15.1.1. These instructions should also work on a recent Debian systems. For Windows-based systems some additional steps may be required to install the `tippecanoe` utilities.

## Setting up AWS to Serve Spatial Data 
We use [AWS S3](https://aws.amazon.com/de/s3/) cloud storage to store our spatial datasets. Follow below steps to create a S3 storage bucket.
1. Sign up for a free AWS account [here](https://signin.aws.amazon.com/signup?request_type=register).
2. Go to the S3 service by typing "S3" into the search bar at the top of you AWS console.
3. Before creating a new storage bucket, you can select the region in which you want to store your data. Use the region dropdown right to the search bar.
4. 

5. Set a bucket policy that allows to read files in your bucket using http get requests. Use the edit button of your Bucket policy section inside the Permission tab to add below json. 
```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "AllowPublicRead",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::geovizbucket/*"
        }
    ]
}
```
## Setting up Python Environments for data processing
TODO

## Install tippecanoe to create PM Vector Tiles
On OSX system, use [Homebrew](http://brew.sh/) to install ``tippecanoe``:
```sh
$ brew install tippecanoe
```
On Ubuntu, it is usually easier to build it from source
```sh
$ git clone https://github.com/mapbox/tippecanoe.git
$ cd tippecanoe
$ make -j
$ make install
```
More info can be obtained on the [tippecanoe website](https://github.com/mapbox/tippecanoe?tab=readme-ov-file#installation).

## Optional: Build the tutorials website
The tutorials in this repository are accompanied by a [website](https://geawiz.github.io/geoviz/) that illustrates their final results. In the interest of simplicity, the tutorials HTML/Vue example are a simplified version of the code used to run the website.   

As such, the [website](site) folder presents a more complex working template to run (and develop) a static site capable of display maps and data, built using [Vue 3](https://vuejs.org), TypeScript, [Vuetify](https://vuetifyjs.com/en/) and [Vite](https://vitejs.dev).

If you are interested in building and experimenting with the website, follow the steps below.

Make sure you have ``pnpm`` installed on your system or follow [these](https://pnpm.io/installation) instructions to do so. You can also choose to use ``npm`` instead, and to do so you will have to swap the ``pnpm`` command with ``npm`` in the instructions below.

From the repository root, move to the [website](./../website) folder 
````sh
$ cd website
```` 

From there, install all dependencies by running:
````sh
$ pnpm install
```` 

#### Build the development version of the site

To develop/test the website locally, run:
````sh
$ npm run dev
````

This command will start a development version of the website, reachable at the address [http://localhost:3333](http://localhost:3333). The development version of the website allows you to use hot-reloading to inspect on the fly changes made on the code.

#### Deploy the site

When happy with the local changes, you can compile the development website into a production ready, static site. To do so run: 
````sh
$ npm run build
````

By default this command will build the static website to the folder [docs](./../docs/) int the root of the repository. To change the build location, please modify the ``build.outDir`` entry in the [vite.config](./../website/vite.config) setup file.

You can now deploy the website using the method of your choice. We choose to use [GitHub Pages](https://pages.github.com).