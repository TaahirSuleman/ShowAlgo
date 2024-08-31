import VariableListComponent from "./VariableListComponent";
import IfVisualisationComponent from "./IfVisualisationComponent";
import LoopNotificationComponent from "./LoopNotificationComponent";
import ArrayComponent from "./ArrayComponent";
import StringVisualisationComponent from "./StringVisualisationComponent"
import { useState, useEffect } from 'react';
import '../styles/App.css';
import { Box } from "@chakra-ui/react";


function MainVisualisationWindow({
    output,
    setOutput, 
    movementsState, 
    speedState, 
    indexState, 
    setIndexState, 
    pauseState,
    bufferState,
    setPauseState,
    })
    {
    useEffect(()=>{
        console.log(indexState)
        console.log("ACTUAL SPEED STATE: "+speedState)
    }, [indexState,speedState])
    const [arraysState, setArraysState] = useState([]); // {name, values, locations}
    const [variablesState, setVariablesState] = useState([]);
    const genericOperations = ["else","print"];

    useEffect(() => {
        const performOperations = () => {
            if (indexState > -1 && indexState < movementsState.length && !pauseState) {
                const movement = movementsState[indexState];
                if (movement.operation === "create_array") {
                    const valuesArr = movement.value.map((value, i) =>
                        `${movement.varName}++${value}-${i}`
                    );
                    const locationsArr = movement.value.map((_, i) => i);
                    
                    setArraysState((pArr) => {
                        return [...pArr, { name: movement.varName, values: valuesArr, locations: locationsArr }];
                    });
                    setOutput((prev) => [...prev, movement.description]);
                    const timeoutId = setTimeout(() => {

                        setIndexState((i) => i + 1);
                    }, speedState * 1000);
    
                    return () => clearTimeout(timeoutId);
                }
    
                if (genericOperations.includes(movement.operation)) {
                    if (movement.operation === "print") {
                        setOutput((prev) => [...prev, `colourRed__(OUTPUT) ${movement.literal}`]);
                        setOutput((prev) => [...prev, movement.description]);
    
                        const timeoutId1 = setTimeout(() => {
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

    return (
        <Box className="MainVisualisationWindow" width="100%" overflow="auto" height="100%">
          <VariableListComponent
            movements={movementsState}
            speedState={speedState}
            indexState={indexState}
            setIndexState={setIndexState}
            pauseState={pauseState}
            setPauseState={setPauseState}
            arraysState={arraysState}
            setOutput={setOutput}
            bufferState={bufferState}
            variablesState={variablesState}
            setVariablesState={setVariablesState}
          />
          <div className="if-array-container">
            <div className="top-row">
              <IfVisualisationComponent
                movements={movementsState}
                speedState={speedState}
                indexState={indexState}
                setIndexState={setIndexState}
                pauseState={pauseState}
                setPauseState={setPauseState}
                setOutput={setOutput}
                bufferState={bufferState}
              />
              <LoopNotificationComponent 
                movements={movementsState}
                speedState={speedState}
                indexState={indexState}
                setIndexState={setIndexState}
                pauseState={pauseState}
                setPauseState={setPauseState}
                arraysState={arraysState}
                setOutput={setOutput}
                bufferState={bufferState}
              />
            </div>
            <StringVisualisationComponent
              movements={movementsState}
                speedState={speedState}
                indexState={indexState}
                setIndexState={setIndexState}
                pauseState={pauseState}
                setPauseState={setPauseState}
                arraysState={arraysState}
                setOutput={setOutput}
                variablesState={variablesState}
                setVariablesState={setVariablesState}
            />
            {arraysState.map((array, i) => (
              <ArrayComponent
                key={array.name}
                arrayName={array.name}
                movements={movementsState}
                arrayState={arraysState[i]}
                arraysState={arraysState}
                setArraysState={setArraysState}
                speedState={speedState}
                indexState={indexState}
                setIndexState={setIndexState}
                pauseState={pauseState}
                setPauseState={setPauseState}
                setOutput={setOutput}
                bufferState={bufferState}
              />
            ))}
          </div>
        </Box>
      );
}

export default MainVisualisationWindow