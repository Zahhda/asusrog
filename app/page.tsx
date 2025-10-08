"use client";

import Link from 'next/link';
import Image from 'next/image';
import Nav from './components/Nav';
import Footer from './components/Footer';
import { products } from './data/products';
import ProductCard from './components/ProductCard';
import heroG16 from '../strix g16.jpg';

export default function HomePage() {
  const featured = products.slice(0, 4);
  return (
    <>
      <Nav />
      <div className="container hero" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: 48, alignItems: 'center' }}>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ 
            color: 'var(--rog-cyan)', 
            fontWeight: 800, 
            fontSize: '0.9rem', 
            textTransform: 'uppercase', 
            letterSpacing: '2px', 
            marginBottom: 16,
            textShadow: '0 0 10px rgba(0, 212, 255, 0.5)'
          }}>REPUBLIC OF GAMERS</div>
          <h1 style={{ fontSize: '4rem', lineHeight: 1.1, margin: '0 0 24px', fontWeight: 900 }}>UNLEASH YOUR
            <span style={{ display: 'block', background: 'linear-gradient(135deg, var(--accent), var(--rog-cyan))', backgroundClip: 'text', WebkitBackgroundClip: 'text', color: 'transparent' }}>GAMING POWER</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: 0, marginBottom: 32, fontSize: '1.3rem', lineHeight: 1.6 }}>
            Experience next-level gaming with ROG laptops featuring cutting-edge cooling, 
            ultra-fast displays, and the raw power to dominate every battlefield.
          </p>
          <div style={{ display: 'flex', gap: 16, marginBottom: 40 }}>
            <Link className="cta" href="/shop">Explore Arsenal</Link>
            <Link 
              className="cta" 
              href="/user-data" 
              style={{ 
                background: 'transparent', 
                border: '2px solid var(--accent)', 
                color: 'var(--accent)',
                boxShadow: 'none'
              }}
            >Analytics Dashboard</Link>
          </div>
          
          {/* Gaming Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginTop: 40 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: 'var(--accent)', fontSize: '2rem', fontWeight: 900, textShadow: '0 0 10px rgba(230, 0, 18, 0.5)' }}>240Hz</div>
              <div style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Refresh Rate</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: 'var(--rog-cyan)', fontSize: '2rem', fontWeight: 900, textShadow: '0 0 10px rgba(0, 212, 255, 0.5)' }}>RTX 40</div>
              <div style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Series GPUs</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: 'var(--rog-purple)', fontSize: '2rem', fontWeight: 900, textShadow: '0 0 10px rgba(139, 92, 246, 0.5)' }}>5ms</div>
              <div style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Response Time</div>
            </div>
          </div>
        </div>
        <div className="card" style={{ overflow: 'hidden', position: 'relative' }}>
          <div style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            background: 'linear-gradient(45deg, rgba(230, 0, 18, 0.1), rgba(0, 212, 255, 0.1))',
            zIndex: 1
          }}></div>
          <Image 
            src={heroG16} 
            alt="ROG Strix G16 - Ultimate Gaming Machine" 
            width={1000} 
            height={700} 
            style={{ width: '100%', height: 'auto', transition: 'transform 0.5s ease' }} 
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          />
        </div>
      </div>
      
      {/* Testimonials Section */}
      <div style={{ background: 'rgba(30, 30, 35, 0.5)', padding: '80px 0', marginBottom: 80 }}>
        <div className="container">
          <h2 style={{ 
            textAlign: 'center', 
            fontSize: '2.5rem', 
            fontWeight: 900, 
            marginBottom: 16,
            background: 'linear-gradient(135deg, var(--text), var(--rog-cyan))',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent'
          }}>TRUSTED BY CHAMPIONS</h2>
          <p style={{ textAlign: 'center', color: 'var(--muted)', marginBottom: 48, fontSize: '1.1rem' }}>Professional esports players and content creators choose ROG</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 32 }}>
            <div className="card" style={{ padding: 32, textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: 20 }}>⚡</div>
              <blockquote style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: 20, lineHeight: 1.6, fontStyle: 'italic' }}>
                "The RTX 4090 in my ROG laptop delivers unmatched performance. 240Hz display gives me the competitive edge I need."
              </blockquote>
              <div style={{ color: 'var(--accent)', fontWeight: 700 }}>- Alex "ProGamer" Chen</div>
              <div style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Professional Esports Player</div>
            </div>
            
            <div className="card" style={{ padding: 32, textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: 20 }}>🎯</div>
              <blockquote style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: 20, lineHeight: 1.6, fontStyle: 'italic' }}>
                "ROG's cooling system is incredible. I can stream and game simultaneously without any thermal throttling."
              </blockquote>
              <div style={{ color: 'var(--rog-cyan)', fontWeight: 700 }}>- Sarah "StreamQueen" Rodriguez</div>
              <div style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Content Creator</div>
            </div>
            
            <div className="card" style={{ padding: 32, textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: 20 }}>🏆</div>
              <blockquote style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: 20, lineHeight: 1.6, fontStyle: 'italic' }}>
                "Build quality is exceptional. This machine handles everything I throw at it - from AAA games to 4K video editing."
              </blockquote>
              <div style={{ color: 'var(--rog-purple)', fontWeight: 700 }}>- Marcus "TechReviewer" Johnson</div>
              <div style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Tech Influencer</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Featured Products */}
      <div className="container" style={{ paddingBottom: 80 }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ 
            fontSize: '2.5rem', 
            fontWeight: 900, 
            marginBottom: 16,
            background: 'linear-gradient(135deg, var(--accent), var(--rog-cyan))',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent'
          }}>FEATURED ARSENAL</h2>
          <p style={{ color: 'var(--muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>Discover our most powerful gaming machines, engineered for victory</p>
        </div>
        <div className="grid">
          {featured.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
        
        {/* Call to Action */}
        <div style={{ textAlign: 'center', marginTop: 48 }}>
          <Link className="cta" href="/shop" style={{ fontSize: '1.2rem', padding: '20px 40px' }}>VIEW ALL MODELS</Link>
        </div>
      </div>
      
      {/* Technology Showcase */}
      <div style={{ background: 'rgba(30, 30, 35, 0.3)', padding: '80px 0' }}>
        <div className="container">
          <h2 style={{ 
            textAlign: 'center', 
            fontSize: '2.5rem', 
            fontWeight: 900, 
            marginBottom: 48,
            background: 'linear-gradient(135deg, var(--text), var(--accent))',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent'
          }}>CUTTING-EDGE TECHNOLOGY</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 40 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                width: 80, 
                height: 80, 
                background: 'linear-gradient(135deg, var(--accent), var(--accent-glow))',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                fontSize: '2rem'
              }}>❄️</div>
              <h3 style={{ color: 'var(--accent)', marginBottom: 12 }}>ROG Cooling</h3>
              <p style={{ color: 'var(--muted)', lineHeight: 1.6 }}>Advanced liquid metal thermal compound and intelligent cooling for sustained peak performance</p>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                width: 80, 
                height: 80, 
                background: 'linear-gradient(135deg, var(--rog-cyan), #00a8cc)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                fontSize: '2rem'
              }}>🖥️</div>
              <h3 style={{ color: 'var(--rog-cyan)', marginBottom: 12 }}>ROG Nebula Display</h3>
              <p style={{ color: 'var(--muted)', lineHeight: 1.6 }}>Ultra-fast refresh rates up to 240Hz with Adaptive-Sync for tear-free gaming</p>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                width: 80, 
                height: 80, 
                background: 'linear-gradient(135deg, var(--rog-purple), #7c3aed)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                fontSize: '2rem'
              }}>⌨️</div>
              <h3 style={{ color: 'var(--rog-purple)', marginBottom: 12 }}>ROG Keystone</h3>
              <p style={{ color: 'var(--muted)', lineHeight: 1.6 }}>Personalized gaming profiles and secure storage with physical keystone authentication</p>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                width: 80, 
                height: 80, 
                background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                fontSize: '2rem'
              }}>🔊</div>
              <h3 style={{ color: '#fbbf24', marginBottom: 12 }}>Smart Audio</h3>
              <p style={{ color: 'var(--muted)', lineHeight: 1.6 }}>Dolby Atmos and Hi-Res certified audio with AI-powered noise cancellation</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}


