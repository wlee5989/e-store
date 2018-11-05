define(['components/order/shippingView', 'components/order/billingView', 'components/order/confirmationView', 'components/order/thankYouView'],
    function (shippingView, billingView, confirmView, thankYouView) {
        'use strict';

        const orderModel = {
            shippingFormFilled: false,
            billingFormFilled: false,

            shippingInfo: null,
            billingInfo: null,
            items: [],
            totalPrice: 0,
            recalculateTotal: function () {
                this.items.forEach(item => {
                    this.totalPrice += item.product.price.value * item.quantity;
                })

                return Math.round(this.totalPrice * 100) / 100;
            }
        };
        // set to multiple views.
        const viewRoot = document.querySelector('.checkout-form');

        const order = {
            emptyCart: null,
        };
        order.onclickMoveToShipping = function (e) {

            shippingView.root = viewRoot;
            shippingView.onclickMoveToBilling = this.onclickMoveToBilling.bind(this);

            shippingView.render();
        };
        order.onclickMoveToBilling = function (e) {
            e.preventDefault();

            // initialize
            orderModel.shippingFormFilled = false;

            const shippingInfo = shippingView.getFormInputValues();
            // validates inputs

            orderModel.shippingFormFilled = true;
            // save info to model
            orderModel.shippingInfo = shippingInfo;

            billingView.root = viewRoot;

            ///// moves to the shipping step
            billingView.onclickMoveToShipping = this.onclickMoveToShipping.bind(this);
            // moves to the billing step
            billingView.onclickMoveToConfirm = this.onclickMoveToConfirm.bind(this);

            billingView.render();
        };
        order.onclickMoveToConfirm = function (e) {
            e.preventDefault();

            // initialize 
            orderModel.billingFormFilled = false;

            // validates inputs
            const billingInfo = billingView.getFormInputValues();

            orderModel.billingFormFilled = true;

            // save info to model
            orderModel.billingInfo = billingInfo;

            confirmView.root = viewRoot;

            // wires events for billing view
            ///// moves to the shipping step
            confirmView.onclickMoveToShipping = this.onclickMoveToShipping.bind(this);
            //// moves to the billing step
            confirmView.onclickMoveToBilling = this.onclickMoveToBilling.bind(this);
            //// moves to put an order
            confirmView.onclickMoveToSubmit = this.onclickMoveToSubmit.bind(this);

            confirmView.render(orderModel);
        };
        order.onclickMoveToSubmit = function (e) {
            e.preventDefault();


            // finally pass to order processing system!
            console.log("Order was created! ");
            console.log(orderModel);

            // clean up cart
            this.emptyCart();

            // moves to "Thank you" view.
            thankYouView.render();
        };
        order.init = function (items) {

            //sets items in the order
            orderModel.items = [...items];

            shippingView.onclickMoveToBilling = this.onclickMoveToBilling.bind(this);

            shippingView.render();
        };

        return order;
    });

