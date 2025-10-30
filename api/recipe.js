// api/recipe.js
// Vercel Serverless Function for WTFood (Static site + Vercel functions)
// Place this file at project-root/api/recipe.js
// Uses CommonJS exports so no special bundling is required.

module.exports = async (req, res) => {
  // For demo, allow CORS (you can tighten this for production)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = req.body || {};
    const { ingredients, personality = 'sarcastic' } = body;

    if (!ingredients || !Array.isArray(ingredients)) {
      return res.status(400).json({ error: 'Ingredients array is required' });
    }

    // Demo/mock: generate a recipe from templates
    const mockRecipe = generateMockRecipe(ingredients, personality);

    return res.status(200).json(mockRecipe);
  } catch (error) {
    console.error('API Error:', error && (error.stack || error));
    return res.status(500).json({
      error: 'Failed to generate recipe',
      details: String(error && (error.message || error))
    });
  }
};

function generateMockRecipe(ingredients, personality) {
  const ingredientList = ingredients.map(i => String(i).trim().toLowerCase());

  const sarcasticTemplates = [
    {
      name: "Kitchen Chaos Surprise",
      description: "When you throw everything together and hope for the best",
      instructions: [
        "Look at your ingredients and question your life choices",
        "Chop everything while contemplating your existence",
        "Toss it all in a pan like you're on a cooking show",
        "Add seasoning until it smells less like despair",
        "Serve with a side of regret"
      ],
      tip: "If it tastes bad, more cheese."
    },
    {
      name: "Depression Pasta Deluxe",
      description: "For when you have pasta but not the will to live",
      instructions: [
        "Boil water while staring into the void",
        "Add pasta and contemplate choices",
        "Throw in vegetables that haven't given up yet",
        "Mix with the enthusiasm of a wet noodle",
        "Eat directly from the pot to save dishes"
      ],
      tip: "Diagonal cuts = marginally better mood."
    }
  ];

  const politeTemplates = [
    {
      name: "Garden Fresh Delight",
      description: "A wholesome dish using fresh ingredients",
      instructions: [
        "Prepare all ingredients by washing and chopping",
        "Heat a pan with a touch of oil",
        "Add ingredients in order of cooking time",
        "Season gently with herbs and spices",
        "Cook until tender and flavorful"
      ],
      tip: "Fresh herbs make the dish sing."
    },
    {
      name: "Comfort Bowl",
      description: "A nourishing bowl to warm your soul",
      instructions: [
        "Prepare base ingredients and aromatics",
        "Layer flavors by sautéing aromatics first",
        "Add main ingredients and simmer with care",
        "Season to taste",
        "Serve hot and enjoy"
      ],
      tip: "Patience improves depth of flavor."
    }
  ];

  const templates = personality === 'polite' ? politeTemplates : sarcasticTemplates;
  const selected = templates[Math.floor(Math.random() * templates.length)];

  return {
    id: Date.now(),
    name: selected.name,
    description: selected.description,
    ingredients: ingredientList,
    instructions: selected.instructions,
    tip: selected.tip,
    personality,
    createdAt: new Date().toISOString()
  };
}