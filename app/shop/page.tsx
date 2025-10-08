import Nav from '../components/Nav';
import Footer from '../components/Footer';
import { products } from '../data/products';
import ProductCard from '../components/ProductCard';

export const metadata = { title: 'Shop – ASUS Gaming Laptops' };

export default function ShopPage() {
  return (
    <>
      <Nav />
      <div className="container" style={{ paddingTop: 24, paddingBottom: 48 }}>
        <h1 style={{ marginTop: 0 }}>Shop</h1>
        <div className="grid">
          {products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
      <Footer />
    </>
  );
}


