import { Recipe } from '@/redux/features/recipeSlice';
import axios from 'axios';

export const postRecipeData = async (data: Recipe) => {
  const response = await axios.post('http://localhost:5000/recipes', data);
  return response.data;
};

export const getAllRecipe = async () => {
  const response = await axios.get('http://localhost:5000/recipes');
  return response.data;
};

export const getRecipeById = async (id: string) => {
  const response = await axios.get(
    'http://localhost:5000/recipes?userId=' + id
  );
  return response.data;
};

export const deleteRecipeById = async (id: string) => {
  try {
    const response = await axios.delete(`http://localhost:5000/recipes/${id}`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const updateRecipe = async (id: string, data: Recipe) => {
  const response = await axios.put(`http://localhost:5000/recipes/${id}`, data);
  return response.data;
};

export const postReview = async (id: string, data: Recipe) => {
  const response = await axios.put(`http://localhost:5000/recipes/${id}`, data);
  return response.data;
};

export const addFavourites = async (userId: string, recipeId: string) => {
  const currentFavorites = await getFavourites(userId);

  if (currentFavorites.includes(recipeId)) {
    return { message: 'Recipe is already in favorites.' };
  }

  const response = await axios.post(`http://localhost:5000/favourites`, {
    recipeId,
    userId,
  });
  return response.data;
};

export const getFavourites = async (userId: string) => {
  const response = await axios.get(
    `http://localhost:5000/favourites?userId=${userId}`
  );

  const recipeIds = response.data.map(
    (item: { recipeId: string }) => item.recipeId
  );

  return recipeIds;
};

export const getRecipesByIds = async (ids: string[]) => {
  try {
    if (!ids.length) return [];

    const response = await axios.get('http://localhost:5000/recipes');
    const allRecipes = response.data;

    const favoriteRecipes = allRecipes.filter((recipe: Recipe) =>
      ids.includes(recipe.id!)
    );

    return favoriteRecipes;
  } catch (error) {
    console.error('Error fetching recipes by IDs:', error);
    return [];
  }
};

export const removeFavourites = async (userId: string, recipeId: string) => {
  try {
    const response = await axios.get(
      `http://localhost:5000/favourites?userId=${userId}&recipeId=${recipeId}`
    );

    if (response.data && response.data.length > 0) {
      const favoriteId = response.data[0].id;

      await axios.delete(`http://localhost:5000/favourites/${favoriteId}`);
      return { success: true, message: 'Recipe removed from favorites' };
    }

    return { success: false, message: 'Favorite not found' };
  } catch (error) {
    console.error('Error removing favorite:', error);
    throw error;
  }
};
