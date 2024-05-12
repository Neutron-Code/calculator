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
let finalClicked = false;



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
        this.crntScreen.style.color = 'rgb(203 203 203)';
        this.prevScreen.style.color = ''


        operatorTracker = [];
        validationArray = [];
        preZeroAddedString , postZeroAddedString = '';
        openParenthesisCount = 0;
        document.querySelector('#invalid').classList.remove('invalidOpacity');
        finalClicked = false;
        previousScreen.textContent = '0'
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
            finalClicked = false;
            document.querySelector('#invalid').classList.remove('invalidOpacity');
        }

        if(this.transitionTrigger.length <= 10){
            this.crntScreen.classList.replace("text-2xl", "text-4xl");
            this.crntScreen.classList.replace("sm:text-2xl", "sm:text-4xl");
        }
    }



    appendNumber(number){
        if(finalClicked){
            this.currentText = '';
            this.maximumCount = [];
            this.transitionTrigger = [];
            finalClicked = false;
        }

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
        
        if(finalClicked){
            this.currentText = this.crntScreen.textContent + operation;
            this.transitionTrigger = [];
            finalClicked = false;
        }else{
            this.currentText = initializer ? 
            (postZeroAddedString) : 
            (this.currentText.toString()) + operation.toString();
        }
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
        calculator.updateEntries(button.children[0].innerText)
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

    const regex = /\b(\d{1,3}(,\d{3})*(\.\d+)?)\b/g
    let result = currentScreen.textContent.replace(regex, function(match, p1) {
        return p1.replace(/,/g, '');
    });
    const answer = evaluateExpression(result);

    if(answer){
        previousScreen.classList.replace('opacity-0', 'opacity-100')
        previousScreen.innerHTML = answer;
    }else{
        previousScreen.classList.add('opacity-0');
    };
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

    if(!isNaN(e.key) || e.key === '-+×÷%'.includes(e.key)){
        const regex = /\b(\d{1,3}(,\d{3})*(\.\d+)?)\b/g
        let result = currentScreen.textContent.replace(regex, function(match, p1) {
            return p1.replace(/,/g, '');
        });
        const answer = evaluateExpression(result);

        if(answer){
            previousScreen.classList.replace('opacity-0', 'opacity-100')
            previousScreen.innerHTML = answer;
        }else{
            previousScreen.classList.add('opacity-0');
        };
    }
    
})

//Evaluation OF Answer;
function evaluateExpression(expression) {
    const precedence = {
        '+': 1,
        '-': 1,
        '×': 2,
        '÷': 2,
        '%': 2,
        '(': 0
    };

    const operators = [];
    const operands = [0];

    function applyOperator() {
        const operator = operators.pop();
        const b = operands.pop();
        const a = operands.pop();

        switch (operator) {
            case '+':
                operands.push(a + b);
                break;
            case '-':
                operands.push(a - b);
                break;
            case '×':
                operands.push(a * b);
                break;
            case '÷':
                operands.push(a / b);
                break;

            case '%':
                operands.push(b / 100);
                break;
        }
    }

    const tokens = expression.match(/\d+(\.\d+)?|\+|\-|\×|\÷|\%|\(|\)/g);

    for (const token of tokens) {
        if (!isNaN(token)) {
            operands.push(parseFloat(token));
        } else if (token === '(') {
            operators.push(token);
        } else if (token === ')') {
            while (operators.length && operators[operators.length - 1] !== '(') {
                applyOperator();
            }
            operators.pop();
        } else {
            while (operators.length && precedence[operators[operators.length - 1]] >= precedence[token]) {
                applyOperator();
            }
            operators.push(token);
        }
    }

    while (operators.length) {
        applyOperator();
    }

    return operands.pop();
}


const allElems = document.querySelectorAll("[data-operator], [data-number], [data-percentage], [data-parenthesis]");
allElems.forEach(elem => {
    elem.addEventListener('click', () => {
        currentScreen.style.color = 'rgb(203 203 203)';
        const regex = /\b(\d{1,3}(,\d{3})*(\.\d+)?)\b/g
        let result = currentScreen.textContent.replace(regex, function(match, p1) {
            return p1.replace(/,/g, '');
        });
        const answer = evaluateExpression(result);

        if(!(isNaN(answer)) || answer === 0){
            previousScreen.classList.replace('opacity-0', 'opacity-100')
            previousScreen.innerHTML = answer;
        }else if(isNaN(answer)){
            previousScreen.classList.add('opacity-0');
            previousScreen.textContent = '0'
            previousScreen.classList.replace('opacity-100', 'opacity-0');
        };
    })
})

// Equal Button
const finalAnswerDisplay = () => {
    if('+-%×÷'.includes(currentScreen.textContent.slice(-1))) return;

    if(previousScreen.textContent !== '' || previousScreen.textContent === '0'){
        currentScreen.classList.replace('opacity-100', 'opacity-0');
        previousScreen.classList.add('upAnimate');
        currentScreen.style.color = 'rgb(67 214 54)';
        previousScreen.classList.replace('text-2xl', 'text-4xl')
        currentScreen.textContent = previousScreen.textContent

        previousScreen.addEventListener('transitionend', () => {
            previousScreen.classList.remove('upAnimate');
            previousScreen.classList.replace('text-4xl', 'text-2xl');
            previousScreen.textContent = '0';
            previousScreen.classList.replace('opacity-100', 'opacity-0')
            currentScreen.classList.replace('opacity-0', 'opacity-100');
        })
    }

    finalClicked = true;
}

equalBtn.addEventListener('click', () => {
    vibrationOnClick();
    finalAnswerDisplay();
})

//Animation Initialization 
numbers.forEach(value => {
    value.addEventListener('click', () => {
        value.children[0].classList.add('numberTextScaleAnimation')
    })
})

operators.forEach(value => {
    value.addEventListener('click', e => {
        value.children[0].classList.add('operatorTextScaleAnimation')
    })
})


// Numbers Animation
numbers.forEach(value => {
    value.addEventListener('touchstart', e => {
        value.style.backgroundColor = '#444444'
    })
});

numbers.forEach(value => {
    value.addEventListener('touchend', e => {
        value.children[0].classList.remove('numberTextScaleAnimation')
        value.style.backgroundColor = '#1a1a1a'
    })
})



// Operators Animation
operators.forEach(elem => {
    elem.addEventListener('touchstart', e => {
        elem.style.backgroundColor = '#1a1a1a';
    })
})

operators.forEach(elem => {
    elem.addEventListener('touchend', e => {
        elem.children[0].classList.remove('operatorTextScaleAnimation')
        elem.style.backgroundColor = '#303030';
    })
})



// Clear All Animation

clearAllBtn.addEventListener('click', e => {
    clearAllBtn.children[0].classList.add('numberTextScaleAnimation');
})

clearAllBtn.addEventListener('touchstart', e => {
    clearAllBtn.style.backgroundColor = '#1a1a1a';
})

clearAllBtn.addEventListener('touchend', e => {
    clearAllBtn.children[0].classList.remove('numberTextScaleAnimation');
    clearAllBtn.style.backgroundColor = '#303030';
})