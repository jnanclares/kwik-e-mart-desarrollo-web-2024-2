import { db } from '../config/firebaseConfig';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs,
  query,
  where,
  Timestamp 
} from 'firebase/firestore';

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  onSale: boolean;
  salePrice: number;
  image: string;
  rating: number;
  reviews: {
    userId: string;
    username: string;
    rating: number;
    comment: string;
    date: string;
  }[]; 
  description: string;
  featured?: boolean;
  dailyDeal?: boolean;
}


export interface Offer {
  id?: string;
  productId: string;
  productName: string;
  originalPrice: number;
  discountPercentage: number;
  salePrice: number;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
}

const PRODUCTS_COLLECTION = 'products';

export const getAllProducts = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, PRODUCTS_COLLECTION));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Product[];
  } catch (error) {
    console.error('Error getting products:', error);
    throw error;
  }
};

export const updateProduct = async (productId: string, data: Partial<Product>) => {
  try {
    const productRef = doc(db, PRODUCTS_COLLECTION, productId);
    await updateDoc(productRef, data);
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

export const createOffer = async (offerData: Omit<Offer, 'id'>) => {
  try {
    // Actualizar el producto con los nuevos precios
    await updateProduct(offerData.productId, {
      onSale: true,
      salePrice: offerData.salePrice
    });

    const docRef = await addDoc(collection(db, 'offers'), {
      ...offerData,
      createdAt: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating offer:', error);
    throw error;
  }
};

export const updateOffer = async (offerId: string, offerData: Partial<Offer>) => {
  try {
    const offerRef = doc(db, 'offers', offerId);
    
    // Actualizar el producto con los nuevos precios
    if (offerData.productId && offerData.salePrice !== undefined) {
      await updateProduct(offerData.productId, {
        onSale: offerData.isActive || false,
        salePrice: offerData.salePrice
      });
    }

    await updateDoc(offerRef, offerData);
  } catch (error) {
    console.error('Error updating offer:', error);
    throw error;
  }
};

export const deleteOffer = async (offerId: string, productId: string) => {
  try {
    // Desactivar la oferta en el producto
    await updateProduct(productId, {
      onSale: false,
      salePrice: 0
    });

    const offerRef = doc(db, 'offers', offerId);
    await deleteDoc(offerRef);
  } catch (error) {
    console.error('Error deleting offer:', error);
    throw error;
  }
};

export const getAllOffers = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'offers'));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Offer[];
  } catch (error) {
    console.error('Error getting all offers:', error);
    throw error;
  }
};