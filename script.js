class Calculator {
    constructor() {
        this.expression = '';
        this.result = '0';
        this.lastAnswer = '0';
        this.isHyp = false;
        this.engExponent = 0; // Track ENG exponent
        this.history = [];
        this.isHistoryVisible = false;

        // DOM Elements
        this.expressionEl = document.getElementById('expression');
        this.resultEl = document.getElementById('result');
        this.indHyp = document.getElementById('ind-math');

        // Create History Overlay
        this.historyOverlay = document.createElement('div');
        this.historyOverlay.className = 'history-overlay';
        document.querySelector('.app-container').appendChild(this.historyOverlay);

        this.init();
    }

    init() {
        // Listen to app-container to catch header buttons too
        document.querySelector('.app-container').addEventListener('click', (e) => {
            const target = e.target.closest('button'); // Handle clicks on SVG icon
            if (!target) return;

            const action = target.dataset.action;
            const num = target.dataset.num;

            if (num !== undefined) {
                this.inputDigit(num);
            } else if (action) {
                this.handleAction(action);
            }

            this.updateDisplay();
        });

        // Close history on outside click (optional, but good UX)
        this.historyOverlay.addEventListener('click', (e) => {
            if (e.target.classList.contains('history-item')) {
                this.expression += e.target.dataset.value;
                this.toggleHistory();
                this.updateDisplay();
            }
        });
    }

    toggleShift() {
        this.isShift = !this.isShift;
        this.isAlpha = false;
        this.updateIndicators();
    }

    toggleAlpha() {
        this.isAlpha = !this.isAlpha;
        this.isShift = false;
        this.updateIndicators();
    }

    toggleHyp() {
        this.isHyp = !this.isHyp;
        if (this.isHyp) {
            this.indHyp.innerText = 'HYP';
            this.indHyp.classList.remove('hidden');
        } else {
            this.indHyp.innerText = 'Math';
            this.indHyp.classList.add('hidden');
        }
    }

    toggleHistory() {
        this.isHistoryVisible = !this.isHistoryVisible;
        if (this.isHistoryVisible) {
            this.renderHistory();
            this.historyOverlay.classList.add('visible');
        } else {
            this.historyOverlay.classList.remove('visible');
        }
    }

    renderHistory() {
        this.historyOverlay.innerHTML = '';
        if (this.history.length === 0) {
            this.historyOverlay.innerHTML = '<div style="color: #64748b; text-align: center; margin-top: 1rem;">No History</div>';
            return;
        }

        // Show latest first
        [...this.history].reverse().forEach(item => {
            const div = document.createElement('div');
            div.className = 'history-item';
            div.innerText = `${item.expr} = ${item.res}`;
            div.dataset.value = item.res; // Click to insert result
            this.historyOverlay.appendChild(div);
        });
    }

    updateIndicators() {
        // No shift/alpha to update
    }

    inputDigit(digit) {
        if (this.expression === '0') this.expression = '';
        this.expression += digit;
        this.resetModifiers();
    }

    handleAction(action) {
        switch (action) {
            case 'hyp': this.toggleHyp(); return;
            case 'history': this.toggleHistory(); return;
            case 'clear':
                this.expression = '';
                this.result = '0';
                this.engExponent = 0;
                if (this.isHistoryVisible) this.toggleHistory();
                break;
            case 'delete':
                this.expression = this.expression.slice(0, -1);
                break;
            case 'equals':
                this.calculate();
                break;
            case 'ans':
                this.expression += 'Ans';
                break;
            case 'calc':
                this.calculate();
                break;
            // Operations
            case 'add': this.expression += '+'; break;
            case 'subtract': this.expression += '-'; break;
            case 'multiply': this.expression += '*'; break;
            case 'divide': this.expression += '/'; break;
            // Scientific
            case 'sin': this.handleTrig('sin'); break;
            case 'cos': this.handleTrig('cos'); break;
            case 'tan': this.handleTrig('tan'); break;
            case 'asin': this.handleTrig('asin'); break;
            case 'acos': this.handleTrig('acos'); break;
            case 'atan': this.handleTrig('atan'); break;

            case 'log': this.expression += 'log('; break;
            case 'ln': this.expression += 'ln('; break;
            case 'sqrt': this.expression += 'sqrt('; break;
            case 'yroot': this.expression += 'yroot('; break;
            case 'square': this.expression += '^2'; break;
            case 'pow': this.expression += '^'; break;
            case 'x-inv': this.expression += '^(-1)'; break;
            case 'ten-pow': this.expression += '10^'; break;
            case 'log-base': this.expression += 'log('; break;
            case 'diff': this.expression += 'diff('; break;
            case 'integral': this.expression += 'integral('; break;
            case 'minus-paren': this.expression += '-'; break;
            case 'paren-left': this.expression += '('; break;
            case 'paren-right': this.expression += ')'; break;
            case 'comma': this.expression += ','; break;
            case 'mod': this.expression += '%'; break;
            case 'abs': this.expression += 'abs('; break;
            case 'sum': this.expression += 'sum('; break;
            case 'prod': this.expression += 'prod('; break;
            case 'fact': this.expression += '!'; break;
            case 'pi': this.expression += 'π'; break;
            case 'e': this.expression += 'e'; break;
            case 'exp': this.expression += '*10^'; break; // x10x
            case 'eng':
                this.cycleEng();
                return;
            case 'sd':
                this.toggleSD();
                return;
            case 'dms-inv':
                this.convertDMSToDecimal();
                return;
            case 'deg':
                this.convertToDMS();
                return;
            default: console.log('Action not implemented:', action);
        }
        this.resetModifiers();
    }

    handleTrig(func) {
        let prefix = '';
        if (this.isHyp) prefix += 'h';
        this.expression += `${func}${prefix}(`;
    }

    cycleEng() {
        // Use expression if result is 0/error and expression is a number
        let val = parseFloat(this.result);
        if ((this.result === '0' || this.result === 'Syntax Error') && this.expression) {
            const exprVal = parseFloat(this.expression);
            if (!isNaN(exprVal)) {
                val = exprVal;
                this.result = String(val); // Update result so we can cycle
            }
        }

        if (isNaN(val)) return;

        // Decrease exponent by 3 each time
        this.engExponent -= 3;

        // Calculate mantissa
        let mantissa = val * Math.pow(10, -this.engExponent);

        // Format: mantissa x 10^exponent
        // Round mantissa to avoid float errors
        mantissa = Math.round(mantissa * 1000000000) / 1000000000;

        this.result = `${mantissa}×10^${this.engExponent}`;
        this.updateDisplay();
    }

    convertDMSToDecimal() {
        // Parse D°M'S"
        const dmsRegex = /^(-?\d+)°(\d+)'(\d+(?:\.\d+)?)"$/;
        const match = this.result.match(dmsRegex);

        if (!match) return;

        const d = parseFloat(match[1]);
        const m = parseFloat(match[2]);
        const s = parseFloat(match[3]);

        // Formula: d + m/60 + s/3600
        // Note: d is the floor, so it works for negatives too (e.g. -2°30' -> -1.5)
        const val = d + m / 60 + s / 3600;

        // Round to avoid float precision issues
        this.result = String(Math.round(val * 1000000000) / 1000000000);
        this.updateDisplay();
    }

    convertToDMS() {
        // Use expression if result is 0/error and expression is a number
        let val = parseFloat(this.result);
        if ((this.result === '0' || this.result === 'Syntax Error') && this.expression) {
            const exprVal = parseFloat(this.expression);
            if (!isNaN(exprVal)) {
                val = exprVal;
            }
        }

        if (isNaN(val)) return;

        const d = Math.floor(val);
        const mFloat = (val - d) * 60;
        const m = Math.floor(mFloat);
        const s = Math.round((mFloat - m) * 60);

        this.result = `${d}°${m}'${s}"`;
        this.updateDisplay();
    }

    toggleSD() {
        // Use expression if result is 0/error and expression is a number
        if ((this.result === '0' || this.result === 'Syntax Error') && this.expression) {
            // If expression is simple number, use it
            if (!isNaN(parseFloat(this.expression))) {
                this.result = this.expression;
            }
        }

        if (this.result === '0' || this.result === 'Syntax Error') return;

        // Simple decimal to fraction toggle
        if (this.result.includes('/')) {
            try {
                this.result = String(eval(this.result));
            } catch (e) { }
        } else {
            let val = parseFloat(this.result);
            if (isNaN(val)) return;

            const tolerance = 1.0E-6;
            let h1 = 1; let h2 = 0;
            let k1 = 0; let k2 = 1;
            let b = val;
            do {
                let a = Math.floor(b);
                let aux = h1; h1 = a * h1 + h2; h2 = aux;
                aux = k1; k1 = a * k1 + k2; k2 = aux;
                b = 1 / (b - a);
            } while (Math.abs(val - h1 / k1) > val * tolerance);

            if (k1 !== 1) {
                this.result = `${h1}/${k1}`;
            }
        }
        this.updateDisplay();
    }

    calculate() {
        try {
            let evalStr = this.expression
                .replace(/×/g, '*')
                .replace(/÷/g, '/')
                .replace(/π/g, 'Math.PI')
                .replace(/\be\b/g, 'Math.E')
                .replace(/Ans/g, this.lastAnswer);
            // Helper to parse function arguments respecting parentheses
            const parseFunction = (str, funcName) => {
                const startIndex = str.indexOf(funcName + '(');
                if (startIndex === -1) return null;

                let openParen = 0;
                let args = [];
                let currentArg = '';
                let endIndex = -1;

                // Start scanning after 'funcName('
                for (let i = startIndex + funcName.length + 1; i < str.length; i++) {
                    const char = str[i];
                    if (char === '(') {
                        openParen++;
                        currentArg += char;
                    } else if (char === ')') {
                        if (openParen === 0) {
                            args.push(currentArg);
                            endIndex = i;
                            break;
                        } else {
                            openParen--;
                            currentArg += char;
                        }
                    } else if (char === ',' && openParen === 0) {
                        args.push(currentArg);
                        currentArg = '';
                    } else {
                        currentArg += char;
                    }
                }

                if (endIndex === -1) return null; // Malformed: missing closing paren

                return {
                    match: str.substring(startIndex, endIndex + 1),
                    args: args.map(a => a.trim()), // Trim whitespace
                    startIndex: startIndex,
                    endIndex: endIndex
                };
            };

            // Process functions iteratively
            const processFunc = (name, handler) => {
                let safety = 0;
                while (evalStr.includes(name + '(') && safety < 10) {
                    safety++;
                    const parsed = parseFunction(evalStr, name);
                    if (!parsed) break;

                    try {
                        const res = handler(parsed.args);
                        if (res === undefined || res === null || isNaN(res)) {
                            throw new Error(`${name} result is NaN or undefined`);
                        }
                        evalStr = evalStr.substring(0, parsed.startIndex) + res + evalStr.substring(parsed.endIndex + 1);
                    } catch (e) {
                        console.error(`Error processing ${name}:`, e);
                        throw e;
                    }
                }
            };

            // yroot(base, root) -> base^(1/root)
            processFunc('yroot', (args) => {
                if (args.length !== 2) throw new Error('yroot expects 2 args');
                return `Math.pow(${args[0]}, 1/(${args[1]}))`;
            });

            // log(base, val) -> Math.log(val)/Math.log(base)
            // Note: We need to distinguish log(x) from log(base, val)
            // But my parser handles commas. If 1 arg -> log10. If 2 args -> log base.
            // However, standard log() is log10. 
            // Let's handle 'log' carefully.
            // Actually, let's just use the regex for simple log/ln/sqrt as they are standard
            // But 'log' with comma needs special handling.

            // Let's handle 'log' manually to support both log(x) and log(b, x)
            while (evalStr.includes('log(')) {
                const parsed = parseFunction(evalStr, 'log');
                if (!parsed) break;

                let replacement;
                if (parsed.args.length === 2) {
                    replacement = `(Math.log(${parsed.args[1]})/Math.log(${parsed.args[0]}))`;
                } else {
                    replacement = `Math.log10(${parsed.args[0]})`;
                }
                evalStr = evalStr.substring(0, parsed.startIndex) + replacement + evalStr.substring(parsed.endIndex + 1);
            }

            // Simple standard functions
            evalStr = evalStr
                .replace(/ln\(/g, 'Math.log(')
                .replace(/sqrt\(/g, 'Math.sqrt(')
                .replace(/abs\(/g, 'Math.abs(')
                .replace(/\^/g, '**');

            const trigFuncs = ['sin', 'cos', 'tan'];
            trigFuncs.forEach(func => {
                // Hyperbolic
                evalStr = evalStr.replace(new RegExp(`\\b${func}h\\(`, 'g'), `Math.${func}h(`);
                evalStr = evalStr.replace(new RegExp(`\\ba${func}h\\(`, 'g'), `Math.a${func}h(`);

                // Inverse (Arc)
                evalStr = evalStr.replace(new RegExp(`\\ba${func}\\(`, 'g'), `(180/Math.PI)*Math.a${func}(`);

                // Standard
                evalStr = evalStr.replace(new RegExp(`\\b${func}\\(`, 'g'), `Math.${func}((Math.PI/180)*`);
            });

            // Diff
            processFunc('diff', (args) => {
                if (args.length !== 2) throw new Error('diff expects 2 args');
                const expr = args[0];
                const point = args[1];
                const xVal = new Function('return ' + point)();
                const h = 0.0001;
                const f = (val) => {
                    let subExpr = expr.replace(/\bx\b/gi, `(${val})`);
                    return new Function('return ' + subExpr)();
                };
                return (f(xVal + h) - f(xVal - h)) / (2 * h);
            });

            // Integral
            processFunc('integral', (args) => {
                if (args.length !== 3) throw new Error('integral expects 3 args');
                const expr = args[0];
                const lower = new Function('return ' + args[1])();
                const upper = new Function('return ' + args[2])();
                const n = 100;
                const h = (upper - lower) / n;

                const f = (val) => {
                    let subExpr = expr.replace(/\bx\b/gi, `(${val})`);
                    return new Function('return ' + subExpr)();
                };

                let sum = f(lower) + f(upper);
                for (let i = 1; i < n; i++) {
                    sum += (i % 2 === 0 ? 2 : 4) * f(lower + i * h);
                }
                return (h / 3) * sum;
            });

            // Summation: sum(expr, start, end)
            processFunc('sum', (args) => {
                if (args.length !== 3) throw new Error('sum expects 3 args');
                const expr = args[0];
                const start = parseInt(new Function('return ' + args[1])());
                const end = parseInt(new Function('return ' + args[2])());
                let total = 0;
                for (let i = start; i <= end; i++) {
                    let subExpr = expr.replace(/\bx\b/gi, `(${i})`);
                    total += new Function('return ' + subExpr)();
                }
                return total;
            });

            // Product: prod(expr, start, end)
            processFunc('prod', (args) => {
                if (args.length !== 3) throw new Error('prod expects 3 args');
                const expr = args[0];
                const start = parseInt(new Function('return ' + args[1])());
                const end = parseInt(new Function('return ' + args[2])());
                let total = 1;
                for (let i = start; i <= end; i++) {
                    let subExpr = expr.replace(/\bx\b/gi, `(${i})`);
                    total *= new Function('return ' + subExpr)();
                }
                return total;
            });

            const result = new Function('return ' + evalStr)();

            this.lastAnswer = String(result);
            this.history.push({ expr: this.expression, res: String(result) });
            if (this.history.length > 20) this.history.shift();

            this.result = String(Math.round(result * 10000000000) / 10000000000);
            this.expression = '';
            this.engExponent = 0;
        } catch (e) {
            this.result = 'Error: ' + e.message;
            console.error(e);
        }
    }

    toRadians(angle) {
        return angle * (Math.PI / 180);
    }

    resetModifiers() {
        if (this.isHyp) this.toggleHyp();
        // No shift/alpha to reset
    }

    updateDisplay() {
        this.expressionEl.innerText = this.expression;
        this.resultEl.innerText = this.result;

        if (this.result.startsWith('Error') || this.result === 'Syntax Error') {
            this.resultEl.classList.add('error-text');
        } else {
            this.resultEl.classList.remove('error-text');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const calculator = new Calculator();
});
