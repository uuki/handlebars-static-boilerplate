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