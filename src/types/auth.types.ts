export interface User {
  id: number;
  documentId: string;
  username: string;
  email: string;
  provider: string;
  confirmed: boolean;
  blocked: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
}

export interface LoginResponse {
  jwt: string;
  user: User;
}

export interface ApiError {
  error: {
    status: number;
    name: string;
    message: string;
  };
}