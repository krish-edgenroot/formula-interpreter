# Node.js Interpreter

This Node.js project provides a flexible interpreter for evaluating JavaScript strings. It supports dynamic function parsing and can load external libraries based on user-specified configurations. The project is particularly useful for executing JavaScript code snippets with customized logic.

## Features

- **Library Loader**: Loads required libraries dynamically to extend the functionality.
- **Payload Support**: Allows passing external arguments (payload) for evaluation within the JavaScript string.
- **Run pure Javascript**: In interpreter, you can run pure js code and logical operator here.

## Installation

```bash
npm i formula-interpreter
```

## Usage

The project exposes two primary functions:

### `interpretor(evalString, libraries, payload)`

This function evaluates a given JavaScript string by optionally loading and utilizing libraries. The `payload` object is used to pass arguments into the evaluated string.

- **`evalString`**: A string containing the JavaScript code to evaluate.
- **`libraries`**: An array of library names to load from the `libraries` directory.
- **`EXTERNAL_VAR`**: An object containing values to pass into the evaluated code.

#### Example:

```javascript
const evalString = "return 1+1";
const result = interpretor(evalString);
console.log(result); //output: 2
```
Usage of external variable.
```javascript
const evalString = "return EXTERNAL_VAR.name.length"; // You can use external variables by EXTERNAL_VAR keyword.
const result = interpretor(evalString,[],{name:"Krishna"});
console.log(result); //output: 7
```

### `showLibAndProperties(library, propertyName, allAtOnce)`

This function retrieves the available libraries and their properties.

- **`library`**: The name of the library to load.
- **`propertyName`**: The specific property or function within the library to retrieve.
- **`allAtOnce`**: A boolean flag to load all libraries and their properties at once.

#### Example:

For specific response.
```javascript
const libraryInfo = showLibAndProperties('myLibrary', 'myFunction', false);
```

For all libraries, functions and their properties at once.
```javascript
const libraryInfo = showLibAndProperties(null, null, true);
```


# LIBRARIES

This module provides libraries so you don't need to know JavaScript code, you can use them easily. Below are the libraries available in the package.

## LOGICAL

### `IF(condition, trueValue, falseValue)`

Evaluates the given `condition` and returns either `trueValue` if the condition is true, or `falseValue` if the condition is false.

#### Parameters:
- **`condition`**: A boolean condition to evaluate.
- **`trueValue`**: The value to return if the condition is `true`.
- **`falseValue`**: The value to return if the condition is `false`.

### Example
```javascript
const evalString = "return IF(1 < 2, 'Yes', 'No')";
const result = interpretor(evalString, ['LOGICAL'], {});
console.log(result); // Output: Yes
```

### `AND(...args)`

Evaluates multiple boolean expressions and returns `true` if all conditions are true.

#### Parameters:
- **`...args`**: A variable number of boolean expressions.

### Example
```javascript
const andEvalString = "return AND(1 === 1, 2 === 2)";
const andResult = interpretor(andEvalString, ['LOGICAL'], {});
console.log(andResult); // Output: true
```

### `OR(...args)`

Evaluates multiple boolean expressions and returns `true` if any condition is true.

#### Parameters:
- **`...args`**: A variable number of boolean expressions.

#### Example:

```javascript
const orEvalString = "return OR(1 === 2, 2 === 2)";
const orResult = interpretor(orEvalString, ['LOGICAL'], {});
console.log(orResult); // Output: true
```

# STRING 

This module provides libraries that allow you to manipulate strings without needing to know JavaScript code; you can use them easily. Below are the libraries available in the package.

## Functions

### `CONCATSTR(...args)`

Concatenates multiple strings into a single string.

#### Parameters:
- **`...args`**: A variable number of strings to concatenate.

#### Example:

```javascript
const evalString = "return CONCATSTR('Hello, ', 'world!', ' How are you?');";
const result = interpretor(evalString, ['STRING']);
console.log(result); // Output: Hello, World! How are you? 
```

### `STRLENGTH(str)`

Returns the length of the given string.

#### Parameters:
- **`str`**: The string whose length is to be calculated.

#### Example:

```javascript
const evalString = "return STRLENGTH('Hello, world!');";
const result = interpretor(evalString, ['STRING']);
console.log(result); // Output: 13
```