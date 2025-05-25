export const ESPECIES = [
  'Cão', 'Gato', 'Pássaro', 'Peixe', 'Hamster', 'Coelho', 'Réptil', 'Outro'
];

export const RACAS_CAES = [
  'SRD (Sem Raça Definida)', 'Labrador', 'Golden Retriever', 'Pastor Alemão', 
  'Bulldog Francês', 'Poodle', 'Rottweiler', 'Yorkshire Terrier', 'Beagle', 
  'Dachshund', 'Boxer', 'Husky Siberiano', 'Border Collie', 'Chihuahua', 
  'Shih Tzu', 'Pit Bull', 'Maltês', 'Akita', 'Doberman', 'Cocker Spaniel'
];

export const RACAS_GATOS = [
  'SRD (Sem Raça Definida)', 'Persa', 'Siamese', 'Maine Coon', 'Ragdoll', 
  'British Shorthair', 'Abissínio', 'Sphynx', 'Bengal', 'Russian Blue', 
  'Norwegian Forest', 'Scottish Fold', 'Birman', 'Oriental', 'American Shorthair'
];

export const TIPOS_CONSULTA = [
  'Consulta de Rotina', 'Vacinação', 'Vermifugação', 'Cirurgia', 'Emergência', 
  'Exame', 'Banho e Tosa', 'Retorno', 'Castração', 'Outros'
];

export const MEDICAMENTOS = [
  {
    id: '1',
    name: 'Dipirona',
    category: 'Analgésico',
    dosage: '25mg/kg',
    frequency: 'A cada 8 horas',
    contraindications: 'Hipersensibilidade, insuficiência renal',
    observations: 'Administrar preferencialmente após alimentação'
  },
  {
    id: '2',
    name: 'Amoxicilina',
    category: 'Antibiótico',
    dosage: '20mg/kg',
    frequency: 'A cada 12 horas',
    contraindications: 'Alergia a penicilinas',
    observations: 'Completar o tratamento mesmo com melhora dos sintomas'
  },
  {
    id: '3',
    name: 'Prednisona',
    category: 'Corticosteroide',
    dosage: '1-2mg/kg',
    frequency: 'A cada 24 horas',
    contraindications: 'Infecções sistêmicas, diabetes',
    observations: 'Reduzir gradualmente a dose'
  },
  {
    id: '4',
    name: 'Metronidazol',
    category: 'Antibiótico/Antiprotozoário',
    dosage: '15-25mg/kg',
    frequency: 'A cada 12 horas',
    contraindications: 'Gravidez, lactação',
    observations: 'Não administrar com álcool'
  }
];

export const VACINAS = [
  {
    id: '1',
    name: 'V8 ou V10',
    species: 'Cão',
    diseases: ['Cinomose', 'Hepatite', 'Parvovirose', 'Parainfluenza', 'Adenovirose', 'Coronavirose', 'Leptospirose'],
    schedule: '6-8 semanas, 10-12 semanas, 14-16 semanas',
    booster: 'Anual'
  },
  {
    id: '2',
    name: 'Antirrábica',
    species: 'Cão/Gato',
    diseases: ['Raiva'],
    schedule: '12-16 semanas',
    booster: 'Anual'
  },
  {
    id: '3',
    name: 'Tríplice Felina',
    species: 'Gato',
    diseases: ['Rinotraqueíte', 'Calicivirose', 'Panleucopenia'],
    schedule: '6-8 semanas, 10-12 semanas',
    booster: 'Anual'
  },
  {
    id: '4',
    name: 'Leucemia Felina',
    species: 'Gato',
    diseases: ['Leucemia Felina'],
    schedule: '8-10 semanas, 12-14 semanas',
    booster: 'Anual'
  }
];

export const PROCEDIMENTOS = [
  { id: '1', name: 'Consulta Clínica', duration: 30, price: 80 },
  { id: '2', name: 'Vacinação', duration: 15, price: 45 },
  { id: '3', name: 'Castração Macho', duration: 90, price: 300 },
  { id: '4', name: 'Castração Fêmea', duration: 120, price: 450 },
  { id: '5', name: 'Limpeza Dentária', duration: 60, price: 200 },
  { id: '6', name: 'Banho e Tosa', duration: 90, price: 65 },
  { id: '7', name: 'Exame de Sangue', duration: 15, price: 120 },
  { id: '8', name: 'Raio-X', duration: 20, price: 150 },
  { id: '9', name: 'Ultrassom', duration: 30, price: 180 },
  { id: '10', name: 'Cirurgia Simples', duration: 120, price: 500 }
];