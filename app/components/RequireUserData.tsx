"use client";

import { useEffect, useRef, useState } from 'react';

type UserData = {
  location: { latitude: number; longitude: number };
  id?: string;
  createdAt?: string;
  userAgent?: string | null;
  ip?: string | null;
  name?: string;
};

export default function RequireUserData({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [hasData, setHasData] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? window.localStorage.getItem('userData') : null;
    setHasData(!!stored);
    setLoading(false);
  }, []);

  if (loading) return null;
  return <>
    {children}
    {!hasData && (
      <InlinePopup onComplete={(data) => {
        window.localStorage.setItem('userData', JSON.stringify(data));
        setHasData(true);
      }} onError={setError} error={error} />
    )}
  </>;
}

function InlinePopup({ onComplete, onError, error }: {
  onComplete: (data: UserData) => void;
  onError: (msg: string | null) => void;
  error: string | null;
}) {
  const [coords, setCoords] = useState<{ latitude: number; longitude: number; accuracy?: number; timestamp?: number } | null>(null);
  const savedClientRef = useRef(false);

  // Start watching location immediately and clean up
  useEffect(() => {
    if (!('geolocation' in navigator)) {
      onError('Location required');
      return;
    }
    const id = navigator.geolocation.watchPosition(
      (pos) => {
        // Only update if we have good accuracy (less than 50 meters)
        if (pos.coords.accuracy <= 50) {
          setCoords({ 
            latitude: pos.coords.latitude, 
            longitude: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
            timestamp: pos.timestamp
          });
          onError(null);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        switch(error.code) {
          case error.PERMISSION_DENIED:
            onError('Location access denied. Please enable location services.');
            break;
          case error.POSITION_UNAVAILABLE:
            onError('Location information unavailable.');
            break;
          case error.TIMEOUT:
            onError('Location request timed out.');
            break;
          default:
            onError('Unknown location error occurred.');
            break;
        }
      },
      { 
        enableHighAccuracy: true, 
        maximumAge: 0, 
        timeout: 30000 // Increased timeout for better accuracy
      }
    );
    return () => navigator.geolocation.clearWatch(id);
  }, [onError]);

  // As soon as we have coordinates, store locally and dismiss the popup, then save in background
  useEffect(() => {
    if (coords && !savedClientRef.current) {
      savedClientRef.current = true;
      const local: UserData = {
        location: coords,
        createdAt: new Date().toISOString()
      };
      onComplete(local);
      // Background save (non-blocking)
      (async () => {
        try {
          const name = `User-${Math.random().toString(36).slice(2, 8)}`;
          const res = await fetch('/api/user-data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ location: coords, name }),
          });
          const json = await res.json();
          if (res.ok && typeof window !== 'undefined') {
            const merged: UserData = { ...local, id: json.id, createdAt: json.createdAt, userAgent: json.userAgent, ip: json.ip, name: json.name ?? name };
            window.localStorage.setItem('userData', JSON.stringify(merged));
          }
        } catch {}
      })();
    }
  }, [coords, onComplete]);

  function retryRequest() {
    if (!('geolocation' in navigator)) {
      onError('Geolocation not supported by this device.');
      return;
    }
    onError(null);
    
    // First try to get current position for immediate response
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (pos.coords.accuracy <= 100) { // Accept slightly lower accuracy for immediate response
          setCoords({ 
            latitude: pos.coords.latitude, 
            longitude: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
            timestamp: pos.timestamp
          });
        }
      },
      (error) => {
        console.error('getCurrentPosition error:', error);
      },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 }
    );
    
    // Then start watching for more accurate position
    const id = navigator.geolocation.watchPosition(
      (pos) => {
        if (pos.coords.accuracy <= 50) {
          setCoords({ 
            latitude: pos.coords.latitude, 
            longitude: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
            timestamp: pos.timestamp
          });
          navigator.geolocation.clearWatch(id);
        }
      },
      (error) => {
        onError('Unable to get precise location. Please try again.');
        navigator.geolocation.clearWatch(id);
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 30000 }
    );
  }

  // If coords exist, don't show any popup
  if (coords) return null;

  // If coords missing (denied): show centered notification with retry
  return (
    <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, zIndex: 1000 }}>
      <div className="card" style={{ maxWidth: 420, width: '100%' }}>
        <div className="card-body">
          <h3 style={{ marginTop: 0, marginBottom: 6, textAlign: 'center' }}>Allow location to continue</h3>
          <p className="muted" style={{ marginTop: 0, textAlign: 'center' }}>Location is necessary to use this site.</p>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button type="button" onClick={retryRequest}>Share location</button>
          </div>
          {error && <div style={{ color: 'var(--accent)', marginTop: 8, textAlign: 'center' }}>{error}</div>}
        </div>
      </div>
    </div>
  );
}


