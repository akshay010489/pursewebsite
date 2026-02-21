// Shipping fee calculation based on distance from Newark, CA

interface Coordinates {
  lat: number
  lng: number
}

const NEWARK_CA: Coordinates = {
  lat: 37.5297,
  lng: -122.0402
}

// Calculate distance between two coordinates using Haversine formula
function calculateDistance(coord1: Coordinates, coord2: Coordinates): number {
  const R = 3959 // Earth's radius in miles
  const dLat = (coord2.lat - coord1.lat) * Math.PI / 180
  const dLon = (coord2.lng - coord1.lng) * Math.PI / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(coord1.lat * Math.PI / 180) *
    Math.cos(coord2.lat * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// Get coordinates from address using geocoding
export async function getCoordinatesFromAddress(
  address: string,
  city: string,
  state: string,
  zip: string
): Promise<Coordinates | null> {
  try {
    // Using a free geocoding service (Nominatim)
    const query = `${address}, ${city}, ${state} ${zip}, USA`
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`,
      {
        headers: {
          'User-Agent': 'PurseWebsite/1.0'
        }
      }
    )
    
    const data = await response.json()
    
    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon)
      }
    }
    
    return null
  } catch (error) {
    console.error('Geocoding error:', error)
    return null
  }
}

// Calculate shipping fee based on distance
export function calculateShippingFee(distance: number): number {
  if (distance <= 25) {
    // Local delivery (within 25 miles)
    return 5.00
  } else if (distance <= 100) {
    // Regional (25-100 miles)
    return 10.00
  } else if (distance <= 500) {
    // Statewide/Regional (100-500 miles)
    return 15.00
  } else if (distance <= 2000) {
    // National (500-2000 miles)
    return 20.00
  } else {
    // International/Long distance (2000+ miles)
    return 30.00
  }
}

// Main function to get shipping fee from address
export async function getShippingFeeFromAddress(
  address: string,
  city: string,
  state: string,
  zip: string
): Promise<{ fee: number; distance: number; error?: string }> {
  const coords = await getCoordinatesFromAddress(address, city, state, zip)
  
  if (!coords) {
    return {
      fee: 20.00, // Default shipping fee if geocoding fails
      distance: 0,
      error: 'Could not calculate distance. Using default shipping fee.'
    }
  }

  const distance = calculateDistance(NEWARK_CA, coords)
  const fee = calculateShippingFee(distance)

  return { fee, distance }
}
