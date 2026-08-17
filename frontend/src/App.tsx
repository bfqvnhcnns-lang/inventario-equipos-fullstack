import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

interface Equipo {
  id: number;
  nombre: string;
  marca: string;
  estado: string;
  numeroSerie: string;
  descripcion?: string;
  fechaCreacion: string;
  fechaActualizacion: string;
}

interface FormData {
  nombre: string;
  marca: string;
  estado: string;
  numeroSerie: string;
  descripcion: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

function App() {
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    marca: '',
    estado: 'Operativo',
    numeroSerie: '',
    descripcion: '',
  });

  // Fetch all equipment
  const fetchEquipos = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/equipos`);
      setEquipos(response.data);
    } catch (err) {
      setError('Error al cargar los equipos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipos();
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.nombre || !formData.marca || !formData.numeroSerie) {
      setError('Por favor complete los campos requeridos');
      return;
    }

    try {
      if (editingId) {
        // Update equipment
        await axios.put(`${API_URL}/equipos/${editingId}`, formData);
        setEditingId(null);
      } else {
        // Create new equipment
        await axios.post(`${API_URL}/equipos`, formData);
      }
      
      // Reset form and refresh list
      setFormData({
        nombre: '',
        marca: '',
        estado: 'Operativo',
        numeroSerie: '',
        descripcion: '',
      });
      setShowForm(false);
      fetchEquipos();
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Error al guardar el equipo';
      setError(errorMessage);
    }
  };

  // Handle delete
  const handleDelete = async (id: number) => {
    if (confirm('¿Está seguro de que desea eliminar este equipo?')) {
      try {
        await axios.delete(`${API_URL}/equipos/${id}`);
        fetchEquipos();
      } catch (err) {
        setError('Error al eliminar el equipo');
      }
    }
  };

  // Handle edit
  const handleEdit = (equipo: Equipo) => {
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

  // Handle cancel
  const handleCancel = () => {
    setFormData({
      nombre: '',
      marca: '',
      estado: 'Operativo',
      numeroSerie: '',
      descripcion: '',
    });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="container">
      <header className="header">
        <h1>📦 Gestión de Inventario de Equipos</h1>
        <p>Sistema de administración de equipos de cómputo</p>
      </header>

      {error && <div className="error-message">{error}</div>}

      <div className="button-group">
        {!showForm && (
          <button
            className="btn btn-primary"
            onClick={() => setShowForm(true)}
          >
            ➕ Agregar Nuevo Equipo
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
                placeholder="Ej: Laptop, Monitor, Teclado"
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
                placeholder="Número único de serie"
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
                placeholder="Detalles adicionales del equipo"
                value={formData.descripcion}
                onChange={(e) =>
                  setFormData({ ...formData, descripcion: e.target.value })
                }
                rows={3}
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-success">
                {editingId ? '💾 Actualizar' : '➕ Crear'}
              </button>
              <button
                type="button"
                className="btn btn-cancel"
                onClick={handleCancel}
              >
                ❌ Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="equipment-list">
        <h2>Lista de Equipos ({equipos.length})</h2>
        {loading && <p className="loading">Cargando...</p>}
        {!loading && equipos.length === 0 && (
          <p className="no-data">No hay equipos registrados</p>
        )}
        {!loading && equipos.length > 0 && (
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Marca</th>
                  <th>Número de Serie</th>
                  <th>Estado</th>
                  <th>Descripción</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {equipos.map((equipo) => (
                  <tr key={equipo.id}>
                    <td>{equipo.id}</td>
                    <td>{equipo.nombre}</td>
                    <td>{equipo.marca}</td>
                    <td>{equipo.numeroSerie}</td>
                    <td>
                      <span
                        className={`status status-${equipo.estado
                          .toLowerCase()
                          .replace(/\s+/g, '-')}`}
                      >
                        {equipo.estado}
                      </span>
                    </td>
                    <td>{equipo.descripcion || '-'}</td>
                    <td className="actions">
                      <button
                        className="btn btn-small btn-edit"
                        onClick={() => handleEdit(equipo)}
                      >
                        ✏️ Editar
                      </button>
                      <button
                        className="btn btn-small btn-delete"
                        onClick={() => handleDelete(equipo.id)}
                      >
                        🗑️ Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
