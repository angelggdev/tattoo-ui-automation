import user from '../fixtures/user.json';

describe('Transactions Home Section', () => {
    beforeEach(() => {
        cy.visit('https://tattoo-ui-three.vercel.app/auth/login');
        cy.login(user.username, user.password);
    });

    it('Should see table with all the columns', () => {
        cy.intercept('GET', 'https://adicto-tattoo.onrender.com/api/transactions').as('transactionsRequest');

        cy.get('h1').contains('Sales').should('exist');
        cy.contains('Add sale').should('exist');
        cy.contains('Filters').should('exist');
        cy.get('table').should('exist');
        cy.get('.MuiTablePagination-root').should('exist');
        cy.get('.MuiChartsGrid-root').should('exist');

        cy.contains('Date').should('exist');
        cy.contains('Name').should('exist');
        cy.contains('Services').should('exist');
        cy.contains('Amount').should('exist');
        cy.contains('Details').should('exist');
        cy.contains('Client').should('exist');
        cy.contains('Actions').should('exist');

        cy.wait('@transactionsRequest').then((interception) => {
            const firstSale = interception.response.body[0];

            cy.get('tbody > tr:nth-child(1) > td:nth-child(1)').should('contain.text', new Date(firstSale.date).toLocaleDateString());
            cy.get('tbody > tr:nth-child(1) > td:nth-child(2)').should('contain.text', `${firstSale.employee_name} ${firstSale.employee_lastname}`);
            cy.get('tbody > tr:nth-child(1) > td:nth-child(3)').should('contain.text', firstSale.service.join(', '));
            cy.get('tbody > tr:nth-child(1) > td:nth-child(4)').should('contain.text', firstSale.amount);
            cy.get('tbody > tr:nth-child(1) > td:nth-child(5)').should('contain.text', firstSale.details);
            cy.get('tbody > tr:nth-child(1) > td:nth-child(6)').should('contain.text', firstSale.client_name);
            cy.get('tbody > tr:nth-child(1) > td:nth-child(7) > button').should('exist');
        })
    });

    it('Can open and close the add sale modal', () => {
        cy.get('button').contains('Add sale').click();
        cy.get('button').contains('Cancel').click();
    })

    it('Should add a sale', () => {
        cy.get('button').contains('Add sale').click();
        cy.intercept('GET', 'https://adicto-tattoo.onrender.com/api/employees').as('employeeRequest');

        // Date field
        cy.get('button[aria-label="Choose date"]').eq(2).click();
        cy.get(`button[data-timestamp="${new Date().setHours(0, 0, 0, 0)}"]`).click();

        // Amount field
        cy.get('#amount').type('10000');

        // Details field
        cy.get('#details').type('I am a robot');

        // Client field
        cy.get('#client_name').type('Robotino');

        // Employee field
        cy.wait('@employeeRequest').then((employees) => {
            const employee = employees.response.body[0];
            cy.intercept('GET', `https://adicto-tattoo.onrender.com/api/employees/${employee._id}/services`).as('serviceRequest');
            cy.get('[data-testid="employee-select"] > #employee_id').click({ force: true });
            cy.get('li').contains(`${employee.name} ${employee.lastname}`).click({ force: true });
    
            // Service field
            cy.wait('@serviceRequest').then((services) => {
                cy.wait(1000);
                const service = services.response.body[0];
                cy.get('[data-testid="service-select"] > #service').click({ force: true });
                cy.get('li').contains(service).click();

                // Submit
                cy.get('button[type="submit"]').contains('Add').click({ force: true });
            });
        });
    });

    it('Should delete a sale', () => {
        cy.get('tbody > tr:nth-child(1) > td:nth-child(7) > button').click();
        cy.contains('Delete Sale?').should('exist');

        // I can close the delete sale modal
        cy.get('button').contains('No').click();

        cy.get('tbody > tr:nth-child(1) > td:nth-child(7) > button').click();
        cy.contains('Delete Sale?').should('exist');
        cy.get('button').contains('Yes').click();

        cy.contains('Robotino').should('not.exist');
    });

    it('Should filter by date correctly', () => {
        cy.get('button').contains('Filters').click();
    });

    it('Should filter by employee correctly', () => {
        cy.get('button').contains('Filters').click();
        cy.intercept('GET', 'https://adicto-tattoo.onrender.com/api/employees').as('employeeRequest');

        cy.wait('@employeeRequest').then((employees) => {
            const employee = employees.response.body[0];
            const employeeFullName = `${employee.name} ${employee.lastname}`;

            cy.intercept('GET', `https://adicto-tattoo.onrender.com/api/employees/${employee._id}/services`).as('serviceRequest');
            cy.get('#employee_id').click({ force: true });
            cy.get('li').contains(employeeFullName).click({ force: true });

            cy.get('button').contains('Search').click();

            cy.get('td:nth-child(2)').should('contain.text', employeeFullName);
        });
    });

    it('Should filter by service correctly', () => {
        cy.get('button').contains('Filters').click();

        cy.get('#service').click({ force: true });
        cy.get('li').contains('Piercing').click({ force: true });

        cy.get('button').contains('Search').click();

        cy.get('td:nth-child(2)').should('contain.text', 'Piercing');
    });
});