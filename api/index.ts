import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';

import cityRoutes from './src/routes/cityRoutes';

dotenv.config();

const app = express();
const port = process.env.PORT ?? 3000;

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api', cityRoutes);

// Only listen if not in Vercel production environment
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

// REQUIRED: Export the app for Vercel
export default app;

