export interface CivicLocationContext {
  name: string;
  type: 'urban' | 'rural';
  centerLat: number;
  centerLng: number;
  zoom: number;
  subdivisions: string[];
}

export const URBAN_LOCATION: CivicLocationContext = {
  name: 'Bengaluru Urban District',
  type: 'urban',
  centerLat: 12.9716,
  centerLng: 77.5946,
  zoom: 13,
  subdivisions: ['Ward 14, Bengaluru (Indiranagar / ORR)', 'Ward 4, Bengaluru (Whitefield / Mahadevapura)'],
};

export const RURAL_LOCATION: CivicLocationContext = {
  name: 'Rampur Gram Panchayat, Bilaspur Block',
  type: 'rural',
  centerLat: 22.0797,
  centerLng: 82.1409,
  zoom: 14,
  subdivisions: [
    'Rampur Village Center',
    'Sonapur Hamlet, Ward 2',
    'Kisan Mandi Approach Road',
    'Primary Health Center Link',
  ],
};
