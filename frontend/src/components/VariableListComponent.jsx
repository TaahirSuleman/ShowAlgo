import { useState, useEffect } from 'react';
import { motion, useForceUpdate } from 'framer-motion';
import '../styles/App.css'

function VariableListComponent(props){//{output; outputState; pausedState: boolean; speedState: number; movements: any; indexState: number; setIndexState: any; }
    let movements = props.movements;
    let focusedVar = {type: "NOTE",value:" It will be displayed here!",name:"Click on a variable"};
    let [updating, setUpdating] = useState("");
    let [variablesState, setVariablesState] = useState([]);
    let [isChanged, setIsChanged] = useState(false);
    let [focusedVariableState, setFocusedVariableState] = useState(focusedVar);

    const delay = ms  => new Promise(res => setTimeout(res, ms));

    useEffect(() => {
        let index = props.indexState;
        if (props.pausedState === true){return;}
        if (index > -1 && index < movements.length){
            if (props.movements[index].operation == "set"){
                updateVariablesState(props.movements[index].type, props.movements[index].value, props.movements[index].varName);
                const timeoutId2 = setTimeout(() => {
                    props.setOutput((prev) => {return [...prev, props.movements[props.indexState].description]});
                    props.setIndexState((i)=>{return i+1});
                }, props.speedState*1000 +100);
                return () => clearTimeout(timeoutId2);
            }
        }
        
    }, [props.indexState, props.pausedState])

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
            return variables;
        });
    }

    let changedIsChanged = async ()=>{
        setIsChanged(true);
        console.log("its changed")
        await delay(props.speedState*1000);
        console.log("its changed")
        setIsChanged(false);
    }

    let changeFocusedVariableState= (variable)=>{// {type:string,value:string,name:string,focused:boolean}
        setFocusedVariableState(variable)
        changedIsChanged();
    }

    if (variablesState.length == 0){
        return(
        <div className="variables-container" style={{width:"300px"}}>
            <ul className="ul-variables">
                <li style={{backgroundColor: "hsla(120, 50%, 20%, 1)"}}>
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
          <motion.li
            layout
            key={variable.name}
            style={{ borderRadius: updating === variable.name ? "8px": "3px",
                     border: updating === variable.name ? "5px solid black": "1px solid red"
             }}
            onClick={() => changeFocusedVariableState(variable)}
            animate={updating === variable.name ? { backgroundColor: ["hsla(39, 100%, 50%, 0)", "hsla(39, 100%, 50%, 0.5)", "hsla(194.7, 53.2%, 79.0%, 0.4)"] }: {backgroundColor: ["hsla(39, 100%, 50%, 0)", "hsla(39, 100%, 50%, 0)", "hsla(39, 100%, 50%, 0)"]}}
            transition={{ duration: props.speedState }}
          >
            <p>{"(" + variable.type + ") " + variable.name + " = " + variable.value}</p>
          </motion.li>
        ))}
      </ul>
      {/* <motion.div
        className="focused-variable"
        layoutId="underline"
        style={{ backgroundColor: isChanged ? "green" : "black" }}
        transition={{ duration: 1 }}
      >
        <p className="in-focus-text">{"(" + focusedVariableState.type + ") " + focusedVariableState.name + " = " + focusedVariableState.value}</p>
      </motion.div> */}
    </div>
    )

}


export default VariableListComponent;