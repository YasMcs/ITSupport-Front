import { AreaForm } from "../components/areas/AreaForm";

export function NuevaAreaPage() {
  const handleSubmit = (formData) => {
    console.log("Nueva área:", formData);
    // Aquí iría la lógica para guardar el área
  };

  return <AreaForm onSubmit={handleSubmit} />;
}
