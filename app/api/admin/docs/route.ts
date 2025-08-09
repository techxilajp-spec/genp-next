// We have to handle Swagger differently because Next.js routes are edge/serverless
export const GET = async () => {
  return new Response(
    `
    <!DOCTYPE html>
    <html>
      <head>
        <title>API Docs</title>
        <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist/swagger-ui.css" />
      </head>
      <body>
        <div id="swagger"></div>
        <script src="https://unpkg.com/swagger-ui-dist/swagger-ui-bundle.js"></script>
        <script>
          SwaggerUIBundle({
            url: '/api/admin/docs/swagger.json',
            dom_id: '#swagger'
          });
        </script>
      </body>
    </html>
    `,
    { headers: { "Content-Type": "text/html" } }
  );
};
