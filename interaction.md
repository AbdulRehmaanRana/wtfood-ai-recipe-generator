# WTFood - AI Recipe Generator Interaction Design

## Core Interaction Flow

### Main Recipe Generator (Primary Feature)
**User Journey:**
1. User lands on page and sees a clean input field with placeholder text like "What's in your fridge? (e.g., eggs, cheese, tomato)"
2. User types ingredients separated by commas
3. Clicks "Generate Recipe" button with cooking emoji
4. Loading animation appears with sarcastic messages like "AI is judging your ingredient choices..."
5. Recipe appears with:
   - Recipe name with emoji
   - Ingredients list
   - 4-5 cooking steps
   - Sarcastic tip at the end
6. User can generate new recipes or save current one

### Interactive Components:

#### 1. Recipe Generator (Main)
- **Input Field**: Multi-line text area for ingredients
- **Generate Button**: Animated button with cooking emoji
- **Output Area**: Formatted recipe display with copy button
- **Save Button**: Heart icon to save recipe to local storage

#### 2. AI Mood Switcher (Secondary)
- **Toggle Switch**: Sarcastic Chef vs Polite Chef mode
- **Visual Feedback**: Chef emoji changes based on mode
- **Behavior**: Changes tone of generated recipes

#### 3. Recipe History (Secondary)
- **Saved Recipes Panel**: Slide-out panel from right side
- **Recipe Cards**: Mini cards showing saved recipes
- **Delete/Share**: Individual recipe actions

#### 4. Dark Mode Toggle (Secondary)
- **Theme Switcher**: Moon/Sun icon toggle
- **Smooth Transition**: Color scheme changes with animation

## Multi-turn Interaction Examples:

### Recipe Variations:
1. User generates recipe with eggs, cheese, tomato
2. Gets "Scrambled Chaos" recipe
3. User can click "Make it vegetarian" button
4. AI suggests modifications keeping same base ingredients

### Ingredient Substitution:
1. User asks for recipe with chicken, but doesn't have it
2. AI suggests: "No chicken? Use tofu and cry silently."
3. User can click "Suggest alternatives" 
4. AI provides 3 substitution options

### Difficulty Levels:
1. After generating basic recipe
2. User can select difficulty: "Lazy", "Normal", "Chef Mode"
3. AI adjusts steps complexity accordingly

## Visual Feedback:
- Loading states with humorous messages
- Success animations when recipe is generated
- Shake animation for invalid inputs
- Smooth transitions between recipe cards
- Hover effects on all interactive elements

## Mobile Considerations:
- Touch-friendly buttons (minimum 44px)
- Swipe gestures for recipe navigation
- Optimized input fields for mobile keyboards
- Responsive recipe card layout