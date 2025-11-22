# SB Scientific Calculator

A modern, mobile-first scientific calculator with advanced mathematical capabilities, built with vanilla HTML, CSS, and JavaScript.

## ✨ Features

### 🔢 Basic Operations
- **Arithmetic**: Addition, subtraction, multiplication, division
- **Clear & Delete**: AC (All Clear) and backspace functionality
- **Answer Recall**: Use `Ans` to reference the previous result
- **History**: Access calculation history via the history button

### 🧮 Scientific Functions

**Trigonometry**
- Standard functions: `sin`, `cos`, `tan`
- Inverse functions: `sin⁻¹`, `cos⁻¹`, `tan⁻¹`
- Hyperbolic functions: Toggle `HYP` mode for `sinh`, `cosh`, `tanh` and their inverses

**Logarithms & Exponentials**
- `log` - Base 10 logarithm
- `ln` - Natural logarithm
- `logₐx` - Custom base logarithm
- `10ˣ` - Power of 10
- `e` - Euler's number

**Powers & Roots**
- `x²` - Square
- `x^` - Custom power
- `√` - Square root
- `ⁿ√` - Custom root (nth root)
- `x⁻¹` - Reciprocal

### 📐 Advanced Mathematics

**Calculus**
- `d/dx` - Numerical differentiation
- `∫dx` - Definite integration (Simpson's Rule)
- `Σ` - Summation over a range
- `Π` - Product over a range

**Other Functions**
- `!` - Factorial
- `mod` - Modulus (remainder)
- `Abs` - Absolute value
- `π` - Pi constant

### 🔧 Engineering Tools
- **ENG**: Cycle through engineering notation (powers of 10³)
- **DEG**: Convert decimal to degrees-minutes-seconds (D°M'S")
- **S⇔D**: Toggle between decimal and fraction display

## 🎨 Design

- **Dark Theme**: Modern, eye-friendly dark color scheme
- **Responsive Layout**: Optimized for all screen sizes from small phones to tablets
- **Touch-Optimized**: Large, easy-to-tap buttons with visual feedback
- **Premium Aesthetics**: Clean typography using Outfit and JetBrains Mono fonts
- **Smooth Animations**: Subtle transitions and hover effects

## 🛠️ Technology Stack

- **HTML5**: Semantic, accessible markup
- **CSS3**: 
  - CSS Custom Properties (variables)
  - Flexbox & Grid layouts
  - Responsive design with fluid scaling using `clamp()`
  - Media queries for optimal display on all devices
- **Vanilla JavaScript (ES6+)**:
  - Object-oriented design with ES6 classes
  - Custom expression parser (no `eval()` for security)
  - Advanced mathematical implementations
  - Service Worker for PWA functionality

## 📦 Installation & Usage

### Option 1: Direct Use
1. Download or clone this repository
2. Open `index.html` in any modern web browser
3. Start calculating!

### Option 2: Local Server (Recommended for PWA features)
```bash
# Using Python 3
python -m http.server 8000

# Using Node.js
npx http-server

# Then open http://localhost:8000 in your browser
```

### Option 3: Install as PWA
1. Open the app in a mobile browser (Chrome, Safari, Edge)
2. Tap the "Add to Home Screen" or "Install" option
3. Use it like a native app!

## 📱 Mobile Support

This calculator is designed with mobile-first principles:
- **Fully Responsive**: Adapts to any screen size
- **PWA Ready**: Install on your home screen for offline access
- **Touch Optimized**: Large buttons designed for finger input
- **Viewport Optimized**: Fits perfectly on all devices from small phones to large tablets

## 🧪 Browser Compatibility

- ✅ Chrome/Edge (recommended)
- ✅ Safari (iOS & macOS)
- ✅ Firefox
- ✅ Samsung Internet
- ⚠️ Requires modern browser with ES6+ support

## 📖 Usage Examples

**Basic Calculation**
```
2 + 3 × 4 = 14
```

**Scientific Functions**
```
sin(30) = 0.5
log(100) = 2
```

**Calculus**
```
diff(x^2, 5) = 10  (derivative of x² at x=5)
integral(x, 0, 10) = 50  (integral of x from 0 to 10)
```

**Series Operations**
```
sum(x^2, 1, 5) = 55  (1² + 2² + 3² + 4² + 5²)
prod(x, 1, 5) = 120  (1 × 2 × 3 × 4 × 5)
```

## 🗂️ Project Structure

```
Building Calculator/
├── index.html          # Main HTML structure
├── style.css           # Responsive styles
├── script.js           # Calculator logic
├── manifest.json       # PWA manifest
├── sw.js              # Service worker
└── README.md          # This file
```

## 🔒 Security

- No use of `eval()` for user input
- Custom expression parser for safe mathematical evaluation
- Service worker caching for offline functionality

## 🚀 Future Enhancements

- [ ] Matrix operations
- [ ] Complex number support
- [ ] Graphing capabilities
- [ ] Custom function definitions
- [ ] Theme customization

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests
- Improve documentation


## 👤 Author

**Shaon Biswas** - Scientific Calculator

---

**Note**: For PWA functionality (offline access, home screen installation), you'll need to serve the app over HTTPS or localhost, and add appropriate icon files (`icon-192.png`, `icon-512.png`).
