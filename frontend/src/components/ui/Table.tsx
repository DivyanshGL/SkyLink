import React from 'react';

export const Table: React.FC<{children: React.ReactNode, className?: string}> = ({ children, className = '' }) => (
  <div className={`w-full overflow-auto rounded-lg border border-gray-200 ${className}`}>
    <table className="w-full caption-bottom text-sm">{children}</table>
  </div>
);

export const TableHeader: React.FC<{children: React.ReactNode, className?: string}> = ({ children, className = '' }) => (
  <thead className={`bg-gray-50/50 border-b border-gray-200 ${className}`}>{children}</thead>
);

export const TableBody: React.FC<{children: React.ReactNode, className?: string}> = ({ children, className = '' }) => (
  <tbody className={`divide-y divide-gray-200 bg-white ${className}`}>{children}</tbody>
);

export const TableRow: React.FC<{children: React.ReactNode, className?: string}> = ({ children, className = '' }) => (
  <tr className={`transition-colors hover:bg-gray-50/50 data-[state=selected]:bg-gray-50 ${className}`}>{children}</tr>
);

export const TableHead: React.FC<{children: React.ReactNode, className?: string}> = ({ children, className = '' }) => (
  <th className={`h-12 px-4 text-left align-middle font-medium text-gray-500 [&:has([role=checkbox])]:pr-0 ${className}`}>{children}</th>
);

export const TableCell: React.FC<{children: React.ReactNode, className?: string}> = ({ children, className = '' }) => (
  <td className={`p-4 align-middle [&:has([role=checkbox])]:pr-0 ${className}`}>{children}</td>
);
