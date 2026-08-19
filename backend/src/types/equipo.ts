export interface CreateEquipoInput {
  nombre: string;
  marca: string;
  estado?: string;
  numeroSerie: string;
  descripcion?: string | null;
}

export interface UpdateEquipoInput {
  nombre?: string;
  marca?: string;
  estado?: string;
  numeroSerie?: string;
  descripcion?: string | null;
}

export interface GetEquiposQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

