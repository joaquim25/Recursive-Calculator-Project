// Global variables ------------------------------------------------------------------------------------------------------------------------------------------------------------
let memories = {}; // stores memory names and values
let lastCalculatedValue = 0; // keeps track of the result of the last calculation

// Prompts and alert messages --------------------------------------------------------------------------------------------------------------------------------------------------
const mainPrompt = "Introduza um comando: ";
const exitMessage = "Aplicacao terminada. Ate a proxima.";
const help = `VM - Consultar o valor da memoria
LM - Indicar o nome das memorias
CE - Calcular o valor duma expressao
AVM - Atribuir ultimo valor calculado a uma memoria
A - Ajuda
AM - Alocar Memória
S - Sair`;
const invalidOption = "Opcao inexistente.";
const invalidExpression = "Expressao mal definida.";
const memoryNotDefined = "Memoria nao existente.";
const memoriesEmpty = "Calculadora sem memorias.";
const memoryCreated = "memoria criada com o nome:";

// Helper functions ------------------------------------------------------------------------------------------------------------------------------------------------------------
// Round a number to two decimal places
function roundNumber(num) {
  return Math.round(num * 100) / 100;
}

// Check if an expression is uniform in terms of brackets
function isBracketsUniform(
  expression,
  index,
  openBracketIndex,
  closeBracketIndex
) {
  const brackets = "[]()";
  let stack = [];

  for (let i = 0; i < expression.length; i++) {
    let bracket = expression[i];
    let bracketsIndex = brackets.indexOf(bracket);

    index++;

    // If the character is not a bracket, continue to the next iteration
    if (bracketsIndex === -1) {
      continue;
    }

    // If it is an open bracket , push the corresponding close bracket index
    if (bracketsIndex === 0 || bracketsIndex === 2) {
      stack.push(bracketsIndex + 1);
    } else {
      // If it is a close bracket, check if it matches with the corresponding open bracket
      if (stack.pop() !== bracketsIndex) {
        return false;
      }
    }

    // Return close bracket's index if the stack is empty
    if (stack.length === 0) {
      closeBracketIndex.push(index);
    }

    // Return 1st open bracket's index if stack length is 1
    if (stack.length === 1) {
      openBracketIndex.push(index);
    }
  }

  // Return true if the expression is balanced
  return stack.length === 0;
}

// Returns true if a given operator is a unary operator (+, -, *, /)
function isBinaryOperator(operator) {
  const binaryOperators = {
    "+": true,
    "-": true,
    "*": true,
    "/": true,
  };
  return binaryOperators.hasOwnProperty(operator);
}

// Returns true if the given expression has an invalid format of a binary expression
function isInvalidBinaryExpression(expression, closeBracketIndex) {
  return (
    expression[2] !== "(" ||
    expression[closeBracketIndex[0]] !== ")" ||
    expression[closeBracketIndex[0] + 2] !== "(" ||
    expression[expression.length - 1] !== ")"
  );
}

// Extracts the two arguments and operator from a binary expression, also checks for any referenced memories and further expressions
function binaryPreparation(expression, closeBracketIndex) {
  // Extract the two arguments and operator from the expression
  let operator = expression[0]; //extracts the expression operator
  let arg1 = [...expression].slice(3, closeBracketIndex[0]).join(""); //extract the first argument of the expression starts from index 3 (command + space) until first closeBracketIndex
  let arg2 = [...expression]
    .slice(closeBracketIndex[0] + 3, expression.length - 1)
    .join(""); // extracts the second argument, from the first closeBracketIndex until the end of the expression(-1 to remove the last bracket)

  // Checks if the expression format is valid, otherwise it will return an alert error message
  if (isInvalidBinaryExpression(expression, closeBracketIndex)) {
    return invalidExpression;
  }

  // Checks if the given first argument is a memory
  if (memories.hasOwnProperty(arg1)) {
    arg1 = parseFloat(memories[arg1]);
  }

  // Checks if the given first argument is a number
  if (parseFloat(arg1)) {
    arg1 = parseFloat(arg1);
  } else {
    // If the first argument is not a number or a memory name, it enters the calculateExpression again looking for nested expressions
    arg1 = parseFloat(calculateExpression(arg1));
  }

  // Checks if the given second argument is a memory
  if (memories.hasOwnProperty(arg2)) {
    arg2 = memories[arg2];
  }

  // Checks if the given second argument is a number
  if (parseFloat(arg2)) {
    arg2 = parseFloat(arg2);
  } else {
    // If the second argument is not a number or a memory name, it enters the calculateExpression again looking for nested expressions
    arg2 = parseFloat(calculateExpression(arg2));
  }

  // If both arguments provided on the current iteration were a number or a memory name, the operator, and arguments are returned back into calculate expression
  return { operator, arg1, arg2 };
}

// Calculates the result of a binary operation with the given operator and arguments
function performBinaryCalculation(operator, arg1, arg2) {
  switch (operator) {
    case "+":
      return arg1 + arg2;
    case "-":
      return arg1 - arg2;
    case "*":
      return arg1 * arg2;
    case "/":
      return arg1 / arg2;
  }
}

// Returns true if a given operator is a unary operator (ABS, COS, LOG, CEIL, FLOOR, SIN, ROUND, EXP)
function isUnaryOperator(operator) {
  const unaryOperators = {
    ABS: true,
    COS: true,
    LOG: true,
    CEIL: true,
    FLOOR: true,
    SIN: true,
    ROUND: true,
    EXP: true,
  };
  return unaryOperators.hasOwnProperty(operator);
}

// Returns true if the given expression has an invalid format of a unary expression
function isInvalidUnaryExpression(expression, openBracketIndex) {
  return (
    expression[openBracketIndex[0]] !== "(" ||
    expression[expression.length - 1] !== ")"
  );
}

// Extracts the argument and operator from a unary expression, also checks for any referenced memories and further expressions
function unaryPreparation(expression, openBracketIndex) {
  let arg = [...expression]
    .slice(openBracketIndex[0] + 1, expression.length - 1)
    .join(""); // Extracts the argument from the given expression
  const regex = /^([a-zA-Z]+)/g; // Regex to match the unary operator (first set of characters)
  const operator = expression.match(regex).toString(); // Extracts the unary operator provided in the expression

  // Checks if the expression format is valid, otherwise it will return an alert error message
  if (isInvalidUnaryExpression(expression, openBracketIndex)) {
    return invalidExpression;
  }

  // Checks if the given argument is a memory
  if (memories.hasOwnProperty(arg)) {
    arg = memories[arg];
  }

  // Checks if the given argument is a number
  if (parseFloat(arg)) {
    arg = parseFloat(arg);
  } else {
    // If the argument is not a number or a memory name, it enters the calculateExpression again looking for nested expressions
    arg = parseFloat(calculateExpression(arg));
  }

  return { operator, arg };
}

// Calculates the result of a unary operation with the given operator and argument
function performUnaryCalculation(operator, arg) {
  switch (operator) {
    case "ABS":
      return Math.abs(arg);
    case "COS":
      return Math.cos(arg);
    case "LOG":
      return Math.log(arg);
    case "CEIL":
      return Math.ceil(arg);
    case "FLOOR":
      return Math.floor(arg);
    case "SIN":
      return Math.sin(arg);
    case "ROUND":
      return Math.round(arg);
    case "EXP":
      return Math.exp(arg);
  }
}

// Main functions ---------------------------------------------------------------------------------------------------------------------------------------------------------------
// VM - Get the value of a specific memory
function getMemoryValue(memoryName) {
  // Check if the memory name exists and display its value, otherwise, alert an error message
  if (memoryName.length > 1 && memories.hasOwnProperty(memoryName)) {
    alert(`${memoryName}: ${memories[memoryName]}`);
  } else {
    alert(memoryNotDefined);
  }
}

// LM - Display all existing memories and their values
function showMemories() {
  // Collect keys of memories
  const keysArr = Object.keys(memories);
  // If no memories are found, alert a message informing the user memories are empty
  if (keysArr.length === 0) {
    alert(memoriesEmpty);
  } else {
    // If memories are found, concatenate memories into a string and alert a message showing them
    let resultStr = "";
    for (let i = 0; i < keysArr.length; i++) {
      resultStr += `${keysArr[i]}: ${memories[keysArr[i]]}`;
      if (i < keysArr.length - 1) {
        resultStr += "; ";
      }
    }
    alert(resultStr);
  }
}

// CE - calculate the value of an expression
// Checks for balance (uniform brackets), extracts arguments, handles both unary and binary operations, and calculates the result
// If the expression provided is not well defined, alerts an error message
function calculateExpression(expression) {
  // If the given expression is a simple number, store it as the last calculated value and return it
  if (parseFloat(expression)) {
    lastCalculatedValue = parseFloat(expression);
    return lastCalculatedValue;
  }

  let index = -1; // will be incremented on isBracketsUniform
  // Keep track of both open and closing bracket indexes
  let closeBracketIndex = [];
  let openBracketIndex = [];
  const regex = /^([a-zA-Z]+)/g; // Regex to match the first alphabetical characters of the expression (unary operator)
  const regexOperator = expression.match(regex); // Find the unary operator in the expression if exists

  // Use the isBracketsUniform function to check if the expression provided is well defined (in terms of brackets), if it isn't return an alert error message.
  if (
    !isBracketsUniform(expression, index, openBracketIndex, closeBracketIndex)
  ) {
    return invalidExpression;
  }

  // If the first character of the expression is a binary operator
  if (isBinaryOperator(expression[0])) {
    const { operator, arg1, arg2 } = binaryPreparation(
      expression,
      closeBracketIndex
    );
    if (
      typeof operator === "string" &&
      typeof arg1 === "number" &&
      typeof arg2 === "number"
    ) {
      finalResult = performBinaryCalculation(operator, arg1, arg2);
      lastCalculatedValue = finalResult;
    } else {
      return invalidExpression;
    }
    // If the first character was not a binary operator, check if it is a unary operator
  } else if (isUnaryOperator(regexOperator)) {
    const { operator, arg } = unaryPreparation(expression, openBracketIndex);
    if (typeof operator === "string" && typeof arg === "number") {
      finalResult = performUnaryCalculation(operator, arg);
      lastCalculatedValue = finalResult;
    } else {
      return invalidExpression;
    }
  } else {
    finalResult = invalidExpression;
  }

  return finalResult;
}

// AVM
function assignValueToMemory(memoryName) {
  // Atribui o valor da última expressão calculada a uma memória existente
  if (memoryName && memories.hasOwnProperty(memoryName)) {
    memories[memoryName] = lastCalculatedValue.toFixed(2);
    alert(`${memoryName}: ${memories[memoryName]}`);
  } else {
    alert(memoryNotDefined);
  }
}

// AM
function addMemory(memoryName) {
  // Adiciona uma nova memória, com o nome fornecido
  if (memoryName) {
    memories[memoryName] = "0.00";
    alert(`${memoryCreated} ${memoryName}`);
  }
}

// Função principal
function runCalculator() {
  const userInput = prompt(mainPrompt);
  const command = userInput.split(" ")[0]; //Gets hold of the first set of characters (command)
  const argument = userInput.split(" ")[1]; //Gets hold of the second set of characters (argument)
  const expression = [...userInput].splice(3).join(""); // Exclusive use for "CE"

  switch (command.toUpperCase()) {
    // Display the exit message and exits the program
    case "S":
      alert(exitMessage);
      break;
    case "A":
      // Display the help message and recursively call the function again
      alert(help);
      runCalculator();
      break;
    case "VM":
      // gets the memory value based on user input and recursively call the function again
      getMemoryValue(argument);
      runCalculator();
      break;
    case "LM":
      // Shows all the memories available and recursively call the function again
      showMemories();
      runCalculator();
      break;
    case "CE":
      // Calculate the expression proviced by the user and round the result if it's a number
      // displays the result and recursively call the function again
      let result = calculateExpression(expression);
      if (parseFloat(result)) {
        result = roundNumber(result);
      }
      alert(result);
      runCalculator();
      break;
    case "AVM":
      // Assigns the last calculated value to an already existing memory and recursively call the function again
      assignValueToMemory(argument);
      runCalculator();
      break;
    case "AM":
      // Adds a new memory with the name provided by the user and recursively call the function again
      addMemory(argument);
      runCalculator();
      break;
    default:
      // When the input provided is invalid, display a message alerting the
      // user of that fact and recursively call the function again
      alert(invalidOption);
      runCalculator();
  }
}

// Start
runCalculator();
