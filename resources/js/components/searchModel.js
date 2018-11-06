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
    searchModel.findMatchesWithFilters = function (searchTerm, filters, byCategory, fn) {

        function refineByFilters(products) {

            return products.filter(product => {
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

        }

        if(byCategory) {
            this.findAllByCategory(searchTerm, (products) => {
                this.matched = refineByFilters(products);
                fn(this.matched);
            });
        }
        else {
            this.findMatches(searchTerm, (products) => {
                this.matched = refineByFilters(products);
                fn(this.matched);
            });
        }
    };
    searchModel.findAllByCategory = function(category, fn) {

        fn(this.products.filter( p => {

            let includes = false;

            p.categories.forEach( cat => {
                if( cat.code === category ) {
                    includes = true;
                }
            })

            return includes;
        }));
    }
    searchModel.findProduct = function (code, fn) {
        fn(this.products.find(p => p.code === code));
    };

    return searchModel;
});