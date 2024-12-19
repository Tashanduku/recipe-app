
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
        localRecipes: JSON.parse(localStorage.getItem('localRecipes') || '[]')
    };

    // Save state to localStorage
    const persistState = () => {
        localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
        localStorage.setItem('localRecipes', JSON.stringify(state.localRecipes));
    };

    // Format ingredients for API compatibility
    const formatRecipeForStorage = (recipe) => {
        const formattedRecipe = {
            ...recipe,
            strMeal: recipe.strMeal,
            strMealThumb: recipe.strMealThumb || 'https://via.placeholder.com/300',
            strCategory: recipe.strCategory,
            strInstructions: recipe.strInstructions,
        };

        // Format ingredients to match API structure
        recipe.ingredients.forEach((ing, index) => {
            formattedRecipe[`strIngredient${index + 1}`] = ing.description;
            formattedRecipe[`strMeasure${index + 1}`] = `${ing.quantity} ${ing.unit}`.trim();
        });

        return formattedRecipe;
    };

    // Fetch Recipes (now includes local recipes)
    async function fetchRecipes(query) {
        try {
            // Search local recipes first
            const localResults = state.localRecipes.filter(recipe => 
                recipe.strMeal.toLowerCase().includes(query.toLowerCase()) ||
                recipe.strCategory?.toLowerCase().includes(query.toLowerCase())
            );

            // Fetch from API
            const response = await fetch(`${API_URL}/search.php?s=${query}`);
            const data = await response.json();
            const apiResults = data.meals || [];

            // Combine results, with local recipes first
            return [...localResults, ...apiResults];
        } catch (error) {
            throw new Error('Failed to fetch recipes');
        }
    }

    // Generate Recipe Markup (unchanged)
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

    // Render Recipes (unchanged)
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

    // Get recipe by ID (now checks local recipes first)
    const getRecipeById = async (id) => {
        // Check local recipes first
        const localRecipe = state.localRecipes.find(recipe => recipe.idMeal === id);
        if (localRecipe) return localRecipe;

        // If not found locally, fetch from API
        const response = await fetch(`${API_URL}/lookup.php?i=${id}`);
        const data = await response.json();
        return data.meals?.[0];
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

    // Toggle Bookmark (updated to use getRecipeById)
    const toggleBookmark = async (recipeId) => {
        try {
            const recipe = await getRecipeById(recipeId);
            if (!recipe) throw new Error('Recipe not found');

            const index = state.bookmarks.findIndex((b) => b.idMeal === recipeId);
            if (index === -1) {
                state.bookmarks.push(recipe);
            } else {
                state.bookmarks.splice(index, 1);
            }

            persistState();
            renderBookmarks();

            // Update bookmark button in recipes and details
            document.querySelectorAll(`.btn--bookmark[data-id="${recipeId}"]`)
                .forEach((btn) => btn.classList.toggle('bookmarked'));
        } catch (error) {
            console.error('Error toggling bookmark:', error);
        }
    };

    // Handle recipe form submission (updated)
    document.querySelector('.upload')?.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const recipe = {
            idMeal: `local_${Date.now()}`, // Prefix with 'local_' to distinguish from API recipes
            strMeal: formData.get('title'),
            strMealThumb: formData.get('image'),
            strCategory: formData.get('category'),
            strInstructions: formData.get('instructions'),
            ingredients: []
        };

        // Collect ingredients
        formData.forEach((value, key) => {
            if (key.startsWith('ingredient-') && value.trim()) {
                const [quantity, unit, description] = value.split(',').map(item => item.trim());
                recipe.ingredients.push({ quantity, unit, description });
            }
        });

        // Format and store the recipe
        const formattedRecipe = formatRecipeForStorage(recipe);
        state.localRecipes.push(formattedRecipe);
        persistState();

        // Update UI
        closeModal();
        e.target.reset();
        renderRecipes([formattedRecipe]); // Show the new recipe
        alert('Recipe was successfully uploaded!');
    });

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

    // Toggle bookmarks list visibility
    bookmarksBtn.addEventListener('click', () => {
        bookmarksListContainer.classList.toggle('hidden');
        renderBookmarks();
    });

    // Handle recipe clicks and bookmarks
    document.addEventListener('click', async e => {
        // Handle recipe item clicks
        const recipeItem = e.target.closest('.results__item');
        if (recipeItem && !e.target.closest('.btn--bookmark')) {
            const id = recipeItem.dataset.id;
            try {
                const recipe = await getRecipeById(id);
                if (recipe) {
                    renderRecipeDetails(recipe);
                }
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

    // Add dynamic ingredient fields
    let ingredientCount = 2;

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

    // Initialize
    renderBookmarks();
});

