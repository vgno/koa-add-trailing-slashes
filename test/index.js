'use strict';

const expect = require('expect');
const Koa = require('koa');
const request = require('supertest');
const addTrailingSlashes = require('../');

describe('koa-add-trailing-slashes', () => {
    describe('running in Koa', () => {
        it('should work in a normal scenarion', (done) => {
            const app = new Koa();
            app.use(addTrailingSlashes());

            request(app.listen())
                .get('/foo')
                .expect('Location', '/foo/')
                .expect(301, done);
        });
    });

    describe('defer = false', () => {
        it('should redirect on url and path has no trailing slash', async () => {
            const mock = createMock('/foo');
            await addTrailingSlashes({defer: false})(mock.ctx, mock.next);

            expect(mock.redirectMock.calls[0].arguments[0]).toEqual('/foo/');
            expect(mock.ctx.status).toBe(301);
        });
    });

    describe('chained = false', () => {
        it('should not redirect on url that already has been modified', async () => {
            const mock = createMock('/fOo');

            // Mock that something has made a redirect before us
            mock.ctx.status = 301;
            mock.ctx.body = 'Redirecting to …';
            mock.ctx.response = {
                get: () => '/foo'
            };

            await addTrailingSlashes({chained: false})(mock.ctx, mock.next);

            expect(mock.redirectMock).toNotHaveBeenCalled();
            expect(mock.ctx.status).toBe(301);
        });
    });

    describe('chained = true & defer = true', () => {
        describe('redirect', () => {
            it('should redirect on url that already has been modified and path has no trailing slash', async () => {
                const mock = createMock('/fOo');

                // Mock that something has made a redirect before us
                mock.ctx.status = 301;
                mock.ctx.body = 'Redirecting to …';
                mock.ctx.response = {
                    get: () => '/foo'
                };

                await addTrailingSlashes()(mock.ctx, mock.next);

                expect(mock.redirectMock.calls[0].arguments[0]).toEqual('/foo/');
                expect(mock.ctx.status).toBe(301);
            });

            it('should redirect on url and path has no trailing slash', async () => {
                const mock = createMock('/foo');
                await addTrailingSlashes()(mock.ctx, mock.next);

                expect(mock.redirectMock.calls[0].arguments[0]).toEqual('/foo/');
                expect(mock.ctx.status).toBe(301);
            });

            it('should redirect on url with query and path has no trailing slash', async () => {
                const mock = createMock('/foo?hello=world', 'hello=world');
                await addTrailingSlashes()(mock.ctx, mock.next);

                expect(mock.redirectMock.calls[0].arguments[0]).toEqual('/foo/?hello=world');
                expect(mock.ctx.status).toBe(301);
            });

            it('should redirect when file is index.html, from koa-static', async () => {
                const mock = createMock('/foo');
                mock.ctx.body = {content: 'some content', path: '/some/path/that/is/served/index.html'};
                mock.ctx.status = 200;

                await addTrailingSlashes()(mock.ctx, mock.next);

                expect(mock.redirectMock.calls[0].arguments[0]).toEqual('/foo/');
                expect(mock.ctx.status).toBe(301);
            });
        });

        describe('not redirect', () => {
            it('should not redirect on url that is the root', async () => {
                const mock = createMock('/');
                await addTrailingSlashes()(mock.ctx, mock.next);

                expect(mock.redirectMock).toNotHaveBeenCalled();
                expect(mock.ctx.status).toBe(undefined);
            });

            it('should not redirect on url and path has trailing slash', async () => {
                const mock = createMock('/foo/');
                await addTrailingSlashes()(mock.ctx, mock.next);

                expect(mock.redirectMock).toNotHaveBeenCalled();
                expect(mock.ctx.status).toBe(undefined);
            });

            it('should not redirect on url with query and path has trailing slash', async () => {
                const mock = createMock('/foo/?hello=world', '/foo/?hello=world');
                await addTrailingSlashes()(mock.ctx, mock.next);

                expect(mock.redirectMock).toNotHaveBeenCalled();
                expect(mock.ctx.status).toBe(undefined);
            });

            it('should not redirect when body is defined', async () => {
                const mock = createMock('/bar/foo');
                mock.ctx.body = 'some content';
                mock.ctx.status = 200;

                await addTrailingSlashes()(mock.ctx, mock.next);

                expect(mock.redirectMock).toNotHaveBeenCalled();
                expect(mock.ctx.status).toBe(200);
            });

            it('should not redirect when the file and path is index.html, from koa-static', async () => {
                const mock = createMock('/foo/index.html');
                mock.ctx.body = {content: 'some content', path: '/some/path/that/is/served/index.html'};
                mock.ctx.status = 200;

                await addTrailingSlashes()(mock.ctx, mock.next);

                expect(mock.redirectMock).toNotHaveBeenCalled();
                expect(mock.ctx.status).toBe(200);
            });

            it('should not redirect when file is index.html, from koa-static, and options set to false', async () => {
                const mock = createMock('/foo');
                mock.ctx.body = {content: 'some content', path: '/some/path/that/is/served/index.html'};
                mock.ctx.status = 200;

                await addTrailingSlashes({index: false})(mock.ctx, mock.next);

                expect(mock.redirectMock).toNotHaveBeenCalled();
                expect(mock.ctx.status).toBe(200);
            });
        });
    });
});

function createMock(originalUrl, querystring) {
    querystring = querystring || '';
    const redirectMock = expect.createSpy();
    return {
        redirectMock,
        ctx: {
            querystring: querystring,
            originalUrl: originalUrl,
            status: undefined,
            redirect: redirectMock
        },
        next: async () => {}
    };
}
