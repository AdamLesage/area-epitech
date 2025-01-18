const swaggerUi = require("swagger-ui-express");
const { resolve } = require('path');
const { readFileSync } = require('fs');
const yaml = require('js-yaml');

// Load the Swagger YAML file
const swaggerDocument = yaml.load(readFileSync(resolve(__dirname, './swagger.yaml'), 'utf8'));

function swaggerDocs(app, port) {
  // Serve the Swagger UI with the YAML specification
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  // Serve the Swagger documentation in JSON format
  app.get("/docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerDocument);
  });

  console.info(`Docs available at http://localhost:${port}/docs`);
}

module.exports = swaggerDocs;
