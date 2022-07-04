import { useEffect, useState } from 'react'
import axios from 'axios'
import PersonForm from './components/PersonForm'
import Filter from './components/Filter'
import Persons from './components/Persons'
import personService from './services/persons'
import Notification from './components/Notification'
import Error from './components/Error'


const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [mainPersonsList, setMainList] = useState(persons)
  const [notificationMessage, setNotifMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)


  useEffect(() => {
    personService
      .getAll()
      .then(initial => {
        setPersons(initial)
        setMainList(initial)
      })

  }, [])


  const deletePerson = (id) => {
    const person = persons.find(n => n.id == id)

    if (window.confirm(`Delete ${person.name}`)) {
      personService
        .deletion(id).then(returnedObject => {
          setPersons(persons.filter(x => x.id != id))
          setMainList(persons.filter(x => x.id != id))
        })
        .catch(error => {
          setErrorMessage(
            `Information of ${person.name} has already been removed from the server`
          )
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        })
        setPersons(persons.filter(x => x.id != id))
        setMainList(persons.filter(x => x.id != id))
    }

  }

  const addPerson = (event) => {
    event.preventDefault()

    if (newName != "") {

    const checker = persons.filter(x => x.name === newName)

    if (checker.length === 0) {
      const Person = {
        name: newName,
        number: newNumber
      }

      personService
        .create(Person)
        .then(returnedObject => {
      setPersons(persons.concat(returnedObject))
      setMainList(mainPersonsList.concat(returnedObject))
      setNotifMessage(`Added ${newName}`)
      setTimeout(() => {
        setNotifMessage(null)
      }, 5000)
      setNewName('')
      setNewNumber('')
      })
    } else {
      if (window.confirm(`${newName} is already added to the phonebook, replace the old number with a new one?`)) {
        const person = persons.find(n => n.name == newName)
        const id = person.id
        const url = `http://localhost:3001/persons/${id}`
        const changedPerson = { ...person, number: newNumber}
        personService
          .update(id, changedPerson).then(returnedObject => {
            setPersons(persons.map(x => x.id != id ? x : returnedObject))
            setMainList(persons)
            setNotifMessage(`Changed ${newName}'s number`)
            setTimeout(() => {
              setNotifMessage(null)
            }, 5000)
            setNewName('')
            setNewNumber('')
          })
          .catch(error => {
            setErrorMessage(
              `Information of ${person.name} has already been removed from the server`
            )
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)
            setPersons(persons.filter(x => x.name != newName))
            setMainList(persons)
            setNewName('')
            setNewNumber('')
          })
      } else {
        setNewName('')
        setNewNumber('')
      }
    }
    }
  }

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }


  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const filterName = (event) => {
    console.log(mainPersonsList)
    const temp = event.target.value
    const copy = mainPersonsList.slice()
    const result = () => copy.filter(x => x.name.toLowerCase().includes(temp.toLowerCase()))
    setPersons(result)
  }

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification message={notificationMessage} />
      <Error message = {errorMessage} />
      <Filter filterName = {filterName}/>
      <h1>Add a new</h1>
      <PersonForm onSubmit ={addPerson} newName = {newName} handleNameChange = {handleNameChange} newNumber = {newNumber}
      handleNumberChange = {handleNumberChange}/>
      <h1>Numbers</h1>
      <Persons persons = {persons} deletion = {deletePerson}/>
    </div>
  )
}

export default App
