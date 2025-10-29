// WTFood - Main JavaScript File
// Recipe Generator with Sarcastic AI Personality (Gemini API version)

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
    document.getElementById("generateBtn").addEventListener("click", () => {
      this.generateRecipe();
    });

    document.getElementById("aiMoodToggle").addEventListener("change", (e) => {
      this.isSarcasticMode = e.target.checked;
      this.updateMoodDisplay();
    });

    document.getElementById("darkModeToggle").addEventListener("click", () => {
      this.toggleDarkMode();
    });

    document.getElementById("saveRecipeBtn").addEventListener("click", () => {
      this.saveCurrentRecipe();
    });

    document.getElementById("shareRecipeBtn").addEventListener("click", () => {
      this.shareCurrentRecipe();
    });

    document.getElementById("generateAnotherBtn").addEventListener("click", () => {
      this.generateRecipe();
    });

    document
      .getElementById("tryDifferentIngredientsBtn")
      .addEventListener("click", () => {
        this.resetToInput();
      });

    document.getElementById("ingredients").addEventListener("keypress", (e) => {
      if (e.key === "Enter" && e.ctrlKey) {
        this.generateRecipe();
      }
    });
  }

  // 🧠 Gemini API integration
  async generateRecipe() {
    const ingredients = document.getElementById("ingredients").value.trim();

    if (!ingredients) {
      this.showError("Please enter some ingredients first! 🤨");
      return;
    }

    this.showLoadingState();
    this.showLoadingMessage();

    try {
      const res = await fetch("/api/recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ingredients,
          mood: this.isSarcasticMode ? "sarcastic" : "polite",
        }),
      });

      const data = await res.json();

      if (data.recipe) {
        const recipe = this.parseGeminiResponse(data.recipe);
        this.displayRecipe(recipe);
      } else {
        this.showError("AI Chef burned something! Try again 🔥");
      }
    } catch (err) {
      console.error(err);
      this.showError("Something went wrong with the AI chef!");
    }

    this.hideLoadingState();
  }

  // 🧩 Helper: Parse Gemini API response text into structured recipe
  parseGeminiResponse(responseText) {
    const lines = responseText.split("\n").filter((l) => l.trim() !== "");

    const recipe = {
      name: lines[0]?.replace(/^#+\s*/, "") || "Unnamed Dish",
      description: lines[1] || "",
      ingredients: [],
      instructions: [],
      tip: "",
    };

    let section = "";

    for (const line of lines.slice(2)) {
      if (/ingredients/i.test(line)) section = "ingredients";
      else if (/instructions|steps/i.test(line)) section = "instructions";
      else if (/tip/i.test(line)) section = "tip";
      else {
        if (section === "ingredients")
          recipe.ingredients.push(line.replace(/^[-*•]\s*/, ""));
        else if (section === "instructions")
          recipe.instructions.push(line.replace(/^\d+\.\s*/, ""));
        else if (section === "tip") recipe.tip += line + " ";
      }
    }

    return recipe;
  }

  showLoadingState() {
    const generateBtn = document.getElementById("generateBtn");
    const btnText = document.getElementById("btnText");
    const btnLoading = document.getElementById("btnLoading");

    generateBtn.disabled = true;
    btnText.classList.add("hidden");
    btnLoading.classList.remove("hidden");
  }

  hideLoadingState() {
    const generateBtn = document.getElementById("generateBtn");
    const btnText = document.getElementById("btnText");
    const btnLoading = document.getElementById("btnLoading");

    generateBtn.disabled = false;
    btnText.classList.remove("hidden");
    btnLoading.classList.add("hidden");
  }

  showLoadingMessage() {
    const loadingMessage = document.getElementById("loadingMessage");
    const loadingText = document.getElementById("loadingText");

    loadingMessage.classList.remove("hidden");

    const messages = this.isSarcasticMode
      ? [
          "AI is judging your ingredient choices...",
          "Trying to figure out what to do with that random stuff...",
          "Consulting the ancient cookbook of sarcasm...",
          "Attempting to make edible food from your chaos...",
          "The chef is roasting you while roasting your ingredients...",
          "Calculating the probability of this actually tasting good...",
        ]
      : [
          "Analyzing your ingredients...",
          "Searching for perfect recipe matches...",
          "Consulting culinary expertise...",
          "Creating a delicious recipe for you...",
        ];

    const randomMessage =
      messages[Math.floor(Math.random() * messages.length)];

    const typed = new Typed("#loadingText", {
      strings: [randomMessage],
      typeSpeed: 50,
      showCursor: false,
      onComplete: () => {
        setTimeout(() => {
          loadingMessage.classList.add("hidden");
        }, 1000);
      },
    });
  }

  displayRecipe(recipe) {
    const recipeOutput = document.getElementById("recipeOutput");
    const recipeName = document.getElementById("recipeName");
    const recipeDescription = document.getElementById("recipeDescription");
    const ingredientsList = document.getElementById("ingredientsList");
    const instructionsList = document.getElementById("instructionsList");
    const recipeTip = document.getElementById("recipeTip");

    recipeName.textContent = `🍳 ${recipe.name}`;
    recipeDescription.textContent = recipe.description;
    recipeTip.textContent = recipe.tip;

    ingredientsList.innerHTML = recipe.ingredients
      .map(
        (ingredient) =>
          `<span class="inline-block bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">${ingredient}</span>`
      )
      .join("");

    instructionsList.innerHTML = recipe.instructions
      .map(
        (instruction, index) => `
        <li class="flex items-start">
          <span class="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">${index + 1}</span>
          <span class="text-gray-700">${instruction}</span>
        </li>`
      )
      .join("");

    recipeOutput.classList.remove("hidden");

    anime({
      targets: "#recipeOutput",
      opacity: [0, 1],
      translateY: [20, 0],
      duration: 600,
      easing: "easeOutQuad",
    });

    if (window.Splitting) {
      Splitting({ target: recipeName, by: "chars" });
      anime({
        targets: "#recipeName .char",
        opacity: [0, 1],
        translateY: [20, 0],
        delay: anime.stagger(50),
        duration: 600,
        easing: "easeOutQuad",
      });
    }

    this.updateSaveButton();
  }

  saveCurrentRecipe() {
    if (!this.currentRecipe) return;

    const isAlreadySaved = this.savedRecipes.some(
      (recipe) => recipe.id === this.currentRecipe.id
    );

    if (isAlreadySaved) {
      this.showNotification("Recipe already saved! 🤦‍♂️", "warning");
      return;
    }

    this.savedRecipes.push(this.currentRecipe);
    this.saveRecipesToStorage();
    this.updateSaveButton();
    this.showNotification("Recipe saved successfully! 💾", "success");
  }

  shareCurrentRecipe() {
    if (!this.currentRecipe) return;

    const shareText = `Check out this recipe: ${this.currentRecipe.name}\n\nIngredients: ${this.currentRecipe.ingredients.join(
      ", "
    )}\n\nInstructions:\n${this.currentRecipe.instructions
      .map((step, i) => `${i + 1}. ${step}`)
      .join("\n")}\n\nTip: ${this.currentRecipe.tip}\n\nGenerated by WTFood 🍳`;

    if (navigator.share) {
      navigator.share({
        title: this.currentRecipe.name,
        text: shareText,
      });
    } else {
      navigator.clipboard.writeText(shareText).then(() => {
        this.showNotification("Recipe copied to clipboard! 📋", "success");
      });
    }
  }

  resetToInput() {
    document.getElementById("recipeOutput").classList.add("hidden");
    const input = document.getElementById("ingredients");
    input.focus();
    input.select();
  }

  updateSaveButton() {
    const saveBtn = document.getElementById("saveRecipeBtn");
    if (!this.currentRecipe) return;

    const isSaved = this.savedRecipes.some(
      (recipe) => recipe.id === this.currentRecipe.id
    );
    saveBtn.innerHTML = `<span class="text-xl">${
      isSaved ? "❤️" : "🤍"
    }</span>`;
  }

  updateMoodDisplay() {
    console.log(
      `Switched to ${this.isSarcasticMode ? "Sarcastic" : "Polite"} Chef Mode`
    );
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    document.body.classList.toggle("dark", this.isDarkMode);
    document.getElementById("darkModeToggle").innerHTML = `<span class="text-xl">${
      this.isDarkMode ? "☀️" : "🌙"
    }</span>`;
    localStorage.setItem("wtfood-darkmode", this.isDarkMode);
  }

  loadDarkModePreference() {
    const saved = localStorage.getItem("wtfood-darkmode");
    if (saved === "true") {
      this.isDarkMode = true;
      document.body.classList.add("dark");
      document.getElementById(
        "darkModeToggle"
      ).innerHTML = `<span class="text-xl">☀️</span>`;
    }
  }

  showError(message) {
    const input = document.getElementById("ingredients");
    input.classList.add("shake");

    const errorDiv = document.createElement("div");
    errorDiv.className = "text-red-500 text-sm mt-2";
    errorDiv.textContent = message;
    input.parentNode.appendChild(errorDiv);

    setTimeout(() => {
      input.classList.remove("shake");
      errorDiv.remove();
    }, 3000);
  }

  showNotification(message, type = "info") {
    const notification = document.createElement("div");
    notification.className = `fixed top-20 right-4 p-4 rounded-lg shadow-lg z-50 ${
      type === "success"
        ? "bg-green-500 text-white"
        : type === "warning"
        ? "bg-yellow-500 text-white"
        : type === "error"
        ? "bg-red-500 text-white"
        : "bg-blue-500 text-white"
    }`;
    notification.textContent = message;

    document.body.appendChild(notification);

    anime({
      targets: notification,
      translateX: [300, 0],
      opacity: [0, 1],
      duration: 300,
      easing: "easeOutQuad",
    });

    setTimeout(() => {
      anime({
        targets: notification,
        translateX: [0, 300],
        opacity: [1, 0],
        duration: 300,
        easing: "easeInQuad",
        complete: () => notification.remove(),
      });
    }, 3000);
  }

  // 🎆 Particle system (same as before)
  initParticleSystem() {
    const sketch = (p) => {
      let particles = [];
      p.setup = () => {
        const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
        canvas.parent("particle-container");
        for (let i = 0; i < 20; i++) particles.push(new Particle(p));
      };
      p.draw = () => {
        p.clear();
        particles.forEach((pt) => {
          pt.update();
          pt.draw();
        });
        particles = particles.filter((p) => p.isAlive());
        while (particles.length < 20) particles.push(new Particle(p));
      };
      p.windowResized = () => p.resizeCanvas(p.windowWidth, p.windowHeight);
      class Particle {
        constructor(p) {
          this.p = p;
          this.x = p.random(p.width);
          this.y = p.height + 50;
          this.vx = p.random(-0.5, 0.5);
          this.vy = p.random(-2, -0.5);
          this.life = 255;
        }
        update() {
          this.x += this.vx;
          this.y += this.vy;
          this.life -= 1;
        }
        draw() {
          this.p.fill(245, 158, 11, this.life);
          this.p.noStroke();
          this.p.ellipse(this.x, this.y, 6);
        }
        isAlive() {
          return this.life > 0 && this.y > -50;
        }
      }
    };
    new p5(sketch);
  }

  initTextAnimations() {
    if (window.Splitting) Splitting();
  }

  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  loadSavedRecipes() {
    const saved = localStorage.getItem("wtfood-saved-recipes");
    return saved ? JSON.parse(saved) : [];
  }

  saveRecipesToStorage() {
    localStorage.setItem(
      "wtfood-saved-recipes",
      JSON.stringify(this.savedRecipes)
    );
  }
}

// Initialize
document.addEventListener("DOMContentLoaded", () => new WTFoodApp());
