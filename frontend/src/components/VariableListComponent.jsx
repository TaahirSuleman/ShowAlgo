/**
 * Author(s): Gregory Maselle
 * Date: September 2024
 * Description: This file describes a VariableListComponent Component for visualisation. This component is responsible for showing the state of variables as they change
 * through the processing of the pseudocode.
 */

import { useState, useEffect, useRef } from "react";
import { motion, useForceUpdate } from "framer-motion";
import "../styles/App.css";

function VariableListComponent({
  movements,
  speedState,
  indexState,
  setIndexState,
  pauseState,
  arraysState,
  setArraysState,
  variablesState,
  setVariablesState,
  followVisState,
  setOutput
}) {
  // state variables
  let [updating, setUpdating] = useState("");
  const [counter, setCounter] = useState(0);
  // reference used to facilitate autoscrolling to current animation
  const varRef = useRef();
  
  useEffect(() => {
    const performOperations = () => {
      if (indexState > -1 && indexState < movements.length && !pauseState) {
        if (movements[indexState].operation == "set") {
          //The case where its a set not involving access to a pre-existing string or array.
          if (typeof movements[indexState].value != "object") {
            if (followVisState) {
              varRef.current.scrollIntoView({
                behavior: "smooth",
                block: "nearest",
                inline: "center",
              });
            }
            updateVariablesState(
              movements[indexState].type,
              movements[indexState].value,
              movements[indexState].varName
            );
            // If an array exists with this variables name, essentially wipe it from the DOM by updating arraysState
            let arrayIndexCheck = arraysState.findIndex(
              (obj) => obj.name === movements[indexState].varName
            );
            if (arrayIndexCheck != -1) {
              setArraysState((arrState) => {
                let newArrs = [...arrState];
                newArrs.splice(arrayIndexCheck, 1);
                console.log(newArrs); // Logging the updated array after deletion
                return newArrs;
              });
            }
            // Increment the indexState after speedState seconds
            const timeoutId2 = setTimeout(() => {
              setIndexState((i) => {
                return i + 1;
              });
            }, speedState * 1000);
            return () => clearTimeout(timeoutId2);
          } else {
            // In the event set is related to some pre-existing string or array
            let innerMovement = movements[indexState].value;
            if (innerMovement.operation == null){
              setOutput((prev) => {
                return [...prev, "The function returned array with values: "+ innerMovement];
              });
              const timeoutId2 = setTimeout(() => {
                setIndexState((i) => {
                  return i + 1;
                });
              }, speedState * 1000);
              return () => clearTimeout(timeoutId2);
            }
            switch (innerMovement.operation) {
              // Substring operation is occuring.
              case "substring":
                updateVariablesState(
                  "string",
                  innerMovement.result,
                  movements[indexState].varName
                );
                break;
              case "get":
                // indexing is occuring on a string
                if (innerMovement.type === "string") {
                  updateVariablesState(
                    "string",
                    innerMovement.result,
                    movements[indexState].varName
                  );
                } // indexing is occuring on an array
                else if (innerMovement.type === "array") {
                  let arrayIndexCheck = arraysState.findIndex(
                    (obj) => obj.name === movements[indexState].varName
                  );
                  // In the case where the new variable is the same name as the array it accesses, `set nums to nums[0]`, clear array.
                  if (arrayIndexCheck != -1) {
                    setArraysState((arrState) => {
                      let newArrs = [...arrState];
                      newArrs.splice(arrayIndexCheck, 1);
                      console.log(newArrs); // Logging the updated array after deletion
                      return newArrs;
                    });
                  }
                  let arrayCheck = arraysState.find(
                    (obj) => obj.name === innerMovement.varName
                  );
                  updateVariablesState(
                    arrayCheck.type,
                    innerMovement.result,
                    movements[indexState].varName
                  );
                  //Index updating is in ArrayComponent for animation duration management for future.
                }
            }
          }
        }
      }
    };
    performOperations();
  }, [indexState, pauseState]);
  // A function to update the variables state.
  let updateVariablesState = async (type, value, name) => {
    setVariablesState((prevVariablesState) => {
      let variables = [...prevVariablesState];
      const index = variables.findIndex((variable) => variable.name === name);
      if (index !== -1) {
        variables[index] = {
          type: type,
          value: type === "string" ? "'" + value + "'" : value,
          name: name,
        };
      } else {
        variables.push({
          type: type,
          value: type === "string" ? "'" + value + "'" : value,
          name: name,
        });
      }
      setUpdating(name);
      // Counter is used to trigger re-render.
      setCounter((c) => c + 1);
      return variables;
    });
  };

  if (variablesState.length == 0) {
    return (
      <div
        className="variables-container"
        style={{ width: "200px" }}
        ref={varRef}
      >
        <ul className="ul-variables">
          <li
            style={{
              backgroundColor: "#276749",
              textAlign: "center",
            }}
            className="list-items"
          >
            <p>VARIABLES WILL APPEAR HERE</p>
          </li>
        </ul>
      </div>
    );
  }
  return (
    <div className="variables-container" ref={varRef}>
      <ul className="ul-variables">
        {variablesState.map((variable) => (
          <motion.li
            className="list-items"
            layout
            key={variable.name + counter}
            style={{
              borderRadius: updating === variable.name ? "7px" : "5px",
              border:
                updating === variable.name
                  ? "4px solid rgba(0, 0, 0, 0.80)"
                  : "2px solid #9AE6B4",
              wordWrap: "break-word",
              overflowWrap: "break-word",
              wordBreak: "break-all",
            }}
            animate={
              updating === variable.name
                ? {
                    color: [
                      "rgba(255, 255, 255, 0.80)",
                      "rgba(0, 0, 0, 0.80)",
                      "rgba(0, 0, 0, 0.80)",
                    ],
                    backgroundColor: [
                      "hsla(39, 100%, 50%, 0)",
                      "hsla(39, 100%, 50%, 0.5)",
                      "hsla(194.7, 53.2%, 79.0%, 0.4)",
                    ],
                  }
                : {
                    color: [
                      "rgba(255, 255, 255, 0.80)",
                      "rgba(255, 255, 255, 0.80)",
                      "rgba(255, 255, 255, 0.80)",
                    ],
                    backgroundColor: [
                      "hsla(39, 100%, 50%, 0)",
                      "hsla(39, 100%, 50%, 0)",
                      "hsla(39, 100%, 50%, 0)",
                    ],
                  }
            }
            transition={{ duration: speedState }}
          >
            <p style={{ fontSize: "13px" }}>
              {"(" +
                variable.type +
                ") " +
                variable.name +
                " = " +
                variable.value}
            </p>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

export default VariableListComponent;
