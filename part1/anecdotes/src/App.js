import { useState } from 'react'

const Button = (props) => (
  <button onClick={props.setState}>
    {props.text}
  </button>
)

const StatisticLine = props => {
  return <td> {props.text} {props.value} </td>
}

const Statistics = (props) => {
  if (props.total == 0) {
    return <div>
      No feedback given
    </div>
  }

  return  <table>
  <tbody>
  <tr><StatisticLine text = "good" value = {props.good} /></tr>
  <tr><StatisticLine text = "neutral" value = {props.neutral} /></tr>
  <tr><StatisticLine text = "bad" value = {props.bad} /></tr>
  <tr><StatisticLine text = "all" value = {props.total} /></tr>
  <tr><StatisticLine text = "average" value = {isNaN(props.average) ? 0 : props.average}/></tr>
  <tr><StatisticLine text = "positive" value = {isNaN(props.positive) ? 0 + "%" : props.positive + "%"} /></tr>
  </tbody>
  </table>
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const total = good + neutral + bad
  const average = (good - bad)/total
  const positive = (good/total) * 100


  return (
    <div>
      <h1>Give Feedback</h1>
      <Button setState={ () => setGood(good + 1)} text='good' />
      <Button setState={ () => setNeutral(neutral + 1)} text='neutral' />
      <Button setState={ () => setBad(bad + 1)} text='bad' />

      <h1>statistics</h1>
      <Statistics good={good} bad={bad} neutral={neutral} total={total} average={average} positive={positive} />


    </div>
  )
}

export default App