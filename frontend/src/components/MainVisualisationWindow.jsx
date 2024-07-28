import VariableListComponent from "./VariableListComponent";
import IfVisualisationComponent from "./IfVisualisationComponent";
import ArrayComponent from "./ArrayComponent";
import { useState, useEffect } from 'react';
import '../styles/App.css';


function MainVisualisationWindow(props){
    let [indexState, setIndexState] = useState(-1);
    let [speedState, setSpeedState] = useState(3); // 2 is the default speed.
    let [pausedState, setPausedState] = useState(false);
    useEffect(()=>{
        console.log(pausedState)
    }, [pausedState])
    let movements = [{   
                    "operation": "if",  
                    "condition": "x > 5",   
                    "result": true,  
                    "timestamp": "2024-07-09T12:02:00Z",  
                    "description": "Checked if x is greater than 5."  
                    }, 
                    { 
                    "operation": "print", 
                    "isLiteral": true, 
                    "varName": null, 
                    "literal": "x is greater than 5", 
                    "timestamp": "2024-07-09T12:03:00Z", 
                    "description": "Printed 'x is greater than 5'." 
                    }, 
                    { 
                    "operation": "else", 
                    "timestamp": "2024-07-09T12:04:00Z", 
                    "description": "Else block not executed as condition was true." 
                    },
                    {
                    "operation": "set", 
                    "varName": "x", 
                    "type": "number", 
                    "value": 10,  
                    "timestamp": "2024-07-09T12:01:00Z",  
                    "description": "Set variable x to number 10." 
                    },
                    { 
                    "operation": "create",                   
                    "dataStructure": "array",                   
                    "initialValues": [1, 2, 3, 4,5,6,7,8,9,1,2,3,4,5,6],                   
                    "length": 4,                   
                    "id": "abcd",                   
                    "type": "int",                
                    "varName": "nums",                  
                    "timestamp": "2024-07-09T12:01:00Z",                   
                    "description": "Created an array named nums with initial values [1, 2, 3, 4]."                  
                    },   
                    {
                    "operation": "remove",
                    "dataStructure": "array",
                    "id": "abcd",
                    "varName": "nums",
                    "positionToRemove": 2,
                    "description": "Removed value at position 4 in array nums"
                    },                
                    {                   
                    "operation": "insert",                   
                    "dataStructure": "array",                   
                    "valueToInsert": 5,                   
                    "id": "abcd",                   
                    "varName": "nums",                  
                    "position": 4,                   
                    "timestamp": "2024-07-09T12:02:00Z",                   
                    "description": "Inserted value 5 at position 4 in array nums."                   
                    },
                    {
                    "operation": "swap",
                    "dataStructure": "array",
                    "firstPosition": 1,
                    "secondPosition": 3,
                    "targetArr": "nums",
                    "description": "Swapped values in position 1 and 3 in array nums."   
                    },
                    {
                    "operation": "set", 
                    "varName": "wordString", 
                    "type": "string", 
                    "value": "Hello World",  
                    "timestamp": "2024-07-09T12:01:00Z",  
                    "description": "Set variable y to string 'Wagwan World'." 
                    },
                    {
                    "operation": "set", 
                    "varName": "z", 
                    "type": "boolean", 
                    "value": "true",  
                    "timestamp": "2024-07-09T12:01:00Z",  
                    "description": "Set variable z to boolean true." 
                    },
                    {
                    "operation": "set", 
                    "varName": "wordString", 
                    "type": "string", 
                    "value": "Hello Again World",  
                    "timestamp": "2024-07-09T12:01:00Z",  
                    "description": "Set variable y to string 'Hello Again World'." 
                    },
                    
                    ]
    let [movementsState, setMovementsState] = useState(movements);
    const genericOperations = ["else","print"];
    useEffect(()=>{
        console.log(indexState)
        if(indexState >-1 && indexState < movementsState.length){
        if (genericOperations.includes(movementsState[indexState].operation)){
            if (movementsState[indexState].operation === "print"){
                console.log("HEHEHEHEHE")
                props.setOutput((prev) => {return [...prev, "colour__"+movementsState[indexState].literal]});
                props.setOutput((prev) => {return [...prev, movementsState[indexState].description]});
                const timeoutId1 = setTimeout(() => {
                    setIndexState((prev) => prev + 1);
                  }, speedState * 1000 );
                  return () => clearTimeout(timeoutId1);
            }
            else{
                const timeoutId2 = setTimeout(() => {
                    setIndexState((prev) => prev + 1);
                  }, speedState * 1000 );
                  return () => clearTimeout(timeoutId2);
            }
        }
    }
    }, [indexState])

    let updatePausedState = () =>{
        setPausedState(!pausedState)
    }

    return(
        <div className="MainVisualisationWindow">
        <VariableListComponent
            movements={movementsState}
            speedState ={speedState}
            indexState={indexState}
            setIndexState={setIndexState}
            pausedState = {pausedState}
            setOutput = {props.setOutput}
        />
        <div className="if-array-container">
            <IfVisualisationComponent
                movements={movementsState}
                speedState ={speedState}
                indexState={indexState}
                setIndexState={setIndexState}
                pausedState = {pausedState}
                setOutput = {props.setOutput}
            />
            <ArrayComponent
                movements={movementsState}
                speedState ={speedState}
                indexState={indexState}
                setIndexState={setIndexState}
                pausedState = {pausedState}
                setOutput = {props.setOutput}
            />
        </div>
        <button onClick={() => setIndexState(0)}>Click Here</button>
    </div>
    )
}

export default MainVisualisationWindow