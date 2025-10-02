import user from '../fixtures/user.json';

describe('SideNav', () => {
    beforeEach(() => {
        cy.visit('https://tattoo-ui-three.vercel.app/auth/login');
        cy.login(user.username, user.password);
    });

    it('Sidenav renders all items', () => {
        cy.get('.sidenav').trigger('mouseover');
        cy.contains('Sales').should('be.visible');
        cy.contains('Employees').should('be.visible');
        cy.contains('Logout').should('be.visible');
    });

    it('Logs out when clicking Logout item in sidenav', () => {
        cy.get('.sidenav').trigger('mouseover');
        cy.contains('Logout').click();
        cy.url().should('include', '/auth/login');
    })
});