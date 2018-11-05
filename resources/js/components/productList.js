
define(['util', 'components/searchModel', 'components/cart/cart', 'components/productDetail'
    , 'components/pager', 'components/facet/facet']
    , function (util, searchModel, cart, productC, pager, facet) {
        'use strict';

        let productCardTemplate = null;
        util.loadTemplate('product-card.html')
            .then(html => productCardTemplate = html);

        const productListView = {
            root: document.querySelector('.search-result-container .results'),
            addDetailEventListener: null,
            addCartEventListener: null,
        };
        productListView.tplList = function (products) {

            if(products.length > 0) {
                const productHtml = products.map(product => this.tplProduct(product)).join('');
                return `
                <div class="row columns is-multiline">
                    ${productHtml}
                </div>
            `;            }
            else {
                return `<div>No Items were matched.</div>`
            }

        }
        productListView.render = function (products) {

            const html = this.tplList(products);
            this.root.innerHTML = html;

            //wiring up event listeners
            this.root.querySelectorAll('.detail').forEach(button => button.addEventListener('click', this.addDetailEventListener));
            this.root.querySelectorAll('.add-cart-button').forEach(button => button.addEventListener('click', this.addCartEventListener));
        };
        productListView.tplProduct = function (product) {

            return productCardTemplate.replace('product.name', product.name)
                .replace('product.price', product.price.formattedValue)
                .replace('product.imageUrl', product.images[0].url)
                .replace(/product.code/g, product.code);
        }

        const productList = {
            model: searchModel,
            view: productListView,
            searchTerm: null,
            matched: [],
            numberOfProductsPerPage: 6,
        };

        productList.addDetailEventListener = function (e) {
            e.preventDefault();

            this.model.findProduct(
                e.target.dataset.code,
                (product) => {

                    productC.init(product);

                    util.moveTo('productView');
                }
            );

        }
        productList.addCartEventListener = function (e) {
            e.preventDefault();

            this.model.findProduct(e.target.dataset.code, (product) => {

                cart.addItem(product);
            });
        }


        productList.init = function (searchTerm) {

            this.searchTerm = searchTerm;

            // sets implements for listeners
            this.view.addDetailEventListener = this.addDetailEventListener.bind(this);
            this.view.addCartEventListener = this.addCartEventListener.bind(this);

            this.model.findMatches(searchTerm, (matchedProducts) => {

                this.matched = matchedProducts;

                const productsInPageOne = this.findProductsByPageNumber(1);
                this.view.render(productsInPageOne);

                pager.onchangeNotify = this.onchangeNotify.bind(this);
                pager.init(matchedProducts.length, this.numberOfProductsPerPage);
            });

            facet.onchangeFilters = this.onchangeFilters.bind(this);
            facet.init();


            util.moveTo('searchResultView')
        };
        productList.findProductsByPageNumber = function (pageNumber) {

            const begin = (pageNumber - 1) * this.numberOfProductsPerPage + 1;
            const end = (begin + this.numberOfProductsPerPage) - 1;

            return this.matched.slice(begin - 1, end);
        };
        productList.onchangeNotify = function (selectedPage) {

            const productsInPage = this.findProductsByPageNumber(selectedPage);
            this.view.render(productsInPage);
        };
        productList.onchangeFilters = function (filters) {

            console.log("search-term:" + this.searchTerm);
            console.log(filters);

            this.model.findMatchesWithFilters(this.searchTerm, filters, (products) => {
                
                this.matched = products;

                const productsInPageOne = this.findProductsByPageNumber(1);
                this.view.render(productsInPageOne);

                pager.init(this.matched.length, this.numberOfProductsPerPage);
            });
        }

        return productList;
    });