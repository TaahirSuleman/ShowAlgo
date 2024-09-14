import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import "../styles/App.css";

function IfVisualisationComponent({
  movements,
  speedState,
  indexState,
  setIndexState,
  pauseState,
  setOutput,
  bufferState,
  setPauseState,
  followVisState,
}) {
  const [ifStatement, setIfStatement] = useState({
    operation: "if",
    condition: "This is the starter If",
    result: false,
    timestamp: "2024-07-09T12:02:00Z",
    description: "Checked if x is greater than 5.",
  });
  const [resultColourState, setResultColourState] = useState("#4A5568");
  const [isActive, setIsActive] = useState(false);
  const ifRef = useRef();

  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  useEffect(() => {
    const performOperations = () => {
      if (indexState > -1 && indexState < movements.length && !pauseState) {
        const movement = movements[indexState];
        if (movement.operation === "if") {
          if (followVisState) {
            ifRef.current.scrollIntoView({
              behavior: "smooth",
              block: "nearest",
              inline: "center",
            });
          }
          setIsActive(true);
          setResultColourState("#6B46C1");
          setIfStatement(movement);
          const timeoutId1 = setTimeout(() => {
            if (movement.result === true) {
              setResultColourState("#2F855A");
            } else {
              setResultColourState("#F56565");
            }
            const timeoutId2 = setTimeout(() => {
              setResultColourState("#4A5568");
            }, (speedState * 1000) / 2);
            setOutput((prev) => {
              return [...prev, movements[indexState].description];
            });
            const timeoutId3 = setTimeout(() => {
              setIndexState((prev) => prev + 1);
            }, (speedState * 1000) / 2);

            return () => {
              clearTimeout(timeoutId2);
              clearTimeout(timeoutId3);
            };
          }, (speedState * 1000) / 2);

          return () => clearTimeout(timeoutId1);
        } else if (movement.operation === "endif") {
          if (followVisState) {
            ifRef.current.scrollIntoView({
              behavior: "smooth",
              block: "nearest",
              inline: "center",
            });
          }
          setOutput((prev) => {
            return [...prev, movements[indexState].description];
          });
          const timeoutId4 = setTimeout(() => {
            setIsActive(false);
            setIndexState((prev) => prev + 1);
          }, speedState * 1000);
          return () => clearTimeout(timeoutId4);
        } else if (movement.operation === "loop_end") {
          const timeoutId4 = setTimeout(() => {
            setIsActive(false);
          }, speedState * 1000);
          return () => clearTimeout(timeoutId4);
        } else if (movement.operation === "loop_end") {
          const timeoutId4 = setTimeout(() => {
            setIsActive(false);
          }, speedState * 1000);
          return () => clearTimeout(timeoutId4);
        }
      }
    };
    performOperations();
  }, [indexState, pauseState]);

  if (isActive == false) {
    return (
      <motion.div
        className="notification-blurb"
        layoutId="ifNotification"
        ref={ifRef}
        style={{ borderRadius: "15px", backgroundColor: "#4A5568" }}
      >
        <p style={{ fontSize: "23px", fontStyle: "bold" }}>
          IF STATEMENTS APPEAR HERE
        </p>
      </motion.div>
    );
  } else {
    return (
      <div className="if-vis-window" ref={ifRef}>
        <motion.div
          className="notification-blurb"
          layoutId="ifNotification"
          style={{ backgroundColor: resultColourState }}
          initial={{ borderRadius: 15 }}
          animate={{
            borderRadius:
              resultColourState === "#2F855A" || resultColourState === "#F56565"
                ? 50
                : 15,
          }}
        >
          <p>The if statement asks: </p>
          <p
            style={{
              fontSize: "23px",
              fontWeight: "bold",
              overflowWrap: "break-word", // This will prevent breaking words unless necessary
              wordBreak: "break-word", // Ensure long words are only broken if they cannot fit
              whiteSpace: "normal", // Allows normal wrapping, but only at the end of words
              maxWidth: "230px", // Set the max width to ensure correct wrapping behavior
              overflow: "hidden", // Hide any overflow text
            }}
          >
            {ifStatement.condition != "This is the starter If"
              ? ifStatement.condition + "?"
              : "The if statements will be shown here!"}
          </p>
        </motion.div>
      </div>
    );
  }
}
export default IfVisualisationComponent;
