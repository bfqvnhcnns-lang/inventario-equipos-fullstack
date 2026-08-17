import axios from 'axios';
import { Equipo, CreateEquipoInput, UpdateEquipoInput } from '../types/equipo';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const equipoService = {
  async getAll(): Promise<Equipo[]> {
    const response = await apiClient.get<Equipo[]>('/equipos');
    return response.data;
  },

  async getById(id: number): Promise<Equipo> {
    const response = await apiClient.get<Equipo>(`/equipos/${id}`);
    return response.data;
  },

  async create(data: CreateEquipoInput): Promise<Equipo> {
    const response = await apiClient.post<Equipo>('/equipos', data);
    return response.data;
  },

  async update(id: number, data: UpdateEquipoInput): Promise<Equipo> {
    const response = await apiClient.put<Equipo>(`/equipos/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/equipos/${id}`);
  },
};
