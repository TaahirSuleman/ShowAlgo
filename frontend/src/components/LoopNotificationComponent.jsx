import {React, useEffect, useState} from 'react';
import { motion } from 'framer-motion';
import '../styles/App.css';

function LoopNotificationComponent(
{
movements,
speedState,
indexState,
setIndexState,
pauseState,
setOutput,
bufferState,
setPauseState,
arraysState
}
) {
    const [loopNotificationState, setLoopNotificationState] = useState();
    const [isAnimated, setIsAnimated] = useState(false);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        const performOperations = () => {
            if (indexState > -1 && indexState < movements.length && !pauseState){
                console.log(movements[indexState].operation)
                if (movements[indexState].operation == "loop_from_to" || movements[indexState].operation == "while"){
                    setIsAnimated(true)
                    setIsActive(true)
                    let loopObj =   {
                                        "condition":movements[indexState].condition,
                                        "loop_type": (movements[indexState].operation == "while") ? "While Loop" : "For Loop",
                                    }
                    setLoopNotificationState(loopObj)
                    setOutput((prev) => {return [...prev, movements[indexState].description]});
                    const timeoutId3 = setTimeout(() => {

                        setIndexState((prev) => prev + 1);
                        setIsAnimated(false)
                      }, speedState * 1000 );
                    return timeoutId3
                }
                else if (movements[indexState].operation == "loop_end"){
                    setIsActive(false)
                    setLoopNotificationState({})
                    setOutput((prev) => {return [...prev, movements[indexState].description]});
                    const timeoutId3 = setTimeout(() => {

                        setIndexState((prev) => prev + 1);
                        setIsAnimated(false)
                      }, speedState * 1000 );
                    return timeoutId3
                }
            }
        }
        performOperations();
    }, [indexState, pauseState])

    if (isActive == false){
        return (
        <motion.div className="loop-notification" layoutId='loopNotif'>
        <p>Loop Notifications Here!</p>
        </motion.div>
        );
    }
    else{
        return (
        <motion.div className="loop-notification" 
                layoutId='loopNotif'
                animate={{backgroundColor: isAnimated ? 'hsl(39, 100, 70)' : 'hsl(0, 0, 0)',
                          color: isAnimated ? 'hsl(0, 0, 0)' : 'hsl(0, 0, 100)'}}
            >
            <p style={{ fontSize: '30px', fontWeight: 'bold' }}>
  A {loopNotificationState.loop_type} is in progress!
</p>

<p style={{ fontSize: '20px' }}>
    <>
      The condition to watch is:
    </>
</p>
<p style={{ fontSize: '25px' }}>
    <strong style={{ textDecoration: 'underline' }}>
        {loopNotificationState.condition}
    </strong>
</p>
        </motion.div>);
    }
    
}

export default LoopNotificationComponent;