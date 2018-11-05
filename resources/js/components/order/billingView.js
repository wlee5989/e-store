define(['util'], function (util) {
    'use strict';

    const billingView = {
        root: document.querySelector('.checkout-form'),
        onclickMoveToShipping: null,
        onclickMoveToConfirm: null,
    };
    billingView.render = function () {

        util.loadTemplate('billing-form.html')
            .then(text => {
                this.root.innerHTML = text;

                this.root.querySelector('.btn-move-to-shipping').addEventListener('click', this.onclickMoveToShipping);
                this.root.querySelector('.btn-move-to-confirm').addEventListener('click', this.onclickMoveToConfirm);
            })
    };
    billingView.getFormInputValues = function () {
        let billingInfo = {};

        Array.from(this.root.querySelector('form').elements).forEach(element => {
            element.name && (billingInfo[element.name] = element.value);
        });

        return billingInfo;
    }

    return billingView;
});