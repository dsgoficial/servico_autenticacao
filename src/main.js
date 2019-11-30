"use strict";

const {
  cluster: { isMaster, setupWorkerProcesses }
} = require("./server");

if (isMaster) {
  setupWorkerProcesses();
} else {
  const { errorHandler } = require("./utils");
  const { startServer, createDocumentation } = require("./server");
  const { databaseVersion } = require("./database");

  databaseVersion
    .load()
    .then(createDocumentation)
    .then(startServer)
    .catch(errorHandler);
}
