import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { Members } from "./pages/Members";
import { Blog } from "./pages/Blog";
import { BlogDetail } from "./pages/BlogDetail";
import { Foundation } from "./pages/Foundation";
import { Developers } from "./pages/Developers";
import { Login } from "./pages/Login";
import { AdminDashboard } from "./pages/AdminDashboard";
import { NotFound } from "./pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "about", Component: About },
      { path: "members", Component: Members },
      { path: "blog", Component: Blog },
      { path: "blog/:id", Component: BlogDetail },
      { path: "foundation", Component: Foundation },
      { path: "developers", Component: Developers },
      { path: "login", Component: Login },
      { path: "admin", Component: AdminDashboard },
      { path: "*", Component: NotFound },
    ],
  },
]);
