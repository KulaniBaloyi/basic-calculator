import React,{useReducer} from "react";
import './App.css';
import DigitButton from "./DigitButton";
import OperationButton from "./OperationButton";
//ICONS
import { FaPercent,FaDivide,FaEquals,FaMinus,FaPlus,FaTimes,FaSquareRootAlt, } from 'react-icons/fa';
import { TiPi } from "react-icons/ti";
import { RiSuperscript } from "react-icons/ri";
import { VscDebugStackframeDot} from "react-icons/vsc";

export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CHOOSE_OPERATION: "choose-operation",
  CLEAR: "clear",
  DELETE_DIGIT: "delete-digit",
  EVALUATE: "evaluate",
}

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite == true) {
        return {
          ...state,
          currentOperand: `${state.currentOperand || ""} ${payload.digit}`,
          overwrite: false,
        }
      }
      
      //makes sure no 01214 or 0012458 always 12050
      if (payload.digit === "0" && state.currentOperand === "0") {
        return state
      }
      //Makes sure no 0..1223.25
      if (payload.digit === "." && state.currentOperand.includes(".")) {
        return state
      }
       
      //current operand is whatever is in current operand plus selected number. this allows you to type number out
      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`,
      }

    case ACTIONS.CHOOSE_OPERATION:
      //if theres nothing in all operands just do nothing basically
      if (state.currentOperand == null && state.previousOperand == null) {
        return state; 
      }
      //when theres something in current operand but not in previous just get selected operation and set current to previous
      if (state.previousOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          currentOperand: `${state.currentOperand} ${state.operation}`,
        }  
      }

      //Clears the state everywere pretty self explanitory why do i feel the need to bloody comment everything ffs
    case ACTIONS.CLEAR:
      return {}

    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite ==true) {
        return {
          ...state,
          overwrite: false,
          currentOperand: null,
        }
      }
      if (state.currentOperand == null) return state
      if (state.currentOperand.length === 1) {
        return { ...state, currentOperand: null }
      }

      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1),
      }
    case ACTIONS.EVALUATE:
      //basically do nothing if the big 3 arent filled
      if (
        state.operation == null ||
        state.currentOperand == null ||
        state.previousOperand == null
      ) {
        return state
      }
      //this will only run if big 3 are filled
      //when we click Equals hopefully 
      //hopefully this returns our selected numbers and operation in the form of previous operand like so 5+6+6-2
      //and returns the answer in the form of current operand
      
      return {
        ...state,
        overwrite: true,
        previousOperand: `${state.previousOperand} ${payload.operation} ${state.currentOperand}` ,
        operation: null,
        currentOperand: evaluate(state.currentOperand,state.previousOperand,state.operation),
      }
  }
}

function evaluate(currentOperand,previousOperand, operation){
  const prev = parseFloat(previousOperand);
  const current = parseFloat(currentOperand);
  if(isNaN(prev)||isNaN(current)){
    return ""
  } 
  let computation="";
  switch(operation){
    case "+":
      computation=prev+current;
      break;
      case "-":
        computation=prev-current;
        break;
        case "/":
      computation=prev/current;
      break;
      case "*":
      computation=prev*current;
      break;
  }
  return computation.toString();
}

function App() {
  const [{ currentOperand,previousOperand, operation }, dispatch] = useReducer(
    reducer,
    {}
  )

  return (
      <div className="App">
        <div className="calculator-grid">
          <div className="output">
            <div className="previous-operand">{previousOperand}</div>
            <div className="current-operand">{currentOperand}{operation}</div>
          </div>
  
        <OperationButton operation="Deg" dispatch={dispatch}/>
        <OperationButton operation="x!" dispatch={dispatch}/>
        <OperationButton operation="%" dispatch={dispatch}/>
        <OperationButton operation="(" dispatch={dispatch}/>
        <OperationButton operation=")" dispatch={dispatch}/>
        <button onClick={()=> dispatch({type: ACTIONS.DELETE_DIGIT})}>DEL</button>
        <button onClick={()=> dispatch({type: ACTIONS.CLEAR})}>CE</button>
  
        <OperationButton operation="Inv" dispatch={dispatch}/>
        <OperationButton operation="Sin" dispatch={dispatch}/>
        <OperationButton operation="In" dispatch={dispatch} />
        <DigitButton digit="7" dispatch={dispatch}/>
        <DigitButton digit="8" dispatch={dispatch}/>
        <DigitButton digit="9" dispatch={dispatch}/>
        <OperationButton operation="/" dispatch={dispatch}/>
  
        <OperationButton operation={<TiPi/>} dispatch={dispatch}/>
        <OperationButton operation="cos" dispatch={dispatch}/>
        <OperationButton operation="log" dispatch={dispatch}/>
        <DigitButton digit="4" dispatch={dispatch}/>
        <DigitButton digit="5" dispatch={dispatch}/>
        <DigitButton digit="6" dispatch={dispatch}/>
        <OperationButton operation="*" dispatch={dispatch}/>
  
        <OperationButton operation="e" dispatch={dispatch}/>
        <OperationButton operation="tan" dispatch={dispatch}/>
        <OperationButton operation={<FaSquareRootAlt/>} dispatch={dispatch}/>
        <DigitButton digit="1" dispatch={dispatch}/>
        <DigitButton digit="2" dispatch={dispatch}/>
        <DigitButton digit="3" dispatch={dispatch}/>
        <OperationButton operation="-" dispatch={dispatch}/>
  
        <OperationButton operation="EXP" dispatch={dispatch}/>
        <OperationButton operation="ANS" dispatch={dispatch}/>
        <OperationButton operation={<RiSuperscript/>} dispatch={dispatch}/>
        <DigitButton digit="0" dispatch={dispatch}/>
        <DigitButton digit="." dispatch={dispatch}/>
        <button onClick={()=> dispatch({type: ACTIONS.EVALUATE})}>=</button>
        <OperationButton operation="+" dispatch={dispatch}/>
      </div>
      </div>
  )
}
export default App;