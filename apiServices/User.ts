import { User } from '@/redux/features/userSlice';
import axios from 'axios';

export const signUp = async (data: User) => {
  const userData = await axios.post('http://localhost:5000/users', data);
  return userData.data;
};

export const login = async (data: Partial<User>) => {
  try {
    const response = await axios.get(
      'http://localhost:5000/users?email=' + data.email
    );
    const user = response.data[0];

    if (!user) {
      throw new Error('Invalid email or password');
    }

    if (user.password !== data.password) {
      throw new Error('Invalid email or password');
    }

    return user;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

// export const addFavourites = async (data:string) => {
//   const response = await axios.put(
//     `http://localhost:5000/users?id=${data}`,
//     data
//   );
//   return response.data;
// };

// export const getFavoriteRecipes = async (data: User) => {
//   try {
//     const response = await axios.get(`http://localhost:5000/users=` + data.id);
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching favorites:', error);
//     throw error;
//   }
// };
