'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Recipe } from '@/redux/features/recipeSlice';
import { AppDispatch } from '@/redux/store';
import { useEffect, useState } from 'react';
import { CiHeart } from 'react-icons/ci';
import { IoStarSharp } from 'react-icons/io5';
import { MdOutlineDeleteForever } from 'react-icons/md';
import { useDispatch } from 'react-redux';

import { addFavourites } from '@/apiServices/recipe';
import { User } from '@/redux/features/userSlice';
import { CiEdit } from 'react-icons/ci';
import { DialogDemo } from './Dialog';
import DialogueComponent from './DialogComponent';

type Props = {
  recipe: Recipe[];
  showActions?: boolean;
  handleDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
  favActions?: boolean;
  handleRemove?: (id: string) => void;
};

const CardComponent = ({
  recipe,
  showActions = false,
  handleDelete,
  onEdit,
  favActions,
  handleRemove,
}: Props) => {
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [category, setSelectedCategory] = useState<string>('');
  const dispatch = useDispatch<AppDispatch>();
  const [favouritesId, setFavouritesId] = useState('');
  const [currentUser, setCurrentUser] = useState<User>();

  useEffect(() => {
    const fetchUser = async () => {
      const storedUser = await localStorage.getItem('user');
      console.log(storedUser);
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      }
    };
    fetchUser();
  }, []);

  const handleSubmit = async (favouritesId: string) => {
    try {
      if (currentUser?.id) {
        const response = await addFavourites(currentUser.id, favouritesId);
        console.log(response);
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {recipe.map((rec, index) => (
        <Card
          key={index}
          className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300 w-64 min-h-64"
        >
          <CardHeader className="p-2">
            <CardTitle className="text-lg font-semibold text-gray-800 mb-2 flex justify-between">
              <span className="line-clamp-1">{rec.title}</span>
              <div className="flex items-center gap-1 ml-2 shrink-0">
                <p>
                  {rec.review && rec.review.length > 0
                    ? (
                        rec.review.reduce((acc, current) => {
                          const sumRating =
                            current.rating?.reduce(
                              (sum, rating) => sum + (rating || 0),
                              0
                            ) || 0;
                          const countRating = current.rating?.length || 0;
                          return acc + sumRating / (countRating || 1);
                        }, 0) / rec.review.length
                      ).toFixed(1)
                    : 'N/A'}
                </p>
                <IoStarSharp />
              </div>
            </CardTitle>
            {rec.url ? (
              <img
                src={rec.url}
                alt={rec.title}
                className="w-full h-40 object-cover rounded-md"
              />
            ) : (
              <div className="w-full h-40 bg-gray-200 rounded-md flex items-center justify-center">
                <span className="text-gray-500">No Image</span>
              </div>
            )}
          </CardHeader>
          <CardContent className="p-2">
            <p className="text-sm text-gray-600 mb-1">
              <span className="font-semibold">Category:</span> {rec.category}
            </p>
            <p className="text-sm text-gray-600 mb-1">
              <span className="font-semibold">Prep time:</span> {rec.time} min
            </p>
            <p className="text-sm text-gray-600 mb-1">
              <span className="font-semibold">Instructions:</span>
            </p>
            <p className="text-sm text-gray-600 mb-2 line-clamp-3">
              {rec.instruction}
            </p>
            <p className="text-sm text-gray-600 mb-1">
              <span className="font-semibold">Ingredients:</span>
            </p>
            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
              {rec.ingredient}
            </p>
            {showActions && (
              <div className="flex justify-end space-x-2 mt-2 bg-white">
                <DialogDemo

                  recipe={rec}
                  placeholder={<CiEdit />}
                  title="Edit"
                />
                <Button
                  variant="outline"
                  size="default"
                  className="text-red-600 hover:bg-red-50"
                  onClick={() => rec.id && handleDelete && handleDelete(rec.id)}
                >
                  <MdOutlineDeleteForever className="mr-1" /> Delete
                </Button>
              </div>
            )}

            {favActions && (
              <div className="flex justify-end space-x-2 mt-2">
                <Button
                  variant="outline"
                  size="default"
                  className="text-red-600 hover:bg-red-50"
                  onClick={() => rec.id && handleRemove && handleRemove(rec.id)}
                >
                  <MdOutlineDeleteForever className="mr-1" /> Remove
                </Button>
              </div>
            )}

            {!showActions && !favActions && (
              <div className="flex items-center gap-2 justify-end p-1">
                <DialogueComponent
                  recipe={rec}
                  setSelectedCategory={setSelectedCategory}
                />
                <Button
                  onClick={() => {
                    handleSubmit(rec.id!);
                  }}
                  variant="outline"
                  size="default"
                  className="text-red-600 hover:bg-red-50"
                >
                  <CiHeart />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CardComponent;
