export function PageWrapper({ title, children }) {
  return (
    <div className="p-8">
      {title && (
        <h1 className="text-3xl font-bold text-text-primary mb-8">{title}</h1>
      )}
      {children}
    </div>
  );
}
