import { useParams, useNavigate } from "react-router-dom";
import { AreaForm } from "../components/areas/AreaForm";
import { mockAreas } from "../utils/mocks/areas.mock";

export function EditarAreaPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const areaExistente = mockAreas.find(a => a.id === parseInt(id));

  const handleSubmit = (formData) => {
    console.log("Actualizar área:", id, formData);
  };

  if (!areaExistente) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-text-secondary">Área no encontrada</p>
      </div>
    );
  }

  return <AreaForm initialData={areaExistente} onSubmit={handleSubmit} />;
}
