"use client";

import { useEffect, useRef, useState } from 'react';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import dynamic from 'next/dynamic';
const LiveMap = dynamic(() => import('../components/LiveMap'), { ssr: false });

export default function UserDataPage() {
  const [stored, setStored] = useState<any>(null);
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number; timestamp: number; accuracy?: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [refId, setRefId] = useState<string | null>(null);
  const [history, setHistory] = useState<Array<{ id: string | null; latitude: number; longitude: number; accuracy: number | null; time: string; name: string | null }>>([]);
  const watchIdRef = useRef<number | null>(null);

  async function loadHistory() {
    try {
      const url = refId ? `/api/user-location?refId=${encodeURIComponent(refId)}&limit=100` : `/api/user-location?limit=100`;
      const res = await fetch(url, { cache: 'no-store' });
      const json = await res.json();
      if (res.ok && Array.isArray(json.items)) {
        setHistory(json.items);
      }
    } catch {}
  }

  // Load stored user data once, then re-check after a short delay to capture background save
  useEffect(() => {
    try {
      const s = window.localStorage.getItem('userData');
      if (s) {
        const parsed = JSON.parse(s);
        setStored(parsed);
        if (parsed?.id) setRefId(parsed.id);
      }
    } catch {}
    const t = setTimeout(() => {
      try {
        const s2 = window.localStorage.getItem('userData');
        if (s2) {
          const parsed2 = JSON.parse(s2);
          setStored(parsed2);
          if (parsed2?.id) setRefId(parsed2.id);
        }
      } catch {}
    }, 1500);
    return () => clearTimeout(t);
  }, []);

  // Get current location (fresh) on every visit and save
  useEffect(() => {
    if (!('geolocation' in navigator)) {
      setError('Geolocation is not supported by this browser');
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const payload = {
          location: { latitude: pos.coords.latitude, longitude: pos.coords.longitude },
          refId: refId,
          timestamp: pos.timestamp,
          accuracy: pos.coords.accuracy,
          name: `User-${Math.random().toString(36).slice(2,8)}`,
        };
        setCurrentLocation({ 
          latitude: pos.coords.latitude, 
          longitude: pos.coords.longitude, 
          timestamp: pos.timestamp,
          accuracy: pos.coords.accuracy
        });
        try {
          await fetch('/api/user-location', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
          loadHistory();
        } catch (err) {
          console.error('Failed to save location:', err);
        }
      },
      (error) => {
        console.error('Location error:', error);
        setError(`Location access error: ${error.message}`);
      },
      { 
        enableHighAccuracy: true,
        maximumAge: 0, // always request a fresh reading
        timeout: 60000
      }
    );
  }, [refId]);

  // Start a short high-accuracy watch to capture a more precise fix, then save once and stop
  useEffect(() => {
    if (!('geolocation' in navigator)) return;
    let stopped = false;
    // stop any previous watcher
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    const id = navigator.geolocation.watchPosition(
      async (pos) => {
        if (stopped) return;
        // Accept improved precision (<= 25m) or any improvement over current
        const acc = pos.coords.accuracy ?? Infinity;
        const improved = !currentLocation || (typeof currentLocation.accuracy === 'number' ? acc < currentLocation.accuracy : true);
        if (acc <= 25 || improved) {
          const payload = {
            location: { latitude: pos.coords.latitude, longitude: pos.coords.longitude, accuracy: pos.coords.accuracy },
            refId: refId,
            timestamp: pos.timestamp,
            name: `User-${Math.random().toString(36).slice(2,8)}`,
          };
          setCurrentLocation({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            timestamp: pos.timestamp,
            accuracy: pos.coords.accuracy,
          });
          try {
            await fetch('/api/user-location', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload),
            });
            loadHistory();
          } catch {}
          // Stop after first high-quality reading
          if (acc <= 25) {
            navigator.geolocation.clearWatch(id);
            watchIdRef.current = null;
            stopped = true;
          }
        }
      },
      () => {},
      { enableHighAccuracy: true, maximumAge: 0, timeout: 60000 }
    );
    watchIdRef.current = id;
    // Safety stop after 30s
    const t = setTimeout(() => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      stopped = true;
    }, 30000);
    return () => {
      clearTimeout(t);
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, [refId]);

  // Load history initially and when refId appears
  useEffect(() => {
    loadHistory();
  }, [refId]);


  return (
    <>
      <Nav />
      <div className="container" style={{ paddingTop: 24, paddingBottom: 48 }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h1 style={{ 
            marginTop: 0, 
            fontSize: '3rem', 
            fontWeight: 900,
            background: 'linear-gradient(135deg, var(--text), var(--rog-cyan), var(--accent))',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            marginBottom: 16
          }}>ROG Location Hub</h1>
          <p style={{ color: 'var(--muted)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
            Share your current location and access it directly in Google Maps. Simple, secure, and efficient.
          </p>
        </div>
        
        {/* Stats Overview */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 32 }}>
          <div className="stats-card">
            <div className="stats-number">{currentLocation ? 'ACTIVE' : 'PENDING'}</div>
            <div style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Location Status</div>
          </div>
          <div className="stats-card">
            <div className="stats-number">{currentLocation ? '±' + currentLocation.accuracy?.toFixed(0) + 'm' : 'N/A'}</div>
            <div style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Accuracy</div>
          </div>
          <div className="stats-card">
            <div className="stats-number">{stored?.name || 'Guest'}</div>
            <div style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Player ID</div>
          </div>
          <div className="stats-card">
            <div className="stats-number">{stored?.createdAt ? new Date(stored.createdAt).toLocaleDateString() : 'N/A'}</div>
            <div style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Registration</div>
          </div>
        </div>
        {!stored ? (
          <div className="card" style={{ padding: 32, textAlign: 'center', marginBottom: 32 }}>
            <h3 style={{ color: 'var(--accent)', marginTop: 0, marginBottom: 16 }}>🎯 Location Access Required</h3>
            <div className="muted" style={{ fontSize: '1.1rem' }}>Enable location services to unlock your personalized ROG gaming experience.</div>
            <div style={{ marginTop: 20 }}>
              <button className="cta" onClick={() => window.location.reload()}>Enable Location</button>
            </div>
          </div>
        ) : (
          <div className="card" style={{ padding: 32, marginBottom: 32 }}>
            <h3 style={{ marginTop: 0, marginBottom: 24, color: 'var(--rog-cyan)' }}>🏠 Base Location Profile</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20 }}>
              <div>
                <div style={{ fontWeight: 'bold', color: 'var(--accent)', marginBottom: 8 }}>Coordinates</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>Lat: {stored.location?.latitude?.toFixed(6)}</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>Lng: {stored.location?.longitude?.toFixed(6)}</div>
              </div>
              {stored.createdAt && (
                <div>
                  <div style={{ fontWeight: 'bold', color: 'var(--accent)', marginBottom: 8 }}>Registration</div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>{new Date(stored.createdAt).toLocaleString()}</div>
                </div>
              )}
              {stored.ip && (
                <div>
                  <div style={{ fontWeight: 'bold', color: 'var(--accent)', marginBottom: 8 }}>Network</div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--muted)', fontFamily: 'monospace' }}>{stored.ip}</div>
                </div>
              )}
              {stored.id && (
                <div>
                  <div style={{ fontWeight: 'bold', color: 'var(--accent)', marginBottom: 8 }}>Session ID</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--muted)', fontFamily: 'monospace', wordBreak: 'break-all' }}>{stored.id}</div>
                </div>
              )}
            </div>
            {stored.userAgent && (
              <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid var(--border)' }}>
                <div style={{ fontWeight: 'bold', color: 'var(--accent)', marginBottom: 8 }}>Device Information</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--muted)', lineHeight: 1.5 }}>{stored.userAgent}</div>
              </div>
            )}
          </div>
        )}

        <div className="card" style={{ padding: 32, marginBottom: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h3 style={{ margin: 0, color: 'var(--rog-cyan)' }}>
              📍 Current Location
            </h3>
            {!currentLocation && (
              <button className="cta" onClick={() => window.location.reload()}>Get Location</button>
            )}
          </div>
          {currentLocation ? (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 24 }}>
                <div>
                  <div style={{ fontWeight: 'bold', color: 'var(--accent)', marginBottom: 8 }}>Coordinates</div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--muted)', fontFamily: 'monospace' }}>Lat: {currentLocation.latitude.toFixed(6)}</div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--muted)', fontFamily: 'monospace' }}>Lng: {currentLocation.longitude.toFixed(6)}</div>
                </div>
                <div>
                  <div style={{ fontWeight: 'bold', color: 'var(--accent)', marginBottom: 8 }}>Accuracy</div>
                  <div style={{ 
                    fontSize: '0.9rem', 
                    color: currentLocation.accuracy && currentLocation.accuracy <= 10 ? '#10b981' : currentLocation.accuracy && currentLocation.accuracy <= 50 ? 'var(--accent)' : 'var(--muted)',
                    fontWeight: 600
                  }}>
                    ±{currentLocation.accuracy ? currentLocation.accuracy.toFixed(0) : '?'}m
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>
                    {currentLocation.accuracy && currentLocation.accuracy <= 10 ? 'Excellent' : 
                     currentLocation.accuracy && currentLocation.accuracy <= 50 ? 'Good' : 'Fair'}
                  </div>
                </div>
                <div>
                  <div style={{ fontWeight: 'bold', color: 'var(--accent)', marginBottom: 8 }}>Captured</div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>{new Date(currentLocation.timestamp).toLocaleString()}</div>
                </div>
              </div>
              
              {/* Google Maps Integration */}
              <div className="maps-buttons" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
                <a 
                  href={`https://www.google.com/maps?q=${currentLocation.latitude},${currentLocation.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    background: 'linear-gradient(135deg, var(--accent), var(--accent-glow))',
                    color: 'white',
                    padding: '12px 24px',
                    borderRadius: '50px',
                    textDecoration: 'none',
                    fontWeight: 600,
                    textAlign: 'center',
                    display: 'block',
                    transition: 'all 0.3s ease',
                    fontSize: '0.9rem',
                    boxShadow: '0 4px 12px rgba(230, 0, 18, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(230, 0, 18, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(230, 0, 18, 0.3)';
                  }}
                >
                  🗺️ Open in Google Maps
                </a>
                
                <a 
                  href={`https://www.google.com/maps/dir/?api=1&destination=${currentLocation.latitude},${currentLocation.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    background: 'transparent',
                    border: '2px solid var(--accent)',
                    color: 'var(--accent)',
                    padding: '12px 24px',
                    borderRadius: '50px',
                    textDecoration: 'none',
                    fontWeight: 600,
                    textAlign: 'center',
                    display: 'block',
                    transition: 'all 0.3s ease',
                    fontSize: '0.9rem'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--accent-light)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  🧭 Get Directions
                </a>
                
                <button
                  onClick={() => {
                    const coords = `${currentLocation.latitude.toFixed(6)}, ${currentLocation.longitude.toFixed(6)}`;
                    if (navigator.share) {
                      navigator.share({
                        title: 'My Current Location',
                        text: `I'm currently at: ${coords}`,
                        url: `https://www.google.com/maps?q=${currentLocation.latitude},${currentLocation.longitude}`
                      });
                    } else {
                      navigator.clipboard?.writeText(coords);
                      alert('Coordinates copied to clipboard!');
                    }
                  }}
                  style={{
                    background: 'transparent',
                    border: '2px solid var(--rog-cyan)',
                    color: 'var(--rog-cyan)',
                    padding: '12px 24px',
                    borderRadius: '50px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    fontSize: '0.9rem'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(220, 38, 38, 0.1)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  📋 Share Location
                </button>
              </div>
              <div style={{ border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
                <LiveMap
                  position={{ latitude: currentLocation.latitude, longitude: currentLocation.longitude }}
                  markers={[]}
                />
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: 40 }}>
              <div style={{ fontSize: '3rem', marginBottom: 16 }}>📍</div>
              <div className="muted" style={{ fontSize: '1.1rem' }}>Click "Get Location" to capture your current position</div>
            </div>
          )}
        </div>
        {error && (
          <div className="card" style={{ padding: 32, marginBottom: 32 }}>
            <div style={{ 
              background: 'rgba(230, 0, 18, 0.1)',
              border: '1px solid rgba(230, 0, 18, 0.3)',
              borderRadius: '8px',
              padding: '12px 16px',
              color: 'var(--accent)'
            }}>
              ⚠️ {error}
            </div>
          </div>
        )}

        {/* Location history table */}
        <div className="card" style={{ padding: 24, marginBottom: 48 }}>
          <h3 style={{ marginTop: 0, marginBottom: 16, color: 'var(--rog-cyan)' }}>🗂️ Captured Coordinates</h3>
          {history.length === 0 ? (
            <div className="muted">No locations captured yet.</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
                    <th style={{ padding: '8px 12px' }}>Time</th>
                    <th style={{ padding: '8px 12px' }}>Latitude</th>
                    <th style={{ padding: '8px 12px' }}>Longitude</th>
                    <th style={{ padding: '8px 12px' }}>Accuracy</th>
                    <th style={{ padding: '8px 12px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((h) => (
                    <tr key={h.id || `${h.time}-${h.latitude}-${h.longitude}`} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '8px 12px', whiteSpace: 'nowrap' }}>{new Date(h.time).toLocaleString()}</td>
                      <td style={{ padding: '8px 12px', fontFamily: 'monospace' }}>{h.latitude.toFixed(6)}</td>
                      <td style={{ padding: '8px 12px', fontFamily: 'monospace' }}>{h.longitude.toFixed(6)}</td>
                      <td style={{ padding: '8px 12px' }}>{h.accuracy ? `±${Math.round(h.accuracy)}m` : '—'}</td>
                      <td style={{ padding: '8px 12px' }}>
                        <a href={`https://www.google.com/maps?q=${h.latitude},${h.longitude}`} target="_blank" rel="noopener noreferrer">Open</a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}




