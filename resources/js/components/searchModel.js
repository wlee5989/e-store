define(['components/facet/facetUtils'], function (facetUtils) {
    'use strict';

    const searchModel = {
        products: [],
        matched: [],
    };
    searchModel.setList = function (results) {
        this.products = [...results];
    }
    searchModel.findMatches = function (searchTerm, fn) {

        this.matched = this.products.filter(product => {
            const regex = new RegExp(searchTerm, "gi");
            return product.name.match(regex);
        });

        fn(this.matched);
    }
    searchModel.findMatchesWithFilters = function (searchTerm, filters, fn) {
        this.findMatches(searchTerm, (products) => {


            this.matched = products.filter(product => {
                let matchesAll = true;

                Object.keys(filters).forEach(key => {
                    const filterValue = filters[key];

                    switch (key) {
                        case "category":
                            let catMatched = false;
                            product.categories.forEach(category => {
                                if (category.code === filterValue)
                                    catMatched = true;
                            })
                            matchesAll &= catMatched;
                            break;
                        case "brand":

                            let brandMatched = false;
                            product.brands.forEach(brand => {
                                if (brand.code === filterValue)
                                brandMatched = true;
                            })
                            matchesAll &= brandMatched;

                            break;
                        case "price":
                            let priceMatched = false;
                            filterValue.forEach(fv => {
                                if(fv === product.priceUSDrange) 
                                    priceMatched = true;
                            })
                            matchesAll &= priceMatched;

                            break;
                    }
                });

                return matchesAll;
            })

            fn(this.matched);
        });
    }
    searchModel.findProduct = function (code, fn) {
        fn(this.products.find(p => p.code === code));
    };
    searchModel.facets = function () {

        const facets = [];

        facets.push(facetUtils.createCategoryFacet(this.matched));
        facets.push(facetUtils.createBrandFacet(this.matched));
        facets.push(facetUtils.createPriceFacet(this.matched));

        return facets;
    }

    return searchModel;
});