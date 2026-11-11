import type { CategorySlug, Material, Product, ProductType } from '../types';

interface Seed {
  name: string;
  cat: CategorySlug;
  sub: string;
  type: ProductType;
  mat: Material;
  finish: string;
  dim: string;
  wt: string;
  price: number;
  mrp?: number;
  imgs: string[];
  stock: number;
  rating?: number;
  reviews?: number;
  flags?: string; // f = featured, b = bestseller, n = new arrival
  tags: string[];
  desc: string;
  details: string[];
}

const CARE: Record<Material, string> = {
  Wood: 'Wipe with a soft, dry cloth. Oil with food-safe mineral oil once a month. Do not soak or put in the dishwasher.',
  Metal: 'Dust with a dry cloth. Avoid abrasive cleaners and prolonged contact with moisture.',
  Marble: 'Wipe spills promptly with a damp cloth. Natural stone is porous; avoid acidic liquids such as lemon and vinegar.',
  Glass: 'Hand wash in warm, soapy water and dry with a lint-free cloth.',
  Ceramic: 'Hand wash recommended to preserve the glaze. Microwave and dishwasher use is not advised for hand-glazed pieces.',
  Resin: 'Dust with a soft brush or dry cloth. Keep away from direct heat.',
  Brass: 'Brass develops a soft patina over time. To restore shine, polish with a paste of lemon and salt, rinse, and dry thoroughly.',
  Aluminium: 'Wipe with a soft, damp cloth and dry immediately. Avoid abrasive pads.',
  Stone: 'Rinse with water and air dry fully before storing. Season stone mortars with a handful of rice before first use.',
};

const SEEDS: Seed[] = [
  // ——— Home Accessories · Photo Frames
  {
    name: 'Aranya Carved Gilt Frame', cat: 'home-accessories', sub: 'photo-frames', type: 'Photo Frames', mat: 'Resin',
    finish: 'Antique gold leaf', dim: '8 × 10 in (photo) · 12.5 × 14.5 in overall', wt: '1.1 kg', price: 2450, mrp: 2990,
    imgs: ['carved-brass-photo-frame', 'desk-organiser-brass'], stock: 18, rating: 4.7, reviews: 46, flags: 'fb', tags: ['heritage', 'festive', 'wall'],
    desc: 'A baroque-inspired frame cast in resin and hand-finished with antique gold leaf. The softly worn edges give it the look of a family heirloom from the first day.',
    details: ['Hand-applied gold leaf finish', 'Glass front with velvet-backed MDF board', 'Wall hanging hooks and tabletop easel included'],
  },
  {
    name: 'Sheesham Walnut-Finish Frame', cat: 'home-accessories', sub: 'photo-frames', type: 'Photo Frames', mat: 'Wood',
    finish: 'Walnut stain, matte', dim: '5 × 7 in (photo) · 8 × 10 in overall', wt: '0.6 kg', price: 1290,
    imgs: ['tree-of-life-wall-art', 'carved-brass-photo-frame'], stock: 32, rating: 4.5, reviews: 28, tags: ['wall', 'gifting'],
    desc: 'Solid sheesham moulding with a bevelled inner edge, stained a deep walnut to frame black-and-white prints and family portraits beautifully.',
    details: ['Solid Indian rosewood (sheesham)', 'Shatter-resistant acrylic glazing', 'Hangs portrait or landscape'],
  },
  {
    name: 'Tamra Copper-Edge Frame', cat: 'home-accessories', sub: 'photo-frames', type: 'Photo Frames', mat: 'Metal',
    finish: 'Brushed copper', dim: 'A4 (photo) · 25 × 33 cm overall', wt: '0.8 kg', price: 1890, mrp: 2290,
    imgs: ['vine-mirror-console', 'arched-mirror-console'], stock: 14, rating: 4.6, reviews: 12, flags: 'n', tags: ['modern', 'wall'],
    desc: 'A slim, gallery-style frame in brushed copper with a generous ivory mount — made for art prints, certificates and botanical studies.',
    details: ['Brushed copper-plated steel profile', 'Acid-free 5 cm ivory mount', 'Freestanding or wall mounted'],
  },
  {
    name: 'Ivory Lacquer Mini Frame', cat: 'home-accessories', sub: 'photo-frames', type: 'Photo Frames', mat: 'Wood',
    finish: 'Ivory lacquer', dim: '4 × 6 in (photo)', wt: '0.3 kg', price: 790,
    imgs: ['round-carved-mirror', 'carved-brass-photo-frame'], stock: 40, rating: 4.4, reviews: 19, tags: ['gifting'],
    desc: 'A softly distressed ivory frame, small enough for a bedside or bookshelf. Perfect for travel snapshots and polaroid-sized keepsakes.',
    details: ['Mango wood with ivory lacquer', 'Fold-out easel back', 'Sold individually'],
  },
  {
    name: 'Gallery Wall Frame Set of 7', cat: 'home-accessories', sub: 'photo-frames', type: 'Photo Frames', mat: 'Wood',
    finish: 'Natural oak & black', dim: '2 × A3, 3 × A4, 2 × 5 × 7 in', wt: '4.2 kg', price: 6490, mrp: 7990,
    imgs: ['tree-of-life-sideboard', 'tree-of-life-wall-art'], stock: 9, rating: 4.8, reviews: 63, flags: 'fb', tags: ['wall', 'hosting'],
    desc: 'Everything you need for a balanced gallery wall: seven frames in two complementary finishes, with a paper hanging template so you only drill once.',
    details: ['Includes full-size paper layout template', 'Mixed oak-veneer and matte black frames', 'Mounts and hardware included'],
  },
  // ——— Bookends
  {
    name: 'Sutra Marble Sphere Bookends', cat: 'home-accessories', sub: 'bookends', type: 'Bookends', mat: 'Marble',
    finish: 'Honed ivory marble', dim: '12 × 10 × 16 cm each', wt: '2.6 kg (pair)', price: 3290,
    imgs: ['lotus-marble-bookends', 'marble-ring-bookend'], stock: 11, rating: 4.9, reviews: 22, flags: 'f', tags: ['stone', 'library'],
    desc: 'Two hand-turned marble spheres resting on heavy plinths — sculptural on their own and strong enough to hold a shelf of hardbacks upright.',
    details: ['Carved from a single block of Makrana marble', 'Felt-lined base protects surfaces', 'Sold as a pair'],
  },
  {
    name: 'Brass Hound Bookend', cat: 'home-accessories', sub: 'bookends', type: 'Bookends', mat: 'Brass',
    finish: 'Polished brass', dim: '9 × 6 × 15 cm', wt: '1.4 kg', price: 2890,
    imgs: ['deer-bookends', 'horse-head-bookends'], stock: 7, rating: 4.6, reviews: 9, flags: 'n', tags: ['brass', 'library', 'festive'],
    desc: 'A cast-brass hound keeps watch over your favourite titles. A playful, weighty accent that reads beautifully against dark bookcase interiors.',
    details: ['Solid sand-cast brass', 'Hand-polished in Moradabad', 'Single bookend'],
  },
  {
    name: 'Terracotta Planter Bookend', cat: 'home-accessories', sub: 'bookends', type: 'Bookends', mat: 'Ceramic',
    finish: 'Raw terracotta', dim: '14 × 10 × 12 cm', wt: '0.9 kg', price: 1590,
    imgs: ['horse-head-bookends', 'marble-ring-bookend'], stock: 0, rating: 4.3, reviews: 14, tags: ['planter', 'library'],
    desc: 'Half bookend, half planter. An L-shaped terracotta form with a small pocket for a succulent — the easiest way to bring green to a bookshelf.',
    details: ['Kiln-fired terracotta', 'Drainage-free planting pocket', 'Sold individually'],
  },
  // ——— Globes
  {
    name: 'Luminous Glass Desk Globe', cat: 'home-accessories', sub: 'globes', type: 'Decorative Accents', mat: 'Glass',
    finish: 'Hand-painted glass, brass stand', dim: '20 cm diameter · 32 cm high', wt: '1.8 kg', price: 4490,
    imgs: ['desk-globe-brass', 'armillary-sphere-small'], stock: 6, rating: 4.7, reviews: 17, flags: 'f', tags: ['study', 'gifting'],
    desc: 'A hand-painted glass globe that glows softly from within when lit. Equal parts reading lamp and conversation piece for a study or child’s room.',
    details: ['Warm LED, USB powered', 'Political map with 2026 borders', 'Solid brass meridian'],
  },
  {
    name: 'Engraved Wooden World Map', cat: 'home-accessories', sub: 'globes', type: 'Decorative Accents', mat: 'Wood',
    finish: 'Two-tone pine & walnut', dim: '90 × 50 cm', wt: '3.4 kg', price: 5990, mrp: 6990,
    imgs: ['armillary-sphere-hourglass', 'desk-globe-brass'], stock: 5, rating: 4.8, reviews: 31, tags: ['wall', 'study'],
    desc: 'Continents laser-cut from walnut and layered over a natural pine board — a tactile, architectural alternative to a framed map.',
    details: ['Ready to hang with concealed cleat', 'Layered relief construction', 'Made to order in Jodhpur'],
  },
  // ——— Candle Holders
  {
    name: 'Diya Brass Pillar Candlestick', cat: 'home-accessories', sub: 'candle-holders', type: 'Candle Holders', mat: 'Brass',
    finish: 'Antique brass', dim: '10 cm base · 24 cm high', wt: '0.9 kg', price: 2190,
    imgs: ['hurricane-candle-holder', 'marble-candle-tray'], stock: 26, rating: 4.8, reviews: 88, flags: 'fb', tags: ['brass', 'festive', 'candlelight'],
    desc: 'A classic turned-brass candlestick with a wide drip tray, inspired by temple lamps. Group in odd numbers on a dining table or mantel.',
    details: ['Solid cast brass', 'Fits standard taper candles', 'Felt base'],
  },
  {
    name: 'Chamber Brass Candle Holder', cat: 'home-accessories', sub: 'candle-holders', type: 'Candle Holders', mat: 'Brass',
    finish: 'Brushed brass', dim: '13 cm dish · 14 cm high', wt: '0.5 kg', price: 1690,
    imgs: ['marble-candle-tray', 'hurricane-candle-holder'], stock: 21, rating: 4.6, reviews: 24, tags: ['brass', 'candlelight', 'festive'],
    desc: 'A traditional chamberstick with a loop handle, made for carrying light from room to room on slow, power-cut evenings.',
    details: ['Spun brass dish, cast stem', 'Fits taper and dinner candles', 'Candle not included'],
  },
  {
    name: 'Noir Turned Wood Candlestick', cat: 'home-accessories', sub: 'candle-holders', type: 'Candle Holders', mat: 'Wood',
    finish: 'Ebonised mango wood', dim: '7 cm base · 20 cm high', wt: '0.4 kg', price: 1190,
    imgs: ['brass-desk-lamp', 'marble-candle-tray'], stock: 30, rating: 4.5, reviews: 11, flags: 'n', tags: ['candlelight', 'modern'],
    desc: 'A slender, hand-turned candlestick in ebonised mango wood. Its quiet silhouette sits well beside greenery and pale linen.',
    details: ['Lathe-turned by hand', 'Metal candle cup insert', 'Sold individually'],
  },
  {
    name: 'Rajwada Five-Arm Candelabra', cat: 'home-accessories', sub: 'candle-holders', type: 'Candle Holders', mat: 'Aluminium',
    finish: 'Nickel-plated silver', dim: '38 cm wide · 46 cm high', wt: '2.3 kg', price: 5490, mrp: 6490,
    imgs: ['tree-candelabra', 'marble-candle-tray'], stock: 4, rating: 4.7, reviews: 15, flags: 'f', tags: ['festive', 'hosting', 'candlelight'],
    desc: 'A statement five-arm candelabra with ornate scrolled arms — the centrepiece for wedding season dinners and Diwali tablescapes.',
    details: ['Cast aluminium with nickel plating', 'Holds five taper candles', 'Tarnish-resistant lacquer'],
  },
  {
    name: 'Smoked Glass Votives, Set of 2', cat: 'home-accessories', sub: 'candle-holders', type: 'Candle Holders', mat: 'Glass',
    finish: 'Smoked grey glass', dim: '8 × 10 cm each', wt: '0.7 kg', price: 1490,
    imgs: ['hurricane-candle-holder', 'tree-candelabra'], stock: 36, rating: 4.4, reviews: 37, flags: 'b', tags: ['candlelight', 'gifting'],
    desc: 'Mouth-blown smoked glass votives that cast a warm, flickering glow. Use with tealights or refill with our soy wax inserts.',
    details: ['Mouth-blown in Firozabad', 'Fits tealights and votives', 'Set of two'],
  },
  {
    name: 'Amber Jar Soy Candle Trio', cat: 'home-accessories', sub: 'candle-holders', type: 'Candle Holders', mat: 'Glass',
    finish: 'Amber glass', dim: '7 × 9 cm each', wt: '1.0 kg', price: 1890,
    imgs: ['marble-candle-tray', 'tree-candelabra'], stock: 22, rating: 4.6, reviews: 52, flags: 'b', tags: ['candlelight', 'festive', 'gifting'],
    desc: 'Three hand-poured soy candles in reusable amber jars — Vetiver & Cedar, Mogra, and Masala Chai. Around 35 hours of burn time each.',
    details: ['100% soy wax, cotton wick', 'Phthalate-free fragrance oils', 'Jars are reusable once cleaned'],
  },
  // ——— Decorative Accents
  {
    name: 'Hand-Beaten Brass Urli Bowl', cat: 'home-accessories', sub: 'decorative-accents', type: 'Decorative Bowls', mat: 'Brass',
    finish: 'Hammered brass', dim: '30 cm diameter · 9 cm high', wt: '1.6 kg', price: 3490, mrp: 3990,
    imgs: ['peacock-brass-bowl', 'marble-antler-bowl'], stock: 13, rating: 4.9, reviews: 71, flags: 'fb', tags: ['brass', 'festive', 'hosting'],
    desc: 'A shallow urli hand-beaten by metalsmiths in Kerala. Float marigolds and diyas for festivals, or leave it empty as sculpture.',
    details: ['Hand-hammered from a single sheet', 'Watertight; suitable for floating flowers', 'Each piece varies slightly'],
  },
  {
    name: 'Carved Brass Lota', cat: 'home-accessories', sub: 'decorative-accents', type: 'Decorative Accents', mat: 'Brass',
    finish: 'Engraved antique brass', dim: '14 cm diameter · 12 cm high', wt: '0.8 kg', price: 2790,
    imgs: ['brass-ribbon-sculpture', 'peacock-brass-bowl'], stock: 10, rating: 4.7, reviews: 18, tags: ['brass', 'heritage', 'festive'],
    desc: 'A traditional lota engraved with a band of lotus motifs. Use as a small vase, a pooja vessel, or a quiet heritage accent on a console.',
    details: ['Hand-engraved floral band', 'Food-safe interior', 'Made in Moradabad'],
  },
  {
    name: 'Marble Pedestal Fruit Bowl', cat: 'home-accessories', sub: 'decorative-accents', type: 'Decorative Bowls', mat: 'Marble',
    finish: 'Honed travertine-tone marble', dim: '28 cm diameter · 12 cm high', wt: '3.1 kg', price: 3990,
    imgs: ['marble-antler-bowl', 'marble-bowl-rolling-pin'], stock: 8, rating: 4.8, reviews: 13, flags: 'n', tags: ['stone', 'hosting'],
    desc: 'A footed bowl carved from warm-toned marble. Heavy, calm and generous — for fruit on the dining table or keys by the door.',
    details: ['Hand-carved single block', 'Natural veining varies', 'Felt pads underneath'],
  },
  {
    name: 'Porcelain Hound Figurine', cat: 'home-accessories', sub: 'decorative-accents', type: 'Decorative Accents', mat: 'Ceramic',
    finish: 'Hand-painted glazed porcelain', dim: '18 × 12 × 20 cm', wt: '0.7 kg', price: 2290,
    imgs: ['brass-scale', 'brass-hourglass'], stock: 0, rating: 4.5, reviews: 8, tags: ['gifting', 'library'],
    desc: 'A charming hand-painted porcelain hound with soulful eyes — a nod to vintage colonial-era bungalow shelves.',
    details: ['Glazed porcelain', 'Hand-painted detailing', 'Decorative use only'],
  },
  {
    name: 'Rattan Sunburst Mirror Pair', cat: 'home-accessories', sub: 'decorative-accents', type: 'Decorative Accents', mat: 'Wood',
    finish: 'Natural cane & rattan', dim: '45 cm and 35 cm diameter', wt: '2.0 kg', price: 4990,
    imgs: ['round-carved-mirror', 'arched-mirror-console'], stock: 6, rating: 4.6, reviews: 21, tags: ['wall', 'boho'],
    desc: 'Two hand-woven rattan mirrors in complementary sizes. Hang them overlapping above a sofa or console for an easy, layered wall.',
    details: ['Hand-woven by artisans in Assam', 'Bevelled mirror glass', 'Set of two'],
  },
  {
    name: 'Woven Wall Basket Set', cat: 'home-accessories', sub: 'decorative-accents', type: 'Decorative Accents', mat: 'Wood',
    finish: 'Natural sabai grass & bamboo', dim: '25, 35 and 45 cm diameter', wt: '1.2 kg', price: 3290,
    imgs: ['hanging-wall-planter-trio', 'hanging-wall-planter-duo'], stock: 15, rating: 4.5, reviews: 26, tags: ['wall', 'boho'],
    desc: 'Three flat-woven baskets in sabai grass, made by women’s collectives in Odisha. Arrange as a cluster for warm, textural wall art.',
    details: ['Handwoven, naturally dyed', 'Loops for easy hanging', 'Set of three'],
  },
  {
    name: 'Minimal Wall Clock', cat: 'home-accessories', sub: 'decorative-accents', type: 'Decorative Accents', mat: 'Metal',
    finish: 'Matte black steel', dim: '30 cm diameter', wt: '0.9 kg', price: 2490,
    imgs: ['wall-clock-brass', 'table-clock-burlwood'], stock: 19, rating: 4.4, reviews: 33, tags: ['modern', 'wall'],
    desc: 'A crisp, legible wall clock with a silent sweep movement — so it never ticks through a quiet afternoon.',
    details: ['Silent sweep quartz movement', 'Mineral glass face', 'Requires 1 × AA battery'],
  },
  // ——— Vases
  {
    name: 'Kumbh Matte Ceramic Vase', cat: 'home-accessories', sub: 'vases', type: 'Vases', mat: 'Ceramic',
    finish: 'Matte chalk glaze', dim: '26 cm diameter · 34 cm high', wt: '2.4 kg', price: 2890,
    imgs: ['wooden-card-box', 'brass-hourglass'], stock: 17, rating: 4.9, reviews: 104, flags: 'fb', tags: ['modern', 'minimal'],
    desc: 'Our most-loved vase. A generous, rounded kumbh silhouette in a chalky matte glaze that makes a single branch look intentional.',
    details: ['Wheel-thrown stoneware', 'Glazed interior holds water', 'Made in Khurja'],
  },
  {
    name: 'Stoneware Bottle Vases, Set of 3', cat: 'home-accessories', sub: 'vases', type: 'Vases', mat: 'Stone',
    finish: 'Speckled grey stoneware', dim: '18, 24 and 30 cm high', wt: '2.9 kg', price: 3490, mrp: 3990,
    imgs: ['carved-wood-boxes', 'wood-bowl-stones'], stock: 12, rating: 4.7, reviews: 38, flags: 'b', tags: ['stone', 'minimal'],
    desc: 'Three narrow-necked bottle vases in speckled grey — styled together for dried seed heads, or separately for single stems.',
    details: ['High-fired stoneware', 'Unglazed exterior, sealed interior', 'Set of three'],
  },
  {
    name: 'Twin Bud Vases on Teak', cat: 'home-accessories', sub: 'vases', type: 'Vases', mat: 'Ceramic',
    finish: 'Gloss white porcelain, teak base', dim: '30 × 14 cm base · 16 cm high', wt: '0.8 kg', price: 1690,
    imgs: ['pocket-watch-stand', 'table-clock-burlwood'], stock: 24, rating: 4.6, reviews: 29, tags: ['minimal', 'gifting'],
    desc: 'Two porcelain bud vases resting on a sculpted teak tray — a small, joyful arrangement for a desk or dining table.',
    details: ['Removable vases for cleaning', 'Reclaimed teak base', 'Set includes tray and two vases'],
  },
  {
    name: 'Mango Wood Bulb Vases, Pair', cat: 'home-accessories', sub: 'vases', type: 'Vases', mat: 'Wood',
    finish: 'Natural oiled mango wood', dim: '10 cm and 14 cm high', wt: '0.9 kg', price: 2190,
    imgs: ['wood-bowl-stones', 'bread-bin-book-stand'], stock: 20, rating: 4.7, reviews: 16, flags: 'fn', tags: ['minimal', 'organic'],
    desc: 'Lathe-turned bulb vases with glass test-tube inserts, made for propagating cuttings or holding a single tropical leaf.',
    details: ['Hand-turned mango wood', 'Removable glass inserts', 'Set of two sizes'],
  },
  {
    name: 'Antique Brass Bud Vase', cat: 'home-accessories', sub: 'vases', type: 'Vases', mat: 'Brass',
    finish: 'Antique dark brass', dim: '8 cm base · 22 cm high', wt: '0.5 kg', price: 1990,
    imgs: ['marble-sundial', 'brass-scale'], stock: 14, rating: 4.8, reviews: 20, flags: 'n', tags: ['brass', 'festive', 'heritage'],
    desc: 'A slender footed vase in darkened brass, modelled on a vintage surahi. Beautiful with lilies, tuberose or a single rose.',
    details: ['Cast brass with antique patina', 'Watertight', 'Made in Moradabad'],
  },
  // ——— Planters
  {
    name: 'Mint Glaze Tabletop Planter', cat: 'home-accessories', sub: 'planters', type: 'Planters', mat: 'Ceramic',
    finish: 'Gloss mint glaze', dim: '13 cm diameter · 12 cm high', wt: '0.6 kg', price: 890,
    imgs: ['marble-brass-planter', 'wood-marble-planter'], stock: 45, rating: 4.5, reviews: 58, flags: 'b', tags: ['planter', 'gifting'],
    desc: 'A cheerful glossy planter in soft mint, sized for succulents, aloe and small snake plants on a sunny sill.',
    details: ['Drainage hole with cork stopper', 'Glazed ceramic', 'Plant not included'],
  },
  {
    name: 'Terracotta Mini Pot', cat: 'home-accessories', sub: 'planters', type: 'Planters', mat: 'Ceramic',
    finish: 'Raw terracotta', dim: '9 cm diameter · 10 cm high', wt: '0.3 kg', price: 490,
    imgs: ['garden-wooden-planters', 'hanging-tiered-planter'], stock: 80, rating: 4.4, reviews: 41, tags: ['planter'],
    desc: 'The classic breathable terracotta pot, slip-finished for a smooth, warm surface. Ideal for cacti and herbs.',
    details: ['Kiln-fired terracotta', 'Drainage hole', 'Plant not included'],
  },
  {
    name: 'Concrete Cylinder Planter', cat: 'home-accessories', sub: 'planters', type: 'Planters', mat: 'Stone',
    finish: 'Sealed natural concrete', dim: '16 cm diameter · 18 cm high', wt: '2.2 kg', price: 1290,
    imgs: ['wood-marble-planter', 'marble-brass-planter'], stock: 27, rating: 4.6, reviews: 23, tags: ['planter', 'modern'],
    desc: 'A heavy, minimal cylinder in hand-cast concrete that grounds tall plants and won’t tip on a breezy balcony.',
    details: ['Hand-cast, water-sealed', 'Indoor and outdoor use', 'Drainage hole'],
  },
  {
    name: 'Teak Plant Stand with Pot', cat: 'home-accessories', sub: 'planters', type: 'Planters', mat: 'Wood',
    finish: 'Natural teak, ivory pot', dim: '30 cm diameter · 45 cm high', wt: '3.0 kg', price: 2990,
    imgs: ['brass-planter-stand', 'hanging-tiered-planter'], stock: 9, rating: 4.7, reviews: 19, flags: 'f', tags: ['planter', 'organic'],
    desc: 'A mid-century inspired teak stand paired with a matte ivory pot — lifts a monstera or fiddle-leaf fig to eye level.',
    details: ['Solid teak legs', 'Includes 22 cm ceramic pot', 'Easy screw-in assembly'],
  },
  {
    name: 'Bonsai Ceramic Tray Planter', cat: 'home-accessories', sub: 'planters', type: 'Planters', mat: 'Ceramic',
    finish: 'Unglazed stone grey', dim: '24 × 16 × 6 cm', wt: '0.9 kg', price: 1790,
    imgs: ['hanging-tiered-planter', 'brass-planter-stand'], stock: 12, rating: 4.8, reviews: 10, flags: 'n', tags: ['planter', 'organic'],
    desc: 'A shallow, high-fired tray pot designed for bonsai and miniature landscapes, with wiring holes and generous drainage.',
    details: ['Frost-proof stoneware', 'Two drainage and wiring holes', 'Plant not included'],
  },
  {
    name: 'Shallow Succulent Bowl', cat: 'home-accessories', sub: 'planters', type: 'Planters', mat: 'Ceramic',
    finish: 'Satin ivory glaze', dim: '24 cm diameter · 8 cm high', wt: '1.1 kg', price: 1390,
    imgs: ['hanging-wall-planter-duo', 'hanging-wall-planter-trio'], stock: 16, rating: 4.5, reviews: 15, tags: ['planter'],
    desc: 'A wide, low bowl for composing a mini desert garden — cacti, echeveria and pebbles on a coffee table.',
    details: ['Satin glazed stoneware', 'Drainage hole', 'Plants not included'],
  },
  // ——— Garden Decor
  {
    name: 'Sage Steel Garden Trowel', cat: 'home-accessories', sub: 'garden-decor', type: 'Decorative Accents', mat: 'Metal',
    finish: 'Powder-coated sage', dim: '30 cm long', wt: '0.3 kg', price: 690,
    imgs: ['fireplace-tool-set', 'garden-wooden-planters'], stock: 50, rating: 4.3, reviews: 12, tags: ['garden', 'gifting'],
    desc: 'A sturdy, deep-scooped trowel with depth markings — handsome enough to leave out on the balcony shelf.',
    details: ['Carbon steel, powder coated', 'Depth guide in cm', 'Hanging hole'],
  },
  {
    name: 'Topiary Planter, Tall', cat: 'home-accessories', sub: 'garden-decor', type: 'Planters', mat: 'Aluminium',
    finish: 'Matte forest green', dim: '28 cm diameter · 32 cm high', wt: '1.6 kg', price: 3190,
    imgs: ['garden-wooden-planters', 'brass-planter-stand'], stock: 0, rating: 4.6, reviews: 7, tags: ['garden', 'planter'],
    desc: 'A tapered, lightweight aluminium planter in deep forest green for clipped topiary, ficus and lemon trees.',
    details: ['Weatherproof aluminium', 'Indoor and outdoor use', 'Removable drainage plug'],
  },

  // ——— Kitchen & Bar · Chopping Boards
  {
    name: 'Sheesham End-Grain Chopping Board', cat: 'kitchen-bar', sub: 'chopping-boards', type: 'Serveware', mat: 'Wood',
    finish: 'Food-safe mineral oil', dim: '40 × 28 × 3.5 cm', wt: '2.2 kg', price: 1990, mrp: 2490,
    imgs: ['knife-block-brass', 'boards-ceramics'], stock: 25, rating: 4.8, reviews: 96, flags: 'fb', tags: ['kitchen', 'hosting'],
    desc: 'An end-grain board that is gentle on knife edges and heals its own cuts. Built thick and heavy so it never slides on the counter.',
    details: ['End-grain construction', 'Rubber feet', 'Finished with food-safe mineral oil'],
  },
  {
    name: 'Maple Juice-Groove Board', cat: 'kitchen-bar', sub: 'chopping-boards', type: 'Serveware', mat: 'Wood',
    finish: 'Natural oiled maple', dim: '45 × 30 × 2 cm', wt: '1.6 kg', price: 1690,
    imgs: ['boards-ceramics', 'knife-block-brass'], stock: 18, rating: 4.6, reviews: 34, tags: ['kitchen'],
    desc: 'A large, light-toned board with a deep juice groove — made for carving, fruit prep and everyday chopping.',
    details: ['Edge-grain maple', 'Deep juice groove', 'Reversible'],
  },
  {
    name: 'Acacia Round Serving Board', cat: 'kitchen-bar', sub: 'chopping-boards', type: 'Serveware', mat: 'Wood',
    finish: 'Natural acacia', dim: '35 cm diameter', wt: '1.2 kg', price: 1490,
    imgs: ['two-tier-leaf-stand', 'marble-cheese-board-set'], stock: 22, rating: 4.7, reviews: 27, flags: 'b', tags: ['hosting', 'kitchen'],
    desc: 'A richly grained round board for pizzas, flatbreads and grazing spreads — straight from the counter to the table.',
    details: ['Solid acacia', 'Hand-sanded edges', 'Doubles as a serving platter'],
  },
  {
    name: 'Paddle Board with Handle', cat: 'kitchen-bar', sub: 'chopping-boards', type: 'Serveware', mat: 'Wood',
    finish: 'Oiled mango wood', dim: '42 × 18 × 2 cm', wt: '0.9 kg', price: 1290,
    imgs: ['board-paddle', 'boards-ceramics'], stock: 30, rating: 4.5, reviews: 14, flags: 'n', tags: ['hosting', 'kitchen'],
    desc: 'A slim paddle board with a leather loop — for bread, cheese and herbs, and handsome hanging on a kitchen rail.',
    details: ['Mango wood with leather hang strap', 'Food safe', 'Hand wash only'],
  },
  // ——— Mortar & Pestle
  {
    name: 'Granite Khalbatta Mortar & Pestle', cat: 'kitchen-bar', sub: 'mortar-pestle', type: 'Serveware', mat: 'Stone',
    finish: 'Polished black granite', dim: '15 cm diameter · 10 cm high', wt: '3.2 kg', price: 1890,
    imgs: ['mortar-granite-dark', 'utensil-holder-set'], stock: 20, rating: 4.8, reviews: 81, flags: 'b', tags: ['kitchen', 'stone'],
    desc: 'The traditional khalbatta, carved from solid granite. Heavy enough to crush whole spices, ginger and garlic in seconds.',
    details: ['Solid granite, unpolished interior', 'Non-porous; will not stain', 'Season before first use'],
  },
  {
    name: 'Olivewood Mortar & Pestle', cat: 'kitchen-bar', sub: 'mortar-pestle', type: 'Serveware', mat: 'Wood',
    finish: 'Natural olivewood', dim: '12 cm diameter · 8 cm high', wt: '0.6 kg', price: 1590,
    imgs: ['utensil-holder-set', 'mortar-granite-dark'], stock: 11, rating: 4.5, reviews: 9, tags: ['kitchen'],
    desc: 'A light, beautifully figured olivewood mortar for herbs, dry rubs and finishing salts at the table.',
    details: ['Carved from a single piece', 'Ideal for herbs and dry spices', 'Hand wash only'],
  },
  {
    name: 'Jade Marble Mortar & Pestle', cat: 'kitchen-bar', sub: 'mortar-pestle', type: 'Serveware', mat: 'Marble',
    finish: 'Honed green marble', dim: '13 cm diameter · 9 cm high', wt: '2.4 kg', price: 2290,
    imgs: ['marble-bowl-rolling-pin', 'mortar-granite-dark'], stock: 8, rating: 4.7, reviews: 12, flags: 'n', tags: ['kitchen', 'stone'],
    desc: 'Carved from soft-green Udaipur marble with a cork base. A grinding tool you’ll want to leave on the counter.',
    details: ['Udaipur green marble', 'Detachable cork base', 'Season before first use'],
  },
  // ——— Storage
  {
    name: 'Masala Dabba Spice Bowl Set', cat: 'kitchen-bar', sub: 'storage', type: 'Storage', mat: 'Metal',
    finish: 'Brushed stainless steel', dim: '22 cm diameter tin · 7 bowls', wt: '1.1 kg', price: 1790,
    imgs: ['spice-lazy-susan', 'kitchen-canister-set'], stock: 28, rating: 4.7, reviews: 64, flags: 'b', tags: ['kitchen', 'gifting'],
    desc: 'The heart of every Indian kitchen, refined: seven steel katoris and a spoon nested in an airtight brushed-steel dabba.',
    details: ['Food-grade 304 stainless steel', 'Airtight glass-window lid', 'Includes measuring spoon'],
  },
  {
    name: 'Acacia Pepper Mill', cat: 'kitchen-bar', sub: 'storage', type: 'Storage', mat: 'Wood',
    finish: 'Natural acacia', dim: '6 cm diameter · 20 cm high', wt: '0.4 kg', price: 1190,
    imgs: ['kitchen-canister-set', 'spice-lazy-susan'], stock: 33, rating: 4.4, reviews: 22, tags: ['kitchen'],
    desc: 'A tall acacia mill with an adjustable ceramic burr — from coarse cracked pepper to a fine dust.',
    details: ['Adjustable ceramic grinder', 'Easy top fill', 'Also suits rock salt'],
  },
  // ——— Tissue Holders
  {
    name: 'Marble Vanity Tray & Tissue Caddy', cat: 'kitchen-bar', sub: 'tissue-holders', type: 'Storage', mat: 'Marble',
    finish: 'Polished white marble', dim: '30 × 15 × 10 cm', wt: '2.0 kg', price: 2490,
    imgs: ['carved-wood-boxes', 'marble-desk-tray'], stock: 10, rating: 4.6, reviews: 11, tags: ['stone', 'hosting'],
    desc: 'A polished marble tray with a weighted napkin and tissue caddy — keeps the dining table or bathroom vanity in order.',
    details: ['White Makrana marble', 'Weighted lid', 'Felt base'],
  },
  // ——— Trivets
  {
    name: 'Walnut Slab Trivet', cat: 'kitchen-bar', sub: 'trivets', type: 'Serveware', mat: 'Wood',
    finish: 'Oiled walnut', dim: '20 × 20 × 2 cm', wt: '0.5 kg', price: 990,
    imgs: ['peacock-brass-bowl', 'marble-leaf-platter'], stock: 26, rating: 4.5, reviews: 17, tags: ['kitchen', 'hosting'],
    desc: 'A dense walnut slab that shows off its growth rings and protects your table from hot kadhais and casseroles.',
    details: ['Heat resistant to 200°C', 'Non-slip cork underside', 'Hand wash only'],
  },
  // ——— Bowls
  {
    name: 'Mango Wood Serving Bowls, Pair', cat: 'kitchen-bar', sub: 'bowls', type: 'Decorative Bowls', mat: 'Wood',
    finish: 'Food-safe lacquer', dim: '18 cm diameter · 7 cm high', wt: '0.8 kg', price: 1390,
    imgs: ['wood-bowl-stones', 'marble-leaf-platter'], stock: 19, rating: 4.6, reviews: 25, tags: ['hosting', 'kitchen'],
    desc: 'Hand-turned bowls for salads, smoothie bowls and dry snacks. Lightweight, warm to hold, and unbreakable.',
    details: ['Hand-turned mango wood', 'Food-safe lacquer', 'Set of two'],
  },
  {
    name: 'Indigo Pattern Ceramic Bowls, Set of 4', cat: 'kitchen-bar', sub: 'bowls', type: 'Decorative Bowls', mat: 'Ceramic',
    finish: 'Hand-stamped blue glaze', dim: '14 cm diameter · 6 cm high', wt: '1.4 kg', price: 1690,
    imgs: ['marble-leaf-platter', 'boards-ceramics'], stock: 23, rating: 4.7, reviews: 30, flags: 'n', tags: ['kitchen'],
    desc: 'Stackable bowls with a hand-stamped geometric band, inspired by Jaipur blue pottery. Sized for dal, raita and desserts.',
    details: ['Stoneware with lead-free glaze', 'Stackable', 'Set of four'],
  },
  // ——— Trays
  {
    name: 'Teak Butler Tray with Iron Handles', cat: 'kitchen-bar', sub: 'trays', type: 'Trays', mat: 'Wood',
    finish: 'Reclaimed teak, black iron', dim: '50 × 32 × 7 cm', wt: '2.1 kg', price: 2690,
    imgs: ['marble-desk-tray', 'marble-tic-tac-toe'], stock: 15, rating: 4.8, reviews: 49, flags: 'fb', tags: ['hosting'],
    desc: 'A deep-sided reclaimed teak tray with forged iron handles — for morning chai in bed or carrying drinks to the balcony.',
    details: ['Reclaimed teak', 'Hand-forged iron handles', 'Sealed against spills'],
  },
  {
    name: 'Etched Silver Serving Tray', cat: 'kitchen-bar', sub: 'trays', type: 'Trays', mat: 'Aluminium',
    finish: 'Silver-plated, hand etched', dim: '45 × 30 cm', wt: '1.3 kg', price: 3290,
    imgs: ['marble-candle-tray', 'marble-desk-tray'], stock: 7, rating: 4.6, reviews: 18, tags: ['hosting', 'festive', 'heritage'],
    desc: 'An ornately etched, silver-plated tray for serving mithai and sherbet to guests — festive hospitality at its finest.',
    details: ['Hand-etched floral pattern', 'Raised gallery edge', 'Tarnish-resistant lacquer'],
  },
  {
    name: 'Twin Teak Oval Trays', cat: 'kitchen-bar', sub: 'trays', type: 'Trays', mat: 'Wood',
    finish: 'Natural teak', dim: '50 × 15 cm and 40 × 12 cm', wt: '1.2 kg', price: 1890,
    imgs: ['fruit-stand-two-tier', 'two-tier-leaf-stand'], stock: 21, rating: 4.5, reviews: 10, flags: 'n', tags: ['hosting'],
    desc: 'Two long, carved teak trays for canapés, sushi or a line of tealights down the dining table.',
    details: ['Carved solid teak', 'Food safe', 'Set of two sizes'],
  },
  {
    name: 'Mint Lacquer Tea Tray', cat: 'kitchen-bar', sub: 'trays', type: 'Trays', mat: 'Metal',
    finish: 'Mint lacquer, gold rim', dim: '40 × 26 cm', wt: '0.8 kg', price: 1590,
    imgs: ['serve-sake', 'marble-desk-tray'], stock: 0, rating: 4.4, reviews: 13, tags: ['hosting', 'gifting'],
    desc: 'A retro-inspired tray in powder mint with a fine gold rim — the prettiest way to serve evening chai and biscuits.',
    details: ['Lacquered steel', 'Gold-painted rim', 'Wipe clean'],
  },
  // ——— Plates & Platters
  {
    name: 'Ocean Glaze Dinner Plates, Set of 4', cat: 'kitchen-bar', sub: 'plates-platters', type: 'Serveware', mat: 'Ceramic',
    finish: 'Reactive blue glaze', dim: '27 cm diameter', wt: '3.2 kg', price: 2490,
    imgs: ['boards-ceramics', 'marble-leaf-platter'], stock: 16, rating: 4.7, reviews: 42, flags: 'b', tags: ['hosting', 'kitchen'],
    desc: 'Reactive-glaze stoneware plates in a soft ocean blue, each with its own pooling and flow. Dinner, every day, made special.',
    details: ['Microwave safe', 'Lead-free glaze', 'Set of four'],
  },
  {
    name: 'Acacia & Slate Cheese Platter', cat: 'kitchen-bar', sub: 'plates-platters', type: 'Serveware', mat: 'Wood',
    finish: 'Acacia with slate insert', dim: '40 × 25 cm', wt: '1.9 kg', price: 2190,
    imgs: ['marble-cheese-board-set', 'marble-leaf-platter'], stock: 13, rating: 4.6, reviews: 20, tags: ['hosting'],
    desc: 'An acacia platter with an inset slate panel you can write on with chalk — label cheeses, chutneys and accompaniments.',
    details: ['Removable slate insert', 'Chalk included', 'Hand wash only'],
  },
  {
    name: 'Speckled Stoneware Cups, Set of 4', cat: 'kitchen-bar', sub: 'plates-platters', type: 'Serveware', mat: 'Ceramic',
    finish: 'Speckled sand glaze', dim: '8 cm diameter · 7 cm high (180 ml)', wt: '1.0 kg', price: 1490,
    imgs: ['serve-sake', 'boards-ceramics'], stock: 29, rating: 4.6, reviews: 36, tags: ['kitchen', 'gifting'],
    desc: 'Handle-free cups with a raw, dipped foot — perfect for cutting chai, filter coffee or a small serving of kheer.',
    details: ['Wheel-thrown stoneware', 'Microwave safe', 'Set of four'],
  },
  {
    name: 'Dip Bowls on Teak Tray', cat: 'kitchen-bar', sub: 'plates-platters', type: 'Serveware', mat: 'Ceramic',
    finish: 'Matte sand glaze, teak', dim: '36 × 12 cm tray · 3 bowls', wt: '1.1 kg', price: 1290,
    imgs: ['marble-leaf-platter', 'spice-lazy-susan'], stock: 24, rating: 4.5, reviews: 15, tags: ['hosting'],
    desc: 'Three ceramic dip bowls on a slim teak tray — chutneys, pickles and dips, arranged with care.',
    details: ['Removable ceramic bowls', 'Teak tray', 'Set of four pieces'],
  },
  {
    name: 'Celadon Tea Service', cat: 'kitchen-bar', sub: 'plates-platters', type: 'Serveware', mat: 'Ceramic',
    finish: 'Celadon green glaze', dim: 'Pitcher 900 ml · 4 cups', wt: '1.6 kg', price: 2990,
    imgs: ['serve-sake', 'boards-ceramics'], stock: 6, rating: 4.8, reviews: 9, flags: 'f', tags: ['hosting', 'gifting'],
    desc: 'A tall pitcher and four cups in a translucent celadon glaze, for green tea, kahwa or chilled nimbu paani.',
    details: ['Hand-thrown stoneware', 'Lead-free glaze', 'Five-piece set'],
  },
  // ——— Coasters
  {
    name: 'White Marble Coasters, Set of 4', cat: 'kitchen-bar', sub: 'coasters', type: 'Coasters', mat: 'Marble',
    finish: 'Honed white marble', dim: '10 cm diameter', wt: '1.2 kg', price: 1190,
    imgs: ['marble-coaster-set', 'marble-tic-tac-toe'], stock: 38, rating: 4.8, reviews: 77, flags: 'fb', tags: ['stone', 'hosting', 'gifting'],
    desc: 'Cool, weighty coasters in honed Makrana marble with cork backing — a small luxury on every side table.',
    details: ['Makrana marble', 'Cork-backed', 'Set of four'],
  },
  {
    name: 'Acacia Coasters with Caddy', cat: 'kitchen-bar', sub: 'coasters', type: 'Coasters', mat: 'Wood',
    finish: 'Natural acacia, black iron', dim: '10 cm diameter · 6 coasters', wt: '0.6 kg', price: 890,
    imgs: ['marble-coaster-set', 'peacock-brass-bowl'], stock: 34, rating: 4.5, reviews: 24, tags: ['hosting'],
    desc: 'Six round acacia coasters that stack neatly into an iron caddy — tidy enough to leave out on the coffee table.',
    details: ['Solid acacia', 'Powder-coated iron caddy', 'Set of six'],
  },
  // ——— Cake Stands
  {
    name: 'Footed Glass Cake Stand', cat: 'kitchen-bar', sub: 'cake-stands', type: 'Serveware', mat: 'Glass',
    finish: 'Clear pressed glass', dim: '28 cm diameter · 14 cm high', wt: '1.9 kg', price: 1990,
    imgs: ['three-tier-wood-stand', 'cakestand-ivory'], stock: 12, rating: 4.7, reviews: 28, flags: 'b', tags: ['hosting', 'festive'],
    desc: 'A classic pressed-glass cake stand with a gently scalloped rim, for birthday cakes, tea cakes and festive mithai.',
    details: ['Heavy pressed glass', 'Dishwasher safe', 'Holds cakes up to 25 cm'],
  },
  {
    name: 'Ivory Ceramic Cake Stand', cat: 'kitchen-bar', sub: 'cake-stands', type: 'Serveware', mat: 'Ceramic',
    finish: 'Gloss ivory glaze', dim: '26 cm diameter · 12 cm high', wt: '1.4 kg', price: 1690,
    imgs: ['cakestand-ivory', 'cakestand-ivory-detail'], stock: 15, rating: 4.6, reviews: 14, tags: ['hosting'],
    desc: 'A softly curved ivory cake stand that doubles as a fruit display on a sideboard between celebrations.',
    details: ['Glazed stoneware', 'Food safe', 'Hand wash recommended'],
  },
  {
    name: 'Gold-Rim Two-Tier Stand', cat: 'kitchen-bar', sub: 'cake-stands', type: 'Serveware', mat: 'Metal',
    finish: 'Champagne gold', dim: '30 and 22 cm tiers · 38 cm high', wt: '1.7 kg', price: 2790,
    imgs: ['two-tier-leaf-stand', 'tiered-brass-stand'], stock: 0, rating: 4.5, reviews: 8, tags: ['hosting', 'festive'],
    desc: 'A two-tier stand for high tea, wedding sweets and dessert tables, finished in a soft champagne gold.',
    details: ['Plated steel frame', 'Removable tiers for storage', 'Food-safe coating'],
  },
  // ——— Bottle Openers
  {
    name: 'Teak-Handle Bottle Opener', cat: 'kitchen-bar', sub: 'bottle-openers', type: 'Bar Accessories', mat: 'Metal',
    finish: 'Brushed steel, teak handle', dim: '16 cm long', wt: '0.15 kg', price: 590,
    imgs: ['bar-tool-set', 'marble-wine-chiller'], stock: 60, rating: 4.4, reviews: 19, tags: ['bar', 'gifting'],
    desc: 'A sturdy brushed-steel opener with a smooth teak handle — the satisfying pop, every time.',
    details: ['Stainless steel head', 'Solid teak handle', 'Hanging loop'],
  },
  {
    name: 'Cast Iron Wall Bottle Opener', cat: 'kitchen-bar', sub: 'bottle-openers', type: 'Bar Accessories', mat: 'Metal',
    finish: 'Antique pewter', dim: '9 cm diameter', wt: '0.4 kg', price: 790,
    imgs: ['opener-iron', 'bar-tool-set'], stock: 17, rating: 4.3, reviews: 6, tags: ['bar'],
    desc: 'A wall-mounted, cast-iron opener with a quirky embossed face. Fix it beside the bar cart and never hunt for an opener again.',
    details: ['Cast iron with pewter finish', 'Screws included', 'Indoor use'],
  },
  // ——— Wine Accessories
  {
    name: 'Crystal Bordeaux Glasses, Pair', cat: 'kitchen-bar', sub: 'wine-accessories', type: 'Bar Accessories', mat: 'Glass',
    finish: 'Lead-free crystal', dim: '650 ml · 24 cm high', wt: '0.5 kg', price: 1890,
    imgs: ['wine-caddy-brass', 'stag-wine-rack'], stock: 20, rating: 4.7, reviews: 33, flags: 'b', tags: ['bar', 'hosting', 'gifting'],
    desc: 'Generous, thin-rimmed Bordeaux glasses that let a Nashik red breathe. Mouth-blown and surprisingly durable.',
    details: ['Lead-free crystal', 'Laser-cut rim', 'Set of two'],
  },
  {
    name: 'White Wine Glasses, Pair', cat: 'kitchen-bar', sub: 'wine-accessories', type: 'Bar Accessories', mat: 'Glass',
    finish: 'Lead-free crystal', dim: '420 ml · 21 cm high', wt: '0.4 kg', price: 1790,
    imgs: ['marble-wine-chiller', 'wine-caddy-brass'], stock: 18, rating: 4.6, reviews: 15, tags: ['bar', 'hosting'],
    desc: 'A tulip-shaped bowl to keep whites and rosés cool and aromatic — fine enough for celebrations, sturdy enough for Tuesdays.',
    details: ['Lead-free crystal', 'Dishwasher safe', 'Set of two'],
  },
  {
    name: 'Sheesham Wall Wine Rack', cat: 'kitchen-bar', sub: 'wine-accessories', type: 'Bar Accessories', mat: 'Wood',
    finish: 'Dark sheesham', dim: '60 × 15 × 45 cm · 12 bottles', wt: '4.6 kg', price: 4490,
    imgs: ['stag-wine-rack', 'wine-caddy-brass'], stock: 5, rating: 4.7, reviews: 11, flags: 'f', tags: ['bar'],
    desc: 'A wall-mounted rack that stores twelve bottles on their side, with a slot rail beneath for hanging stemware.',
    details: ['Solid sheesham', 'Holds 12 bottles + 6 glasses', 'Wall fixings included'],
  },
  {
    name: 'Hammered Whisky Tumblers, Pair', cat: 'kitchen-bar', sub: 'wine-accessories', type: 'Bar Accessories', mat: 'Glass',
    finish: 'Hammered clear glass', dim: '300 ml · 9 cm high', wt: '0.7 kg', price: 1590,
    imgs: ['drink-dispenser-glass', 'bar-tool-tree-ice-bucket'], stock: 26, rating: 4.8, reviews: 40, flags: 'b', tags: ['bar', 'gifting'],
    desc: 'Heavy-bottomed tumblers with a hand-hammered texture that catches the light — for single malts and old fashioneds.',
    details: ['Heavy sham base', 'Mouth-blown', 'Set of two'],
  },
  {
    name: 'Ribbed Highball Glasses, Set of 4', cat: 'kitchen-bar', sub: 'wine-accessories', type: 'Bar Accessories', mat: 'Glass',
    finish: 'Fluted clear glass', dim: '400 ml · 14 cm high', wt: '1.2 kg', price: 1390,
    imgs: ['stag-drink-dispenser', 'drink-dispenser-glass'], stock: 31, rating: 4.5, reviews: 21, flags: 'n', tags: ['bar', 'hosting'],
    desc: 'Fluted highballs for mojitos, jaljeera spritzes and tall glasses of iced coffee.',
    details: ['Ribbed glass', 'Dishwasher safe', 'Set of four'],
  },

  // ——— Gifting
  {
    name: 'Festive Brass Gift Box', cat: 'gifting', sub: 'gift-boxes', type: 'Gift Sets', mat: 'Brass',
    finish: 'Black box, gold ribbon', dim: '32 × 32 × 12 cm box', wt: '2.4 kg', price: 3990, mrp: 4690,
    imgs: ['marble-lotus-box', 'carved-wood-boxes'], stock: 14, rating: 4.9, reviews: 37, flags: 'fb', tags: ['festive', 'brass', 'gifting'],
    desc: 'Our hand-beaten brass urli, a pair of brass tealight holders and a Mogra soy candle, boxed in matte black with gold ribbon.',
    details: ['Includes handwritten note card', 'Gift-wrapped in our studio', 'Ships in 2 business days'],
  },
  {
    name: 'Kitchen Edit Gift Hamper', cat: 'gifting', sub: 'gift-boxes', type: 'Gift Sets', mat: 'Wood',
    finish: 'Kraft box, twine', dim: '45 × 32 × 12 cm box', wt: '3.4 kg', price: 4490, mrp: 5190,
    imgs: ['marble-cheese-board-set', 'knife-block-brass'], stock: 9, rating: 4.8, reviews: 18, flags: 'n', tags: ['gifting', 'kitchen', 'housewarming'],
    desc: 'For the cook in your life: our end-grain chopping board, acacia pepper mill, and granite mortar & pestle in a kraft hamper.',
    details: ['Three full-size products', 'Includes care booklet', 'Personalised note available at checkout'],
  },
  {
    name: 'Diwali Glow Gift Box', cat: 'gifting', sub: 'gift-boxes', type: 'Gift Sets', mat: 'Glass',
    finish: 'Kraft box, dried florals', dim: '30 × 22 × 10 cm box', wt: '1.6 kg', price: 2990,
    imgs: ['marble-candle-tray', 'hurricane-candle-holder'], stock: 25, rating: 4.7, reviews: 44, flags: 'fb', tags: ['festive', 'gifting', 'candlelight'],
    desc: 'Our amber soy candle trio and smoked glass votives, nested in a kraft box with dried florals — light for the festival of lights.',
    details: ['Five pieces', 'Hand-tied with dried flowers', 'Ships in 2 business days'],
  },
  {
    name: 'Pink & Gold Celebration Box', cat: 'gifting', sub: 'decorative-gifts', type: 'Gift Sets', mat: 'Marble',
    finish: 'Pink box, gold satin ribbon', dim: '24 × 24 × 10 cm box', wt: '1.6 kg', price: 2490,
    imgs: ['marble-desk-clock', 'marble-lotus-box'], stock: 16, rating: 4.6, reviews: 12, tags: ['gifting', 'wedding'],
    desc: 'A joyful box for birthdays and bridal showers: marble coasters and a twin bud vase set, wrapped in blush and gold.',
    details: ['Two products', 'Gift message card', 'Wrapped by hand'],
  },
  {
    name: 'Housewarming Bonsai Gift', cat: 'gifting', sub: 'decorative-gifts', type: 'Gift Sets', mat: 'Ceramic',
    finish: 'Kraft wrap, satin ribbon', dim: '28 × 20 × 12 cm box', wt: '1.4 kg', price: 2290,
    imgs: ['marble-brass-planter', 'three-tier-wood-stand'], stock: 11, rating: 4.7, reviews: 16, flags: 'n', tags: ['gifting', 'housewarming', 'planter'],
    desc: 'A bonsai tray planter, a sage garden trowel and a care guide — a living gift for a new home. (Plant not included.)',
    details: ['Three pieces', 'Bonsai care guide', 'Wrapped by hand'],
  },
  {
    name: 'The Connoisseur Bar Collection', cat: 'gifting', sub: 'premium-gift-collections', type: 'Gift Sets', mat: 'Glass',
    finish: 'Red box, ivory ribbon', dim: '36 × 28 × 14 cm box', wt: '2.6 kg', price: 5490, mrp: 6290,
    imgs: ['stag-ice-bucket', 'bar-tool-tree-ice-bucket'], stock: 7, rating: 4.9, reviews: 21, flags: 'f', tags: ['gifting', 'bar', 'festive', 'wedding'],
    desc: 'Hammered whisky tumblers, marble coasters and a teak-handle bottle opener in a lacquered red presentation box.',
    details: ['Premium rigid box', 'Personalised note card', 'Corporate gifting available'],
  },
  {
    name: 'Heirloom Brass & Marble Collection', cat: 'gifting', sub: 'premium-gift-collections', type: 'Gift Sets', mat: 'Brass',
    finish: 'Black box, gold ribbon', dim: '40 × 30 × 16 cm box', wt: '4.8 kg', price: 8990, mrp: 10490,
    imgs: ['magnifier-paperweight-set', 'marble-desk-clock'], stock: 4, rating: 5, reviews: 9, flags: 'f', tags: ['gifting', 'brass', 'festive', 'wedding'],
    desc: 'Our finest pieces in one presentation box: hand-beaten brass urli, marble pedestal bowl and a pair of brass candlesticks.',
    details: ['Four heirloom pieces', 'Certificate of craft', 'White-glove delivery in metro cities'],
  },
];

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

const BASE_DATE = Date.UTC(2026, 10, 1);

export const PRODUCTS: Product[] = SEEDS.map((s, i) => {
  const id = `orv-${String(i + 1).padStart(3, '0')}`;
  // new arrivals are the most recent; everything else is spread over the past year
  const ageDays = s.flags?.includes('n') ? (i % 9) + 1 : 20 + ((i * 37) % 340);
  return {
    id,
    sku: `ORV-${s.cat === 'home-accessories' ? 'HA' : s.cat === 'kitchen-bar' ? 'KB' : 'GF'}-${String(i + 101)}`,
    slug: slugify(s.name),
    name: s.name,
    description: s.desc,
    details: s.details,
    category: s.cat,
    subCategory: s.sub,
    productType: s.type,
    material: s.mat,
    finish: s.finish,
    dimensions: s.dim,
    weight: s.wt,
    care: CARE[s.mat],
    price: s.price,
    originalPrice: s.mrp,
    images: s.imgs,
    availability: s.stock > 0,
    stock: s.stock,
    rating: s.rating,
    reviewCount: s.reviews,
    isFeatured: !!s.flags?.includes('f'),
    isBestSeller: !!s.flags?.includes('b'),
    isNewArrival: !!s.flags?.includes('n'),
    tags: s.tags,
    createdAt: new Date(BASE_DATE - ageDays * 86400000).toISOString(),
    // bestsellers rank first, then by review volume
    salesRank: (s.flags?.includes('b') ? 0 : 1000) - (s.reviews ?? 0),
  };
});

export const PRODUCT_BY_ID = new Map(PRODUCTS.map((p) => [p.id, p]));
export const PRODUCT_BY_SLUG = new Map(PRODUCTS.map((p) => [p.slug, p]));

export const PRICE_BOUNDS = {
  min: Math.floor(Math.min(...PRODUCTS.map((p) => p.price)) / 100) * 100,
  max: Math.ceil(Math.max(...PRODUCTS.map((p) => p.price)) / 500) * 500,
};
