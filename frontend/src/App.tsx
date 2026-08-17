import { useState, useEffect } from 'react';
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

  // Cargar lista de equipos
  const fetchEquipos = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await equipoService.getAll();
      setEquipos(data);
    } catch (err: any) {
      const msg = err.response?.data?.error || err.message || 'Error al conectar con el servidor';
      setError(`No se pudieron cargar los equipos: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipos();
  }, []);

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
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'Error al guardar el equipo';
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
      } catch (err: any) {
        const errorMessage = err.response?.data?.error || 'Error al eliminar el equipo';
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
      {success && <div className="success-message" style={{ padding: '1rem', backgroundColor: '#d4edda', color: '#155724', borderRadius: '4px', marginBottom: '1rem' }}>{success}</div>}

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
            Agregar Nuevo Equipo
          </button>
        )}
      </div>

      {showForm && (
        <div className="form-container">
          <h2>{editingId ? ' Editar Equipo' : ' Crear Nuevo Equipo'}</h2>
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
                value={formData.descripcion}
                onChange={(e) =>
                  setFormData({ ...formData, descripcion: e.target.value })
                }
                rows={3}
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-success">
                {editingId ? 'Actualizar' : ' Guardar Equipo'}
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
        <h2>Lista de Equipos ({equipos.length})</h2>
        {loading && <p className="loading">Cargando equipos...</p>}
        {!loading && equipos.length === 0 && (
          <p className="no-data">No hay equipos registrados actualmente.</p>
        )}
        {!loading && equipos.length > 0 && (
          <EquipoTable
            equipos={equipos}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
}

export default App;
