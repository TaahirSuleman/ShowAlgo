/**
 * Author(s): Gregory Maselle
 * Date: September 2024
 * Description: This file describes an IfVisualisationComponent Component for visualisation. This component serves as a means to notify the user of an if statements
 * occurence in the pseudocode while highlighting the condition in the if statement. 
 */

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import "../styles/App.css";

function IfVisualisationComponent({
  movements,
  speedState,
  indexState,
  setIndexState,
  pauseState,
  followVisState,
}) {

  // State variables
  const [ifStatement, setIfStatement] = useState();
  const [resultColourState, setResultColourState] = useState("#4A5568");
  const [isActive, setIsActive] = useState(false);
  // reference used for auto scrolling
  const ifRef = useRef();

  useEffect(() => {
    const performOperations = () => {
      if (indexState > -1 && indexState < movements.length && !pauseState) {
        const movement = movements[indexState];
        if (movement.operation === "if") {
          // navigate to animation within visualisation view
          if (followVisState) {
            ifRef.current.scrollIntoView({
              behavior: "smooth",
              block: "nearest",
              inline: "center",
            });
          }
          // A number of nested timeouts are performed to manage the changing of colour and border radius of if visualisation component.
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
            }, (speedState * 1000) / 2); // This should take half the total animation time
            const timeoutId3 = setTimeout(() => {
              setIndexState((prev) => prev + 1);
            }, (speedState * 1000) / 2); // This should take half the total animation time

            return () => {
              clearTimeout(timeoutId2);
              clearTimeout(timeoutId3);
            };
          }, (speedState * 1000) / 2); // This should take half the total animation time.

          return () => clearTimeout(timeoutId1);
          // When code within an if loop ends, clear the if visualisation.
        } else if (movement.operation === "endif") {
          if (followVisState) {
            ifRef.current.scrollIntoView({
              behavior: "smooth",
              block: "nearest",
              inline: "center",
            });
          }
          const timeoutId4 = setTimeout(() => {
            setIsActive(false);
            setIndexState((prev) => prev + 1);
          }, speedState * 1000);
          return () => clearTimeout(timeoutId4);
          // When a loop ends, clear the if visualisation as there is no explicit `end if` in pseudocode.
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
