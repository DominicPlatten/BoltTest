import { openDB, type DBSchema } from 'idb';

interface ModelDBSchema extends DBSchema {
  models: {
    key: number;
    value: StoredModel;
    indexes: { 'by-date': Date };
  };
}

export interface StoredModel {
  id?: number;
  name: string;
  fileType: string;
  size: number;
  data: ArrayBuffer;
  createdAt: Date;
  userId: string;
}

const dbPromise = openDB<ModelDBSchema>('models-db', 1, {
  upgrade(db) {
    const store = db.createObjectStore('models', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('by-date', 'createdAt');
    store.createIndex('by-user', 'userId');
  },
});

export async function saveModel(file: File, userId: string): Promise<StoredModel> {
  const db = await dbPromise;
  const data = await file.arrayBuffer();
  
  const model: StoredModel = {
    name: file.name,
    fileType: file.type,
    size: file.size,
    data,
    createdAt: new Date(),
    userId
  };

  const id = await db.add('models', model);
  return { ...model, id };
}

export async function getModel(id: number): Promise<StoredModel | undefined> {
  const db = await dbPromise;
  return db.get('models', id);
}

export async function getUserModels(userId: string): Promise<StoredModel[]> {
  const db = await dbPromise;
  const tx = db.transaction('models', 'readonly');
  const store = tx.objectStore('models');
  const models = await store.getAll();
  return models.filter(model => model.userId === userId);
}

export async function deleteModel(id: number): Promise<void> {
  const db = await dbPromise;
  await db.delete('models', id);
}