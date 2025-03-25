import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import './Table.css'

export default function Table({ columns, data, openMenuIndex, pageSize = 15 }) {
  const table = useReactTable({
    data,
    columns,
    pageCount: Math.ceil(data.length / pageSize),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: pageSize,
      },
    },
  })

  return (
    <div className="custom-table-wrapper">
      <table className="custom-table">
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
        {table.getRowModel().rows.map(row => (
            <tr
              key={row.id}
              className={
                openMenuIndex !== null
                  ? row.index === openMenuIndex
                    ? 'active-row'
                    : 'no-hover'
                  : ''
              }
            >
            {row.getVisibleCells().map(cell => (
              <td key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}

        {/* Add empty rows to pad remaining space */}
        {Array.from({
          length: table.getState().pagination.pageSize - table.getRowModel().rows.length,
        }).map((_, i) => (
          <tr key={`empty-${i}`} className="placeholder-row">
            {table.getAllLeafColumns().map((col, colIndex) => (
              <td key={`empty-cell-${i}-${colIndex}`}>&nbsp;</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>

      <div className="table-footer">
        <div className="pagination">
          <button
            className="pagination-btn"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <FiChevronLeft />
          </button>

          <span className="page-info">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </span>

          <button
            className="pagination-btn"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <FiChevronRight />
          </button>
        </div>
      </div>
    </div>
  )
}
