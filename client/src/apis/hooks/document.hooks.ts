import { useMutation, useQuery } from "@tanstack/react-query";
import {
  postDocument,
  getAllDocument,
  getDocumentById,
  type DocumentCreatePayload,
  getDocumentFileAndPreview,
} from "../service/document.service";
import toast from "react-hot-toast";

export const UseSaveDocument = () => {
  return useMutation({
    mutationFn: async (document: DocumentCreatePayload) => {
      return postDocument(document);
    },
    onSuccess: (data: any) => toast.success(data.data.message),
  });
};

export const useGetAllDocuments = (documentAccessKey?: string) => {
  return useQuery({
    queryKey: ["documents", documentAccessKey],
    queryFn: async () => {
      if (!documentAccessKey) {
        throw new Error("Document access key is required");
      }
      return getAllDocument(documentAccessKey);
    },
    retry: 1,
    enabled: !!documentAccessKey,
  });
};

export const useGetAllDocumentsById = (
  documentId: string,
  documentAccessKey?: string
) => {
  return useQuery({
    queryKey: [documentId, documentAccessKey],
    queryFn: async () => {
      if (!documentAccessKey) {
        throw new Error("Document access key is required");
      }
      return getDocumentById(documentId, documentAccessKey);
    },
    retry: 1,
    enabled: !!documentId && !!documentAccessKey,
  });
};

export const useDocumentPreview = () => {
  return useMutation({
    mutationFn: async ({ id, side }: { id: string; side: string }) => {
      return getDocumentFileAndPreview(id, side);
    },
    onError: (error: any) =>
      toast.error(error.response?.data?.message || "Failed to load preview"),
  });
};

