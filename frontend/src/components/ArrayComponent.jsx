import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import '../styles/App.css'
import ArrayBlockComponent from './ArrayBlockComponent';


function ArrayComponent(
  {
    arrayName,
    movements,
    arrayState,
    arraysState,
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

  

  useEffect(() => {
    const operations = ["get","swap","add","remove","setArr"]
    const performOperations = () => {
      if (indexState > -1 && indexState < movements.length && !pauseState) {
        //console.log(movements[indexState].varName + " _________ " +arrayName)
        if (!operations.includes(movements[indexState].operation) || movements[indexState].varName !== arrayName){
          console.log("uh oh stupid "+movements[indexState].operation +" "+ movements[indexState].varName)
          return;
        }
        switch (movements[indexState].operation){

          case "swap":
            console.log("Its a swap");
            let prevValues = [...values];
            if (movements[indexState].firstPosition && movements[indexState].secondPosition){
            [prevValues[movements[indexState].firstPosition], prevValues[movements[indexState].secondPosition]] = [prevValues[movements[indexState].secondPosition], prevValues[movements[indexState].firstPosition]];
            }
            setSwappedState([prevValues[movements[indexState].firstPosition],prevValues[movements[indexState].secondPosition]])
            setValues(prevValues);
            const timeoutId1 = setTimeout(()=> {
              setOutput((prev) => {return [...prev, movements[indexState].description]});
              setIndexState((i)=>{return i+1})
              setSwappedState(["",""])
            }, speedState*1000) // This controls the time between SWAPPING and the next movement.
            return () => clearTimeout(timeoutId1);
            break;

          case "add":
            addToArray(movements[indexState].value, movements[indexState].position);
            const timeoutId2 = setTimeout(()=> {
              setOutput((prev) => {return [...prev, movements[indexState].description]});
              setIndexState((i)=>{return i+1})
            }, speedState*1000) // This controls the time between INSERTING and the next movement.
            return () => clearTimeout(timeoutId2);
            break;

          case "remove":
            removeFromArray((movements[indexState].positionToRemove))
            const timeoutId3 = setTimeout(()=> {
              setOutput((prev) => {return [...prev, movements[indexState].description]});
              setIndexState((i)=>{return i+1})
            }, speedState*1000) // This controls the time between POPPING and the next movement.
            return () => clearTimeout(timeoutId3);
            break;

            case "get":
              setGotState(values[movements[indexState].index]);
              console.log(values[movements[indexState].index] + " This is the got state ")
              const timeoutId4 = setTimeout(()=> {
                setOutput((prev) => {return [...prev, movements[indexState].description]});
                setIndexState((i)=>{return i+1})
              }, speedState*1000) // This controls the time between POPPING and the next movement.
              return () => clearTimeout(timeoutId4);
              break;

            case "setArr":
              setValueInArray(movements[indexState].setValue, movements[indexState].index)
              console.log(values[movements[indexState].index] + " This is the changed state ")
              const timeoutId5 = setTimeout(()=> {
                setOutput((prev) => {return [...prev, movements[indexState].description]});
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
    let newEntry = arrayState.name + "++"+ value.toString() +"-"+ values.length;
    let newValues = [... values.slice(0,location), newEntry, ...values.slice(location+1)];
    setChangedState(newEntry);
    setValues(newValues);
    let previousLocations = [... locations]; //
    previousLocations.push(location); // This location stuff is deprecated and may not ever be used. This code may not make sense.
    setLocations(previousLocations); //
    console.log(values)
    await delay(speedState*1000*0.66); // Change argument here to determine how long to wait for highlighting to happen. This should be half the total animation time.
    console.log("These are the locations: "+locations);
    setChangedState("")
  }

  const addToArray = async (value, location) => {
    let newEntry = arrayState.name + "++"+ value.toString() +"-"+ values.length;
    let newValues = [... values.slice(0,location), newEntry, ...values.slice(location)];
    setAddedState(newEntry);
    setValues(newValues);
    let previousLocations = [... locations];
    previousLocations.push(location);
    setLocations(previousLocations);
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
      <div style={{display: 'flex', flexDirection:'column'}}>
      <p>{arrayName}</p>
        <motion.div className="array-container">
          {values.map((value, index) => {
            return (
              <ArrayBlockComponent
                key = {value}
                keyProp = {value}
                id = {parseInt(value.substring(value.indexOf("-")+1))}
                passedValue={value.substring(value.indexOf("++")+2,value.indexOf("-"))} 
                movements={movements}
                locations = {locations}
                speedState= {speedState}
                updateLocations = {updateLocations}
                indexState = {indexState}
                inserted = {addedState == value}
                removed = {removedState == index} // Make removedState be a string, do this same matching.
                swapped = {swappedState}
                changed = {changedState == value}
                got = {gotState == value}
                setSwappedState={setSwappedState}
              />
            );
          })}
      </motion.div>
      </div>
        
    );
  }
  

export default ArrayComponent;