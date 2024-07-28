import React, { useEffect, useState } from 'react';
import { motion, useAnimate } from 'framer-motion';
import '../styles/App.css'


  function ArrayBlockComponent(props){//: {pausedState , speedState , value,keyProp, id, movements, locations, updateLocations, indexState,inserted,removed, swapped, setSwappedState}
  const delay = ms => new Promise(res => setTimeout(res, ms));

  if (props.inserted){
    return (
      <motion.div className="square"
      animate={{ backgroundColor: ['hsl(-120, 100, 50)','hsl(120, 100, 25)','hsl(120, 100, 25)', 'hsl(-120, 100, 50)'] }}
      transition={{type: 'tween', times: [0, 0.33, 0.66, 1], duration: props.speedState*0.75 }}
      layout
      >
        {props.value}
      </motion.div>
    );
  }
  else if (props.removed){
    return (
      <motion.div className="square"
      transition={{type: 'tween', times: [0, 0.33, 0.66, 1], duration: props.speedState*0.75 }}
      animate={{ backgroundColor: ['hsl(-120, 100, 50)','hsl(0, 100, 50)','hsl(0, 100, 50)', 'hsl(-120, 100, 50)'] }}
      layout
      >
        {props.value}
      </motion.div>
    );
  }
  else if (props.swapped[0] == props.keyProp || props.swapped[1] == props.keyProp ){
    console.log("SWAP SUCCESS at values" + props.value)
      return (
        <motion.div className="square"
        layout 
        transition={{ duration: props.speedState*0.75 }}
        animate={{ backgroundColor: ['hsl(-120, 100, 50)','hsl(0, 100, 50)','hsl(0, 100, 50)', 'hsl(-120, 100, 50)'],
                   scale: [1,1.5,1.5,1]
                  }}
        >
          {props.value}
        </motion.div>
      );
    }
  else{
    return (
      <motion.div className="square"
      transition={{ duration: props.speedState*0.25 }}
      layout
      >
        {props.value}
      </motion.div>
    );
  }
};


export default ArrayBlockComponent;

