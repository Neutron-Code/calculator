"use strict";

const previousScreen = document.querySelector("#p_screen");
const currentScreen = document.querySelector("#c_screen");
const numbers = document.querySelectorAll("[data-number]");
const operators = document.querySelectorAll("[data-operator], [data-percentage]");
const parenthesis = document.querySelector('[data-parenthesis]');
const clearAllBtn = document.querySelector("[data-clearAll]");
const deleteBtn = document.querySelector("[data-delete]");
const equalBtn = document.querySelector("[data-equal]");
const operatorsCheck = {"×": "×", "+": "+", "-": "-", "%": "%", "÷":"÷"}
const appendOperatorCheck = {"*": "×", "+": "+", "-": "-", "%": "%", "/":"÷"}
let validationArray = [], preZeroAddedString, postZeroAddedString;
let openParenthesisCount = 0;
let operatorTracker = [];
let initializer = false;



class Calculator{
    constructor(prevScreen, crntScreen, transitionTrigger, maximumCount, elementCount){
        this.prevScreen = prevScreen;
        this.crntScreen = crntScreen;
        this.transitionTrigger = transitionTrigger;
        this.maximumCount = maximumCount
        this.elementCount = elementCount;
        this.clearAll();
    }

    clearAll(){
        this.prevText = '0';
        this.currentText = '0';
        this.maximumCount = [];
        this.transitionTrigger = [];
        this.crntScreen.classList.replace("text-2xl", "text-4xl");
        this.crntScreen.classList.replace("sm:text-2xl", "sm:text-4xl");


        operatorTracker = [];
        validationArray = [];
        preZeroAddedString , postZeroAddedString = '';
        openParenthesisCount = 0;
        document.querySelector('#invalid').classList.remove('invalidOpacity');
    }



    delete(){
        this.currentText = this.currentText.slice(0, -1);
        this.transitionTrigger.pop();
        this.maximumCount.pop();
        operatorTracker.pop();
        if(this.currentText.length < 1){
            this.currentText = '0';
            operatorTracker = [];
            validationArray = [];
            this.maximumCount = [];
            openParenthesisCount = 0;
            document.querySelector('#invalid').classList.remove('invalidOpacity');
        }

        if(this.transitionTrigger.length <= 10){
            this.crntScreen.classList.replace("text-2xl", "text-4xl");
            this.crntScreen.classList.replace("sm:text-2xl", "sm:text-4xl");
        }
    }



    appendNumber(number){
        const { transitionTrigger, crntScreen, maximumCount } = this;
        operatorTracker = [];
        if(transitionTrigger.length >= 10){
            crntScreen.classList.replace("text-4xl", "text-2xl");
            crntScreen.classList.replace("sm:text-4xl", "sm:text-2xl");
        }
        if(maximumCount.length >= 15) return;

        if(this.currentText === '0') this.currentText = '';
        this.currentText = this.currentText.toString() + number.toString();

        if(validationArray[0] === '.'){
            validationArray.unshift('0')
            preZeroAddedString = `${this.currentText.slice(0, -1)}0${this.currentText.slice(-1)}`
            this.currentText = preZeroAddedString;
        }
    }



    appendOperation(operation){
        if(operatorTracker.length > 1){
            this.currentText = this.currentText.slice(0, -1) + operation[0];
            return;
        };
        
        this.maximumCount = [];
        
        this.currentText = initializer ? 
        (postZeroAddedString) : 
        (this.currentText.toString()) + operation.toString();
        initializer = false;
    }

    addParenthesis(text){
        this.currentText = this.currentText + text;
        this.transitionTrigger.push(text);
        if(this.transitionTrigger.length >= 10){
            this.crntScreen.classList.replace("text-4xl", "text-2xl");
            this.crntScreen.classList.replace("sm:text-4xl", "sm:text-2xl");
        }
    }
    
    updateDisplay(){
        this.crntScreen.innerHTML = formatCalculatorScreen(this.currentText);
    }

    evaluateValue(answer){
        this.crntScreen.innerHTML = answer;
    }

    updateEntries(inputValue){
        if(this.maximumCount.length >= 15) return;
        this.transitionTrigger.push(inputValue);
        this.maximumCount.push(inputValue);
    }
}


// New Calculator object initialized
const calculator = new Calculator(previousScreen, currentScreen, [], [], 0);


// Numbers Event Listener
const numberAppender = (button) => {
    if(validationArray.includes('.') && button.children[0].innerText === '.') return;
    for(let oCheck in operatorsCheck){
        if(validationArray.includes(operatorsCheck[oCheck])){
            validationArray = [];
        }
    }

    if(currentScreen.textContent.slice(-1) === '%'){
        calculator.appendNumber(`×${button.children[0].innerText}`);
        calculator.updateDisplay();
        calculator.updateEntries(button.childre[0].innerText)
    }else{
        validationArray.push(button.children[0].innerText);
        calculator.appendNumber(button.children[0].innerText);
        calculator.updateDisplay();
        calculator.updateEntries(button.children[0].innerText);
    }
    
}



// Operators EventListener
operators.forEach(operator => {
    operator.addEventListener('click', () => {
        vibrationOnClick();
        if(currentScreen.textContent === '0'){
            document.querySelector('#invalid').classList.add('invalidOpacity');
            return;
        }

        if(currentScreen.textContent.slice(-1) === '(' && operator.children[0].innerText === '%'){
            document.querySelector('#invalid').classList.remove('invalidOpacity')
            document.querySelector('#invalid').classList.add('invalidOpacity')
            return;
        }

        if(/[-+×÷%]/.test(currentScreen.textContent.slice(-1))) return
        
        console.log(currentScreen.textContent)
        if(validationArray[validationArray.length - 1] === '.'){
            postZeroAddedString = `${currentScreen.innerText.slice(0)}0${operator.children[0].innerText}`;
            console.log(postZeroAddedString);
            initializer = true;
        };

        if(currentScreen.textContent.slice(-1) === '(' && /[×÷%]/.test(operator.children[0].innerText)){
            document.querySelector('#invalid').classList.replace('hidden', 'block');
            document.querySelector('#invalid').classList.add('invalidOpacity');
            return;
        };

        validationArray.length && !(validationArray.includes(operator.children[0].innerText)) ? validationArray = [] : '';
        operatorTracker.push(operator.children[0].innerText)
        validationArray.push(operator.children[0].innerText);
        calculator.appendOperation(operator.children[0].innerText);
        calculator.updateDisplay();
    })
})

// Clear Button Event Listener
clearAllBtn.addEventListener('click', () => {
    calculator.clearAll();
    calculator.updateDisplay();
})


// Delete Button Event Listener
deleteBtn.addEventListener('click', () => {
    calculator.delete();
    calculator.updateDisplay();
})

//Parenthesis Button Event Listener
parenthesis.addEventListener('click', () => {
    vibrationOnClick()
    if((currentScreen.textContent.includes('(') && /[0-9)]/.test(currentScreen.textContent.slice(-1)))){
        if(!openParenthesisCount) return;
        calculator.addParenthesis(')');
        calculator.updateDisplay();
        openParenthesisCount--;
    }
    
    operatorTracker = [];
    if(/[-+×÷%]/.test(currentScreen.textContent.slice(-1))){
        calculator.addParenthesis('(');
        calculator.updateDisplay();
        openParenthesisCount++;
    }

    
    if(/[0-9]/.test(currentScreen.textContent.slice(-1))){
        calculator.addParenthesis('×(');
        calculator.updateDisplay();
        openParenthesisCount++;
    }
    
    if(currentScreen.textContent.includes('(') && /[-+×÷%]/.test(currentScreen.textContent.slice(-1))){
        calculator.addParenthesis('(');
        calculator.updateDisplay();
        openParenthesisCount++
    }
})

function formatCalculatorScreen(screenText) {
    return screenText.replace(/(\d+(\.\d+)?|[-+×÷%()]?|)/g, function(match) {
        if (/[0-9.]/.test(match)) {
            if (match.includes('.')) {
                let parts = match.split('.');
                return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (parts[1] ? '.' + parts[1] : '');
            } else {
                return match.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            }
        }else {
            return '<span class="operator">' + match + '</span>';
        }
    }); 
}

function vibrationOnClick(){
    if('vibrate' in navigator){
        navigator.vibrate([40,5]);
    }else{
        console.log('Vibration not Supported');
    }
}

// Event Listeners
document.getElementById('imageDisable').addEventListener('contextmenu', (e) => {
    e.preventDefault();
})

//Window Keydown Event Listener
window.addEventListener('keydown', (e) => {
    if(e.key.toLowerCase() === 'Backspace'.toLowerCase()){
        calculator.delete();
        calculator.updateDisplay();
    }
})

// Window Keypresss Event Listener
window.addEventListener('keypress', (e) => {
    if(!isNaN(parseInt(e.key)) || e.key === '.'){
        if(validationArray.includes('.') && e.key === '.') return;
        for(let oCheck in operatorsCheck){
            if(validationArray.includes(operatorsCheck[oCheck])){
                validationArray = [];
            }
        }

        if(currentScreen.textContent.slice(-1) === '%'){
            calculator.appendNumber(`×${e.key}`);
            calculator.updateDisplay();
            calculator.updateEntries(e.key);
        }else{
            validationArray.push(e.key);
            calculator.appendNumber(e.key);
            calculator.updateDisplay();
            calculator.updateEntries(e.key);
        }
    }

    if(e.key === '(' || e.key === ')'){
        if((currentScreen.textContent.includes('(') && /[0-9)]/.test(currentScreen.textContent.slice(-1)))){
            if(!openParenthesisCount) return;
            calculator.addParenthesis(')');
            calculator.updateDisplay();
            openParenthesisCount--;
        }
        
        operatorTracker = [];
        if(/[-+×÷%]/.test(currentScreen.textContent.slice(-1))){
            calculator.addParenthesis('(');
            calculator.updateDisplay();
            openParenthesisCount++;
        }
        
        if(/[0-9]/.test(currentScreen.textContent.slice(-1))){
            calculator.addParenthesis('×(');
            calculator.updateDisplay();
            openParenthesisCount++;
        }
        
        if(currentScreen.textContent.includes('(') && /[-+×÷%]/.test(currentScreen.textContent.slice(-1))){
            calculator.addParenthesis('(');
            calculator.updateDisplay();
            openParenthesisCount++
        }
    }

    for(let operator in appendOperatorCheck){
        if(e.key === operator){
            if(/[-+×÷%]/.test(currentScreen.textContent.slice(-1))) return
            if(validationArray[validationArray.length - 1] === '.'){
                postZeroAddedString = `${currentScreen.innerText.slice(0)}0${appendOperatorCheck[operator]}`;
                console.log(postZeroAddedString);
                initializer = true;
            };
            validationArray.length && !(validationArray.includes(appendOperatorCheck[operator])) ? validationArray = [] : '';
            operatorTracker.push(appendOperatorCheck[operator])
            validationArray.push(appendOperatorCheck[operator]);
            calculator.appendOperation(appendOperatorCheck[operator]);
            calculator.updateDisplay();
        }

        if(currentScreen.textContent.slice(-1) === '(' && e.key === '%'){
            document.querySelector('#invalid').classList.remove('invalidOpacity')
            document.querySelector('#invalid').classList.add('invalidOpacity')
        }
    }
})