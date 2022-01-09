import React, { useState, useEffect, useRef } from "react";
import DigitPicker from "../digit-picker/digit-picker";
import { Problem } from "../problem/problem";
import styles from "./math-bowl.module.scss";

export default function MathBowl() {
  const places = 2;
  const terms = 2;
  const inc = 10;
  const problemRef = useRef(null);
  const [nums, setNums] = useState([]);
  const [seed, setSeed] = useState(new Date().getTime());
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(60 * 5);
  function countDown() {
    setTimer((timer) => timer - 1);
  }
  useEffect(() => {
    setInterval(countDown, 1000);
    return clearInterval(countDown);
  }, []);
  return (
    <div className={styles.container}>
      <div
        className={styles.progressBar}
        style={{
          width: "50%",
        }}
      />
      <div className={styles.title}>Math Bowl</div>

      <div className={styles.statusBar}>
        <div className={styles.score}>{score}</div>
        <div className={styles.timer}>{timer}</div>
      </div>

      <Problem
        onRef={problemRef}
        seed={seed}
        onSolution={() => {
          console.log("onSolution");
          setScore((score) => score); // + 10 * places + Math.pow(10, terms));
          setSeed((seed) => ++seed);
        }}
        operand={"+"}
        places={places}
        terms={terms}
        nums={nums}
      />
      <DigitPicker onNumClick={(n) => setNums((nums) => [...nums, n])} />
    </div>
  );
}
