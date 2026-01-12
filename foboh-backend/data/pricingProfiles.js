// Probably could handle redundancy better but for now this works. 
const pricingProfiles = [
    // Default Pricing Profile - Global Wholesale Price
    {
        id: '1',
        name: 'Global Wholesale Price',
        description: 'Global wholesale price for all products',
        status: 'Completed',
        basedOn: null,
        adjustmentType: 'none',
        adjustmentOperation: 'none',
        perProductAdjustments: [
            {id: '1', value: 0 },
            {id: '2', value: 0 },
            {id: '3', value: 0 },
            {id: '4', value: 0 },
            {id: '5', value: 0 },
            {id: '6', value: 0 },
        ],
        products: [ '1', '2', '3', '4', '5', '6' ],
        selectionType: 'all'
    },
    // Pricing Profile - Red Wine Bulk Discount
    {
        id: '2', 
        name: 'Red Wine Bulk Discount',
        description: 'Special Discount for vendors buying red wine in bulk',
        status: 'Completed',
        basedOn: '1',
        adjustmentType: 'dynamic',
        adjustmentOperation: 'decrement',
        perProductAdjustments: [
            {id: '1', value: 8 },
            {id: '2', value: 5 },
            {id: '3', value: 6 },
        ],
        products: [ '1', '2', '3' ],
        selectionType: 'multiple'
    },
];
module.exports = { pricingProfiles };