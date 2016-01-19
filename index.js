'use strict';

module.exports = addTrailingSlashes;

function addTrailingSlashes(opts) {
    opts = opts || {};

    if (opts.index !== false) {
        opts.index = opts.index || 'index.html';
    }

    return function* (next) {
        yield next;
        var url = getBaseUrl(this.originalUrl, this.url);

        if (noBodyOrIndex(this.body, this.path, opts.index) && missingSlash(url, this.path)) {
            var query = this.url.slice(this.path.length);
            var path = this.path.substring(1);

            if (!path.length) {
                path = '/';
            } else {
                path += '/';
            }

            this.status = 301;
            this.redirect(url + path + query);
        }
    };
}

function getFilename(path) {
    return path.replace(/^.*[\\\/]/, '');
}

function getBaseUrl(original, url) {
    var noInitalSlash = url.substring(1).length;
    if (noInitalSlash !== 0) {
        return original.slice(0, -noInitalSlash);
    }

    return original;
}

function noBodyOrIndex(body, path, index) {
    return !body ||
        (index && body.path && getFilename(body.path) === index && getFilename(body.path) !== getFilename(path));
}

function missingSlash(url, path) {
    return path.slice(-1) !== '/' || url !== '/' && url.slice(-1) !== '/';
}
