const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Serviço de Autenticação",
      version: "0.0.1",
      description: "API HTTP para utilização do Serviço de Autenticação"
    }
  },
  apis: ["./src/**/*.js"]
};

module.exports = swaggerOptions;
