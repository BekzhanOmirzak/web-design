/*




*/


var budgetController = (function () {

    var x = 23;

    var add = function (a) {
        return a + x;
    }

    return {
        myFunc: function (b) {
            return add(b);
        }
    }

})();

var UIController = (function () {


})();


var appController = (function (budgetCtrl, UICtrl) {


    var z = budgetCtrl.myFunc(5);

    return {
        anotherPublic: function () {
            return z;
        }
    }

})(budgetController, UIController);














































