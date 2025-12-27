import { createBrowserRouter, Navigate } from "react-router-dom";
import AuthLayout from "@/components/layout/AuthLayout";
import MainLayout from "@/components/layout/MainLayout";

import RegisterPage from "@/pages/RegisterPage";
import LoginPage from "@/pages/LoginPage";
import HomePage from "@/pages/HomePage";
import ArticleDetailPage from "@/pages/ArticleDetailPage";
import MyArticlePage from "@/pages/MyArticlePage";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import PublicRoute from "@/components/common/PublicRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "article/:id",
            element: <ArticleDetailPage />,
          },
          {
            path: "my-articles",
            element: <MyArticlePage />,
          },
        ],
      },
    ],
  },
  {
    element: <PublicRoute />,
    children: [
      {
        path: "/auth",
        element: <AuthLayout />,
        children: [
          {
            path: "login",
            element: <LoginPage />,
          },
          {
            path: "register",
            element: <RegisterPage />,
          },
        ],
      },
    ],
  },

  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);
