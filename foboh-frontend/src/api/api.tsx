const API_URL = 'http://localhost:3000';

// Pricing Profiles
export const fetchPricingProfiles = async () => {  
    try {
        const response = await fetch(`${API_URL}/pricing-profiles`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching pricing profiles:', error);
        return null;
    }
} 

export const fetchProductsInPricingProfile = async (pricingProfileId: string) => {
    try {
        const response = await fetch(`${API_URL}/pricing-profiles/${pricingProfileId}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching products in pricing profile:', error);
        return null;
    }
}

export const createPricingProfile = async (payload: any) => {
    try {
        const response = await fetch(`${API_URL}/pricing-profiles`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Error creating pricing profile:', error);
        throw error;
    }
}

export const updatePricingProfile = async (
    pricingProfileId: string,
    payload: any
) => {
    try {
        const response = await fetch(`${API_URL}/pricing-profiles/${pricingProfileId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Error updating pricing profile:', error);
        throw error;
    }
}

export const fetchProductsBySearchAndFilter = async (search: string, sku: string, subCategory: string, segment: string, brand: string) => {
    try {
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (sku) params.append('sku', sku);
        if (subCategory && subCategory !== 'all') params.append('subCategory', subCategory);
        if (segment && segment !== 'all') params.append('segment', segment);
        if (brand && brand !== 'all') params.append('brand', brand);
        
        const queryString = params.toString();
        const url = queryString ? `${API_URL}/products/search?${queryString}` : `${API_URL}/products/search`;
        
        const response = await fetch(url);
        const data = await response.json();
        console.log("data : ", data);
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error('Error fetching products by search and filter:', error);
        return [];
    }
}

export const calculatePrices = async (payload: {
    productItems: Array<{
        productId: string | number,
        adjustmentMode?: string,
        adjustmentIncrementMode?: string,
        adjustmentValue?: number,
    }>;
    pricingProfileId?: string;
}) => {
    try {
        const response = await fetch(`${API_URL}/price-calculation`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error calculating prices:', error);
        return { productItemsPriceAdjusted: [] };
    }
}