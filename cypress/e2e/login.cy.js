import user from '../fixtures/user.json';

const apiUrl = `${Cypress.env('apiUrl')}/auth/login`;

describe('Login Flow', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    it('Login page renders correctly', () => {
        cy.get('img[alt="logo"]').should('be.visible');
        cy.get('label[for="username"]').should('be.visible');
        cy.get('#username').should('be.visible');
        cy.get('label[for="password"]').should('be.visible');
        cy.get('#password').should('be.visible');
        // show/hide password button
        cy.get('.MuiIconButton-root').should('be.visible');
        cy.get('button[type="submit"]').should('be.visible').and('be.visible');
        cy.get('[data-testid="enter-as-a-guest"]').should('be.visible').and('be.visible');
    });

    it('Should show/hide password when clicking button', () => {
        cy.get('#password').should('have.attr', 'type', 'password');
        cy.get('.MuiIconButton-root').click();
        cy.get('#password').should('have.attr', 'type', 'text');
        cy.get('.MuiIconButton-root').click();
        cy.get('#password').should('have.attr', 'type', 'password');
    });

    it('Logs in with the credentials', () => {
        cy.get('#username').type(user.username);
        cy.get('#password').type(user.password);

        cy.intercept('POST', apiUrl).as('loginRequest');
        cy.get('button[type="submit"]').click();
        cy.get('button[type="submit"]').should('be.disabled');
        cy.wait('@loginRequest');

        cy.url().should('include', '/home');
    });

    it('Logs in as a guest', () => {
        cy.intercept('POST', apiUrl).as('loginRequest');
        cy.get('[data-testid="enter-as-a-guest"]').click();
        cy.get('button[type="submit"]').should('be.disabled');
        cy.wait('@loginRequest');
        cy.url().should('include', '/home');
    });

    it('Doesn\'t login with wrong credentials', () => {
        cy.get('#username').type('fake');
        cy.get('#password').type('123');

        cy.intercept('POST', apiUrl).as('loginRequest');
        cy.get('button[type="submit"]').click();
        cy.get('button[type="submit"]').should('be.disabled');
        cy.wait('@loginRequest');
        
        cy.get('[data-testid="error-message"]').should('be.visible');
    });
});