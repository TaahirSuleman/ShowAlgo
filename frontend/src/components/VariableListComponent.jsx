import { useState, useEffect } from 'react';
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
    arraysState
    }){

    let [updating, setUpdating] = useState("");
    let [variablesState, setVariablesState] = useState([]);
    const [counter, setCounter] = useState(0);

    const delay = ms  => new Promise(res => setTimeout(res, ms));

    useEffect(() => {
      const performOperations = () => {
      if (indexState > -1 && indexState < movements.length && !pauseState){
          if (movements[indexState].operation == "set"){
              updateVariablesState(movements[indexState].type, movements[indexState].value, movements[indexState].varName);
              setOutput((prev) => {return [...prev, movements[indexState].description]});
              const timeoutId2 = setTimeout(() => {
                  setIndexState((i)=>{return i+1});
              }, speedState*1000 );
              return () => clearTimeout(timeoutId2);
          }

          else if (movements[indexState].operation == "get"){
            arraysState.forEach((currentValue) => {
              if (currentValue.name == movements[indexState].varName){
                updateVariablesState(movements[indexState].type, (currentValue.values)[movements[indexState].index].substring((currentValue.values)[movements[indexState].index].indexOf("++")+2,(currentValue.values)[movements[indexState].index].indexOf("-")), movements[indexState].setName);
                return
              }
            })
          }
      }
    }
    performOperations();
      
  }, [indexState, pauseState])

    let updateVariablesState = async (type , value , name) => {
        setVariablesState((prevVariablesState) => {
            let variables = [...prevVariablesState];
            const indexState = variables.findIndex(variable => variable.name === name);
            if (indexState !== -1) {
                variables[indexState] = {
                    ...variables[indexState],
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
        <div className="variables-container" style={{width:"300px"}}>
            <ul className="ul-variables">
                <li style={{backgroundColor: "hsla(120, 50%, 20%, 1)"}} className="list-items">
                    <p>VARIABLES WILL APPEAR HERE</p>
                </li>
            </ul>
        </div>
        )
    }
    return(
        <div className="variables-container">
      <ul className="ul-variables">
        {variablesState.map((variable) => (
          <motion.li className="list-items"
            layout
            key={variable.name + counter}
            style={{ borderRadius: updating === variable.name ? "8px": "3px",
                     border: updating === variable.name ? "5px solid black": "1px solid red"
             }}
            animate={updating === variable.name ? { backgroundColor: ["hsla(39, 100%, 50%, 0)", "hsla(39, 100%, 50%, 0.5)", "hsla(194.7, 53.2%, 79.0%, 0.4)"] }: {backgroundColor: ["hsla(39, 100%, 50%, 0)", "hsla(39, 100%, 50%, 0)", "hsla(39, 100%, 50%, 0)"]}}
            transition={{ duration: speedState }}
          >
            <p>{"(" + variable.type + ") " + variable.name + " = " + variable.value}</p>
          </motion.li>
        ))}
      </ul>
    </div>
    )

}


export default VariableListComponent;