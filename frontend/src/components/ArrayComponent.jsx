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
    setOutput,
    bufferState,
    setPauseState
  }) {
  const [values, setValues] = useState(arrayState.values);
  const [removedState, setRemovedState] = useState(-1);
  const [addedState, setAddedState] = useState("");
  const [locations, setLocations] = useState(arrayState.locations); // Location array to keep track of which values are where
  const [swappedState, setSwappedState] = useState(["",""])
  const [changedState, setChangedState] = useState("")
  const [gotState, setGotState] = useState("")
  const arrayRef = useRef();
  const [arrayUpdating, setArrayUpdating] = useState(false)

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

          case "create":
            if (movements[indexState].dataStructure === "array"){
              arrayRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            }
          break;
            // No index incremention here. Done in MainVisualisationwindow

          case "swap":
            if (movements[indexState].varName != arrayState.name){
              return;
            }
            console.log("Its a swap");
            let prevValues = [...values];
            [prevValues[movements[indexState].firstPosition], prevValues[movements[indexState].secondPosition]] = [prevValues[movements[indexState].secondPosition], prevValues[movements[indexState].firstPosition]];
            console.log("swapping debug values "+values)
            console.log("swapping debug prev values "+prevValues)
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
            setOutput((prev) => {return [...prev, movements[indexState].description]});
            const timeoutId1 = setTimeout(()=> {
              setIndexState((i)=>{return i+1})
              setSwappedState(["",""])
            }, speedState*1000) // This controls the time between SWAPPING and the next movement.
            return () => clearTimeout(timeoutId1);
          break;

          case "add":
            if (movements[indexState].varName != arrayState.name){
              return;
            }
            arrayRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            addToArray(movements[indexState].value, movements[indexState].position);
            setOutput((prev) => {return [...prev, movements[indexState].description]});
            const timeoutId2 = setTimeout(()=> {

              setIndexState((i)=>{return i+1})
            }, speedState*1000) // This controls the time between INSERTING and the next movement.
            return () => clearTimeout(timeoutId2);
          break;

          case "remove":
            if (movements[indexState].varName != arrayState.name){
              return;
            }
            arrayRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            removeFromArray((movements[indexState].positionToRemove))
            setOutput((prev) => {return [...prev, movements[indexState].description]});
            const timeoutId3 = setTimeout(()=> {

              setIndexState((i)=>{return i+1})
            }, speedState*1000) // This controls the time between POPPING and the next movement.
            return () => clearTimeout(timeoutId3);
          break;

          case "set":
            if (typeof movements[indexState].value === "object"){
              let innerMovement = movements[indexState].value
              if (innerMovement.type === "array" && innerMovement.operation === "get" && innerMovement.varName === arrayState.name){
                arrayRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                setGotState(values[innerMovement.index]);
                console.log(values[innerMovement.index] + " This is the got state ")
                setOutput((prev) => {return [...prev, movements[indexState].description]});
                const timeoutId4 = setTimeout(()=> {
                  setGotState("")
                  setIndexState((i)=>{return i+1})
                }, speedState*1000) // This controls the time between POPPING and the next movement.
                return () => clearTimeout(timeoutId4);
              }
            }
          break;

          case "set_array":
            //arrayRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            if (movements[indexState].varName != arrayState.name){
              return;
            }
            setValueInArray(movements[indexState].setValue, movements[indexState].index)
            console.log(values[movements[indexState].index] + " This is the changed state ")
            setOutput((prev) => {return [...prev, movements[indexState].description]});
            const timeoutId5 = setTimeout(()=> {
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
    previousLocations.push(location); // This location stuff is deprecated and may not ever be used. This code may not make sense.
    setLocations(previousLocations); //
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
    setChangedState("")
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
    let previousLocations = [... locations];
    previousLocations.push(location);
    setLocations(previousLocations);
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
    setAddedState("")
  }

  const removeFromArray = async (position) => {
    let newValues = [... values]
    newValues.splice(position, 1);
    let newLocations = [... locations]
    for (let i = 0; i< locations.length;i++){
      if (locations[i] == position){
        let newLoc = [... locations];
        newLoc[i]= -1;
        setLocations(newLoc);
      }
    }
    console.log("removed element at "+position)
    setRemovedState(position)
    await delay(speedState*1000*0.75); // Change argument here to determine how long to wait for highlighting to happen. This should be half the total animation time.
    setLocations(newLocations);
    setRemovedState(-1);
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

  const updateLocations = (index, newLocation, insert ) =>{
    
    if (insert ==  false){
      setLocations((prevLocations) => {
        let newLocations = [...prevLocations];
        newLocations[index] = newLocation;
        return newLocations;
      })
    }
    else{
      setLocations((prevLocations) => {
        let newLocations = [...prevLocations];
        newLocations.push(newLocation);
        return newLocations;
      })
    }
  }
    if (arrayName == "default"){
      return(
        <></>
      )
    }
    return (
      <div ref={arrayRef} style={{ display: 'flex', flexDirection: 'column' }}>
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
              id={parseInt(value.substring(value.indexOf("-") + 1))}
              passedValue={value.substring(value.indexOf("++") + 2, value.indexOf("-"))}
              movements={movements}
              locations={locations}
              speedState={speedState}
              updateLocations={updateLocations}
              indexState={indexState}
              inserted={addedState === value}
              removed={removedState === index}
              swapped={swappedState}
              changed={changedState === value}
              got={gotState === value}
              setSwappedState={setSwappedState}
            />
          ))}
        </motion.div>
      </div>
    );
  }
  

export default ArrayComponent;