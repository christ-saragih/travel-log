import { apiClient } from "@/lib/axios";
import {
  type ApiResponse,
  type Article,
  type Category,
  type CreateArticlePayload,
  type UpdateArticlePayload,
  type ArticleFilters,
  type CreateCommentPayload,
  type UpdateCommentPayload,
  type Comment,
} from "@/types/api.types";

export const articleService = {
  getCategories: async () => {
    const response =
      await apiClient.get<ApiResponse<Category[]>>("/categories");
    return response.data;
  },

  getArticles: async (filters?: ArticleFilters) => {
    const params: Record<string, string | number> = {
      "populate[comments][populate][user]": "*",
      "populate[user]": "*",
      "populate[category]": "*",
      "pagination[page]": filters?.page || 1,
      "pagination[pageSize]": filters?.pageSize || 10,
    };

    if (filters?.search) {
      params["filters[title][$containsi]"] = filters.search; // Using containsi for search
    }

    if (filters?.category) {
      params["filters[category][name][$eqi]"] = filters.category;
    }

    if (filters?.username) {
      params["filters[user][username][$eqi]"] = filters.username;
    }

    const response = await apiClient.get<ApiResponse<Article[]>>("/articles", {
      params,
    });
    return response.data;
  },

  getArticle: async (documentId: string) => {
    const params = {
      "populate[comments][populate][user]": "*",
      "populate[user]": "*",
      "populate[category]": "*",
    };
    const response = await apiClient.get<ApiResponse<Article>>(
      `/articles/${documentId}`,
      { params },
    );
    return response.data;
  },

  createArticle: async (payload: CreateArticlePayload) => {
    const response = await apiClient.post<ApiResponse<Article>>(
      "/articles",
      payload,
    );
    return response.data;
  },

  updateArticle: async (documentId: string, payload: UpdateArticlePayload) => {
    const response = await apiClient.put<ApiResponse<Article>>(
      `/articles/${documentId}`,
      payload,
    );
    return response.data;
  },

  deleteArticle: async (documentId: string) => {
    const response = await apiClient.delete<ApiResponse<Article>>(
      `/articles/${documentId}`,
    );
    return response.data;
  },

  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append("files", file);

    const response = await apiClient.post<unknown[]>("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const first = response.data[0];
    if (!first || typeof first !== "object") {
      throw new Error("Upload failed");
    }
    return first;
  },

  createComment: async (payload: CreateCommentPayload) => {
    const response = await apiClient.post<ApiResponse<Comment>>(
      "/comments",
      payload,
    );
    return response.data;
  },

  updateComment: async (documentId: string, payload: UpdateCommentPayload) => {
    const response = await apiClient.put<ApiResponse<Comment>>(
      `/comments/${documentId}`,
      payload,
    );
    return response.data;
  },

  deleteComment: async (documentId: string) => {
    const response = await apiClient.delete<ApiResponse<Comment>>(
      `/comments/${documentId}`,
    );
    return response.data;
  },
};
