define(['components/cartLink'], function (cartLink) {
    'use strict';


    //----------------- CONTROLLER -------------------------------
    const topRightLinks = {
    };

    topRightLinks.init = function () {

        // renders view
        cartLink.init();
    };


    return topRightLinks;
});
