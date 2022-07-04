import React from 'react'

const Person = ({ person, deletion}) => 
  <li> 
    {person.name} {person.number}
    <button onClick={() => deletion(person.id)}>delete</button>
  </li>

export default Person