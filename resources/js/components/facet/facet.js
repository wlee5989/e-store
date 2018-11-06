define(['util', 'components/facet/facetPanel', 'components/facet/filterPanel']
    , function (util, facetPanel, filterPanel) {
        'use strict';

        const facet = {
            onchangeFilters: null,
            filters: {},
        };
        facet.init = function (matchedProducts) {

            filterPanel.oncloseFilter = this.oncloseFilter.bind(this);
            filterPanel.onclearFilters = this.onclearFilters.bind(this);
            filterPanel.init();

            facetPanel.onaddFilter = this.onaddFilter.bind(this);
            facetPanel.init(matchedProducts);
        };
        facet.onaddFilter = function (e) {

            // update filter
            const name = e.target.name;
            const value = e.target.dataset.facetValue;

            if (e.target.type == 'checkbox') {
                const values = this.filters[name] || [];

                if (e.target.checked) {

                    if (values.indexOf(value) < 0) {
                        values.push(e.target.dataset.facetValue);
                    }

                    this.filters[name] = values;
                }
                else {
                    const index = values.indexOf(value);
                    index >= 0 && values.splice(index, 1);

                    if (values.length == 0) {
                        delete this.filters[name];
                    }
                    else {
                        this.filters[name] = values;
                    }
                }
            }
            else {
                this.filters[name] = value;
            }

            // pass it to the parent
            this.onchangeFilters(this.filters);

            // update filter panel
            filterPanel.init(this.filters);
        };
        facet.oncloseFilter = function (facetCode, facetValue) {

            // update filters
            // check multiSelect
            if(this.filters[facetCode] instanceof Array) {
                if(this.filters[facetCode].length > 1) {
                    const index = this.filters[facetCode].indexOf(facetValue);
                    this.filters[facetCode].splice( index, 1 );
                }
                else {
                    delete this.filters[facetCode];
                }
            }
            else {
                delete this.filters[facetCode];
            }

            // pass it to the parent
            this.onchangeFilters(this.filters);

            facetPanel.showFacet(facetCode, facetValue);
        };
        facet.onclearFilters = function () {

            // update filters
            this.filters = {};

            // pass it to the parent
            this.onchangeFilters(this.filters);

            facetPanel.showAllFacets();
        };

        return facet;
    });