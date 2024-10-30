# Node.js Interpreter

This Node.js project provides a flexible interpreter for evaluating JavaScript strings. It supports dynamic function parsing and can load external libraries based on user-specified configurations. The project is particularly useful for executing JavaScript code snippets with customized logic.


### Real-Life Example: Dynamic Formula Evaluation

Consider a financial reporting application that relies on a table of formulas to calculate various metrics. These formulas are subject to change based on business needs, often every 6-7 days. Using the Node.js Interpreter, the application can easily adapt to these changes without requiring extensive reprogramming.

#### Scenario

- **Formula Table**:
    | Day         | Metric         | Formula                     |
    |-------------|----------------|-----------------------------|
    | Day 1      | Total Revenue   | `SUM(sales) + BONUS`       |
    | Day 7      | Total Revenue   | `SUM(sales) * 1.1`         |
    | Day 14     | Total Revenue   | `SUM(sales) - EXPENSES`     |
    | Day 21     | Total Revenue   | `SUM(sales) / 1.2`         |
    | Day 28     | Total Revenue   | `SUM(sales) + TAX`         |

- **How It Works**:
    Each time the formula changes, the financial reporting application can call the `interpretor` function to evaluate the new formula based on the current data.

#### Example Implementations

1. **Initial Formula (Day 1)**:
   For the initial formula, the application uses an `add` formula with sales data:
javascript
   const evalString = "return SUM(sales) + BONUS;";
   const result = interpretor(evalString, [], { sales: [100, 200, 300], BONUS: 50 });
   console.log(result); // Output: 650


## Table of Contents
- [Node.js Interpreter](#nodejs-interpreter)
- [Features](#features)
- [Installation](#installation)
- [Project Overview](#project-overview)
- [Usage](#usage)
  - [interpretor](#1-interpretor)
  - [showLibAndProperties](#2-showlibandproperties)
- [Libraries](#libraries)
  - [LOGICAL](#logical)
  - [STRING](#string)
- [Contributing](#contributing)
- [License](#license)


## Features

- **Library Loader**: Loads required libraries dynamically to extend the functionality.
- **Payload Support**: Allows passing external arguments (payload) for evaluation within the JavaScript string.
- **Run pure Javascript**: In interpreter, you can run pure js code and logical operator here.

## Installation

```bash
npm i formula-interpreter
```


# Project Overview

This project exposes functionalities to evaluate JavaScript code dynamically and allows users to manipulate data through a set of predefined libraries. It is designed to enable users who may not be proficient in JavaScript to still leverage its capabilities through simple function calls.

## Usage

The project exposes two primary functions:

### 1. `interpretor(evalString, libraries, payload)`

| Parameter     | Type           | Description                                                  |
|---------------|----------------|--------------------------------------------------------------|
| `evalString`  | `string`       | A string containing the JavaScript code to evaluate.       |
| `libraries`   | `array`        | An array of library names to load from the `libraries` directory. |
| `EXTERNAL_VAR`| `object`       | An object containing values to pass into the evaluated code. |

#### Example:

```javascript
const evalString = "return 1 + 1";
const result = interpretor(evalString);
console.log(result); // Output: 2

```
### 2. `showLibAndProperties(library, propertyName, allAtOnce)`

This function retrieves the available libraries and their properties, allowing users to inspect the functionalities that can be utilized in their JavaScript evaluations.

#### Parameters:

| Parameter       | Type     | Description                                                  |
|-----------------|----------|--------------------------------------------------------------|
| `library`       | `string` | The name of the library to load. If `null`, all libraries are loaded. |
| `propertyName`  | `string` | The specific property or function within the library to retrieve. If `null`, all properties will be retrieved. |
| `allAtOnce`     | `boolean`| A flag indicating whether to load all libraries and their properties at once. If `true`, all libraries will be included in the response. |

#### Example Usage:

1. **Retrieving a Specific Property:**

For specific response.
```javascript
const libraryInfo = showLibAndProperties('myLibrary', 'myFunction', false);
```

For all libraries, functions and their properties at once.
```javascript
const libraryInfo = showLibAndProperties(null, null, true);
```


# LIBRARIES

This library provides functions for evaluating logical conditions and expressions.

| Function                       | Description                                                               | Parameters                               | Example                                                 |
|--------------------------------|---------------------------------------------------------------------------|------------------------------------------|---------------------------------------------------------|
| `IF(condition, trueValue, falseValue)` | Evaluates a condition and returns either `trueValue` or `falseValue` based on the condition. | `condition`, `trueValue`, `falseValue` | `return IF(1 < 2, 'Yes', 'No')` → Output: Yes         |
| `AND(...args)`                | Evaluates multiple boolean expressions. Returns `true` if all conditions are true. | `...args`                               | `return AND(1 === 1, 2 === 2)` → Output: true         |
| `OR(...args)`                 | Evaluates multiple boolean expressions. Returns `true` if any condition is true. | `...args`                               | `return OR(1 === 2, 2 === 2)` → Output: true          |

---

This table provides a clear overview of the functions available in the `LOGICAL` library, along with their purpose, parameters, and usage examples.

# STRING 

This library provides functions for manipulating strings.

| Function                    | Description                                         | Parameters          | Example                                                |
|-----------------------------|-----------------------------------------------------|---------------------|--------------------------------------------------------|
| `CONCATSTR(...args)`        | Concatenates multiple strings into a single string. | `...args`           | `return CONCATSTR('Hello, ', 'world!', ' How are you?');` → Output: Hello, world! How are you? |
| `STRLENGTH(str)`            | Returns the length of the given string.             | `str`               | `return STRLENGTH('Hello, world!');` → Output: 13    |

---

This table provides a clear overview of the functions available in the `STRING` library, along with their purpose, parameters, and usage examples.


## Keywords

- Node.js
- JavaScript
- Interpreter
- Formula Interpreter
- Dynamic Evaluation
- Formula Evaluation
- Logical Operations
- String Manipulation
- Custom Functions
- Dynamic Formulas

