import {
  useDocumentPreview,
  useGetAllDocuments,
} from "@/apis/hooks/document.hooks";
import type { ColumnType } from "@/types";
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import CustomTable from "../component/Table";
import dayjs from "dayjs";
import DocumentPreviewDialog from "@/components/DocumentPreview";
import { useState } from "react";


const ListAddedDocument = () => {
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const { data: documents, isLoading } = useGetAllDocuments();
  const { mutateAsync: preview } = useDocumentPreview();

  const handlePreview = async (doc: any) => {
    console.log(doc);
    try {
      const blob = await preview(doc._id);
      console.log(blob);
      const url = URL.createObjectURL(blob);
      console.log(url);
      setSelectedDoc(url);
      setMimeType(doc.mimeType || doc.mimetype);
      setOpen(true);
    } catch (err) {
      console.error("Preview failed", err);
    }
  };


  const columns: ColumnType[] = [
    {
      name: "Title",
      accessorKey: "title",
      cell: ({ row }) => (
        <span className="capitalize">
          {row.original.title || "-"}
        </span>
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
        <span className="capitalize">
          {row.original.documentNumber || "-"}
        </span>
      ),
    },
    {
      name: "Issued At",
      accessorKey: "documentIssuedAt",
      cell: ({ row }) => (
        <span>
          {row.original.documentIssuedAt
            ? dayjs(row.original.documentIssuedAt).format("YYYY-MM-DD")
            : "-"}
        </span>
      ),
    },
    {
      name: "Expiry At",
      accessorKey: "documentExpiryAt",
      cell: ({ row }) => (
        <span>
          {row.original.documentExpiryAt
            ? dayjs(row.original.documentExpiryAt).format("YYYY-MM-DD")
            : "-"}
        </span>
      ),
    },
    {
      name: "Preview Document",
      accessorKey: "preview",
      cell: ({ row }) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            handlePreview({
              _id: row.original._id,
              title: row.original.title,
              mimeType: row.original.mimeType,
            })
          }
        >
          <Eye className="w-4 h-4 mr-1" />
          View
        </Button>
      ),
    },
  ];

  return (
    <PageLayout
      title="Saved Documents"
      description="List of all saved documents"
    >
      <CustomTable
        documents={documents?.data?.data ?? []}
        columns={columns}
        isLoading={isLoading}
      />

      <DocumentPreviewDialog
        title="Preview Document"
        open={open}
        onOpenChange={setOpen}
        previewUrl={selectedDoc}
        mimeType={mimeType}
      />
    </PageLayout>
  );
};

export default ListAddedDocument;
