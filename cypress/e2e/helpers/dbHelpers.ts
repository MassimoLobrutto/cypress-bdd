// let env = cy.env(["env"]);

class DBHelpers {
  queryDb(
    server: string | string[],
    db: string,
    script: string,
    timeout = 30000,
  ) {
    // let env = cy.env(["env"]);
    let serverName: string, userName: string, password: string;

    if (server.includes("shield")) {
      serverName = "localhost";
      userName = "username";
      password = "password";
    } else if (server.includes("hydra")) {
      serverName = "localhost1";
      userName = "username1";
      password = "password1";
    }

    let config = {
      server: serverName,
      authentication: {
        type: "default",
        options: {
          userName: userName,
          password: password,
        },
      },
      options: {
        database: db + "-" + env,
        useColumnNames: true,
        encrypt: true,
        rowCollectionOnRequestCompletion: true,
        trustServerCertificate: true,
        requestTimeout: 300000,
        validateBulkLoadParameters: true,
      },
    };
    cy.log(
      `Submitting Query: ${script} to DB: ${db} in Server: ${config.server} with timeout: ${timeout}`,
    );
    return cy.queryDb(script, config);
  }

  checkForTrueZero(result: string | any[]) {
    let count: number;
    if (result.length == 0) {
      if (Object.keys(result).length == 0) {
        cy.log("result is a true 0");
        count = result.length;
        return count;
      }
      if (Object.keys(result).length > 0) {
        cy.log("result is not 0 but 1");
        count = 1;
        return count;
      }
    } else {
      count = result.length;
      cy.log("result is more than 1");
      return count;
    }
  }
}

export const db = new DBHelpers();
