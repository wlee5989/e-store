define(['util'], function (util) {
    'use strict';

    const footer = {
        root: document.querySelector('.footer-link-container'),
    };
    footer.init = function () {

        util.loadTemplate('footer.html')
            .then(html => {
                this.root.innerHTML = html;

                this.root.querySelector('.item-about-us').addEventListener('click', this.onclickFooterItem.bind(this, 'about-us.html'));
                this.root.querySelector('.item-store-locator').addEventListener('click', this.onclickFooterItem.bind(this, 'store-locator.html'));
            });
    };
    footer.onclickFooterItem = function (...parameter) {

        const elem = document.querySelector('.footer-container .content');

        util.loadTemplate(parameter[0])
            .then(html => {
                elem.innerHTML = html;

                util.moveTo('footerView');
            })
    };

    return footer;
});