import Image, { StaticImageData } from 'next/image';

export type Product = {
  id: string;
  name: string;
  price: number;
  image: string | StaticImageData;
  gpu: string;
  cpu: string;
};

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="card" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Gaming Badge */}
      <div style={{
        position: 'absolute',
        top: 12,
        right: 12,
        background: 'linear-gradient(135deg, var(--accent), var(--accent-glow))',
        color: 'white',
        padding: '4px 12px',
        borderRadius: '20px',
        fontSize: '0.75rem',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        zIndex: 10,
        boxShadow: '0 4px 12px rgba(230, 0, 18, 0.4)'
      }}>
        ROG
      </div>
      
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <Image 
          src={product.image} 
          alt={product.name} 
          width={600} 
          height={400}
          style={{ transition: 'transform 0.3s ease' }}
        />
        {/* Gradient overlay */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '60px',
          background: 'linear-gradient(transparent, rgba(0, 0, 0, 0.7))',
          pointerEvents: 'none'
        }} />
      </div>
      
      <div className="card-body" style={{ padding: '24px' }}>
        <div style={{ marginBottom: 16 }}>
          <h3 style={{ 
            margin: '0 0 8px 0', 
            fontSize: '1.25rem',
            fontWeight: 700,
            color: 'var(--text)',
            lineHeight: 1.2
          }}>{product.name}</h3>
          
          {/* Specs */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
            <div style={{
              background: 'rgba(0, 212, 255, 0.1)',
              color: 'var(--rog-cyan)',
              padding: '4px 8px',
              borderRadius: '6px',
              fontSize: '0.8rem',
              fontWeight: 600
            }}>
              {product.cpu}
            </div>
            <div style={{
              background: 'rgba(139, 92, 246, 0.1)',
              color: 'var(--rog-purple)',
              padding: '4px 8px',
              borderRadius: '6px',
              fontSize: '0.8rem',
              fontWeight: 600
            }}>
              {product.gpu}
            </div>
          </div>
        </div>
        
        {/* Price and Action */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: 4 }}>Starting at</div>
            <span className="price" style={{ fontSize: '1.5rem' }}>${product.price.toLocaleString()}</span>
          </div>
          
          <button style={{
            background: 'linear-gradient(135deg, var(--accent), var(--accent-glow))',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '20px',
            fontSize: '0.85rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(230, 0, 18, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
          >
            Configure
          </button>
        </div>
        
        {/* Gaming Performance Indicator */}
        <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>Gaming Performance</span>
            <div style={{ display: 'flex', gap: 2 }}>
              {[...Array(5)].map((_, i) => (
                <div key={i} style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: i < 4 ? 'var(--accent)' : 'rgba(255, 255, 255, 0.2)'
                }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


