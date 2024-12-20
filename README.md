# Recipe APP

## Overview
A modern, responsive web application that allows users to search for recipes, view detailed cooking instructions, bookmark favorite recipes, and add their own recipes to the collection. The application uses the TheMealDB API and provides local storage functionality for user-added recipes and bookmarks.

## Features

### 🔍 Recipe Search
- Real-time recipe search functionality
- Integration with TheMealDB API
- Combined results from both API and locally stored recipes
- Clean and intuitive results display with recipe thumbnails

### 📖 Recipe Details
- Detailed view of selected recipes including:
  - Recipe title and image
  - Complete list of ingredients with measurements
  - Step-by-step cooking instructions
- Easy-to-use exit button to return to search results

### 🔖 Bookmarking System
- Add/remove recipes to/from bookmarks
- Persistent bookmarks storage using localStorage
- Quick access to bookmarked recipes through dedicated panel
- Visual indication of bookmarked status on recipes

### ➕ Custom Recipe Addition
- User-friendly modal form for adding personal recipes
- Support for multiple ingredients with dynamic field addition
- Custom recipe integration with search functionality
- Local storage persistence for user-added recipes

## Technical Implementation

### Frontend Technologies
- HTML5
- CSS3
- JavaScript 

### Styling Features
- Responsive design
- Custom CSS properties
- Flexbox and Grid layouts
- Smooth transitions and animations

### JavaScript Functionality
- Async/await for API calls
- Event delegation for dynamic elements
- Local storage management
- State management system
- DOM manipulation

### API Integration
- TheMealDB API integration
- Error handling for failed API requests
- Combined local and API search results

## File Structure
```
├── index.html          # Main HTML structure
├── styles.css          # Styling definitions
└── app.js             # Application logic
```

## Setup Instructions

1. Clone the repository
2. Open `index.html` in a modern web browser
3. No build process or dependencies required

## Usage Guide

### Searching for Recipes
1. Enter keywords in the search bar
2. Press enter or click the search button
3. Browse through the results
4. Click on any recipe to view details

### Adding a Recipe
1. Click the "Add recipe" button
2. Fill in the recipe details:
   - Title
   - Image URL
   - Publisher
   - Prep time
   - Servings
   - Ingredients (click + to add more)
3. Click "Upload" to save

### Managing Bookmarks
1. Click the bookmark icon on any recipe to save it
2. Access saved recipes via the "Bookmarks" button
3. Remove bookmarks by clicking the bookmark icon again

## Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Local Storage
The application uses localStorage to persist:
- User-added recipes
- Bookmarked recipes
- All data persists between sessions

## Performance Considerations
- Efficient DOM manipulation
- Event delegation for better performance
- Optimized state management
- Minimal dependencies

## Contributing
Contributions are welcome! 

