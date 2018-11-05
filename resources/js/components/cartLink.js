define(['components/cart/cart', 'components/miniCart', 'util'],
    function (cart, miniCart, util) {
        'use strict';

        const cartLinkView = {
            root: document.querySelector(".link-cart"),
            render: function () {

                this.updateBadge();

                this.root.addEventListener('click', this.onclickCartLink);
                this.root.addEventListener('mouseover', this.onhoverCartLink);
                this.root.addEventListener('mouseout', this.onmouseoutCartLink);


            },
            updateBadge: function () {

                const numberOfItems = cart.countTotalItems();
                this.root.dataset.badge = numberOfItems;
            },
            showMiniCart: function () {
                this.root.classList.add('active');
            },
            hideMiniCart: function () {
                this.root.classList.remove('active');
            },
            onhoverCartLink: null,
            onclickCartLink: null,
            onmouseoutCartLink: null,
        }

        const cartLink = {
            view: cartLinkView,
        };

        cartLink.init = function () {

            this.view.onhoverCartLink = this.onhoverCartLink.bind(this);
            this.view.onmouseoutCartLink = this.onmouseoutCartLink.bind(this);
            this.view.onclickCartLink = this.onclickCartLink.bind(this);

            this.view.render();

            util.subscribe('cartItemChange', () => {
                this.view.updateBadge();
            });

            miniCart.init();
        }
        cartLink.onhoverCartLink = function (e) {
            if (cart.countTotalItems() == 0)
                return;

            this.view.showMiniCart();
        }
        cartLink.onmouseoutCartLink = function (e) {
            this.view.hideMiniCart();
        }
        cartLink.onclickCartLink = function (e) {

            if (cart.countTotalItems() == 0)
                return;

            cart.init();

            util.moveTo('cart');

        };

        return cartLink;
    });