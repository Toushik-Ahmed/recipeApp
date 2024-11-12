'use client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  getAllRecipes,
  postRecipe,
  Recipe,
  updateRecipes,
} from '@/redux/features/recipeSlice';
import { User } from '@/redux/features/userSlice';
import { AppDispatch } from '@/redux/store';
import { ChangeEvent, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Textarea } from '../ui/textarea';
import SelectComp from './Select';

type Props = {
  placeholder: string | React.ReactNode;
  title: string;
  recipe?: Recipe;
  handleEdit?: (id: string) => void;
};

export function DialogDemo({ placeholder, title, recipe }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const [open, setOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User>();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Recipe>({
    title: '',
    ingredient: '',
    instruction: '',
    time: '',
    url: '',
    userId: '',
    category: '',
    review: undefined,
  });

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const parsedUser = JSON.parse(userStr);
      setCurrentUser(parsedUser);
      setFormData((prev) => ({
        ...prev,
        userId: parsedUser.id,
      }));
    }
  }, []);

  useEffect(() => {
    if (recipe && currentUser) {
      setFormData({
        title: recipe.title || '',
        ingredient: recipe.ingredient || '',
        instruction: recipe.instruction || '',
        time: recipe.time || '',
        url: recipe.url || '',
        userId: recipe.userId || currentUser.id || '',
        category: recipe.category || '',
        review: recipe.review,
      });
      if (recipe.url) {
        setImagePreview(recipe.url);
      }
    }
  }, [recipe, currentUser]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (): Promise<string> => {
    if (!imageFile) return '';

    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('upload_preset', 'Toushik');
    formData.append('cloud_name', 'dx3et17af');

    try {
      const response = await fetch(
        'https://api.cloudinary.com/v1_1/dx3et17af/image/upload',
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error('Image upload failed:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!currentUser?.id) {
      console.error('No user ID available');
      return;
    }

    try {
      setIsSubmitting(true);

      // Keep existing URL if no new image is uploaded and we're editing
      let imageUrl = formData.url;

      // Only upload new image if there's a file selected
      if (imageFile) {
        const uploadedUrl = await uploadImage();
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        } else {
          throw new Error('Failed to upload image');
        }
      }

      const updatedRecipeData: Recipe = {
        ...formData,
        url: imageUrl, // Use the determined imageUrl
        userId: currentUser.id,
      };

      if (recipe?.id) {
        await dispatch(updateRecipes({ id: recipe.id, ...updatedRecipeData }));
        await dispatch(getAllRecipes());
      } else {
        await dispatch(postRecipe(updatedRecipeData));
        await dispatch(getAllRecipes());
      }

      // Reset form after successful submission
      setFormData({
        title: '',
        ingredient: '',
        instruction: '',
        time: '',
        url: '',
        category: '',
        userId: currentUser.id,
      });
      setImageFile(null);
      setImagePreview(null);
    } catch (error) {
      console.error('Error submitting recipe:', error);
    } finally {
      setIsSubmitting(false);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="bg-black text-white">
          {placeholder}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[35%]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Write all the necessary information about your recipe.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Label htmlFor="title" className="block mb-1">
              Title
            </Label>
            <Input
              onChange={handleChange}
              name="title"
              id="title"
              type="text"
              value={formData.title}
              placeholder="Recipe Title"
              className="text-black"
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="preparationTime" className="block mb-1">
              Preparation Time (minutes)
            </Label>
            <Input
              onChange={handleChange}
              name="time"
              id="preparation-time"
              type="number"
              value={formData.time}
              placeholder="time"
              className="text-black"
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="ingredients" className="block mb-1">
              Ingredients
            </Label>
            <Textarea
              onChange={handleChange}
              name="ingredient"
              id="ingredient"
              value={formData.ingredient}
              placeholder="List ingredients..."
              className="text-black"
              rows={3}
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="category" className="block mb-1">
              Category
            </Label>
            <SelectComp
              items={['Vegan', 'Breakfast', 'Dessert']}
              onSelect={(value: string) =>
                setFormData((prev) => ({ ...prev, category: value }))
              }
              selectedValue={formData.category}
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="instructions" className="block mb-1">
              Instructions
            </Label>
            <Textarea
              onChange={handleChange}
              name="instruction"
              id="instruction"
              value={formData.instruction}
              placeholder="Cooking instructions..."
              className="text-black"
              rows={4}
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="images" className="block mb-1">
              Image
            </Label>
            <Input
              onChange={handleImageChange}
              name="url"
              accept="image/*"
              type="file"
              placeholder="Upload Image"
              className="text-black"
            />
          </div>

          {imagePreview && (
            <div className="mb-4">
              <img
                src={imagePreview}
                alt="Image preview"
                className="w-32 h-32 object-cover"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 bg-black text-white py-2 px-4 rounded-lg disabled:opacity-50"
          >
            {isSubmitting
              ? 'Submitting...'
              : recipe
              ? 'Update Recipe'
              : 'Submit'}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
