"use client"

import React, { useState, useEffect } from 'react';
import { archiveObjects } from '../data/objects';

interface Group {
  id: string;
  items: number[];
}

interface GroupLabelProps {
  group: Group;
  items: {
    id: number;
    type: string;
    groupId: number;
    x: number;
    y: number;
    size: number;
  }[];
  isVisible: boolean;
}

interface ArchiveObject {
  id: string;
  name: string;
  city: string;
  year: string;
  type: string;
  imageUrl: string;
  image: string;
}

function generateGroupName(objects: ArchiveObject[]): string {
  if (!objects || objects.length === 0) return "Empty Collection";
  
  console.log('Generating name for objects:', objects); // Debug log
  
  // Extract unique values from each property for analysis
  const uniqueCities = [...new Set(objects.map(obj => obj.city))];
  const uniqueYears = [...new Set(objects.map(obj => obj.year))];
  const uniqueTypes = [...new Set(objects.map(obj => obj.type))];
  
  console.log('Unique cities:', uniqueCities); // Debug log
  console.log('Unique years:', uniqueYears); // Debug log
  console.log('Unique types:', uniqueTypes); // Debug log
  
  // Get common elements for thematic naming
  const allNames = objects.map(obj => obj.name.toLowerCase());
  const allTypes = objects.map(obj => obj.type.toLowerCase());
  
  // Helper function to safely parse IDs
  const safeParseId = (id: string): number => {
    console.log('Parsing ID:', id); // Debug log
    // Extract the numeric part after "object-"
    const match = id.match(/object-(\d+)/);
    if (!match) {
      console.log('No numeric part found in ID:', id); // Debug log
      return 0;
    }
    const numericPart = match[1];
    const parsed = parseInt(numericPart, 10);
    console.log('Parsed numeric part:', parsed); // Debug log
    return isNaN(parsed) ? 0 : parsed;
  };

  // City-based naming strategy with more specific details
  if (uniqueCities.length === 1) {
    const city = uniqueCities[0].split(',')[0]; // Get just the city name, not state/country
    
    // Enhanced city nicknames with more variety
    const cityNicknames: Record<string, string[]> = {
      "New York": ["Manhattan Mementos", "Brooklyn Treasures", "NYC Subway Dreams", "Fifth Avenue Finds"],
      "Pittsburgh": ["Three Rivers Collection", "Steel City Mementos", "Bridges of Pittsburgh", "Yinzer Treasures"],
      "Berkeley": ["Cal Bear Memories", "Telegraph Avenue Tales", "Berkeley Hills Collection", "Bay Area Academia"],
      "San Jose": ["Silicon Valley Artifacts", "San Jose Keepsakes", "South Bay Treasures", "Tech Hub Tokens"],
      "Kyoto": ["Temple Garden Treasures", "Kyoto's Ancient Whispers", "Bamboo Grove Memories", "Geisha District Finds"],
      "Tokyo": ["Shibuya Crossing Keepsakes", "Tokyo Tower Tales", "Shinjuku Night Memories", "Harajuku Treasures"],
      "London": ["Thames River Collection", "London Fog Memories", "Royal Mile Finds", "British Tea Time Treasures"],
      "Honolulu": ["Waikiki Wonders", "Diamond Head Collection", "Pacific Paradise Tokens", "Aloha Spirit Memories"],
      "Taipei": ["Night Market Treasures", "Taiwanese Tea Memories", "101 Tower Collection", "Formosa Keepsakes"],
      "Oakland": ["East Bay Artifacts", "Oakland Hills Collection", "Lake Merritt Memories", "Town Treasures"]
    };
    
    // If we have a specific nickname for this city, use it
    if (cityNicknames[city]) {
      // Get a deterministic but seemingly random selection based on the objects
      const idSum = objects.reduce((sum, obj) => sum + safeParseId(obj.id), 0);
      return cityNicknames[city][idSum % cityNicknames[city].length];
    }
    
    // Create specific names based on city and type combinations
    if (uniqueTypes.length === 1) {
      const type = uniqueTypes[0].toLowerCase();
      
      // Special combinations
      const cityTypeCombos: Record<string, Record<string, string>> = {
        "New York": {
          "bookmark": "Bookshops of Manhattan",
          "transportation ticket": "NYC Subway Journeys",
          "plushie": "Manhattan's Cuddly Corner",
          "postcard": "Skyline Postcards",
          "restaurant card": "NYC Culinary Tour"
        },
        "Pittsburgh": {
          "bookmark": "Steel City Book Nook",
          "theater ticket": "Pittsburgh Stage Memories"
        },
        "Kyoto": {
          "attraction ticket": "Temple Hopping in Kyoto",
          "transportation ticket": "Kyoto Transit Adventures"
        }
      };
      
      if (cityTypeCombos[city] && cityTypeCombos[city][type]) {
        return cityTypeCombos[city][type];
      }
    }
    
    // Year and city combinations
    if (uniqueYears.length === 1) {
      const year = uniqueYears[0];
      const season = parseInt(year) % 4 === 0 ? "Summer" : 
                    parseInt(year) % 4 === 1 ? "Autumn" : 
                    parseInt(year) % 4 === 2 ? "Winter" : "Spring";
      
      return `${season} in ${city}, ${year}`;
    }
  }
  
  // More specific type-based naming strategy
  if (uniqueTypes.length === 1) {
    const type = uniqueTypes[0];
    
    // Check for keywords in object names to create more specific collections
    const typeKeywords: Record<string, Record<string, string>> = {
      "Bookmark": {
        "whale": "Oceanic Reading Adventures",
        "books": "Bibliophile's Corner",
        "pickle": "Peculiar Page Markers"
      },
      "Transportation ticket": {
        "metro": "Urban Transit Diaries",
        "rail": "Rail Journey Chronicles",
        "jr": "Japanese Railway Odyssey"
      },
      "Plushie": {
        "kitty": "Feline Friends Collection",
        "jellycat": "Soft Companions Gallery"
      },
      "Postcard": {
        "park": "Parks & Gardens Series",
        "university": "Campus Views Collection"
      }
    };
    
    // Look for keyword matches
    if (typeKeywords[type]) {
      for (const [keyword, name] of Object.entries(typeKeywords[type])) {
        if (allNames.some(n => n.includes(keyword))) {
          return name;
        }
      }
    }
    
    // Enhanced type themes
    const typeThemes: Record<string, string[]> = {
      "Bookmark": ["Between the Pages", "Reading Retreat Markers", "Literary Journey Guides", "Bookshelf Sentinels"],
      "Transportation ticket": ["Ticket to Everywhere", "Transit Tales", "The Commuter's Archive", "Journey Paper Trail"],
      "Sports ticket": ["Sideline Memories", "Fan's Admission", "Arena Access Archives", "Game Day Relics"],
      "Theater ticket": ["Front Row Chronicles", "Curtain Call Collection", "Stage Door Memories", "Theater District Tokens"],
      "Attraction ticket": ["Sightseeing Souvenirs", "Tourist Trail Markers", "Wanderer's Admission Papers", "Explorer's Entry Passes"],
      "Plushie": ["Soft Memory Keepers", "Huggable Souvenirs", "Plush Travel Companions", "Fabric Friend Collective"],
      "Postcard": ["Visual Dispatch Collection", "Framed Moments", "Captured Horizons", "Pocket-Sized Views"],
      "Museum postcard": ["Gallery Echo Collection", "Masterpiece Miniatures", "Art History Pocket Guide", "Museum Memory Lane"],
      "Restaurant card": ["Flavor Memory Triggers", "Global Gastronomy Guide", "Culinary Milestone Markers", "Taste Adventure Map"],
      "Paper memento": ["Ephemeral Treasures", "Tactile Time Capsule", "Folded Memory Keepers", "Inked Impressions"],
      "Trinket": ["Pocket-Sized Nostalgia", "Tiny Treasure Trove", "Miniature Memory Anchors", "Small Souvenirs Showcase"]
    };
    
    if (typeThemes[type]) {
      const idSum = objects.reduce((sum, obj) => sum + safeParseId(obj.id), 0);
      return typeThemes[type][idSum % typeThemes[type].length];
    }
  }
  
  // Enhanced region-based names
  const regions: Record<string, [string[], string[]]> = {
    "East Coast": [
      ["New York", "Pittsburgh"], 
      ["Atlantic Seaboard Memories", "East Coast Expedition", "Urban Northeast Collection", "Metropolitan Atlantic Archive"]
    ],
    "West Coast": [
      ["Berkeley", "San Jose", "Oakland", "Big Sur"], 
      ["Pacific Shoreline Treasures", "West Coast Wonders", "California Coastline Collection", "Golden State Archive"]
    ],
    "California": [
      ["Berkeley", "San Jose", "Oakland", "Big Sur"], 
      ["Golden State Gatherings", "California Dream Collection", "Bear Flag Treasures", "West Coast Wanderings"]
    ],
    "Japan": [
      ["Kyoto", "Tokyo"], 
      ["Land of the Rising Sun Souvenirs", "Japanese Journey Archive", "Nippon Nostalgia Collection", "Cherry Blossom Memories"]
    ],
    "Asia": [
      ["Kyoto", "Tokyo", "Taipei"], 
      ["East Asian Expedition Tokens", "Pacific Rim Collection", "Far East Findings", "Oriental Odyssey Archive"]
    ]
  };
  
  for (const [region, [cities, names]] of Object.entries(regions)) {
    const citiesInThisRegion = uniqueCities.filter(city => 
      cities.some(regionCity => city.includes(regionCity))
    );
    
    if (citiesInThisRegion.length === uniqueCities.length && citiesInThisRegion.length > 0) {
      const idSum = objects.reduce((sum, obj) => sum + safeParseId(obj.id), 0);
      return names[idSum % names.length];
    }
  }
  
  // More interesting time spans for different years
  if (uniqueYears.length > 1) {
    const sortedYears = [...uniqueYears].map(y => parseInt(y)).sort((a, b) => a - b);
    const minYear = sortedYears[0];
    const maxYear = sortedYears[sortedYears.length - 1];
    
    if (maxYear - minYear <= 2) {
      // Name based on the types of items if they have similarities
      if (objects.some(obj => obj.type.includes("ticket")) && objects.some(obj => obj.type.includes("memento"))) {
        return `${minYear}-${maxYear} Travel Chronicles`;
      }
      
      if (objects.some(obj => obj.type.includes("Restaurant") || obj.type.includes("Bakery"))) {
        return `${minYear}-${maxYear} Culinary Pilgrimage`;
      }
      
      return `${minYear}-${maxYear} Wanderer's Archive`;
    }
    
    // Check if it spans a decade
    const firstDecade = Math.floor(minYear / 10) * 10;
    const lastDecade = Math.floor(maxYear / 10) * 10;
    
    if (firstDecade !== lastDecade) {
      return `Cross-Decade Memories: ${firstDecade}s to ${lastDecade}s`;
    }
  }
  
  // Enhanced thematic names based on object names
  const themes: Record<string, [string[], string[]]> = {
    "Literary": [
      ["book", "read", "bookstore"], 
      ["Page Turner's Paradise", "Bookworm's Expedition", "Literary Hideaway", "Storyteller's Sanctum"]
    ],
    "Travel": [
      ["pass", "rail", "metro", "card", "transportation"], 
      ["Globetrotter's Logbook", "Transit Tales", "Wanderlust Archive", "Journey Documentation"]
    ],
    "Art": [
      ["museum", "matisse", "art", "postcard"], 
      ["Aesthetic Appreciation Archive", "Gallery Hopper's Collection", "Canvas & Frame Memories", "Museum Mile Records"]
    ],
    "Food": [
      ["bakery", "restaurant", "carbone", "dishoom"], 
      ["Gourmet Expedition Log", "Culinary Passport", "Foodie's Treasure Map", "Global Flavor Archive"]
    ],
    "Character": [
      ["miffy", "kitty", "gudetama", "jellycat", "cat"], 
      ["Character Companion Collection", "Mascot Memory Keepers", "Kawaii Treasure Chest", "Plush Friend Archives"]
    ],
    "Nature": [
      ["park", "falls", "whale"], 
      ["Natural Wonders Collection", "Outdoor Expedition Mementos", "Wilderness Wanderer Archive", "Earth's Beauty Tokens"]
    ]
  };
  
  for (const [theme, [keywords, names]] of Object.entries(themes)) {
    if (keywords.some(keyword => allNames.some(name => name.includes(keyword)))) {
      const idSum = objects.reduce((sum, obj) => sum + safeParseId(obj.id), 0);
      return names[idSum % names.length];
    }
  }
  
  // Look for color patterns in the names
  const colorKeywords = ["white", "black", "red", "blue", "green", "yellow", "orange", "purple", "pink"];
  const colorMatches = colorKeywords.filter(color => 
    allNames.some((name: string) => name.toLowerCase().includes(color))
  );
  
  if (colorMatches.length > 0) {
    const colorName = colorMatches[0].charAt(0).toUpperCase() + colorMatches[0].slice(1);
    return `${colorName} Tinted Memories`;
  }
  
  // Enhanced random name templates for fallback
  const nameTemplates = [
    "Ephemeral Encounters",
    "Chronicles of Curiosity",
    "Sentimental Cartography",
    "The Traveler's Time Capsule",
    "Collected Moments in Time",
    "Memory Lane Artifacts",
    "Nomad's Treasure Chest",
    "Serendipitous Souvenirs",
    "Passport to the Past",
    "The Nostalgic Navigator",
    "Keepsakes & Recollections",
    "Whispers of Wanderlust",
    "Adventures Crystallized",
    "The Memory Merchant",
    "Ephemeral Evidence",
    "Souvenir Storytellers",
    "Journey Journal Archives",
    "Vagabond's Valise",
    "Chronicle of Cherished Places",
    "The Sentimental Cartographer"
  ];
  
  const idSum = objects.reduce((sum, obj) => sum + safeParseId(obj.id), 0);
  return nameTemplates[idSum % nameTemplates.length];
}

// GroupLabel component for displaying group names with hover visibility
export default function GroupLabel({ group, items, isVisible }: GroupLabelProps) {
  const [label, setLabel] = useState<string>("Group");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    console.log('Group items:', group.items); // Debug log

    // Map numeric IDs to string IDs and get archive objects
    const groupItems = group.items.map(id => {
      const stringId = `object-${id}`;
      console.log('Looking for object with ID:', stringId); // Debug log
      const archiveObject = archiveObjects.find(obj => obj.id === stringId);
      if (!archiveObject) {
        console.warn(`No archive object found for ID: ${stringId}`);
        return null;
      }
      console.log('Found object:', archiveObject); // Debug log
      return archiveObject;
    }).filter((item): item is ArchiveObject => item !== null);

    console.log('Filtered group items:', groupItems); // Debug log

    if (groupItems.length > 0) {
      const groupName = generateGroupName(groupItems);
      console.log('Generated group name:', groupName);
      setLabel(groupName);
    } else {
      console.log('No valid items found for group'); // Debug log
      setLabel("Group"); // Fallback to default name
    }
  }, [group.items, isClient]);

  return (
    <div
      className="group-label"
      style={{
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.2s ease-in-out',
        position: 'absolute',
        bottom: '-8px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 5,
        whiteSpace: 'nowrap',
        maxWidth: '90%',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        pointerEvents: 'none',
        fontFamily: 'HAL Timezone Unlicensed, sans-serif',
        fontSize: '16px',
        textAlign: 'center',
        padding: '4px 8px',
        color: '#000000',
      }}
    >
      {/* Shadow text layer */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          color: '#F4AEC8',
          WebkitTextStroke: '6px #F4AEC8',
          filter: 'blur(12px)',
          zIndex: -1,
        }}
      >
        {label}
      </div>
      {/* Main text layer */}
      <div style={{ position: 'relative', zIndex: 1 }}>
      {label}
      </div>
    </div>
  );
}
