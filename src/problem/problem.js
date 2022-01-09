import styles from "./problem.module.scss";
import animationStyles from "./animations.module.scss";
import { useEffect, useRef, useState } from "react";
import { clog, numToPlaces, rndWithPlaces, times } from "../helpers";
import classNames from "classnames";
const profiles = {
  "+": {
    formula: (...terms) =>
      terms.reduce((acc, term) => {
        return acc + term;
      }, 0),
    carry: true,
    numAnswerPlaces: (places, rows) => places + 1,
  },
  "-": {
    formula: (...terms) =>
      terms.reduce((acc, term) => (acc === null ? term : acc - term), null),
    carry: false,
    numAnswerPlaces: (places, rows) => places,
  },
};

export function Problem(props) {
  const {
    seed,
    nums,
    sequence,
    onSolution,
    operand,
    places,
    inc,
    terms: numTerms = 2,
  } = props;
  const numAnswerPlaces = profiles[operand].numAnswerPlaces(places, numTerms);
  const numCarryPlaces = profiles[operand].carry ? places - 1 : 0;
  const [terms, setTerms] = useState([]);
  const [realAnswer, setRealAnswer] = useState(null);
  const [realAnswerPlaceValues, setRealAnswerPlaceValues] = useState(null);
  const [noTapsYets, setNoTapsYet] = useState(true);
  const [savedSequence, setSavedSequence] = useState(sequence);
  const [savedNums, setSavedNums] = useState(nums);
  const [solved, setSolved] = useState(false);
  const [animations, setAnimations] = useState({});

  const [answerPlaceValues, setAnswerPlaceValues] = useState(
    new Array(numAnswerPlaces)
  );
  const [carryPlaceValues, setCarryPlaceValues] = useState(
    new Array(numCarryPlaces)
  );
  const [selectedCarryCellIndex, setSelectedCarryCellIndex] = useState(null);
  const [selectedCellIndex, setSelectedCellIndex] = useState(
    numAnswerPlaces - 1
  );

  function placeSolved(i) {
    if (!realAnswerPlaceValues) return false;
    const real =
      answerPlaceValues.length > realAnswerPlaceValues.length
        ? [undefined, ...realAnswerPlaceValues]
        : realAnswerPlaceValues;
    const ret = answerPlaceValues[i] === real[i];
    return ret;
  }

  function placeCarries(i) {
    if (i < 2) return false;
    const termIndex = i - (numAnswerPlaces - places);

    const tot = terms
      .map((term) => numToPlaces(term)[termIndex])
      .reduce((acc, i) => acc + i, 0);

    return tot >= 10;
  }

  function placeAnswered(i) {
    return answerPlaceValues[i] !== undefined;
  }

  useEffect(() => {
    console.log({ seed });
    const terms = times(numTerms, () => rndWithPlaces(seed, places));

    const realAnswer = profiles[operand].formula(...terms);

    setRealAnswer(realAnswer);
    setAnswerPlaceValues(new Array(numAnswerPlaces));
    setCarryPlaceValues(new Array(numCarryPlaces));
    const realAnswerPlaceValues = numToPlaces(realAnswer);
    setRealAnswerPlaceValues(realAnswerPlaceValues);
    setTerms(terms);
  }, [seed]);

  if (nums.length > savedNums.length) {
    setSavedNums(nums);

    selectedCellIndex !== null &&
      setAnswerPlaceValues((answerPlaceValues) => {
        const clone = [...answerPlaceValues];
        clone[selectedCellIndex] = nums[nums.length - 1];
        return clone;
      });
    if (selectedCarryCellIndex !== null) {
      setCarryPlaceValues((carryPlaceValues) => {
        const clone = [...answerPlaceValues];
        clone[selectedCarryCellIndex] = nums[nums.length - 1];
        return clone;
      });
      setSelectedCarryCellIndex(null);
      setSelectedCellIndex(selectedCarryCellIndex + 1);
    }
  }

  useEffect(() => {
    setSelectedCellIndex((selectedCellIndex) => {
      if (placeSolved(selectedCellIndex)) {
        if (placeCarries(selectedCellIndex)) {
          setSelectedCarryCellIndex(selectedCellIndex - 2);
          return null;
        } else {
          if (selectedCellIndex > 0) return selectedCellIndex - 1;
        }
      } else {
        return selectedCellIndex;
      }
    });
  }, [answerPlaceValues]);

  useEffect(() => {
    if (
      JSON.stringify(
        answerPlaceValues.filter((_) => ![null, undefined].includes(_))
      ) === JSON.stringify(realAnswerPlaceValues)
    )
      setSolved(true);
  }, [answerPlaceValues]);

  useEffect(() => {
    if (solved) {
      setTimeout(() => {
        setAnimations((animations) => ({
          ...animations,
          problem: "zoomOut",
          bigScore: "bigScoreZoomIn",
        }));
        setTimeout(() => {
          onSolution();
          setSelectedCellIndex(numAnswerPlaces - 1);
          setSolved(false);
          setAnimations((animations) => ({
            ...animations,
            bigScore: null,
            problem: "zoomIn",
          }));
        }, 500);
      }, 500);
    }
  }, [solved]);
  return (
    <>
      <div
        className={styles.container}
        // style={{
        //   transform: solved ? "scale(10)" : null,
        //   opacity: solved ? 0 : 1,
        // }}
      >
        <div className={styles.problem}>
          <div className={animationStyles[animations["problem"]]}>
            <div className={styles.leftExpression}>
              <div className={styles.carryRow}>
                {times(numCarryPlaces, (i) => (
                  <div
                    onClick={() => {
                      setSelectedCarryCellIndex(i);
                      setSelectedCellIndex(null);
                    }}
                    className={styles.carryValue}
                    style={{
                      border: selectedCarryCellIndex === i && "2px solid black",
                    }}
                  >
                    {carryPlaceValues[i]}
                  </div>
                ))}
              </div>
              {terms.map((term, i) => (
                <div className={styles.term}>
                  {i > 0 && <div className={styles.operand}>{operand}</div>}
                  {numToPlaces(term).map((placeValue) => (
                    <div className={styles.placeValue}>{placeValue}</div>
                  ))}
                </div>
              ))}
            </div>
            <div className={styles.rightExpression}>
              <div
                className={styles.check}
                style={{
                  opacity: solved ? 1 : 0,
                  transform: solved ? "scale(1)" : "scale(0.5)",
                  transition: "all 250ms",
                }}
              >
                ✅
              </div>
              {times(numAnswerPlaces, (i) => (
                <div
                  onClick={() => {
                    setNoTapsYet(false);
                    setSelectedCellIndex(i);
                    setSelectedCarryCellIndex(null);
                  }}
                  className={styles.answerPlaceValue}
                  style={{
                    border: selectedCellIndex === i && "2px solid black",
                    backgroundColor: placeAnswered(i)
                      ? placeSolved(i)
                        ? "lightgreen"
                        : "red"
                      : "transparent",
                  }}
                >
                  {answerPlaceValues[i]}
                </div>
              ))}
            </div>
          </div>
          <div
            className={classNames(
              styles.bigScore,
              animationStyles[animations["bigScore"]]
            )}
          >
            +{inc}
          </div>
        </div>
      </div>
      <div
        style={{
          margin: 24,
          display: "none",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <div style={{ display: "none" }}>
          <div>sequence {sequence}</div>
          <div>seed {seed}</div>
          <div>youranswer</div>
          <div>
            {answerPlaceValues && answerPlaceValues.filter((_) => _).join(", ")}
          </div>
          <div>realanswer</div>
          <div>{realAnswerPlaceValues && realAnswerPlaceValues.join(", ")}</div>
          <div>{realAnswer}</div>
          <div>
            {JSON.stringify(answerPlaceValues.filter((_) => _))}===
            {JSON.stringify(realAnswerPlaceValues)}
          </div>
          <div>
            {JSON.stringify(answerPlaceValues.filter((_) => _)) ===
            JSON.stringify(realAnswerPlaceValues)
              ? "eq"
              : "neq"}
          </div>
          <div>{solved ? "solved" : "unsolved"}</div>
        </div>
      </div>
      {/*<div>*/}
      {/*  */}
      {/*</div>*/}
      {/*<button*/}
      {/*  style={{*/}
      {/*    fontSize: 12,*/}
      {/*    padding: 6,*/}
      {/*    width: 90,*/}
      {/*    backgroundColor: "lavender",*/}
      {/*  }}*/}
      {/*  type="button"*/}
      {/*  onClick={showAnswer}*/}
      {/*>*/}
      {/*  show answer*/}
      {/*</button>*/}
    </>
  );
}
