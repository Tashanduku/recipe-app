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
