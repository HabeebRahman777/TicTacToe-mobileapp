import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeToken = async (token) => {
  await AsyncStorage.setItem('auth_token', token);
};

export const getToken = async () => {
  return await AsyncStorage.getItem('auth_token');
};

export const clearToken = async () => {
  await AsyncStorage.removeItem('auth_token');
};

export const storeUser = async(user) => {
  await AsyncStorage.setItem('authUser', JSON.stringify(user)); 
};


export const getUser = async () => {
  const user = await AsyncStorage.getItem('authUser');
  return JSON.parse(user);
};
