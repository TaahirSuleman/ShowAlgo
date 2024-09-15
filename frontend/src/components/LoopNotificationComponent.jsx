/**
 * Author(s): Gregory Maselle
 * Date: September 2024
 * Description: This file describes a LoopNotificationComponent Component for visualisation. This component notifies the user that a loop has started,
 * supplying the user with the type of loop, and what to focus on to understand the loops functioning. 
 */

import {React, useEffect, useState, useRef} from 'react';
import { motion } from 'framer-motion';
import '../styles/App.css';

function LoopNotificationComponent(
{
movements,
speedState,
indexState,
setIndexState,
pauseState,
followVisState
}
) {
  // state variables
  const [loopNotificationState, setLoopNotificationState] = useState();
  const [isAnimated, setIsAnimated] = useState(false);
  const [isActive, setIsActive] = useState(false);
  // reference used for auto scrolling
  const loopNotifRef = useRef();

  useEffect(() => {
    const performOperations = () => {
      if (indexState > -1 && indexState < movements.length && !pauseState) {
        console.log(movements[indexState].operation);
        // catering for 3 currently available loop types: for loops, while loops, and for each loops.
        if (
          movements[indexState].operation == "loop_from_to" ||
          movements[indexState].operation == "while" ||
          movements[indexState].operation == "for_each"
        ) {
          // navigate to the visualisation within visualisation view.
          if (followVisState){
          loopNotifRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
          }
          setIsAnimated(true);
          setIsActive(true);
          let loopObj = {
            condition: movements[indexState].condition,
            loop_type:
              movements[indexState].operation == "while"
                ? "While Loop"
                : movements[indexState].operation == "for_each"
                ? "For Each Loop"
                : "For Loop",
          };
          setLoopNotificationState(loopObj);
          // move on to next movement Object after speedState seconds.
          const timeoutId3 = setTimeout(() => {
            console.log("HERE HERE HERE LOOK HERE")
            setIndexState((prev) => prev + 1);
            setIsAnimated(false);
          }, speedState * 1000);
          return () => clearTimeout(timeoutId3);
          // When a loop ends, clear the loop notification.
        } else if (movements[indexState].operation == "loop_end") {
          setIsActive(false);
          setLoopNotificationState({});
          const timeoutId3 = setTimeout(() => {
            setIndexState((prev) => prev + 1);
            setIsAnimated(false);
          }, speedState * 1000);
          return () => clearTimeout(timeoutId3);
        }
      }
    };
    performOperations();
  }, [indexState, pauseState]);

  if (isActive == false) {
    return (
      <motion.div
        className="loop-notification"
        layoutId="loopNotif"
        ref={loopNotifRef}
      >
        <p style={{ fontSize: "23px" }}>LOOP NOTIFICATIONS APPEAR HERE</p>
      </motion.div>
    );
  } else {
    return (
      <motion.div
        className="loop-notification"
        layoutId="loopNotif"
        animate={{
          backgroundColor: isAnimated ? "hsl(39, 100, 70)" : "hsl(0, 0, 0)",
          color: isAnimated ? "hsl(0, 0, 0)" : "hsl(0, 0, 100)",
        }}
        ref={loopNotifRef}
      >
        <p style={{ fontSize: "25px", fontWeight: "bold" }}>
          A {loopNotificationState.loop_type} is in progress!
        </p>
        {(loopNotificationState.loop_type === "For Each Loop") ? 
            (<><p style={{ fontSize: "20px" }}>
          <>Keep an eye on each</>
        </p>
        <p style={{ fontSize: "20px" }}>
          <strong style={{ textDecoration: "underline" }}>
            {loopNotificationState.condition}
          </strong>
        </p></>)
        : 
        (<><p style={{ fontSize: "20px" }}>
          <>The condition to watch is:</>
        </p>
        <p style={{ fontSize: "20px" }}>
          <strong style={{ textDecoration: "underline" }}>
            {loopNotificationState.condition}
          </strong>
        </p></>)}
        
      </motion.div>
    );
  }
}

export default LoopNotificationComponent;