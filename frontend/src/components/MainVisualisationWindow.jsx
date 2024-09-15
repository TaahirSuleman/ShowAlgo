/**
 * Author(s): Gregory Maselle
 * Date: September 2024
 * Description: This file describes the MainVisualisationWindow Component. This is the parent component of all components present within the visualisation view.
 * It is also responsible for handling pseudocode operations that do not necessarily fall under the responsibilities of a specific component.
 * One such example is the handling of print statements.
 */

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
    setOutput,
    movementsState,
    speedState,
    indexState,
    setIndexState,
    pauseState,
    followVisState,
}) {
    // State variables
    const [arraysState, setArraysState] = useState([]); // {name, values, locations, type}
    const [variablesState, setVariablesState] = useState([]);

    const genericOperations = [
        "else",
        "print",
        "define",
        "function_call",
        "return",
    ];
    // This method is called for each re-render caused by changes in states IndexState and PauseState. 
    // Changes in these states represent the processing of the next movement object and pausing/resuming, respectively.
    useEffect(() => {
        // Perform operations function is a necessity to ensure atomicity of visualisations.
        const performOperations = () => {
            // If the movement Objects array is still being processed.
            if (
                indexState > -1 &&
                indexState < movementsState.length &&
                !pauseState
            ) {
                
                const movement = movementsState[indexState];
                setOutput((prev) => {
                    return [...prev, movement.description];
                  });
                // Array creation is handled here due to management of states. Should be abstracted to a different class in the future.
                if (movement.operation === "create") {
                    // Future switch case here for different data structure types. For now just one if.
                    if (movement.dataStructure === "array") {
                        let varCheck = variablesState.findIndex(
                            (obj) => obj.name === movement.varName
                        );
                        // if a variable exists with the newly created arrays name, remove it from the list of variables. It has been reassigned.
                        if (varCheck != -1) {
                            setVariablesState((varState) => {
                                let newVars = [...varState];
                                // Remove the element at the found index
                                newVars.splice(varCheck, 1);
                                return newVars;
                            });
                        }
                        let valuesArr;
                        // Manages different data types for data structures (number, boolean, string)
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
                        // locationsArr implemented for future cases where customisation of swapping animations may need to be more intricate and implemented
                        // in a fully custom manner (without using layout property)
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
                    const timeoutId = setTimeout(() => {
                        setIndexState((i) => i + 1);
                    }, speedState * 1000);

                    return () => clearTimeout(timeoutId);
                }
                // generic operations with no explicit class bearing that functions responsibility are handled here. Examples are returns, prints, etc.
                if (genericOperations.includes(movement.operation)) {
                    if (movement.operation === "print") {
                        setOutput((prev) => [
                            ...prev,
                            `colourRed__(OUTPUT) ${movement.literal}`,
                        ]);

                        const timeoutId1 = setTimeout(() => {
                            setIndexState((prev) => prev + 1);
                        }, speedState * 1000);

                        return () => clearTimeout(timeoutId1);
                    } else {
                        const timeoutId2 = setTimeout(() => {
                            setIndexState((prev) => prev + 1);
                        }, speedState * 1000);
                        return () => clearTimeout(timeoutId2);
                    }
                }
            }
        };
        performOperations();
    }, [indexState, pauseState]);

    return (
        <Box
            className="main-visualisation-window"
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
                arraysState={arraysState}
                setArraysState={setArraysState}
                setOutput={setOutput}
                variablesState={variablesState}
                setVariablesState={setVariablesState}
                followVisState={followVisState}
            />
            <div className="if-array-container">
                <div className="top-row">
                    <IfVisualisationComponent
                        movements={movementsState}
                        speedState={speedState}
                        indexState={indexState}
                        setIndexState={setIndexState}
                        pauseState={pauseState}
                        setOutput={setOutput}
                        followVisState={followVisState}
                    />
                    <LoopNotificationComponent
                        movements={movementsState}
                        speedState={speedState}
                        indexState={indexState}
                        setIndexState={setIndexState}
                        pauseState={pauseState}
                        setOutput={setOutput}
                        followVisState={followVisState}
                    />
                </div>
                <StringVisualisationComponent
                    movements={movementsState}
                    speedState={speedState}
                    indexState={indexState}
                    setIndexState={setIndexState}
                    pauseState={pauseState}
                    arraysState={arraysState}
                    setOutput={setOutput}
                    variablesState={variablesState}
                    followVisState={followVisState}
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
                            setOutput={setOutput}
                            followVisState={followVisState}
                        />
                    ))}
                </AnimatePresence>
            </div>
        </Box>
    );
}

export default MainVisualisationWindow;
