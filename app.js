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

 // Add dynamic ingredient fields
 let ingredientCount = 2; // Initial number of ingredient fields

 addIngredientBtn.addEventListener('click', () => {
     ingredientCount++;
     const newIngredientRow = document.createElement('div');
     newIngredientRow.classList.add('ingredient-row');
     newIngredientRow.innerHTML = `
         <input
             type="text"
             name="ingredient-${ingredientCount}"
             placeholder="Format: 'Quantity,Unit,Description'"
         />
     `;
     ingredientContainer.appendChild(newIngredientRow);
 });


 document.querySelector('.upload')?.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const recipe = {
        idMeal: Date.now().toString(), // Generate a unique ID for the new recipe
        strMeal: formData.get('title'),
        strMealThumb: formData.get('image'),
        strCategory: formData.get('category'),
        strInstructions: formData.get('instructions'),
        ingredients: [],
    };

    // Collect all dynamic ingredient fields
    formData.forEach((value, key) => {
        if (key.startsWith('ingredient-')) {
            const [quantity, unit, description] = value.split(',');
            recipe.ingredients.push({ quantity, unit, description });
        }
    });

    // Add new recipe to state and re-render
    state.recipes = state.recipes || []; // Initialize recipes state if not present
    state.recipes.push(recipe);
    renderRecipes(state.recipes);

    // Close the modal and reset the form
    closeModal();
    e.target.reset();
    alert('Recipe was successfully uploaded!');
});


const toggleBookmark = async (recipeId) => {
    try {
        const response = await fetch(`${API_URL}/lookup.php?i=${recipeId}`);
        const data = await response.json();
        const recipe = data.meals[0];

        const index = state.bookmarks.findIndex((b) => b.idMeal === recipeId);
        if (index === -1) {
            // Add bookmark
            state.bookmarks.push(recipe);
        } else {
            // Remove bookmark
            state.bookmarks.splice(index, 1);
        }

        persistBookmarks();
        renderBookmarks();

        // Update bookmark button in recipes and details
        document.querySelectorAll(`.btn--bookmark[data-id="${recipeId}"]`)
            .forEach((btn) => btn.classList.toggle('bookmarked'));
    } catch (error) {
        console.error('Error toggling bookmark:', error);
    }
};

// Render Bookmarks
const renderBookmarks = () => {
    if (state.bookmarks.length === 0) {
        bookmarksList.innerHTML = `
            <div class="message">
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                    </svg>
                </div>
                <p>No bookmarks yet.</p>
            </div>
        `;
        return;
    }

    bookmarksList.innerHTML = state.bookmarks
        .map(generateRecipeMarkup)
        .join('');
};


 // Event Handlers
 searchForm.addEventListener('submit', async e => {
    e.preventDefault();
    const query = searchInput.value;
    if (!query) return;

    try {
        const recipes = await fetchRecipes(query);
        renderRecipes(recipes);
    } catch (error) {
        recipeContainer.innerHTML = `
            <div class="message">
                <p>${error.message}</p>
            </div>
        `;
    }
});

// Handle recipe clicks and bookmarks
document.addEventListener('click', async e => {
    // Handle recipe item clicks
    const recipeItem = e.target.closest('.results__item');
    if (recipeItem && !e.target.closest('.btn--bookmark')) {
        const id = recipeItem.dataset.id;
        try {
            const response = await fetch(`${API_URL}/lookup.php?i=${id}`);
            const data = await response.json();
            renderRecipeDetails(data.meals[0]);
        } catch (error) {
            recipeContainer.innerHTML = `
                <div class="message">
                    <p>Failed to load recipe details</p>
                </div>
            `;
        }
    }

    // Handle bookmark button clicks
    const bookmarkBtn = e.target.closest('.btn--bookmark');
    if (bookmarkBtn) {
        const id = bookmarkBtn.dataset.id;
        toggleBookmark(id);
    }
});



// Add recipe form handling
addRecipeBtn.addEventListener('click', () => {
    addRecipeWindow.classList.remove('hidden');
    overlay.classList.remove('hidden');
});

 // Close modal handlers
 const closeModal = () => {
    addRecipeWindow.classList.add('hidden');
    overlay.classList.add('hidden');
};

overlay.addEventListener('click', closeModal);
document.querySelector('.btn--close-modal')?.addEventListener('click', closeModal);

// Handle recipe form submission
document.querySelector('.upload')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const recipe = {
        title: formData.get('title'),
        sourceUrl: formData.get('sourceUrl'),
        image: formData.get('image'),
        publisher: formData.get('publisher'),
        cookingTime: formData.get('cookingTime'),
        servings: formData.get('servings'),
        ingredients: []
    };

    // Collect ingredients
    for (let i = 1; i <= 6; i++) {
        const ing = formData.get(`ingredient-${i}`);
        if (ing) {
            const [quantity, unit, description] = ing.split(',');
            recipe.ingredients.push({ quantity, unit, description });
        }
    }

    // Here you would typically send this to a backend
    console.log('New Recipe:', recipe);
    alert('Recipe was successfully uploaded!');
    closeModal();
    e.target.reset();
});

// Initialize bookmarks
renderBookmarks();
