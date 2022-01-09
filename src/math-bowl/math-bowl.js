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
  const [timer, setTimer] = useState(5 * 60);
  const [complete, setComplete] = useState(false);
  const [started, setStarted] = useState(false);

  function countDown() {
    setTimer((timer) => timer - 1);
  }

  useEffect(() => {
    if (timer <= 0) {
      clearInterval(countDown);
      setComplete(true);
    }
  }, [timer]);

  useEffect(() => {
    if (started) {
      setInterval(countDown, 1000);
      return clearInterval(countDown);
    }
  }, [started]);

  return (
    <div className={styles.container}>
      {!started ? (
        <div className={styles.startScreen}>
          <div className={styles.title}>Math Bowl</div>
          <button onClick={() => setStarted(true)}>start</button>
        </div>
      ) : complete ? (
        <div className={styles.complete}>
          <div className={styles.msg1}>countdown complete!</div>
          <div>
            <div className={styles.msg2}>final score</div>
            <div className={styles.score}>{score}</div>
          </div>
        </div>
      ) : (
        <div>
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
              setScore((score) => score + 1); // + 10 * places + Math.pow(10, terms));
              setSeed((seed) => ++seed);
            }}
            operand={"+"}
            places={places}
            terms={terms}
            nums={nums}
          />
          <DigitPicker onNumClick={(n) => setNums((nums) => [...nums, n])} />
        </div>
      )}
    </div>
  );
}
