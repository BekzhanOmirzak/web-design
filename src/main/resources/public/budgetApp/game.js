/*




*/


//BudgetController
var budgetController = (function () {

    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    };

    function calculateExpInc(type) {
        var sum = 0;
        data.allItems[type].forEach(x => sum += x.value)
        data.totals[type] = sum.toFixed(2);
    }

    return {
        addItem: function (type, description, val) {
            var newItem;
            var ID = 0;

            if (data.allItems[type].length !== 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            }
            if (type === 'exp') {
                newItem = new Expense(ID, description, val)
            } else if (type === 'inc') {
                newItem = new Income(ID, description, val)
            }

            data.allItems[type].push(newItem)
            return newItem;
        },
        calculateBudget: function () {

            //calculate the total and expenses
            calculateExpInc('exp')
            calculateExpInc('inc')

            //calculate the budget;
            data.budget = (data.totals.inc - data.totals.exp).toFixed(2);

            //calculate the percentage of income that we spent;
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100)
            } else {
                data.percentage = -1;
            }
        },
        testing: function () {
            console.log(data)
        },
        getBudget: function () {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
        },
        deleteItem: function (type, id) {
            data.allItems[type] = data.allItems[type].filter(x => {
                return x.id !== id;
            })
        }
    }


})();


//UIController
var UIController = (function () {


    var DOMstrings = {
        inputType: '.add_type',
        inputDescription: '#description',
        inputValue: '#value',
        inputButton: '.button',
        incomeContainer: '.income-list',
        expenseContainer: '.expense-list',
        expense: '.expense-number',
        income: '.income-number',
        totalBudget: '.budget-number',
        container: '.third-section',
        date: '.available-budget'
    }
    var formatNumber = function (num, type) {

        var numSplit, int, dec;

        num = Math.abs(num);
        num = num.toFixed(2);

        numSplit = num.split('.')

        int = numSplit[0];

        if (int.length > 3) {
            int = int.substring(0, int.length - 3) + ',' + int.substring(int.length - 3, int.length);
        }

        dec = numSplit[1];

        return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
    }

    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            }
        },
        addListItem: function (obj, type) {
            var html, newHtml, element;
            //Create  HTML string with placeholder with some actual  data;
            html = ' <div class="item" id="%abc%-%id%"> <div class="description"> %description%</div> <div class="price"> ' +
                ' %value% </div>  <div class="delete"> <i class="far fa-window-close"></i>  </div> </div> ';

            //Replace the placeholder text with some actual data
            newHtml = html.replace('%description%', obj.description).replace('%value%', formatNumber(obj.value, type));
            newHtml = newHtml.replace('%abc%', type).replace('%id%', obj.id);
            if (type === 'inc') {
                element = DOMstrings.incomeContainer;
            } else {
                element = DOMstrings.expenseContainer;
            }

            //insert the HTML into the DOM;
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);


        },
        getDOMstrings: function () {
            return DOMstrings;
        },
        clearFields: function () {
            var fields;
            fields = document.querySelectorAll(DOMstrings.inputDescription + ", " + DOMstrings.inputValue);

            var myArray = Array.prototype.slice.call(fields);
            myArray.forEach(x => x.value = ' ');
            myArray[0].focus();
        },
        updateTotalBudget: function (data) {

            document.querySelector(DOMstrings.expense).textContent = formatNumber(data.totalExp, 'exp');
            document.querySelector(DOMstrings.income).textContent = formatNumber(data.totalInc, 'inc');
            var type;
            data.budget >= 0 ? type = 'inc' : type = 'exp'
            document.querySelector(DOMstrings.totalBudget).textContent = formatNumber(data.budget, type);

        },
        deleteItemFromList: function (selectorID) {
            var element = document.getElementById(selectorID);
            element.parentNode.removeChild(element);
        }

    }


})();


//Controller
var controller = (function (budgetCtrl, UICtrl) {


    var setUpEventListeners = function () {
        var DOM = UICtrl.getDOMstrings();

        document.querySelector(DOM.inputButton).addEventListener('click', () => {
            ctrlAddItem();

        })
        document.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                ctrlAddItem();
            }
        })

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

    };

    var updateDate = function () {
        var DOM = UICtrl.getDOMstrings();

        var month = new Date().getMonth();
        var year = new Date().getFullYear();
        document.querySelector(DOM.date).textContent = 'Available Budget in ' + month + ' in ' + year;

    }


    var ctrlDeleteItem = function (event) {
        var itemID, splitID, type, id;
        itemID = event.target.parentNode.parentNode.id

        if (itemID) {

            splitID = itemID.split('-');
            type = splitID[0];
            id = parseInt(splitID[1]);

            // 1. Delete Item from data structure;
            budgetCtrl.deleteItem(type, id);

            // 2. Delete the item from UI
            updateBudget();

            // 3. Update and show the new budget;
            UICtrl.deleteItemFromList(itemID);

        }


    };

    var updateBudget = function () {

        //4. Calculate the budget
        budgetCtrl.calculateBudget();

        //Return budget;
        var budget = budgetCtrl.getBudget();

        //5. Display the budget UI
        UIController.updateTotalBudget(budget);

    }


    var ctrlAddItem = function () {
        var input, newItem;
        //1. Get  the item input field
        input = UICtrl.getInput();

        if (input.description !== '' && !isNaN(input.value) && input.value > 0) {
            //2.Add item to to the budget controller;
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            //3. Add item to the UI;
            UICtrl.addListItem(newItem, input.type);

            //Clear the used fields..
            UIController.clearFields();

            //5. Calculate and update the budget;
            updateBudget();
        }

    }
    return {
        init: function () {
            console.log("App has just started")
            setUpEventListeners();
            updateBudget();
            updateDate();
        }
    }

})(budgetController, UIController);
controller.init();


















































