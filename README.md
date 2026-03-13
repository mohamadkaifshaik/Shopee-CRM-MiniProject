# Shopee-CRM-MiniProject

A lightweight, fully client-side **Employee CRM System** built with HTML5, CSS3, JavaScript (ES6), Bootstrap 5, and jQuery. No backend, no build tools required — just open in a browser.

---

## Project Structure

```
Shopee/
│
├── html/                        # All HTML pages
│   ├── Dashboard.html           # Employee overview & statistics
│   ├── Employees.html           # Employee list & management
│   ├── Assessment.html          # Skill assessment quiz
│   └── Profile.html             # Individual employee profile
│
├── css/
│   └── style.css                # All custom styles
│
├── js/
│   ├── app.js                   # Core data, utilities, shared helpers
│   ├── employees.js             # Employees page logic
│   ├── assessment.js            # Quiz logic
│   └── storage.js               # LocalStorage key constants
│
├── tests/
│   └── assessment.test.js       # Jest test suite
│
├── package.json
└── README.md
```

---

## Pages

| Page       | File              | Description                                                         |
| ---------- | ----------------- | ------------------------------------------------------------------- |
| Dashboard  | `Dashboard.html`  | Stats overview, performance bars, client assignments, activity feed |
| Employees  | `Employees.html`  | Searchable/filterable employee table, status toggle, detail modal   |
| Assessment | `Assessment.html` | 8-question quiz, auto-scored with grade and feedback                |
| Profile    | `Profile.html`    | Full employee profile with assessment history                       |

---

## Getting Started

### 1. Clone or download the project

```bash
git clone https://github.com/mohamadkaifshaik/Shopee-CRM-MiniProject.git
cd Shopee-CRM-MiniProject
```

### 2. Open in browser

No server needed. Just open any HTML file directly:

```
html/Dashboard.html
```

Or use a local dev server for the best experience:

```bash
# Python
python -m http.server 8000

# Node (npx)
npx serve .
```

Then visit `http://localhost:8000/html/Dashboard.html`

---

## Technologies

| Technology     | Usage                                                                       |
| -------------- | --------------------------------------------------------------------------- |
| HTML5          | Semantic structure (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`) |
| CSS3           | Custom properties, Flexbox, Grid, animations                                |
| JavaScript ES6 | Async/await, Promises, arrow functions, destructuring                       |
| Bootstrap 5    | Responsive grid, navbar, modals, utility classes                            |
| jQuery 3.7     | DOM manipulation, event handling, AJAX-style async                          |
| localStorage   | Persisting quiz results, status overrides, selected employee                |
| Jest           | Unit testing for score calculation logic                                    |

---

## Features

### Dashboard

- Animated stat counters on load
- Per-employee performance progress bars
- Client assignment summary
- Department breakdown
- Live activity feed

### Employees

- Search by name, department or role
- Filter by department
- Toggle active / inactive status (persisted to localStorage)
- Employee detail modal with clients and assessment history
- Department summary cards

### Assessment

- 8 dynamically rendered multiple-choice questions
- Progress bar tracks answered questions
- Answers highlighted correct / wrong on submit
- Score, grade (A+ → F) and feedback message
- Full history saved to localStorage
- Retry without page reload

### Profile

- Switch between employees via dropdown
- Contact info, performance bars, client list
- Complete assessment history with pass/fail tags

---

## LocalStorage Keys

| Key             | Type     | Description                      |
| --------------- | -------- | -------------------------------- |
| `selEmp`        | `number` | Currently selected employee ID   |
| `assessResults` | `array`  | All quiz attempt records         |
| `statusOv`      | `object` | Active/inactive status overrides |
| `empScore`      | `number` | Latest assessment percentage     |
| `lastGrade`     | `string` | Latest assessment grade          |

---

## Running Tests

Install dependencies and run the Jest test suite:

```bash
npm install
npm test
```

### Test Coverage

| Test Group               | Cases                                                  |
| ------------------------ | ------------------------------------------------------ |
| `calculatePercentage`    | Full score, half score, zero, divide-by-zero, rounding |
| `calculateGrade`         | All grade bands A+ through F                           |
| `isPassed`               | Pass threshold (50), above, below, edge cases          |
| `getPerformanceFeedback` | Message text, pass/fail type per band                  |
| Integration              | Full quiz flow: 6/8, 3/8, 8/8                          |

---

## Design

**Swiss Editorial** aesthetic — warm white paper, ink black, single coral-red accent (`#e8442a`).

| Token     | Value     | Usage                                          |
| --------- | --------- | ---------------------------------------------- |
| `--ink`   | `#0e0e0e` | Primary text                                   |
| `--ink-3` | `#717171` | Secondary text                                 |
| `--line`  | `#e8e8e8` | Borders                                        |
| `--paper` | `#fafafa` | Page background                                |
| `--red`   | `#e8442a` | Accent (active states, links, italic headings) |
| `--green` | `#1a7f4b` | Pass / active badges                           |

**Fonts**

- [Instrument Serif](https://fonts.google.com/specimen/Instrument+Serif) — display headings (italic for accent words)
- [DM Sans](https://fonts.google.com/specimen/DM+Sans) — body text and UI
- [DM Mono](https://fonts.google.com/specimen/DM+Mono) — labels, IDs, timestamps, breadcrumbs

---

## Browser Support

Works in all modern browsers. No polyfills required.

| Browser     | Support |
| ----------- | ------- |
| Chrome 90+  | ✅      |
| Firefox 88+ | ✅      |
| Safari 14+  | ✅      |
| Edge 90+    | ✅      |

---

## Grading Scheme

| Percentage | Grade |
| ---------- | ----- |
| 90 – 100   | A+    |
| 80 – 89    | A     |
| 70 – 79    | B     |
| 60 – 69    | C     |
| 50 – 59    | D     |
| 0 – 49     | F     |

Pass mark: **50%**

---

## License

This project is for educational purposes.
