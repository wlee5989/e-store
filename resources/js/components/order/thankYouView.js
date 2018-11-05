define([], function () {
    'use strict';

    const thankYouView = {
        root: document.querySelector('.checkout-form'),
    };
    thankYouView.render = function () {
        this.root.innerHTML = "<h2>Thank You!</h2>";
    };

    return thankYouView;
});