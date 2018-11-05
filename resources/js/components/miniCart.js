define(['components/cart/cart', 'util'], function (cart, util) {
    'use strict';


    //--------------- View -----------
    const miniCartView = {
        root: document.querySelector('.mini-cart'),
        onclickViewCart: null,
    };
    miniCartView.render = function () {

        util.loadTemplate('mini-cart.html')
            .then(html => {
                this.root.innerHTML = html
                    .replace(/itemCount/, cart.countTotalItems());

                const itemsDOM = this.root.querySelector(".items");
                const itemDOM = this.root.querySelector('.item');
                const itemHTML = itemDOM.innerHTML;

                const itemsHTML = cart.fetchTotalItems().map(item => {

                    const product = item.product;
                    const totalPrice = Math.round(item.quantity * product.price.value * 100) / 100;

                    const populatedHTML = itemHTML
                        .replace(/product.name/, product.name)
                        .replace(/img src="(.*)"/, `img src="${product.images[0].url}"`)
                        .replace(/item.totalPrice/, totalPrice);

                    return `
                        <div class="item">${populatedHTML}</div>
                    `
                });


                itemsDOM.innerHTML = itemsHTML.join('');

                // wire up the event
                this.root.querySelector('.view-cart').addEventListener('click', this.onclickViewCart);
            });


    };

    //--------------- Controller -------
    const miniCart = {
        view: miniCartView,
        onclickViewCart: null,
    };
    miniCart.init = function () {

        // sets event listeners to view
        this.view.onclickViewCart = this.onclickViewCart;
        // renders view
        this.view.render();

        util.subscribe('cartItemChange', () => {
            this.view.render();
        });
    };
    miniCart.show = function () {
        this.root.classList.toggle('active');
    };
    miniCart.hide = function () {
        this.root.classList.toggle('active');
    }


    //------------- export ---------------
    return miniCart;
});