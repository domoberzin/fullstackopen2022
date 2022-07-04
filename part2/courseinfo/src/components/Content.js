import React from 'react'
import Part from './Part'


const Content = ({ parts }) => 
  <>{parts.map(part =>
    <div key = {part.id}>
  <Part
    part={part} 
    /> </div>)}
  </>

export default Content