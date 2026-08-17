import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

// Configurar fallback por si DATABASE_URL no está definida
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'file:./dev.db';
}

const prisma = new PrismaClient();

// Listar todos los equipos
export const getEquipos = async (_req: Request, res: Response): Promise<void> => {
  try {
    const equipos = await prisma.equipo.findMany({
      orderBy: { fechaCreacion: 'desc' },
    });
    res.json(equipos);
  } catch (error: any) {
    console.error('Error al obtener equipos:', error);
    res.status(500).json({ error: 'Error al obtener la lista de equipos' });
  }
};

// Obtener un equipo por ID
export const getEquipoById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: 'ID de equipo inválido' });
      return;
    }

    const equipo = await prisma.equipo.findUnique({
      where: { id },
    });

    if (!equipo) {
      res.status(404).json({ error: 'Equipo no encontrado' });
      return;
    }

    res.json(equipo);
  } catch (error: any) {
    console.error('Error al obtener equipo:', error);
    res.status(500).json({ error: 'Error al consultar los detalles del equipo' });
  }
};

// Crear un nuevo equipo
export const createEquipo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nombre, marca, estado, numeroSerie, descripcion } = req.body;

    if (!nombre?.trim() || !marca?.trim() || !numeroSerie?.trim()) {
      res.status(400).json({ error: 'Por favor complete los campos requeridos: Nombre, Marca y Número de Serie' });
      return;
    }

    const equipo = await prisma.equipo.create({
      data: {
        nombre: nombre.trim(),
        marca: marca.trim(),
        estado: estado || 'Operativo',
        numeroSerie: numeroSerie.trim(),
        descripcion: descripcion ? descripcion.trim() : null,
      },
    });

    res.status(201).json(equipo);
  } catch (error: any) {
    console.error('Error al crear equipo:', error);
    if (error.code === 'P2002') {
      res.status(400).json({ error: 'Ya existe un equipo registrado con este número de serie' });
    } else {
      res.status(500).json({ error: error.message || 'Error al guardar el equipo' });
    }
  }
};

// Actualizar un equipo existente
export const updateEquipo = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: 'ID de equipo inválido' });
      return;
    }

    const { nombre, marca, estado, numeroSerie, descripcion } = req.body;

    const equipo = await prisma.equipo.update({
      where: { id },
      data: {
        ...(nombre !== undefined && { nombre: nombre.trim() }),
        ...(marca !== undefined && { marca: marca.trim() }),
        ...(estado !== undefined && { estado }),
        ...(numeroSerie !== undefined && { numeroSerie: numeroSerie.trim() }),
        ...(descripcion !== undefined && { descripcion: descripcion ? descripcion.trim() : null }),
      },
    });

    res.json(equipo);
  } catch (error: any) {
    console.error('Error al actualizar equipo:', error);
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'Equipo no encontrado' });
    } else if (error.code === 'P2002') {
      res.status(400).json({ error: 'Ya existe otro equipo registrado con este número de serie' });
    } else {
      res.status(500).json({ error: error.message || 'Error al actualizar el equipo' });
    }
  }
};

// Eliminar un equipo
export const deleteEquipo = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: 'ID de equipo inválido' });
      return;
    }

    await prisma.equipo.delete({
      where: { id },
    });

    res.json({ message: 'Equipo eliminado exitosamente' });
  } catch (error: any) {
    console.error('Error al eliminar equipo:', error);
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'Equipo no encontrado' });
    } else {
      res.status(500).json({ error: 'Error al eliminar el equipo' });
    }
  }
};
