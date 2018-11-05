define(['components/cart/cartModel','components/order/order', 'util'], function (cartModel, order, util) {
    'use strict';

    console.log("called cart..");

    let template = null;
    util.loadTemplate('cart-detail.html')
        .then(html => template = html);

    let cartSummaryTemplate = null;
    util.loadTemplate('cart-summary.html')
        .then(html => cartSummaryTemplate = html);

    const cartView = {
        root: document.querySelector(".cart-container"),
        onClickDeleteEventListener: null,
        onclickDescrease: null,
        onclickIncrease: null,
        onclickCheckout: null,
    };
    cartView.render = function (items) {
        const html = items.map(item => this._tplCart(item)).join('');
        this.root.querySelector(".cart-detail").innerHTML = html;

        const delButtons = this.root.querySelectorAll('.qtyZero');
        delButtons.forEach(btn => {
            btn.addEventListener('click', this.onClickDeleteEventListener);
        });

        const decButtons = this.root.querySelectorAll('.qtyminus');
        decButtons.forEach(btn => {
            btn.addEventListener('click', this.onclickDescrease);
        });

        const incButtons = this.root.querySelectorAll('.qtyplus');
        incButtons.forEach(btn => {
            btn.addEventListener('click', this.onclickIncrease);
        });

        this.root.querySelector(".cart-summary").innerHTML = this._tplCartSummary(items);
        this.root.querySelector(".cart-summary").querySelector('.btn-checkout').addEventListener('click', this.onclickCheckout);

    }
    cartView._tplCartSummary = function(items) {

        let totalPrice = 0;
        items.forEach(item => {
            totalPrice += (item.product.price.value * 100 * item.quantity) / 100
        })

        return cartSummaryTemplate
            .replace(/order.totalPrice/, (Math.round(totalPrice * 100)) / 100);
    };
    cartView._tplCart = function (item) {

        const product = item.product;
        const totalPrice = (Math.round(product.price.value * 100 * item.quantity) / 100);

        return template
            .replace(/product.imageUrl/, product.images[0].url)
            .replace(/product.name/, product.name)
            .replace(/totalPrice/, totalPrice)
            .replace(/product.code/g, product.code)
            .replace(/quantity/, item.quantity)
    }

    const cart = {
        model: cartModel,
        view: cartView,
    };
    cart.init = function () {

        this.view.onClickDeleteEventListener = this.onClickDelete.bind(this);
        this.view.onclickDescrease = this.onclickDescrease.bind(this);
        this.view.onclickIncrease = this.onclickIncrease.bind(this);
        this.view.onclickCheckout = this.onclickCheckout.bind(this);
        
        const items = this.model.getAllItems();
        this.view.render(items);

        // productQuantity.init();
    }
    //------------------ public methods ------------------------------------
    cart.countTotalItems = function() {
        return this.model.getAllItems().length;
    };
    cart.fetchTotalItems = function() {
        return [...this.model.getAllItems()];
    }
    //------------------ Actions --------------------------------------------
    cart.onClickDelete = function (e) {
        this.model.removeItem(e.target.dataset.code, (items) => {
            this.view.render(items);
            util.publish('cartItemChange', {})
        });
    }
    cart.onclickDescrease = function (e) {
        this.model.findItem(e.target.dataset.code, (item) => {
            item.quantity--;
            if (item.quantity == 0) {
                this.model.removeItem(e.target.dataset.code, (items) => {
                    this.view.render(items);
                });
            }
            else {
                const items = this.model.getAllItems();
                this.view.render(items);
            }

            util.publish('cartItemChange', {})
        });
    }
    cart.onclickIncrease = function (e) {
        this.model.findItem(e.target.dataset.code, (item) => {
            item.quantity++;
            const items = this.model.getAllItems();
            this.view.render(items);
            util.publish('cartItemChange', {})
        });
    }
    cart.addItem = function (product) {
        this.model.addItem(product, (items) => {
            this.view.render(items);
            util.publish('cartItemChange', {})
        });
    };
    cart.cleanUp = function() {
        this.model.cleanUp();
        util.publish('cartItemChange', {})
    }
    cart.onclickCheckout = function() {

        order.emptyCart = this.cleanUp.bind(this);

        order.init(this.model.getAllItems());
        util.moveTo('checkout');
    }


    return cart;
});

