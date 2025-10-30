// WTFood API - Recipe Generation Endpoint
// This would normally use Google Gemini API, but for demo purposes we'll use mock data

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { ingredients, personality = 'sarcastic' } = req.body;
    
    if (!ingredients || !Array.isArray(ingredients)) {
      return res.status(400).json({ error: 'Ingredients array is required' });
    }

    // For demo purposes, we'll return mock data instead of calling Gemini API
    // In production, you would use the actual Google Gemini API here
    const mockRecipe = generateMockRecipe(ingredients, personality);
    
    res.status(200).json(mockRecipe);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Failed to generate recipe' });
  }
}

function generateMockRecipe(ingredients, personality) {
  const ingredientList = ingredients.map(i => i.trim().toLowerCase());
  
  // Mock recipe templates
  const sarcasticTemplates = [
    {
      name: "Kitchen Chaos Surprise",
      description: "When you throw everything together and hope for the best",
      instructions: [
        "Look at your ingredients and question your life choices",
        "Chop everything while contemplating your existence",
        "Toss it all in a pan like you're on a cooking show",
        "Add seasoning until it smells less like depression",
        "Serve with a side of regret and hot sauce"
      ],
      tip: "If it tastes bad, just add more cheese. Cheese fixes everything."
    },
    {
      name: "Depression Pasta Deluxe",
      description: "For when you have pasta but not the will to live",
      instructions: [
        "Boil water while staring into the void",
        "Add pasta and contemplate your choices",
        "Throw in whatever vegetables aren't completely dead",
        "Mix with the enthusiasm of a wet noodle",
        "Eat directly from the pot to save dishes"
      ],
      tip: "Cutting it diagonally makes it 37% less depressing."
    },
    {
      name: "Questionable Stir-Fry",
      description: "Throwing random vegetables at heat and hoping",
      instructions: [
        "Chop everything while questioning your life choices",
        "Heat oil in pan (or just imagine it's hot)",
        "Toss in vegetables in order of how sad they look",
        "Add sauce until it looks vaguely Asian",
        "Stir frantically like you're on a cooking show"
      ],
      tip: "If it smells burnt, call it 'smoky flavor'."
    }
  ];

  const politeTemplates = [
    {
      name: "Garden Fresh Delight",
      description: "A wholesome dish using fresh, natural ingredients",
      instructions: [
        "Prepare all ingredients by washing and chopping",
        "Heat a pan to medium temperature with a touch of oil",
        "Add ingredients in order of cooking time required",
        "Season gently with herbs and spices",
        "Cook until everything is tender and flavorful"
      ],
      tip: "Fresh herbs make all the difference in bringing out natural flavors."
    },
    {
      name: "Comfort Bowl",
      description: "A nourishing meal to warm your soul",
      instructions: [
        "Start by preparing your base ingredients",
        "Layer flavors by cooking aromatics first",
        "Add main ingredients and cook with care",
        "Season to taste with gentle spices",
        "Serve hot and enjoy the comfort"
      ],
      tip: "Take your time - good food is worth the patience."
    }
  ];

  const templates = personality === 'polite' ? politeTemplates : sarcasticTemplates;
  const selectedTemplate = templates[Math.floor(Math.random() * templates.length)];

  return {
    id: Date.now(),
    name: selectedTemplate.name,
    description: selectedTemplate.description,
    ingredients: ingredientList,
    instructions: selectedTemplate.instructions,
    tip: selectedTemplate.tip,
    personality: personality,
    createdAt: new Date().toISOString()
  };
}