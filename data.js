// Bin keys used across the app: wet | dry | ewaste | hazardous
const BINS = {
  wet: { key: 'wet', label: 'WET', full: 'WET / ORGANIC WASTE', emoji: '🟢', color: 'var(--green)' },
  dry: { key: 'dry', label: 'DRY', full: 'DRY / RECYCLABLE WASTE', emoji: '🟡', color: 'var(--mustard)' },
  ewaste: { key: 'ewaste', label: 'E-WASTE', full: 'E-WASTE (ELECTRONIC)', emoji: '🔵', color: 'var(--teal)' },
  hazardous: { key: 'hazardous', label: 'HAZARDOUS', full: 'HAZARDOUS HOUSEHOLD WASTE', emoji: '🟠', color: 'var(--terracotta)' },
}

const disclaimer =
  'Waste collection and recycling rules vary by location. Always follow your local waste-management guidelines.'

// Items for the "Where does this go?" identifier
const identifierItems = [
  {
    id: 'plastic-bottle', emoji: '🧴', name: 'Plastic Bottle', bin: 'dry',
    category: 'DRY / RECYCLABLE WASTE',
    disposal: 'Empty it, rinse it when appropriate, put the cap back on if your local rules say so, and keep it away from food waste.',
    reuse: 'Turn it into a self-watering planter, a pen holder, or a bird feeder.',
    recycling: 'Most PET and HDPE bottles can be recycled into fibre, containers or new bottles where facilities exist.',
    tip: 'Carry a reusable bottle — the best bottle is the one you never buy.',
    why: 'Plastic can persist in the environment for hundreds of years and breaks into microplastics. Clean, separated plastic is far more likely to actually get recycled.',
  },
  {
    id: 'banana-peel', emoji: '🍌', name: 'Banana Peel', bin: 'wet',
    category: 'WET / ORGANIC WASTE',
    disposal: 'Put it in the wet-waste bin or a home compost pile. Do not wrap it in plastic bags.',
    reuse: 'Chop and bury it near plants, or soak it in water for a few days to make a mild plant tonic.',
    recycling: 'Composting turns food scraps into nutrient-rich soil conditioner.',
    tip: 'Keep wet waste free of plastic, metal and glass so it can be composted.',
    why: 'When food waste is buried with mixed trash it rots without oxygen and releases methane, a powerful greenhouse gas. Composting avoids much of that.',
  },
  {
    id: 'cardboard-box', emoji: '📦', name: 'Cardboard Box', bin: 'dry',
    category: 'DRY / RECYCLABLE WASTE',
    disposal: 'Flatten it, remove tape and packing material, and keep it dry and free of grease.',
    reuse: 'Use it for storage, kids\' craft projects, or as garden mulch layers.',
    recycling: 'Clean cardboard is pulped and turned into new paper-based packaging.',
    tip: 'Greasy or food-soaked parts (like pizza-box bottoms) usually cannot be recycled — tear them off.',
    why: 'Recycling paper fibre saves trees, energy and water compared with making packaging from scratch.',
  },
  {
    id: 'glass-bottle', emoji: '🍾', name: 'Glass Bottle', bin: 'dry',
    category: 'DRY / RECYCLABLE WASTE (GLASS)',
    disposal: 'Empty and rinse it. Keep it whole and handle carefully. Many places collect glass separately.',
    reuse: 'Reuse as a vase, water carafe, or storage jar.',
    recycling: 'Glass can be melted and reformed again and again without losing quality.',
    tip: 'Broken window glass, mirrors and ceramics are different from bottle glass — do not mix them.',
    why: 'Glass is endlessly recyclable in principle, but only when it is sorted by colour and kept free of contaminants.',
  },
  {
    id: 'metal-can', emoji: '🥫', name: 'Metal Can', bin: 'dry',
    category: 'DRY / RECYCLABLE WASTE (METAL)',
    disposal: 'Empty and rinse it. Squash it only if your local scheme allows.',
    reuse: 'Make a desk organiser, a candle holder, or a herb planter (file sharp edges).',
    recycling: 'Aluminium and steel cans are melted and made into new metal products.',
    tip: 'Never put aerosol cans with leftover contents into ordinary bins — check local advice.',
    why: 'Recycling aluminium uses a small fraction of the energy needed to make it from raw ore.',
  },
  {
    id: 'old-phone', emoji: '📱', name: 'Old Phone', bin: 'ewaste',
    category: 'E-WASTE',
    disposal: 'Back up and wipe your data, then hand it to an authorized e-waste collection or recycling channel.',
    reuse: 'Donate or sell a working phone, or reuse it as a music player, camera or alarm clock.',
    recycling: 'Authorized recyclers recover metals like copper and other valuable materials and handle toxic parts safely.',
    tip: 'Do not leave unused phones in a drawer for years — working devices are most valuable when reused early.',
    why: 'Phones contain valuable metals as well as harmful substances. Informal burning or dumping harms workers and ecosystems.',
  },
  {
    id: 'battery', emoji: '🔋', name: 'Battery', bin: 'hazardous',
    category: 'HAZARDOUS / E-WASTE COLLECTION',
    disposal: 'Do not put it in regular household waste. Use a battery collection point or authorized facility. Tape the terminals of lithium batteries.',
    reuse: 'Switch to rechargeable batteries to cut how many you throw away.',
    recycling: 'Specialist facilities recover metals and safely treat chemicals.',
    tip: 'Damaged or swollen batteries are a fire risk — store them away from heat and take them to a collection point soon.',
    why: 'Batteries can leak toxic chemicals and cause fires in bins and waste trucks.',
  },
  {
    id: 'old-clothes', emoji: '👕', name: 'Old Clothes', bin: 'dry',
    category: 'DRY WASTE (TEXTILE) — REUSE FIRST',
    disposal: 'Wearable clothes can be donated. Worn-out textiles can go to textile collection or be reused as rags.',
    reuse: 'Upcycle into cleaning cloths, tote bags, cushion covers or patchwork.',
    recycling: 'Some textile recyclers turn fibres into insulation or new yarn where such programs exist.',
    tip: 'Repair a button or a seam before deciding to replace the whole garment.',
    why: 'Fashion has a big water and carbon footprint, and a huge amount of clothing ends up in landfill each year.',
  },
  {
    id: 'plastic-bag', emoji: '🛍️', name: 'Plastic Bag', bin: 'dry',
    category: 'DRY WASTE (SOFT PLASTIC)',
    disposal: 'Keep it clean and dry. Soft plastics are often handled differently from bottles — check your local rules.',
    reuse: 'Reuse for carrying or storage multiple times, or replace with a cloth bag.',
    recycling: 'Soft plastic often needs special collection; thin films can jam standard recycling machinery.',
    tip: 'Refuse: say "no bag" for small purchases and keep a foldable cloth bag with you.',
    why: 'Light plastic bags travel easily with wind and water and can harm animals and block drains.',
  },
  {
    id: 'newspaper', emoji: '📰', name: 'Newspaper', bin: 'dry',
    category: 'DRY / RECYCLABLE WASTE',
    disposal: 'Keep it dry and bundle it with other clean paper.',
    reuse: 'Use it to wrap gifts, clean windows, or as packing material.',
    recycling: 'Paper fibres can be recycled several times into new paper products.',
    tip: 'Wet or heavily soiled paper is harder to recycle — it may be better composted if untreated.',
    why: 'Recycling paper reduces demand for fresh pulp and the energy used to make it.',
  },
]

// The seven waste categories
const wasteCategories = [
  {
    id: 'wet', num: '01', title: 'WET WASTE', icon: '🍎', color: 'green',
    desc: 'Biodegradable kitchen and garden waste that can rot naturally.',
    examples: ['Vegetable peels', 'Fruit waste', 'Food leftovers', 'Tea/coffee waste'],
    more: {
      how: 'Collect in a separate bin, drain excess liquid and compost at home or give it to a municipal composting stream.',
      avoid: 'Plastic bags, metal, glass, or non-biodegradable packaging.',
      fact: 'Composting can shrink kitchen waste dramatically and gives you free fertiliser.',
    },
  },
  {
    id: 'dry', num: '02', title: 'DRY WASTE', icon: '📰', color: 'mustard',
    desc: 'Non-biodegradable items that are clean and dry and can often be recycled.',
    examples: ['Paper', 'Cardboard', 'Clean packaging', 'Newspapers'],
    more: {
      how: 'Keep it clean, dry and flat. Separate paper from plastics where possible.',
      avoid: 'Greasy or food-soaked paper, used tissues, and wet material.',
      fact: 'Recycled paper fibres can often be reused five to seven times.',
    },
  },
  {
    id: 'plastic', num: '03', title: 'PLASTIC', icon: '🧴', color: 'terracotta',
    desc: 'Lightweight, long-lasting material in many different types and grades.',
    examples: ['Bottles', 'Containers', 'Plastic packaging'],
    more: {
      how: 'Empty, rinse and dry. Check the resin number and your local scheme to see what is accepted.',
      avoid: 'Assuming every plastic is recyclable. Different plastics are processed differently.',
      fact: 'Not all plastics follow the same recycling stream — that is why labels and local rules matter.',
    },
  },
  {
    id: 'glass', num: '04', title: 'GLASS', icon: '🍾', color: 'teal',
    desc: 'Bottles and jars that can be melted and remade again and again.',
    examples: ['Glass bottles', 'Jars', 'Containers'],
    more: {
      how: 'Rinse, remove lids and keep colours separate if your local system asks for it.',
      avoid: 'Mirrors, drinking glasses, ceramics and light bulbs — they melt differently.',
      fact: 'Glass can be recycled repeatedly without losing quality.',
    },
  },
  {
    id: 'metal', num: '05', title: 'METAL', icon: '🥫', color: 'olive',
    desc: 'Cans and scrap that retain their value when melted and reshaped.',
    examples: ['Aluminium cans', 'Metal containers', 'Scrap metal'],
    more: {
      how: 'Rinse food cans and keep metal separate from other material. Scrap can go to scrap dealers.',
      avoid: 'Cans with hazardous residue, such as paint or pressurised aerosols with contents.',
      fact: 'Recycled aluminium needs far less energy than new aluminium from ore.',
    },
  },
  {
    id: 'ewaste', num: '06', title: 'E-WASTE', icon: '📱', color: 'teal',
    desc: 'Discarded electrical and electronic equipment with valuable and harmful materials.',
    examples: ['Mobile phones', 'Chargers', 'Keyboards', 'Batteries', 'Electronic components'],
    more: {
      how: 'Use authorized e-waste collection or take-back programs. Wipe personal data first.',
      avoid: 'Throwing electronics in regular bins, burning cables, or selling to unknown scrap handlers.',
      fact: 'E-waste contains recoverable metals but also substances that must be handled safely.',
    },
  },
  {
    id: 'hazardous', num: '07', title: 'HAZARDOUS HOUSEHOLD WASTE', icon: '🧪', color: 'brown',
    desc: 'Household products that can burn, poison or pollute if disposed of the wrong way.',
    examples: ['Paint containers', 'Chemicals', 'Certain batteries', 'Cleaning chemicals'],
    more: {
      how: 'Keep in original containers, do not mix, and drop at an authorized hazardous-waste collection point.',
      avoid: 'Pouring down drains, burning, or putting in ordinary household bins.',
      fact: 'Mixing some household chemicals can create dangerous fumes — never mix them to "get rid" of them.',
    },
  },
]

const mistakes = [
  {
    myth: 'Food-covered cardboard is recyclable without cleaning.',
    reality: 'Grease and food contaminate paper fibre. Tear off the clean part to recycle and compost or bin the soiled part.',
  },
  {
    myth: 'Batteries are normal household waste.',
    reality: 'Batteries can leak chemicals and start fires. Take them to a battery or e-waste collection point.',
  },
  {
    myth: 'Broken electronics are regular dry waste.',
    reality: 'Electronics belong in e-waste. Use authorized collection or recycling channels.',
  },
  {
    myth: 'Glass items are automatically recyclable everywhere.',
    reality: 'Bottles and jars often are, but mirrors, ceramics and bulbs are not. Local rules differ.',
  },
  {
    myth: 'All plastics belong in the same recycling stream.',
    reality: 'Plastics come in many types, and local facilities accept different ones. Check labels and local guidance.',
  },
  {
    myth: 'Throwing recyclables in a bag helps keep them tidy.',
    reality: 'Bagged recyclables are often rejected by sorting facilities. Keep them loose, clean and dry unless told otherwise.',
  },
]

const ewasteItems = [
  { emoji: '📱', name: 'Phones' },
  { emoji: '💻', name: 'Laptops' },
  { emoji: '🔌', name: 'Chargers' },
  { emoji: '⌨️', name: 'Keyboards' },
  { emoji: '🎧', name: 'Headphones' },
  { emoji: '🔋', name: 'Batteries' },
]

const ewasteChecklist = [
  'Back up important data',
  'Remove personal accounts',
  'Follow appropriate device-reset guidance',
  'Separate batteries where applicable',
  'Find an authorized collection/recycling option',
]

const ecoChallenges = [
  { id: 'c1', title: 'Avoid a single-use plastic item', tip: 'Say no to the straw, bag or cutlery today.' },
  { id: 'c2', title: 'Carry a reusable bottle', tip: 'Fill it before leaving home.' },
  { id: 'c3', title: 'Separate wet and dry waste', tip: 'Use two containers in the kitchen.' },
  { id: 'c4', title: 'Reuse an old container', tip: 'Jars and tubs make great storage.' },
  { id: 'c5', title: 'Learn how to dispose of e-waste correctly', tip: 'Find your nearest authorized collection point.' },
]

const loopSteps = [
  { id: 'refuse', title: 'REFUSE', icon: '✋', text: 'Avoid unnecessary single-use items.' },
  { id: 'reduce', title: 'REDUCE', icon: '🛒', text: 'Buy only what you need.' },
  { id: 'reuse', title: 'REUSE', icon: '🫙', text: 'Give products another life.' },
  { id: 'repair', title: 'REPAIR', icon: '🔧', text: 'Fix before replacing.' },
  { id: 'recycle', title: 'RECYCLE', icon: '♻️', text: 'Separate materials correctly.' },
]

const demoStats = [
  { value: 1250, suffix: '+', label: 'Items Sorted' },
  { value: 840, suffix: '+', label: 'Eco Challenges Completed' },
  { value: 72, suffix: '%', label: 'Average Sorting Score' },
  { value: 350, suffix: '+', label: 'Eco Tips Explored' },
]
// Items for the sorting games. bin: wet | dry | ewaste | hazardous
const gameItems = [
  { id: 'g1', emoji: '🧴', name: 'Plastic Bottle', bin: 'dry', why: 'Clean plastic packaging is dry/recyclable waste.' },
  { id: 'g2', emoji: '🍌', name: 'Banana Peel', bin: 'wet', why: 'Food scraps are biodegradable wet waste that can be composted.' },
  { id: 'g3', emoji: '📦', name: 'Cardboard Box', bin: 'dry', why: 'Clean cardboard is recyclable dry waste.' },
  { id: 'g4', emoji: '🍾', name: 'Glass Bottle', bin: 'dry', why: 'Glass is dry waste and is usually recycled separately.' },
  { id: 'g5', emoji: '🥫', name: 'Metal Can', bin: 'dry', why: 'Clean metal cans are recyclable dry waste.' },
  { id: 'g6', emoji: '📱', name: 'Old Phone', bin: 'ewaste', why: 'Electronics are e-waste and need authorized collection.' },
  { id: 'g7', emoji: '🔋', name: 'Used Battery', bin: 'hazardous', why: 'Batteries contain chemicals and need a special collection point.' },
  { id: 'g8', emoji: '🍎', name: 'Apple Core', bin: 'wet', why: 'Fruit waste is wet, compostable waste.' },
  { id: 'g9', emoji: '🔌', name: 'Phone Charger', bin: 'ewaste', why: 'Chargers and cables are electronic waste.' },
  { id: 'g10', emoji: '🎨', name: 'Paint Can (with paint)', bin: 'hazardous', why: 'Leftover paint is hazardous household waste.' },
  { id: 'g11', emoji: '📰', name: 'Newspaper', bin: 'dry', why: 'Clean paper is dry recyclable waste.' },
  { id: 'g12', emoji: '☕', name: 'Used Tea Leaves', bin: 'wet', why: 'Tea and coffee waste is compostable wet waste.' },
  { id: 'g13', emoji: '⌨️', name: 'Broken Keyboard', bin: 'ewaste', why: 'Broken electronics are e-waste.' },
  { id: 'g14', emoji: '🧽', name: 'Drain Cleaner Bottle', bin: 'hazardous', why: 'Strong cleaning chemicals are hazardous waste.' },
  { id: 'g15', emoji: '🥕', name: 'Carrot Peels', bin: 'wet', why: 'Vegetable peels are wet waste.' },
  { id: 'g16', emoji: '🎧', name: 'Old Earphones', bin: 'ewaste', why: 'Earphones are small electronics: e-waste.' },
  { id: 'g17', emoji: '🥛', name: 'Clean Milk Carton', bin: 'dry', why: 'Rinsed cartons are dry packaging waste.' },
  { id: 'g18', emoji: '🍞', name: 'Stale Bread', bin: 'wet', why: 'Leftover food is wet waste.' },
  { id: 'g19', emoji: '💡', name: 'CFL Bulb', bin: 'hazardous', why: 'CFL bulbs contain mercury and need special handling.' },
  { id: 'g20', emoji: '🖱️', name: 'Computer Mouse', bin: 'ewaste', why: 'Computer accessories are e-waste.' },
]

const shuffle = (arr) => {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const ROUND_LENGTH = 10
const CHALLENGE_SECONDS = 30
const quizQuestions = [
  {
    q: 'What should you do before recycling a food container?',
    options: ['Throw it immediately', 'Clean/rinse it when appropriate', 'Put it with wet waste', 'Burn it'],
    answer: 1,
    explain: 'Food residue can contaminate other recyclables. A quick rinse (when appropriate) helps keep materials recyclable. Never burn waste.',
  },
  {
    q: 'Where should used batteries go?',
    options: ['Regular household bin', 'Wet waste bin', 'A battery or e-waste collection point', 'Down the drain'],
    answer: 2,
    explain: 'Batteries contain chemicals and can cause fires. Use authorized collection points.',
  },
  {
    q: 'Which is an example of WET waste?',
    options: ['Newspaper', 'Banana peel', 'Glass jar', 'Old charger'],
    answer: 1,
    explain: 'Wet waste is biodegradable food and garden waste, such as peels and leftovers.',
  },
  {
    q: 'Which of the "5 Rs" comes first and means avoiding unnecessary single-use items?',
    options: ['Recycle', 'Repair', 'Refuse', 'Reuse'],
    answer: 2,
    explain: 'Refuse is the first step: the best waste is the waste that is never created.',
  },
  {
    q: 'What is the safest thing to do before giving away an old phone?',
    options: ['Nothing — it is just a phone', 'Back up data, remove accounts and reset it', 'Break the screen', 'Bury it'],
    answer: 1,
    explain: 'Back up what you need, sign out of accounts and follow device-reset guidance to protect your privacy.',
  },
  {
    q: 'Are recycling rules the same in every city?',
    options: ['Yes, everywhere', 'No, they vary by location', 'Only for glass', 'Only for paper'],
    answer: 1,
    explain: 'Rules vary by location. Always follow your local waste-management guidance.',
  },
  {
    q: 'Why should wet waste be kept separate from dry waste?',
    options: [
      'It looks tidier',
      'So wet waste can be composted and dry waste stays clean for recycling',
      'It makes bins heavier',
      'There is no reason',
    ],
    answer: 1,
    explain: 'Mixing contaminates recyclables, and food waste is best composted rather than landfilled.',
  },
  {
    q: 'What is the best action for a torn shirt that is otherwise good?',
    options: ['Throw it in the wet bin', 'Burn it', 'Repair or reuse it first', 'Flush it'],
    answer: 2,
    explain: 'Repair and reuse keep materials in use longer and reduce waste.',
  },
  {
    q: 'Which item is hazardous household waste?',
    options: ['Leftover paint', 'Vegetable peel', 'Clean cardboard', 'Clean paper'],
    answer: 0,
    explain: 'Paint and similar chemicals should be taken to authorized hazardous-waste collection.',
  },
  {
    q: 'Why is composting good for the environment?',
    options: [
      'It makes plastic disappear',
      'It turns food waste into soil nutrients and reduces methane from landfills',
      'It increases waste',
      'It repairs electronics',
    ],
    answer: 1,
    explain: 'Composting returns nutrients to the soil and avoids much of the methane produced when food rots in landfills.',
  },
]
