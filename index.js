'use strict';

module.exports = addTrailingSlashes;

function addTrailingSlashes(opts) {
    opts = opts || {};

    if (opts.defer !== false) {
        opts.defer = opts.defer || true;
    }

    if (opts.index !== false) {
        opts.index = opts.index || 'index.html';
    }

    if (opts.chained !== false) {
        opts.chained = opts.chained || true;
    }

    return function* (next) {
        if (opts.defer) {
            yield next;
        }

        var path;

        // We have already done a redirect and we will continue if we are in chained mode
        if (opts.chained && this.status === 301) {
            path = getPath(this.response.get('Location'), this.querystring);
        } else if (this.status !== 301) {
            path = getPath(this.originalUrl, this.querystring);
        }

        if (path && noBodyOrIndex(this.status, this.body, path, opts.index) && missingSlash(path)) {
            var query = this.querystring.length ? '?' + this.querystring : '';

            this.status = 301;
            this.redirect(path + '/' + query);
        }

        if (!opts.defer) {
            yield next;
        }
    };
}

function getFilename(path) {
    return path.replace(/^.*[\\\/]/, '');
}

function noBodyOrIndex(status, body, path, index) {
    return !body || status !== 200 ||
        (index && body.path && getFilename(body.path) === index && getFilename(body.path) !== getFilename(path));
}

function missingSlash(path) {
    return path.slice(-1) !== '/';
}

function getPath(original, querystring) {
    if (querystring.length) {
        return original.slice(0, -querystring.length - 1);
    }

    return original;
}
