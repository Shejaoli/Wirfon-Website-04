import { lazy, Suspense } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Academy from "@/pages/Academy";
import Consultancy from "@/pages/Consultancy";
import Blog from "@/pages/Blog";
import BlogPostPage from "@/pages/BlogPostPage";
import FAQ from "@/pages/FAQ";
import Gallery from "@/pages/Gallery";
import NotFound from "@/pages/not-found";

const AdminLogin = lazy(() => import("@/pages/admin/AdminLogin"));
const AdminDashboard = lazy(() => import("@/pages/admin/AdminDashboard"));

function AdminFallback() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "#f0f2f5" }}>
      <div style={{ width: 36, height: 36, border: "3px solid #0199ef", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
    </div>
  );
}

function PublicRouter() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/academy" component={Academy} />
        <Route path="/consultancy" component={Consultancy} />
        <Route path="/blog" component={Blog} />
        <Route path="/blog/:slug" component={BlogPostPage} />
        <Route path="/gallery" component={Gallery} />
        <Route path="/faq" component={FAQ} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  return (
    <WouterRouter base={base}>
      <Switch>
        <Route path="/admin/login">
          <Suspense fallback={<AdminFallback />}>
            <AdminLogin />
          </Suspense>
        </Route>
        <Route path="/admin">
          <Suspense fallback={<AdminFallback />}>
            <AdminDashboard />
          </Suspense>
        </Route>
        <Route path="/admin/:rest*">
          <Suspense fallback={<AdminFallback />}>
            <AdminDashboard />
          </Suspense>
        </Route>
        <Route component={PublicRouter} />
      </Switch>
    </WouterRouter>
  );
}

export default App;
