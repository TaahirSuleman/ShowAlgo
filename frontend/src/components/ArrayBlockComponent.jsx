import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import "../styles/App.css";

function ArrayBlockComponent({
  keyProp,
  id,
  passedValue,
  movements,
  locations,
  speedState,
  updateLocations,
  indexState,
  inserted,
  removed,
  swapped,
  changed,
  setSwappedState,
  got,
}) {
  // Define the ref for the block
  const arrBlockRef = useRef(null);

  // Use useEffect to trigger scrolling when an animation is about to start
  useEffect(() => {
    if (inserted || removed || changed || got) {
      arrBlockRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    }
  }, [inserted, removed, changed, swapped, got, keyProp]);

  if (inserted) {
    return (
      <motion.div
        className="square"
        ref={arrBlockRef}
        animate={{
          backgroundColor: [
            "#1A365D",
            "hsl(120, 100, 25)",
            "hsl(120, 100, 25)",
            "#1A365D",
          ],
        }}
        transition={{
          type: "tween",
          times: [0, 0.33, 0.66, 1],
          duration: speedState * 0.66,
        }}
        layout
      >
        <p style={{ margin: "10px" }}>{passedValue}</p>
      </motion.div>
    );
  } else if (removed) {
    return (
      <motion.div
        className="square"
        ref={arrBlockRef}
        transition={{
          type: "tween",
          times: [0, 0.33, 0.66, 1],
          duration: speedState * 0.66,
        }}
        animate={{
          backgroundColor: [
            "#1A365D",
            "hsl(0, 100, 50)",
            "hsl(0, 100, 50)",
            "#1A365D",
          ],
        }}
        layout
      >
        <p style={{ margin: "10px" }}>{passedValue}</p>
      </motion.div>
    );
  } else if (changed) {
    return (
      <motion.div
        className="square"
        ref={arrBlockRef}
        transition={{
          type: "tween",
          times: [0, 0.33, 0.66, 1],
          duration: speedState * 0.5,
        }}
        animate={{
          backgroundColor: [
            "#1A365D",
            "#f7e400",
            "#f7e400",
            "#1A365D",
          ],
          color: [
            "hsl(0, 0, 100)",
            "hsl(0, 0, 0)",
            "hsl(0, 0, 0)",
            "hsl(0, 0, 100)",
          ],
          scale: [1, 1.25, 1.25, 1],
        }}
        layout
      >
        <p style={{ margin: "10px" }}>{passedValue}</p>
      </motion.div>
    );
  } else if (got) {
    return (
      <motion.div
        ref={arrBlockRef}
        className="square"
        transition={{
          type: "tween",
          times: [0, 0.33, 0.66, 1],
          duration: speedState * 0.66,
        }}
        animate={{
          backgroundColor: [
            "#1A365D",
            "hsl(120, 100, 75)",
            "hsl(120, 100, 75)",
            "#1A365D",
          ],
          color: [
            "hsl(0, 0, 100)",
            "hsl(0, 0, 0)",
            "hsl(0, 0, 0)",
            "hsl(0, 0, 100)",
          ],
          scale: [1, 1.25, 1.25, 1],
        }}
        layout
      >
        <p style={{ margin: "10px" }}>{passedValue}</p>
      </motion.div>
    );
  } else if (swapped[0] === keyProp || swapped[1] === keyProp) {
    console.log("SWAP SUCCESS at values" + passedValue);
    return (
      <motion.div
        className="square"
        ref={arrBlockRef}
        layout
        transition={{ duration: speedState * 0.66 }}
        animate={{
          backgroundColor: [
            "#1A365D",
            "hsl(0, 100, 50)",
            "hsl(0, 100, 50)",
            "#1A365D",
          ],
          scale: [1, 1.5, 1.5, 1],
        }}
      >
        <p style={{ margin: "10px" }}>{passedValue}</p>
      </motion.div>
    );
  } else {
    return (
      <motion.div
        className="square"
        ref={arrBlockRef}
        transition={{ duration: speedState * 0.25 }}
        layout
      >
        <p style={{ margin: "10px" }}>{passedValue}</p>
      </motion.div>
    );
  }
}

export default ArrayBlockComponent;
