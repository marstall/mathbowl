import './App.scss';
import React, {useState,useEffect} from 'react'
import NumbersInSpace from "./NumbersInSpace/numbers-in-space";

function App() {
  return (
    <div className="container">
<div className='header'>
  Numbers in Space
</div>
      <NumbersInSpace/>
    </div>
  );
}

export default App;
