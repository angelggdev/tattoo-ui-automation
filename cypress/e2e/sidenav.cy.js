import user from '../fixtures/user.json';

describe('SideNav', () => {
    beforeEach(() => {
        cy.visit('https://tattoo-ui-three.vercel.app/auth/login');
        cy.login(user.username, user.password);
    });

    it('Sidenav renders all items', () => {
        cy.get('[data-testid="sidenav"]').trigger('mouseover');
        cy.get('[data-testid="sidenav-sales"]').should('be.visible');
        cy.get('[data-testid="sidenav-employees"]').should('be.visible');
        cy.get('[data-testid="sidenav-logout"]').should('be.visible');
    });

    it('Logs out when clicking Logout item in sidenav', () => {
        cy.get('[data-testid="sidenav"]').trigger('mouseover');
        cy.get('[data-testid="sidenav-logout"]').click();
        cy.url().should('include', '/auth/login');
    })

    it('Navigates to Sales section', () => {
        cy.get('[data-testid="sidenav"]').trigger('mouseover');
        cy.get('[data-testid="sidenav-sales"]').click();
        cy.url().should('include', '/home/transactions');
        cy.contains('Ventas').should('exist');
    });

    it('Navigates to Employees section', () => {
        cy.get('[data-testid="sidenav"]').trigger('mouseover');
        cy.get('[data-testid="sidenav-employees"]').click();
        cy.url().should('include', '/home/employees');
        cy.contains('Empleados').should('exist');
    });
});