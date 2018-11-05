define([], function () {
    'use strict';

    function tallyCategory(products) {

        let categories = {};
        for (let i = 0; i < 3; i++) {
            const arryIndex = i;
            const count = products.reduce((tally, product) => {

                if (product.categories[arryIndex]) {
                    tally[product.categories[arryIndex].code] = (tally[product.categories[arryIndex].code] || 0) + 1;

                }
                return tally;
            }, {})

            categories = Object.assign(categories, count);
        }

        delete categories[1];

        return categories;
    }

    function tallyBrand(products) {
        let brands = {};

        for (let i = 0; i < 3; i++) {
            const arryIndex = i;
            const count = products.reduce((tally, product) => {


                if (product.brands[arryIndex]) {
                    tally[product.brands[arryIndex].code] = (tally[product.brands[arryIndex].code] || 0) + 1;

                }
                return tally;
            }, {})

            brands = Object.assign(brands, count);
        }

        delete brands['brands'];

        return brands;
    }

    function tallyPrice(products) {
        let prices = {};
        ['$0-$19.99', '$20-$49.99'].forEach(p => {

            const count = products.reduce((tally, product) => {

                if (product.priceUSDrange === p) {

                    tally[p] = (tally[p] || 0) + 1;
                }

                return tally;
            }, {})

            prices = Object.assign(prices, count);
        });

        return prices;
    }

    function nameForCategoryCode(code) {
        const categoryNames = {
            100: 'Stuff',
            200: 'Clothes',
            210: 'Shirts',
            220: 'Swets'
        };
        return categoryNames[code];
    };

    function nameForBrandCode(code) {
        const brandNames = {
            brand_1: 'Brand 1',
            brand_2: 'Brand 2'
        };
        return brandNames[code];
    };

    function nameForPriceCode(code) {
        return code;
    }

    function createFacet(products, tally, nameForValueCode, code, name, multiSelect) {

        // category facet
        let categories = tally(products);

        const categoryValues = [];
        Object.keys(categories).forEach(key => {

            let name = nameForValueCode(key);
            let value = categories[key];

            categoryValues.push({
                code: key,
                name: name,
                count: value
            })
        })

        return {
            code: code,
            name: name,
            multiSelect: multiSelect,
            values: categoryValues
        };
    }

    function createCategoryFacet(products) {
        return createFacet(
            products, tallyCategory, nameForCategoryCode, 'category', 'Category', false);
    }

    function createBrandFacet(products) {
        return createFacet(
            products, tallyBrand, nameForBrandCode, 'brand', 'Brand', false);
    }

    function createPriceFacet(products) {
        return createFacet(
            products, tallyPrice, nameForPriceCode, 'price', 'Price', true);
    }

    function getValueName(code, value) {

        let valueName = null;

        switch (code) {
            case 'category':
                valueName = nameForCategoryCode(value);
                break;
            case 'brand':
                valueName = nameForBrandCode(value);
                break;
            case 'price':
                valueName = nameForPriceCode(value);
                break;
            default:
                break;
        }

        return valueName;
    }

    return {
        createCategoryFacet: function (products) {
            return createCategoryFacet(products);
        },
        createBrandFacet: function (products) {
            return createBrandFacet(products);
        },
        createPriceFacet: function (products) {
            return createPriceFacet(products);
        },
        getValueName: getValueName
    };
});