import { useState, useCallback, useEffect } from 'react';
import { CivicMode } from '../types';
import { URBAN_LOCATION, RURAL_LOCATION } from '../data/mockLocations';

export interface GeolocationState {
  latitude: number;
  longitude: number;
  accuracy?: number;
  loading: boolean;
  error?: string;
  isCustomManual: boolean;
  permissionStatus: 'prompt' | 'granted' | 'denied';
}

export function useGeolocation(initialMode: CivicMode = 'urban') {
  const defaultLoc = initialMode === 'urban' ? URBAN_LOCATION : RURAL_LOCATION;

  const [state, setState] = useState<GeolocationState>({
    latitude: defaultLoc.centerLat,
    longitude: defaultLoc.centerLng,
    loading: false,
    permissionStatus: 'prompt',
    isCustomManual: false,
  });

  // Switch default center if mode changes and user has not set a manual pin
  useEffect(() => {
    if (!state.isCustomManual) {
      const loc = initialMode === 'urban' ? URBAN_LOCATION : RURAL_LOCATION;
      setState((prev) => ({
        ...prev,
        latitude: loc.centerLat,
        longitude: loc.centerLng,
      }));
    }
  }, [initialMode, state.isCustomManual]);

  const detectLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: 'Geolocation is not supported by your browser.',
        permissionStatus: 'denied',
      }));
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: undefined }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          loading: false,
          error: undefined,
          permissionStatus: 'granted',
          isCustomManual: true,
        });
      },
      (error) => {
        let msg = 'Unable to retrieve location.';
        if (error.code === error.PERMISSION_DENIED) {
          msg = 'Location permission was denied. You can manually drag the pin on the map.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          msg = 'Location position is currently unavailable.';
        } else if (error.code === error.TIMEOUT) {
          msg = 'Location request timed out.';
        }

        const fallback = initialMode === 'urban' ? URBAN_LOCATION : RURAL_LOCATION;

        setState({
          latitude: fallback.centerLat,
          longitude: fallback.centerLng,
          loading: false,
          error: msg,
          permissionStatus: 'denied',
          isCustomManual: false,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000,
      }
    );
  }, [initialMode]);

  const setManualLocation = useCallback((lat: number, lng: number) => {
    setState((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lng,
      isCustomManual: true,
      error: undefined,
    }));
  }, []);

  return {
    ...state,
    detectLocation,
    setManualLocation,
  };
}
