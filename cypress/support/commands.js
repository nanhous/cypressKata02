// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add("form", (username, country, city, card, month, year) => {
  cy.get('[class="modal-content"]').should("be.visible");
  cy.get('[class="modal-content"]').find("#name").wait(2000).type(username);
  cy.get('[class="modal-content"]').find("#country").wait(2000).type(country);
  cy.get('[class="modal-content"]').find("#city").wait(2000).type(city);
  cy.get('[class="modal-content"]').find("#card").wait(2000).type(card);
  cy.get('[class="modal-content"]').find("#month").wait(2000).type(month);
  cy.get('[class="modal-content"]').find("#year").wait(2000).type(year);
});

Cypress.Commands.add("signIn", (username, password) => {
  //SIGN UP MODAL
  cy.get("#signin2").click();
  cy.get("#signInModal").should("be.visible");
  //SIGN UP FILL IN
  cy.get("#sign-username")
    .wait(2000)
    .type(username)
    .should("have.value", username);
  cy.get("#sign-password")
    .wait(2000)
    .type(password)
    .should("have.value", password);
  //SIGN UP VALIDATION
  cy.intercept({ method: "POST", url: "/signup" }).as("signUp");
  cy.get("#signInModal").find('[class="btn btn-primary"]').click();
  cy.wait("@signUp");
});

Cypress.Commands.add("logIn", (username, password) => {
  //LOG IN MODAL
  cy.get("#login2").click();
  cy.get("#logInModal").should("be.visible");
  //LOG IN FILL IN
  cy.get("#loginusername")
    .wait(2000)
    .type(username)
    .should("have.value", username);
  cy.get("#loginpassword")
    .wait(2000)
    .type(password)
    .should("have.value", password);
  cy.get("#logInModal")
    .find('[class="btn btn-primary"]')
    .click({ force: true });
  //LOG IN OK
  cy.get("#nameofuser").should("contain", username);
  cy.get("#logout2").should("be.visible");
});
