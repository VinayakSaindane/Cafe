import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Menu from "@/pages/Menu";
import PickGo from "@/pages/PickGo";
import Bookings from "@/pages/Bookings";
import Reviews from "@/pages/Reviews";
import Blog from "@/pages/Blog";
import Contact from "@/pages/Contact";
import OrderOnline from "@/pages/OrderOnline";
import NotFound from "@/pages/not-found";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

function Router() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex-grow">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/about" component={About} />
          <Route path="/menu" component={Menu} />
          <Route path="/pick-go" component={PickGo} />
          <Route path="/bookings" component={Bookings} />
          <Route path="/reviews" component={Reviews} />
          <Route path="/blog" component={Blog} />
          <Route path="/contact" component={Contact} />
          <Route path="/order-online" component={OrderOnline} />
          <Route component={NotFound} />
        </Switch>
      </div>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
