class Calculator {
    constructor() {
        this.displayValue = '0';
        this.history = [];
        this.waitingForSecondOperand = false;
        this.operator = null;
        this.firstOperand = null;
        
        this.display = document.getElementById('display');
        this.historyDisplay = document.getElementById('history');
        
        this.init();
    }

    init() {
        document.querySelector('.keypad').addEventListener('click', (e) => {
            const target = e.target;
            if (!target.matches('button')) return;

            if (target.classList.contains('num')) {
                this.inputDigit(target.dataset.num);
            } else if (target.classList.contains('op')) {
                this.handleOperator(target.dataset.action);
            } else if (target.classList.contains('sci')) {
                this.handleScientific(target.dataset.action);
            } else if (target.classList.contains('action')) {
                this.handleAction(target.dataset.action);
            } else if (target.classList.contains('equals')) {
                this.calculate();
            }
            
            this.updateDisplay();
        });
    }

    inputDigit(digit) {
        if (this.waitingForSecondOperand) {
            this.displayValue = digit;
            this.waitingForSecondOperand = false;
        } else {
            this.displayValue = this.displayValue === '0' ? digit : this.displayValue + digit;
        }
    }

    handleOperator(nextOperator) {
        const inputValue = parseFloat(this.displayValue);

        if (this.operator && this.waitingForSecondOperand) {
            this.operator = nextOperator;
            return;
        }

        if (this.firstOperand == null && !isNaN(inputValue)) {
            this.firstOperand = inputValue;
        } else if (this.operator) {
            const result = this.performCalculation(this.operator, this.firstOperand, inputValue);
            this.displayValue = String(result);
            this.firstOperand = result;
        }

        this.waitingForSecondOperand = true;
        this.operator = nextOperator;
    }

    performCalculation(operator, first, second) {
        switch (operator) {
            case '+': return first + second;
            case '-': return first - second;
            case '*': return first * second;
            case '/': return second === 0 ? 'Error' : first / second;
            case '%': return first % second;
            case 'pow': return Math.pow(first, second);
            default: return second;
        }
    }

    handleScientific(action) {
        let value = parseFloat(this.displayValue);
        let result = 0;

        switch (action) {
            case 'sin': result = Math.sin(this.toRadians(value)); break;
            case 'cos': result = Math.cos(this.toRadians(value)); break;
            case 'tan': result = Math.tan(this.toRadians(value)); break;
            case 'log': result = Math.log10(value); break;
            case 'ln': result = Math.log(value); break;
            case 'sqrt': result = Math.sqrt(value); break;
            case 'fact': result = this.factorial(value); break;
            case '(': 
                // Simple parenthesis handling not fully implemented in this basic version
                // For a full parser, we'd need a more complex stack-based approach.
                // For now, we'll treat it as a visual placeholder or advanced feature TODO.
                console.log('Parenthesis support coming soon');
                return;
            case ')':
                return;
            case 'pow':
                this.handleOperator('pow');
                return;
        }

        this.displayValue = String(result);
        this.waitingForSecondOperand = true;
        this.addToHistory(`${action}(${value}) = ${result}`);
    }

    handleAction(action) {
        if (action === 'clear') {
            this.displayValue = '0';
            this.firstOperand = null;
            this.waitingForSecondOperand = false;
            this.operator = null;
        } else if (action === 'delete') {
            this.displayValue = this.displayValue.slice(0, -1) || '0';
        }
    }

    calculate() {
        if (this.operator === null) return;

        const inputValue = parseFloat(this.displayValue);
        const result = this.performCalculation(this.operator, this.firstOperand, inputValue);
        
        this.addToHistory(`${this.firstOperand} ${this.operator} ${inputValue} = ${result}`);
        
        this.displayValue = String(result);
        this.firstOperand = null;
        this.operator = null;
        this.waitingForSecondOperand = true;
    }

    updateDisplay() {
        this.display.innerText = this.displayValue;
    }

    addToHistory(entry) {
        this.history.push(entry);
        if (this.history.length > 3) this.history.shift();
        this.historyDisplay.innerText = this.history.length > 0 ? this.history[this.history.length - 1] : '';
    }

    toRadians(angle) {
        return angle * (Math.PI / 180);
    }

    factorial(n) {
        if (n < 0) return -1;
        if (n == 0) return 1;
        return n * this.factorial(n - 1);
    }
}

const calculator = new Calculator();
