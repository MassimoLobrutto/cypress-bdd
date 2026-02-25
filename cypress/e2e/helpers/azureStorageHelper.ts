//import { BlobServiceClient } from '@azure/storage-blob'

export class AzureStorageHelper {
  getCosmosData(app: any, queryStr: any) {
    cy.get('@secrets').then(secrets => {
      cy.task('getCosmosData', { secrets, app, env, queryStr }).then(cosmosData => {
        switch (app) {
          case 'interviews':
            cy.wrap(cosmosData, { log: false }).as('interviewsCosmosData');
            break;
          case 'surveys':
            cy.wrap(cosmosData, { log: false }).as('surveysCosmosData');
            break;
          default:
            break;
        }
      });
    });
  }

  getBlobsList(app: any) {
    cy.get('@secrets').then(secrets => {
      cy.task('getBlobsList', { secrets, app, env }).then((blobsList: any[]) => {
        cy.log('Blobs found: ' + blobsList.length);
        switch (app) {
          case 'emails':
            cy.wrap(blobsList, { log: false }).as('emailsBlobsList');
            break;
          case 'interviews':
            cy.wrap(blobsList, { log: false }).as('interviewsBlobsList');
            break;
          case 'surveys':
            cy.wrap(blobsList, { log: false }).as('surveysBlobsList');
            break;
          default:
            break;
        }
      });
    });
  }

  getBlob(blobName: any) {
    cy.task('getBlob', blobName).then(blobName => {
      cy.wrap(blobName).as('blobName');
    });
  }
}

export const azure = new AzureStorageHelper();
