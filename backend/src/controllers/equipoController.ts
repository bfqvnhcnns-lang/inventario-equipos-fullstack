import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createEquipo = async (req: Request, res: Response) => {
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
};

export const getEquipos = async (req: Request, res: Response) => {
  try {
    const equipos = await prisma.equipo.findMany();
    res.json(equipos);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getEquipoById = async (req: Request, res: Response) => {
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
};

export const updateEquipo = async (req: Request, res: Response) => {
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
};

export const deleteEquipo = async (req: Request, res: Response) => {
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
};
