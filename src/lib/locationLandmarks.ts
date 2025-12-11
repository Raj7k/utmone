// Location to landmark mapping for stamp generation
export const locationLandmarks: Record<string, {
  landmarks: string;
  colorPalette: string[];
  description: string;
}> = {
  "San Francisco": {
    landmarks: "Golden Gate Bridge, Transamerica Pyramid, cable car",
    colorPalette: ["#E24A33", "#1E3A5F", "#F5A623", "#87CEEB"],
    description: "Tech hub with iconic red bridge"
  },
  "Singapore": {
    landmarks: "Marina Bay Sands, Merlion, Gardens by the Bay",
    colorPalette: ["#00B4D8", "#FF6B6B", "#4ECDC4", "#95E1D3"],
    description: "Modern Asian metropolis"
  },
  "Boston": {
    landmarks: "Faneuil Hall, Charles River, historic buildings",
    colorPalette: ["#8B4513", "#CD853F", "#228B22", "#4682B4"],
    description: "Historic East Coast city"
  },
  "Copenhagen": {
    landmarks: "Nyhavn colorful houses, Round Tower, windmills",
    colorPalette: ["#E63946", "#F4A261", "#2A9D8F", "#264653"],
    description: "Scandinavian design capital"
  },
  "Toronto": {
    landmarks: "CN Tower, Rogers Centre, waterfront",
    colorPalette: ["#1E88E5", "#FDD835", "#424242", "#E53935"],
    description: "Canadian financial hub"
  },
  "Mountain View": {
    landmarks: "Tech campuses, rolling hills, palm trees",
    colorPalette: ["#4CAF50", "#2196F3", "#FF9800", "#795548"],
    description: "Silicon Valley heart"
  },
  "San Diego": {
    landmarks: "Coronado Bridge, palm trees, beaches",
    colorPalette: ["#00BCD4", "#FFEB3B", "#FF5722", "#8BC34A"],
    description: "Sunny coastal city"
  },
  "Portland": {
    landmarks: "Mt. Hood, pine forests, bridges",
    colorPalette: ["#2E7D32", "#5D4037", "#90A4AE", "#FFAB91"],
    description: "Pacific Northwest gem"
  },
  "Bangalore": {
    landmarks: "Vidhana Soudha, tech parks, temples",
    colorPalette: ["#9C27B0", "#FF9800", "#009688", "#E91E63"],
    description: "India's tech capital"
  }
};

export function getLocationLandmarks(location: string): string {
  return locationLandmarks[location]?.landmarks || "iconic city landmarks";
}

export function getLocationColors(location: string): string[] {
  return locationLandmarks[location]?.colorPalette || ["#3B82F6", "#10B981", "#F59E0B", "#EF4444"];
}
