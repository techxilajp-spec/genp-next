import swaggerJsdoc from "swagger-jsdoc";

export const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Genius Productivity API Docs",
      version: "1.0.0",
      description: "API documentation for Genius Productivity app",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: [
    "./app/api/**/*.ts",
    "./app/api/admin/**/*.ts",
    "./app/api/admin/**/**/*.ts",
    "./app/api/admin/**/**/**/*.ts",
    "./app/api/admin/**/**/**/**/*.ts",
    "./app/api/admin/**/**/**/**/**/*.ts",
  ],
};

export const swaggerSpec = swaggerJsdoc(swaggerOptions);
