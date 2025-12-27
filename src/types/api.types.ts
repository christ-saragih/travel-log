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
}

export interface Category {
  id: number;
  documentId: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface Comment {
  id: number;
  documentId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  user?: User;
}

export interface Article {
  id: number;
  documentId: string;
  title: string;
  description: string;
  cover_image_url: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  user?: User;
  category?: Category | null;
  comments?: Comment[];
}

export interface MetaPagination {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

export interface ApiResponse<T> {
  data: T;
  meta?: {
    pagination: MetaPagination;
  };
}

export interface ArticleFilters {
  search?: string;
  category?: string;
  username?: string;
  page?: number;
  pageSize?: number;
}

export interface CreateArticlePayload {
  data: {
    title: string;
    description: string;
    cover_image_url: string;
    category?: number | null;
  };
}

export interface UpdateArticlePayload {
  data: {
    title?: string;
    description?: string;
    cover_image_url?: string;
    category?: number | null;
  };
}

export interface CreateCommentPayload {
  data: {
    content: string;
    article: number;
  };
}

export interface UpdateCommentPayload {
  data: {
    content: string;
  };
}
