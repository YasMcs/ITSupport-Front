export function Table({ columns, data }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-dark-purple-700 overflow-hidden">
      <table className="min-w-full divide-y divide-dark-purple-700">
        <thead className="bg-dark-purple-800">
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
        <tbody className="bg-dark-purple-800/50 divide-y divide-dark-purple-700">
          {data.map((row, i) => (
            <tr key={row.id ?? i} className="hover:bg-dark-purple-700/50 transition-colors duration-150">
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
