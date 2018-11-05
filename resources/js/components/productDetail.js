define(['components/cart/cart', 'util'], function (cart, util) {

    'use strict';

    let tpl = null;
    util.loadTemplate('product-detail.html')
        .then(html => tpl = html);

    const productView = {
        root: document.querySelector('.product-detail'),
        onClickAddCart: null,
    };

    productView.render = function (product) {

        this.valuePopulatedHtml(product, tpl, (html) => {
            this.root.innerHTML = html;

            // wires up event listeners
            this.root.querySelector('.btn-add-cart')
                .addEventListener('click', this.onClickAddCart);
        });
    };

    productView.valuePopulatedHtml = function(product, tpl, fn) {
        const text = tpl.replace("product.imageUrl", product.images[1].url)
            .replace("product.name", product.name)
            .replace("product.price", product.price.formattedValue)
            .replace("product.description", product.description);

        fn(text);
    };


    const productC = {
        product: null,
        view: productView,
    }
    productC.init = function (product) {

        this.product = product;

        this.view.onClickAddCart = this.onClickAddCart.bind(this);

        this.view.render(product)
    }
    productC.onClickAddCart = function (e) {
        cart.addItem(this.product)
    }

    return productC;
});

