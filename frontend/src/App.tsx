import { useState, useEffect } from 'react';
import axios from 'axios';
import { Equipo, CreateEquipoInput } from './types/equipo';
import { equipoService } from './services/equipoService';
import { EquipoTable } from './components/EquipoTable';
import './index.css';

const initialFormData: CreateEquipoInput = {
  nombre: '',
  marca: '',
  estado: 'Operativo',
  numeroSerie: '',
  descripcion: '',
};

function App() {
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<CreateEquipoInput>(initialFormData);

  // Estados de paginación y búsqueda
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Debounce para la búsqueda (retardo de 400ms para no saturar la API)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reiniciar a la página 1 al filtrar
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  // Cargar lista de equipos con paginación
  const fetchEquipos = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await equipoService.getAll({
        page,
        limit,
        search: debouncedSearch,
      });
      setEquipos(response.data);
      setTotal(response.total);
      setTotalPages(response.totalPages);
    } catch (err: unknown) {
      let msg = 'Error al conectar con el servidor';
      if (axios.isAxiosError(err)) {
        msg = err.response?.data?.error || err.message;
      } else if (err instanceof Error) {
        msg = err.message;
      }
      setError(`No se pudieron cargar los equipos: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipos();
  }, [page, limit, debouncedSearch]);

  // Manejo de guardado (Crear o Actualizar)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validación en el cliente
    if (!formData.nombre.trim() || !formData.marca.trim() || !formData.numeroSerie.trim()) {
      setError('Por favor complete todos los campos obligatorios (*)');
      return;
    }

    try {
      if (editingId) {
        await equipoService.update(editingId, formData);
        setSuccess('Equipo actualizado con éxito');
      } else {
        await equipoService.create(formData);
        setSuccess('Equipo guardado con éxito');
      }

      // Reiniciar formulario
      setFormData(initialFormData);
      setEditingId(null);
      setShowForm(false);
      fetchEquipos();
    } catch (err: unknown) {
      let errorMessage = 'Error al guardar el equipo';
      if (axios.isAxiosError(err)) {
        errorMessage = err.response?.data?.error || err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    }
  };

  // Manejo de eliminación
  const handleDelete = async (id: number) => {
    if (window.confirm('¿Está seguro de que desea eliminar este equipo?')) {
      setError(null);
      setSuccess(null);
      try {
        await equipoService.delete(id);
        setSuccess('Equipo eliminado correctamente');
        fetchEquipos();
      } catch (err: unknown) {
        let errorMessage = 'Error al eliminar el equipo';
        if (axios.isAxiosError(err)) {
          errorMessage = err.response?.data?.error || err.message;
        } else if (err instanceof Error) {
          errorMessage = err.message;
        }
        setError(errorMessage);
      }
    }
  };

  // Preparar edición
  const handleEdit = (equipo: Equipo) => {
    setError(null);
    setSuccess(null);
    setFormData({
      nombre: equipo.nombre,
      marca: equipo.marca,
      estado: equipo.estado,
      numeroSerie: equipo.numeroSerie,
      descripcion: equipo.descripcion || '',
    });
    setEditingId(equipo.id);
    setShowForm(true);
  };

  // Cancelar formulario
  const handleCancel = () => {
    setFormData(initialFormData);
    setEditingId(null);
    setShowForm(false);
    setError(null);
  };

  return (
    <div className="container">
      <header className="header">
        <h1>Gestión de Inventario de Equipos</h1>
        <p>Sistema de administración de equipos de cómputo IIAP</p>
      </header>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="button-group">
        {!showForm && (
          <button
            className="btn btn-primary"
            onClick={() => {
              setFormData(initialFormData);
              setEditingId(null);
              setError(null);
              setSuccess(null);
              setShowForm(true);
            }}
          >
            + Agregar Nuevo Equipo
          </button>
        )}
      </div>

      {showForm && (
        <div className="form-container">
          <h2>{editingId ? 'Editar Equipo' : 'Crear Nuevo Equipo'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="nombre">Nombre *</label>
              <input
                id="nombre"
                type="text"
                placeholder="Ej: Laptop, Monitor, Impresora"
                value={formData.nombre}
                onChange={(e) =>
                  setFormData({ ...formData, nombre: e.target.value })
                }
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="marca">Marca *</label>
              <input
                id="marca"
                type="text"
                placeholder="Ej: Dell, HP, Lenovo"
                value={formData.marca}
                onChange={(e) =>
                  setFormData({ ...formData, marca: e.target.value })
                }
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="numeroSerie">Número de Serie *</label>
              <input
                id="numeroSerie"
                type="text"
                placeholder="Ej: SN-987654321"
                value={formData.numeroSerie}
                onChange={(e) =>
                  setFormData({ ...formData, numeroSerie: e.target.value })
                }
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="estado">Estado</label>
              <select
                id="estado"
                value={formData.estado}
                onChange={(e) =>
                  setFormData({ ...formData, estado: e.target.value })
                }
              >
                <option value="Operativo">Operativo</option>
                <option value="En Mantenimiento">En Mantenimiento</option>
                <option value="Dañado">Dañado</option>
                <option value="Inactivo">Inactivo</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="descripcion">Descripción</label>
              <textarea
                id="descripcion"
                placeholder="Detalles adicionales sobre el equipo..."
                value={formData.descripcion || ''}
                onChange={(e) =>
                  setFormData({ ...formData, descripcion: e.target.value })
                }
                rows={3}
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-success">
                {editingId ? 'Actualizar' : 'Guardar Equipo'}
              </button>
              <button
                type="button"
                className="btn btn-cancel"
                onClick={handleCancel}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="equipment-list">
        <div className="list-header">
          <h2>Lista de Equipos ({total})</h2>

          <div className="filter-controls">
            <div className="search-box">
              <input
                type="text"
                placeholder="🔍 Buscar por nombre, marca, serie..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search-input"
              />
              {search && (
                <button
                  className="clear-search"
                  onClick={() => setSearch('')}
                  title="Limpiar búsqueda"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="limit-selector">
              <label htmlFor="limit-select">Mostrar:</label>
              <select
                id="limit-select"
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1);
                }}
              >
                <option value={5}>5 por pág.</option>
                <option value={10}>10 por pág.</option>
                <option value={20}>20 por pág.</option>
                <option value={50}>50 por pág.</option>
              </select>
            </div>
          </div>
        </div>

        {loading && (
          <div className="loading">
            <div className="spinner"></div>
            <p>Cargando equipos...</p>
          </div>
        )}

        {!loading && equipos.length === 0 && (
          <div className="no-data">
            <div className="no-data-icon">📋</div>
            <h3>Sin resultados</h3>
            <p>
              {debouncedSearch
                ? `No se encontraron equipos que coincidan con "${debouncedSearch}".`
                : 'No hay equipos registrados actualmente.'}
            </p>
          </div>
        )}

        {!loading && equipos.length > 0 && (
          <>
            <EquipoTable
              equipos={equipos}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />

            <div className="pagination-container">
              <div className="pagination-info">
                Página <strong>{page}</strong> de <strong>{totalPages}</strong> | Total: <strong>{total}</strong> equipos
              </div>

              <div className="pagination-buttons">
                <button
                  className="btn btn-small btn-secondary"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  ◀ Anterior
                </button>

                <div className="page-numbers">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      className={`btn-page ${p === page ? 'active' : ''}`}
                      onClick={() => setPage(p)}
                    >
                      {p}
                    </button>
                  ))}
                </div>

                <button
                  className="btn btn-small btn-secondary"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  Siguiente ▶
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;

