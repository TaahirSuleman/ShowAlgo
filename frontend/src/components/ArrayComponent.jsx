import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import '../styles/App.css'
import ArrayBlockComponent from './ArrayBlockComponent';


function ArrayComponent(props ) {//{ pausedState: boolean; speedState: number; movements: any; indexState: number; setIndexState: any; }
  const [values, setValues] = useState([]);
  const [removedState, setRemovedState] = useState(-1);
  const [addedState, setAddedState] = useState("");
  const [locations, setLocations] = useState([]); // Location array to keep track of which values are where
  const [swappedState, setSwappedState] = useState(["",""])
  const [changedState, setChangedState] = useState("")

  useEffect(() => {
      if (props.pausedState === true){return;}
      if (props.indexState > -1 && props.indexState < props.movements.length) {
        switch (props.movements[props.indexState].operation){
          case "create":
            let valuesArr = [];
            let locationsArr = [];
            for (let i = 0; i < props.movements[props.indexState].initialValues.length; i++) {
                valuesArr.push(props.movements[props.indexState].initialValues[i] + "-" + i);
                locationsArr.push(i);
                console.log(locationsArr)
            }
            setValues(valuesArr);
            setLocations(locationsArr);
            console.log(locations)
            const timeoutId = setTimeout(()=> {
              props.setOutput((prev) => {return [...prev, props.movements[props.indexState].description]});
              props.setIndexState((i)=>{return i+1})
            }, props.speedState*1000)
            return () => clearTimeout(timeoutId);
            break;

          case "swap":
            console.log("Its a swap");
            let prevValues = [...values];
            if (props.movements[props.indexState].firstPosition && props.movements[props.indexState].secondPosition){
            [prevValues[props.movements[props.indexState].firstPosition], prevValues[props.movements[props.indexState].secondPosition]] = [prevValues[props.movements[props.indexState].secondPosition], prevValues[props.movements[props.indexState].firstPosition]];
            }
            setSwappedState([prevValues[props.movements[props.indexState].firstPosition],prevValues[props.movements[props.indexState].secondPosition]])
            setValues(prevValues);
            const timeoutId4 = setTimeout(()=> {
              props.setOutput((prev) => {return [...prev, props.movements[props.indexState].description]});
              props.setIndexState((i)=>{return i+1})
            }, props.speedState*1000) // This controls the time between SWAPPING and the next movement.
            return () => clearTimeout(timeoutId4);
            break;

          case "insert":
            addToArray(props.movements[props.indexState].valueToInsert, props.movements[props.indexState].position);
            const timeoutId2 = setTimeout(()=> {
              props.setOutput((prev) => {return [...prev, props.movements[props.indexState].description]});
              props.setIndexState((i)=>{return i+1})
            }, props.speedState*1000) // This controls the time between INSERTING and the next movement.
            return () => clearTimeout(timeoutId2);
            break;

          case "remove":
            removeFromArray((props.movements[props.indexState].positionToRemove))
            const timeoutId3 = setTimeout(()=> {
              props.setOutput((prev) => {return [...prev, props.movements[props.indexState].description]});
              props.setIndexState((i)=>{return i+1})
            }, props.speedState*1000) // This controls the time between POPPING and the next movement.
            return () => clearTimeout(timeoutId3);
            break;
            
        }
      }

  }, [props.indexState, props.pausedState]);

  const delay = ms => new Promise(res => setTimeout(res, ms));


  const addToArray = async (value, location) => {
    let newEntry = value.toString() +"-"+ values.length;
    let newValues = [... values.slice(0,location), newEntry, ...values.slice(location)];
    setAddedState(newEntry);
    setValues(newValues);
    let previousLocations = [... locations];
    previousLocations.push(location);
    setLocations(previousLocations);
    console.log(values)
    await delay(props.speedState*1000*0.75); // Change argument here to determine how long to wait for highlighting to happen. This should be half the total animation time.
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
    await delay(props.speedState*1000*0.75); // Change argument here to determine how long to wait for highlighting to happen. This should be half the total animation time.
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
    if (values.length == 0){
      return(
        <></>
      )
    }
    return (
      <>
        <motion.div className="array-container">
          {values.map((value, index) => {
            return (
              <ArrayBlockComponent
                key = {value}
                keyProp = {value}
                id = {parseInt(value.substring(value.indexOf("-")+1))}
                value={value.substring(0,value.indexOf("-"))} 
                movements={props.movements}
                locations = {locations}
                speedState= {props.speedState}
                updateLocations = {updateLocations}
                indexState = {props.indexState}
                inserted = {addedState == value}
                removed = {removedState == index} // Make removedState be a string, do this same matching.
                swapped = {swappedState}
                change = {changedState}
                setSwappedState={setSwappedState}
              />
            );
          })}
      </motion.div>
      </>
        
    );
  }
  

export default ArrayComponent;