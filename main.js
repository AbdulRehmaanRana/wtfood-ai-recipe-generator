// WTFood - Main JavaScript File (Hardened fetch + better error handling)
//
// Changes:
// - Use absolute endpoint (window.location.origin + '/api/recipe')
// - Set Accept header
// - Inspect Content-Type before parsing JSON
// - Catch JSON parse errors and fall back to mock recipe
// - Log full server response text for debugging

class WTFoodApp {
    constructor() {
        this.isDarkMode = false;
        this.isSarcasticMode = true;
        this.savedRecipes = this.loadSavedRecipes();
        this.currentRecipe = null;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initParticleSystem();
        this.initTextAnimations();
        this.loadDarkModePreference();
    }

    setupEventListeners() {
        // Generate recipe button
        document.getElementById('generateBtn').addEventListener('click', () => {
            this.generateRecipe();
        });

        // AI mood toggle
        document.getElementById('aiMoodToggle').addEventListener('change', (e) => {
            this.isSarcasticMode = e.target.checked;
            this.updateMoodDisplay();
        });

        // Dark mode toggle
        document.getElementById('darkModeToggle').addEventListener('click', () => {
            this.toggleDarkMode();
        });

        // Recipe actions
        document.getElementById('saveRecipeBtn').addEventListener('click', () => {
            this.saveCurrentRecipe();
        });

        document.getElementById('shareRecipeBtn').addEventListener('click', () => {
            this.shareCurrentRecipe();
        });

        document.getElementById('generateAnotherBtn').addEventListener('click', () => {
            this.generateAnotherRecipe();
        });

        document.getElementById('tryDifferentIngredientsBtn').addEventListener('click', () => {
            this.resetToInput();
        });

        // Enter key support for ingredients input
        document.getElementById('ingredients').addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                this.generateRecipe();
            }
        });
    }

    async generateRecipe() {
        const ingredients = document.getElementById('ingredients').value.trim();
        
        if (!ingredients) {
            this.showError('Please enter some ingredients first! 🤨');
            return;
        }

        this.showLoadingState();
        this.showLoadingMessage();

        try {
            // Use absolute endpoint to avoid path issues when hosted under different base path
            const endpoint = `${window.location.origin}/api/recipe`;

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json' // ask for JSON explicitly
                },
                body: JSON.stringify({
                    ingredients: ingredients.split(',').map(i => i.trim()),
                    personality: this.isSarcasticMode ? 'sarcastic' : 'polite'
                })
            });

            // If server returned non-OK, read text for diagnostics and fallback to mock
            if (!response.ok) {
                const serverText = await safeReadText(response);
                console.error('API returned non-OK status', response.status, serverText);
                await this.generateMockRecipe(ingredients);
                return;
            }

            const contentType = response.headers.get('content-type') || '';
            if (!contentType.includes('application/json')) {
                // Unexpected content-type: read text (could be HTML error page) and fallback
                const serverText = await safeReadText(response);
                console.error('API returned non-JSON response:', serverText);
                await this.generateMockRecipe(ingredients);
                return;
            }

            // Now safely parse JSON with try/catch
            let recipeData;
            try {
                recipeData = await response.json();
            } catch (err) {
                const serverText = await safeReadText(response);
                console.error('Failed to parse JSON from API response:', err, serverText);
                await this.generateMockRecipe(ingredients);
                return;
            }

            // If the API returned an error payload
            if (recipeData?.error) {
                console.error('API returned error object:', recipeData);
                await this.generateMockRecipe(ingredients);
                return;
            }

            // Success: store and display
            this.currentRecipe = {
                ...recipeData,
                ingredients: ingredients.split(',').map(i => i.trim().toLowerCase()),
                createdAt: new Date()
            };
            this.displayRecipe(this.currentRecipe);
        } catch (error) {
            console.error('API call failed, using mock recipe:', error);
            // Fallback to mock recipe if API is not available
            await this.generateMockRecipe(ingredients);
        } finally {
            this.hideLoadingState();
        }
    }

    // Helper to safely read response text without causing double consumption errors
    async safeReadText(response) {
        try {
            // If the response body was already streamed earlier, this might fail — we handle exceptions
            return await response.clone().text();
        } catch (e) {
            return `<unable to read response body: ${e.message}>`;
        }
    }

    async generateMockRecipe(ingredients) {
        // Simulate AI processing delay
        await this.delay(2000 + Math.random() * 2000);
        
        const recipe = this.createMockRecipe(ingredients);
        this.displayRecipe(recipe);
    }

    showLoadingState() {
        const generateBtn = document.getElementById('generateBtn');
        const btnText = document.getElementById('btnText');
        const btnLoading = document.getElementById('btnLoading');
        
        generateBtn.disabled = true;
        btnText.classList.add('hidden');
        btnLoading.classList.remove('hidden');
    }

    hideLoadingState() {
        const generateBtn = document.getElementById('generateBtn');
        const btnText = document.getElementById('btnText');
        const btnLoading = document.getElementById('btnLoading');
        
        generateBtn.disabled = false;
        btnText.classList.remove('hidden');
        btnLoading.classList.add('hidden');
    }

    showLoadingMessage() {
        const loadingMessage = document.getElementById('loadingMessage');
        const loadingText = document.getElementById('loadingText');
        
        loadingMessage.classList.remove('hidden');
        
        const messages = this.isSarcasticMode ? [
            "AI is judging your ingredient choices...",
            "Trying to figure out what to do with that random stuff...",
            "Consulting the ancient cookbook of sarcasm...",
            "Attempting to make edible food from your chaos...",
            "The chef is roasting you while roasting your ingredients...",
            "Calculating the probability of this actually tasting good...",
            "Searching for recipes that match your questionable taste..."
        ] : [
            "Analyzing your ingredients...",
            "Searching for perfect recipe matches...",
            "Consulting culinary expertise...",
            "Creating a delicious recipe for you...",
            "Finding the best flavor combinations..."
        ];

        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        
        // Typewriter effect (guard against Typed not being available)
        if (window.Typed) {
            const typed = new Typed('#loadingText', {
                strings: [randomMessage],
                typeSpeed: 50,
                showCursor: false,
                onComplete: () => {
                    setTimeout(() => {
                        loadingMessage.classList.add('hidden');
                    }, 1000);
                }
            });
        } else {
            loadingText.textContent = randomMessage;
            setTimeout(() => loadingMessage.classList.add('hidden'), 1200);
        }
    }

    createMockRecipe(ingredients) {
        const ingredientList = ingredients.split(',').map(i => i.trim().toLowerCase());
        
        // Recipe templates based on common ingredients
        const recipes = this.getRecipeTemplates();
        
        // Find matching recipe based on ingredients
        let selectedRecipe = recipes.find(recipe => 
            recipe.requiredIngredients.some(req => ingredientList.includes(req))
        ) || recipes[Math.floor(Math.random() * recipes.length)];

        // Customize recipe based on available ingredients
        const customizedRecipe = this.customizeRecipe(selectedRecipe, ingredientList);
        
        this.currentRecipe = {
            ...customizedRecipe,
            id: Date.now(),
            ingredients: ingredientList,
            createdAt: new Date()
        };

        return this.currentRecipe;
    }

    getRecipeTemplates() {
        const sarcasticTemplates = [
            {
                name: "Scrambled Chaos",
                description: "When you can't decide between breakfast and existential crisis",
                requiredIngredients: ["egg", "eggs"],
                instructions: [
                    "Beat the eggs like your Monday morning stress",
                    "Throw in whatever chopped vegetables you have",
                    "Add cheese if you're feeling fancy (or sad)",
                    "Stir like you mean it, unlike your last relationship",
                    "Salt it till it tastes less like regret"
                ],
                tip: "It's edible. Probably."
            },
            {
                name: "Depression Pasta",
                description: "For when you have pasta but not the will to live",
                requiredIngredients: ["pasta", "noodles"],
                instructions: [
                    "Boil water (if you can find the energy)",
                    "Dump pasta in and hope for the best",
                    "Add whatever sauce-like substance you own",
                    "Mix with the enthusiasm of a wet noodle",
                    "Eat directly from the pot to save dishes"
                ],
                tip: "Bonus points if you don't burn it."
            },
            {
                name: "Questionable Stir-Fry",
                description: "Throwing random vegetables at heat and hoping",
                requiredIngredients: ["vegetable", "vegetables", "onion", "garlic"],
                instructions: [
                    "Chop everything while questioning your life choices",
                    "Heat oil in pan (or just imagine it's hot)",
                    "Toss in vegetables in order of how sad they look",
                    "Add soy sauce until it looks vaguely Asian",
                    "Stir frantically like you're on a cooking show"
                ],
                tip: "If it smells burnt, call it 'smoky flavor'."
            },
            {
                name: "Sad Sandwich",
                description: "When you can't even be bothered to toast bread",
                requiredIngredients: ["bread", "cheese"],
                instructions: [
                    "Lay out bread like you're laying out your dreams",
                    "Add cheese because it's the only thing that loves you back",
                    "Consider adding vegetables, then don't",
                    "Squish together with the weight of your expectations",
                    "Eat while standing over the sink"
                ],
                tip: "Cutting it diagonally makes it 37% less depressing."
            },
            {
                name: "Microwave Surprise",
                description: "The surprise is how badly this could go",
                requiredIngredients: ["rice", "chicken", "leftover"],
                instructions: [
                    "Dump everything in a bowl like your feelings",
                    "Microwave on high until it smells questionable",
                    "Stir halfway through if you're feeling responsible",
                    "Let it cool while you question your decisions",
                    "Eat with the enthusiasm of a tax audit"
                ],
                tip: "If the smoke alarm goes off, it's done."
            }
        ];

        const politeTemplates = [
            {
                name: "Garden Fresh Scramble",
                description: "A delightful breakfast dish using fresh ingredients",
                requiredIngredients: ["egg", "eggs"],
                instructions: [
                    "Gently whisk the eggs in a bowl until well combined",
                    "Prepare your vegetables by washing and chopping them",
                    "Heat a non-stick pan over medium heat",
                    "Add the eggs and gently fold in the vegetables",
                    "Cook until just set and season to taste"
                ],
                tip: "For extra fluffiness, add a splash of milk to the eggs."
            },
            {
                name: "Simple Pasta Delight",
                description: "A comforting pasta dish that's easy to make",
                requiredIngredients: ["pasta", "noodles"],
                instructions: [
                    "Bring a large pot of salted water to boil",
                    "Cook pasta according to package directions",
                    "Prepare your sauce ingredients while pasta cooks",
                    "Drain pasta and toss with your favorite sauce",
                    "Garnish with fresh herbs if available"
                ],
                tip: "Save some pasta water to help the sauce coat the noodles."
            }
        ];

        return this.isSarcasticMode ? sarcasticTemplates : politeTemplates;
    }

    customizeRecipe(template, availableIngredients) {
        const customized = { ...template };
        
        // Customize instructions based on available ingredients
        customized.instructions = template.instructions.map(instruction => {
            // Replace generic terms with specific ingredients
            if (instruction.includes("vegetables") && availableIngredients.some(i => i.includes("tomato"))) {
                return instruction.replace("vegetables", "tomatoes");
            }
            if (instruction.includes("sauce") && availableIngredients.some(i => i.includes("cheese"))) {
                return instruction.replace("sauce", "cheese");
            }
            return instruction;
        });

        return customized;
    }

    displayRecipe(recipe) {
        const recipeOutput = document.getElementById('recipeOutput');
        const recipeName = document.getElementById('recipeName');
        const recipeDescription = document.getElementById('recipeDescription');
        const ingredientsList = document.getElementById('ingredientsList');
        const instructionsList = document.getElementById('instructionsList');
        const recipeTip = document.getElementById('recipeTip');

        // Populate recipe details
        recipeName.textContent = `🍳 ${recipe.name}`;
        recipeDescription.textContent = recipe.description;
        recipeTip.textContent = recipe.tip;

        // Display ingredients as tags
        ingredientsList.innerHTML = recipe.ingredients.map(ingredient => 
            `<span class="inline-block bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">${ingredient}</span>`
        ).join('');

        // Display instructions
        instructionsList.innerHTML = recipe.instructions.map((instruction, index) => 
            `<li class="flex items-start">
                <span class="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold mr-3 mt-0.5 flex-shrink-0">${index + 1}</span>
                <span class="text-gray-700">${instruction}</span>
            </li>`
        ).join('');

        // Show the recipe with animation
        recipeOutput.classList.remove('hidden');
        
        // Animate recipe appearance
        if (window.anime) {
            anime({
                targets: '#recipeOutput',
                opacity: [0, 1],
                translateY: [20, 0],
                duration: 600,
                easing: 'easeOutQuad'
            });
        }

        // Animate recipe name with splitting
        if (window.Splitting && window.anime) {
            Splitting({ target: recipeName, by: 'chars' });
            anime({
                targets: '#recipeName .char',
                opacity: [0, 1],
                translateY: [20, 0],
                delay: anime.stagger(50),
                duration: 600,
                easing: 'easeOutQuad'
            });
        }

        // Update save button state
        this.updateSaveButton();
    }

    saveCurrentRecipe() {
        if (!this.currentRecipe) return;

        // Check if already saved
        const isAlreadySaved = this.savedRecipes.some(recipe => recipe.id === this.currentRecipe.id);
        
        if (isAlreadySaved) {
            this.showNotification('Recipe already saved! 🤦‍♂️', 'warning');
            return;
        }

        this.savedRecipes.push(this.currentRecipe);
        this.saveRecipesToStorage();
        this.updateSaveButton();
        this.showNotification('Recipe saved successfully! 💾', 'success');
    }

    shareCurrentRecipe() {
        if (!this.currentRecipe) return;

        const shareText = `Check out this recipe: ${this.currentRecipe.name}\n\nIngredients: ${this.currentRecipe.ingredients.join(', ')}\n\nInstructions:\n${this.currentRecipe.instructions.map((step, i) => `${i + 1}. ${step}`).join('\n')}\n\nTip: ${this.currentRecipe.tip}\n\nGenerated by WTFood - AI Recipe Generator`;

        if (navigator.share) {
            navigator.share({
                title: this.currentRecipe.name,
                text: shareText
            }).catch(err => console.log('Error sharing:', err));
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(shareText).then(() => {
                this.showNotification('Recipe copied to clipboard! 📋', 'success');
            });
        }
    }

    generateAnotherRecipe() {
        // Keep current ingredients and generate a new recipe
        this.generateRecipe();
    }

    resetToInput() {
        const recipeOutput = document.getElementById('recipeOutput');
        const ingredientsInput = document.getElementById('ingredients');
        
        recipeOutput.classList.add('hidden');
        ingredientsInput.focus();
        ingredientsInput.select();
    }

    updateSaveButton() {
        const saveBtn = document.getElementById('saveRecipeBtn');
        if (!this.currentRecipe) return;

        const isSaved = this.savedRecipes.some(recipe => recipe.id === this.currentRecipe.id);
        saveBtn.innerHTML = `<span class="text-xl">${isSaved ? '❤️' : '🤍'}</span>`;
    }

    updateMoodDisplay() {
        // Update UI based on AI mood
        const moodText = this.isSarcasticMode ? 'Sarcastic Chef Mode' : 'Polite Chef Mode';
        console.log(`Switched to ${moodText}`);
    }

    toggleDarkMode() {
        this.isDarkMode = !this.isDarkMode;
        document.body.classList.toggle('dark', this.isDarkMode);
        
        const darkModeToggle = document.getElementById('darkModeToggle');
        darkModeToggle.innerHTML = `<span class="text-xl">${this.isDarkMode ? '☀️' : '🌙'}</span>`;
        
        localStorage.setItem('wtfood-darkmode', this.isDarkMode);
    }

    loadDarkModePreference() {
        const saved = localStorage.getItem('wtfood-darkmode');
        if (saved === 'true') {
            this.isDarkMode = true;
            document.body.classList.add('dark');
            document.getElementById('darkModeToggle').innerHTML = '<span class="text-xl">☀️</span>';
        }
    }

    showError(message) {
        const ingredientsInput = document.getElementById('ingredients');
        ingredientsInput.classList.add('shake');
        
        // Create error message element
        const errorDiv = document.createElement('div');
        errorDiv.className = 'text-red-500 text-sm mt-2';
        errorDiv.textContent = message;
        
        ingredientsInput.parentNode.appendChild(errorDiv);
        
        setTimeout(() => {
            ingredientsInput.classList.remove('shake');
            errorDiv.remove();
        }, 3000);
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `fixed top-20 right-4 p-4 rounded-lg shadow-lg z-50 ${
            type === 'success' ? 'bg-green-500 text-white' :
            type === 'warning' ? 'bg-yellow-500 text-white' :
            type === 'error' ? 'bg-red-500 text-white' :
            'bg-blue-500 text-white'
        }`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Animate in
        if (window.anime) {
            anime({
                targets: notification,
                translateX: [300, 0],
                opacity: [0, 1],
                duration: 300,
                easing: 'easeOutQuad'
            });
        }
        
        // Remove after 3 seconds
        setTimeout(() => {
            if (window.anime) {
                anime({
                    targets: notification,
                    translateX: [0, 300],
                    opacity: [1, 0],
                    duration: 300,
                    easing: 'easeInQuad',
                    complete: () => notification.remove()
                });
            } else {
                notification.remove();
            }
        }, 3000);
    }

    initParticleSystem() {
        // Simple particle system using p5.js
        const sketch = (p) => {
            let particles = [];
            
            p.setup = () => {
                const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
                canvas.parent('particle-container');
                
                // Create initial particles
                for (let i = 0; i < 20; i++) {
                    particles.push(new Particle(p));
                }
            };
            
            p.draw = () => {
                p.clear();
                
                // Update and draw particles
                particles.forEach(particle => {
                    particle.update();
                    particle.draw();
                });
                
                // Remove dead particles and add new ones
                particles = particles.filter(p => p.isAlive());
                while (particles.length < 20) {
                    particles.push(new Particle(p));
                }
            };
            
            p.windowResized = () => {
                p.resizeCanvas(p.windowWidth, p.windowHeight);
            };
            
            class Particle {
                constructor(p) {
                    this.p = p;
                    this.x = p.random(p.width);
                    this.y = p.height + 50;
                    this.vx = p.random(-0.5, 0.5);
                    this.vy = p.random(-2, -0.5);
                    this.alpha = 255;
                    this.size = p.random(3, 8);
                    this.life = 255;
                }
                
                update() {
                    this.x += this.vx;
                    this.y += this.vy;
                    this.life -= 1;
                    this.alpha = this.life;
                }
                
                draw() {
                    this.p.fill(245, 158, 11, this.alpha);
                    this.p.noStroke();
                    this.p.ellipse(this.x, this.y, this.size);
                }
                
                isAlive() {
                    return this.life > 0 && this.y > -50;
                }
            }
        };
        
        new p5(sketch);
    }

    initTextAnimations() {
        // Initialize text splitting for animations
        if (window.Splitting) {
            Splitting();
        }
    }

    // Utility functions
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    loadSavedRecipes() {
        const saved = localStorage.getItem('wtfood-saved-recipes');
        return saved ? JSON.parse(saved) : [];
    }

    saveRecipesToStorage() {
        localStorage.setItem('wtfood-saved-recipes', JSON.stringify(this.savedRecipes));
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new WTFoodApp();
});

// Add some scroll animations
document.addEventListener('scroll', () => {
    const elements = document.querySelectorAll('.fade-in');
    elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight * 0.8;
        
        if (isVisible && !el.classList.contains('animated')) {
            el.classList.add('animated');
            if (window.anime) {
                anime({
                    targets: el,
                    opacity: [0, 1],
                    translateY: [20, 0],
                    duration: 600,
                    easing: 'easeOutQuad'
                });
            }
        }
    });
});