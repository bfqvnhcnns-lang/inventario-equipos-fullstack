import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;
const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());

// Swagger Configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Equipment Inventory API',
      version: '1.0.0',
      description: 'API for managing computer equipment inventory',
    },
    servers: [
      {
        url: `http://localhost:${port}/api`,
        description: 'Development server',
      },
    ],
  },
  apis: ['./src/main.ts'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /equipos:
 *   get:
 *     summary: Get all equipment
 *     tags: [Equipos]
 *     responses:
 *       200:
 *         description: List of all equipment
 */
app.get('/api/equipos', async (req: Request, res: Response) => {
  try {
    const equipos = await prisma.equipo.findMany();
    res.json(equipos);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /equipos:
 *   post:
 *     summary: Create a new equipment
 *     tags: [Equipos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombre, marca, numeroSerie]
 *             properties:
 *               nombre:
 *                 type: string
 *               marca:
 *                 type: string
 *               estado:
 *                 type: string
 *               numeroSerie:
 *                 type: string
 *               descripcion:
 *                 type: string
 *     responses:
 *       201:
 *         description: Equipment created
 */
app.post('/api/equipos', async (req: Request, res: Response) => {
  try {
    const { nombre, marca, estado, numeroSerie, descripcion } = req.body;
    
    if (!nombre || !marca || !numeroSerie) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const equipo = await prisma.equipo.create({
      data: {
        nombre,
        marca,
        estado: estado || 'Operativo',
        numeroSerie,
        descripcion,
      },
    });

    res.status(201).json(equipo);
  } catch (error: any) {
    if (error.code === 'P2002') {
      res.status(400).json({ error: 'Equipment with this serial number already exists' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

/**
 * @swagger
 * /equipos/{id}:
 *   get:
 *     summary: Get equipment by ID
 *     tags: [Equipos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Equipment details
 */
app.get('/api/equipos/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const equipo = await prisma.equipo.findUnique({
      where: { id: parseInt(id) },
    });

    if (!equipo) {
      res.status(404).json({ error: 'Equipment not found' });
      return;
    }

    res.json(equipo);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /equipos/{id}:
 *   put:
 *     summary: Update equipment
 *     tags: [Equipos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               marca:
 *                 type: string
 *               estado:
 *                 type: string
 *               numeroSerie:
 *                 type: string
 *               descripcion:
 *                 type: string
 *     responses:
 *       200:
 *         description: Equipment updated
 */
app.put('/api/equipos/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nombre, marca, estado, numeroSerie, descripcion } = req.body;

    const equipo = await prisma.equipo.update({
      where: { id: parseInt(id) },
      data: {
        ...(nombre && { nombre }),
        ...(marca && { marca }),
        ...(estado && { estado }),
        ...(numeroSerie && { numeroSerie }),
        ...(descripcion !== undefined && { descripcion }),
      },
    });

    res.json(equipo);
  } catch (error: any) {
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'Equipment not found' });
    } else if (error.code === 'P2002') {
      res.status(400).json({ error: 'Equipment with this serial number already exists' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

/**
 * @swagger
 * /equipos/{id}:
 *   delete:
 *     summary: Delete equipment
 *     tags: [Equipos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Equipment deleted
 */
app.delete('/api/equipos/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.equipo.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: 'Equipment deleted successfully' });
  } catch (error: any) {
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'Equipment not found' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'OK' });
});

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
  console.log(`📚 API documentation at http://localhost:${port}/api/docs`);
});
