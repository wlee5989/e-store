define([], function () {
    'use strict';

    const tippy = {
        root: document.querySelector('.tippy'),
        texts: [],
        index: 0,
    };
    tippy.renderPrep = function () {
        function whichTransitionEvent() {
            var t;
            var el = document.createElement('fakeelement');
            var transitions = {
                'transition': 'transitionend',
                'OTransition': 'oTransitionEnd',
                'MozTransition': 'transitionend',
                'WebkitTransition': 'webkitTransitionEnd'
            }

            for (t in transitions) {
                if (el.style[t] !== undefined) {
                    return transitions[t];
                }
            }
        }

        let transitionEvent = whichTransitionEvent();
        transitionEvent && this.root.addEventListener(transitionEvent, this.transitionend.bind(this));
    };
    tippy.render = function (text) {

        this.root.textContent = text;
    };
    tippy.init = function () {

        this.renderPrep();

        this.texts.push(this.root.dataset.text1);
        this.texts.push(this.root.dataset.text2);

        this.render(this.texts[this.index]);
        this.root.classList.add('hide');
    }
    tippy.transitionend = function (e) {

        // replace text only when it is in fade out mode.
        if (this.root.classList.contains('hide')) {
            this.index =  ++this.index >= this.texts.length ? 0 : this.index;
            let text = this.texts[this.index];
            this.render(text);
        }

        this.root.classList.toggle('hide');
    }

    return tippy;
});