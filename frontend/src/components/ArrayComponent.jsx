/**
 * Author(s): Gregory Maselle
 * Date: September 2024
 * Description: This file describes an ArrayComponent Component for visualisation. This component consists of many ArrayBlockComponents to facilitate the visualisation of
 * arrays and operations on arrays.
 */

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import '../styles/App.css'
import ArrayBlockComponent from './ArrayBlockComponent';


function ArrayComponent(
  {
    arrayName,
    movements,
    arrayState,
    arraysState,
    setArraysState,
    speedState ,
    indexState,
    setIndexState,
    pauseState,
    followVisState
  }) {

    // state variables
    // These state variables are passed down to ArrayBlockComponents to trigger changes in individual blocks. States with such function are identified.
  const [values, setValues] = useState(arrayState.values);
  const [removedState, setRemovedState] = useState(-1); // This one
  const [addedState, setAddedState] = useState(""); // This one
  const [locations, setLocations] = useState(arrayState.locations); // Location array to keep track of which values are where
  const [swappedState, setSwappedState] = useState(["",""]) // This one
  const [changedState, setChangedState] = useState("") // This one
  const [gotState, setGotState] = useState("") // This one
  const [arrayUpdating, setArrayUpdating] = useState(false)

  // reference for auto-scrolling
  const arrayRef = useRef();
  

  useEffect(() => {
    // Update component state whenever arrayState prop changes
    setValues(arrayState.values);
    setLocations(arrayState.locations);
    setArrayUpdating(true);
    let timer = setTimeout(()=>{
      setArrayUpdating(false);
    },speedState*1000*0.80)
    return () => clearTimeout(timer)
}, [arrayState]);

  useEffect(() => {
    const performOperations = () => {
      if (indexState > -1 && indexState < movements.length && !pauseState) {
        switch (movements[indexState].operation){
          // Actual array creation handling occurs in MainVisualisationView. This is for auto-navigation to the array in the visualisation view.
          case "create":
            if (movements[indexState].dataStructure === "array"){
              if (followVisState){
              arrayRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
              }
            }
          break;
            // No index incremention here. Done in MainVisualisationwindow

            // In the event two blocks are being swapped in an array
          case "swap":
            if (movements[indexState].varName != arrayState.name){
              return;
            }
            let prevValues = [...values];
            [prevValues[movements[indexState].firstPosition], prevValues[movements[indexState].secondPosition]] = [prevValues[movements[indexState].secondPosition], prevValues[movements[indexState].firstPosition]];
            setSwappedState([prevValues[movements[indexState].firstPosition],prevValues[movements[indexState].secondPosition]])
            setValues(prevValues);
            for (let i = 0; i<arraysState.length;i++){
              if (arraysState[i].name == arrayName){
                let tempArrState = [... arraysState]
                let updatedObject = {
                  ...tempArrState[i], // Copy the existing object properties
                  values: prevValues // Update the 'values' property with newValues
                };
                tempArrState[i] = updatedObject;
                setArraysState(tempArrState)
              }
            }
            const timeoutId1 = setTimeout(()=> {
              setIndexState((i)=>{return i+1})
              setSwappedState(["",""])
            }, speedState*1000) // This controls the time between SWAPPING and the next movement.
            return () => clearTimeout(timeoutId1);
          break;
            // In the event a block is being added/inserted into an array.
          case "add":
            if (movements[indexState].varName != arrayState.name){
              return;
            }
            // navigate to block being added
            if (followVisState){
            arrayRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            }
            addToArray(movements[indexState].value, movements[indexState].position);
            const timeoutId2 = setTimeout(()=> {
              setIndexState((i)=>{return i+1})
            }, speedState*1000) // This controls the time between INSERTING and the next movement.
            return () => clearTimeout(timeoutId2);
          break;
            // In the event a block is being removed from the array
          case "remove":
            if (movements[indexState].varName != arrayState.name){
              return;
            }
            if (followVisState){
            arrayRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            }
            removeFromArray((movements[indexState].positionToRemove))
            const timeoutId3 = setTimeout(()=> {
              setIndexState((i)=>{return i+1})
            }, speedState*1000) // This controls the time between POPPING and the next movement.
            return () => clearTimeout(timeoutId3);
          break;
            // In the event a value in the array is being changed.
          case "set":
            if (typeof movements[indexState].value === "object"){
              let innerMovement = movements[indexState].value
              if (innerMovement.type === "array" && innerMovement.operation === "get" && innerMovement.varName === arrayState.name){
                if (followVisState){
                arrayRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                }
                // SetGotState -> triggers animation in ArrayBlock
                setGotState(values[innerMovement.index]);
                console.log(values[innerMovement.index] + " This is the got state ")
                const timeoutId4 = setTimeout(()=> {
                  // setGotState -> returns block to "normal" status. Not undergoing changes.
                  setGotState("")
                  setIndexState((i)=>{return i+1})
                }, speedState*1000) // This controls the time between POPPING and the next movement.
                return () => clearTimeout(timeoutId4);
              }
            }
          break;

          case "set_array":
            if (movements[indexState].varName != arrayState.name){
              return;
            }
            setValueInArray(movements[indexState].setValue, movements[indexState].index)
            console.log(values[movements[indexState].index] + " This is the changed state ")
            const timeoutId5 = setTimeout(()=> {
              // setChangedState -> returns block to "normal" status. Not undergoing changes.
              setChangedState("")
              setIndexState((i)=>{return i+1})
            }, speedState*1000) // This controls the time between POPPING and the next movement.
            return () => clearTimeout(timeoutId5);
          break;
            
        }
      }
    }
    performOperations();

  }, [indexState, pauseState]);

  const delay = ms => new Promise(res => setTimeout(res, ms));
  // Called when a value is being changed within the array. Not insertion.
  const setValueInArray = async (value, location) => {
    let newEntry;
    if (arrayState.type === "string"){
      newEntry = arrayState.name + '++"'+ value.toString() +'"-'+ values.length;
    }
    else{
      newEntry = arrayState.name + "++"+ value.toString() +"-"+ values.length;
    }
    let newValues = [... values.slice(0,location), newEntry, ...values.slice(location+1)];
    setChangedState(newEntry);
    setValues(newValues);
    let previousLocations = [... locations]; //
    previousLocations.push(location); // processing of locations is deprecated but is left included in the event more custom animations needs to be implemented in the future and use of layout prop proves to be insufficient
    setLocations(previousLocations);  // 
    for (let i = 0; i<arraysState.length;i++){
      if (arraysState[i].name == arrayName){
        let tempArrState = [... arraysState]
        let updatedObject = {
          ...tempArrState[i], // Copy the existing object properties
          values: newValues, // Update the 'values' property with newValues
          locations: previousLocations
        };
        tempArrState[i] = updatedObject;
        setArraysState(tempArrState)
      }
    }
    console.log(values)
    await delay(speedState*1000*0.66); // Change argument here to determine how long to wait for highlighting to happen. This should be half the total animation time.
    console.log("These are the locations: "+locations);
    setChangedState("") // setChangedState -> returns block to "normal" status. Not undergoing changes.
  }

  const addToArray = async (value, location) => {
    let newEntry;
    if (arrayState.type === "string"){
      newEntry = arrayState.name + '++"'+ value.toString() +'"-'+ values.length;
    }
    else{
      newEntry = arrayState.name + "++"+ value.toString() +"-"+ values.length;
    }
    
    let newValues = [... values.slice(0,location), newEntry, ...values.slice(location)];
    setAddedState(newEntry);
    setValues(newValues);
    let previousLocations = [... locations];//
    previousLocations.push(location);// // processing of locations is deprecated but is left included in the event more custom animations needs to be implemented in the future and use of layout prop proves to be insufficient
    setLocations(previousLocations);//
    for (let i = 0; i<arraysState.length;i++){
      if (arraysState[i].name == arrayName){
        let tempArrState = [... arraysState]
        let updatedObject = {
          ...tempArrState[i], // Copy the existing object properties
          values: newValues, // Update the 'values' property with newValues
          locations: previousLocations
        };
        tempArrState[i] = updatedObject;
        setArraysState(tempArrState)
      }
    }
    console.log(values)
    await delay(speedState*1000*0.75); // Change argument here to determine how long to wait for highlighting to happen. This should be half the total animation time.
    console.log("These are the locations: "+locations);
    setAddedState("") // setAddedState -> returns block to "normal" status. Not undergoing changes.
  }

  const removeFromArray = async (position) => {
    let newValues = [... values]
    newValues.splice(position, 1);
    let newLocations = [... locations] //
    for (let i = 0; i< locations.length;i++){ //
      if (locations[i] == position){ // // processing of locations is deprecated but is left included in the event more custom animations needs to be implemented in the future and use of layout prop proves to be insufficient
        let newLoc = [... locations]; //
        newLoc[i]= -1;
        setLocations(newLoc);
      }
    }
    console.log("removed element at "+position)
    setRemovedState(position)
    await delay(speedState*1000*0.75); // Change argument here to determine how long to wait for highlighting to happen. This should be half the total animation time.
    setLocations(newLocations);
    setRemovedState(-1); // setRemovedState -> returns block to "normal" status. Not undergoing changes.
    for (let i = 0; i<arraysState.length;i++){
      if (arraysState[i].name == arrayName){
        let tempArrState = [... arraysState]
        let updatedObject = {
          ...tempArrState[i], // Copy the existing object properties
          values: newValues, // Update the 'values' property with newValues
          locations: newLocations
        };
        tempArrState[i] = updatedObject;
        setArraysState(tempArrState)
      }
    }
    setValues(newValues);
  }
    if (arrayName == "default"){
      return(
        <></>
      )
    }
    return (
      <motion.div layout ref={arrayRef} style={{ display: 'flex', flexDirection: 'column' }}>
        <p style={{ fontWeight: "bold", fontSize: "larger" }}>{arrayName}</p>
        <motion.div
          className="array-container"
          transition={{
            type: "tween",
            duration: speedState,
          }}
          animate={{
            borderColor: arrayUpdating ? "#48BB78" : "#E2E8F0",
          }}
          layout
          exit={{
            borderLeftColor: "#F56565",
            opacity: 0,
            transition: { duration: speedState }
          }}
        >
          {values.map((value, index) => (
            <ArrayBlockComponent
              key={value}
              keyProp={value}
              passedValue={value.substring(value.indexOf("++") + 2, value.indexOf("-"))}
              speedState={speedState}
              inserted={addedState === value}
              removed={removedState === index}
              swapped={swappedState}
              changed={changedState === value}
              got={gotState === value}
              followVisState={followVisState}
            />
          ))}
        </motion.div>
      </motion.div>
    );
  }
  

export default ArrayComponent;