define(function () {

    'use strict';

    const cartModel = {
        items: JSON.parse(localStorage.getItem('cart')) || [],
    };
    cartModel.addItem = function (product, fn) {
        const vm = this;

        this.findItem(product.code, (item) => {
            if (item) {
                this.removeItem(item.product.code, (items) => { });
                this.items.push({
                    product: product,
                    quantity: item.quantity + 1
                })
            }
            else {
                this.items.push({
                    product: product,
                    quantity: 1
                })
            }

            fn(this.items);
            localStorage.setItem('cart', JSON.stringify(this.items));
        });
    }
    cartModel.getAllItems = function () {
        return this.items;
    }
    cartModel.removeItem = function (code, fn) {
        const modifiedItems = this.items.filter(item => item.product.code !== code);
        this.items = [...modifiedItems];
        if (fn) fn(this.items);
        localStorage.setItem('cart', JSON.stringify(this.items));
    }
    cartModel.findItem = function (code, fn) {
        fn(this.items.find(item => item.product.code === code));
    }
    cartModel.cleanUp = function() {
        this.items = [];
        localStorage.setItem('cart', JSON.stringify(this.items));
    }

    return cartModel;
});

