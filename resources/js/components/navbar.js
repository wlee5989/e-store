define(['util', 'components/searchModel', 'components/productList']
    , function(util, searchModel, productList) {
    'use strict';

    const navbar = {
        root: document.querySelector('.nav-bar-container'),
    };
    navbar.init = function() {

        this.render();
    }
    navbar.render = function() {
        util.loadTemplate('nav-bars.html')
            .then(html => {
                this.root.innerHTML = html;

                this.root.querySelector('.stuff').addEventListener('click', this.onclickCategory.bind(this));
                this.root.querySelector('.clothes').addEventListener('click', this.onclickCategory.bind(this));
            });
    };
    navbar.onclickCategory = function(e) {

        const clearIsActive = () => {
            this.root.querySelectorAll('.category > .navbar-item').forEach(category => {
                category.classList.remove('active');
            });

            console.log( this.root.querySelectorAll('.category > .navbar-item') );
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
    }

    return navbar;
});