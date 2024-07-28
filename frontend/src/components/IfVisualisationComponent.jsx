import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import '../styles/App.css'


function IfVisualisationComponent(props ){//{ pausedState: boolean; speedState: number; movements: any; indexState: number; setIndexState: any; }
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
        if (props.pausedState === true){return;}
        if (props.indexState > -1 && props.indexState < props.movements.length){
          const movement = props.movements[props.indexState];
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
              }, props.speedState * 1000 / 2);
    
              const timeoutId3 = setTimeout(() => {
                //props.setOutput(prev => [...prev, props.movements[props.indexState].description]);
                props.setIndexState((prev) => prev + 1);
              }, props.speedState * 1000 /2 );
    
              return () => {
                clearTimeout(timeoutId2);
                clearTimeout(timeoutId3);
              };
            }, props.speedState * 1000 /2);
    
            return () => clearTimeout(timeoutId1);
        }
      }
      }, [props.indexState, props.pausedState])
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
                    <button onClick={() => props.setIndexState(0)}></button>
                </div>
            )
}
export default IfVisualisationComponent;