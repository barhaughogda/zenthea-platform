
export const DataTable = (props: any /* eslint-disable-line @typescript-eslint/no-explicit-any -- TODO: fix legacy types */) => {
  const { columns = [], data = [] } = props;
  return (
    <table className="w-full">
      <thead>
        <tr>
          {columns.map((col: any /* eslint-disable-line @typescript-eslint/no-explicit-any -- TODO: fix legacy types */, i: number) => (
            <th key={i}>{col.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row: any /* eslint-disable-line @typescript-eslint/no-explicit-any -- TODO: fix legacy types */, i: number) => (
          <tr key={i}>
            {columns.map((col: any /* eslint-disable-line @typescript-eslint/no-explicit-any -- TODO: fix legacy types */, j: number) => (
              <td key={j}>{typeof col.cell === 'function' ? col.cell({ row: { original: row } }) : row[col.accessorKey]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type Column<T = any /* eslint-disable-line @typescript-eslint/no-explicit-any -- TODO: fix legacy types */> = any /* eslint-disable-line @typescript-eslint/no-explicit-any -- TODO: fix legacy types */;
export type FilterOption = any /* eslint-disable-line @typescript-eslint/no-explicit-any -- TODO: fix legacy types */;
