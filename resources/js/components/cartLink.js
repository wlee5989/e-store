define(['components/cart/cart', 'components/miniCart', 'util'],
    function (cart, miniCart, util) {
        'use strict';

        const cartLinkView = {
            root: document.querySelector(".nav-bar-container"),
            render: function () {

                console.log( this );

                this.cartLinkNode = this.root.querySelector('.link-cart');

                this.cartLinkNode.addEventListener('click', this.onclickCartLink);
                this.cartLinkNode.addEventListener('mouseover', this.onhoverCartLink);
                this.cartLinkNode.addEventListener('mouseout', this.onmouseoutCartLink);

                this.updateBadge();

            },
            updateBadge: function () {

                const numberOfItems = cart.countTotalItems();

                const cartLinkNode = this.root.querySelector('.link-cart');
                this.cartLinkNode.dataset.badge = numberOfItems;
            },
            showMiniCart: function () {
                this.cartLinkNode.classList.add('active');
            },
            hideMiniCart: function () {
                this.cartLinkNode.classList.remove('active');
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