define(['util'], function (util) {
    'use strict';

    const shippingView = {
        root: document.querySelector('.checkout-form'),
        onclickMoveToBilling: null,
    };
    shippingView.render = function () {

        util.loadTemplate('shipping-form.html')
            .then(text => {
                this.root.innerHTML = text;

                this.root.querySelector('.btn-move-to-billing').addEventListener('click', this.onclickMoveToBilling);
            })

    };
    shippingView.getFormInputValues = function() {
        let shippingInfo = {};

        Array.from(this.root.querySelector('form').elements).forEach(element => {
            element.name && (shippingInfo[element.name] = element.value);
        });

        return shippingInfo;
    }

    return shippingView;
});