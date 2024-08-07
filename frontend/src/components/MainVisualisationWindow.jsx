import VariableListComponent from "./VariableListComponent";
import IfVisualisationComponent from "./IfVisualisationComponent";
import ArrayComponent from "./ArrayComponent";
import { useState, useEffect } from 'react';
import '../styles/App.css';


function MainVisualisationWindow({
    output,
    setOutput, 
    movementsState, 
    speedState, 
    indexState, 
    setIndexState, 
    pauseState,
    bufferState,
    setPauseState
    })
    {
    useEffect(()=>{
        console.log(pauseState)
    }, [pauseState])
    const [arraysState, setArraysState] = useState([]); // {name, values, locations}
    const genericOperations = ["else","print"];
    useEffect(() => {
        const performOperations = () => {
            if (indexState > -1 && indexState < movementsState.length && !pauseState) {
                const movement = movementsState[indexState];
                
                if (movement.operation === "create") {
                    const valuesArr = movement.value.map((value, i) =>
                        `${movement.varName}++${value}-${i}`
                    );
                    const locationsArr = movement.value.map((_, i) => i);
                    
                    setArraysState((pArr) => {
                        return [...pArr, { name: movement.varName, values: valuesArr, locations: locationsArr }];
                    });
                    
                    const timeoutId = setTimeout(() => {
                        setOutput((prev) => [...prev, movement.description]);
                        setIndexState((i) => i + 1);
                    }, speedState * 1000);
    
                    return () => clearTimeout(timeoutId);
                }
    
                if (genericOperations.includes(movement.operation)) {
                    if (movement.operation === "print") {
                        setOutput((prev) => [...prev, `colour__(OUTPUT) ${movement.literal}`]);
                        setOutput((prev) => [...prev, movement.description]);
    
                        const timeoutId1 = setTimeout(() => {
                            if (bufferState) {
                                setPauseState(true); // Toggle pause if buffer is true
                            }
                            setIndexState((prev) => prev + 1);
                        }, speedState * 1000);
    
                        return () => clearTimeout(timeoutId1);
                    } else {
                        setOutput((prev) => [...prev, movement.description]);
    
                        const timeoutId2 = setTimeout(() => {
                            setIndexState((prev) => prev + 1);
                        }, speedState * 1000);
    
                        return () => clearTimeout(timeoutId2);
                    }
                }
            }
        };
    
        // Execute the operations function
        performOperations();
    }, [indexState, pauseState]);

    return(
        <div className="MainVisualisationWindow">
        <VariableListComponent
            movements={movementsState}
            speedState ={speedState}
            indexState={indexState}
            setIndexState={setIndexState}
            pauseState = {pauseState}
            setPauseState = {setPauseState}
            arraysState = {arraysState}
            setOutput = {setOutput}
            bufferState = {bufferState}
        />
        <div className="if-array-container">
            <IfVisualisationComponent
                movements={movementsState}
                speedState ={speedState}
                indexState={indexState}
                setIndexState={setIndexState}
                pauseState = {pauseState}
                setPauseState = {setPauseState}
                setOutput = {setOutput}
                bufferState = {bufferState}
            />
            {arraysState.map((array, i) => {
                return (
                    <ArrayComponent
                    key = {array.name}
                    arrayName = {array.name}
                    movements={movementsState}
                    arrayState = {arraysState[i]}
                    arraysState = {arraysState}
                    speedState ={speedState}
                    indexState={indexState}
                    setIndexState={setIndexState}
                    pauseState = {pauseState}
                    setPauseState = {setPauseState}
                    setOutput = {setOutput}
                    bufferState = {bufferState}
                    />
                )
            })}
            
        </div>
    </div>
    )
}

export default MainVisualisationWindow