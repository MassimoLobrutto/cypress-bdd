export class ApiController {
  private readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  createPost(path: string, title: string, body: string, userId: number = 1) {
    const url = `${this.baseUrl}${path}`;
    cy.log(`🚀 POST Request to: ${url}`);

    return cy.request({
      method: 'POST',
      url: url,
      body: { title, body, userId },
      failOnStatusCode: false, // Allows us to assert on errors in the step def
    });
  }

  getPost(path: string) {
    const url = `${this.baseUrl}${path}`;
    cy.log(`🔍 GET Request to: ${url}`);

    return cy.request({
      method: 'GET',
      url: url,
      failOnStatusCode: false,
    });
  }

  updatePost(path: string, title: string) {
    const url = `${this.baseUrl}${path}`;
    cy.log(`🔄 PUT Request to: ${url}`);

    return cy.request({
      method: 'PUT',
      url: url,
      body: { id: 1, title, body: 'updated body', userId: 1 },
      failOnStatusCode: false,
    });
  }

  deletePost(path: string) {
    const url = `${this.baseUrl}${path}`;
    cy.log(`🗑️ DELETE Request to: ${url}`);

    return cy.request({
      method: 'DELETE',
      url: url,
      failOnStatusCode: false,
    });
  }
}

export const apiController = new ApiController(Cypress.config('baseUrl') || '');
