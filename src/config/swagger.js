import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "URL Shortener API",
      version: "1.0.0",
      description: "A simple URL shortener API",
    },
    servers: [
      {
        url: "{protocol}://{host}",
        variables: {
          protocol: {
            enum: ["http", "https"],
            default: "http",
          },
          host: {
            default: "localhost:3000",
          },
        },
      },
    ],
  },
  apis: ["./src/routes/*.js"],
};

export const specs = swaggerJsdoc(options);
