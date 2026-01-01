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
import { FileText } from "lucide-react";
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
}: Props) => {
  const navigate = useNavigate();
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
        <Table className="min-w-full">
          <TableHeader className="bg-linear-to-r from-gray-50 to-gray-100/50">
            <TableRow className="border-b border-gray-200 hover:bg-transparent sticky top-0 z-10">
              {columns.map((col, index) => (
                <TableHead
                  key={col.accessorKey || index}
                  className="text-primary-foreground bg-primary sticky top-0"
                >
                  {col.name}
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
                    hover:bg-linear-to-r hover:from-indigo-50/50 hover:to-blue-50/50 
                    transition-all duration-200 cursor-pointer
                    ${index % 2 === 0 ? 'bg-gray-50/30' : 'bg-white'}
                    ${onRowClick ? 'cursor-pointer' : ''}
                  `}
                  onClick={() => onRowClick && onRowClick(doc)}
                >
                  {columns.map((col, colIndex) => {
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
  );
};

export default CustomTable;
