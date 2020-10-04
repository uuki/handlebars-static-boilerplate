# Handlebars Static Boilerplate

This boilerplate is that merged handlebars in [mitchheddles/webpack-handlebars-static](https://github.com/mitchheddles/webpack-handlebars-static) into [ericalli/static-site-boilerplate](https://github.com/ericalli/static-site-boilerplate)

## Installation

```bash
git clone https://github.com/uuki/handlebars-static-boilerplate
```

```bash
cd handlebars-static-boilerplate
```

Setup using:

```bash
yarn install
```

## Commands

Start a development server with watch tasks:

```bash
yarn dev
```

Build for production:

```bash
yarn build
```

Launch production on http-server

```bash
yarn start
```

## Project Structure

```
.
├── config
│   ├── site.config.js
│   ├── site.deploy.js
│   ├── site.setup.js
│   ├── webpack.config.js
│   ├── webpack.helpers.js
│   ├── webpack.loaders.js
│   └── webpack.plugins.js
└── src
    ├── data
    │   └── *.json
    ├── images
    ├── javascripts
    │   └── scripts.js
    ├── robots.txt
    ├── stylesheets
    │   └── styles.scss
    └── views
        ├── layouts
        │   └── default.hbs
        ├── pages
        │   ├── 404.hbs
        │   └── index.hbs
        └── partials
            └── header.hbs
```

**Output:**

```
./dist
├── images
├── index.html
├── main.[hash].js
├── main.[hash].js.map
├── robots.txt
├── sitemap.xml
├── sitemap.xml.gz
└── style.[hash].css
```

## Pages

All `.hbs` files in `src/views/pages` are output as page files. Subdirectories and below are also inherited.

## Data

You can use the variables of `config/site.config.js` and `src/data/*.json` in the template(hbs).

Also, each data is applied to the data before being passed to handlebars according to the `replacements` in `config/site.config.js`.

* It is a port of the processing of `mitchheddles/webpack-handlebars-static`

**Example:**

```json
// config/site.config.js -> replacements
{
  "[images]": "/images/"
}
```

```json
// data/foo.json
{
  "bar": "[images]baz.png"
}
```

```html
// index.hbs
<img src="{{foo.bar}}" alt="" />
```

```html
// index.html
<img src="/images/baz.png" alt="" />
```