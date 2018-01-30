# koa-add-trailing-slashes

Koa middleware that adds trailing slashes on an URL.

[![Build Status](https://img.shields.io/travis/vgno/koa-add-trailing-slashes/master.svg?style=flat-square)](http://travis-ci.org/vgno/koa-add-trailing-slashes) [![Coverage Status](https://img.shields.io/coveralls/vgno/koa-add-trailing-slashes/master.svg?style=flat-square)](https://coveralls.io/r/vgno/koa-add-trailing-slashes) [![npm](https://img.shields.io/npm/v/koa-add-trailing-slashes.svg?style=flat-square)](https://www.npmjs.com/package/koa-add-trailing-slashes)

## Installation
```
npm install koa-add-trailing-slashes
```

## API
```js
var Koa = require('koa');
var app = new Koa();
app.use(require('koa-add-trailing-slashes')(opts));
```

* `opts` options object.

### Options

 - `index` - Default file name, defaults to 'index.html'. Will automatically add slashes to folders that contain this index file, expected to be used with `koa-static`. Defaults to `index.html`.
 - `defer` - If true, serves after yield next, allowing any downstream middleware to respond first. Defaults to `true`.
 - `chained` - If the middleware should continue modifying the url if it detects that a redirect already have been performed. Defaults to `true`.


## Example
```js
var Koa = require('koa');
var addTrailingSlashes = require('koa-add-trailing-slashes');

var app = new Koa();

app.use(addTrailingSlashes());

app.use(ctx => {
  this.body = 'Hello World';
});

app.listen(3000);
```

## Important
Make sure this is added before an eventual [koa-static](https://github.com/koajs/static) middleware to make sure requests to files are not changed and managed correctly. This because it will not rewrite the URL if a `body` has been set along with status `200`. Once exception to this is if the `body` is the index file described above, to make sure a trailing slash is added to the end of a folder that serves the index file.

If all paths always should be rewritten one can set `defer` to `false`.

__Example__
If the url in the browser is `/foo` and `koa-static` resolves that to `foo/index.html` internally along with `opts.index` matching the filename, in this case `index.html`, the path will end up as `/foo/`.

## License
MIT
