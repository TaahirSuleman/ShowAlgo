import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import '../styles/App.css'


function IfVisualisationComponent(
  {
    movements,
    speedState,
    indexState,
    setIndexState,
    pauseState,
    setOutput,
    bufferState,
    setPauseState
  }){
      const [ifStatement, setIfStatement] = useState({   
        "operation": "if",  
        "condition": "This is the starter If",   
        "result": false,  
        "timestamp": "2024-07-09T12:02:00Z",  
        "description": "Checked if x is greater than 5."  
        });
      const [resultColourState, setResultColourState]= useState("grey");
      
      const delay = ms => new Promise(res => setTimeout(res, ms));

      useEffect(()=>{
        const performOperations = () => {
        if (indexState > -1 && indexState < movements.length && !pauseState){
          const movement = movements[indexState];
          if (movement.operation === "if"){
            setIfStatement(movement);
            const timeoutId1 = setTimeout(() => {
              if (movement.result === true) {
                setResultColourState("green");
              } else {
                setResultColourState("red");
              }
    
              const timeoutId2 = setTimeout(() => {
                setResultColourState("grey");
              }, speedState * 1000 / 2);
    
              const timeoutId3 = setTimeout(() => {
                setOutput((prev) => {return [...prev, movements[indexState].description]});
                setIndexState((prev) => prev + 1);
              }, speedState * 1000 /2 );
    
              return () => {
                clearTimeout(timeoutId2);
                clearTimeout(timeoutId3);
              };
            }, speedState * 1000 /2);
    
            return () => clearTimeout(timeoutId1);
        }
      }
    }
    performOperations();

      }, [indexState, pauseState])
    return(
        <div className="if-vis-window">
            <motion.div
                className="notification-blurb"
                layout
                style= {{backgroundColor: resultColourState}}
                initial = {{borderRadius: 15}}
                animate={{
                borderRadius: resultColourState === "green" || resultColourState === "red" ? 50 : 15
                }}

            >
                <p>The if statement asks: </p>
                <p style={{ fontSize: '35px', fontWeight: 'bold' }}>{(ifStatement.condition != "This is the starter If") ? ifStatement.condition+"?" : "The if statements will be shown here!"}</p>
            </motion.div>
        </div>
    )
}
export default IfVisualisationComponent;