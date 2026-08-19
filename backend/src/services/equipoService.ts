import { PrismaClient, Equipo, Prisma } from '@prisma/client';
import { CreateEquipoInput, UpdateEquipoInput, GetEquiposQueryParams, PaginatedResult } from '../types/equipo';

const prisma = new PrismaClient();

export const equipoService = {
  /**
   * Obtiene la lista paginada y filtrada de equipos de cómputo.
   */
  async getEquiposPaginated(params: GetEquiposQueryParams): Promise<PaginatedResult<Equipo>> {
    const page = Math.max(1, params.page || 1);
    const limit = Math.max(1, params.limit || 10);
    const search = params.search?.trim() || '';
    const skip = (page - 1) * limit;

    const where: Prisma.EquipoWhereInput = search
      ? {
          OR: [
            { nombre: { contains: search, mode: 'insensitive' } },
            { marca: { contains: search, mode: 'insensitive' } },
            { numeroSerie: { contains: search, mode: 'insensitive' } },
            { descripcion: { contains: search, mode: 'insensitive' } },
            { estado: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    const [data, total] = await Promise.all([
      prisma.equipo.findMany({
        where,
        skip,
        take: limit,
        orderBy: { fechaCreacion: 'desc' },
      }),
      prisma.equipo.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    return {
      data,
      total,
      page,
      limit,
      totalPages,
    };
  },

  /**
   * Obtiene la lista de todos los equipos ordenados por fecha de creación descendente.
   */
  async getAllEquipos(): Promise<Equipo[]> {
    return prisma.equipo.findMany({
      orderBy: { fechaCreacion: 'desc' },
    });
  },

  /**
   * Obtiene un equipo por su ID numérico.
   */
  async getEquipoById(id: number): Promise<Equipo | null> {
    return prisma.equipo.findUnique({
      where: { id },
    });
  },

  /**
   * Crea un nuevo equipo en el inventario.
   */
  async createEquipo(data: CreateEquipoInput): Promise<Equipo> {
    return prisma.equipo.create({
      data: {
        nombre: data.nombre.trim(),
        marca: data.marca.trim(),
        estado: data.estado || 'Operativo',
        numeroSerie: data.numeroSerie.trim(),
        descripcion: data.descripcion ? data.descripcion.trim() : null,
      },
    });
  },

  /**
   * Actualiza un equipo existente por su ID.
   */
  async updateEquipo(id: number, data: UpdateEquipoInput): Promise<Equipo> {
    return prisma.equipo.update({
      where: { id },
      data: {
        ...(data.nombre !== undefined && { nombre: data.nombre.trim() }),
        ...(data.marca !== undefined && { marca: data.marca.trim() }),
        ...(data.estado !== undefined && { estado: data.estado }),
        ...(data.numeroSerie !== undefined && { numeroSerie: data.numeroSerie.trim() }),
        ...(data.descripcion !== undefined && {
          descripcion: data.descripcion ? data.descripcion.trim() : null,
        }),
      },
    });
  },

  /**
   * Elimina un equipo por su ID.
   */
  async deleteEquipo(id: number): Promise<Equipo> {
    return prisma.equipo.delete({
      where: { id },
    });
  },
};
