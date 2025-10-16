import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Daraz Price Tracking API",
      version: "1.0.0",
      description: "API documentation for the Daraz Price Tracking System",
    },
    servers: [
      {
        url: "http://13.49.23.88/api/v1", 
      },
    ],
  },
  apis: ["./controllers/**/*.js"], 
};

const swaggerSpec = swaggerJSDoc(options);

export { swaggerUi, swaggerSpec };
