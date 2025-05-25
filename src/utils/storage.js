import AsyncStorage from '@react-native-async-storage/async-storage';

export const getStorageData = async (key) => {
  try {
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Erro ao ler dados do storage:', error);
    return null;
  }
};

export const setStorageData = async (key, data) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Erro ao salvar dados no storage:', error);
    return false;
  }
};

export const removeStorageData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Erro ao remover dados do storage:', error);
    return false;
  }
};

export const clearAllStorage = async () => {
  try {
    await AsyncStorage.clear();
    return true;
  } catch (error) {
    console.error('Erro ao limpar storage:', error);
    return false;
  }
};

export const getAllKeys = async () => {
  try {
    return await AsyncStorage.getAllKeys();
  } catch (error) {
    console.error('Erro ao obter chaves do storage:', error);
    return [];
  }
};