import React from "react";
import Person from './Person.js'

const Persons = ({persons, deletion}) => 
    <ul>
        {persons.map(person => <Person key = {person.name} person = {person} deletion = {deletion}/>)}
    </ul>


export default Persons