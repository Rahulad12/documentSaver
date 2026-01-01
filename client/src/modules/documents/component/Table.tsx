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
  sortable = false,
}: Props) => {
  const navigate = useNavigate();

  const getDocumentTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      citizenship: "bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200",
      nid: "bg-green-100 text-green-800 hover:bg-green-100 border-green-200",
      passport: "bg-purple-100 text-purple-800 hover:bg-purple-100 border-purple-200",
      license: "bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200",
      academic: "bg-indigo-100 text-indigo-800 hover:bg-indigo-100 border-indigo-200",
      other: "bg-gray-100 text-gray-800 hover:bg-gray-100 border-gray-200",
    };
    return colors[type] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  return (
    <div className="rounded-xl border border-gray-200 shadow-lg overflow-hidden bg-white">
      {/* Scrollable Table Container */}
      <div className="overflow-auto max-h-[calc(100vh-20rem)] relative">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow className="hover:bg-transparent border-none">
              {columns.map((col, index) => (
                <TableHead
                  key={col.accessorKey || index}
                  className={`sticky top-0 z-20 bg-primary py-4 px-6 font-semibold text-white text-sm uppercase tracking-wider whitespace-nowrap border-b-2 shadow-sm ${col.name === "Preview Document" || col.name === "Front Document" || col.name === "Back Document"
                    ? "text-center"
                    : "text-left"
                    } ${sortable && col.sortable ? 'cursor-pointer select-none hover:bg-indigo-700' : ''}`}
                >
                  <div className={`flex items-center gap-2 ${col.name === "Preview Document" || col.name === "Front Document" || col.name === "Back Document"
                    ? 'justify-center'
                    : 'justify-start'
                    }`}>
                    {col.name}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 bg-white">
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="py-20 text-center"
                >
                  <div className="flex flex-col items-center justify-center gap-4">
                    <div className="relative">
                      <div className="h-16 w-16 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
                      <FileText className="h-7 w-7 text-indigo-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                    </div>
                    <div className="text-center">
                      <p className="text-gray-900 font-semibold text-lg">Loading Documents</p>
                      <p className="text-gray-500 text-sm mt-1">Please wait while we fetch your documents...</p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : documents.length > 0 ? (
              documents.map((doc, index) => (
                <TableRow
                  key={doc._id || index}
                  className={`
                    bg-linear-to-br hover:from-indigo-50/50 hover:to-blue-50/50 
                    transition-all duration-200 
                    ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}
                    ${onRowClick ? 'cursor-pointer' : ''}
                    border-b border-gray-100 last:border-none
                  `}
                  onClick={() => onRowClick && onRowClick(doc)}
                >
                  {columns.map((col, colIndex) => {
                    // Special handling for document type column
                    if (col.accessorKey === 'documentType') {
                      return (
                        <TableCell
                          key={col.accessorKey || colIndex}
                          className="py-5 px-6"
                        >
                          <Badge
                            variant="secondary"
                            className={`${getDocumentTypeColor(doc.documentType)} text-xs font-semibold px-3 py-1.5 border`}
                          >
                            {doc.documentType.toUpperCase()}
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
                          className="py-5 px-6"
                        >
                          <div className="flex flex-col">
                            <span className="text-gray-900 font-medium text-sm">
                              {new Date(dateValue as string).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
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

                    // Special handling for action buttons (preview columns)
                    if (col.name === "Front Document" || col.name === "Back Document" || col.name === "Preview Document") {
                      return (
                        <TableCell
                          key={col.accessorKey || colIndex}
                          className="py-5 px-6 text-center"
                        >
                          {col.cell ? col.cell({ row: { original: doc } }) : null}
                        </TableCell>
                      );
                    }

                    // Default cell rendering
                    return (
                      <TableCell
                        key={col.accessorKey || colIndex}
                        className="py-5 px-6"
                      >
                        {col.cell ? (
                          col.cell({ row: { original: doc } })
                        ) : (
                          <span className="text-gray-900 font-medium text-sm">
                            {doc[col.accessorKey as keyof DocumentItem] as string || '-'}
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
                  className="py-20 text-center"
                >
                  <div className="flex flex-col items-center justify-center gap-5 max-w-md mx-auto">
                    <div className="p-5 bg-linear-to-br from-indigo-50 to-blue-50 rounded-2xl shadow-sm">
                      <FileText className="h-16 w-16 text-indigo-400" />
                    </div>
                    <div className="text-center">
                      <h4 className="text-xl font-bold text-gray-900 mb-2">
                        No Documents Found
                      </h4>
                      <p className="text-gray-500 mb-6 text-sm leading-relaxed">
                        You haven't added any documents yet. Start by uploading your first document to keep track of important files.
                      </p>
                      <Button
                        className="gap-2 shadow-md hover:shadow-lg transition-shadow"
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

      {/* Table Footer with Summary */}
      {documents.length > 0 && !isLoading && (
        <div className="flex items-center justify-between p-4 border-t bg-gray-50">
          <div className="text-sm text-gray-600">
            Total: <span className="font-semibold text-gray-900">{documents.length}</span> document{documents.length !== 1 ? 's' : ''}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomTable;