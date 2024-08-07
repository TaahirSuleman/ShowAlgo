import React, { useEffect, useState } from 'react';
import { motion, useAnimate } from 'framer-motion';
import '../styles/App.css'


  function ArrayBlockComponent(
  {
    keyProp,
    id, 
    passedValue,
    movements,
    locations,
    speedState,
    updateLocations ,
    indexState, 
    inserted, 
    removed,
    swapped, 
    changed, 
    setSwappedState,
    got
  }){
  const delay = ms => new Promise(res => setTimeout(res, ms));

  console.log(keyProp+ " this is the value")
  if (inserted){
    return (
      <motion.div className="square"
      animate={{ backgroundColor: ['hsl(-120, 100, 50)','hsl(120, 100, 25)','hsl(120, 100, 25)', 'hsl(-120, 100, 50)'] }}
      transition={{type: 'tween', times: [0, 0.33, 0.66, 1], duration: speedState* 0.66 }}
      layout
      >
        {passedValue}
      </motion.div>
    );
  }
  else if (removed){
    return (
      <motion.div className="square"
      transition={{type: 'tween', times: [0, 0.33, 0.66, 1], duration: speedState* 0.66 }}
      animate={{ backgroundColor: ['hsl(-120, 100, 50)','hsl(0, 100, 50)','hsl(0, 100, 50)', 'hsl(-120, 100, 50)'] }}
      layout
      >
        {passedValue}
      </motion.div>
    );
  }
  else if (changed){
    return (
      <motion.div className="square"
      transition={{type: 'tween', times: [0, 0.33, 0.66, 1], duration: speedState* 0.66 }}
      animate={{ backgroundColor: ['hsl(-120, 100, 50)','hsl(48, 100, 67)','hsl(48, 100, 67)', 'hsl(-120, 100, 50)'],
                 color: ['hsl(0, 0, 100)','hsl(0, 0, 0)','hsl(0, 0, 0)','hsl(0, 0, 100)'],
                 scale: [1, 1.25, 1.25, 1]}}
      layout
      >
        {passedValue}
      </motion.div>
    );
  }
  else if (got) {
    return (
      <motion.div
        className="square"
        transition={{
          type: 'tween',
          times: [0, 0.33, 0.66, 1],
          duration: speedState * 0.66,
        }}
        animate={{
          backgroundColor: [
            'hsl(-120, 100, 50)',
            'hsl(120, 100, 75)',
            'hsl(120, 100, 75)',
            'hsl(-120, 100, 50)',
          ],
          color: ['hsl(0, 0, 100)','hsl(0, 0, 0)','hsl(0, 0, 0)','hsl(0, 0, 100)'],
          scale: [1, 1.25, 1.25, 1],
        }}
        layout
      >
        {passedValue}
      </motion.div>
    );
  }
  else if (swapped[0] == keyProp || swapped[1] == keyProp ){
    console.log("SWAP SUCCESS at values" + passedValue)
      return (
        <motion.div className="square"
        layout 
        transition={{ duration: speedState* 0.66 }}
        animate={{ backgroundColor: ['hsl(-120, 100, 50)','hsl(0, 100, 50)','hsl(0, 100, 50)', 'hsl(-120, 100, 50)'],
                   scale: [1,1.5,1.5,1]
                  }}
        >
          {passedValue}
        </motion.div>
      );
    }
  else{
    return (
      <motion.div className="square"
      transition={{ duration: speedState*0.25 }}
      layout
      >
        {passedValue}
      </motion.div>
    );
  }
};


export default ArrayBlockComponent;

