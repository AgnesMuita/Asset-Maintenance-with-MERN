import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Header from "./components/Header";
import { accounts } from "./components/Data";
import Announcements from "./pages/Announcements";
import Assets from "./pages/Assets";
import Cases from "./pages/Cases";
import Events from "./pages/Events";
import KnowledgeArticles from "./pages/KnowledgeArticles";
import Maintenance from "./pages/Maintenance";
import News from "./pages/News";
import Settings from "./pages/Settings";
import Users from "./pages/Users";
import CaseDetails from "./pages/CaseDetails";
import UserDetails from "./pages/UserDetails";
import ArticleDetails from "./pages/ArticleDetails";
import AssetDetails from "./pages/AssetDetails";
import { action as loginAction } from "./pages/Login";
import ProtectedRoute from "./pages/ProtectedRoute";
import Documents from "./pages/Documents";
import { Toaster } from "./components/ui/toaster";
import NotAuthorized from "./pages/NotAuthorized";
import Trash from "./pages/Trash";

const Layout = () => {
  return (
    <div>
      <Header />
      <div className="flex">
        <Navbar accounts={accounts} />
        <Outlet />
        <Toaster />
      </div>
    </div>
  );
};

const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        ),
      },
      {
        path: "/announcements",
        element: (
          <ProtectedRoute>
            <Announcements />
          </ProtectedRoute>
        ),
      },
      {
        path: "/assets",
        element: (
          currentUser.role === "TECHNICIAN" ||
            currentUser.role === "ADMIN" ||
            currentUser.role === "SUPER_ADMIN" ||
            currentUser.role === "DEVELOPER" ?
            <ProtectedRoute>
              <Assets />
            </ProtectedRoute>
            :
            <NotAuthorized />
        ),
      },
      {
        path: "/assets/asset-details/:id",
        element: (
          currentUser.role === "TECHNICIAN" ||
            currentUser.role === "ADMIN" ||
            currentUser.role === "SUPER_ADMIN" ||
            currentUser.role === "DEVELOPER" ?
            <ProtectedRoute>
              <AssetDetails />
            </ProtectedRoute> :
            <NotAuthorized />
        ),
      },
      {
        path: "/cases",
        element: (
          <ProtectedRoute>
            <Cases />
          </ProtectedRoute>
        ),
      },
      {
        path: "/cases/case-details/:id",
        element: (
          <ProtectedRoute>
            <CaseDetails />
          </ProtectedRoute>
        ),
      },
      {
        path: "/events",
        element: (
          <ProtectedRoute>
            <Events />
          </ProtectedRoute>
        ),
      },
      {
        path: "/documents",
        element: (
          <ProtectedRoute>
            <Documents />
          </ProtectedRoute>
        ),
      },
      {
        path: "/knowledgearticles",
        element: (
          <ProtectedRoute>
            <KnowledgeArticles />
          </ProtectedRoute>
        ),
      },
      {
        path: "/knowledgearticles/article-details/:id",
        element: (
          <ProtectedRoute>
            <ArticleDetails />
          </ProtectedRoute>
        ),
      },
      {
        path: "/maintenance",
        element: (
          <ProtectedRoute>
            <Maintenance />
          </ProtectedRoute>
        ),
      },
      {
        path: "/news",
        element: (
          <ProtectedRoute>
            <News />
          </ProtectedRoute>
        ),
      },
      {
        path: "/settings",
        element: (
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        ),
      },
      {
        path: "/trash",
        element: (
          <ProtectedRoute>
            <Trash />
          </ProtectedRoute>
        ),
      },
      {
        path: "/users",
        element: (
          currentUser.role === "TECHNICIAN" ||
            currentUser.role === "ADMIN" ||
            currentUser.role === "SUPER_ADMIN" ||
            currentUser.role === "DEVELOPER" ?
            <ProtectedRoute>
              <Users />
            </ProtectedRoute> :
            <NotAuthorized />
        ),
      },
      {
        path: "/users/user-details/:id",
        element: (
          currentUser.role === "TECHNICIAN" ||
            currentUser.role === "ADMIN" ||
            currentUser.role === "SUPER_ADMIN" ||
            currentUser.role === "DEVELOPER" ?
            <ProtectedRoute>
              <UserDetails />
            </ProtectedRoute> :
            <NotAuthorized />
        ),
      },
    ],
  },
  {
    path: "/signin",
    element: <Login />,
    action: loginAction,
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
