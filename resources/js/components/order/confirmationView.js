define(['util'], function(util) {
    'use strict';

    const confirmForm = {
        root: document.querySelector('.checkout-form'),
        onclickMoveToShipping: null,
        onclickMoveToBilling: null,
        onclickMoveToSubmit: null,
    };
    confirmForm.render = function(orderModel) {

        util.loadTemplate('order-confirm.html')
            .then(text => {
                this.root.innerHTML = text
                    .replace(/order.totalPrice/, orderModel.recalculateTotal());

                this.root.querySelector('.btn-move-to-shipping').addEventListener('click', this.onclickMoveToShipping);
                this.root.querySelector('.btn-move-to-billing').addEventListener('click', this.onclickMoveToBilling);
                this.root.querySelector('.btn-move-to-submit').addEventListener('click', this.onclickMoveToSubmit);
            })
    };

    return confirmForm;
});