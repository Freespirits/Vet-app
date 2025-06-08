import { DatabaseService } from './DatabaseService';

export class MedicineService {
  static async getAll() {
    try {
      const db = await DatabaseService.getDatabase();
      const result = await db.getAllAsync('SELECT * FROM medicines ORDER BY name ASC');
      return result || [];
    } catch (error) {
      console.error('Erro ao buscar medicamentos:', error);
      return [];
    }
  }

  static async getById(id) {
    try {
      const db = await DatabaseService.getDatabase();
      const result = await db.getFirstAsync('SELECT * FROM medicines WHERE id = ?', [id]);
      return result;
    } catch (error) {
      console.error('Erro ao buscar medicamento:', error);
      return null;
    }
  }

  static async create(medicineData) {
    try {
      const db = await DatabaseService.getDatabase();
      
      const result = await db.runAsync(`
        INSERT INTO medicines (
          name, active_ingredient, concentration, form, manufacturer,
          indication, dosage, contraindications, side_effects, storage,
          expiration_date, batch_number, registration_number, price, stock, notes,
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        medicineData.name,
        medicineData.active_ingredient,
        medicineData.concentration,
        medicineData.form,
        medicineData.manufacturer,
        medicineData.indication,
        medicineData.dosage,
        medicineData.contraindications,
        medicineData.side_effects,
        medicineData.storage,
        medicineData.expiration_date,
        medicineData.batch_number,
        medicineData.registration_number,
        medicineData.price,
        medicineData.stock,
        medicineData.notes,
        new Date().toISOString(),
        new Date().toISOString()
      ]);

      return { success: true, id: result.lastInsertRowId };
    } catch (error) {
      console.error('Erro ao criar medicamento:', error);
      return { success: false, error: error.message };
    }
  }

  static async update(id, medicineData) {
    try {
      const db = await DatabaseService.getDatabase();
      
      await db.runAsync(`
        UPDATE medicines SET 
          name = ?, active_ingredient = ?, concentration = ?, form = ?, manufacturer = ?,
          indication = ?, dosage = ?, contraindications = ?, side_effects = ?, storage = ?,
          expiration_date = ?, batch_number = ?, registration_number = ?, price = ?, stock = ?, notes = ?,
          updated_at = ?
        WHERE id = ?
      `, [
        medicineData.name,
        medicineData.active_ingredient,
        medicineData.concentration,
        medicineData.form,
        medicineData.manufacturer,
        medicineData.indication,
        medicineData.dosage,
        medicineData.contraindications,
        medicineData.side_effects,
        medicineData.storage,
        medicineData.expiration_date,
        medicineData.batch_number,
        medicineData.registration_number,
        medicineData.price,
        medicineData.stock,
        medicineData.notes,
        new Date().toISOString(),
        id
      ]);

      return { success: true };
    } catch (error) {
      console.error('Erro ao atualizar medicamento:', error);
      return { success: false, error: error.message };
    }
  }

  static async delete(id) {
    try {
      const db = await DatabaseService.getDatabase();
      await db.runAsync('DELETE FROM medicines WHERE id = ?', [id]);
      return { success: true };
    } catch (error) {
      console.error('Erro ao excluir medicamento:', error);
      return { success: false, error: error.message };
    }
  }

  static async search(query) {
    try {
      const db = await DatabaseService.getDatabase();
      const result = await db.getAllAsync(`
        SELECT * FROM medicines 
        WHERE name LIKE ? OR active_ingredient LIKE ? OR indication LIKE ? OR manufacturer LIKE ?
        ORDER BY name ASC
      `, [`%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`]);
      
      return result || [];
    } catch (error) {
      console.error('Erro ao buscar medicamentos:', error);
      return [];
    }
  }
}