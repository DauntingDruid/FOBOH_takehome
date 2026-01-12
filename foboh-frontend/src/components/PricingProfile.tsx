'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Edit from '../assets/icons/Edit.svg';
import { fetchProductsInPricingProfile, fetchProductsBySearchAndFilter, updatePricingProfile, createPricingProfile } from '../api/api';
import { FiRefreshCcw } from 'react-icons/fi';
import { calculatePrices } from '../api/api';

// Generally we would have API calls to fetch the sub-categories, segments, and brands
// But for this takehome project I have just use hardcoded data
const subCategories = ['Wine', 'Beer', 'Liquor & Spirits', 'Cider', 'Premixed & Ready-to-Drink', 'Other']; 
const segments = ['Red', 'White', 'Sparkling', 'Port/Dessert'];
const brands = ['High Garden', 'Koyama Wines', 'Brut Nature', 'Lacourte-Godbillon'];

// Currently I have just set the type to any, but in the future we should create a type for the pricing profile
// generally as a best practice i implement types for the components and states like selection type and pricing profile type. 
const PricingProfile = ({ profile, pricingProfiles, isNew = false, defaultOpen = false, onSaved, onCancelNew }: { profile: any, pricingProfiles: any[], isNew?: boolean, defaultOpen?: boolean, onSaved?: () => void, onCancelNew?: () => void }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    const [products, setProducts] = useState<any[]>([]);
    const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
    const [pricingProfileType, setPricingProfileType] = useState<string>('one');
    const [selectionType, setSelectionType] = useState<string>('all');
    const [description, setDescription] = useState<string>('');
    const [nameInput, setNameInput] = useState<string>(profile?.name || '');
    const [basedOnProfileId, setBasedOnProfileId] = useState<string>('');
    const [adjustmentMode, setAdjustmentMode] = useState<string>('fixed');
    const [adjustmentIncrementMode, setAdjustmentIncrementMode] = useState<string>('increment');
    const [canRefreshPricing, setCanRefreshPricing] = useState<boolean>(false);
    const [basedOnProfile, setBasedOnProfile] = useState<string>('');
    const [basedOnPrices, setBasedOnPrices] = useState<Record<string, number>>({});

    // Search States
    const [search, setSearch] = useState<string>('');
    const [sku, setSku] = useState<string>('');
    const [subCategory, setSubCategory] = useState<string>('all');
    const [segment, setSegment] = useState<string>('all');
    const [brand, setBrand] = useState<string>('all');

    const handlePricingProfileTypeChange = (type: string) => {
        setPricingProfileType(type);
        if (type === 'one') {
            setSelectedProducts([]);
        } else if (type === 'all') {
            setSelectedProducts(products);
        }
    }

    const handleProductSelect = (product: any) => {
        setSelectionType('');
        const isSelected = selectedProducts.some(p => p.id === product.id);
        if (isSelected) {
            setSelectedProducts(selectedProducts.filter(p => p.id !== product.id));
        } else {
            setSelectedProducts([...selectedProducts, product]);
        }
    }

    const handleSelectionRadioChange = (value: 'selectAll' | 'deselectAll') => {
        setSelectionType(value);
        if (value === 'selectAll') {
            setSelectedProducts(products);
        } else {
            setSelectedProducts([]);
        }
    }

    const clearAllFilter = () => {
        setSearch('');
        setSku('');
        setSubCategory('all');
        setSegment('all');
        setBrand('all');
    }

    const updateProductAdjustment = (productId: string | number, newValue: string) => {
        const updatedProducts = selectedProducts.map((product) =>
            product.id === productId ? { ...product, adjustmentValue: newValue } : product
        );
        setSelectedProducts(updatedProducts);
        setCanRefreshPricing(true);
    }

    // API Call to Fetch new price
    // Here I calculate new price for selected products on Based on price (profile) and adjustment
    const fetchNewPrice = async () => {
        const payload = {
            productItems: selectedProducts.map((product) => ({
                productId: product.id,
                adjustmentMode,
                adjustmentIncrementMode,
                adjustmentValue: Number(product.adjustmentValue) || 0,
            })),
            pricingProfileId: basedOnProfileId || '',
        };

        try {
            const response = await calculatePrices(payload);
            const updatedProducts = selectedProducts.map((product) => {
                const updatedProduct = response.productItemsPriceAdjusted.find((p: any) => p.productId === product.id);
                return updatedProduct ? { ...product, newPrice: updatedProduct.newPrice } : product;
            });
            setSelectedProducts(updatedProducts);
            setCanRefreshPricing(false);
        } catch (error) {
            console.error('Error fetching new prices:', error);
        }
    }

    const updatePricingProfileChanges = async () => {
        try {
            const data = {
                name: nameInput || profile.name,
                description,
                basedOn: basedOnProfileId || null,
                adjustmentType: adjustmentMode,
                adjustmentOperation: adjustmentIncrementMode,
                products: selectedProducts.map((p) => p.id),
                selectionType: selectionType || (selectedProducts.length === products.length ? 'all' : 'multiple'),
                perProductAdjustments: selectedProducts.map((p) => ({ id: p.id, value: Number(p.adjustmentValue ?? 0), type: adjustmentMode, operation: adjustmentIncrementMode })),
            };

            if (isNew) {
                await createPricingProfile({ ...data });
            } else {
                await updatePricingProfile(profile.id, data);
            }

            setIsOpen(false);
            clearAllFieldsAndStates();
            setCanRefreshPricing(false);
            onSaved?.();
            if (isNew) {
                onCancelNew?.();
            }
        } catch (error) {
            console.error('Error saving pricing profile changes:', error);
        }
    }

    const clearAllFieldsAndStates = () => {
    setNameInput(profile?.name || '');
    setDescription(profile?.description || '');
        setBasedOnProfileId('');
        setAdjustmentMode('');
        setAdjustmentIncrementMode('');
        setSelectedProducts([]);
        setCanRefreshPricing(false);
    }

    const cancelChanges = () => {
        clearAllFieldsAndStates();
        setIsOpen(false);
        if (isNew) {
            onCancelNew?.();
        }
    }

    useEffect(() => {
        if (isOpen) {
            setNameInput(profile?.name || '');
            setDescription(profile?.description || '');
        }
    }, [isOpen, profile]);

    // Fetch products in pricing profile 
    useEffect(() => {
        const fetchProfileDetails = async () => {
            if (isOpen && !isNew) {
                const data = await fetchProductsInPricingProfile(profile.id);
                console.log("Fetched products in pricing profile:", data);
                setSelectedProducts(data.products);
                setPricingProfileType(data.selectionType || 'one');
                setBasedOnProfileId(data.basedOnProfileId || '');
                setAdjustmentMode(data.adjustmentMode || '');
                setAdjustmentIncrementMode(data.adjustmentIncrementMode || '');
                setBasedOnProfile(pricingProfiles.find(p => p.id === data.basedOnProfileId)?.name || '');
                setCanRefreshPricing(false);
            } else if (isOpen && isNew) {
                setSelectedProducts([]);
                setPricingProfileType('one');
                setBasedOnProfileId('');
                setAdjustmentMode('fixed');
                setAdjustmentIncrementMode('increment');
                setBasedOnProfile('');
                setCanRefreshPricing(false);
            }
        }
        const fetchProducts = async () => {
            if (isOpen) {
                const data = await fetchProductsBySearchAndFilter(search, sku, subCategory, segment, brand);
                setProducts(data || []);
            }
        }
        fetchProducts();
        fetchProfileDetails();
    }, [isOpen]);

    // Fetch products by search and filter (Generally we add debouncing for optimizing API calls)
    useEffect(() => {
        if (!isOpen) return;
        const fetchProducts = async () => {
            const data = await fetchProductsBySearchAndFilter(search, sku, subCategory, segment, brand);
            setProducts(data || []);
        }
        fetchProducts();
    }, [search, sku, subCategory, segment, brand]);

    // Logic to fetch based on profile prices which are derived from another profile
    useEffect(() => {
        if (!isOpen) return;
        if (!basedOnProfileId) {
            setBasedOnPrices({});
            setBasedOnProfile('');
            return;
        }

        const fetchBasedOnPricing = async () => {
            try {
                const data = await fetchProductsInPricingProfile(basedOnProfileId);
                const map: Record<string, number> = {};
                data?.products?.forEach((p: any) => {
                    const val = Number(p.newPrice ?? p.price ?? 0);
                    if (!Number.isNaN(val)) {
                        map[p.id] = val;
                    }
                });
                setBasedOnPrices(map);
                setBasedOnProfile(pricingProfiles.find(p => p.id === basedOnProfileId)?.name || '');
            } catch (err) {
                console.error('Error fetching based on profile prices:', err);
                setBasedOnPrices({});
            }
        };

        fetchBasedOnPricing();
    }, [basedOnProfileId, isOpen, pricingProfiles]);

    const getBasedOnPriceDisplay = (product: any) => {
        const basePrice = basedOnPrices[product.id];
        const fallback = Number(product.price ?? 0);
        if (!basedOnProfileId) return `$${fallback.toFixed(2)}`;
        if (basePrice !== undefined) return `$${basePrice.toFixed(2)}`;
        return `Default - $${fallback.toFixed(2)}`;
    };

    console.log("selectedProducts : ", selectedProducts);
    console.log('adjustmentMode : ', adjustmentMode);
    console.log('adjustmentIncrementMode : ', adjustmentIncrementMode);

    return (
        <div className="flex flex-col items-start justify-start w-full h-full bg-white rounded-lg p-6">
            <div className="flex items-start justify-between w-full h-full">
                <div className="flex flex-col items-start justify-start">
                    {isOpen ? (
                        <input type="text" className="w-[250px] h-8 rounded-sm border-gray-300 text-sm border px-2 my-2" value={nameInput} onChange={(e) => setNameInput(e.target.value)} placeholder="Profile name" />
                    ) : (
                        <h2 className="text-lg font-bold text-gray-800">{profile.name}</h2>
                    )}
                    {isOpen ? <input type="text" className="w-[250px] h-8 rounded-sm border-gray-300 text-sm border px-2 my-2" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" /> : <p className="text-sm text-gray-500 my-2">{profile.description}</p>}
                </div>
                <div className="flex flex-col items-center justify-center">
                    <div className="flex items-center justify-end w-full">
                        <div className="w-2 h-2 bg-green-600 rounded-full" />
                        <p className="text-sm font-bold text-green-600 my-2 ml-2">{profile.status}</p>
                    </div>
                    {/* Make Changes Button */}
                    {!isOpen && <div onClick={() => setIsOpen(true)} className="flex items-center justify-center text-sm text-gray-800 my-2">
                        <Image src={Edit} alt="Edit" width={16} height={16} />
                        <span className="cursor-pointer ml-2">Make Changes</span>
                    </div>}
                    {isOpen && !canRefreshPricing && (
                        <p className="text-xs text-gray-500">Adjust settings to enable refresh</p>
                    )}
                </div>
            </div>
            <hr className="w-full border-gray-300 my-2" />
            {/* Here I conditionally render the pricing profile details when the pricing profile is being edited */}
            {isOpen &&
                <div className="flex flex-col items-start justify-start gap-4 w-full">
                    <p className="text-sm text-gray-500 my-2">You are creating a Pricing Profile for</p>

                    {/* Pricing profile selection type */}
                    <div className="flex items-center justify-start w-full h-full gap-6">
                        <div className='flex justify-center items-center'>
                            <input
                                type="radio"
                                name="pricingProfileType"
                                id="one"
                                className="mr-2 w-4 h-4 border-gray-300 rounded-full border-5 hover:border-green-600 checked:border-green-700 appearance-none"
                                checked={pricingProfileType === 'one'}
                                onChange={() => handlePricingProfileTypeChange('one')}
                            />
                            <label htmlFor="one">One Product</label>
                        </div>
                        <div className="w-px h-4 bg-gray-300" />
                        <div className='flex justify-center items-center'>
                            <input
                                type="radio"
                                name="pricingProfileType"
                                id="multiple"
                                className="mr-2 w-4 h-4 border-gray-300 rounded-full border-5 hover:border-green-600 checked:border-green-700 appearance-none"
                                checked={pricingProfileType === 'multiple'}
                                onChange={() => handlePricingProfileTypeChange('multiple')}
                            />
                            <label htmlFor="multiple">Multiple Products</label>
                        </div>
                        <div className="w-px h-4 bg-gray-300" />
                        <div className='flex justify-center items-center'>
                            <input
                                type="radio"
                                name="pricingProfileType"
                                id="all"
                                className="mr-2 w-4 h-4 border-gray-300 rounded-full border-5 hover:border-green-600 checked:border-green-700 appearance-none"
                                checked={pricingProfileType === 'all'}
                                onChange={() => handlePricingProfileTypeChange('all')}
                            />
                            <label htmlFor="all">All Products</label>
                        </div>
                    </div>

                    {/* Search and filter for products */}
                    <div className="flex flex-col items-start justify-start w-full h-full mt-2">
                        <div className='flex w-full justify-between items-center'>
                            <p className="text-sm text-gray-500 mb-2">Search Products</p>
                            <p onClick={() => clearAllFilter()} className='text-xs cursor-pointer text-red-800'>Clear All Filters</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <input
                                type="text"
                                placeholder="Search"
                                className="w-full h-10 rounded-md border-gray-300 text-sm border px-3"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Product/SKU"
                                className="w-full h-10 rounded-md border-gray-300 text-sm border px-3"
                                value={sku}
                                onChange={(e) => setSku(e.target.value)}
                            />
                            <select
                                className="w-full h-10 rounded-md border-gray-300 text-sm border px-3"
                                value={subCategory}
                                onChange={(e) => setSubCategory(e.target.value)}
                            >
                                <option value="all">Category</option>
                                {subCategories.map((category) => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                            <select
                                className="w-full h-10 rounded-md border-gray-300 text-sm border px-3"
                                value={segment}
                                onChange={(e) => setSegment(e.target.value)}
                            >
                                <option value="all">Segment</option>
                                {segments.map((segment) => (
                                    <option key={segment} value={segment}>{segment}</option>
                                ))}
                            </select>
                            <select
                                className="w-full h-10 rounded-md border-gray-300 text-sm border px-3"
                                value={brand}
                                onChange={(e) => setBrand(e.target.value)}
                            >
                                <option value="all">Brand</option>
                                {brands.map((brand) => (
                                    <option key={brand} value={brand}>{brand}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Showing products results for the search and filter (if none of the search fields are filled dont show below text) */}
                    <h3 className="text-sm font-bold text-gray-700">Showing {products?.length} results for {search ? `| ${search}` : 'total products'} {sku ? `| ${sku}` : ''} {subCategory ? `| ${subCategory}` : ''} {segment ? `| ${segment}` : ''} {brand ? `| ${brand}` : ''}</h3>

                    {/* Deselect all or select all buttons */}
                    <div className='flex items-center justify-start w-full h-full gap-6'>
                        <div className='flex items-center justify-center'>
                            <input
                                type="radio"
                                name="selectionType"
                                id="deselectAll"
                                className="mr-2 w-4 h-4 border-gray-300 rounded-full border-5 hover:border-green-600 checked:border-green-700 appearance-none"
                                value="deselectAll"
                                checked={selectionType === 'deselectAll'}
                                onChange={() => handleSelectionRadioChange('deselectAll')}
                            />
                            <label htmlFor="deselectAll">Deselect All</label>
                        </div>
                        <div className='flex items-center justify-center'>
                            <input
                                type="radio"
                                name="selectionType"
                                id="selectAll"
                                className="mr-2 w-4 h-4 border-gray-300 rounded-full border-5 hover:border-green-600 checked:border-green-700 appearance-none"
                                value="selectAll"
                                checked={selectionType === 'selectAll'}
                                onChange={() => handleSelectionRadioChange('selectAll')}
                            />
                            <label htmlFor="selectAll">Select All</label>
                        </div>
                    </div>

                    {/* Products list with checkbox */}
                    <div className="flex flex-col items-start justify-start">
                        {products?.map((product) => (
                            <div key={product.id} className="flex items-center">
                                <input type="checkbox" id={`product-${product.id}`} checked={selectedProducts.some(p => p.id === product.id)} onChange={() => handleProductSelect(product)} className="mr-2 accent-green-800 appearance-none border border-gray-300 rounded-md w-4 h-4 checked:bg-green-700 checked:border-transparent" />
                                <label htmlFor={`product-${product.id}`}>{product.title}</label>
                            </div>
                        ))}
                        <p className='text-sm text-gray-500 mt-2'>You've selected {selectedProducts.length} products, these will be added to {profile.name} profile.</p>
                    </div>
                    <hr className="w-full border-gray-300 my-2" />

                    {/* Price Adjustment Section */}
                    {/* Based on (profiles) - dropdown */}
                    <label className='text-gray-500'>Based on Profile <span className='text-xs text-red-300'>(You cannot select the profile itself)</span></label>
                    <select
                        className="w-fit h-10 rounded-md border-gray-300 text-sm border px-3"
                        value={basedOnProfileId}
                        onChange={(e) => { setBasedOnProfileId(e.target.value); setCanRefreshPricing(true); }}
                    >
                        <option disabled value="">Based on Profile</option>
                        {pricingProfiles.map((p) => (
                            <option disabled={p.id === profile.id} key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </select>

                    {/* Adjustment Mode */}
                    <div className="flex flex-col items-start justify-start mt-4">
                        <label className="mb-2 text-gray-500">Set Price Adjustment Mode</label>
                        <div className='flex items-center justify-between'>
                            <input
                                className='w-4 h-4 border-gray-300 rounded-full border-5 hover:border-green-600 checked:border-green-700 appearance-none'
                                type="radio"
                                name="adjustmentMode"
                                value="fixed"
                                checked={adjustmentMode === 'fixed'}
                                onChange={() => { setAdjustmentMode('fixed'); setCanRefreshPricing(true); }}
                            />
                            <span className="ml-2">Fixed ($)</span>
                            <div className="w-px h-4 bg-gray-300 mx-6" />
                            <input
                                className='w-4 h-4 border-gray-300 rounded-full border-5 hover:border-green-600 checked:border-green-700 appearance-none'
                                type="radio"
                                name="adjustmentMode"
                                value="dynamic"
                                checked={adjustmentMode === 'dynamic'}
                                onChange={() => { setAdjustmentMode('dynamic'); setCanRefreshPricing(true); }}
                            />
                            <span className="ml-2">Dynamic (%)</span>
                        </div>
                    </div>

                    {/* Set Price Adjustment Increment Mode  */}
                    <div className="flex flex-col items-start justify-start mt-4">
                        <label className="mb-2 text-gray-500">Set Price Adjustment Increment Mode:</label>
                        <div className='flex items-center justify-between'>
                        <input
                            className='w-4 h-4 border-gray-300 rounded-full border-5 hover:border-green-600 checked:border-green-700 appearance-none'
                            type="radio"
                            name="adjustmentIncrementMode"
                            value="increment"
                            checked={adjustmentIncrementMode === 'increment'}
                            onChange={() => { setAdjustmentIncrementMode('increment'); setCanRefreshPricing(true); }}
                        />
                        <span className="ml-2">Increase +</span>
                        <div className="w-px h-4 bg-gray-300 mx-4" />
                        <input
                            className='w-4 h-4 border-gray-300 rounded-full border-5 hover:border-green-600 checked:border-green-700 appearance-none'
                            type="radio"
                            name="adjustmentIncrementMode"
                            value="decrement"
                            checked={adjustmentIncrementMode === 'decrement'}
                            onChange={() => { setAdjustmentIncrementMode('decrement'); setCanRefreshPricing(true); }}
                        />
                        <span className="ml-2">Decrease -</span>
                        </div>
                    </div>

                    {/* Refresh Pricing Button */}
                    <div className="flex items-center justify-end mt-4 w-full text-xs ">
                        <button
                            onClick={() => canRefreshPricing && fetchNewPrice()}
                            disabled={!canRefreshPricing}
                            className={`flex items-center gap-2 px-3 py-2 rounded-md border ${canRefreshPricing ? 'border-purple-500 text-purple-500 hover:bg-purple-50 cursor-pointer' : 'border-gray-300 text-gray-400 cursor-not-allowed'}`}
                            aria-label="Refresh pricing"
                        >
                            Refresh Pricing
                            <FiRefreshCcw className={`w-5 h-5 ${canRefreshPricing ? 'text-purple-500' : 'text-gray-400'}`} />
                        </button>
                    </div>

                    {/* Adjustment Table  */}
                    <table className="w-full divide-y divide-gray-200 border-spacing-1 border border-gray-300">
                        <thead>
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    <input type="checkbox" className="w-4 h-4 border-gray-300 rounded" />
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Based on ({basedOnProfile})</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Adjustment</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">New Price</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {selectedProducts.map((product) => (
                                <tr key={product.id}>
                                    <td className="px-6 py-4 whitespace-nowrap cellborder">
                                        <input type="checkbox" className="w-4 h-4 border-gray-300 rounded" checked={true} readOnly />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap cellborder">{product.title}</td>
                                    <td className="px-6 py-4 whitespace-nowrap cellborder">{product.sku}</td>
                                    <td className="px-6 py-4 whitespace-nowrap cellborder">{product.subCategory}</td>
                                    <td className="px-6 py-4 whitespace-nowrap cellborder">{getBasedOnPriceDisplay(product)}</td>
                                    {/* This is a input field -> price adjustment */}
                                    <td className={`px-6 py-4 whitespace-nowrap ${adjustmentIncrementMode === 'increment' ? 'bg-green-100 border border-green-500' : 'bg-red-100 border border-red-500'}`}>
                                        {adjustmentIncrementMode === 'increment' ? '+' : '-'} {adjustmentMode === 'fixed' ? '$' : '%'} <input onChange={(e) => updateProductAdjustment(product.id, e.target.value)} value={product.adjustmentValue || ''} id={product.id} type="number" className="p-1 appearance-none border-none outline-none focus:outline-none focus:ring-0" placeholder="Enter new price" />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap cellborder">{product.newPrice ? '$' + product.newPrice.toFixed(2) : 'Refresh to Calculate'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Card footer */}
                    <div className='flex w-full gap-2 justify-end items-center'>
                        <div onClick={() => cancelChanges()} className="flex justify-end mt-4">
                            <button className="text-sm bg-gray-300 text-gray-700 px-2 py-1 rounded-md hover:bg-gray-400">Cancel</button>
                        </div>
                        <div className="flex justify-end mt-4">
                            <button onClick={() => updatePricingProfileChanges()} className="text-sm bg-green-700 text-white px-2 py-1 rounded-md hover:bg-green-600 active:scale-95 transition-transform">Save</button>
                        </div>
                    </div>
                </div>}
        </div>
    )
}

export default PricingProfile;