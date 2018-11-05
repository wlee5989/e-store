define(['util', 'components/facet/facetPanelView', 'components/searchModel']
    , function (util, facetPanelView, searchModel) {
    'use strict';

    const facetPanel = {
        view: facetPanelView,
        onaddFilter: null, // delegates to parent.
    };
    facetPanel.init = function () {

        this.view.onclickFacet = this.onclickFacet.bind(this);

        this.view.render(searchModel.facets());
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