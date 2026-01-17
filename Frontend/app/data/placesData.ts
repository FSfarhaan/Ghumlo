// Mumbai place images from Unsplash
const PLACE_IMAGES: Record<string, string> = {
  "gateway of india": "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&q=80",
  "marine drive": "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=800&q=80",
  "juhu beach": "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800&q=80",
  "bandra-worli sea link": "https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=800&q=80",
  "elephanta caves": "https://images.unsplash.com/photo-1606298855672-3efb63017be8?w=800&q=80",
  "siddhivinayak temple": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&q=80",
  "chhatrapati shivaji terminus": "https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=800&q=80",
  "cst": "https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=800&q=80",
  "haji ali dargah": "https://images.unsplash.com/photo-1595658658481-d53d3f999875?w=800&q=80",
  "colaba causeway": "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&q=80",
  "crawford market": "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=800&q=80",
  "bandra bandstand": "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=800&q=80",
  "worli fort": "https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=800&q=80",
  "sanjay gandhi national park": "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&q=80",
  "powai lake": "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&q=80",
  "film city": "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&q=80",
  "essel world": "https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?w=800&q=80",
  "global vipassana pagoda": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&q=80",
  "mount mary church": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&q=80",
  "mumbai": "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&q=80",
};

// Food & Restaurant images (Done)
const FOOD_IMAGES = [
  "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80",
  "https://images.unsplash.com/photo-1567337710282-00832b415979?w=800&q=80",
  "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&q=80",
  "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800&q=80",
  "https://images.unsplash.com/photo-1517244683847-7456b63c5969?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://plus.unsplash.com/premium_photo-1694141253763-209b4c8f8ace?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
];

// Time-based images (DONE)
const SUNRISE_IMAGES = [
  "https://images.unsplash.com/photo-1609176852247-f65301edc4f7?fm=jpg&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y2l0eSUyMHN1bnJpc2V8ZW58MHx8MHx8fDA%3D&ixlib=rb-4.1.0&q=60&w=3000",
  "https://images.unsplash.com/photo-1587642314856-a00a0e4aee60?fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000",
  "https://www.therooftopguide.com/new-york/Bilder/sunset-the-roof-edition.jpg",
  "https://images.unsplash.com/photo-1709897633539-68625c0043e3?fm=jpg&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2FsbSUyMG1vcm5pbmd8ZW58MHx8MHx8fDA%3D&ixlib=rb-4.1.0&q=60&w=3000",
];

const SUNSET_IMAGES = SUNRISE_IMAGES;

// Night city (Done)
const NIGHT_CITY_IMAGES = [
  "https://images.unsplash.com/photo-1639572682072-31c862b37cc8?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1592199353960-70fcf38bc66e?q=80&w=2127&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://plus.unsplash.com/premium_photo-1673240845266-2f2c432cf194?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1642678475750-394c64192b76?q=80&w=1631&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",

];

// Transport images (done)
const TRAIN_IMAGES = [
"https://images.unsplash.com/photo-1657086508430-1d63d341eb3c?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1654689874708-d126d09e8d70?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1657086508429-bd47ca505698?q=80&w=765&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
]

const METRO_IMAGES = [
"https://plus.unsplash.com/premium_photo-1676745449942-9810b9f9e5b9?q=80&w=765&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", 
  "https://plus.unsplash.com/premium_photo-1664300709254-affc6bcf89c6?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
]

const TAXI_IMAGES = [
"https://images.unsplash.com/photo-1665206220348-0f5d49b5b8b5?q=80&w=1157&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", 
  "https://images.unsplash.com/photo-1624807806624-dd74b21e717a?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1443479788958-11faa35a5578?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
]

// Walking / exploration (DONE)
const WALK_IMAGES = [
  "https://indiacinehub.gov.in/sites/default/files/styles/flexslider_full/public/2024-01/heritage_street_amritsar11.jpg?itok=jB7Wamdy",
  "https://images.unsplash.com/photo-1487956382158-bb926046304a?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1703690435275-36c8fb362a10?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
];

// Romantic / date (DONE)
const ROMANTIC_IMAGES = [
  "https://freerangestock.com/sample/186057/couple-enjoying-city-view-at-sunset-in-scenic-spot.jpg",
  "https://images.unsplash.com/photo-1603894309519-f4391826a2fd?fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDE0fHx8ZW58MHx8fHx8&ixlib=rb-4.1.0&q=60&w=3000",
  "https://images.squarespace-cdn.com/content/v1/5a74d7f780bd5eb96dbbd37f/1562797949516-KQ7G6TRJ6PAMQARPK7DD/City%2BLights%2BDate%2BNight.jpg",
  "https://www.therooftopguide.com/rooftop-news/Bilder/Romantic-SeenBangkok-1.jpg",
  "https://i.fbcd.co/products/resized/resized-750-500/8606b890e8cb30856c66a86cd72795ee5b0313a208180ff4e04a86a6c276f798.jpg"
];

// Cafe / chill (DONE)
const CAFE_IMAGES = [
  "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80",
  "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=800&q=80",
  "https://assets.simpleviewinc.com/simpleview/image/upload/c_fill%2Ch_900%2Cq_75%2Cw_1200/v1/clients/dallasites101/A3ADF723_495C_429A_915C_F1CA7D9A2437_df3b43bc-1a63-4e24-9a35-d97e340aa1c7.jpg"
];


// Default fallback
const DEFAULT_MUMBAI_IMAGE = "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&q=80";

export default function getPlaceImage(
  placeName: string,
  activity?: string
): string {
  const lowerPlace = placeName?.toLowerCase();

  if (activity) {
    const a = activity?.toLowerCase();

    // 🍽️ Food
    if (
      a?.includes("food") ||
      a?.includes("eat") ||
      a?.includes("restaurant") ||
      a?.includes("cafe") ||
      a?.includes("breakfast") ||
      a?.includes("lunch") ||
      a?.includes("dinner") ||
      a?.includes("street food")
    ) {
      return FOOD_IMAGES[Math.floor(Math.random() * FOOD_IMAGES.length)];
    }

    // ❤️ Romantic / date
    if (
      a?.includes("date") ||
      a?.includes("romantic") ||
      a?.includes("couple")
    ) {
      return ROMANTIC_IMAGES[Math.floor(Math.random() * ROMANTIC_IMAGES.length)];
    }

    // 🌅 Sunrise
    if (a?.includes("sunrise") || a?.includes("morning")) {
      return SUNRISE_IMAGES[Math.floor(Math.random() * SUNRISE_IMAGES.length)];
    }

    // 🌇 Sunset
    if (a?.includes("sunset") || a?.includes("evening")) {
      return SUNSET_IMAGES[Math.floor(Math.random() * SUNSET_IMAGES.length)];
    }

    // 🌃 Night
    if (a?.includes("night")) {
      return NIGHT_CITY_IMAGES[Math.floor(Math.random() * NIGHT_CITY_IMAGES.length)];
    }

    if(a?.includes("cafe")) {
      return CAFE_IMAGES[Math.floor(Math.random() * CAFE_IMAGES.length)];
    }

    // 🚆 Transport
    if (a?.includes("train")) {
      return TRAIN_IMAGES[Math.floor(Math.random() * TRAIN_IMAGES.length)];
    }

    if (a?.includes("metro")) {
      return METRO_IMAGES[Math.floor(Math.random() * METRO_IMAGES.length)];
    }

    if (a?.includes("taxi") || a?.includes("cab")) {
      return TAXI_IMAGES[Math.floor(Math.random() * TAXI_IMAGES.length)];
    }

    // 🚶 Walking / explore
    if (
      a?.includes("walk") ||
      a?.includes("explore") ||
      a?.includes("stroll") ||
      a?.includes("fun")
    ) {
      return WALK_IMAGES[Math.floor(Math.random() * WALK_IMAGES.length)];
    }
  }

  // 1. Exact place matches
  for (const [key, url] of Object.entries(PLACE_IMAGES)) {
    if (lowerPlace?.includes(key) || key?.includes(lowerPlace)) {
      return url;
    }
  }

  return DEFAULT_MUMBAI_IMAGE;
}


// Recommended places with curated images
export const RECOMMENDED_PLACES = [
  {
    id: "1",
    name: "Gateway of India",
    category: "Heritage",
    imageUrl: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&q=80",
    rating: 4.8,
  },
  {
    id: "2",
    name: "Marine Drive",
    category: "Scenic",
    imageUrl: "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=800&q=80",
    rating: 4.7,
  },
  {
    id: "3",
    name: "Juhu Beach",
    category: "Beach",
    imageUrl: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800&q=80",
    rating: 4.5,
  },
  {
    id: "4",
    name: "Bandra-Worli Sea Link",
    category: "Landmark",
    imageUrl: "https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=800&q=80",
    rating: 4.6,
  },
  {
    id: "5",
    name: "Elephanta Caves",
    category: "Heritage",
    imageUrl: "https://images.unsplash.com/photo-1606298855672-3efb63017be8?w=800&q=80",
    rating: 4.4,
  },
  {
    id: "6",
    name: "Girgaum Chowpatty",
    category: "Beach",
    imageUrl: "https://im.whatshot.in/img/2018/Mar/girgaon-chowpatty-1520424523.jpg",
    rating: 4.3,
  },
  {
    id: "7",
    name: "Haji Ali Dargah",
    category: "Religious",
    imageUrl: "https://images.unsplash.com/photo-1595658658481-d53d3f999875?w=800&q=80",
    rating: 4.5,
  },
  {
    id: "8",
    name: "Colaba Causeway",
    category: "Shopping",
    imageUrl: "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=800&q=80",
    rating: 4.3,
  },
];


export function getRecommendedPlaces(count: number = 4) {
  const shuffled = [...RECOMMENDED_PLACES].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}
