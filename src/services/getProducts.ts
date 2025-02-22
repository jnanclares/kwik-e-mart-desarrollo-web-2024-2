import { db } from '@/lib/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { Product } from '@/models';

export async function getProducts(): Promise<Product[]> {
  const productsRef = collection(db, 'products');
  const snapshot = await getDocs(productsRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
}