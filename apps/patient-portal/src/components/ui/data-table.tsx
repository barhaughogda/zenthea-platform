/* eslint-disable */
import React from 'react';

export const DataTable = (props: any) => {
  const { columns = [], data = [] } = props;
  return (
    <table className="w-full">
      <thead>
        <tr>
          {columns.map((col: any, i: number) => (
            <th key={i}>{col.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row: any, i: number) => (
          <tr key={i}>
            {columns.map((col: any, j: number) => (
              <td key={j}>{typeof col.cell === 'function' ? col.cell({ row: { original: row } }) : row[col.accessorKey]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export type Column<T> = any;
export type FilterOption = any;
