import { useParams } from "react-router-dom";
import { SucursalForm } from "../components/sucursales/SucursalForm";
import { mockSucursales } from "../utils/mocks/sucursales.mock";

export function EditarSucursalPage() {
  const { id } = useParams();
  
  // Buscar la sucursal por ID, si no existe usar mockSucursales[0] como datos de prueba
  const sucursalData = id 
    ? mockSucursales.find(s => s.id === parseInt(id)) 
    : mockSucursales[0];
  
  return <SucursalForm initialData={sucursalData} />;
}
