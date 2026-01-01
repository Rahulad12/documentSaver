import {
  useDocumentPreview,
  useGetAllDocuments,
} from "@/apis/hooks/document.hooks";
import type { ColumnType } from "@/types";
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Eye, FileText, Calendar } from "lucide-react";
import CustomTable from "../component/Table";
import dayjs from "dayjs";
import DocumentPreviewDialog from "@/components/DocumentPreview";
import { useState } from "react";
import { KeyVerificationDialog } from "@/components/KeyVerificationDialog";

const ListAddedDocument = () => {
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [showKeyDialog, setShowKeyDialog] = useState(true);
  const [documentAccessKey, setDocumentAccessKey] = useState<string | null>(
    null
  );
  const [isVerifying, setIsVerifying] = useState(false);

  const { data: documents, isLoading } = useGetAllDocuments(
    documentAccessKey || undefined
  );
  const { mutateAsync: preview } = useDocumentPreview();

  const handleKeySubmit = (key: string) => {
    setIsVerifying(true);
    // Simulate verification - the actual validation happens on the backend
    setTimeout(() => {
      setDocumentAccessKey(key);
      setShowKeyDialog(false);
      setIsVerifying(false);
    }, 500);
  };

  const handlePreview = async (doc: any, side: string) => {
    try {
      const blob = await preview({ id: doc._id, side });
      const url = URL.createObjectURL(blob);
      setSelectedDoc(url);
      setMimeType(blob.type);
      setOpen(true);
    } catch (err) {
      console.error("Preview failed", err);
    }
  };

  console.log(mimeType);
  const columns: ColumnType[] = [
    {
      name: "Document Title",
      accessorKey: "title",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <FileText className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-gray-900 text-sm">
              {row.original.title || "-"}
            </span>
            <span className="text-xs text-gray-500">
              ID: {row.original._id?.slice(-8)}
            </span>
          </div>
        </div>
      ),
    },
    {
      name: "Document Type",
      accessorKey: "documentType",
      cell: ({ row }) => (
        <span className="capitalize">
          {row.original.documentType || "-"}
        </span>
      ),
    },
    {
      name: "Document Number",
      accessorKey: "documentNumber",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-mono text-sm font-semibold text-gray-900">
            {row.original.documentNumber || "-"}
          </span>
          <span className="text-xs text-gray-500">Document ID</span>
        </div>
      ),
    },
    {
      name: "Issued At",
      accessorKey: "documentIssuedAt",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {row.original.documentIssuedAt ? (
            <>
              <Calendar className="w-4 h-4 text-green-600" />
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-900">
                  {dayjs(row.original.documentIssuedAt).format("MMM DD, YYYY")}
                </span>
                <span className="text-xs text-gray-500">
                  {dayjs(row.original.documentIssuedAt).format("MMM DD, YYYY")}
                </span>
              </div>
            </>
          ) : (
            <span className="text-gray-400">Not specified</span>
          )}
        </div>
      ),
    },
    {
      name: "Expiry At",
      accessorKey: "documentExpiryAt",
      cell: ({ row }) => {
        const isExpired = row.original.documentExpiryAt &&
          dayjs(row.original.documentExpiryAt).isBefore(dayjs());
        const isExpiringSoon = row.original.documentExpiryAt &&
          dayjs(row.original.documentExpiryAt).diff(dayjs(), 'days') < 30 &&
          !isExpired;

        return (
          <div className="flex items-center gap-2">
            {row.original.documentExpiryAt ? (
              <>
                <Calendar className={`w-4 h-4 ${isExpired ? 'text-red-600' :
                  isExpiringSoon ? 'text-amber-600' :
                    'text-blue-600'
                  }`} />
                <div className="flex flex-col">
                  <span className={`text-sm font-medium ${isExpired ? 'text-red-600' :
                    isExpiringSoon ? 'text-amber-600' :
                      'text-gray-900'
                    }`}>
                    {dayjs(row.original.documentExpiryAt).format("MMM DD, YYYY")}
                  </span>
                  <span className={`text-xs ${isExpired ? 'text-red-500 font-medium' :
                    isExpiringSoon ? 'text-amber-500 font-medium' :
                      'text-gray-500'
                    }`}>
                    {isExpired ? 'Expired' : dayjs(row.original.documentExpiryAt).format("MMM DD, YYYY")}
                  </span>
                </div>
              </>
            ) : (
              <span className="text-gray-400">No expiry</span>
            )}
          </div>
        );
      },
    },
    {
      name: "Front Document",
      accessorKey: "frontPreview",
      cell: ({ row }) => (
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            handlePreview({
              _id: row.original._id,
              title: row.original.title,
              mimeType: row.original.mimeType,
            }, "front");
          }}
          className="gap-2 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-300 transition-colors"
        >
          <Eye className="w-4 h-4" />
          View Front
        </Button>
      ),
    },
    {
      name: "Back Document",
      accessorKey: "backPreview",
      cell: ({ row }) => (
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            handlePreview({
              _id: row.original._id,
              title: row.original.title,
              mimeType: row.original.mimeType,
            }, "back");
          }}
          className="gap-2 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-300 transition-colors"
        >
          <Eye className="w-4 h-4" />
          View Back
        </Button>
      ),
    },
  ];

  return (
    <PageLayout
      title="Saved Documents"
      description="Manage and view all your saved documents"
    >
      <CustomTable
        documents={documents?.data?.data ?? []}
        columns={columns}
        isLoading={isLoading}
      />

      <DocumentPreviewDialog
        title="Document Preview"
        open={open}
        onOpenChange={setOpen}
        previewUrl={selectedDoc}
        mimeType={mimeType}
      />

      <KeyVerificationDialog
        open={showKeyDialog}
        onKeySubmit={handleKeySubmit}
        isLoading={isVerifying}
      />
    </PageLayout>
  );
};

export default ListAddedDocument;