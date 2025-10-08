import Image from 'next/image';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import g14 from '../../g14 strix.jpg';
import zephyrus from '../../zephirus.jpg';
import strixG15 from '../../strix g15.jpg';
import strixG16 from '../../strix g16.jpg';

export const metadata = {
  title: 'ROG Zephyrus – Product Preview',
  description: 'Explore the ROG Zephyrus with gallery, specs, and highlights.',
};

export default function ZephyrusPage() {
  const gallery = [
    { src: zephyrus, alt: 'ROG Zephyrus – hero' },
    { src: g14, alt: 'ROG Zephyrus G14 – angle' },
    { src: strixG16, alt: 'ROG Strix G16 – display' },
    { src: strixG15, alt: 'ROG Strix G15 – design' },
    // SVGs from public/models for completeness
    { src: '/models/ROG-Zephyrus-G16-2024.svg', alt: 'ROG Zephyrus G16 (2024) – SVG' },
    { src: '/models/ROG-Zephyrus-Duo-16.svg', alt: 'ROG Zephyrus Duo 16 – SVG' },
  ];

  const specs = [
    { label: 'CPU', value: 'AMD Ryzen 9 / Intel Core Ultra' },
    { label: 'GPU', value: 'NVIDIA GeForce RTX 40 Series' },
    { label: 'Display', value: 'QHD+ 240Hz, 16:10, Nebula Display' },
    { label: 'Memory', value: 'Up to 32GB LPDDR5X' },
    { label: 'Storage', value: 'Up to 2TB PCIe 4.0 SSD' },
    { label: 'Weight', value: 'From 1.65 kg' },
  ];

  return (
    <>
      <Nav />
      <div className="container" style={{ paddingTop: 16, paddingBottom: 48 }}>
        <h1 style={{ margin: 0 }}>ROG Zephyrus</h1>
        <p className="muted" style={{ marginTop: 6 }}>Sleek. Powerful. Ultra-portable gaming without compromise.</p>

        {/* Mobile-first media gallery */}
        <div
          className="card"
          style={{ marginTop: 16, overflow: 'hidden' }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '100%',
            }}
          >
            <Image
              src={gallery[0].src}
              alt={gallery[0].alt}
              width={1600}
              height={1000}
              style={{ width: '100%', height: 'auto', display: 'block' }}
              priority
            />
          </div>
        </div>

        {/* Horizontal scroll thumbnails on mobile */}
        <div style={{ marginTop: 12 }}>
          <div style={{ display: 'flex', gap: 12, overflowX: 'auto', WebkitOverflowScrolling: 'touch', paddingBottom: 6 }}>
          {gallery.map((item, i) => (
            <div key={i} className="card" style={{ minWidth: 180 }}>
              <Image
                src={item.src}
                alt={item.alt}
                width={600}
                height={400}
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </div>
          ))}
          </div>
        </div>

        {/* Details section */}
        <div
          className="card"
          style={{ marginTop: 20, padding: 16 }}
        >
          <h2 style={{ marginTop: 0, marginBottom: 8 }}>Highlights</h2>
          <ul style={{ display: 'grid', gap: 8, paddingLeft: 18, listStyle: 'disc' }}>
            <li>Precision CNC chassis with premium finish</li>
            <li>Advanced cooling with liquid metal and tri-fan design</li>
            <li>Immersive audio with Dolby Atmos</li>
            <li>Long-lasting battery with fast charging</li>
          </ul>

          <h3 style={{ marginBottom: 8, marginTop: 16 }}>Core Specifications</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 8 }}>
            {specs.map(s => (
              <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                <span className="muted">{s.label}</span>
                <span style={{ textAlign: 'right' }}>{s.value}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 16 }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--accent)' }}>$1,999</div>
            <button>Buy Now</button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}


