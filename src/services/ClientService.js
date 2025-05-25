import { getStorageData, setStorageData } from '../utils/storage';
import { StorageKeys } from '../constants/Storage';
import { generateId } from '../utils/helpers';

export const ClientService = {
  async getAll() {
    return await getStorageData(StorageKeys.CLIENTS) || [];
  },

  async getById(id) {
    const clients = await this.getAll();
    return clients.find(client => client.id === id);
  },

  async create(clientData) {
    try {
      const clients = await this.getAll();
      
      // Verificar se email já existe
      const existingClient = clients.find(client => 
        client.email.toLowerCase() === clientData.email.toLowerCase()
      );
      
      if (existingClient) {
        return { success: false, error: 'Email já cadastrado' };
      }

      const newClient = {
        id: generateId(),
        ...clientData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      clients.push(newClient);
      await setStorageData(StorageKeys.CLIENTS, clients);
      return { success: true, data: newClient };
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
      return { success: false, error: 'Erro ao salvar cliente' };
    }
  },

  async update(id, clientData) {
    try {
      const clients = await this.getAll();
      const index = clients.findIndex(client => client.id === id);
      
      if (index === -1) {
        return { success: false, error: 'Cliente não encontrado' };
      }

      // Verificar se email já existe em outro cliente
      const existingClient = clients.find(client => 
        client.id !== id && client.email.toLowerCase() === clientData.email.toLowerCase()
      );
      
      if (existingClient) {
        return { success: false, error: 'Email já cadastrado para outro cliente' };
      }

      clients[index] = {
        ...clients[index],
        ...clientData,
        updatedAt: new Date().toISOString(),
      };

      await setStorageData(StorageKeys.CLIENTS, clients);
      return { success: true, data: clients[index] };
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
      return { success: false, error: 'Erro ao atualizar cliente' };
    }
  },

  async delete(id) {
    try {
      const clients = await this.getAll();
      const filteredClients = clients.filter(client => client.id !== id);
      
      await setStorageData(StorageKeys.CLIENTS, filteredClients);
      return { success: true };
    } catch (error) {
      console.error('Erro ao deletar cliente:', error);
      return { success: false, error: 'Erro ao deletar cliente' };
    }
  },

  async search(query) {
    const clients = await this.getAll();
    if (!query || query.trim() === '') return clients;
    
    const lowerQuery = query.toLowerCase();
    
    return clients.filter(client => 
      client.name.toLowerCase().includes(lowerQuery) ||
      client.email.toLowerCase().includes(lowerQuery) ||
      (client.phone && client.phone.includes(query)) ||
      (client.cpf && client.cpf.includes(query)) ||
      (client.address && client.address.toLowerCase().includes(lowerQuery))
    );
  },

  async getStats() {
    const clients = await this.getAll();
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    const thisMonth = clients.filter(client => {
      const createdDate = new Date(client.createdAt);
      return createdDate.getMonth() === currentMonth && 
             createdDate.getFullYear() === currentYear;
    });

    return {
      total: clients.length,
      thisMonth: thisMonth.length,
      active: clients.filter(client => !client.inactive).length,
    };
  }
};