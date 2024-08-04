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
    const [arraysState, setArraysState] = useState([]);
    const genericOperations = ["else","print"];
    useEffect(()=>{
        console.log("index: "+indexState)
        if(indexState >-1 && indexState < movementsState.length && !pauseState){
        
            if (movementsState[indexState].operation === "create"){
                console.log("here is the index: "+indexState)
                let valuesArr = [];
                let locationsArr = [];
                for (let i = 0; i < movementsState[indexState].value.length; i++) {
                    valuesArr.push(movementsState[indexState].varName + "++" + movementsState[indexState].value[i] + "-" + i);
                    locationsArr.push(i);
                }
                setArraysState((pArr) =>{
                    let tempArr = [...pArr];
                    tempArr.push({name: movementsState[indexState].varName, values: valuesArr, locations:locationsArr});
                    return tempArr;
                })
                const timeoutId = setTimeout(()=> {
                setOutput((prev) => {return [...prev, movementsState[indexState].description]});
                if (bufferState){
                    setPauseState(!pauseState)
                }
                setIndexState((i)=>{return i+1})
                }, speedState*1000)
                return () => clearTimeout(timeoutId);
            }

            if (genericOperations.includes(movementsState[indexState].operation)){ // Check for generic operations that need no animation but need a print.
                if (movementsState[indexState].operation === "print"){
                    setOutput((prev) => {return [...prev, "colour__(OUTPUT) "+movementsState[indexState].literal]});
                    setOutput((prev) => {return [...prev, movementsState[indexState].description]});
                    const timeoutId1 = setTimeout(() => {
                        if (bufferState == true){
                            setPauseState(!pauseState)
                          }
                        setIndexState((prev) => prev + 1);
                    }, speedState * 1000 );
                    return () => clearTimeout(timeoutId1);
                }
                else{
                    setOutput((prev) => {return [...prev, movementsState[indexState].description]});
                    const timeoutId2 = setTimeout(() => {
                        if (bufferState == true){
                            setPauseState(!pauseState)
                          }
                        setIndexState((prev) => prev + 1);
                    }, speedState * 1000 );
                    return () => clearTimeout(timeoutId2);
                }
            }
    }
    }, [indexState, pauseState])

    return(
        <div className="MainVisualisationWindow">
        <VariableListComponent
            movements={movementsState}
            speedState ={speedState}
            indexState={indexState}
            setIndexState={setIndexState}
            pauseState = {pauseState}
            setPauseState = {setPauseState}
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