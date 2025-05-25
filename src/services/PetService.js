import { getStorageData, setStorageData } from '../utils/storage';
import { StorageKeys } from '../constants/Storage';
import { generateId } from '../utils/helpers';

export const PetService = {
  async getAll() {
    return await getStorageData(StorageKeys.PETS) || [];
  },

  async getById(id) {
    const pets = await this.getAll();
    return pets.find(pet => pet.id === id);
  },

  async getByClientId(clientId) {
    const pets = await this.getAll();
    return pets.filter(pet => pet.clientId === clientId);
  },

  async create(petData) {
    try {
      const pets = await this.getAll();
      const newPet = {
        id: generateId(),
        ...petData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      pets.push(newPet);
      await setStorageData(StorageKeys.PETS, pets);
      return { success: true, data: newPet };
    } catch (error) {
      console.error('Erro ao criar pet:', error);
      return { success: false, error: 'Erro ao salvar pet' };
    }
  },

  async update(id, petData) {
    try {
      const pets = await this.getAll();
      const index = pets.findIndex(pet => pet.id === id);
      
      if (index === -1) {
        return { success: false, error: 'Pet não encontrado' };
      }

      pets[index] = {
        ...pets[index],
        ...petData,
        updatedAt: new Date().toISOString(),
      };

      await setStorageData(StorageKeys.PETS, pets);
      return { success: true, data: pets[index] };
    } catch (error) {
      console.error('Erro ao atualizar pet:', error);
      return { success: false, error: 'Erro ao atualizar pet' };
    }
  },

  async delete(id) {
    try {
      const pets = await this.getAll();
      const filteredPets = pets.filter(pet => pet.id !== id);
      
      await setStorageData(StorageKeys.PETS, filteredPets);
      return { success: true };
    } catch (error) {
      console.error('Erro ao deletar pet:', error);
      return { success: false, error: 'Erro ao deletar pet' };
    }
  },

  async search(query, clientId = null) {
    const pets = await this.getAll();
    let filteredPets = clientId ? pets.filter(pet => pet.clientId === clientId) : pets;
    
    if (!query || query.trim() === '') return filteredPets;
    
    const lowerQuery = query.toLowerCase();
    
    return filteredPets.filter(pet => 
      pet.name.toLowerCase().includes(lowerQuery) ||
      pet.species.toLowerCase().includes(lowerQuery) ||
      (pet.breed && pet.breed.toLowerCase().includes(lowerQuery)) ||
      (pet.microchip && pet.microchip.includes(query))
    );
  },

  async getStats() {
    const pets = await this.getAll();
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    const thisMonth = pets.filter(pet => {
      const createdDate = new Date(pet.createdAt);
      return createdDate.getMonth() === currentMonth && 
             createdDate.getFullYear() === currentYear;
    });

    const bySpecies = pets.reduce((acc, pet) => {
      acc[pet.species] = (acc[pet.species] || 0) + 1;
      return acc;
    }, {});

    return {
      total: pets.length,
      thisMonth: thisMonth.length,
      bySpecies,
      active: pets.filter(pet => !pet.deceased).length,
    };
  }
};