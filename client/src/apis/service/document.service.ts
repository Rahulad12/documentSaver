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

export const getAllDocument = () => {
  return axiosInstance.get("/documents");
};

export const getDocumentById = (id: string) => {
  return axiosInstance.get(`/documents/${id}`);
};

export const getDocumentFileAndPreview = async (id: string) => {
  const res = await axiosInstance.get(`/documents/file/${id}`, {
    responseType: "blob",
  });

  return res.data;
};
