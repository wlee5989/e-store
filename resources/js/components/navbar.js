define(['util', 'components/searchModel', 'components/productList', 'components/cartLink']
    , function(util, searchModel, productList, cartLink) {
    'use strict';

    const navbar = {
        root: document.querySelector('.nav-bar-container'),
        onselectCategory: null,
    };
    navbar.init = function() {

        this.render(() => {

            console.log( this.root.querySelector('.link-cart') );

            cartLink.init();
        });
    }
    navbar.render = function(fn) {
        util.loadTemplate('nav-bars.html')
            .then(html => {
                this.root.innerHTML = html;

                this.root.querySelector('.stuff').addEventListener('click', this.onclickCategory.bind(this));
                this.root.querySelector('.clothes').addEventListener('click', this.onclickCategory.bind(this));
                
                fn();
            });
    };
    navbar.onclickCategory = function(e) {

        const clearIsActive = () => {
            this.root.querySelectorAll('.category > .navbar-item').forEach(category => {
                category.classList.remove('active');
            });
        }
        const category = e.target.dataset.category;
        productList.init(category, true);

        clearIsActive();
        if(category === '100') {
            this.root.querySelector('.stuff').classList.add('active');
        }
        else if(category === '200') {
            this.root.querySelector('.clothes').classList.add('active');
        }

        // notify parent
        this.onselectCategory();
    }

    return navbar;
});