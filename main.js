var app = document.querySelector('#app'); //是一個ID 只能被使用一次 JS API HTML
var operator = '';
var info = '0';
var onSecondInput = false;
var firstNumber = 0;

function createLayout () { //創一個class在monitior下
    const numberButtonContainer = document.createElement('div');
    const operatorButtonContainer = document.createElement('div');
    const otherButtonContainer = document.createElement('div');  //other創div

    numberButtonContainer.classList.add('numberButtonContainer');
    operatorButtonContainer.classList.add('operatorButtonContainer');
    otherButtonContainer.classList.add('otherButtonContainer'); //other創class 可以被使用很多次

    app.appendChild(numberButtonContainer);
    app.appendChild(operatorButtonContainer);
    app.appendChild(otherButtonContainer); //將DOM放到app之下

    return {
        numberButtonContainer,
        operatorButtonContainer,
        otherButtonContainer,
    }
}

function Monitor(){
    const monitor = document.createElement('div');
    monitor.id = 'monitor';

    function install () {
        monitor.innerHTML = info;
        app.appendChild(monitor);
        // return 1;
    }

    function render () { //顯示info在螢幕
        monitor.innerHTML = info;
    }

    function input (text) {
        text = text.toString();
        if (text === '.') {
            if (info.includes('.') === false) {
                info = info + text;                
            } 
        } else if (info === '0') {
            info = text;
        } else { 
            info = info + text;
        }
        // console.log(info);
        render();
    }

    function clean () {
        info = '0';
        render();
    }
    
    return {
        install: install,
        input: input,
        clean: clean,
        render: render,
    };

}

function Button () {
    const operators = ['÷', 'x', '-', '+'];
    const numbers = ['7', '8', '9', '4', '5', '6', '1', '2', '3', '0','.']; 

    function isOperator (text) { // 符號判斷式
        return operators.includes(text);    //是符號就回傳ture
    }
    function isNumber (text) { // 數字判斷式
        return numbers.includes(text);
    }

    function getPow (number) { //解決js乘除問題
        var numberString = number.toString();
        if (numberString.includes('.') === false) {
            return 1;  //如果整數就就會傳1
        }
        var digitAfterDot = numberString.length - 1 - numberString.indexOf('.'); //找出小數點後面有幾位
        var pow = Math.pow(10, digitAfterDot); //pow變成10的次方
        console.log(pow, number);
        return  pow;
        
    }

    function showResult () { 
        var secondNumber = Number(info);
        var result = 0;
        if (operator ==='+') {
            result = firstNumber + secondNumber;
        } else if (operator === '-') {
            result = firstNumber - secondNumber;
        } else if (operator === 'x') {
            var pow1 = getPow(firstNumber); //宣告pow1替代getPow
            var pow2 = getPow(secondNumber);
            // var firstString = firstNumber.toString();
            // var digitAfterDot1 = firstString.length - 1 - firstString.indexOf('.');
            // var pow1 = Math.pow(10,digitAfterDot1);
            // var secondString = secondNumber.toString();
            // var digitAfterDot2 = secondString.length - 1 - secondString.indexOf('.');
            // var pow2 = Math.pow(10,digitAfterDot2);
            // console.log(digitAfterDot1, digitAfterDot2);
            firstNumber = firstNumber * pow1;
            secondNumber = secondNumber * pow2;
            //小數變整數
            result = firstNumber * secondNumber / pow1 / pow2;
        } else if (operator === '÷') {
            var pow1 = getPow(firstNumber);
            var pow2 = getPow(secondNumber);
            var powMax = Math.max(pow1, pow2);
            // var powMax = (pow1 > pow2) ? pow1 : pow2;
            firstNumber = firstNumber * powMax;
            secondNumber = secondNumber * powMax;    
            console.log(pow1, pow2, firstNumber, secondNumber);    
            result = firstNumber / secondNumber;
        }

        monitor.clean();
        monitor.input(result); //monitor.input(result.toString());
        console.log(firstNumber, operator, secondNumber, '=', result);
        // 準備下一次運算環境
        onSecondInput = false;
    }

    function createButton (text) {
        const button = document.createElement('button');
        var parent = app;
        // button.id = 'button_' + text; //創造HTML的id 
        button.classList.add('button');
        button.classList.add('button' + text);

        if (isNumber(text) || text === '.'){
            button.classList.add('gray');
            parent = containers.numberButtonContainer;
        } 
        if (isOperator(text) || text === '=') {
            button.classList.add('orange');
            parent = containers.operatorButtonContainer;
        }
        if (text === 'AC' || text === 'C' || text === '+/-') {
            button.classList.add('white');
            parent = containers.otherButtonContainer;
        }
        const inputText = () => {
            monitor2.input('按下按鈕:' + text);

            if (text === 'AC') {
                operator = '';
                onSecondInput = false;
                firstNumber = 0;
                monitor.clean();
            } else if (text === 'C') {
                monitor.clean();
            } else if (text ==='+/-') {
                var infoNumber = Number(info);
                var isPositive = infoNumber > 0; 
                if (isPositive) {
                    info = '-' + info;
                } else {
                    console.log(info);
                    info = info.slice(1); //第1個留下 開頭是0
                }
                monitor.render();
            } else if (text === '<-') {
                if (info.length === 1) {
                    info = '0';
                } else {
                    info = info.slice(0, info.length - 1); //backspace 從第0個開始算到字串長度-1 都留下
                }
                monitor.render();
            } else if (isOperator(text)) { //operator判斷
                if (operator !== '' && onSecondInput === true) {
                    showResult();
                }
                operator = text; //text取代operator
            } else if (isNumber(text)) {  //num判斷
                if (operator !== '') {  // second input
                    if (onSecondInput === false) {
                        firstNumber = Number(info);  //轉換成數字
                        monitor.clean();
                        onSecondInput = true; 
                         //firstnum save
                    }
                    monitor.input(text);  //send input number
                } else { // first input
                    monitor.input(text);
                }
            } else if (text === '=' && operator !== '' && onSecondInput === true) {  //&& all ture
               showResult();
            }

            const data = {
                operator,
                info,
                onSecondInput,
                firstNumber,
            };
            const dataString = JSON.stringify(data); //數據轉字串
            monitor2.input(dataString);

            if (text === 'Clean log') {
                monitor2.clean();
            }
        };

        
        button.innerHTML = text;
        button.onclick = inputText;
        parent.appendChild(button); //parent取代app
    }
    // create buttons
    function install () {
        var arr = [
            ...numbers,
            ...operators,
            '=', 'AC', 'C','+/-',
            //'Clean log' 
            //'<-'
        ];
        console.log(arr);
            //為createButton
        arr.forEach(createButton);
        // return '123'
    }
    return {
        install: install,
    };
}

function Monitor2 (){
    var info = '';
    const monitor = document.createElement('div');
    monitor.id = 'monitor2';
    function install () {
        monitor.innerHTML = info;
        app.appendChild(monitor);
        // return 1;
    }
    
    function render () {
        monitor.innerHTML = info;
    }

    function input (text) {
        info = text + '<br>' + info;
        // console.log(info);
        render();
    }

    function clean () {
        info = '0';
        render();
    }
    
    return {
        install: install,
        input: input,
        clean: clean,
        render: render,
    };

}

var button = Button();
var monitor = Monitor();
var monitor2 = Monitor2();
monitor.install();
var containers = createLayout();
button.install();
monitor2.install();



