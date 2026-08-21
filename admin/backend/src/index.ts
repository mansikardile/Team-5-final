import dotenv from 'dotenv';
dotenv.config();

import { app } from './app.js';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Katalyst Backend running on http://localhost:${PORT}`);
  console.log(`📑 Swagger Documentation available at http://localhost:${PORT}/api-docs`);
});
