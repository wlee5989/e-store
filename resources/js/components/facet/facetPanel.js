define(['util', 'components/facet/facetPanelView', 'components/searchModel', 'components/facet/facetUtils']
    , function (util, facetPanelView, searchModel, facetUtils) {
    'use strict';

    const facetPanel = {
        view: facetPanelView,
        onaddFilter: null, // delegates to parent.
    };
    facetPanel.init = function (matchedProducts) {

        this.view.onclickFacet = this.onclickFacet.bind(this);

        const facets = [];
    
        facets.push(facetUtils.createCategoryFacet(matchedProducts));
        facets.push(facetUtils.createBrandFacet(matchedProducts));
        facets.push(facetUtils.createPriceFacet(matchedProducts));

        this.view.render(facets);
    };
    facetPanel.onclickFacet = function (e) {
        if (e.target.name) {

            this.onaddFilter(e);

            const facetCode = e.target.name;

            // hide facet
            this.view.hideFacet(facetCode);
        }
    };
    facetPanel.showFacet = function (facetCode, facetValue) {
        this.view.showFacet(facetCode, facetValue);
    }
    facetPanel.showAllFacets = function () {
        this.view.showAllFacets();
    }


    return facetPanel;
});