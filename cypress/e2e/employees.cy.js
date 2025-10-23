import user from '../fixtures/user.json';

describe('Employees Section', () => {
    let employeeId;

    beforeEach(() => {
        cy.login(user.username, user.password);
        cy.visit('/home/employees');
    });

    it('Should see the table with all the columns', () => {
        cy.intercept('GET', `${Cypress.env('apiUrl')}/employees`).as('employeesRequest');

        cy.get('h1').contains('Empleados').should('exist');
        cy.get('[data-testid="add-employee-button"]').should('exist');
        cy.get('table').should('exist');
        cy.get('.MuiTablePagination-root').should('exist');

        cy.get('[data-testid="employees-table-name"]').should('exist');
        cy.get('[data-testid="employees-table-lastname"]').should('exist');
        cy.get('[data-testid="employees-table-services"]').should('exist');
        cy.get('[data-testid="employees-table-actions"]').should('exist');

        cy.wait('@employeesRequest').then((interception) => {
            const firstEmployee = interception.response.body[0];

            cy.get('tbody > tr:nth-child(1) > td:nth-child(1)').should('contain.text', firstEmployee.name);
            cy.get('tbody > tr:nth-child(1) > td:nth-child(2)').should('contain.text', firstEmployee.lastname);
            cy.get('tbody > tr:nth-child(1) > td:nth-child(3)').should('contain.text', firstEmployee.services.join(', '));
            cy.get('tbody > tr:nth-child(1) > td:nth-child(4) > button').should('exist');
        })
    });

    it('Can open and close the add employee modal', () => {
        cy.get('[data-testid="add-employee-button"]').click();
        cy.get('[data-testid="cancel-add-employee-button"]').click();
    });

    it('Should add an employee', () => {
        cy.get('[data-testid="add-employee-button"]').click();
        
        // Name field
        cy.get('#name').type('Automation');

        // Lastname field
        cy.get('#lastname').type('Test');

        // Service field
        cy.get('#services').click({ force: true });
        cy.get('li').contains('Tattoo').click();

        cy.intercept('POST', `${Cypress.env('apiUrl')}/employees`).as('employeesPost');

        // Submit
        cy.get('[data-testid="add-employee-modal-button"]').click({ force: true });

        cy.wait('@employeesPost').then((interception) => {
            employeeId = interception.response.body._id;
            cy.contains('Automation').should('exist');
        });
    });

    it('Should delete an employee', () => {
        cy.get(`[data-testid="action-delete-${employeeId}"]`).click();
        cy.get('[data-testid="delete-modal-title"]').should('exist');

        // I can close the delete employee  modal
        cy.get('[data-testid="delete-modal-no-button"]').click();

        cy.intercept('DELETE', `${Cypress.env('apiUrl')}/employees/${employeeId}`).as('employeesDelete');

        cy.get(`[data-testid="action-delete-${employeeId}"]`).click();
        cy.get('[data-testid="delete-modal-title"]').should('exist');
        cy.get('[data-testid="delete-modal-yes-button"]').click();

        cy.wait('@employeesDelete').then(() => {
            cy.contains('Automation').should('not.exist');
        });
    });
});