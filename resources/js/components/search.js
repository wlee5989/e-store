define(['components/searchModel', 'components/productList'], function (searchModel, productList) {
    'use strict';

    //-------------------- VIEW ------------------------------------------
    const searchBoxView = {
        root: document.querySelector('.search-container'),
        keyUpOrChangeEventListener: null,
        cartLinkClickEventListener: null,

        render: function () {

            this.root.querySelector(".search").addEventListener("keyup", this.keyUpOrChangeEventListener);
            this.root.querySelector(".search").addEventListener("change", this.keyUpOrChangeEventListener);

         },
    }

    //------------------ CONTROLLER -------------------------------------
    const searchBox = {
        view: searchBoxView,
        model: searchModel,
    };
    searchBox.init = function () {

        // sets event handlers to view
        this.view.keyUpOrChangeEventListener = this.keyUpOrChangeEventListener.bind(this);
        // renders view
        this.view.render();


    };
    searchBox.keyUpOrChangeEventListener = function(e) {

        productList.init(e.target.value);
    };


    return searchBox;
});