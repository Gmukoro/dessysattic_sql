// dataFetchers.ts

export const getOrders = async () => {
  try {
    const res = await fetch(`/api/orders`);
    if (!res.ok) throw new Error("Failed to fetch orders");
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("[orders_GET]", err);
    return [];
  }
};

export const getCollections = async () => {
  try {
    const res = await fetch(`/api/collections`);
    if (!res.ok) throw new Error("Failed to fetch collections");
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("[collections_GET]", err);
    return [];
  }
};

export const getCollectionDetails = async (collectionId: string) => {
  try {
    const res = await fetch(`/api/collections/${collectionId}`);
    if (!res.ok) throw new Error(`Failed to fetch collection ${collectionId}`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.error(`[collectionId_GET] ${collectionId}`, err);
    return null;
  }
};

export const getProductDetails = async (productId: string) => {
  try {
    const res = await fetch(`/api/products/${productId}`, {
      method: "GET",
    });
    if (!res.ok) throw new Error(`Failed to fetch product ${productId}`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.error(`[productId_GET] ${productId}`, err);
    return null;
  }
};
