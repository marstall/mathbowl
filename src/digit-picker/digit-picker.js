import "./digit-picker.scss";
import React, { useEffect} from "react";




export default function DigitPicker(props) {
    const {onNumClick} = props;

    function onKeyDown(event) {
        if (event.keyCode>=48 && event.keyCode<=57) {
            onNumClick(event.keyCode-48)
        }
    }

    useEffect(()=>{
        document.addEventListener("keydown", onKeyDown);
        return ()=>document.removeEventListener("keydown", onKeyDown);
    },[])
    let nums = [];
    for (var index = 0; index <= 9; index++) {
        nums.push(index);
    }
    return (
        <div className="container">
            <div className={"numbers"}>
                {nums.map((num) => {
                    return (
                        <div key={num} onClick={() => onNumClick(num)} className={"num"}>
                            {num}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
