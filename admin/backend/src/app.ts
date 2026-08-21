import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './docs/swagger.js';
import authRoutes from './routes/auth.routes.js';
import eventRoutes from './routes/event.routes.js';
import feedbackRoutes from './routes/feedback.routes.js';
import spocRoutes from './routes/spoc.routes.js';
import { errorHandler } from './middleware/errorHandler.js';

export const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  })
);
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Health Check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'SevaSahayog Admin API', timestamp: new Date().toISOString() });
});

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/spoc', spocRoutes);
app.use('/api/admin', spocRoutes);

// Error Handling
app.use(errorHandler);
