define(['util', 'components/facet/facetUtils'], function (util, facetUtils) {
    'use strict';

    function isEmpty(obj) {
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop))
                return false;
        }

        return JSON.stringify(obj) === JSON.stringify({});
    }

    const filterPanelView = {
        root: document.querySelector('.filter-panel'),
        onclickClearFilters: null,
        onclickClose: null,
    };
    filterPanelView.render = function (filters) {

        filters = filters || {};    // to prevent from "undefined"


        util.loadTemplate('filter-panel.html')
            .then(html => {
                html = this.buildPagerHTMLfromTemplate(html, filters);
                this.root.innerHTML = html;

                // add click event listeners
                if (isEmpty(filters))
                    return;

                this.root.querySelector('.clear-filters').addEventListener('click', this.onclickClearFilters);
                this.root.querySelectorAll('.filter')
                    .forEach(el => el.addEventListener('click', this.onclickClose));
            });
    };
    filterPanelView.removeFilter = function (facetCode, facetValue) {

        this.root.querySelectorAll('.filter').forEach(filter => {
            if(filter.dataset.facetCode === facetCode 
                && filter.dataset.facetValue === facetValue) {
                    filter.remove();
                }
        });

        // check if no more filters left.
        if (this.root.querySelectorAll('.filter').length == 0) {
            this.root.querySelector('.clear-filters').remove();
        }
    };
    filterPanelView.removeAllFilters = function() {
        this.root.querySelector('.filters').innerHTML = '';
    };
    filterPanelView.buildPagerHTMLfromTemplate = function (html, filters) {

        function cloneFilterAndAddToFilters(elFilter, elFilters, key, value) {
            const anchorDOM = elFilter.cloneNode(true);

            anchorDOM.dataset.facetCode = key;
            anchorDOM.dataset.facetValue = value;

            const valueName = facetUtils.getValueName(key, value)
            anchorDOM.querySelector('.code').textContent = `${key}: ${valueName}`;

            elFilters.appendChild(anchorDOM);
        }

        // creates dummy DOM
        const elDummy = document.createElement('Dummy');
        elDummy.innerHTML = html;

        const elFilters = elDummy.querySelector('.filters');
        const elFilter = elFilters.querySelector('.filter');    // extract the first one
        const htmlFilter = elFilter.innerHTML;

        const elClearFilters = elFilters.querySelector('.clear-filters');

        // remove all children from filters DOM
        elFilters.innerHTML = '';

        // iterate filters to create a filter
        for (var key in filters) {
            if (filters.hasOwnProperty(key)) {

                // add each filter if value contains array
                const value = filters[key];
                if (value instanceof Array) {
                    value.forEach(v => {
                        cloneFilterAndAddToFilters(elFilter, elFilters, key, v);
                    });
                }
                else {
                    cloneFilterAndAddToFilters(elFilter, elFilters, key, value);
                }
            }
        }

        // add clear-filters if it is not empty
        if (!isEmpty(filters)) {
            elFilters.appendChild(elClearFilters);
        }

        return elDummy.innerHTML;
    };


    const filterPanel = {
        view: filterPanelView,
        oncloseFilter: null,
        onclearFilters: null,
    };
    filterPanel.init = function (filters) {

        this.view.onclickClose = this.onclickClose.bind(this);
        this.view.onclickClearFilters = this.onclickClearFilters.bind(this);
        this.view.render(filters);
    };
    filterPanel.onclickClose = function (e) {
        const filterNode = e.target.parentNode;

        // notify parent
        const facetCode = filterNode.dataset.facetCode;
        const facetValue = filterNode.dataset.facetValue;
        this.oncloseFilter(facetCode, facetValue);

        // remove this filter
        this.view.removeFilter(facetCode, facetValue);
    };
    filterPanel.onclickClearFilters = function (e) {

        // notify parent
        this.onclearFilters();

        // remove all filters
        this.view.removeAllFilters();
    };
    filterPanel.onaddFilter = function(facetCode, facetValue) {
        this.view.onaddFilter(facetCode, facetValue);
    };

    return filterPanel;
});