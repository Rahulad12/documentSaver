import axiosInstance from "../api";

export interface DocumentRequestTypes {
  title: string;
  description: string;
  documentType: string;
  document: File;
  documentNumber: string;
  documentIssuedAt: Date | null | undefined;
  documentExpiryAt: Date | null | undefined;
  mimetype: string;
}

export type DocumentCreatePayload = FormData;

export const postDocument = (document: DocumentCreatePayload) => {
  return axiosInstance.post("/documents", document, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getAllDocument = (documentAccessKey: string) => {
  return axiosInstance.get("/documents", {
    headers: {
      "x-document-access-key": documentAccessKey,
    },
  });
};

export const getDocumentById = (id: string, documentAccessKey: string) => {
  return axiosInstance.get(`/documents/${id}`, {
    headers: {
      "x-document-access-key": documentAccessKey,
    },
  });
};

export const getDocumentFileAndPreview = async (id: string, side: string) => {
  const res = await axiosInstance.get(`/documents/file?id=${id}&side=${side}`, {
    responseType: "blob",
  });

  return res.data;
};
