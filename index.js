//index.js
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');

dotenv.config(); // Load environment variables

const app = express();
app.use(cors());
app.use(express.json()); // Middleware for JSON data

function swaggerDocumentation() {
  /* Documentation */
  const swaggerSpec = YAML.load(path.join(process.cwd(), 'openapi.yml'));
  if (swaggerSpec.servers === undefined || swaggerSpec.servers === null) {
      swaggerSpec.servers = [];
  }
  swaggerSpec.servers[0].url = '/api/users';
  return swaggerSpec;
}

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Connection Error:", err));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocumentation(), {
    customCss: '.swagger-ui .opblock .opblock-summary-path-description-wrapper { align-items: center; display: flex; flex-wrap: wrap; gap: 0 10px; padding: 0 10px; width: 100%; }',
    customCssUrl: "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css",
}));
app.use("/api/users", require("./routes/userroutes")); // User routes

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


