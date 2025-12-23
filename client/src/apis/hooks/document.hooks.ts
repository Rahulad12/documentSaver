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

export const useGetAllDocuments = () => {
  return useQuery({
    queryKey: ["documents"],
    queryFn: async () => {
      return getAllDocument();
    },
    retry: 1,
    enabled: true,
  });
};

export const useGetAllDocumentsById = (documentId: string) => {
  return useQuery({
    queryKey: [documentId],
    queryFn: async () => {
      return getDocumentById(documentId);
    },
    retry: 1,
    enabled: !!documentId,
  });
};

export const useDocumentPreview = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      return getDocumentFileAndPreview(id);
    },
    onError: (error: any) =>
      toast.error(error.response?.data?.message || "Failed to load preview"),
  });
};
