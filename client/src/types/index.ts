export interface DocumentItem {
  _id: string;
  title: string;
  documentType: string;
  documentNumber: string;
  documentIssuedAt?: string;
  documentExpiryAt?: string;
  fileUrl: string;
  createdAt: string;
}
export interface ApisResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
export interface ColumnType {
  name: string;
  accessorKey?: string;
  sortable?: boolean;
  cell?: (row: any) => React.ReactNode;
}
export interface DocumentTableColumn extends ColumnType {
  title: string;
  documentType: string;
  documentNumber: string;
  documentIssuedAt?: string;
  documentExpiryAt?: string;
  action: string;
}

export interface UserProfile {
  user: {
    name: string;
    email: string;
  };
}
