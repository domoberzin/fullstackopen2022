const Header = (props) => {
  return <>
    <h1> {props.course.name} 
    </h1>
  </>
}

const Content = (props) => {
  return <>
    <Part name={props.course.parts[0].name} count={props.course.parts[0].count} />
    <Part name={props.course.parts[1].name} count={props.course.parts[1].count} />
    <Part name={props.course.parts[2].name} count={props.course.parts[2].count} />
  </>
}

const Part = (props) => {
  return <>
    <p>
      {props.name} {props.count}
    </p>
  </>

}

const Total = (props) => {
  let counter = 0
  for(let i = 0; i < props.course.parts.length; i++) {
    counter += props.course.parts[i].count
  }
  return ( <>
    <p> Number of exercises {counter} 
    </p>
  </>)
}

const App = () => {
  const course = { 
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        count: 10  
      },
      {
        name:'Using props to pass data',
        count: 7
      },
      {
        name:'State of a component',
        count:14
      }
    ]
  }
  return (
    <>
      <Header course={course} />
      <Content course={course} />
      <Total course={course}/>
    </>
  )
}

export default App