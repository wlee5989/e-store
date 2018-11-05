define(['util'], function (util) {
    'use strict';

    let htmlTemplate = null;
    util.loadTemplate('facet-panel.html')
        .then(html => htmlTemplate = html);

    const facetPanelView = {
        root: document.querySelector('.facet-panel'),
        onclickFacet: null,
    };
    facetPanelView.render = function (facetJSON) {

        const finalHTML = this.buildDOM(htmlTemplate, facetJSON);
        this.root.innerHTML = finalHTML;

        this.root.querySelector('.facets').addEventListener('click', this.onclickFacet);

    };
    facetPanelView.hideFacet = function (facetCode) {

        this.root.querySelectorAll('.facet').forEach(facet => {
            if (facet.dataset.facetCode === facetCode) {
                // hide for bothe facet value are chcked with checkbox
                if (facet.dataset.multiSelect) {

                    let checkedAll = true;
                    facet.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
                        checkedAll &= checkbox.checked;
                    })

                    if (checkedAll) {
                        facet.classList.add('hide');
                    }
                }
                else {
                    facet.classList.add('hide');
                }
            }
        })

    };
    facetPanelView.showFacet = function (facetCode, facetValue) {

        this.root.querySelectorAll('.facet').forEach(facet => {
            if (facet.dataset.facetCode === facetCode) {

                if (facet.dataset.multiSelect) {
                    facet.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
                        if (checkbox.dataset.facetValue === facetValue) {
                            checkbox.checked = undefined;
                        }
                    })
                }

                facet.classList.remove('hide');
            }
        })
    };
    facetPanelView.showAllFacets = function () {

        this.root.querySelectorAll('.facet').forEach(facet => {

            if (facet.dataset.multiSelect) {
                facet.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
                    checkbox.checked = undefined;
                })
            }
            facet.classList.remove('hide');
        })
    };
    facetPanelView.buildDOM = function (html, facetDefs) {

        function modifyDOM(facetDOM, facetDef) {

            const elementUL = facetDOM.querySelector('ul');

            let elementLIHTML = elementUL.querySelector('li').innerHTML;

            // removes inner elements
            facetDOM.querySelectorAll('li').forEach(e => e.remove());

            facetDef.values.forEach((facetValue) => {

                const elLI = document.createElement('li');
                elLI.innerHTML = elementLIHTML;

                if (facetDef.multiSelect) {

                    console.log( facetValue );

                    const elLABEL = elLI.querySelector('label');

                    let elCheckbox = elLABEL.querySelector('input');
                    elCheckbox.name = facetDef.code;
                    elCheckbox.dataset.facetValue = facetValue.code;
                    elCheckbox.dataset.facetValueName = facetValue.name;

                    const spanNode = document.createElement('span');
                    spanNode.textContent = `${facetValue.name} (${facetValue.count})`;

                    elLABEL.textContent = '';
                    elLABEL.appendChild(elCheckbox);
                    elLABEL.appendChild(spanNode);

                    elementUL.appendChild(elLI);
                }
                else {
                    let elAnchor = elLI.querySelector('a');

                    elAnchor.name = facetDef.code;
                    elAnchor.dataset.facetValue = facetValue.code;
                    elAnchor.dataset.facetValueName = facetValue.name;
                    elAnchor.textContent = `${facetValue.name} (${facetValue.count})`;

                    elLI.appendChild(elAnchor);
                    elementUL.appendChild(elLI);
                }
            });
        }

        // loop thru doms from a given template
        const el = document.createElement('dummyElement');
        el.innerHTML = html;
        el.querySelectorAll('.facet').forEach(facet => {

            const facetCode = facet.dataset.facetCode;

            const facetdef = facetDefs.find(def => def.code === facetCode);
            if (facetdef) {
                facet.dataset.multiSelect = true;
                modifyDOM(facet, facetdef);
            }
            else {
                facet.remove();
            }
        });

        return el.innerHTML;
    };

    return facetPanelView;
});
