import VariableListComponent from "./VariableListComponent";
import IfVisualisationComponent from "./IfVisualisationComponent";
import ArrayComponent from "./ArrayComponent";
import { useState, useEffect } from 'react';
import '../styles/App.css';


function MainVisualisationWindow({output, setOutput, movementsState, speedState, indexState, setIndexState}){
    //let [indexState, setIndexState] = useState(-1);
    //let [speedState, setSpeedState] = useState(2); // 2 is the default speed.
    let [pausedState, setPausedState] = useState(false);
    useEffect(()=>{
        console.log(pausedState)
    }, [pausedState])
    //let [movementsState, setMovementsState] = useState(movements);
    const [arraysState, setArraysState] = useState([]);
    const genericOperations = ["else","print"];
    useEffect(()=>{
        console.log(indexState)
        if(indexState >-1 && indexState < movementsState.length){
       
            if (movementsState[indexState].operation === "create"){
                console.log("here is the index: "+indexState)
                let valuesArr = [];
                let locationsArr = [];
                for (let i = 0; i < movementsState[indexState].initialValues.length; i++) {
                    valuesArr.push(movementsState[indexState].varName + "++" + movementsState[indexState].initialValues[i] + "-" + i);
                    locationsArr.push(i);
                }
                setArraysState((pArr) =>{
                    let tempArr = [...pArr];
                    tempArr.push({name: movementsState[indexState].varName, values: valuesArr, locations:locationsArr});
                    return tempArr;
                })
                const timeoutId = setTimeout(()=> {
                setOutput((prev) => {return [...prev, movementsState[indexState].description]});
                setIndexState((i)=>{return i+1})
                }, speedState*1000)
                return () => clearTimeout(timeoutId);
            }

            if (genericOperations.includes(movementsState[indexState].operation)){ // Check for generic operations that need no animation but need a print.
                if (movementsState[indexState].operation === "print"){
                    setOutput((prev) => {return [...prev, "colour__(OUTPUT) "+movementsState[indexState].literal]});
                    setOutput((prev) => {return [...prev, movementsState[indexState].description]});
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
            setOutput = {setOutput}
        />
        <div className="if-array-container">
            <IfVisualisationComponent
                movements={movementsState}
                speedState ={speedState}
                indexState={indexState}
                setIndexState={setIndexState}
                pausedState = {pausedState}
                setOutput = {setOutput}
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
                    pausedState = {pausedState}
                    setOutput = {setOutput}
                    />
                )
            })}
            
        </div>
        <button onClick={() => setIndexState(0)}>Click Here</button>
    </div>
    )
}

export default MainVisualisationWindow