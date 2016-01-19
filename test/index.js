'use strict';

var expect = require('expect');
var addTrailingSlashes = require('../index.js');

describe('koa-add-trailing-slashes', function() {
    describe('redirect', function() {
        it('should redirect on simple url and url has no trailing slash', function() {
            var mockData = createMock('/foo', '/foo', '/foo');
            var addTrailingSlashesMock = addTrailingSlashes().bind(mockData.mockThis);
            var addTrailingSlashesMockGenerator = addTrailingSlashesMock();
            addTrailingSlashesMockGenerator.next();
            addTrailingSlashesMockGenerator.next();
            expect(mockData.redirectMock.calls[0].arguments[0]).toEqual('/foo/');
            expect(mockData.mockThis.status).toBe(301);
        });

        it('should redirect on simple url with query and url has no trailing slash', function() {
            var mockData = createMock('/foo', '/foo?hello=world', '/foo?hello=world');
            var addTrailingSlashesMock = addTrailingSlashes().bind(mockData.mockThis);
            var addTrailingSlashesMockGenerator = addTrailingSlashesMock();
            addTrailingSlashesMockGenerator.next();
            addTrailingSlashesMockGenerator.next();
            expect(mockData.redirectMock.calls[0].arguments[0]).toEqual('/foo/?hello=world');
            expect(mockData.mockThis.status).toBe(301);
        });

        it('should redirect when using for example koa-mount and url has no trailing slash', function() {
            var mockData = createMock('/foo', '/foo', '/bar/foo');
            var addTrailingSlashesMock = addTrailingSlashes().bind(mockData.mockThis);
            var addTrailingSlashesMockGenerator = addTrailingSlashesMock();
            addTrailingSlashesMockGenerator.next();
            addTrailingSlashesMockGenerator.next();
            expect(mockData.redirectMock.calls[0].arguments[0]).toEqual('/bar/foo/');
            expect(mockData.mockThis.status).toBe(301);
        });

        it('should redirect when using for example koa-mount is on root and url has no trailing slash', function() {
            var mockData = createMock('/', '/', '/foo');
            var addTrailingSlashesMock = addTrailingSlashes().bind(mockData.mockThis);
            var addTrailingSlashesMockGenerator = addTrailingSlashesMock();
            addTrailingSlashesMockGenerator.next();
            addTrailingSlashesMockGenerator.next();
            expect(mockData.redirectMock.calls[0].arguments[0]).toEqual('/foo/');
            expect(mockData.mockThis.status).toBe(301);
        });

        it('should redirect when using for example koa-mount with query and url has no trailing slash', function() {
            var mockData = createMock('/foo', '/foo?hello=world', '/bar/foo?hello=world');
            var addTrailingSlashesMock = addTrailingSlashes().bind(mockData.mockThis);
            var addTrailingSlashesMockGenerator = addTrailingSlashesMock();
            addTrailingSlashesMockGenerator.next();
            addTrailingSlashesMockGenerator.next();
            expect(mockData.redirectMock.calls[0].arguments[0]).toEqual('/bar/foo/?hello=world');
            expect(mockData.mockThis.status).toBe(301);
        });

        it('should redirect when file is index.html, from koa-static', function() {
            var mockData = createMock('/foo', '/foo', '/foo');
            mockData.mockThis.body = {content: 'some content', path: '/some/path/that/is/served/index.html'};
            var addTrailingSlashesMock = addTrailingSlashes().bind(mockData.mockThis);
            var addTrailingSlashesMockGenerator = addTrailingSlashesMock();
            addTrailingSlashesMockGenerator.next();
            addTrailingSlashesMockGenerator.next();
            expect(mockData.redirectMock.calls[0].arguments[0]).toEqual('/foo/');
            expect(mockData.mockThis.status).toBe(301);
        });
    });

    describe('not redirect', function() {
        it('should not redirect on simple url that is the root', function() {
            var mockData = createMock('/', '/', '/');
            var addTrailingSlashesMock = addTrailingSlashes().bind(mockData.mockThis);
            var addTrailingSlashesMockGenerator = addTrailingSlashesMock();
            addTrailingSlashesMockGenerator.next();
            addTrailingSlashesMockGenerator.next();
            expect(mockData.redirectMock).toNotHaveBeenCalled();
            expect(mockData.mockThis.status).toBe(undefined);
        });

        it('should not redirect on simple url and url has trailing slash', function() {
            var mockData = createMock('/foo/', '/foo/', '/foo/');
            var addTrailingSlashesMock = addTrailingSlashes().bind(mockData.mockThis);
            var addTrailingSlashesMockGenerator = addTrailingSlashesMock();
            addTrailingSlashesMockGenerator.next();
            addTrailingSlashesMockGenerator.next();
            expect(mockData.redirectMock).toNotHaveBeenCalled();
            expect(mockData.mockThis.status).toBe(undefined);
        });

        it('should not redirect on simple url with query and url has trailing slash', function() {
            var mockData = createMock('/foo/', '/foo/?hello=world', '/foo/?hello=world');
            var addTrailingSlashesMock = addTrailingSlashes().bind(mockData.mockThis);
            var addTrailingSlashesMockGenerator = addTrailingSlashesMock();
            addTrailingSlashesMockGenerator.next();
            addTrailingSlashesMockGenerator.next();
            expect(mockData.redirectMock).toNotHaveBeenCalled();
            expect(mockData.mockThis.status).toBe(undefined);
        });

        it('should not redirect when using for example koa-mount is on root and url has trailing slash', function() {
            var mockData = createMock('/', '/', '/foo/');
            var addTrailingSlashesMock = addTrailingSlashes().bind(mockData.mockThis);
            var addTrailingSlashesMockGenerator = addTrailingSlashesMock();
            addTrailingSlashesMockGenerator.next();
            addTrailingSlashesMockGenerator.next();
            expect(mockData.redirectMock).toNotHaveBeenCalled();
            expect(mockData.mockThis.status).toBe(undefined);
        });

        it('should not redirect when using for example koa-mount and url has trailing slash', function() {
            var mockData = createMock('/foo/', '/foo/', '/bar/foo/');
            var addTrailingSlashesMock = addTrailingSlashes().bind(mockData.mockThis);
            var addTrailingSlashesMockGenerator = addTrailingSlashesMock();
            addTrailingSlashesMockGenerator.next();
            addTrailingSlashesMockGenerator.next();
            expect(mockData.redirectMock).toNotHaveBeenCalled();
            expect(mockData.mockThis.status).toBe(undefined);
        });

        it('should not redirect when body is defined', function() {
            var mockData = createMock('/foo', '/foo', '/bar/foo');
            mockData.mockThis.body = 'some content';
            var addTrailingSlashesMock = addTrailingSlashes().bind(mockData.mockThis);
            var addTrailingSlashesMockGenerator = addTrailingSlashesMock();
            addTrailingSlashesMockGenerator.next();
            addTrailingSlashesMockGenerator.next();
            expect(mockData.redirectMock).toNotHaveBeenCalled();
            expect(mockData.mockThis.status).toBe(undefined);
        });

        it('should not redirect when the file and path is index.html, from koa-static', function() {
            var mockData = createMock('/foo/index.html', '/foo/index.html', '/foo/index.html');
            mockData.mockThis.body = {content: 'some content', path: '/some/path/that/is/served/index.html'};
            var addTrailingSlashesMock = addTrailingSlashes().bind(mockData.mockThis);
            var addTrailingSlashesMockGenerator = addTrailingSlashesMock();
            addTrailingSlashesMockGenerator.next();
            addTrailingSlashesMockGenerator.next();
            expect(mockData.redirectMock).toNotHaveBeenCalled();
            expect(mockData.mockThis.status).toBe(undefined);
        });

        it('should not redirect when file is index.html, from koa-static, and options set to false', function() {
            var mockData = createMock('/foo', '/foo', '/foo');
            mockData.mockThis.body = {content: 'some content', path: '/some/path/that/is/served/index.html'};
            var addTrailingSlashesMock = addTrailingSlashes({index: false}).bind(mockData.mockThis);
            var addTrailingSlashesMockGenerator = addTrailingSlashesMock();
            addTrailingSlashesMockGenerator.next();
            addTrailingSlashesMockGenerator.next();
            expect(mockData.redirectMock).toNotHaveBeenCalled();
            expect(mockData.mockThis.status).toBe(undefined);
        });
    });
});

function createMock(path, url, originalUrl) {
    var redirectMock = expect.createSpy();
    return {
        redirectMock: redirectMock,
        mockThis: {
            path: path,
            url: url,
            originalUrl: originalUrl,
            status: undefined,
            redirect: redirectMock
        }
    };
}
