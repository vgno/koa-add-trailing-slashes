'use strict';

var expect = require('expect');
var addTrailingSlashes = require('../index.js');

describe('koa-add-trailing-slashes', function() {
    describe('defer = false', function() {
        it('should redirect on url and path has no trailing slash', function() {
            var mock = createMock('/foo');
            var addTrailingSlashesMock = addTrailingSlashes({defer: false}).bind(mock.this);
            var addTrailingSlashesMockGenerator = addTrailingSlashesMock();
            addTrailingSlashesMockGenerator.next();
            expect(mock.redirectMock.calls[0].arguments[0]).toEqual('/foo/');
            expect(mock.this.status).toBe(301);
        });
    });

    describe('chained = false', function() {
        it('should not redirect on url that already have been modified', function() {
            var mock = createMock('/fOo');

            // Mock that something has made a redirect before us
            mock.this.status = 301;
            mock.this.body = 'Redirecting to …';
            mock.this.response = {
                get: function() {
                    return '/foo';
                }
            };

            var addTrailingSlashesMock = addTrailingSlashes({chained: false}).bind(mock.this);
            var addTrailingSlashesMockGenerator = addTrailingSlashesMock();
            addTrailingSlashesMockGenerator.next();
            addTrailingSlashesMockGenerator.next();
            expect(mock.redirectMock).toNotHaveBeenCalled();
            expect(mock.this.status).toBe(301);
        });
    });

    describe('chained = true & defer = true', function() {
        describe('redirect', function() {
            it('should redirect on url that already have been modified and path has no trailing slash', function() {
                var mock = createMock('/fOo');

                // Mock that something has made a redirect before us
                mock.this.status = 301;
                mock.this.body = 'Redirecting to …';
                mock.this.response = {
                    get: function() {
                        return '/foo';
                    }
                };

                var addTrailingSlashesMock = addTrailingSlashes().bind(mock.this);
                var addTrailingSlashesMockGenerator = addTrailingSlashesMock();
                addTrailingSlashesMockGenerator.next();
                addTrailingSlashesMockGenerator.next();
                expect(mock.redirectMock.calls[0].arguments[0]).toEqual('/foo/');
                expect(mock.this.status).toBe(301);
            });

            it('should redirect on url and path has no trailing slash', function() {
                var mock = createMock('/foo');
                var addTrailingSlashesMock = addTrailingSlashes().bind(mock.this);
                var addTrailingSlashesMockGenerator = addTrailingSlashesMock();
                addTrailingSlashesMockGenerator.next();
                addTrailingSlashesMockGenerator.next();
                expect(mock.redirectMock.calls[0].arguments[0]).toEqual('/foo/');
                expect(mock.this.status).toBe(301);
            });

            it('should redirect on url with query and path has no trailing slash', function() {
                var mock = createMock('/foo?hello=world', 'hello=world');
                var addTrailingSlashesMock = addTrailingSlashes().bind(mock.this);
                var addTrailingSlashesMockGenerator = addTrailingSlashesMock();
                addTrailingSlashesMockGenerator.next();
                addTrailingSlashesMockGenerator.next();
                expect(mock.redirectMock.calls[0].arguments[0]).toEqual('/foo/?hello=world');
                expect(mock.this.status).toBe(301);
            });

            it('should redirect when file is index.html, from koa-static', function() {
                var mock = createMock('/foo');
                var addTrailingSlashesMock = addTrailingSlashes().bind(mock.this);
                var addTrailingSlashesMockGenerator = addTrailingSlashesMock();
                addTrailingSlashesMockGenerator.next();
                mock.this.body = {content: 'some content', path: '/some/path/that/is/served/index.html'};
                mock.this.status = 200;
                addTrailingSlashesMockGenerator.next();
                expect(mock.redirectMock.calls[0].arguments[0]).toEqual('/foo/');
                expect(mock.this.status).toBe(301);
            });
        });

        describe('not redirect', function() {
            it('should not redirect on url that is the root', function() {
                var mock = createMock('/');
                var addTrailingSlashesMock = addTrailingSlashes().bind(mock.this);
                var addTrailingSlashesMockGenerator = addTrailingSlashesMock();
                addTrailingSlashesMockGenerator.next();
                addTrailingSlashesMockGenerator.next();
                expect(mock.redirectMock).toNotHaveBeenCalled();
                expect(mock.this.status).toBe(undefined);
            });

            it('should not redirect on url and path has trailing slash', function() {
                var mock = createMock('/foo/');
                var addTrailingSlashesMock = addTrailingSlashes().bind(mock.this);
                var addTrailingSlashesMockGenerator = addTrailingSlashesMock();
                addTrailingSlashesMockGenerator.next();
                addTrailingSlashesMockGenerator.next();
                expect(mock.redirectMock).toNotHaveBeenCalled();
                expect(mock.this.status).toBe(undefined);
            });

            it('should not redirect on url with query and path has trailing slash', function() {
                var mock = createMock('/foo/?hello=world', '/foo/?hello=world');
                var addTrailingSlashesMock = addTrailingSlashes().bind(mock.this);
                var addTrailingSlashesMockGenerator = addTrailingSlashesMock();
                addTrailingSlashesMockGenerator.next();
                addTrailingSlashesMockGenerator.next();
                expect(mock.redirectMock).toNotHaveBeenCalled();
                expect(mock.this.status).toBe(undefined);
            });

            it('should not redirect when body is defined', function() {
                var mock = createMock('/bar/foo');
                var addTrailingSlashesMock = addTrailingSlashes().bind(mock.this);
                var addTrailingSlashesMockGenerator = addTrailingSlashesMock();
                addTrailingSlashesMockGenerator.next();
                mock.this.body = 'some content';
                mock.this.status = 200;
                addTrailingSlashesMockGenerator.next();
                expect(mock.redirectMock).toNotHaveBeenCalled();
                expect(mock.this.status).toBe(200);
            });

            it('should not redirect when the file and path is index.html, from koa-static', function() {
                var mock = createMock('/foo/index.html');
                var addTrailingSlashesMock = addTrailingSlashes().bind(mock.this);
                var addTrailingSlashesMockGenerator = addTrailingSlashesMock();
                addTrailingSlashesMockGenerator.next();
                mock.this.body = {content: 'some content', path: '/some/path/that/is/served/index.html'};
                mock.this.status = 200;
                addTrailingSlashesMockGenerator.next();
                expect(mock.redirectMock).toNotHaveBeenCalled();
                expect(mock.this.status).toBe(200);
            });

            it('should not redirect when file is index.html, from koa-static, and options set to false', function() {
                var mock = createMock('/foo');
                var addTrailingSlashesMock = addTrailingSlashes({index: false}).bind(mock.this);
                var addTrailingSlashesMockGenerator = addTrailingSlashesMock();
                addTrailingSlashesMockGenerator.next();
                mock.this.body = {content: 'some content', path: '/some/path/that/is/served/index.html'};
                mock.this.status = 200;
                addTrailingSlashesMockGenerator.next();
                expect(mock.redirectMock).toNotHaveBeenCalled();
                expect(mock.this.status).toBe(200);
            });
        });
    });
});

function createMock(originalUrl, querystring) {
    querystring = querystring || '';
    var redirectMock = expect.createSpy();
    return {
        redirectMock: redirectMock,
        this: {
            querystring: querystring,
            originalUrl: originalUrl,
            status: undefined,
            redirect: redirectMock
        }
    };
}
