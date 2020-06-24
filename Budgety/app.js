//BUDGET CONTROLLER
var budgetController = (function() {
    
    function Expense(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    }

    Expense.prototype.calcPercentage = function(totalIncome) {
        if ( totalIncome > 0) {
            this.percentage = Math.round( (this.value / totalIncome) * 100 );
        }
        else {
            this.percentage = -1;
        }
    }

    Expense.prototype.getPercentage = function() {
        return this.percentage;
    }

    function Income(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }
    
    function calculateTotal(type) {
        var sum = 0;
        data.allItems[type].forEach(function(cur) {
            sum += cur.value;
        })
        data.totals[type] = sum
    }

    var data = {
        id: {
            exp: 0,
            inc: 0
        },
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
    }

    return {
        addItem: function(type, des, val) {
            var newItem;
            if(type == 'exp') {
                newItem = new Expense(data.id[type], des, val)
            } else if(type == 'inc') {
                newItem = new Income(data.id[type], des, val)
            }

            data.allItems[type].push(newItem);
            data.id[type]++;
            return newItem;
        },

        deleteItem: function(type, id) {
            var ids, index;
            
            var ids = data.allItems[type].map(function(current) {
                return current.id;
            })
            index = ids.indexOf(id);
            if (index >= 0) {
                data.allItems[type].splice(index, 1);
            }  
        },

        calculateBudget: function() {
            //Calculate total income and expences
            calculateTotal('inc');
            calculateTotal('exp');

            //Calculate budget: total income - total exp
            data.budget = data.totals.inc - data.totals.exp;

            //Calculate % of income spent
            if ( data.totals.inc > 0 ) {
                data.percentage = Math.round( (data.totals.exp / data.totals.inc) * 100 );
            }
            else {
                data.percentage = -1;
            }
        },

        calculatePercentages: function() {
            data.allItems.exp.forEach(function(i) {
                i.calcPercentage(data.totals.inc);
            })
        },

        getPercentages: function() {
            var allPerc = data.allItems.exp.map(function(i) { return i.getPercentage(); });
            return allPerc;
        },

        getBudget: function() {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
        },

        displayData: function() {
            console.log(data)
        }

    }

})();


//UI CONTROLLER
var UIController = (function() {
    
    var DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputAmount: '.add__value',
        inputButton: '.add__btn',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list',
        budgetLabel:  '.budget__value',
        incomeLabel:  '.budget__income--value',
        expensesLabel:  '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: '.item__percentage',
        monthLabel: '.budget__title--month'
    }

    function formatNumber(num, type) {
        var splitNum, int;

        //1. +/- before a number and , separated thousand (eg, 1249.993 -> + 1,249.99)
        num = Math.abs(num);
        num = num.toFixed(2);
        splitNum = num.split('.');
        int = splitNum[0];
        if (int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
        } 
        
        return (type == 'inc' ? '+' : '-') + ' ' + int + '.' + splitNum[1];
    }

    function nodeListForEach(list, callback) {
        for (var i = 0; i < list.length; i++) {
            callback(list[i], i);
        }
    }

    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMStrings.inputType).value,   //will be inc(+) or exp(-)
                desc: document.querySelector(DOMStrings.inputDescription).value,
                amount: parseFloat(document.querySelector(DOMStrings.inputAmount).value)
            }
        },

        addListItem: function(obj, type) {
            var html, newHtml, element;
            //Create html string with placeholder text
            if(type === 'inc') {
                element = DOMStrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }
            else if(type === 'exp') {
                element = DOMStrings.expenseContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }   
            
            //Replace the placeholder text with original data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type) );

            //Insert html into the DOM
            document.querySelector(element).insertAdjacentHTML("beforeend", newHtml);
            

        },

        deleteListItem: function(selectorID) {
            var element;
            element = document.getElementById(selectorID);
            element.parentNode.removeChild(element);
        },

        clearFields: function() {
            var fields, fieldsArr;
            fields = document.querySelectorAll(DOMStrings.inputDescription+', '+DOMStrings.inputAmount);
            fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach( function(current, index, array) {
                current.value = "";
            });

            fieldsArr[0].focus();
        },

        displayBudget: function(budgetObj) {
            var type;
            budgetObj.budget >=0 ? type = 'inc' : type = 'exp';
            document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(budgetObj.budget, type);
            document.querySelector(DOMStrings.incomeLabel).textContent = formatNumber(budgetObj.totalInc, type);
            document.querySelector(DOMStrings.expensesLabel).textContent = formatNumber(budgetObj.totalExp, type) ;
            if (budgetObj.percentage > 0) {
                document.querySelector(DOMStrings.percentageLabel).textContent = budgetObj.percentage + '%';
            }
            else {
                document.querySelector(DOMStrings.percentageLabel).textContent = '--';
            }
        },

        displayPercentages: function(percentages) {
            var fields = document.querySelectorAll(DOMStrings.expensesPercLabel);

            nodeListForEach(fields, function(current, index) {
                if( percentages[index] > 0) {
                    current.textContent = percentages[index] + '%';
                } else {
                    current.textContent = '--';
                }
            })
        },

        displayDate: function() {
            var now, months;
        
            now = new Date();
            months = ['January','February','March','April','May','June','July','August','September','October','November','December']
            document.querySelector(DOMStrings.monthLabel).textContent = months[now.getMonth()] + ', ' + now.getFullYear();
        
        },

        changedType: function() {
            var fields;
            fields = document.querySelectorAll(
                DOMStrings.inputType + ',' +
                DOMStrings.inputDescription + ',' +
                DOMStrings.inputAmount 
            )

            nodeListForEach(fields, function(current) {
                current.classList.toggle('red-focus')
            })

            document.querySelector(DOMStrings.inputButton).classList.toggle('red')

        },

        getDOMStrings: function() {
            return DOMStrings;
        }

    }

})();


//GLOBAL APP CONTROLLER
var controller = (function(budgetCrtl, UICtrl) {

    function setUpEventListeners() {
        var DOM = UIController.getDOMStrings();

        document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem )  
        document.addEventListener('keypress', function(event) {
            if(event.keyCode === 13 || event.which === 13) {
                ctrlAddItem()
            }
        })
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem );
        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);
    }
    
    function updateBudget() {
        //1.Calculate the budget
        budgetCrtl.calculateBudget();

        //2.Return Budget
        var budget = budgetCrtl.getBudget();

        //3.Display the budget to UI
        // console.log(budget);
        UICtrl.displayBudget(budget);


    }

    function updatePercentages() {
        //1. Calculate percentages
        budgetCrtl.calculatePercentages();

        //2. Read percentages from budget controller
        var percentages = budgetCrtl.getPercentages();
        console.log(percentages)

        //3. Display percentages to the UI
        UICtrl.displayPercentages(percentages);

    }

    function ctrlAddItem() {
        var input, newItem;

        //1.Get field input data
        var input = UIController.getInput();
        // console.log(budgetCrtl.displayData())
        
        
        if ( input.desc != "" && !isNaN(input.amount) && input.amount > 0) {
            console.log(input);
            
            //2.Add item to the budget controller
            var newItem = budgetCrtl.addItem(input.type, input.desc, input.amount);

            //3.Display item to UI(Income/Expenses)
            UICtrl.addListItem(newItem, input.type);

            //For clearing fields
            UICtrl.clearFields();

            //Calculate and update budget
            updateBudget();

            //Calculate and update percentages
            updatePercentages();
        }
    }

    function ctrlDeleteItem(event) {
        var itemID, splitID, type, ID;

        // console.log(event.target) //log the element in container which is clicked
        console.log(event.target.parentNode.parentNode.parentNode.parentNode.id)
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if  ( itemID ) {
            //inc-0
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt( splitID[1] );

            //1. Delete the item from the data structure
            budgetCrtl.deleteItem(type, ID);

            //2. Delete the item from UI
            UICtrl.deleteListItem(itemID);

            //3. Update and show the new object
            updateBudget();

            //4. Calculate and update percentages
            updatePercentages();
        }

    }

    //Public initialisation functions
    return {
        init: function() {
            console.log('Application has started.')
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            })
            UICtrl.displayDate();
            setUpEventListeners()
        }
    }

})(budgetController, UIController);

controller.init();

