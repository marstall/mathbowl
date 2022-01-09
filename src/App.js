import "./App.module.scss";
import React, { useState, useEffect } from "react";
import NumbersInSpace from "./NumbersInSpace/numbers-in-space";
import MathBowl from "./math-bowl/math-bowl";
import styles from "./App.module.scss";
function App() {
  return (
    <div className={styles.container}>
      <MathBowl />
    </div>
  );
}

export default App;
