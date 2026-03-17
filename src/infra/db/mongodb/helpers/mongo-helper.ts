import { Collection, MongoClient } from "mongodb";

export const MongoHelper = {
  client: null as unknown as MongoClient,
  uri: null as unknown as string,
  async connect(uri: string) {
    this.uri = uri;
    this.client = await MongoClient.connect(uri);
  },
  async disconnect() {
    if (this.client) {
      await this.client.close();
      this.client = null;
    }
  },
  async getCollection(name: string): Promise<Collection> {
    if (!this.client) {
      await this.connect(this.uri);
    }
    return this.client.db().collection(name);
  },
  map(collection: any): any {
    const { _id, ...collectionWithoutId } = collection;
    return { ...collectionWithoutId, id: _id };
  },
};
