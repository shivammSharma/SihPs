import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

// ---------- FOOD KNOWLEDGE BASE (25 ITEMS) ----------

const foodDatabase = [
  // Dairy
  {
    value: 'milk',
    label: 'Milk (Cow)',
    category: 'dairy',
    taste: ['sweet'],
    virya: 'cooling',
    heaviness: 'heavy',
    gi: 'low',
    tags: ['animalDairy', 'protein', 'liquid', 'sweet'],
    avoidWithTags: ['fish', 'meat', 'sourFruit'],
    ayurvedaNote:
      'Best taken warm, alone, not mixed with sour fruits, fish, or salty foods. Nourishing for ojas.',
    modernNote:
      'Good source of protein and calcium; may cause issues in lactose intolerance or dairy allergy.'
  },
  {
    value: 'yogurt',
    label: 'Yogurt (Curd)',
    category: 'dairy',
    taste: ['sour'],
    virya: 'heating',
    heaviness: 'heavy',
    gi: 'medium',
    tags: ['fermented', 'probiotic', 'animalDairy'],
    avoidWithTags: ['fish', 'fruit'],
    ayurvedaNote:
      'Heavy and heating; generally avoided at night and not combined with fruits or fish.',
    modernNote: 'Provides probiotics; pairing with sugary fruits increases sugar load.'
  },
  {
    value: 'ghee',
    label: 'Ghee',
    category: 'fat',
    taste: ['sweet'],
    virya: 'cooling',
    heaviness: 'heavy',
    gi: 'none',
    tags: ['fat', 'clarifiedButter'],
    avoidWithTags: [],
    ayurvedaNote:
      'Considered sattvic; supports agni and tissues when used in moderation.',
    modernNote:
      'Rich in saturated fats; moderation is key especially in metabolic syndrome.'
  },
  {
    value: 'cheese',
    label: 'Cheese (Hard)',
    category: 'dairy',
    taste: ['salty', 'sour'],
    virya: 'heating',
    heaviness: 'heavy',
    gi: 'low',
    tags: ['animalDairy', 'salted', 'fat', 'fermented'],
    avoidWithTags: ['fish'],
    ayurvedaNote:
      'Heavy, kapha-increasing; best minimized in congestion and high cholesterol.',
    modernNote:
      'High in saturated fat and sodium; excessive intake linked with heart risk.'
  },

  // Animal protein
  {
    value: 'fish',
    label: 'Fish',
    category: 'animalProtein',
    taste: ['salty', 'sweet'],
    virya: 'heating',
    heaviness: 'medium',
    gi: 'none',
    tags: ['fish', 'protein'],
    avoidWithTags: ['animalDairy'],
    ayurvedaNote:
      'Classically incompatible with milk and other dairy due to blood impurity risk.',
    modernNote:
      'Good omega-3 source; combining with heavy cream-based sauces increases fat load.'
  },
  {
    value: 'chicken',
    label: 'Chicken',
    category: 'animalProtein',
    taste: ['sweet', 'salty'],
    virya: 'heating',
    heaviness: 'medium',
    gi: 'none',
    tags: ['meat', 'protein'],
    avoidWithTags: ['milk'],
    ayurvedaNote:
      'Nourishing but heating; excess may aggravate pitta and ama if digestion is weak.',
    modernNote: 'Lean protein if grilled/boiled; deep frying adds unhealthy fats.'
  },
  {
    value: 'egg',
    label: 'Egg',
    category: 'animalProtein',
    taste: ['sweet'],
    virya: 'heating',
    heaviness: 'medium',
    gi: 'none',
    tags: ['meat', 'protein'],
    avoidWithTags: ['milk', 'yogurt'],
    ayurvedaNote:
      'Heavy and heating; better taken alone, not with dairy in sensitive individuals.',
    modernNote:
      'Rich in protein and micronutrients; cholesterol concerns depend on overall diet.'
  },

  // Grains
  {
    value: 'rice',
    label: 'Rice (White)',
    category: 'grain',
    taste: ['sweet'],
    virya: 'cooling',
    heaviness: 'medium',
    gi: 'high',
    tags: ['carb', 'refined'],
    avoidWithTags: [],
    ayurvedaNote:
      'Easy to digest; suitable for most but can increase kapha in excess.',
    modernNote:
      'High glycemic index; pairing with fiber and protein helps blunt sugar spikes.'
  },
  {
    value: 'brownRice',
    label: 'Rice (Brown)',
    category: 'grain',
    taste: ['sweet'],
    virya: 'warming',
    heaviness: 'medium',
    gi: 'medium',
    tags: ['carb', 'wholeGrain', 'fiberRich'],
    avoidWithTags: [],
    ayurvedaNote:
      'Heavier than white rice; better for stronger digestion, supports sustained energy.',
    modernNote:
      'More fiber and micronutrients; better for blood sugar and satiety.'
  },
  {
    value: 'wheat',
    label: 'Whole Wheat',
    category: 'grain',
    taste: ['sweet'],
    virya: 'warming',
    heaviness: 'heavy',
    gi: 'medium',
    tags: ['carb', 'wholeGrain', 'gluten'],
    avoidWithTags: [],
    ayurvedaNote:
      'Strength-building but kapha-increasing when in excess or in sedentary lifestyle.',
    modernNote: 'Whole wheat provides fiber; problematic in gluten sensitivity.'
  },

  // Legumes
  {
    value: 'lentils',
    label: 'Lentils (Dal)',
    category: 'legume',
    taste: ['astringent'],
    virya: 'heating',
    heaviness: 'light',
    gi: 'low',
    tags: ['plantProtein', 'fiberRich'],
    avoidWithTags: [],
    ayurvedaNote:
      'Light and drying; good for kapha, may aggravate vata without ghee/spices.',
    modernNote:
      'High in fiber and protein; supports metabolic and gut health.'
  },
  {
    value: 'chickpeas',
    label: 'Chickpeas',
    category: 'legume',
    taste: ['sweet', 'astringent'],
    virya: 'heating',
    heaviness: 'medium',
    gi: 'low',
    tags: ['plantProtein', 'fiberRich'],
    avoidWithTags: [],
    ayurvedaNote:
      'Drying and gas-forming for some; soaking and spices improve digestibility.',
    modernNote:
      'Great fiber and plant protein; supports satiety and blood sugar control.'
  },

  // Fruits
  {
    value: 'banana',
    label: 'Banana (Ripe)',
    category: 'fruit',
    taste: ['sweet'],
    virya: 'cooling',
    heaviness: 'heavy',
    gi: 'medium',
    tags: ['fruit', 'sweetFruit'],
    avoidWithTags: ['animalDairy'],
    ayurvedaNote:
      'Heavy and kapha-increasing; classically not mixed with milk or yogurt.',
    modernNote:
      'Potassium rich; with milk/yogurt becomes calorie dense and may spike sugar in some.'
  },
  {
    value: 'apple',
    label: 'Apple',
    category: 'fruit',
    taste: ['sweet', 'astringent'],
    virya: 'cooling',
    heaviness: 'light',
    gi: 'low',
    tags: ['fruit', 'fiberRich'],
    avoidWithTags: [],
    ayurvedaNote:
      'Generally tridosha-friendly, especially baked/warmed for vata.',
    modernNote: 'Good fiber source, supports gut and heart health.'
  },
  {
    value: 'lemon',
    label: 'Lemon',
    category: 'fruit',
    taste: ['sour'],
    virya: 'heating',
    heaviness: 'light',
    gi: 'low',
    tags: ['sourFruit', 'citrus'],
    avoidWithTags: ['milk'],
    ayurvedaNote:
      'Enhances agni; not mixed with milk as it can curdle and disturb digestion.',
    modernNote:
      'Vitamin C rich; with milk can cause curdling but generally safe as long as digestion tolerates.'
  },
  {
    value: 'pomegranate',
    label: 'Pomegranate',
    category: 'fruit',
    taste: ['sweet', 'astringent'],
    virya: 'cooling',
    heaviness: 'light',
    gi: 'low',
    tags: ['fruit', 'antioxidant'],
    avoidWithTags: [],
    ayurvedaNote:
      'Highly praised; balances all three doshas when moderately sweet.',
    modernNote:
      'Rich in polyphenols; beneficial for cardiovascular health.'
  },
  {
    value: 'mango',
    label: 'Mango (Ripe)',
    category: 'fruit',
    taste: ['sweet'],
    virya: 'heating',
    heaviness: 'medium',
    gi: 'medium',
    tags: ['fruit', 'sweetFruit'],
    avoidWithTags: ['yogurt', 'fish'],
    ayurvedaNote:
      'Ojas-building when ripe and taken alone; avoid mixing with heavy proteins/fish.',
    modernNote: 'High natural sugar; best balanced with fiber-rich foods.'
  },

  // Vegetables
  {
    value: 'spinach',
    label: 'Spinach',
    category: 'vegetable',
    taste: ['bitter', 'astringent'],
    virya: 'heating',
    heaviness: 'light',
    gi: 'low',
    tags: ['leafyGreen', 'fiberRich'],
    avoidWithTags: [],
    ayurvedaNote:
      'Reduces pitta in moderation; excess raw can aggravate vata.',
    modernNote:
      'Iron, folate, and phytonutrient rich; oxalates may affect kidney stone-prone individuals.'
  },
  {
    value: 'potato',
    label: 'Potato (White)',
    category: 'vegetable',
    taste: ['sweet'],
    virya: 'cooling',
    heaviness: 'heavy',
    gi: 'high',
    tags: ['starchyVeg', 'carb'],
    avoidWithTags: [],
    ayurvedaNote:
      'Increases kapha and vata when fried or eaten in excess.',
    modernNote:
      'High glycemic; deep frying adds unhealthy fats.'
  },
  {
    value: 'tomato',
    label: 'Tomato',
    category: 'vegetable',
    taste: ['sour'],
    virya: 'heating',
    heaviness: 'light',
    gi: 'low',
    tags: ['nightshade', 'sourFruit'],
    avoidWithTags: ['milk'],
    ayurvedaNote:
      'Pitta-aggravating in sensitive individuals; often avoided in high inflammation.',
    modernNote:
      'Lycopene rich; acidity can trigger reflux in some.'
  },
  {
    value: 'broccoli',
    label: 'Broccoli',
    category: 'vegetable',
    taste: ['bitter', 'pungent'],
    virya: 'cooling',
    heaviness: 'light',
    gi: 'low',
    tags: ['cruciferous', 'fiberRich'],
    avoidWithTags: [],
    ayurvedaNote:
      'Can increase vata if eaten raw; better cooked with oil and spices.',
    modernNote:
      'Cruciferous compounds support detox and may reduce cancer risk.'
  },

  // Nuts & seeds
  {
    value: 'almonds',
    label: 'Almonds (Soaked)',
    category: 'nut',
    taste: ['sweet'],
    virya: 'heating',
    heaviness: 'medium',
    gi: 'low',
    tags: ['nut', 'fat'],
    avoidWithTags: [],
    ayurvedaNote:
      'Soaked and peeled almonds are considered sattvic and brain-nourishing.',
    modernNote:
      'Healthy fats and vitamin E; energy dense so portion control matters.'
  },
  {
    value: 'walnuts',
    label: 'Walnuts',
    category: 'nut',
    taste: ['bitter', 'astringent'],
    virya: 'heating',
    heaviness: 'medium',
    gi: 'low',
    tags: ['nut', 'omega3'],
    avoidWithTags: [],
    ayurvedaNote:
      'Warming; best in small amounts, especially in colder seasons.',
    modernNote: 'Cardio-protective omega-3 fats; useful in moderation.'
  },
  {
    value: 'sesame',
    label: 'Sesame Seeds',
    category: 'seed',
    taste: ['sweet', 'bitter'],
    virya: 'heating',
    heaviness: 'medium',
    gi: 'low',
    tags: ['seed', 'calciumRich'],
    avoidWithTags: [],
    ayurvedaNote:
      'Very warming and nourishing; used in vata disorders and cold climates.',
    modernNote: 'Mineral rich; may be allergenic for some.'
  },

  // Oils / sweets / extras
  {
    value: 'honey',
    label: 'Honey (Raw)',
    category: 'sweetener',
    taste: ['sweet', 'astringent'],
    virya: 'heating',
    heaviness: 'light',
    gi: 'high',
    tags: ['sweetener'],
    avoidWithTags: [],
    ayurvedaNote:
      'Should never be heated; used in small amounts to scrape kapha.',
    modernNote:
      'High in sugar; slightly lower GI than white sugar but still raises blood glucose.'
  },
  {
    value: 'sugar',
    label: 'Sugar (Refined)',
    category: 'sweetener',
    taste: ['sweet'],
    virya: 'cooling',
    heaviness: 'light',
    gi: 'high',
    tags: ['sweetener', 'refined'],
    avoidWithTags: [],
    ayurvedaNote:
      'Considered less wholesome than jaggery; increases kapha and ama in excess.',
    modernNote:
      'High glycemic and strongly linked to metabolic issues when overused.'
  },
  {
    value: 'oliveOil',
    label: 'Olive Oil',
    category: 'fat',
    taste: ['bitter'],
    virya: 'heating',
    heaviness: 'medium',
    gi: 'none',
    tags: ['fat', 'monounsaturated'],
    avoidWithTags: [],
    ayurvedaNote:
      'Mildly heating; generally acceptable, particularly for pitta-kapha types in moderation.',
    modernNote:
      'Heart-healthy monounsaturated fat, beneficial in Mediterranean-style patterns.'
  }
];

const foodOptions = foodDatabase.map((f) => ({
  value: f.value,
  label: f.label
}));

// ---------- SEASON OPTIONS ----------

const seasonOptions = [
  { value: 'spring', label: 'Spring (March–May)' },
  { value: 'summer', label: 'Summer (June–August)' },
  { value: 'autumn', label: 'Autumn (September–November)' },
  { value: 'winter', label: 'Winter (December–February)' }
];

// ---------- HELPER FUNCTIONS FOR COMPATIBILITY ----------

const getFoodByValue = (value) =>
  foodDatabase.find((f) => f.value === value) || null;

const isHeating = (virya) => virya === 'heating' || virya === 'warming';
const isCooling = (virya) => virya === 'cooling';

const heavinessScore = {
  light: 1,
  medium: 2,
  heavy: 3
};
const giScore = {
  low: 1,
  medium: 2,
  high: 3,
  none: 0
};

/**
 * Evaluate compatibility between two foods using:
 * - Ayurvedic rules (virya, heaviness, classical incompatibilities)
 * - Modern nutrition (GI, sugar+fat load)
 *
 * Exported so ayurBotEngine.js can reuse it.
 */
export const evaluateCompatibility = (valueA, valueB) => {
  const a = getFoodByValue(valueA);
  const b = getFoodByValue(valueB);

  if (!a || !b) {
    return {
      level: 'caution',
      score: 50,
      summary: 'Insufficient data',
      reason:
        'One of the selected items is missing in the knowledge base. Use personal discretion.',
      recommendation:
        'Combine with awareness and observe how your digestion and energy respond.'
    };
  }

  let score = 80; // start from "generally okay"
  const issues = [];
  const positives = [];

  // 1. Classical incompatibilities via tags
  const tagIntersection = (tags1, tags2) =>
    tags1?.some((t) => tags2?.includes(t));

  const aAvoidsB =
    a.avoidWithTags && tagIntersection(a.avoidWithTags, b.tags || []);
  const bAvoidsA =
    b.avoidWithTags && tagIntersection(b.avoidWithTags, a.tags || []);

  let isStrongAvoid = false;

  if (aAvoidsB || bAvoidsA) {
    score -= 40;
    isStrongAvoid = true;
    issues.push(
      'Classically considered a viruddha ahara (incompatible combination) in Ayurveda.'
    );
  }

  // 2. Virya mismatch (heating vs cooling)
  if (isHeating(a.virya) && isCooling(b.virya)) {
    score -= 10;
    issues.push(
      `${a.label} is heating while ${b.label} is cooling, which may confuse digestive fire in sensitive people.`
    );
  } else if (isCooling(a.virya) && isHeating(b.virya)) {
    score -= 10;
    issues.push(
      `${a.label} is cooling while ${b.label} is heating, creating a mixed signal for agni.`
    );
  } else {
    positives.push(
      'Their thermal (virya) nature is reasonably aligned, which supports smoother digestion.'
    );
    score += 5;
  }

  // 3. Heaviness synergy
  const heavyA = heavinessScore[a.heaviness] || 2;
  const heavyB = heavinessScore[b.heaviness] || 2;

  if (heavyA + heavyB >= 5) {
    score -= 10;
    issues.push(
      'Both foods are relatively heavy, which can slow digestion, especially at night or in low activity.'
    );
  } else if (heavyA === 1 && heavyB === 1) {
    positives.push('Both are light and generally easier to digest together.');
    score += 5;
  }

  // 4. Glycemic / metabolic load (modern science)
  const giA = giScore[a.gi] || 0;
  const giB = giScore[b.gi] || 0;

  if (giA + giB >= 5) {
    score -= 10;
    issues.push(
      'The combined glycemic load is relatively high, which may spike blood sugar in sensitive individuals.'
    );
  } else if (giA + giB <= 2) {
    positives.push(
      'The combined glycemic impact is modest, which is supportive for metabolic balance.'
    );
    score += 5;
  }

  // 5. Fat + sugar load (modern science)
  const sweetTagCombo =
    (a.tags || []).includes('sweetener') || (b.tags || []).includes('sweetener');
  const fatTagCombo =
    (a.tags || []).includes('fat') ||
    (a.tags || []).includes('clarifiedButter') ||
    (b.tags || []).includes('fat') ||
    (b.tags || []).includes('clarifiedButter');

  if (sweetTagCombo && fatTagCombo) {
    score -= 8;
    issues.push(
      'Rich combination of sugar and fat can be very dense in calories and may promote weight gain if frequent.'
    );
  }

  // 6. Mixed animal protein + dairy (classical + modern)
  const isDairyA = (a.tags || []).includes('animalDairy');
  const isDairyB = (b.tags || []).includes('animalDairy');
  const isMeatA =
    (a.tags || []).includes('meat') || (a.tags || []).includes('fish');
  const isMeatB =
    (b.tags || []).includes('meat') || (b.tags || []).includes('fish');

  if ((isDairyA && isMeatB) || (isDairyB && isMeatA)) {
    score -= 20;
    issues.push(
      'Combination of dairy with meat/fish is generally discouraged in Ayurveda and can feel heavy for digestion.'
    );
    isStrongAvoid =
      isStrongAvoid ||
      (isDairyA && (b.tags || []).includes('fish')) ||
      (isDairyB && (a.tags || []).includes('fish'));
  }

  // Clip score into 0–100
  if (score > 100) score = 100;
  if (score < 0) score = 0;

  // Determine level
  let level = 'good';
  if (score < 50 || isStrongAvoid) {
    level = 'avoid';
  } else if (score < 75) {
    level = 'caution';
  }

  // Compose summary / reason / recommendation
  let summary;
  if (level === 'good') {
    summary = 'Generally compatible combination';
  } else if (level === 'caution') {
    summary = 'Use this combination with caution';
  } else {
    summary = 'Better to avoid this combination';
  }

  const reasonParts = [];
  if (issues.length) reasonParts.push(issues.join(' '));
  if (positives.length) reasonParts.push('Positive notes: ' + positives.join(' '));

  const reason =
    reasonParts.join(' ') ||
    'This combination does not show any major red flags based on the current rules.';

  let recommendation;
  if (level === 'avoid') {
    recommendation =
      'Prefer to avoid this pair, especially regularly. If you do have them together, keep quantity small and observe how your body responds.';
  } else if (level === 'caution') {
    recommendation =
      'You can use this combination occasionally, preferably at lunchtime with good appetite and light accompaniments.';
  } else {
    recommendation =
      'This looks compatible for most people. Still, keep portions balanced and notice your digestion and energy levels.';
  }

  return {
    level,
    score,
    summary,
    reason,
    recommendation
  };
};

// ---------- SEASONAL WELLNESS (DYNAMIC) ----------

export const getSeasonalGuidance = (season, dosha = 'vata') => {
  const guidance = {
    spring: {
      vata: {
        focus: 'Detoxification and lightening Kapha',
        foods: [
          'Light, warm vegetable soups',
          'Bitter greens (methi, mustard leaves)',
          'Spices like turmeric, ginger, black pepper',
          'Warm water with lemon and honey (if suitable)'
        ],
        avoid: [
          'Deep-fried snacks',
          'Cold dairy desserts',
          'Heavy sweets',
          'Refrigerated foods'
        ],
        lifestyle: [
          'Early morning brisk walk or yoga',
          'Dry brushing to stimulate lymph',
          'Gentle pranayama and meditation'
        ]
      }
    },
    summer: {
      vata: {
        focus: 'Cooling, hydration and protecting Pitta',
        foods: [
          'Sweet juicy fruits (watermelon, grapes, pomegranate)',
          'Coconut water',
          'Cucumber, mint, coriander chutneys',
          'Ghee in small amounts instead of very spicy oils'
        ],
        avoid: [
          'Very spicy, oily foods',
          'Alcohol and excess caffeine',
          'Eating in direct sun',
          'Skipping hydration'
        ],
        lifestyle: [
          'Avoid midday sun; choose morning/evening exercise',
          'Light cotton clothing',
          'Cooling pranayama (sheetali / sheetkari)'
        ]
      }
    },
    autumn: {
      vata: {
        focus: 'Grounding and calming mobile Vata',
        foods: [
          'Warm, moist foods like kichdi',
          'Root veggies with ghee or sesame oil',
          'Stewed fruits instead of raw',
          'Spices like cumin, fennel, ginger'
        ],
        avoid: [
          'Cold salads from the fridge',
          'Dry snacks (chips, popcorn in excess)',
          'Skipping meals',
          'Irregular sleep routine'
        ],
        lifestyle: [
          'Regular routine for meals and sleep',
          'Oil abhyanga with warm sesame oil',
          'Slow, grounding yoga and walks'
        ]
      }
    },
    winter: {
      vata: {
        focus: 'Nourishing and maintaining warmth',
        foods: [
          'Warm soups and stews',
          'Ghee in moderation with grains',
          'Nuts and seeds (almonds, sesame)',
          'Spices like black pepper, ginger, cinnamon'
        ],
        avoid: [
          'Cold drinks and ice-cream',
          'Raw, uncooked foods in excess',
          'Long fasting periods'
        ],
        lifestyle: [
          'Daily oil massage before a warm bath',
          'Regular moderate exercise',
          'Adequate sunlight exposure when possible'
        ]
      }
    }
  };

  return (
    (guidance[season] && guidance[season][dosha]) || {
      focus: 'Seasonal balance',
      foods: ['Seasonal, local foods', 'Warm, cooked meals'],
      avoid: ['Ultra-processed foods', 'Excessive cold or raw foods'],
      lifestyle: ['Regular routine', 'Adequate rest', 'Daily gentle movement']
    }
  );
};

// ---------- MAIN COMPONENTS ----------

const InteractiveTools = () => {
  const [activeTab, setActiveTab] = useState('compatibility');
  const [compatibilityResult, setCompatibilityResult] = useState(null);
  const [assessmentStep, setAssessmentStep] = useState(1);
  const [assessmentData, setAssessmentData] = useState({});

  const tools = [
    {
      id: 'compatibility',
      name: 'Food Compatibility Calculator',
      icon: 'Calculator',
      description: 'Compare two foods using Ayurvedic rules and modern nutrition.'
    },
    {
      id: 'seasonal',
      name: 'Seasonal Wellness Guide',
      icon: 'Calendar',
      description: 'Get tailored guidance based on the current season.'
    },
    {
      id: 'assessment',
      name: 'Constitutional Assessment',
      icon: 'User',
      description: 'Quick dosha-oriented lifestyle assessment.'
    }
  ];

  // ---------- TOOL 1: FOOD COMPATIBILITY ----------

  const FoodCompatibilityTool = () => {
    const [food1, setFood1] = useState('');
    const [food2, setFood2] = useState('');

    const handleCheck = () => {
      if (food1 && food2 && food1 !== food2) {
        const result = evaluateCompatibility(food1, food2);
        setCompatibilityResult(result);
      }
    };

    const selectedA = getFoodByValue(food1);
    const selectedB = getFoodByValue(food2);

    return (
      <div className="space-y-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <Select
            label="First Food"
            options={foodOptions}
            value={food1}
            onChange={setFood1}
            placeholder="Select first food"
            className="border-b border-gray-300 bg-transparent focus:outline-none focus:border-emerald-600"
          />
          <Select
            label="Second Food"
            options={foodOptions}
            value={food2}
            onChange={setFood2}
            placeholder="Select second food"
            className="border-b border-gray-300 bg-transparent focus:outline-none focus:border-emerald-600"
          />
        </div>

        <div className="text-center">
          <Button
            onClick={handleCheck}
            disabled={!food1 || !food2 || food1 === food2}
            iconName="Search"
            iconPosition="left"
          >
            Check Compatibility
          </Button>
        </div>

        {selectedA && selectedB && (
          <div className="grid sm:grid-cols-2 gap-4 text-sm text-text-secondary">
            <div className="bg-muted/40 rounded-lg p-3">
              <div className="font-semibold text-primary mb-1">
                {selectedA.label}
              </div>
              <div>
                <span className="font-medium">Category: </span>
                {selectedA.category}
              </div>
              <div>
                <span className="font-medium">Virya (Potency): </span>
                {selectedA.virya}
              </div>
              <div>
                <span className="font-medium">Ayurvedic note: </span>
                {selectedA.ayurvedaNote}
              </div>
              <div className="mt-1 text-xs opacity-80">{selectedA.modernNote}</div>
            </div>
            <div className="bg-muted/40 rounded-lg p-3">
              <div className="font-semibold text-primary mb-1">
                {selectedB.label}
              </div>
              <div>
                <span className="font-medium">Category: </span>
                {selectedB.category}
              </div>
              <div>
                <span className="font-medium">Virya (Potency): </span>
                {selectedB.virya}
              </div>
              <div>
                <span className="font-medium">Ayurvedic note: </span>
                {selectedB.ayurvedaNote}
              </div>
              <div className="mt-1 text-xs opacity-80">{selectedB.modernNote}</div>
            </div>
          </div>
        )}

        {compatibilityResult && (
          <div
            className={`p-6 rounded-xl border-2 ${
              compatibilityResult.level === 'good'
                ? 'bg-success/10 border-success/30'
                : compatibilityResult.level === 'caution'
                ? 'bg-warning/10 border-warning/30'
                : 'bg-error/10 border-error/30'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <Icon
                  name={
                    compatibilityResult.level === 'avoid'
                      ? 'AlertTriangle'
                      : compatibilityResult.level === 'caution'
                      ? 'AlertCircle'
                      : 'CheckCircle'
                  }
                  size={24}
                  className={
                    compatibilityResult.level === 'avoid'
                      ? 'text-error'
                      : compatibilityResult.level === 'caution'
                      ? 'text-warning'
                      : 'text-success'
                  }
                />
                <div>
                  <h4 className="text-lg font-semibold text-primary">
                    {compatibilityResult.summary}
                  </h4>
                  <p className="text-xs text-text-secondary">
                    Compatibility score: {compatibilityResult.score}/100
                  </p>
                </div>
              </div>
            </div>

            <p className="text-text-secondary mb-3">
              {compatibilityResult.reason}
            </p>

            <div className="bg-background/60 p-3 rounded-lg text-sm">
              <span className="font-medium text-primary">Recommendation: </span>
              <span className="text-text-secondary">
                {compatibilityResult.recommendation}
              </span>
            </div>

            <p className="text-xs text-text-secondary mt-3">
              This tool provides educational guidance based on Ayurvedic principles and
              general nutrition; individual needs can vary—always consider your own
              digestion and medical advice.
            </p>
          </div>
        )}
      </div>
    );
  };

  // ---------- TOOL 2: SEASONAL WELLNESS GUIDE ----------

  const SeasonalWellnessTool = () => {
    const [selectedSeason, setSelectedSeason] = useState('');
    const [guidance, setGuidance] = useState(null);

    const handleGetGuidance = () => {
      if (selectedSeason) {
        const result = getSeasonalGuidance(selectedSeason);
        setGuidance(result);
      }
    };

    return (
      <div className="space-y-6">
        <Select
          label="Current Season"
          options={seasonOptions}
          value={selectedSeason}
          onChange={setSelectedSeason}
          placeholder="Select current season"
          className="border-b border-gray-300 bg-transparent focus:outline-none focus:border-emerald-600"
        />
        <div className="text-center">
          <Button
            onClick={handleGetGuidance}
            disabled={!selectedSeason}
            iconName="Compass"
            iconPosition="left"
          >
            Get Seasonal Guidance
          </Button>
        </div>
        {guidance && (
          <div className="bg-gradient-to-br from-brand-cream to-brand-ivory rounded-xl p-6 border border-brand-gold/20">
            <h4 className="text-lg font-semibold text-primary mb-4 flex items-center">
              <Icon name="Target" size={20} className="mr-2" />
              {guidance.focus}
            </h4>

            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <h5 className="font-medium text-success mb-2 flex items-center">
                  <Icon name="Plus" size={16} className="mr-1" />
                  Recommended Foods
                </h5>
                <div className="space-y-1">
                  {guidance.foods?.map((food, index) => (
                    <div
                      key={index}
                      className="text-sm text-text-secondary bg-success/10 px-2 py-1 rounded"
                    >
                      {food}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h5 className="font-medium text-error mb-2 flex items-center">
                  <Icon name="Minus" size={16} className="mr-1" />
                  Foods to Avoid
                </h5>
                <div className="space-y-1">
                  {guidance.avoid?.map((food, index) => (
                    <div
                      key={index}
                      className="text-sm text-text-secondary bg-error/10 px-2 py-1 rounded"
                    >
                      {food}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4">
              <h5 className="font-medium text-primary mb-2 flex items-center">
                <Icon name="Heart" size={16} className="mr-1" />
                Lifestyle Recommendations
              </h5>
              <div className="flex flex-wrap gap-2">
                {guidance.lifestyle?.map((tip, index) => (
                  <span
                    key={index}
                    className="text-sm bg-brand-sage/20 text-primary px-3 py-1 rounded-full"
                  >
                    {tip}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // ---------- TOOL 3: CONSTITUTIONAL ASSESSMENT ----------

  const ConstitutionalAssessment = () => {
    const questions = [
      {
        id: 'body_frame',
        question: 'How would you describe your body frame?',
        options: [
          { value: 'vata', label: 'Thin, light, small-boned' },
          { value: 'pitta', label: 'Medium, well-proportioned' },
          { value: 'kapha', label: 'Large, heavy, big-boned' }
        ]
      },
      {
        id: 'appetite',
        question: 'How is your appetite typically?',
        options: [
          { value: 'vata', label: 'Variable, sometimes forget to eat' },
          { value: 'pitta', label: 'Strong, get irritable when hungry' },
          { value: 'kapha', label: 'Steady, can skip meals easily' }
        ]
      },
      {
        id: 'sleep',
        question: 'How would you describe your sleep pattern?',
        options: [
          { value: 'vata', label: 'Light sleeper, wake up easily' },
          { value: 'pitta', label: 'Moderate sleep, wake up refreshed' },
          { value: 'kapha', label: 'Deep sleeper, hard to wake up' }
        ]
      }
    ];

    const handleAnswer = (questionId, answer) => {
      setAssessmentData((prev) => ({
        ...prev,
        [questionId]: answer
      }));
    };

    const calculateResult = () => {
      const scores = { vata: 0, pitta: 0, kapha: 0 };
      Object.values(assessmentData).forEach((answer) => {
        scores[answer] = (scores[answer] || 0) + 1;
      });

      return Object.keys(scores).reduce((a, b) =>
        scores[a] > scores[b] ? a : b
      );
    };

    const getResult = () => {
      const result = calculateResult();
      const descriptions = {
        vata: {
          name: 'Vata Constitution',
          traits:
            'Creative, energetic, quick-thinking but prone to anxiety and irregularity when imbalanced.',
          recommendations:
            'Focus on warm, grounding foods, regular routines, oil massage, and adequate rest.'
        },
        pitta: {
          name: 'Pitta Constitution',
          traits:
            'Organized, focused, strong digestion but prone to irritability and acidity when imbalanced.',
          recommendations:
            'Choose cooling foods, avoid excessive heat/spice, prioritize relaxation and time in nature.'
        },
        kapha: {
          name: 'Kapha Constitution',
          traits:
            'Calm, stable, strong immunity but prone to sluggishness and weight gain when imbalanced.',
          recommendations:
            'Prefer light, spicy foods, regular vigorous exercise, and avoid oversleeping or overeating.'
        }
      };

      return descriptions[result];
    };

    if (assessmentStep > questions.length) {
      const result = getResult();
      return (
        <div className="text-center space-y-6">
          <div className="bg-gradient-to-br from-brand-gold/10 to-brand-sage/10 rounded-xl p-8 border border-brand-gold/20">
            <Icon name="Award" size={48} className="text-brand-gold mx-auto mb-4" />
            <h4 className="text-2xl font-display font-semibold text-primary mb-3">
              {result?.name}
            </h4>
            <p className="text-text-secondary mb-4">{result?.traits}</p>
            <div className="bg-background/50 p-4 rounded-lg">
              <span className="font-medium text-primary">Lifestyle focus: </span>
              <span className="text-text-secondary">
                {result?.recommendations}
              </span>
            </div>
          </div>
          <div className="flex justify-center space-x-4">
            <Button
              onClick={() => {
                setAssessmentStep(1);
                setAssessmentData({});
              }}
              variant="outline"
              iconName="RotateCcw"
              iconPosition="left"
            >
              Retake Assessment
            </Button>
            <Button iconName="Download" iconPosition="left">
              Download Summary
            </Button>
          </div>
        </div>
      );
    }

    const currentQuestion = questions[assessmentStep - 1];

    return (
      <div className="space-y-6">
        <div className="text-center mb-6">
          <div className="flex justify-center space-x-2 mb-4">
            {questions.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full ${
                  index < assessmentStep ? 'bg-brand-gold' : 'bg-border'
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-text-secondary">
            Question {assessmentStep} of {questions.length}
          </p>
        </div>
        <div className="bg-background rounded-xl p-6 organic-shadow">
          <h4 className="text-lg font-semibold text-primary mb-4">
            {currentQuestion.question}
          </h4>

          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => {
                  handleAnswer(currentQuestion.id, option.value);
                  setAssessmentStep((prev) => prev + 1);
                }}
                className="w-full text-left p-4 rounded-lg border border-border hover:border-brand-sage hover:bg-brand-sage/5 organic-transition"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 rounded-full border-2 border-brand-sage" />
                  <span className="text-text-secondary">{option.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // ---------- MAIN RENDER ----------

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'compatibility':
        return <FoodCompatibilityTool />;
      case 'seasonal':
        return <SeasonalWellnessTool />;
      case 'assessment':
        return <ConstitutionalAssessment />;
      default:
        return <FoodCompatibilityTool />;
    }
  };

  return (
    <div className="bg-background rounded-2xl organic-shadow">
      <div className="p-6 border-b border-border">
        <h2 className="text-2xl font-display font-semibold text-primary mb-3">
          Interactive Learning Tools
        </h2>
        <p className="text-text-secondary">
          Experience Ayurvedic principles through hands-on tools that blend traditional
          wisdom with modern nutrition science.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-border">
        <div className="flex overflow-x-auto">
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => setActiveTab(tool.id)}
              className={`flex items-center space-x-3 px-6 py-4 border-b-2 organic-transition whitespace-nowrap ${
                activeTab === tool.id
                  ? 'border-brand-gold text-primary bg-brand-gold/5'
                  : 'border-transparent text-text-secondary hover:text-primary hover:bg-muted/30'
              }`}
            >
              <Icon name={tool.icon} size={18} />
              <div className="text-left">
                <div className="font-medium">{tool.name}</div>
                <div className="text-xs opacity-70">{tool.description}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6">{renderActiveTab()}</div>
    </div>
  );
};

// Default export used by index.jsx
export default InteractiveTools;
