import VariableListComponent from "./VariableListComponent";
import IfVisualisationComponent from "./IfVisualisationComponent";
import LoopNotificationComponent from "./LoopNotificationComponent";
import ArrayComponent from "./ArrayComponent";
import StringVisualisationComponent from "./StringVisualisationComponent";
import { useState, useEffect } from "react";
import "../styles/App.css";
import { Box } from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
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
}) {
    useEffect(() => {
        console.log(indexState);
        console.log("ACTUAL SPEED STATE: " + speedState);
    }, [indexState, speedState]);
    const [arraysState, setArraysState] = useState([]); // {name, values, locations, type}
    const [variablesState, setVariablesState] = useState([]);
    const genericOperations = [
        "else",
        "print",
        "define",
        "function_call",
        "return",
    ];

    useEffect(() => {
        const performOperations = () => {
            if (
                indexState > -1 &&
                indexState < movementsState.length &&
                !pauseState
            ) {
                const movement = movementsState[indexState];
                if (movement.operation === "create") {
                    // Future switch case here for different data structure types. For now just one if.
                    if (movement.dataStructure === "array") {
                        let varCheck = variablesState.findIndex(
                            (obj) => obj.name === movement.varName
                        );
                        console.log(varCheck + " THE VAR CHECK");
                        if (varCheck != -1) {
                            setVariablesState((varState) => {
                                let newVars = [...varState];
                                // Remove the element at the found index
                                newVars.splice(varCheck, 1);
                                console.log(newVars); // Logging the updated array after deletion
                                return newVars;
                            });
                        }
                        let valuesArr;
                        switch (movement.type) {
                            case "string":
                                valuesArr = movement.value.map(
                                    (value, i) =>
                                        `${movement.varName}++"${value}"-${i}`
                                );
                                break;
                            case "number":
                                valuesArr = movement.value.map(
                                    (value, i) =>
                                        `${movement.varName}++${value}-${i}`
                                );
                                break;
                            case "boolean":
                                valuesArr = movement.value.map(
                                    (value, i) =>
                                        `${
                                            movement.varName
                                        }++${value.toString()}-${i}`
                                );
                        }
                        const locationsArr = movement.value.map((_, i) => i);
                        setArraysState((prevArr) => {
                            const updatedArray = {
                                name: movement.varName,
                                values: valuesArr,
                                locations: locationsArr,
                                type: movement.type,
                            };
                            // Find the index of the existing array
                            const existingIndex = prevArr.findIndex(
                                (array) => array.name === movement.varName
                            );
                            if (existingIndex !== -1) {
                                // Replace the existing array with the updated one
                                const newArrayState = prevArr.map(
                                    (array, index) =>
                                        index === existingIndex
                                            ? updatedArray
                                            : array
                                );
                                return newArrayState;
                            } else {
                                // Add the new array
                                return [...prevArr, updatedArray];
                            }
                        });
                    }
                    setOutput((prev) => [...prev, movement.description]);
                    const timeoutId = setTimeout(() => {
                        setIndexState((i) => i + 1);
                    }, speedState * 1000);

                    return () => clearTimeout(timeoutId);
                }

                if (genericOperations.includes(movement.operation)) {
                    if (movement.operation === "print") {
                        setOutput((prev) => [
                            ...prev,
                            `colourRed__(OUTPUT) ${movement.literal}`,
                        ]);
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
        <Box
            className="MainVisualisationWindow"
            width="100%"
            overflow="auto"
            height="100%"
        >
            <VariableListComponent
                movements={movementsState}
                speedState={speedState}
                indexState={indexState}
                setIndexState={setIndexState}
                pauseState={pauseState}
                setPauseState={setPauseState}
                arraysState={arraysState}
                setArraysState={setArraysState}
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
                <AnimatePresence>
                    {arraysState.map((array, i) => (
                        <ArrayComponent
                            key={array.name}
                            arrayName={array.name}
                            movements={movementsState}
                            arrayState={array}
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
                </AnimatePresence>
            </div>
        </Box>
    );
}

export default MainVisualisationWindow;
