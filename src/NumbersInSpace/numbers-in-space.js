import './numbers-in-space.scss';
import React, {useState,useEffect} from 'react'
export default function NumbersInSpace() {
  let nums=[]
  for (var index = 1; index <= 100; index++) {
    nums.push(index)
  }
  const [values,setValues] = useState([null,null,null])
  const [selectedTarget,setSelectedTarget] = useState(0)
  const selectedStyle = {border:'4px dashed black'}
  return (
    <div className="container">

      <div className={'targets'}>
        {values.map((value,i)=>{
          return <div className={`target`}
                      onClick={()=>setSelectedTarget(i)}
                      style={selectedTarget===i ? selectedStyle:{border:'4px dashed transparent'}}>
            {value}
          </div>
        })}
      </div>

      <div className={'numbers'}>
        {nums.map(num=>{
          return <div
            onClick={()=>setValues(values=>{
              const newValues = [...values];
              newValues[selectedTarget] = num
              return newValues;
            })}
            className={'num'}>{num}</div>})
        }
      </div>
      <div className={'clear'}>
        <button onClick={()=>setValues([null,null,null])}>clear</button>
      </div>
    </div>
  );
}

