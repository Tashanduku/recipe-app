
document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'https://www.themealdb.com/api/json/v1/1';

    // DOM Elements
    const searchForm = document.querySelector('.search');
    const searchInput = document.querySelector('.search__field');
    const resultsContainer = document.querySelector('.results');
    const recipeContainer = document.querySelector('.recipe');
    const bookmarksBtn = document.querySelector('.nav__btn--bookmarks');
    const bookmarksListContainer = document.querySelector('.bookmarks');
    const bookmarksList = document.querySelector('.bookmarks__list');
    const addRecipeBtn = document.querySelector('.nav__btn--add-recipe');
    const overlay = document.querySelector('.overlay');
    const addRecipeWindow = document.querySelector('.add-recipe-window');
    const ingredientContainer = document.querySelector('.ingredient-inputs');
    const addIngredientBtn = document.querySelector('.btn--add-ingredient');

// State Management
const state = {
    bookmarks: JSON.parse(localStorage.getItem('bookmarks') || '[]'),
};

// Save bookmarks to localStorage
const persistBookmarks = () => {
    localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

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

// Generate Recipe Markup
const generateRecipeMarkup = (recipe) => {
    const isBookmarked = state.bookmarks.some((b) => b.idMeal === recipe.idMeal);
    return `
        <li class="results__item" data-id="${recipe.idMeal}">
            <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}">
            <div>
                <h4>${recipe.strMeal}</h4>
                <p>${recipe.strCategory || ''}</p>
                <button class="btn--bookmark ${isBookmarked ? 'bookmarked' : ''}" data-id="${recipe.idMeal}">
                    <svg class="nav__icon">
                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                    </svg>
                </button>
            </div>
        </li>
    `;
};

// Render Recipes
const renderRecipes = (recipes) => {
    resultsContainer.innerHTML = recipes.map(generateRecipeMarkup).join('');
};

// Render Recipe Details
const renderRecipeDetails = (recipe) => {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
        if (recipe[`strIngredient${i}`]) {
            ingredients.push({
                ingredient: recipe[`strIngredient${i}`],
                measure: recipe[`strMeasure${i}`],
            });
        }
    }

    const isBookmarked = state.bookmarks.some((b) => b.idMeal === recipe.idMeal);

    recipeContainer.innerHTML = `
        <div class="recipe__details">
            <div class="recipe__header">
                <h2>${recipe.strMeal}</h2>
                <button class="btn--bookmark ${isBookmarked ? 'bookmarked' : ''}" data-id="${recipe.idMeal}">
                    <svg class="nav__icon">
                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                    </svg>
                </button>
            </div>
            <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}">
            <div class="recipe__info">
                <h3>Ingredients:</h3>
                <ul>
                    ${ingredients.map((ing) => `
                        <li>${ing.measure} ${ing.ingredient}</li>
                    `).join('')}
                </ul>
                <h3>Instructions:</h3>
                <p>${recipe.strInstructions}</p>
            </div>
        </div>
    `;
};

