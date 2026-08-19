import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import dotenv from 'dotenv';
import equipoRoutes from './routes/equipoRoutes';

// Cargar variables de entorno desde archivo .env
dotenv.config();

// Crear instancia de Express
const app: Express = express();
const port = process.env.PORT || 3000;

// ============== CONFIGURACIÓN DE MIDDLEWARE ==============
app.use(cors());
app.use(express.json());

// ============== CONFIGURACIÓN DE SWAGGER ==============
const swaggerOptions: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Gestión de Inventario de Equipos - IIAP',
      version: '1.0.0',
      description: 'API REST profesional para administrar el inventario de equipos de cómputo del laboratorio IIAP.',
      contact: {
        name: 'Soporte IIAP',
      },
    },
    servers: [
      {
        url: `http://localhost:${port}/api`,
        description: 'Servidor Local / Docker',
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/index.ts', './dist/routes/*.js', './dist/index.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ============== RUTA RAÍZ BIENVENIDA ==============
app.get('/', (_req: Request, res: Response) => {
  res.send(`
    <div style="font-family: system-ui, -apple-system, sans-serif; padding: 3rem; text-align: center; max-width: 600px; margin: 0 auto; line-height: 1.6;">
      <h1 style="color: #1a365d;">🚀 API de Inventario de Equipos - IIAP</h1>
      <p style="color: #4a5568; font-size: 1.1rem;">El servidor backend está activo y funcionando correctamente.</p>
      <div style="margin-top: 2rem; padding: 1.5rem; background: #edf2f7; border-radius: 8px;">
        <p><strong>Enlaces de acceso:</strong></p>
        <p>🌐 <strong>Interfaz Web (Frontend):</strong> <a href="http://localhost:5173" style="color: #2c5aa0; font-weight: bold;">http://localhost:5173</a></p>
        <p>📚 <strong>Documentación de API (Swagger):</strong> <a href="/api/docs" style="color: #2c5aa0; font-weight: bold;">/api/docs</a></p>
        <p>📡 <strong>Endpoint REST Equipos:</strong> <a href="/api/equipos" style="color: #2c5aa0; font-weight: bold;">/api/equipos</a></p>
      </div>
    </div>
  `);
});

// ============== RUTAS DE LA API ==============
app.use('/api/equipos', equipoRoutes);

// ============== ENDPOINT: VERIFICACIÓN DE SALUD ==============
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'OK', message: 'Servidor operativo', timestamp: new Date().toISOString() });
});

// ============== INICIO DEL SERVIDOR ==============
app.listen(port, () => {
  console.log(`Servidor ejecutándose en http://localhost:${port}`);
  console.log(`Documentación de API disponible en http://localhost:${port}/api/docs`);
});
