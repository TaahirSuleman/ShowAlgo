import { useState, useEffect, useRef } from 'react';
import { motion, steps } from 'framer-motion';
import '../styles/App.css'

function StringVisualisationComponent({
    movements,
    speedState,
    indexState,
    setIndexState,
    pauseState,
    setOutput,
    bufferState,
    setPauseState,
    variablesState,
    setVariablesState
}){

    const [presentState, setPresentState] = useState(false);
    const [afterHighlight, setAfterHighlight] = useState("");
    const [highlighted, setHighlight] = useState("");
    const [beforeHighlight, setBeforeHighlight] = useState("");
    const [colouredState, setColouredState] = useState("white");
    const stringVisRef = useRef();
    

    useEffect(()=>{
        const performOperations = () => {
            if (indexState > -1 && indexState < movements.length && !pauseState){
                if (movements[indexState].operation === "set"){
                    if (typeof movements[indexState].value == "object"){
                        stringVisRef.current.scrollIntoView({
                            behavior: "smooth",
                            block: "nearest",
                            inline: "center",
                          });
                        let target = movements[indexState].value.source
                        let innerMovement = movements[indexState].value
                        let actualValue = (variablesState.find(obj => obj.name === target)).value.slice(1,-1);// Get rif of quotation marks
                        setHighlight(innerMovement.result)
                        setBeforeHighlight(actualValue.substring(0,innerMovement.start))
                        setAfterHighlight(actualValue.substring(innerMovement.end))
                        setPresentState(true)
                        let timeout = setTimeout(()=>{
                            setPresentState(false);
                        },speedState*1000)
                        return ()=>{clearTimeout(timeout)}
                        //INCREMENTING OF INDEX IS IN VARIABLELISTCOMPONENT
                    }
                }
            }
        }
        performOperations();
    },[indexState, pauseState])

    if (presentState){
      return (
        <motion.div
          className="string-visualisation-container"
          style={{fontSize:"35px",
          display: "inline", // Make the container inline to allow seamless text flow
            whiteSpace: "wrap", // Prevents line breaks if that's desired
        }}
          ref={stringVisRef}
          
        >
          <span>{beforeHighlight}</span>
          <motion.span layout  
          style={{textDecoration: "underline"}}
            animate={{
            color: [
                "#FFFFFF",
                "#D69E2E",
                "#FFFFFF",
                "#D69E2E",
                "#FFFFFF",
                "#FFFFFF",
                "#D69E2E",
            ],
            }}
            transition={{
            type: "tween",
            times: [0, 0.125, 0.250, 0.375, 0.5, 0.625, 0.750 , 0.875],
            duration: speedState * 0.66,
            }}
        >
            {highlighted}
          </motion.span>
          <span>{afterHighlight}</span>
        </motion.div>
      );
    }
    else {
        return(
        <motion.div
        layoutId="stringVis"
        ref={stringVisRef}
        >
        
        </motion.div>)
    }
    
}

export default StringVisualisationComponent;