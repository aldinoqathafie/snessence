// src/services/productService.js
import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";

const productCollection = collection(db, "products");

// 🔸 Dapatkan produk realtime
export const listenProducts = (callback) => {
  return onSnapshot(productCollection, (snapshot) => {
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(data);
  });
};

// 🔸 Tambah produk baru
export const addProduct = async (product) => {
  await addDoc(productCollection, product);
};

// 🔸 Hapus produk
export const deleteProduct = async (id) => {
  const ref = doc(db, "products", id);
  await deleteDoc(ref);
};

// 🔸 Update produk
export const updateProduct = async (id, updated) => {
  const ref = doc(db, "products", id);
  await updateDoc(ref, updated);
};
