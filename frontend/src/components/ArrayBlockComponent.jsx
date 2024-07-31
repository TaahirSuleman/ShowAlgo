import React, { useEffect, useState } from 'react';
import { motion, useAnimate } from 'framer-motion';
import '../styles/App.css'


  function ArrayBlockComponent(
  {
    keyProp,
    id, 
    value,
    movements,
    locations,
    speedState,
    updateLocations ,
    indexState, 
    inserted, 
    removed,
    swapped, 
    change, 
    setSwappedState
  }){
  const delay = ms => new Promise(res => setTimeout(res, ms));

  if (inserted){
    return (
      <motion.div className="square"
      animate={{ backgroundColor: ['hsl(-120, 100, 50)','hsl(120, 100, 25)','hsl(120, 100, 25)', 'hsl(-120, 100, 50)'] }}
      transition={{type: 'tween', times: [0, 0.33, 0.66, 1], duration: speedState*0.75 }}
      layout
      >
        {value}
      </motion.div>
    );
  }
  else if (removed){
    return (
      <motion.div className="square"
      transition={{type: 'tween', times: [0, 0.33, 0.66, 1], duration: speedState*0.75 }}
      animate={{ backgroundColor: ['hsl(-120, 100, 50)','hsl(0, 100, 50)','hsl(0, 100, 50)', 'hsl(-120, 100, 50)'] }}
      layout
      >
        {value}
      </motion.div>
    );
  }
  else if (swapped[0] == keyProp || swapped[1] == keyProp ){
    console.log("SWAP SUCCESS at values" + value)
      return (
        <motion.div className="square"
        layout 
        transition={{ duration: speedState*0.75 }}
        animate={{ backgroundColor: ['hsl(-120, 100, 50)','hsl(0, 100, 50)','hsl(0, 100, 50)', 'hsl(-120, 100, 50)'],
                   scale: [1,1.5,1.5,1]
                  }}
        >
          {value}
        </motion.div>
      );
    }
  else{
    return (
      <motion.div className="square"
      transition={{ duration: speedState*0.25 }}
      layout
      >
        {value}
      </motion.div>
    );
  }
};


export default ArrayBlockComponent;

