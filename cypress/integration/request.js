const _ = Cypress._;
const RESPONSE_TIMEOUT = 22222;
const initialBaseUrl = Cypress.config().baseUrl;

describe('Overwritten command request', function() {
    after(function() {
        Cypress.config('baseUrl', initialBaseUrl);
    });

    beforeEach(function() {
        cy.stub(Cypress, 'backend').callThrough();
        Cypress.config('responseTimeout', RESPONSE_TIMEOUT);
    });

    describe('argument signature', function() {
        beforeEach(function() {
            const backend = Cypress.backend.withArgs('http:request').resolves({
                isOkStatusCode: true,
                status: 200,
            });

            this.expectOptionsToBe = function(opts) {
                const options = backend.firstCall.args[1];

                _.each(options, function(value, key) {
                    expect(options[key])
                        .to.deep.eq(opts[key], `failed on property: (${key})`);
                });
                _.each(opts, function(value, key) {
                    expect(opts[key])
                        .to.deep.eq(options[key], `failed on property: (${key})`);
                });
            };
        });

        it('prefixes with requestBaseUrl when origin url is empty', function() {
            cy.stub(cy, 'getRemoteLocation')
                .withArgs('origin')
                .returns('');

            Cypress.config('requestBaseUrl', 'http://api.localhost:8080/app');
            Cypress.config('baseUrl', 'http://localhost:8080/app');

            cy.request('/foo/bar?cat=1')
                .then(() => {
                    this.expectOptionsToBe({
                        url: 'http://api.localhost:8080/app/foo/bar?cat=1',
                        method: 'GET',
                        gzip: true,
                        followRedirect: true,
                        timeout: RESPONSE_TIMEOUT,
                    });
                });
        });

        it('prefixes with baseUrl when origin url is empty and the requestBaseUrl is empty',
            function() {
                cy.stub(cy, 'getRemoteLocation')
                    .withArgs('origin')
                    .returns('');

                Cypress.config('requestBaseUrl', '');
                Cypress.config('baseUrl', 'http://localhost:8080/app');

                cy.request('/foo/bar?cat=1')
                    .then(() => {
                        this.expectOptionsToBe({
                            url: 'http://localhost:8080/app/foo/bar?cat=1',
                            method: 'GET',
                            gzip: true,
                            followRedirect: true,
                            timeout: RESPONSE_TIMEOUT,
                        });
                    });
            });
    });
});