// Location-themed postcard stamp backgrounds with iconic city silhouettes

export interface LocationTheme {
  gradient: string;
  silhouette: string; // SVG path data for iconic landmark
  accentColor: string;
}

export const locationBackgrounds: Record<string, LocationTheme> = {
  'San Francisco': {
    gradient: 'linear-gradient(135deg, #F4A460 0%, #DEB887 30%, #D2B48C 60%, #C4A882 100%)',
    silhouette: 'M0,100 L10,90 L15,95 L20,85 L25,90 L35,60 L40,65 L45,55 L50,60 L60,50 L65,55 L70,45 L75,50 L85,75 L90,80 L100,100 Z', // Golden Gate hills
    accentColor: '#CD853F',
  },
  'Singapore': {
    gradient: 'linear-gradient(135deg, #87CEEB 0%, #ADD8E6 30%, #B0E0E6 60%, #E0FFFF 100%)',
    silhouette: 'M0,100 L20,100 L25,60 L30,55 L35,60 L40,40 L45,35 L50,40 L55,60 L60,55 L65,60 L70,100 L100,100 Z', // Marina Bay Sands style
    accentColor: '#4682B4',
  },
  'Boston': {
    gradient: 'linear-gradient(135deg, #8B4513 0%, #A0522D 30%, #CD853F 60%, #DEB887 100%)',
    silhouette: 'M0,100 L10,85 L15,90 L20,75 L25,80 L30,70 L35,75 L40,65 L50,70 L55,60 L60,65 L70,80 L80,85 L90,75 L100,100 Z', // Historic skyline
    accentColor: '#8B0000',
  },
  'Copenhagen': {
    gradient: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E72 30%, #FFB347 60%, #FFD700 100%)',
    silhouette: 'M0,100 L10,80 L15,85 L20,70 L22,90 L25,85 L28,70 L32,90 L35,85 L40,70 L45,85 L50,80 L55,75 L60,85 L70,80 L80,90 L100,100 Z', // Nyhavn colorful houses
    accentColor: '#FF4500',
  },
  'Toronto': {
    gradient: 'linear-gradient(135deg, #708090 0%, #778899 30%, #B0C4DE 60%, #E6E6FA 100%)',
    silhouette: 'M0,100 L30,100 L35,80 L40,85 L45,50 L47,20 L49,50 L55,85 L60,80 L65,100 L100,100 Z', // CN Tower
    accentColor: '#C41E3A',
  },
  'Mountain View': {
    gradient: 'linear-gradient(135deg, #90EE90 0%, #98FB98 30%, #8FBC8F 60%, #3CB371 100%)',
    silhouette: 'M0,100 L15,85 L25,90 L35,70 L50,75 L60,65 L75,80 L85,75 L100,100 Z', // Rolling hills
    accentColor: '#228B22',
  },
  'San Diego': {
    gradient: 'linear-gradient(135deg, #00CED1 0%, #40E0D0 30%, #48D1CC 60%, #87CEEB 100%)',
    silhouette: 'M0,95 Q10,90 20,95 Q30,90 40,95 Q50,90 60,95 Q70,90 80,95 Q90,90 100,95 L100,100 L0,100 Z', // Ocean waves
    accentColor: '#008B8B',
  },
  'Portland': {
    gradient: 'linear-gradient(135deg, #2E8B57 0%, #3CB371 30%, #66CDAA 60%, #8FBC8F 100%)',
    silhouette: 'M0,100 L20,100 L25,80 L30,85 L35,60 L40,50 L45,55 L50,40 L55,55 L60,50 L65,60 L70,85 L75,80 L80,100 L100,100 Z', // Mt Hood + pine trees
    accentColor: '#006400',
  },
  'Bangalore': {
    gradient: 'linear-gradient(135deg, #FF8C00 0%, #FFA500 30%, #FFD700 60%, #FAFAD2 100%)',
    silhouette: 'M0,100 L15,100 L20,80 L25,70 L30,60 L35,55 L40,60 L45,70 L50,80 L55,100 L65,100 L70,85 L75,75 L80,85 L85,100 L100,100 Z', // Temple dome + tech towers
    accentColor: '#FF4500',
  },
};

export function getLocationTheme(location: string): LocationTheme {
  return locationBackgrounds[location] || locationBackgrounds['San Francisco'];
}
