// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import type { ColumnType, DocumentItem } from "@/types";
// import { Loader2 } from "lucide-react";

// type Props = {
//   documents: DocumentItem[];
//   columns: ColumnType[];
//   isLoading?: boolean;
// };

// const CustomTable = ({ documents, columns, isLoading = false }: Props) => {
//   return (
//     <div className="rounded-md border">
//       <Table>
//         <TableHeader className="bg-primary">
//           <TableRow>
//             {columns.map((col, index) => (
//               <TableHead
//                 key={col.accessorKey || index}
//                 className={`${col.name === "Preview Document" ? "text-right" : ""} text-primary-foreground`}
//               >
//                 {col.name}
//               </TableHead>
//             ))}
//           </TableRow>
//         </TableHeader>
//         <TableBody>

//           {isLoading && (
//             <TableRow>
//               <TableCell colSpan={columns.length} className="text-center">
//                 <div className="flex justify-center items-center w-full h-full">
//                   <Loader2 className="animate-spin text-primary text-center" />
//                 </div>
//               </TableCell>
//             </TableRow>
//           )}
//           {
//             documents.length > 0 ? (documents?.map((doc) => (
//               <TableRow key={doc._id}>
//                 {columns.map((col, index) => (
//                   <TableCell
//                     key={col.accessorKey || index}
//                     className={col.name === "Preview Document" ? "text-right" : ""}
//                   >
//                     {col.cell?.({ row: { original: doc } })}
//                   </TableCell>
//                 ))}
//               </TableRow>
//             ))) : (<TableRow>
//               <TableCell colSpan={columns.length} className="text-center">
//                 No documents found.
//               </TableCell>
//             </TableRow>)
//           }
//         </TableBody>
//       </Table>
//     </div>
//   );
// };

// export default CustomTable;

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ColumnType, DocumentItem } from "@/types";
import { FileText, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

type Props = {
  documents: DocumentItem[];
  columns: ColumnType[];
  isLoading?: boolean;
  onRowClick?: (document: DocumentItem) => void;
  sortable?: boolean;
};

const CustomTable = ({
  documents,
  columns,
  isLoading = false,
  onRowClick,
  sortable = false
}: Props) => {
  const navigate = useNavigate();
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (columnId: string) => {
    if (!sortable) return;

    if (sortColumn === columnId) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnId);
      setSortDirection('asc');
    }
  };

  const getDocumentTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      citizenship: "bg-blue-100 text-blue-800 hover:bg-blue-100",
      nid: "bg-green-100 text-green-800 hover:bg-green-100",
      passport: "bg-purple-100 text-purple-800 hover:bg-purple-100",
      license: "bg-amber-100 text-amber-800 hover:bg-amber-100",
      academic: "bg-indigo-100 text-indigo-800 hover:bg-indigo-100",
      other: "bg-gray-100 text-gray-800 hover:bg-gray-100",
    };
    return colors[type] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="rounded-xl border border-gray-200 shadow-sm overflow-hidden bg-white">
      {/* Table Header Stats */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border-b bg-gradient-to-r from-gray-50 to-gray-100">
        <div>
          <h3 className="text-lg font-semibold text-primary">Documents</h3>
          <p className="text-sm text-gray-600 mt-1">
            {documents.length} {documents.length === 1 ? 'document' : 'documents'} total
          </p>
        </div>
        {/* <div className="flex items-center gap-2 mt-3 sm:mt-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search documents..."
              className="pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition w-full sm:w-auto"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            className="h-9 gap-2"
          >
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div> */}
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto overflow-y-auto max-h-[calc(80vh-12rem)]">
        <Table className="min-w-full">
          <TableHeader className="bg-gradient-to-r from-gray-50 to-gray-100/50">
            <TableRow className="border-b border-gray-200 hover:bg-transparent">
              {columns.map((col, index) => (
                <TableHead
                  key={col.accessorKey || index}
                  className={`fixed top-0 py-4 px-6 font-semibold bg-primary text-primary-foreground text-sm uppercase tracking-wider ${col.name === "Preview Document" ? "text-right" : ""
                    } ${sortable && col.sortable ? 'cursor-pointer select-none' : ''}`}
                  onClick={() => col.sortable && handleSort(col.accessorKey || '')}
                >
                  <div className={`flex items-center gap-1 ${col.name === "Preview Document" ? 'justify-end' : ''
                    }`}>
                    {col.name}
                    {sortable && col.sortable && sortColumn === col.accessorKey && (
                      sortDirection === 'asc' ?
                        <ChevronUp className="h-4 w-4 ml-1" /> :
                        <ChevronDown className="h-4 w-4 ml-1" />
                    )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100">
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="py-16 text-center"
                >
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="relative">
                      <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
                      <FileText className="h-6 w-6 text-indigo-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                    </div>
                    <div className="text-center">
                      <p className="text-gray-900 font-medium">Loading Documents</p>
                      <p className="text-gray-500 text-sm mt-1">Please wait while we fetch your documents</p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : documents.length > 0 ? (
              documents.map((doc, index) => (
                <TableRow
                  key={doc._id || index}
                  className={`
                    hover:bg-gradient-to-r hover:from-indigo-50/50 hover:to-blue-50/50 
                    transition-all duration-200 cursor-pointer
                    ${index % 2 === 0 ? 'bg-gray-50/30' : 'bg-white'}
                    ${onRowClick ? 'cursor-pointer' : ''}
                  `}
                  onClick={() => onRowClick && onRowClick(doc)}
                >
                  {columns.map((col, colIndex) => {
                    // Special handling for document type column
                    if (col.accessorKey === 'documentType') {
                      return (
                        <TableCell
                          key={col.accessorKey || colIndex}
                          className="py-4 px-6"
                        >
                          <Badge
                            variant="secondary"
                            className={`${getDocumentTypeColor(doc.documentType)} text-xs font-medium px-3 py-1`}
                          >
                            {doc.documentType}
                          </Badge>
                        </TableCell>
                      );
                    }

                    // Special handling for date columns
                    const isDateColumn = col.accessorKey?.includes('date') ||
                      col.accessorKey?.includes('Date') ||
                      col.accessorKey?.includes('At');

                    if (isDateColumn && doc[col.accessorKey as keyof DocumentItem]) {
                      const dateValue = doc[col.accessorKey as keyof DocumentItem];
                      return (
                        <TableCell
                          key={col.accessorKey || colIndex}
                          className="py-4 px-6"
                        >
                          <div className="flex flex-col">
                            <span className="text-gray-900 font-medium">
                              {new Date(dateValue as string).toLocaleDateString()}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(dateValue as string).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                        </TableCell>
                      );
                    }

                    // Default cell rendering
                    return (
                      <TableCell
                        key={col.accessorKey || colIndex}
                        className={`py-4 px-6 ${col.name === "Preview Document" ? "text-right" : ""
                          }`}
                      >
                        {col.cell ? (
                          col.cell({ row: { original: doc } })
                        ) : (
                          <span className="text-gray-900">
                            {doc[col.accessorKey as keyof DocumentItem] as string}
                          </span>
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="py-16 text-center"
                >
                  <div className="flex flex-col items-center justify-center gap-4 max-w-md mx-auto">
                    <div className="p-4 bg-gray-100 rounded-full">
                      <FileText className="h-12 w-12 text-gray-400" />
                    </div>
                    <div className="text-center">
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        No Documents Found
                      </h4>
                      <p className="text-gray-500 mb-6">
                        There are no documents to display. Try adding a new document or adjust your filters.
                      </p>
                      <Button
                        variant="outline"
                        className="gap-2"
                        onClick={() => navigate("/documents/add")}
                      >
                        <FileText className="h-4 w-4" />
                        Add Your First Document
                      </Button>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Table Footer
      {documents.length > 0 && !isLoading && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border-t bg-gray-50">
          <div className="text-sm text-gray-600 mb-2 sm:mb-0">
            Showing <span className="font-semibold text-gray-900">{documents.length}</span> of{' '}
            <span className="font-semibold text-gray-900">{documents.length}</span> documents
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={true}
              className="h-8 w-8 p-0"
            >
              ←
            </Button>
            <span className="text-sm text-gray-700 px-2">Page 1 of 1</span>
            <Button
              variant="outline"
              size="sm"
              disabled={true}
              className="h-8 w-8 p-0"
            >
              →
            </Button>
            <select className="ml-2 text-sm border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none">
              <option value="10">10 per page</option>
              <option value="25">25 per page</option>
              <option value="50">50 per page</option>
            </select>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default CustomTable;
