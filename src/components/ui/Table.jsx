export function Table({ columns, data }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.045] backdrop-blur-[22px] overflow-x-auto">
      <table className="min-w-full divide-y divide-white/[0.06]">
        <thead className="bg-white/[0.05]">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.06] bg-white/[0.03]">
          {data.map((row, i) => (
            <tr key={row.id ?? i} className="transition-colors duration-150 hover:bg-white/[0.055]">
              {columns.map((col) => (
                <td key={col.key} className="px-6 py-4 text-sm text-text-primary">
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
