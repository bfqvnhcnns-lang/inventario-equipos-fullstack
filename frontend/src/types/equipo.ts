export interface Equipo {
  id: number;
  nombre: string;
  marca: string;
  estado: 'Operativo' | 'En Mantenimiento' | 'Dañado' | 'Inactivo';
  numeroSerie: string;
  descripcion?: string;
  fechaCreacion: string;
  fechaActualizacion: string;
}

export interface CreateEquipoInput {
  nombre: string;
  marca: string;
  estado?: string;
  numeroSerie: string;
  descripcion?: string;
}

export interface UpdateEquipoInput {
  nombre?: string;
  marca?: string;
  estado?: string;
  numeroSerie?: string;
  descripcion?: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}
