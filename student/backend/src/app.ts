import express from 'express';
import cors from 'cors';
import studentAuthRoutes from './routes/studentAuth.routes.js';
import feedbackRoutes from './routes/feedback.routes.js';

export const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3001',
    credentials: true,
  })
);

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Health Check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'SevaSahayog Volunteer API', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/student/auth', studentAuthRoutes);
app.use('/api/auth', studentAuthRoutes);

app.use('/api/student/feedback', feedbackRoutes);
app.use('/api/feedback', feedbackRoutes);

// Global Error Handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Seva API Error:', err);

  if (err.name === 'ZodError') {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: err.errors,
    });
  }

  return res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});
