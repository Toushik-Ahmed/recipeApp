'use client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { postReviewData, Recipe, Review } from '@/redux/features/recipeSlice';
import { AppDispatch } from '@/redux/store';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { User } from '@/redux/features/userSlice';
import SelectComp from './Select';



type Props = {
  setSelectedCategory: (value: string) => void;
  recipe: Recipe;
};

const DialogueComponent = ({ setSelectedCategory, recipe }: Props) => {
  const [comment, setComment] = useState('');
  const [newRating, setNewRating] = useState<number | null>(null);
  const [currentUser, setCurrentUser] = useState<User>();
  const [submit, setSubmit] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const storedUser = await localStorage.getItem('user');

      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      }
    };
    fetchUser();
  }, []);

  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = async () => {
    if (newRating === null) {
      console.error('Rating is required');
      return;
    }

    const newReview: Review = {
      userId: currentUser?.username || '',
      rating: [newRating],
      comment: [comment],
    };

    const updatedRecipe: Recipe = {
      ...recipe,
      review: recipe.review ? [...recipe.review, newReview] : [newReview],
    };

    try {
      // Directly pass updatedRecipe, as the thunk accepts a Recipe object.
      await dispatch(postReviewData(updatedRecipe));
      setComment('');
      setNewRating(null);
      setSubmit(true);
    } catch (error) {
      console.error('Failed to update review:', error);
    }
  };
  return (
    <div>
      <Dialog>
        <DialogTrigger className="bg-black text-sm text-white font-[500] py-2 px-4 rounded-lg">
          Review
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Review</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <Label className="font-bold">Rate:</Label>
            <SelectComp
              items={['1', '2', '3', '4', '5']}
              onSelect={(value: string) => {
                setSelectedCategory(value), setNewRating(parseInt(value));
              }}
              placeholder="Select a number"
            />
            <Label className="font-bold">Comment:</Label>
            <Textarea
              placeholder="Leave a comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <Button onClick={handleSubmit}>Submit</Button>

            {recipe.review && recipe.review.length > 0 ? (
              <div className="mt-4">
                <Label className="font-bold">User Comments:</Label>
                <ul className="list-disc pl-5">
                  {recipe.review.map((rev, index) => (
                    <li key={index} className="text-sm mt-1">
                      <strong>{rev.userId}:</strong>{' '}
                      {rev.comment && rev.comment.length > 0 ? (
                        rev.comment.map((cmt, idx) => (
                          <p key={idx} className="ml-2">
                            {cmt}
                          </p>
                        ))
                      ) : (
                        <p className="ml-2">No comment available</p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              'No Comments'
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DialogueComponent;
