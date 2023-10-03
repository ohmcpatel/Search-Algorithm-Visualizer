import { useEffect, useState } from 'react';
import './App.css';
import { useMemo } from 'react';
let abort = false; 
let dirty = false;
let optimalSolution = 0; 
let explored = 0; 
let locked = false; 
let foundSolution = false; 
let isIdle = true;
let EXPLORE_SPEED = .2; 
let DONE_SPEED = 30; 

function Box({element}) {  
  return (
    <div className={((element == "s" || element == "e" ) ? "terminal" : (element == "x") ? "red" : (element == "+") ? "green" : (element == "X") ? "yellow" : "box")}>
      {element} 
    </div>
  )
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function App() {


  const [graph, setGraph] = useState([
  [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
  [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
  [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
  [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
  [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
  [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
  [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
  [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
  [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
  [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
  [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
  [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
  [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
  [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
  [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
  [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
  [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
  [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
  [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
  [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
  [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
  [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
  [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
  [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
  [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
  [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
  [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
  [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
  [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
  [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
  [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
  [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
  [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
  [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
])

  const handleExploreChange = (event) => {
    EXPLORE_SPEED = event.target.value; 
  }

  const handleDoneChange = (event) => {
    DONE_SPEED = event.target.value; 
  }

  const triggerLock = () => {
    locked = true; 
  }

  const max = (a, b) => {
    if (a > b) {
      return a;
    }
    else {
      return b;
    }
  }

  const min = (a, b) => {
    if (a < b) {
      return a;
    }
    else {
      return b;
    }
  }

  const gatify = () => {
    if (dirty == false) {
      let copy = [...graph];
      let i = 0; 
      for (i = 0; i < 34; i++){
        copy[Math.floor(Math.random() * 34)][Math.floor(Math.random() * 38)] = "X";
      }
      setGraph(copy); 
    }
  }

  const mazify = () => {
    const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];
    if (dirty == false) {
      let copy = [...graph];
      let i = 0; 
      let j = 0; 
      for (i = 0; i < 34; i++){
        for (j = 0; j < 38; j++) {
          copy[i][j] = "X"
        }
      }
      for (i = 0; i < 8; i++) {
        let randomPoint = [Math.floor(Math.random() * 34), Math.floor(Math.random() * 38)];
        while (randomPoint[0] != -1 && randomPoint[1] != -1 && randomPoint[0] != 34 && randomPoint[1] != 38){
          copy[randomPoint[0]][randomPoint[1]] = " ";
          if (Math.random() < .50){
            randomPoint[0] += directions[Math.floor(Math.random() * 4)][0];
          } else {
            randomPoint[1] += directions[Math.floor(Math.random() * 4)][1];
          }
          setGraph(copy);
        }
      }
    }
  }


  const reset = () => {
    locked = false
    abort = true; 
    foundSolution = false; 
    isIdle = true; 

    setGraph(prevGraph => {
      const newGraph = [
        [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
      ];
      dirty = false; 
      optimalSolution = 0;
      explored = 0;
      return newGraph;
    });
  };

  

  async function handleFinish(path) {
    let i = 0; 
    for (i = 0; i < path.length; i++)
    {
      let copy = [...graph];
      if (copy[path[i][0]][path[i][1]] != "s" && copy[path[i][0]][path[i][1]] != "e"){
        copy[path[i][0]][path[i][1]] = "+";
        await sleep(DONE_SPEED);
        setGraph(copy);
      }
    }
    foundSolution = true; 
    optimalSolution = path.length - 2; 
  }

  async function handleBFS() {
    if (dirty == true) {
      return;
    }
    isIdle = false; 
    dirty = true;
    abort = false;
    const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];
    const copy = [...graph];
    const startR = Math.floor(Math.random() * 34);
    const startC = Math.floor(Math.random() * 38);
    const endR = Math.floor(Math.random() * 34);
    const endC = Math.floor(Math.random() * 38);
  
    if ((startR === endR && startC === endC)) {
      handleBFS();
      return;
    }
  
    copy[startR][startC] = "s";
    copy[endR][endC] = "e";
    setGraph(copy);
  
    const visited = new Set(); // Track visited cells
    const queue = [[startR, startC, [[startR, startC]]]];
  
    while (queue.length > 0) {
      if (abort == true) {
        break;
      }
      const [currentR, currentC, path] = queue.shift();
  
      if (currentR === endR && currentC === endC) {
        handleFinish(path); // Highlight the path
        return; // Exploration complete
      }
  
      for (const [drX, drY] of directions) {
        const newR = currentR + drX;
        const newC = currentC + drY;
  
        if (
          newR < 0 ||
          newR === 34 ||
          newC < 0 ||
          newC === 38 ||
          visited.has(`${newR}-${newC}`) ||
          graph[newR][newC] === "s" ||
          graph[newR][newC] === "X"
        ) {
          continue;
        }
  
        const newPath = [...path, [newR, newC]];
        queue.push([newR, newC, newPath]);
        visited.add(`${newR}-${newC}`);
        if (copy[newR][newC] != "e") {
          copy[newR][newC] = "x"; // Mark the cell as expanded
          explored++;
          await sleep(EXPLORE_SPEED);
          setGraph([...copy]); // Update the graph and trigger a re-render
        }
       
      }
    }
    triggerLock(); 
  }
    
  
  

  async function handleDFS(){
    if (dirty == true) {
      return
    }
    isIdle = false; 
    dirty = true
    abort = false;
    const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]]
    let copy = [...graph]; 
    let startR = Math.floor(Math.random() * 34);
    let startC = Math.floor(Math.random() * 38);
    let endR = Math.floor(Math.random() * 34);
    let endC = Math.floor(Math.random() * 38);

    if ((startR == endR && startC == endC)){
      handleDFS();
      return;
    }
    copy[startR][startC] = "s";
    copy[endR][endC] = "e";
    setGraph(copy);

    const q = [];
    q.push([startR, startC, [[startR, startC]]])

    while (q.length != 0 && abort == false) {
      let current = q.pop();
      let currentR = current[0];
      let currentC = current[1];
      let path = current[2]; 

      let copy = [...graph]
      if (copy[currentR][currentC] == "e") {
        handleFinish([...path]); 
        return; 
      }
      for (let i = 0; i < 4; i++) {
        let drX = directions[i][0];
        let drY = directions[i][1];
        let newR = currentR + drX;
        let newC = currentC + drY; 
        let copy = [...graph];

        if (newR < 0 || newR == 34 || newC < 0 || newC == 38 || copy[newR][newC] == "s" || copy[newR][newC] == "x" || copy[newR][newC] == "X") {
          continue
        }
        let copyPath = [...path]
        copyPath.push([newR, newC])
        q.push([newR, newC, copyPath])
      }
      copy = [...graph];
      if (copy[currentR][currentC] != "s" &&  copy[currentR][currentC] != "x") {
        await sleep(EXPLORE_SPEED);
        copy[currentR][currentC] = "x";
        explored++; 

      }
      setGraph(copy);
    }
    triggerLock(); 
    return 
  }

  async function handleGreedy(){
    if (dirty == true) {
      return
    }
    isIdle = false; 
    dirty = true
    abort = false;
    const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]]
    let copy = [...graph]; 
    let startR = Math.floor(Math.random() * 34);
    let startC = Math.floor(Math.random() * 38);
    let endR = Math.floor(Math.random() * 34);
    let endC = Math.floor(Math.random() * 38);

    if ((startR == endR && startC == endC)){
      handleGreedy();
      return;
    }
    copy[startR][startC] = "s";
    copy[endR][endC] = "e";
    setGraph(copy);

    const q = [];
    q.push([startR, startC, [[startR, startC]]])

    while (q.length != 0 && abort == false) {
      let current = q.pop();
      let currentR = current[0];
      let currentC = current[1];
      let path = current[2]; 

      let copy = [...graph]
      if (copy[currentR][currentC] == "e") {
        handleFinish([...path]); 
        return; 
      }

      let lowestManhattanNumber = 100000; 
      let lowestManhattanCoordinate = [-1, -1];
      for (let i = 0; i < 4; i++) {
        let drX = directions[i][0];
        let drY = directions[i][1];
        let newR = currentR + drX;
        let newC = currentC + drY; 
        let copy = [...graph];

        if (newR < 0 || newR == 34 || newC < 0 || newC == 38 || copy[newR][newC] == "s" || copy[newR][newC] == "x" || copy[newR][newC] == "X") {
          continue
        }

        let currentManhattanNumber = (max(newR, endR) - min(newR, endR)) + (max(newC, endC) - min(newC, endC))
        if (currentManhattanNumber < lowestManhattanNumber) {
          lowestManhattanNumber = currentManhattanNumber;
          lowestManhattanCoordinate[0] = newR;
          lowestManhattanCoordinate[1] = newC;
          console.log(lowestManhattanCoordinate);
        }
      }

      if (lowestManhattanCoordinate == (-1, -1)) {
        continue;
      }

      let copyPath = [...path]
      copyPath.push([lowestManhattanCoordinate[0], lowestManhattanCoordinate[1]])
      q.push([lowestManhattanCoordinate[0], lowestManhattanCoordinate[1], copyPath])
      copy = [...graph];

      if (copy[currentR][currentC] != "s" &&  copy[currentR][currentC] != "x") {
        await sleep(EXPLORE_SPEED);
        copy[currentR][currentC] = "x";
        explored++; 

      }
      setGraph(copy);
    }
    triggerLock(); 
    return 
  }

  return (
    <div className="App">
      <div className='content'>
        <div className="main">
          {graph.map(row => row.map(val => <Box element={val} />))}
        </div>
        <div className='information'>
          <div className='title'>Path Visualizer Control Panel</div>
          <div className='informationBox'>
            <div className='informationTitle'>Information</div>
            <ul>
              <li>Solution Cost - {optimalSolution}</li>
              <li>Explored Cells - {explored}</li>
            </ul>
          </div> 
          <div className='status'>Status - {locked ? "No Possible Solution" : foundSolution ? "Found Solution" : isIdle ? "Idle" : "Working On Solution"}</div>
          <div className='informationBox'>
            <div className='informationTitle'>Speed Controls</div>
            <input onChange={event => handleExploreChange(event)} placeholder={EXPLORE_SPEED}/>
            <input onChange={event => handleDoneChange(event)} placeholder={DONE_SPEED}/>

          </div>
          <div className='buttons'>
            <button onClick={handleBFS} className='fs'>BFS</button>
            <button onClick={handleDFS} className='fs'>DFS</button>
            <button onClick={handleGreedy} className='fs'>Greedy</button>
            <button onClick={reset} className='fs'>Abort / Reset</button>
            <button onClick={gatify} className='fs'>Apply Gates</button>
            <button onClick={mazify} className='fs'>Apply Maze</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
