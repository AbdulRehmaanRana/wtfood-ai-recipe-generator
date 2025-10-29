# WTFood - Project Outline

## File Structure
```
/mnt/okcomputer/output/
├── index.html              # Main recipe generator page
├── about.html              # About the app and how it works  
├── saved.html              # Saved recipes page
├── main.js                 # Core JavaScript functionality
├── resources/              # Local assets folder
│   ├── hero-cooking.jpg    # Hero background image
│   ├── ingredients-bg.jpg  # Ingredients background
│   ├── kitchen-tools.jpg   # Kitchen tools image
│   ├── recipe-card-1.jpg   # Sample recipe images
│   ├── recipe-card-2.jpg
│   ├── recipe-card-3.jpg
│   └── user-avatar.jpg     # Default user avatar
├── interaction.md          # Interaction design document
├── design.md              # Visual design system
└── outline.md             # This project outline
```

## Page Breakdown

### 1. index.html - Main Recipe Generator
**Purpose**: Core functionality - ingredient input and recipe generation
**Sections**:
- Navigation bar with app logo and menu
- Hero section with cooking background and app introduction
- Main recipe generator interface:
  - Ingredient input field with placeholder examples
  - Generate recipe button with cooking emoji
  - AI mood toggle (Sarcastic vs Polite chef)
  - Recipe output area with formatted results
- Recipe actions: Save, Share, Generate New
- Background particle effects and animations
- Footer with app info

**Interactive Elements**:
- Ingredient input with auto-suggestions
- Recipe generation with loading animations
- Save to local storage functionality
- Share recipe feature
- Dark mode toggle

### 2. about.html - App Information
**Purpose**: Explain how the app works and showcase features
**Sections**:
- Navigation bar
- Hero section with kitchen imagery
- How it works explanation with animated steps
- Feature showcase with icons and descriptions
- Example recipes carousel
- FAQ section
- Call-to-action to try the app
- Footer

**Interactive Elements**:
- Animated step-by-step guide
- Image carousel of example recipes
- Expandable FAQ items

### 3. saved.html - Saved Recipes
**Purpose**: Display and manage saved recipes
**Sections**:
- Navigation bar
- Hero section with saved recipes count
- Recipe grid/list view toggle
- Search and filter functionality
- Individual recipe cards with:
  - Recipe name and image
  - Ingredients list
  - Cooking steps
  - Sarcastic tips
  - Date saved
- Recipe management actions
- Footer

**Interactive Elements**:
- Recipe search and filtering
- Grid/list view toggle
- Recipe deletion
- Export/share multiple recipes
- Sort by date/name/difficulty

## JavaScript Functionality (main.js)

### Core Features:
1. **Recipe Generation Logic**
   - Mock AI responses with sarcastic/polite modes
   - Ingredient parsing and validation
   - Recipe template system
   - Local storage integration

2. **UI Interactions**
   - Form handling and validation
   - Loading states and animations
   - Modal dialogs for actions
   - Toast notifications

3. **Data Management**
   - Local storage for saved recipes
   - Recipe search and filtering
   - Import/export functionality
   - Settings persistence

4. **Visual Effects**
   - Particle systems with p5.js
   - Text animations with Splitting.js
   - Smooth transitions with Anime.js
   - Background effects with Pixi.js

### Mock Recipe Database:
- 15+ pre-written recipe templates
- Ingredient combination patterns
- Sarcastic and polite response variations
- Difficulty level adjustments
- Cooking tip variations

## Visual Assets Strategy

### Hero Images:
- High-quality cooking/kitchen photography
- Warm, inviting color grading
- Professional food styling
- Landscape orientation for banners

### Recipe Cards:
- Consistent food photography style
- Varied cuisines and dish types
- Appetizing presentation
- Square format for grid layouts

### UI Elements:
- Custom cooking-themed icons
- Ingredient illustrations
- Chef character avatars
- Loading animation graphics

## Technical Implementation

### Libraries Integration:
- CDN imports for all external libraries
- Fallback loading for offline capability
- Performance optimization for animations
- Mobile-responsive design

### Accessibility:
- ARIA labels for interactive elements
- Keyboard navigation support
- High contrast text/background ratios
- Screen reader compatibility

### Performance:
- Lazy loading for images
- Efficient DOM manipulation
- Optimized animation loops
- Local storage management

This structure provides a complete, engaging recipe generator experience with multiple pages, rich interactions, and professional visual design while maintaining the app's fun, sarcastic personality.