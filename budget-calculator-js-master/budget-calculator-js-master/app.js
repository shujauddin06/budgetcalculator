// there are three modules n=in this js application
// 1) budgetcontoller = which handle the databse and stuff which are workign at the back side of the screen
// 2) uicontroller = this handles the changes at the user interface
// controller = this module controls the budgetcontoller and ui controller


// data base controller 
let budgetcontroller = (function () {

    // function constructor which creates expense object
    let Expenses = function (id, description, value) { 
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1 ;
    }
    // a calculater which calculates the percentage of the  expense list 
    Expenses.prototype.calcPercentage = function(totalinc){
        if(totalinc > 0){
          this.percentage =  Math.round((this.value / totalinc ) * 100 ) 
        }else{
            this.percentage = -1
        }
    }
    // a prototype which provites only the percentage of the object expenses
    Expenses.prototype.getPercentage = function (){
        return this.percentage
    }

    // function constructor which creates income object
    let incomes = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    } //here we are not usign the percentage because we dont need a percentage in the income list

    // the calculater which calculates the total income and expense in the header section
    let calculatetotal = function (type) { // depending on it's type
        let sum = 0; // this sum varibel stores the value which comes back from the forEach loop
        data.allitems[type].forEach(function (currentitem) {
            sum += currentitem.value;
        })
        data.total[type] = sum
    }
//  actual data base of the project
    let data = {
        // this stores the list item and this is stored in object formet in the data.allitems.exp or inc
        allitems: {
            exp: [],
            inc: []
        },
        // this stores the total income and expense and budget = total.inc - total exp and this percentage represents the total expense percentage

        total: {
            exp: 0,
            inc: 0,
            budget: 0,
            percentage: -1
        }
    }
//  all the above part of this function was a private part cannot be accessible by the outter funciton but the data stored in this return object can be grabed bye the outter function
    return {
        // addItem added the data  to the database (variable data)
        addItem: function (type, des, vlu) { // grabbing the parametes of the input fealds
            let newItem, id;

            if (data.allitems[type].length > 0) {
                id = data.allitems[type][data.allitems[type].length - 1].id + 1; // creating id for each list item in feature going to update this id with uuid

            } else {
                id = 0
            }
            // if the type is expense the crate a object of expense with the function constructur created above in budgetcontroller module
            if (type === 'exp') {
                newItem = new Expenses(id, des, vlu)
            } else if (type === 'inc') {
                newItem = new incomes(id, des, vlu)
            }
            // after creating object push it to the data base depending on its type
            data.allitems[type].push(newItem);
            return newItem;
        // and this functions just returns the varible newItem which stored the object created depending on its type
        },
        // this funciton calculates the header total budget and total income and total expense and the percentage of the total expense
        calculatebudget: function () {

            calculatetotal('inc'); // this calculates the total income by a function created above
            calculatetotal('exp')// this calculates the total expense by a function created above
            //calculates the header budget
            data.total.budget = data.total.inc - data.total.exp
            // calculates the total expense percentage
            if (data.total.budget > 0) {
                data.total.persantage = Math.round((data.total.exp / data.total.inc * 100))

            } else {
                data.total.persantage = -1
            }

        },
        // calculated the percentage of expense list by a function created above
        calcPercentage: function(){
            
            data.allitems.exp.forEach(function(currentitem){
                currentitem.calcPercentage(data.total.inc) // calcpercentage is a prototype of object expense stored in data.allitems.exp[{object}]
            })

        },
        // this returs just the percentage of all expnse list item
        getPercentage:function(){
            let allpercentage = data.allitems.exp.map(function(currentitem){
                return currentitem.getPercentage(); // getPErcentage is a prototype object 
            })
            return allpercentage // returns the percentages array of expenses list item
        },
        //  this return the header data to get used by the outer funciton
        getbudget: function () {
            return {
                budget: data.total.budget,
                totalinc: data.total.inc,
                totalexp: data.total.exp,
                persantage: data.total.persantage
            }
        },
        // deletign hole object usgin its id in data base
        deleteItem: function (type, id) {
            let ids, index

            ids = data.allitems[type].map(function (currentitem) {
                return currentitem.id
            }) // using map it gives the id of the selected item in a array exp : [0,1,2]

            index = ids.indexOf(id) // it findes the id index number in the array created above ids
            if (index !== -1) {
                data.allitems[type].splice(index, 1); // splice just cut the item at the index number provited in the index varible and 1 represents how menty objects should be spliced
            }
        },
        // view is just to see the data base in the console
        view: function () {
            console.log(data);

        }
    }



})(); // therse types of functions are called iifi function 


// user interface controller
let uicontroller = (function () {
// all the dom classes used in the javascript section
    let domstring = {
        inputtype: '.add__type',
        inputdescription: '.add__description',
        inputvalue: '.add__value',
        inputbtn: '.add__btn',
        appendIncome: '.income__list',
        appendExpense: '.expenses__list',
        headerbudget: '.budget__value',
        headerIncome: '.budget__income--value',
        headerExpenses: '.budget__expenses--value',
        headerpersantage: '.budget__expenses--percentage',
        deletecontainer: '.container',
        expensepercentage:'.item__percentage',
        day:'.budget__title--month'
    }
        // formating the all the  numbers  numbers in the application
        let formateNumber = function (num , type){
            num = Math.abs(num); // abs removes the + - sign from the number exp : input = -1 , output = 1
            num = num.toFixed(2); // toFixed is a number method which creates tow decimal poins and round it exp : input= 20 , output = 20.00 ; input = 20.23668 , output = 20.24
            numSplit = num.split('.'); // this splites the number by '.' and crates array exp : input 20.24 , output = [20,24]
             let frontnum = numSplit[0];
            if(frontnum.length > 3){ // adding , in the numsplit[0] here 0 is the index number of array
                frontnum = frontnum.substr(0,frontnum.length - 3)+ ',' + frontnum.substr(frontnum.length - 3 , 3); // substr just cuts the number first parameter is the starting point and secont is the endign point 
            }

            let secondnum = numSplit[1];
            return (type === 'exp' ? '-' : '+') +  ' ' + frontnum + '.' + secondnum ; // here im using ternary if else to provide - + sign for its type
        }

//  public objects accesseible by the outer function
    return {
        // this takes the dom input values and return it in a object like {type:inputtype ext}
        getinput: function () {
            return {
                type: document.querySelector(domstring.inputtype).value,
                description: document.querySelector(domstring.inputdescription).value,
                value: parseFloat(document.querySelector(domstring.inputvalue).value) // parseFloat converts the string into number acutially we are getting the number in a string formet 
            }
        },
        // adding new item with  hard codded html 
        addNewItem: function (obj, type) {
            let html, newhtml, element
            if (type === 'inc') {
                element = domstring.appendIncome;
                html = '<div class="item clearfix" id="inc-%ID%"><div class="item__description">%DESCRIPTION%</div><div class="right clearfix"><div class="item__value">%VALUE%</div><div class="item__delete"><button class="item__delete--btn"><i class="far fa-times-circle"></i></i></button></div></div></div>'
            } else if (type === 'exp') {
                element = domstring.appendExpense;
                html = '<div class="item clearfix" id="exp-%ID%"><div class="item__description">%DESCRIPTION%</div><div class="right clearfix"><div class="item__value">%VALUE%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="far fa-times-circle"></i></i></button></div></div></div>'

            }
            // replacing id in hard codded html with the id of teh obj>id
            newhtml = html.replace('%ID%', obj.id); // now to updated id is stored in newhtml variable
            newhtml = newhtml.replace('%DESCRIPTION%', obj.description); //im using newhtml instade of html because i want to use updatedhtml > newhtml
            newhtml = newhtml.replace('%VALUE%', formateNumber( obj.value,type )); //im using newhtml instade of html because i want to use updatedhtml > newhtml

            document.querySelector(element).insertAdjacentHTML('beforeend', newhtml) // appendign child here elemnt is nothing but a div where im appent this newhtml variabel with hard codded html 
        },
        deleteItemUi: function (selectId) {
            ;


            let el = document.querySelector('#' + selectId)
            el.parentNode.removeChild(el);
        },
        clearfeald: function () {

            fealds = document.querySelectorAll(domstring.inputdescription + ', ' + domstring.inputvalue);

            fealdsArray = Array.prototype.slice.call(fealds);

            fealdsArray.forEach(function (currentitem, intex, array) {
                currentitem.value = ''
            })
            fealdsArray[0].focus();



        },
        budgetui: function (obj) {
            let type;
            obj.budget > 0 ? type = 'inc' : type = 'exp';

            document.querySelector(domstring.headerbudget).textContent = formateNumber(obj.budget,type);
            document.querySelector(domstring.headerIncome).textContent = formateNumber(obj.totalinc,'inc');
            document.querySelector(domstring.headerExpenses).textContent = formateNumber(obj.totalexp,'exp');
            if (obj.totalinc > 0) {
                document.querySelector(domstring.headerpersantage).textContent = obj.persantage + ' %';
            } else {
                document.querySelector(domstring.headerpersantage).textContent = '---'
            }


        },
        displaypercentages:function(percentage){
            let html = document.querySelectorAll(domstring.expensepercentage);
            let listForEach = function(list , callback){
                for(let i = 0 ; i < list.length ; i++){
                    callback(list[i],i)
                }
            }
            listForEach(html,function(currentitem,index){
                if(percentage[index] > 0){
                    currentitem.textContent = percentage[index]+'%';
                }else{
                    currentitem.textContent = '---'
                }
            })
           
        },
        displayDay:function(){
            let now , year , monthIndex , months ;
            
            now = new Date();
            year = now.getFullYear();
            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            monthIndex = now.getMonth();
        
                document.querySelector(domstring.day).textContent = months[monthIndex] +' '+ year ;
        },
        changeType : function(){
                
            let html = document.querySelectorAll(domstring.inputtype + ',' + domstring.inputdescription + ',' + domstring.inputvalue);
            let listForEach = function(list , callback){
                for(let i = 0 ; i < list.length ; i++){
                    callback(list[i],i)
                }
            }
            listForEach(html , function(currentitem){
                currentitem.classList.toggle('red-focus')
            });
            document.querySelector(domstring.inputbtn).classList.toggle('red')
        },

        dominput: function () {
            return domstring;
        }
    }



})();

let controller = (function (bdtctl, uictl) {


    let updatebudget = function () {

        //calculate budget
        budgetcontroller.calculatebudget();
        //return budget
        let budgets = budgetcontroller.getbudget();
        //ui update
        uictl.budgetui(budgets)



    }
    let updatePercentages = function(){
        // calculate percentage 
            bdtctl.calcPercentage();
        //get percentages
           let allpercentage =  bdtctl.getPercentage();
        // update ui with percentage
        uictl.displaypercentages(allpercentage)
        
        
    }
    let cntAddItem = function () {
        let input = uictl.getinput();

        if (input.description !== "" && input.value > 0) {
            let newitem = budgetcontroller.addItem(input.type, input.description, input.value);
            uictl.addNewItem(newitem, input.type);
            uictl.clearfeald();
            updatebudget();
            updatePercentages();
        }

    }

    let seteventlistener = function () {
        let dom = uictl.dominput();

        document.querySelector(dom.inputbtn).addEventListener('click', cntAddItem);

        document.addEventListener('keypress', function (e) {
            if (e.keyCode === 13) {
                cntAddItem()
            }
        })
        document.querySelector(dom.deletecontainer).addEventListener('click', cntDeleteItem);
        document.querySelector(dom.inputtype).addEventListener('change', uictl.changeType);
    }


    let cntDeleteItem = function (event) {

        let item = event.target.parentNode.parentNode.parentNode.parentNode.id
        if (item) {
            splitId = item.split('-')
            type = splitId[0];
            ID = parseInt(splitId[1])
            bdtctl.deleteItem(type, ID);
            uictl.deleteItemUi(item);



            updatebudget();
            updatePercentages();
        }


    }


    return {
        init: function () {
            console.log('application is started');
            seteventlistener();
            
            uictl.displayDay();

        }
    }


})(budgetcontroller, uicontroller);


controller.init(); 