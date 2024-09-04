import { useState, useEffect, useRef } from 'react';
import { motion, useForceUpdate } from 'framer-motion';
import '../styles/App.css'

function VariableListComponent({
    movements,
    speedState,
    indexState,
    setIndexState,
    pauseState,
    setOutput,
    bufferState,
    setPauseState,
    arraysState,
    setArraysState,
    variablesState,
    setVariablesState,
    }){

    let [updating, setUpdating] = useState("");
    const [counter, setCounter] = useState(0);
    
    const varRef = useRef();

    const delay = ms  => new Promise(res => setTimeout(res, ms));

    useEffect(() => {
      const performOperations = () => {
        if (indexState > -1 && indexState < movements.length && !pauseState) {
          if (movements[indexState].operation == "set") {

            if (typeof movements[indexState].value != "object") {
              varRef.current.scrollIntoView({
                behavior: "smooth",
                block: "nearest",
                inline: "center",
              });
              updateVariablesState(
                movements[indexState].type,
                movements[indexState].value,
                movements[indexState].varName
              );
              let arrayIndexCheck = arraysState.findIndex((obj) => obj.name === movements[indexState].varName);
              if (arrayIndexCheck != -1){
                console.log(arrayIndexCheck+" ARRAY INDEX CHECK")
                setArraysState( (arrState)=>{
                  let newArrs = [...arrState];
                  newArrs.splice(arrayIndexCheck, 1);
                  console.log(newArrs); // Logging the updated array after deletion
                  return newArrs; 
                })
              }
              setOutput((prev) => {
                return [...prev, movements[indexState].description];
              });
              const timeoutId2 = setTimeout(() => {
                setIndexState((i) => {
                  return i + 1;
                });
              }, speedState * 1000);
              return () => clearTimeout(timeoutId2);
            }
            else {
              let innerMovement = movements[indexState].value
              switch (movements[indexState].value.operation){
                case "substring":
                  updateVariablesState(
                    "string",
                    innerMovement.result,
                    movements[indexState].varName
                  )
                break;
                case "get":
                  if (innerMovement.type === "string"){
                    updateVariablesState(
                      "string",
                      innerMovement.result,
                      movements[indexState].varName
                    )
                    const timeoutId2 = setTimeout(() => {
                      setIndexState((i) => {
                        return i + 1;
                      });
                    }, speedState * 1000);
                    return () => clearTimeout(timeoutId2);
                  }
                  else if (innerMovement.type === "array"){
                    let arrayCheck = arraysState.find((obj) => obj.name === innerMovement.varName);
                    updateVariablesState(
                      arrayCheck.type,
                      innerMovement.result,
                      movements[indexState].varName
                    )
                    //Index updating is in ArrayComponent for animation duration management for future.
                  }
              }
            }
          } 
         }
      };
      performOperations();
    }, [indexState, pauseState]);

    let updateVariablesState = async (type , value , name) => {
        setVariablesState((prevVariablesState) => {
            let variables = [...prevVariablesState];
            const index = variables.findIndex(variable => variable.name === name);
            if (index !== -1) {
                variables[index] = {
                    ...variables[index],
                    value: (type === "string" ? "'"+value+"'" : value),
                };                
            } else {
                variables.push({
                    type: type,
                    value: (type === "string" ? "'"+value+"'" : value),
                    name: name,
                });
            }

            setUpdating(name);
            setCounter(c => c+1)
            return variables;
        });
    }

    if (variablesState.length == 0){
        return(
        <div className="variables-container" style={{width:"200px"}} ref={varRef}>
            <ul className="ul-variables">
                <li style={{backgroundColor: "#276749",textAlign:"center"}} className="list-items">
                    <p>VARIABLES WILL APPEAR HERE</p>
                </li>
            </ul>
        </div>
        )
    }
    return(
        <div className="variables-container" ref={varRef}>
      <ul className="ul-variables">
        {variablesState.map((variable) => (
          <motion.li className="list-items"
            layout
            key={variable.name + counter}
            style={{ borderRadius: updating === variable.name ? "7px": "5px",
                     border: updating === variable.name ? "4px solid rgba(0, 0, 0, 0.80)": "2px solid #9AE6B4",
                     wordWrap: 'break-word', overflowWrap: 'break-word', wordBreak: 'break-all'
             }}
            animate={updating === variable.name ? { color: ['white', 'rgba(0, 0, 0, 0.80)', 'rgba(0, 0, 0, 0.80)'], backgroundColor: ["hsla(39, 100%, 50%, 0)", "hsla(39, 100%, 50%, 0.5)", "hsla(194.7, 53.2%, 79.0%, 0.4)"] }: {color: ['white', 'white', 'white'], backgroundColor: ["hsla(39, 100%, 50%, 0)", "hsla(39, 100%, 50%, 0)", "hsla(39, 100%, 50%, 0)"]}}
            transition={{ duration: speedState }}
          >
            <p style={{fontSize: '13px'}}>{"(" + variable.type + ") " + variable.name + " = " + variable.value}</p>
          </motion.li>
        ))}
      </ul>
    </div>
    )

}


export default VariableListComponent;