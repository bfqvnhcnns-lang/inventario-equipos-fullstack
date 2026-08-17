import { Equipo } from '../types/equipo';
import './EquipoTable.css';

interface EquipoTableProps {
  equipos: Equipo[];
  onEdit: (equipo: Equipo) => void;
  onDelete: (id: number) => void;
}

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
                  onClick={() => onEdit(equipo)}
                >
                  ✏️ Editar
                </button>
                <button
                  className="btn btn-small btn-delete"
                  onClick={() => onDelete(equipo.id)}
                >
                  🗑️ Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
