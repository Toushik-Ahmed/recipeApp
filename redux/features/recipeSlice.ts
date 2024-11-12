import {
  deleteRecipeById,
  getAllRecipe,
  postRecipeData,
  postReview,
  updateRecipe,
} from '@/apiServices/recipe';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Review {
  userId: string;
  rating?: number[];

  comment?: string[];
}

export interface Recipe {
  id?: string;
  title: string;
  url: string;
  time: string;
  ingredient: string;
  instruction: string;
  userId?: string;
  category?: string;
  review?: Review[];
}

interface RecipeState {
  recipes: Recipe[];
}

const initialState: RecipeState = {
  recipes: [],
};

export const postRecipe = createAsyncThunk(
  'recipe/post',
  async (data: Recipe) => {
    const response = await postRecipeData(data);
    return response;
  }
);

export const getAllRecipes = createAsyncThunk('recipe/get', async () => {
  const response = await getAllRecipe();
  return response;
});

export const deleteRecipe = createAsyncThunk(
  'recipe/delete',
  async (id: string) => {
    const response = await deleteRecipeById(id);
    return id;
  }
);

export const updateRecipes = createAsyncThunk(
  'recipe/update',
  async (data: Recipe) => {
    if (data.id) {
      const response = await updateRecipe(data.id, data);
      console.log('recipe updated');
      return response;
    }
    throw new Error('Recipe ID is undefined');
  }
);

export const postReviewData = createAsyncThunk(
  'recipe/review',
  async (data: Recipe) => {
    const response = await postReview(data.id as string, data);
    return response;
  }
);

export const recipeSlice = createSlice({
  name: 'recipe',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      postRecipe.fulfilled,
      (state, action: PayloadAction<Recipe>) => {
        state.recipes.push(action.payload);
      }
    );
    builder.addCase(
      getAllRecipes.fulfilled,
      (state, action: PayloadAction<Recipe[]>) => {
        state.recipes = action.payload;
      }
    );
    builder.addCase(
      deleteRecipe.fulfilled,
      (state, action: PayloadAction<string>) => {
        state.recipes = state.recipes.filter(
          (recipe) => recipe.id !== action.payload
        );
      }
    );
    builder.addCase(
      updateRecipes.fulfilled,
      (state, action: PayloadAction<Recipe>) => {
        const index = state.recipes.findIndex(
          (recipe) => recipe.id === action.payload.id
        );
        if (index !== -1) {
          state.recipes[index] = action.payload;
        }
      }
    );
    builder.addCase(
      postReviewData.fulfilled,
      (state, action: PayloadAction<Recipe>) => {
        const index = state.recipes.findIndex(
          (recipe) => recipe.id === action.payload.id
        );
        if (index !== -1) {
          state.recipes[index] = action.payload;
        }
      }
    );
  },
});

export default recipeSlice.reducer;
