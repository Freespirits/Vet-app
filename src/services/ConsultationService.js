import { getStorageData, setStorageData } from '../utils/storage';
import { StorageKeys } from '../constants/Storage';
import { generateId } from '../utils/helpers';

export const ConsultationService = {
  async getAll() {
    return await getStorageData(StorageKeys.CONSULTATIONS) || [];
  },

  async getById(id) {
    const consultations = await this.getAll();
    return consultations.find(consultation => consultation.id === id);
  },

  async getByPetId(petId) {
    const consultations = await this.getAll();
    return consultations.filter(consultation => consultation.petId === petId)
                      .sort((a, b) => new Date(b.date) - new Date(a.date));
  },

  async getByClientId(clientId) {
    const consultations = await this.getAll();
    return consultations.filter(consultation => consultation.clientId === clientId)
                      .sort((a, b) => new Date(b.date) - new Date(a.date));
  },

  async create(consultationData) {
    try {
      const consultations = await this.getAll();
      const newConsultation = {
        id: generateId(),
        ...consultationData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      consultations.push(newConsultation);
      await setStorageData(StorageKeys.CONSULTATIONS, consultations);
      return { success: true, data: newConsultation };
    } catch (error) {
      console.error('Erro ao criar consulta:', error);
      return { success: false, error: 'Erro ao salvar consulta' };
    }
  },

  async update(id, consultationData) {
    try {
      const consultations = await this.getAll();
      const index = consultations.findIndex(consultation => consultation.id === id);
      
      if (index === -1) {
        return { success: false, error: 'Consulta não encontrada' };
      }

      consultations[index] = {
        ...consultations[index],
        ...consultationData,
        updatedAt: new Date().toISOString(),
      };

      await setStorageData(StorageKeys.CONSULTATIONS, consultations);
      return { success: true, data: consultations[index] };
    } catch (error) {
      console.error('Erro ao atualizar consulta:', error);
      return { success: false, error: 'Erro ao atualizar consulta' };
    }
  },

  async delete(id) {
    try {
      const consultations = await this.getAll();
      const filteredConsultations = consultations.filter(consultation => consultation.id !== id);
      
      await setStorageData(StorageKeys.CONSULTATIONS, filteredConsultations);
      return { success: true };
    } catch (error) {
      console.error('Erro ao deletar consulta:', error);
      return { success: false, error: 'Erro ao deletar consulta' };
    }
  },

  async getStats() {
    const consultations = await this.getAll();
    const currentDate = new Date();
    const today = currentDate.toDateString();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    const todayConsultations = consultations.filter(consultation => 
      new Date(consultation.date).toDateString() === today
    );

    const thisMonth = consultations.filter(consultation => {
      const consultationDate = new Date(consultation.date);
      return consultationDate.getMonth() === currentMonth && 
             consultationDate.getFullYear() === currentYear;
    });

    const byType = consultations.reduce((acc, consultation) => {
      acc[consultation.type] = (acc[consultation.type] || 0) + 1;
      return acc;
    }, {});

    return {
      total: consultations.length,
      today: todayConsultations.length,
      thisMonth: thisMonth.length,
      byType,
    };
  }
};