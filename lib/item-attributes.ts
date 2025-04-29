// Database of item attributes
export interface ItemAttributes {
  id: number
  type: string
  category: string
  material: string
  color: string
  size: string
  purpose: string
  origin: string
  year: number
  description: string
}

// Database of attributes for each item type
export const itemAttributesDatabase: Record<string, ItemAttributes> = {
  carbone: {
    id: 1,
    type: "carbone",
    category: "dining",
    material: "paper",
    color: "black",
    size: "small",
    purpose: "business card",
    origin: "New York",
    year: 2023,
    description: "Business card from Carbone restaurant in NYC",
  },
  bigsur: {
    id: 2,
    type: "bigsur",
    category: "travel",
    material: "paper",
    color: "multi",
    size: "small",
    purpose: "memory",
    origin: "California",
    year: 2022,
    description: "Polaroid photo of Big Sur coastline",
  },
  calpig: {
    id: 3,
    type: "calpig",
    category: "souvenir",
    material: "fabric",
    color: "pink",
    size: "small",
    purpose: "decoration",
    origin: "Berkeley",
    year: 2023,
    description: "Cal Berkeley plush pig mascot",
  },
  daytrip: {
    id: 4,
    type: "daytrip",
    category: "entertainment",
    material: "paper",
    color: "yellow",
    size: "small",
    purpose: "ticket",
    origin: "Oakland",
    year: 2023,
    description: "Ticket for Daytrip event",
  },
  dishoom: {
    id: 5,
    type: "dishoom",
    category: "dining",
    material: "paper",
    color: "cream",
    size: "small",
    purpose: "business card",
    origin: "London",
    year: 2022,
    description: "Business card from Dishoom restaurant",
  },
  gudetama: {
    id: 6,
    type: "gudetama",
    category: "collectible",
    material: "paper",
    color: "green",
    size: "small",
    purpose: "card",
    origin: "Japan",
    year: 2022,
    description: "Gudetama character collectible card",
  },
  fournee: {
    id: 7,
    type: "fournee",
    category: "dining",
    material: "paper",
    color: "cream",
    size: "small",
    purpose: "business card",
    origin: "Berkeley",
    year: 2023,
    description: "Business card from Fournée Bakery",
  },
  berkeley: {
    id: 8,
    type: "berkeley",
    category: "travel",
    material: "paper",
    color: "multi",
    size: "small",
    purpose: "postcard",
    origin: "Berkeley",
    year: 2021,
    description: "Vintage postcard of Berkeley campus",
  },
  centralpark: {
    id: 9,
    type: "centralpark",
    category: "travel",
    material: "paper",
    color: "multi",
    size: "small",
    purpose: "postcard",
    origin: "New York",
    year: 2021,
    description: "Vintage postcard of Central Park",
  },
  cat: {
    id: 10,
    type: "cat",
    category: "souvenir",
    material: "ceramic",
    color: "white",
    size: "small",
    purpose: "decoration",
    origin: "Japan",
    year: 2022,
    description: "Japanese ceramic lucky cat figurine",
  },
}

// Function to get attributes for an item
export function getItemAttributes(itemType: string): ItemAttributes {
  return (
    itemAttributesDatabase[itemType] || {
      id: 0,
      type: itemType,
      category: "unknown",
      material: "unknown",
      color: "unknown",
      size: "unknown",
      purpose: "unknown",
      origin: "unknown",
      year: 0,
      description: "Unknown item",
    }
  )
}

// Function to find common attributes between items
export function findCommonAttributes(itemTypes: string[]): Record<string, string | number> {
  if (!itemTypes.length) return {}

  // Get attributes for the first item
  const firstItemAttributes = getItemAttributes(itemTypes[0])

  // Initialize common attributes with all attributes from the first item
  const commonAttributes: Record<string, string | number> = {}

  // Check each attribute to see if it's common across all items
  Object.entries(firstItemAttributes).forEach(([key, value]) => {
    // Skip the id and type fields
    if (key === "id" || key === "type" || key === "description") return

    // Check if this attribute is the same for all items
    const isCommon = itemTypes.every((type) => {
      const attributes = getItemAttributes(type)
      return attributes[key as keyof ItemAttributes] === value
    })

    if (isCommon) {
      commonAttributes[key] = value
    }
  })

  return commonAttributes
}

// Function to generate a label based on common attributes
export function generateGroupLabel(itemTypes: string[]): string {
  const commonAttributes = findCommonAttributes(itemTypes)

  if (Object.keys(commonAttributes).length === 0) {
    return "Mixed Collection"
  }

  // Generate label based on common attributes
  const labelParts: string[] = []

  if (commonAttributes.category) {
    labelParts.push(`${commonAttributes.category}`)
  }

  if (commonAttributes.material) {
    labelParts.push(`${commonAttributes.material}`)
  }

  if (commonAttributes.purpose) {
    labelParts.push(`for ${commonAttributes.purpose}`)
  }

  if (commonAttributes.origin) {
    labelParts.push(`from ${commonAttributes.origin}`)
  }

  if (commonAttributes.year) {
    labelParts.push(`(${commonAttributes.year})`)
  }

  if (labelParts.length === 0) {
    return "Collection"
  }

  // Capitalize first letter
  const label = labelParts.join(" ")
  return label.charAt(0).toUpperCase() + label.slice(1)
}
