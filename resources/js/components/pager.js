define(['util', 'components/counter'], function (util, counter) {
    'use strict';

    const pagerView = {
        root: document.querySelector('.search-result-container'),
        onclickLeft: null,
        onclickRight: null,
        onsetPageNumber: null,
    };
    pagerView.hide = function () {

        function removeChildren(el) {
            while (el.hasChildNodes()) {
                el.removeChild(el.lastChild);
            }
        }
        
        let el = this.root.querySelector(".pagination-top");
        removeChildren(el);
        el = this.root.querySelector(".pagination-bottom");
        removeChildren(el);
    }
    pagerView.render = function (lastPage) {

        util.loadTemplate('pager.html')
            .then(html => {

                let vm = this;

                html = this.buildPagerHTMLfromTemplate(html, lastPage);

                this.root.querySelectorAll('.pagination')
                    .forEach(pager => pager.innerHTML = html);

                this.root.querySelectorAll('.left').forEach(el => { el.addEventListener('click', vm.onclickLeft) });
                this.root.querySelectorAll('.right').forEach(el => { el.addEventListener('click', vm.onclickRight) });
                this.root.querySelectorAll('.focpos').forEach(el => {

                    el.addEventListener('click', vm.onsetPageNumber);
                })

                this.updateNumberPad(1);
            });
    };
    pagerView.updateNumberPad = function (focPosition) {
        const numberPads = this.root.querySelectorAll(".focpos");
        numberPads.forEach(pad => pad.classList.remove('selected'));

        let el = this.root.querySelector(".pagination-top").querySelector(`.focpos-${focPosition}`);
        el.classList.add('selected');
        el.classList.add('pagination-link');

        el = this.root.querySelector(".pagination-bottom").querySelector(`.focpos-${focPosition}`);
        el.classList.add('selected');
        el.classList.add('pagination-link');

    };
    pagerView.buildPagerHTMLfromTemplate = function (html, lastPage) {
        const elDummy = document.createElement("dummyelement");
        elDummy.innerHTML = html;

        // extracts one of the anchor.
        let elFocPos = elDummy.querySelector('.focpos');

        // removes existing anchors
        elDummy.querySelectorAll('.focpos').forEach(e => e.remove());

        // reference for new anchors
        let elRightArrow = elDummy.querySelector('.right');

        // reference of parent node where the new anchors go.
        let elPager = elDummy.querySelector('.pager');

        // create new anchors and insert them into parent node.
        for (let p = 0; p < lastPage; p++) {

            let newElement = elFocPos.cloneNode(true);
            newElement.className = `pagination-link focpos focpos-${p + 1}`;
            newElement.textContent = `${p + 1}`;

            elPager.insertBefore(newElement, elRightArrow);
        }

        return elDummy.innerHTML;
    }

    const pager = {
        view: pagerView,
        onchangeNotify: null,
    };
    pager.init = function (totalProducts, productsPerPage) {

        if (totalProducts > 0) {

            let totalNumber = Math.ceil(totalProducts / productsPerPage);

            counter.init(totalNumber, productsPerPage);

            const state = counter.initialState();

            this.view.onclickLeft = this.onclickLeft.bind(this);
            this.view.onclickRight = this.onclickRight.bind(this);
            this.view.onsetPageNumber = this.onsetPageNumber.bind(this);

            this.view.render(state.last);
        }
        else {
            this.view.hide();
        }
    };
    pager.onclickLeft = function (e) {
        const { focPosition, selected } = counter.prev();

        this.view.updateNumberPad(focPosition);

        // notify to outside world.
        this.onchangeNotify(selected);
    };
    pager.onclickRight = function (e) {

        const { focPosition, selected } = counter.next();

        this.view.updateNumberPad(focPosition);
        // notify to outside world.
        this.onchangeNotify(selected);
    };
    pager.onsetPageNumber = function (e) {

        const pageNumber = parseInt(e.target.textContent);
        const { focPosition, selected } = counter.setPageNumber(pageNumber);

        this.view.updateNumberPad(focPosition);
        // notify to outside world.
        this.onchangeNotify(selected);
    };
    pager.onchangeNotify = function (selectedPage) {
        console.log("not yet implemented: selected page = " + selectedPage);
    }

    return pager;
});