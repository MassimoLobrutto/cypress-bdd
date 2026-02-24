
const createEsbuildPlugin = require('@badeball/cypress-cucumber-preprocessor/esbuild').createEsbuildPlugin;
const createBundler = require('@bahmutov/cypress-esbuild-preprocessor');
const nodePolyfills = require('@esbuild-plugins/node-modules-polyfill').NodeModulesPolyfillPlugin;
const addCucumberPreprocessorPlugin = require('@badeball/cypress-cucumber-preprocessor').addCucumberPreprocessorPlugin;

const fs = require('fs-extra');
const screenShotsDirectory = "./cypress/screenshots";
const reportsDirectory = "./cypress/reports";
const downloadsDir = "./cypress/downloads";

const { BlobServiceClient } = require("@azure/storage-blob");

const { ServiceBusClient } = require("@azure/service-bus");

const { CosmosClient } = require("@azure/cosmos");

const { setDebuggingPortMyService, aadLogin } = require('../plugins/aadLogin');

const { readableToString } = require('node:stream/consumers');

const tedious = require('tedious');

async function streamToString(readableStream) {
  try {
    const result = await readableToString(readableStream);
    return result;
  } catch (error) {
    console.error('Error reading stream: ', error);
    throw error;
  }
}

async function clearDownload() {
  try {
    await fs.emptyDir(downloadsDir);
  } catch (err) {
    console.error('Error clearing downloads: ', err);
    throw err;
  }
  return null
}

async function execSQL(script, config) {
  const connection = new tedious.Connection(config);
  return new Promise((resolve, reject) => {
    connection.on('connect', err => {
      if (err) {
        console.error('Error: ', err);
        reject(err);
      } else {
        const request = new tedious.Request(script, (err, rowCount, rows) => {
          if (err) {
            console.error('Error: ', err);
            reject(err);
          } else {
            resolve(rows);
          }
        });
        connection.execSql(request);
      }
    });
    connection.connect();
  }).finally(() => {
    connection.close();
  });
}

const index = async (on, config) => {

  //Azure Keyvault
  const shelljs = require('shelljs');
  const secrets = {
    vaultName: 'chambers-dev-secrets',
    entryName: 'automated-test-credentials'
  };

  function downloadSecrets() {
    const login = `az login --service-principal -t ${process.env.AZURE_TENANT} -u ${process.env.AZURE_USERNAME} -p ${process.env.AZURE_PASSWORD}`;
    const loginResult = shelljs.exec(login, { silent: true });
    if (loginResult.code) {
      console.error(loginResult.stderr);
      process.exit(1);
    }

    const getSecret = `az keyvault secret show -n ${secrets.entryName} --vault-name ${secrets.vaultName}`;
    const getSecretResult = shelljs.exec(getSecret, { silent: true });
    if (getSecretResult.code) {
      console.error(getSecretResult.stderr);
      process.exit(1);
    }

    let data = JSON.parse(getSecretResult.stdout);
    data = JSON.parse(data.value);
    config.userCredentials = data;

    const logout = `az logout --username ${process.env.AZURE_USERNAME}`;
    const logoutCommandResult = shelljs.exec(logout, { silent: true });
    if (logoutCommandResult.code) {
      console.error(logoutCommandResult.stderr);
      process.exit(1);
    }

    return data;
  }

  on('task', {
    downloadSecrets: () => {
      return downloadSecrets()
    },
  })

  on('task', {
    queryDb: ({ script, config }) => {
      return execSQL(script, config)
    },
  })

  //get Blobs List or Cosmos data or queue connection details

  let key;
  let endpoint;
  let databaseId;
  let containerClient;
  let containerName;
  let connectionString;
  let queueName;

  function getConnectionDetails(secrets, app, env) {
    const envs = ["qa", "qa-sandbox", "uat"];
    const apps = {
      emailsBlob: {
        containerName: env === "uat" ? "emails-uat" : "emails",
        connectionString: secrets.azureEmails.connString,
      },
      surveysBlob: {
        containerName: "surveys",
        connectionString: secrets.surveys.azure[env]?.connString,
      },
      surveysCosmos: {},
      interviewsBlob: {
        containerName: "interviews",
        connectionString: secrets.interviews.azure.blob[env]?.connString,
      },
      interviewsCosmos: {
        containerName: "interviews",
        databaseId: "research-platform",
        key: secrets.interviews.azure.cosmos[env]?.key,
        endpoint: secrets.interviews.azure.cosmos[env]?.uri,
      },
      databackbone: {
        queueName: secrets.azureQueues.databackbone[env]?.queueName,
        connectionString: secrets.azureQueues.databackbone[env]?.connStrng,
      },
    };

    if (envs.includes(env) && app in apps) {
      ({ containerName, connectionString, key, endpoint, databaseId } = apps[app]);
    }
  }

  async function getCosmosData(secrets, app, env, queryStr) {
    try {
      getConnectionDetails(secrets, `${app}Cosmos`, env);
      const client = new CosmosClient({ endpoint, key });
      const database = client.database(databaseId);
      const container = database.container(containerName);
      const querySpec = { query: queryStr };
      const { resources: data } = await container.items.query(querySpec).fetchAll();
      return data;
    } catch (error) {
      console.error(`Error fetching data from CosmosDB for app ${app} in ${env} environment: `, error);
      throw error;
    }
  }

  async function getBlobsList(secrets, app, env) {
    getConnectionDetails(secrets, `${app}Blob`, env);
    const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blobsList = [];
    for await (const blob of containerClient.listBlobsFlat()) {
      blobsList.push(blob.name);
    }
    return blobsList;
  }

  on('task', {
    getBlobsList: ({ secrets, app, env }) => {
      return getBlobsList(secrets, app, env)
    },
    getCosmosData: ({ secrets, app, env, queryStr }) => {
      return getCosmosData(secrets, app, env, queryStr)
    }
  })

  //get blobs

  //Helper function used to read a Node.js readable stream into a string

  async function getBlob(blobName) {
    try {
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);
      const downloadBlockBlobResponse = await blockBlobClient.download(0);
      return await streamToString(downloadBlockBlobResponse.readableStreamBody);
    } catch (error) {
      console.error(`Error downloading blob ${blobName}: `, error);
      throw error;
    }
  }

  on('task', {
    getBlob: (blobName) => {
      return getBlob(blobName)
    },
  })

  on('task', {
    clearDownload: () => {
      return clearDownload()
    },
  })

  let sharedValue: any;

  on('task', {
    setVar: (val) => {
      sharedValue = val;
      return sharedValue;
    },

    getVar: () => {
      return sharedValue;
    }
  })

  const defaultBrowser = { headless: true };

  on('before:browser:launch', (launchOptions, browser: { headless: boolean, name?: string } = defaultBrowser) => {
    if (['chrome', 'chromium'].includes(browser.name)) {
      const existing = launchOptions.args.find(arg => arg.startsWith('--remote-debugging-port'));
      if (existing) {
        setDebuggingPortMyService(existing.split('=')[1]);
      }
      launchOptions.args.push("--disable-site-isolation-trials", '--disable-dev-shm-usage');
    }
    return launchOptions;
  });

  on('task', { aadLogin });

  async function addMessages(secrets, env, messages, queue) {
    getConnectionDetails(secrets, 'databackbone', env);
    const queueName = queue;

    try {
      const sbClient = new ServiceBusClient(connectionString);
      const sender = sbClient.createSender(queueName);
      await sender.sendMessages(messages);
    } catch (err) {
      console.error("SendMessages: Error occurred: ", err);
      process.exit(1);
    }
  }

  on('task', {
    addDatabackboneMessages: ({ secrets, env, messages, queue }) => {
      addMessages(secrets, env, messages, queue)
      return null
    },
  })

  on('task', {
    log(message) {
      console.log(message)
      return null
    }
  })

  await addCucumberPreprocessorPlugin(on, config); // to allow json to be produced
  // To use esBuild for the bundler when preprocessing
  on(
    'file:preprocessor',
    createBundler({
      sourcemap: "inline",
      plugins: [nodePolyfills(), createEsbuildPlugin(config)],
    }),
  );
  return config;
};
module.exports = index;
