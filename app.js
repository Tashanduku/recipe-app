document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'https://www.themealdb.com/api/json/v1/1';

    // DOM Elements
    const searchForm = document.querySelector('.search');
    const searchInput = document.querySelector('.search__field');
    const resultsContainer = document.querySelector('.results');
    const recipeContainer = document.querySelector('.recipe');
    const bookmarksList = document.querySelector('.bookmarks__list');
    const addRecipeBtn = document.querySelector('.nav__btn--add-recipe');
    const bookmarksBtn = document.querySelector('.nav__btn--bookmarks');
    const overlay = document.querySelector('.overlay');
    const addRecipeWindow = document.querySelector('.add-recipe-window');
    const ingredientContainer = document.querySelector('.ingredient-inputs');
    const addIngredientBtn = document.querySelector('.btn--add-ingredient');
})

 // Fetch Recipes
 async function fetchRecipes(query) {
    try {
        const response = await fetch(`${API_URL}/search.php?s=${query}`);
        const data = await response.json();
        return data.meals || [];
    } catch (error) {
        throw new Error('Failed to fetch recipes');
    }
}