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
import AdminLogin from "@/pages/admin/AdminLogin";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import NotFound from "@/pages/not-found";

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
        <Route path="/admin/login" component={AdminLogin} />
        <Route path="/admin" component={AdminDashboard} />
        <Route path="/admin/:rest*" component={AdminDashboard} />
        <Route component={PublicRouter} />
      </Switch>
    </WouterRouter>
  );
}

export default App;
