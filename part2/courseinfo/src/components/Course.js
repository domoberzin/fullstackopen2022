import React from 'react'
import Header from './Header.js'
import Content from './Content'
import Total from './Total'



const Course = ({ course }) => {
  return (
    <>
    <Header course = {course.name}/>
    <Content parts = {course.parts}/>
    <Total sum = {course.parts.reduce( (x,y) => x + y.exercises, 0)}/>
    </>
    )
}

export default Course