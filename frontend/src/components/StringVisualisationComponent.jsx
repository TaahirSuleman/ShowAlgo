import { useState, useEffect, useRef } from "react";
import { motion, steps } from "framer-motion";
import "../styles/App.css";

function StringVisualisationComponent({
  movements,
  speedState,
  indexState,
  setIndexState,
  pauseState,
  setOutput,
  bufferState,
  setPauseState,
  variablesState,
  setVariablesState,
  followVisState
}) {
  const [presentState, setPresentState] = useState(false);
  const [afterHighlight, setAfterHighlight] = useState("");
  const [highlighted, setHighlight] = useState("");
  const [beforeHighlight, setBeforeHighlight] = useState("");
  const stringVisRef = useRef();

  useEffect(() => {
    const performOperations = () => {
      if (indexState <= -1 || indexState >= movements.length || pauseState)
        return;

      const currentMovement = movements[indexState];
      if (
        currentMovement.operation !== "set" ||
        typeof currentMovement.value !== "object"
      )
        return;
        if (followVisState){
      stringVisRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });}

      const { operation, type, varName, source, result, index, start, end } =
        currentMovement.value;
      const target =
        operation === "get" && type === "string" ? varName : source;
      const variable = variablesState.find((obj) => obj.name === target);

      if (!variable) return;

      const actualValue = variable.value.slice(1, -1); // Remove quotation marks

      setHighlight(result);

      if (operation === "get" && type === "string") {
        setBeforeHighlight(actualValue.substring(0, index));
        setAfterHighlight(actualValue.substring(index + 1));
      } else {
        setBeforeHighlight(actualValue.substring(0, start));
        setAfterHighlight(actualValue.substring(end));
      }
      setPresentState(true);
      setOutput((prev) => [...prev, currentMovement.description]);
      const timeout = setTimeout(() => {
        setPresentState(false);
      }, speedState * 1000); // Over animation duration. Was previously in variableComponent.
      return () => clearTimeout(timeout);
    };

    performOperations();
  }, [indexState, pauseState]);

  if (presentState) {
    return (
      <motion.div
        className="string-visualisation-container"
        style={{
          fontSize: "30px",
          display: "inline", // Make the container inline to allow seamless text flow
          whiteSpace: "wrap", // Prevents line breaks if that's desired
        }}
        ref={stringVisRef}
      >
        <span>{beforeHighlight}</span>
        <motion.span
          layout
          style={{ textDecoration: "underline" }}
          animate={{
            color: [
              "#FFFFFF",
              "#D69E2E",
              "#FFFFFF",
              "#D69E2E",
              "#FFFFFF",
              "#FFFFFF",
              "#D69E2E",
            ],
          }}
          transition={{
            type: "tween",
            times: [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875],
            duration: speedState * 0.66,
          }}
        >
          {highlighted}
        </motion.span>
        <span>{afterHighlight}</span>
      </motion.div>
    );
  } else {
    return <motion.div layoutId="stringVis" ref={stringVisRef}></motion.div>;
  }
}

export default StringVisualisationComponent;
