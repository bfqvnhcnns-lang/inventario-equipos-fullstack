import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { equipoService } from '../services/equipoService';

/**
 * Helper para extraer mensaje de error de forma segura en TypeScript estricto (sin any).
 */
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

// Listar equipos (con soporte de búsqueda y paginación)
export const getEquipos = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
    const search = (req.query.search as string) || '';

    const result = await equipoService.getEquiposPaginated({ page, limit, search });
    res.json(result);
  } catch (error: unknown) {
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

    const equipo = await equipoService.getEquipoById(id);

    if (!equipo) {
      res.status(404).json({ error: 'Equipo no encontrado' });
      return;
    }

    res.json(equipo);
  } catch (error: unknown) {
    console.error('Error al obtener equipo:', error);
    res.status(500).json({ error: 'Error al consultar los detalles del equipo' });
  }
};

// Crear un nuevo equipo
export const createEquipo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nombre, marca, estado, numeroSerie, descripcion } = req.body;

    if (!nombre || typeof nombre !== 'string' || !nombre.trim() ||
        !marca || typeof marca !== 'string' || !marca.trim() ||
        !numeroSerie || typeof numeroSerie !== 'string' || !numeroSerie.trim()) {
      res.status(400).json({ error: 'Por favor complete los campos requeridos: Nombre, Marca y Número de Serie' });
      return;
    }

    const equipo = await equipoService.createEquipo({
      nombre,
      marca,
      estado,
      numeroSerie,
      descripcion,
    });

    res.status(201).json(equipo);
  } catch (error: unknown) {
    console.error('Error al crear equipo:', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      res.status(400).json({ error: 'Ya existe un equipo registrado con este número de serie' });
    } else {
      res.status(500).json({ error: getErrorMessage(error) || 'Error al guardar el equipo' });
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

    const equipo = await equipoService.updateEquipo(id, {
      nombre,
      marca,
      estado,
      numeroSerie,
      descripcion,
    });

    res.json(equipo);
  } catch (error: unknown) {
    console.error('Error al actualizar equipo:', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        res.status(404).json({ error: 'Equipo no encontrado' });
        return;
      }
      if (error.code === 'P2002') {
        res.status(400).json({ error: 'Ya existe otro equipo registrado con este número de serie' });
        return;
      }
    }
    res.status(500).json({ error: getErrorMessage(error) || 'Error al actualizar el equipo' });
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

    await equipoService.deleteEquipo(id);

    res.json({ message: 'Equipo eliminado exitosamente' });
  } catch (error: unknown) {
    console.error('Error al eliminar equipo:', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      res.status(404).json({ error: 'Equipo no encontrado' });
    } else {
      res.status(500).json({ error: 'Error al eliminar el equipo' });
    }
  }
};
