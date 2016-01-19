# koa-add-trailing-slashes

Koa middleware that adds trailing slashes to a URL if it not already has it.

[![Build Status](https://img.shields.io/travis/vgno/koa-add-trailing-slashes/master.svg?style=flat-square)](http://travis-ci.org/vgno/koa-add-trailing-slashes) [![Coverage Status](https://img.shields.io/coveralls/vgno/koa-add-trailing-slashes/master.svg?style=flat-square)](https://coveralls.io/r/vgno/koa-add-trailing-slashes) [![npm](https://img.shields.io/npm/v/koa-add-trailing-slashes.svg?style=flat-square)](https://www.npmjs.com/package/koa-add-trailing-slashes)

## Installation
```
npm install koa-add-trailing-slashes
```

## API
```js
var koa = require('koa');
var app = koa();
app.use(require('koa-add-trailing-slashes')(opts));
```

* `opts` options object.

### Options

 - `index` - Default file name, defaults to 'index.html'. Will automatically add slashes to folders that contain this index file, expected to be used with `koa-static`. Set to false to disable this.

## Example
```js
var koa = require('koa');
var addTrailingSlashes = require('koa-add-trailing-slashes');

var app = koa();

app.use(addTrailingSlashes());

app.use(function *(){
  this.body = 'Hello World';
});

app.listen(3000);
```

## Important
Make sure this us added before an eventual [koa-static](https://github.com/koajs/static) to make sure requests to files are not changed and managed correctly.

Will not rewrite the URL if a `body` has been set in general. The special case being if the `body` is the index file described above.

For example if the path in the browser is `/foo` and `koa-static` resolves that to `foo/index.html` internally and `opts.index` is not disabled the path will end up as `/foo/`.

## License
MIT
