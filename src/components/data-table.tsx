import type { ReactNode } from "react";

interface Column<T> {
  header: ReactNode;
  cell: (row: T) => ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
}

export function DataTable<T>({ columns, data }: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted text-left">
            {columns.map((col, i) => (
              <th
                key={i}
                className="px-2 py-2 md:px-4 md:py-3 font-medium text-muted-foreground"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className="border-b border-border last:border-b-0">
              {columns.map((col, j) => (
                <td key={j} className="px-2 py-2 md:px-4 md:py-3">
                  {col.cell(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
