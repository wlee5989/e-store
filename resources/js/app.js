require(
    ['util', 'components/search', 'components/topRightLinks', 'components/searchModel'
        , 'components/footer', 'components/tippy', 'components/navbar'],
    function (util, searchBox, topRightLinks, searchModel, footer, tippy, navbar ) {

        const endpoint = "/data/products.json";

        //-------------------- VIEW ------------------------------------------
        const appView = {
            root: document.body,
            backtoListLinks: document.querySelectorAll(".backtolist"),
            handleBackToList: null,
            onclickCheckout: null,
        };
        appView.render = function () {
            // nothing to render

            // wires up event listeners
            this.backtoListLinks
                .forEach(link => link.addEventListener("click", this.handleBackToList));
        }

        //------------------ CONTROLLER -------------------------------------
        const app = {
            view: appView,
            listenres: [],
        };
        app.init = function () {

            fetch(endpoint)
                .then(response => response.json())
                .then(results => {
                    searchModel.setList(results.results);
                });
            
            tippy.init();



            navbar.onselectCategory = this.onselectCategory;
            navbar.init();

            // topRightLinks.moveToCart = this.moveToCart;
            // topRightLinks.moveToCheckout = this.moveToCheckout;
            // topRightLinks.init();

            searchBox.moveToCart = this.moveToCart;
            searchBox.moveToProductView = this.moveToProductView;
            searchBox.onfocusSearch = this.onfocusSearch;
            searchBox.init();

            footer.init();

            this.view.handleBackToList = this.handleBackToList;
            this.view.render();

            util.subscribe('moveTo', this.handleMoveTo.bind(this));

        }
        app.onfocusSearch = function(e) {
            navbar.init();
        }
        app.onselectCategory = function() {
            searchBox.init();
        }
        app.handleMoveTo = function (navigation) {
            switch (navigation.page) {
                case 'productView':
                    this.moveToProductView();
                    break;
                case 'cart':
                    this.moveToCart();
                    break;
                case 'checkout':
                    this.moveToCheckout();
                    break;
                case 'searchResultView':
                    this.moveToSearchResultView();
                    break;
                case 'footerView':
                    this.moveToFooterView();
                    break;

                default:
                    console.log("No Such Page!");
            }
        };

        app.moveToSearchResultView = function () {
            document.querySelector('.container.search-container').classList.remove('hide');
            document.querySelector('.container.search-result-container').classList.remove('hide');

            document.querySelector('.container.checkout-container').classList.add('hide');
            document.querySelector('.container.cart-container').classList.add('hide');
            document.querySelector('.container.product-detail-container').classList.add('hide');
            document.querySelector('.container.home-middle-container').classList.add('hide');
            document.querySelector('.container.footer-container').classList.add('hide');
        };
        app.moveToCheckout = function () {
            document.querySelector('.container.checkout-container').classList.remove('hide');
            
            document.querySelector('.container.search-result-container').classList.add('hide');
            document.querySelector('.container.search-container').classList.add('hide');
            document.querySelector('.container.cart-container').classList.add('hide');
            document.querySelector('.container.product-detail-container').classList.add('hide');
            document.querySelector('.container.home-middle-container').classList.add('hide');
            document.querySelector('.container.footer-container').classList.add('hide');
        };
        app.handleBackToList = (e) => {
            document.querySelector('.container.search-container').classList.remove('hide');
            document.querySelector('.container.search-result-container').classList.remove('hide');

            document.querySelector('.container.home-middle-container').classList.add('hide');
            document.querySelector('.container.cart-container').classList.add('hide');
            document.querySelector('.container.product-detail-container').classList.add('hide');
            document.querySelector('.container.checkout-container').classList.add('hide');
            document.querySelector('.container.footer-container').classList.add('hide');
        };
        app.moveToCart = function () {
            document.querySelector('.container.cart-container').classList.remove('hide');

            document.querySelector('.container.search-container').classList.add('hide');
            document.querySelector('.container.search-result-container').classList.add('hide');
            document.querySelector('.container.product-detail-container').classList.add('hide');
            document.querySelector('.container.home-middle-container').classList.add('hide');
            document.querySelector('.container.footer-container').classList.add('hide');
        };
        app.moveToProductView = function () {
            document.querySelector('.container.product-detail-container').classList.remove('hide');
            document.querySelector('.container.search-container').classList.remove('hide');
            document.querySelector('.container.search-result-container').classList.add('hide');

            document.querySelector('.container.cart-container').classList.add('hide');
            document.querySelector('.container.home-middle-container').classList.add('hide');
            document.querySelector('.container.footer-container').classList.add('hide');
        };
        app.moveToFooterView = function () {
            document.querySelector('.container.footer-container').classList.remove('hide');
            document.querySelector('.container.search-container').classList.remove('hide');

            document.querySelector('.container.search-result-container').classList.add('hide');
            document.querySelector('.container.checkout-container').classList.add('hide');
            document.querySelector('.container.cart-container').classList.add('hide');
            document.querySelector('.container.product-detail-container').classList.add('hide');
            document.querySelector('.container.home-middle-container').classList.add('hide');
        };
        app.init();
    });


