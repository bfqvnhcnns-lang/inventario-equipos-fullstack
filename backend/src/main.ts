import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import dotenv from 'dotenv';
import equipoRoutes from './routes/equipoRoutes';

// Cargar variables de entorno desde archivo .env
dotenv.config();

// Fallback por si DATABASE_URL no existe
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'file:./dev.db';
}

// Crear instancia de Express
const app: Express = express();
const port = process.env.PORT || 3000;

// ============== CONFIGURACIÓN DE MIDDLEWARE ==============
app.use(cors());
app.use(express.json());

// ============== CONFIGURACIÓN DE SWAGGER ==============
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Gestión de Inventario de Equipos',
      version: '1.0.0',
      description: 'API REST para administrar equipos de cómputo del IIAP',
    },
    servers: [
      {
        url: `http://localhost:${port}/api`,
        description: 'Servidor de desarrollo',
      },
    ],
  },
  apis: ['./src/main.ts', './src/routes/*.ts'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ============== RUTAS DE LA API ==============
app.use('/api/equipos', equipoRoutes);

// ============== ENDPOINT: VERIFICACIÓN DE SALUD ==============
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'OK', message: 'Servidor operativo' });
});

// ============== INICIO DEL SERVIDOR ==============
app.listen(port, () => {
  console.log(` Servidor ejecutándose en http://localhost:${port}`);
  console.log(` Documentación de API disponible en http://localhost:${port}/api/docs`);
});
