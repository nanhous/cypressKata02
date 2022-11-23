/// <reference types="cypress" />

import { faker } from "@faker-js/faker";

let username = faker.internet.userName();
let password = faker.internet.password();
let country = faker.address.country();
let city = faker.address.city();
let card = faker.finance.creditCardNumber();
let month = faker.datatype.number({ max: 12 });
let year = faker.datatype.number({ min: 2023, max: 2059 });

beforeEach(() => {
  cy.visit("https://www.demoblaze.com/");
  cy.url().should("include", "www.demoblaze.com");
});

describe("Creation de compte, connexion, deconnexion", () => {
  it("Sign up", () => {
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

  it("Log in", () => {
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

  it("Log out", () => {
    cy.signIn(username, password);
    cy.logIn(username, password);
    //LOG OUT
    cy.get("#logout2").click();
    //LOG OUT OK
    cy.get("#login2").should("be.visible");
    cy.get("#signin2").should("be.visible");
  });
});

describe("Visualisation de produits et ajout panier", () => {
  it("Visualisation et informations produits", () => {
    //NUMBER OF PRODUCTS FIRST PAGE
    cy.get("#tbodyid")
      .find(".card-block")
      .should("have.length", 9)
      //PRICES VISIBLE
      .each((price) => {
        expect(price).include.text("$");
      });
    //PAGINATION
    cy.get(".pagination")
      .find(".page-item")
      .should("have.length", 2)
      .eq(1)
      .click();
    //NUMER OF PRODUCT 2ND PAGE
    cy.get("#tbodyid")
      .find(".card-block")
      .should("have.length", 6)
      //PRICES VISIBLE
      .each((price) => {
        expect(price).include.text("$");
      });
  });

  it("Ajout et supression panier", () => {
    //ACCESS FIRST CATEGORY
    cy.intercept({ method: "POST", url: "/bycat" }).as("byCat");
    cy.get("#itemc").first().click().should("have.text", "Phones");
    cy.wait("@byCat");
    //PRODUCT SELECTION
    cy.get(".card-block")
      .eq(2)
      .find(".card-title")
      .should("have.text", "Nexus 6")
      .click();
    //ADD TO CART
    cy.get('[class="btn btn-success btn-lg"]').click();
    //CART VIEW
    cy.get('[class="nav-item"]').eq(2).click();
    cy.get('[class="btn btn-success"]').should("be.visible");
    //HOME PAGE
    cy.get('[class="nav-item active"]').click();
    //ACCESS FIRST CATEGORY
    cy.intercept({ method: "POST", url: "/bycat" }).as("byCat");
    cy.get("#itemc").first().click().should("have.text", "Phones");
    cy.wait("@byCat");
    //PRODUCT SELECTION
    cy.get(".card-block")
      .eq(5)
      .find(".card-title")
      .should("have.text", "Sony xperia z5")
      .click();
    //ADD TO CART
    cy.get('[class="btn btn-success btn-lg"]').click();
    //CART VIEW
    cy.get('[class="nav-item"]').eq(2).click();
    cy.get(".success").should("have.length", 2);
    //DELETE FIRST PRODUCT
    cy.contains("Delete").eq(0).click();
  });

  it("Checkout", () => {
    //ACCESS FIRST CATEGORY
    cy.intercept({ method: "POST", url: "/bycat" }).as("byCat");
    cy.get("#itemc").first().click().should("have.text", "Phones");
    cy.wait("@byCat");
    //PRODUCT SELECTION
    cy.get(".card-block")
      .eq(2)
      .find(".card-title")
      .should("have.text", "Nexus 6")
      .click();
    //CART VIEW
    cy.get('[class="nav-item"]').eq(2).click();
    cy.url().should("contains", "/cart.html");
    //CHECKOUT
    cy.get('[class="btn btn-success"]').click();
    //FORM
    cy.form(username, country, city, card, month, year);
    //FORM VALIDATION
    cy.contains("Purchase").click();
    //CHECKOUT COMPLETE
    cy.get('[class="sweet-alert  showSweetAlert visible"]').contains(
      "Thank you for your purchase"
    );
    //HOMEPAGE RETURN
    cy.get('[class="confirm btn btn-lg btn-primary"]').click();
    cy.url().should("contains", "/index.html");
  });
});
