define([], function () {
    'use strict';

    const counter = {
        totalNumber: 8,
        maxLastNumber: 5,

        firstNumber: 1,
        lastNumber: 5,
        focPosition: 1,
        selected: 1,

        init: function (totalNumber /*total number of page*/,
            maxLastNumber /* max number of numberpad */) {

            if(totalNumber === 0)
                throw Error("Total Number cannot be zero.");

            this.totalNumber = totalNumber;
            this.maxLastNumber = maxLastNumber || 5;

            if (this.totalNumber > this.maxLastNumber) {
                this.lastNumber = this.maxLastNumber;
            }
            else {
                this.lastNumber = this.totalNumber;
            }

            this.firstNumber = 1,
                this.focPosition = 1,
                this.selected = 1;
        },
        initialState: function () {

            return {
                first: this.firstNumber,
                last: this.lastNumber,
                focPosition: this.focPosition,
                total: this.totalNumber,
                selected: this.selected
            }
        },
        next: function () {
            if (this.totalNumber <= this.maxLastNumber) {
                this.firstNumber = this.firstNumber;
                this.lastNumber = this.totalNumber;

                this.focPosition++;
                if (this.focPosition > this.totalNumber) {
                    this.focPosition = this.totalNumber;
                }
            }
            else {
                if (this.focPosition + 1 <= (this.maxLastNumber - 2)) {
                    this.focPosition++;
                }
                else {
                    if (this.lastNumber + 1 <= this.totalNumber) {

                        this.firstNumber++;
                        this.lastNumber++;
                    }
                    else {
                        this.focPosition++;
                        if (this.focPosition > this.maxLastNumber) {
                            this.focPosition = this.maxLastNumber;
                        }
                    }
                }
            }

            this.selected = this.firstNumber + this.focPosition - 1;

            console.log( this );

            return {
                first: this.firstNumber,
                last: this.lastNumber,
                focPosition: this.focPosition,
                total: this.totalNumber,
                selected: this.selected
            }
        },
        prev: function () {
            if (this.totalNumber <= this.maxLastNumber) {

                if (this.focPosition - 1 > 0) {
                    this.focPosition--;
                }
            }
            else {

                if (this.focPosition > (this.maxLastNumber - 2)) {
                    this.focPosition--;
                }
                else {
                    if (this.firstNumber - 1 > 0) {
                        this.firstNumber--;
                        this.lastNumber--;
                    }
                    else {
                        if (this.focPosition - 1 > 0) {
                            this.focPosition--;
                        }
                    }

                }
            }

            this.selected = this.firstNumber + this.focPosition - 1;

            return {
                first: this.firstNumber,
                last: this.lastNumber,
                focPosition: this.focPosition,
                total: this.totalNumber,
                selected: this.selected
            }
        },
        setPageNumber: function (pageNumber) {

            this.selected = pageNumber;
            this.focPosition = this.selected - this.firstNumber + 1;

            return {
                first: this.firstNumber,
                last: this.lastNumber,
                focPosition: this.focPosition,
                total: this.totalNumber,
                selected: this.selected
            }
        }
    };

    return counter;
});
