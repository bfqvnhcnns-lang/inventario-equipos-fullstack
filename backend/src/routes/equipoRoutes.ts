import { Router } from 'express';
import {
  getEquipos,
  getEquipoById,
  createEquipo,
  updateEquipo,
  deleteEquipo,
} from '../controllers/equipoController';

const router = Router();

/**
 * @openapi
 * components:
 *   schemas:
 *     Equipo:
 *       type: object
 *       required:
 *         - nombre
 *         - marca
 *         - numeroSerie
 *       properties:
 *         id:
 *           type: integer
 *           description: ID autogenerado del equipo
 *           example: 1
 *         nombre:
 *           type: string
 *           description: Nombre o tipo del equipo
 *           example: Laptop ThinkPad T14
 *         marca:
 *           type: string
 *           description: Marca del fabricante
 *           example: Lenovo
 *         estado:
 *           type: string
 *           description: Estado operativo del equipo
 *           enum: [Operativo, En Mantenimiento, Dañado, Inactivo]
 *           default: Operativo
 *           example: Operativo
 *         numeroSerie:
 *           type: string
 *           description: Número de serie único
 *           example: SN-LN-987654321
 *         descripcion:
 *           type: string
 *           nullable: true
 *           description: Detalles adicionales o notas
 *           example: Asignado al laboratorio 2
 *         fechaCreacion:
 *           type: string
 *           format: date-time
 *         fechaActualizacion:
 *           type: string
 *           format: date-time
 *     EquipoInput:
 *       type: object
 *       required:
 *         - nombre
 *         - marca
 *         - numeroSerie
 *       properties:
 *         nombre:
 *           type: string
 *           example: Laptop ThinkPad T14
 *         marca:
 *           type: string
 *           example: Lenovo
 *         estado:
 *           type: string
 *           enum: [Operativo, En Mantenimiento, Dañado, Inactivo]
 *           example: Operativo
 *         numeroSerie:
 *           type: string
 *           example: SN-LN-987654321
 *         descripcion:
 *           type: string
 *           example: Asignado al laboratorio 2
 */

/**
 * @openapi
 * /equipos:
 *   get:
 *     summary: Obtener equipos con buscador y paginación
 *     tags: [Equipos]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Término de búsqueda para filtrar por nombre, marca, serie, etc.
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página (comienza en 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Cantidad de registros por página
 *     responses:
 *       200:
 *         description: Lista paginada de equipos obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Equipo'
 *                 total:
 *                   type: integer
 *                   example: 25
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 3
 *       500:
 *         description: Error interno del servidor
 *   post:
 *     summary: Registrar un nuevo equipo en el inventario
 *     tags: [Equipos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EquipoInput'
 *     responses:
 *       201:
 *         description: Equipo creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Equipo'
 *       400:
 *         description: Datos requeridos faltantes o número de serie duplicado
 *       500:
 *         description: Error interno del servidor
 */
router.get('/', getEquipos);
router.post('/', createEquipo);

/**
 * @openapi
 * /equipos/{id}:
 *   get:
 *     summary: Obtener detalles de un equipo por ID
 *     tags: [Equipos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID numérico del equipo
 *     responses:
 *       200:
 *         description: Detalles del equipo
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Equipo'
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Equipo no encontrado
 *   put:
 *     summary: Actualizar la información de un equipo existente
 *     tags: [Equipos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID numérico del equipo a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EquipoInput'
 *     responses:
 *       200:
 *         description: Equipo actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Equipo'
 *       400:
 *         description: Datos inválidos o número de serie duplicado
 *       404:
 *         description: Equipo no encontrado
 *       500:
 *         description: Error interno del servidor
 *   delete:
 *     summary: Eliminar un equipo del inventario
 *     tags: [Equipos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID numérico del equipo a eliminar
 *     responses:
 *       200:
 *         description: Equipo eliminado exitosamente
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Equipo no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.get('/:id', getEquipoById);
router.put('/:id', updateEquipo);
router.delete('/:id', deleteEquipo);

export default router;
