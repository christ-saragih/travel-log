import { create } from "zustand";
import { type Article, type MetaPagination } from "@/types/api.types";
import { articleService } from "@/services/article.service";

interface ArticleState {
  articles: Article[];
  currentArticle: Article | null;
  pagination: MetaPagination | null;
  isLoading: boolean;
  error: string | null;

  fetchArticles: (
    page?: number,
    search?: string,
    category?: string,
    username?: string,
  ) => Promise<void>;
  fetchArticleById: (documentId: string) => Promise<void>;
  createArticle: (data: {
    title: string;
    description: string;
    cover_image_url: string;
    category?: number | null;
  }) => Promise<void>;
  updateArticle: (
    documentId: string,
    data: {
      title: string;
      description: string;
      cover_image_url: string;
      category?: number | null;
    },
  ) => Promise<void>;
  deleteArticle: (documentId: string) => Promise<void>;
  addComment: (articleId: number, content: string) => Promise<void>;
  editComment: (documentId: string, content: string) => Promise<void>;
  deleteComment: (documentId: string) => Promise<void>;
  resetCurrentArticle: () => void;
}

type ErrorWithResponse = {
  response?: { data?: { error?: { message?: string } } };
};

export const useArticleStore = create<ArticleState>((set, get) => ({
  articles: [],
  currentArticle: null,
  pagination: null,
  isLoading: false,
  error: null,

  fetchArticles: async (
    page = 1,
    search = "",
    category = "",
    username = "",
  ) => {
    set({ isLoading: true, error: null });
    try {
      const response = await articleService.getArticles({
        page,
        search,
        category,
        username,
      });
      set({
        articles: response.data,
        pagination: response.meta?.pagination || null,
        isLoading: false,
      });
    } catch (error: unknown) {
      const message =
        (error as ErrorWithResponse)?.response?.data?.error?.message ||
        "Failed to fetch articles";
      set({
        error: message,
        isLoading: false,
      });
    }
  },

  fetchArticleById: async (documentId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await articleService.getArticle(documentId);
      set({ currentArticle: response.data, isLoading: false });
    } catch (error: unknown) {
      const message =
        (error as ErrorWithResponse)?.response?.data?.error?.message ||
        "Failed to fetch article";
      set({
        error: message,
        isLoading: false,
      });
    }
  },

  createArticle: async (data) => {
    set({ isLoading: true, error: null });
    try {
      await articleService.createArticle({ data });
      await get().fetchArticles();
      set({ isLoading: false });
    } catch (error: unknown) {
      const message =
        (error as ErrorWithResponse)?.response?.data?.error?.message ||
        "Failed to create article";
      set({
        error: message,
        isLoading: false,
      });
      throw error;
    }
  },

  updateArticle: async (documentId, data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await articleService.updateArticle(documentId, { data });
      set({ currentArticle: response.data, isLoading: false });
      await get().fetchArticles();
    } catch (error: unknown) {
      const message =
        (error as ErrorWithResponse)?.response?.data?.error?.message ||
        "Failed to update article";
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  deleteArticle: async (documentId: string) => {
    set({ isLoading: true, error: null });
    try {
      await articleService.deleteArticle(documentId);
      // Remove from local state immediately for better UX
      set((state) => ({
        articles: state.articles.filter((a) => a.documentId !== documentId),
        isLoading: false,
      }));
    } catch (error: unknown) {
      const message =
        (error as ErrorWithResponse)?.response?.data?.error?.message ||
        "Failed to delete article";
      set({
        error: message,
        isLoading: false,
      });
      throw error;
    }
  },

  addComment: async (articleId: number, content: string) => {
    try {
      await articleService.createComment({
        data: { content, article: articleId },
      });
      const current = get().currentArticle;
      if (current) {
        await get().fetchArticleById(current.documentId);
      }
    } catch (error: unknown) {
      const message =
        (error as ErrorWithResponse)?.response?.data?.error?.message ||
        "Failed to add comment";
      throw new Error(message);
    }
  },

  editComment: async (documentId: string, content: string) => {
    try {
      await articleService.updateComment(documentId, {
        data: { content },
      });
      const current = get().currentArticle;
      if (current) {
        await get().fetchArticleById(current.documentId);
      }
    } catch (error: unknown) {
      const message =
        (error as ErrorWithResponse)?.response?.data?.error?.message ||
        "Failed to update comment";
      throw new Error(message);
    }
  },

  deleteComment: async (documentId: string) => {
    try {
      await articleService.deleteComment(documentId);
      const current = get().currentArticle;
      if (current) {
        await get().fetchArticleById(current.documentId);
      }
    } catch (error: unknown) {
      const message =
        (error as ErrorWithResponse)?.response?.data?.error?.message ||
        "Failed to delete comment";
      throw new Error(message);
    }
  },

  resetCurrentArticle: () => set({ currentArticle: null }),
}));
