'use client';
import {
  getFavourites,
  getRecipeById,
  getRecipesByIds,
  removeFavourites,
} from '@/apiServices/recipe';
import {
  deleteRecipe,
  getAllRecipes,
  Recipe,
} from '@/redux/features/recipeSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { User } from '@/redux/features/userSlice';
import CardComponent from './customComponents/CardComp';
import { DialogDemo } from './customComponents/Dialog';
import SelectComp from './customComponents/Select';
import { Button } from './ui/button';
import { Input } from './ui/input';

const RecipeComponent = () => {
  const [allRecipes, setAllRecipes] = useState(true);
  const [myRecipes, setMyRecipes] = useState(false);
  const [myFavourites, setMyFavourites] = useState<boolean>(false);
  const [myRecipeLists, setMyRecipeLists] = useState<Recipe[]>([]);
  const [currentUser, setCurrentUser] = useState<User>();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [favourites, setFavourites] = useState<string[]>([]);
  const [getFavouriteRecipes, setGetFavouriteRecipes] = useState<Recipe[]>([]);
  const [shouldRefetchFavorites, setShouldRefetchFavorites] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const recipesList = useSelector((state: RootState) => state.recipe.recipes);

  useEffect(() => {
    const fetchUser = async () => {
      const storedUser = await localStorage.getItem('user');
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchRecipes = async () => {
      if (currentUser?.id) {
        try {
          const [recipesRes, favouritesRes] = await Promise.all([
            getRecipeById(currentUser.id),
            getFavourites(currentUser.id),
          ]);

          setMyRecipeLists(recipesRes);
          setFavourites(favouritesRes);

          if (favouritesRes.length > 0) {
            const favoriteRecipes = await getRecipesByIds(favouritesRes);
            setGetFavouriteRecipes(favoriteRecipes);
          } else {
            setGetFavouriteRecipes([]);
          }

          setShouldRefetchFavorites(false);
        } catch (error) {
          console.error('Error fetching recipes:', error);
        }
      }
    };

    if (currentUser?.id && (myRecipes || shouldRefetchFavorites)) {
      fetchRecipes();
    }
  }, [currentUser, myRecipes, shouldRefetchFavorites,recipesList]);

  useEffect(() => {
    dispatch(getAllRecipes());
  }, [dispatch]);

  const handleDelete = (id: string) => {
    if (id) {
      dispatch(deleteRecipe(id));
      setMyRecipeLists((prev) => prev.filter((recipe) => recipe.id !== id));
    }
  };

  const handleRemoveFavourites = async (favouritesId: string) => {
    if (currentUser?.id) {
      try {
        await removeFavourites(currentUser.id, favouritesId);
        setFavourites((prev) => prev.filter((id) => id !== favouritesId));
        setGetFavouriteRecipes((prev) =>
          prev.filter((recipe) => recipe.id !== favouritesId)
        );
      } catch (error) {
        console.error('Error removing favourite:', error);
      }
    }
  };

  const refreshFavorites = () => {
    setShouldRefetchFavorites(true);
  };

  const handleEdit = (id: string) => {
    console.log('Edit recipe with ID:', id);
  };

  const filteredRecipes = (recipes: Recipe[]) => {
    return recipes.filter((recipe) => {
      const matchesSearch =
        recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.ingredient.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.time.toString().includes(searchTerm);

      const matchesCategory = selectedCategory
        ? recipe.category?.toLowerCase() === selectedCategory.toLowerCase()
        : true;

      return matchesSearch && matchesCategory;
    });
  };

  const handleReset = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setMyRecipes(false);
    setAllRecipes(true);
    setMyFavourites(false);
    setMyRecipeLists([]);
    setGetFavouriteRecipes([]);
    setFavourites([]);
  };

  return (
    <div className="flex flex-col justify-center h-full p-10">
      <div className="flex flex-wrap gap-4 justify-center mb-8">
        <Button
          onClick={() => {
            setMyRecipes(true);
            setAllRecipes(false);
            setMyFavourites(false);
          }}
        >
          My Recipes
        </Button>
        <Button
          onClick={() => {
            setAllRecipes(true);
            setMyRecipes(false);
            setMyFavourites(false);
          }}
        >
          All Recipes
        </Button>
        <DialogDemo placeholder="Add Recipe" title="Create Recipe" />
        <Button
          onClick={() => {
            setMyRecipes(false);
            setAllRecipes(false);
            setMyFavourites(true);
            refreshFavorites();
          }}
        >
          Favourites
        </Button>
      </div>
      <div className="flex gap-4 justify-end mb-10">
        <div className="relative w-64">
          <Input
            placeholder="title, ingredients or time"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10"
          />
          <Button
            className="absolute right-0 top-0 h-full px-3"
            variant="ghost"
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
        <div className="w-48">
          <SelectComp
            items={['vegan', 'breakfast', 'dessert']}
            onSelect={(value: string) => setSelectedCategory(value)}
            placeholder="Filter by category"
            selectedValue={selectedCategory}
          />
        </div>
        <Button onClick={() => handleReset()}>Reset</Button>
      </div>

      {allRecipes && <CardComponent recipe={filteredRecipes(recipesList)} />}
      {myFavourites && (
        <CardComponent
          recipe={filteredRecipes(getFavouriteRecipes)}
          showActions={false}
          favActions={true}
          handleRemove={handleRemoveFavourites}
        />
      )}
      {myRecipes && (
        <CardComponent
          recipe={filteredRecipes(myRecipeLists)}
          showActions={true}
          onEdit={handleEdit}
          handleDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default RecipeComponent;
