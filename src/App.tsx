import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CategoryGrid } from './components/CategoryGrid';
import { Footer } from './components/Footer';
import { Policies } from './components/Policies';
import { About } from './components/About';
import { Services } from './components/Services';
import { Products } from './components/Products';
import { CategoryDetail } from './components/CategoryDetail';
import { ProductDetail } from './components/ProductDetail';
import { CartPage } from './components/CartPage';
import { Checkout } from './components/Checkout';
import { PaymentSuccess } from './components/PaymentSuccess';
import { PaymentFailure } from './components/PaymentFailure';
import { PaymentPending } from './components/PaymentPending';
import { MyOrders } from './components/MyOrders';
import { AdminDashboard } from './components/Admin/AdminDashboard';
import { OrdersManagement } from './components/Admin/OrdersManagement';
import { Analytics } from './components/Admin/Analytics';
import { Login } from './components/Auth/Login';
import { Register } from './components/Auth/Register';


const Home = () => (
  <>
    <Hero />
    <CategoryGrid />
  </>
);

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <div className="app">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/products" element={<Products />} />
            <Route path="/category/:categoryName" element={<CategoryDetail />} />
            <Route path="/product/:productId" element={<ProductDetail />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/payment/success" element={<PaymentSuccess />} />
            <Route path="/payment/failure" element={<PaymentFailure />} />
            <Route path="/payment/pending" element={<PaymentPending />} />
            <Route path="/orders" element={<MyOrders />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/orders" element={<OrdersManagement />} />
            <Route path="/admin/analytics" element={<Analytics />} />
            <Route path="/policies" element={<Policies />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
          <Footer />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
