import { Equipo } from '../types/equipo';
import './EquipoTable.css';

// Props que el componente EquipoTable recibe del componente padre
interface EquipoTableProps {
  equipos: Equipo[]; // Lista de equipos a mostrar
  onEdit: (equipo: Equipo) => void; // Función para editar un equipo
  onDelete: (id: number) => void; // Función para eliminar un equipo
}

/**
 * Componente que renderiza una tabla con la lista de equipos
 * Es un componente "presentacional" que solo se encarga de mostrar datos
 * No tiene estado propio, recibe todo desde el padre (App.tsx)
 */
export const EquipoTable: React.FC<EquipoTableProps> = ({
  equipos,
  onEdit,
  onDelete,
}) => {
  return (
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
          {/* Mapea cada equipo de la lista a una fila de tabla */}
          {equipos.map((equipo) => (
            <tr key={equipo.id}>
              <td>{equipo.id}</td>
              <td>{equipo.nombre}</td>
              <td>{equipo.marca}</td>
              <td>{equipo.numeroSerie}</td>
              <td>
                {/* Aplica una clase CSS dinámica según el estado del equipo */}
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
                {/* Botón de editar - llama a la función onEdit pasada como prop */}
                <button
                  className="btn btn-small btn-edit"
                  onClick={() => onEdit(equipo)}
                >
                    Editar
                </button>
                {/* Botón de eliminar - llama a la función onDelete pasada como prop */}
                <button
                  className="btn btn-small btn-delete"
                  onClick={() => onDelete(equipo.id)}
                >
                   Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
