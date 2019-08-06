import React, { useState, useEffect } from 'react'
import axios from 'axios'

function MainLayout() {
  const config = {
    url: "https://cors-anywhere.herokuapp.com/https://redmine.twinscom.ru"
  }

  const [tasks, setTasks] = useState(null)
  const [username, setUsername] = useState('')
  const [pass, setPass] = useState('')
  const [loading, setLoading] = useState(false)
  const [hunted, setHunted] = useState([])

  useEffect(() => {


  })

  function handleNameChange(event) {
    setUsername(event.target.value)
  }

  function handlePassChange(event) {
    setPass(event.target.value)
  }

  function handleSubmit(event) {
    var basicAuth = 'Basic ' + btoa(username + ':' + pass);
    setLoading(true);
    axios.get(`${config.url}/issues.json?assigned_to_id=me`, {
      headers: {
        "Authorization": basicAuth,
      }
    })
      .then(response => response.data)
      .then(data => { setLoading(false); setTasks(data.issues) })

    event.preventDefault();
  }

  function handleTaskClick(taskId) {
    console.log(hunted);
    return hunted.includes(taskId)
      ? false
      : setHunted([...hunted, taskId])
  }

  const listOf = (tasks, canBeHunted = false) => {
    return tasks.map((task) => {
      const taskId = task.id || task
      return (
        <li key={taskId} >
          <a href={`https://redmine.twinscom.ru/issues/${taskId}`}>{taskId}</a>
          {canBeHunted && <span onClick={() => handleTaskClick(taskId)}>Назначить охоту</span>}
        </li>
      )
    })
  }

  return (
    <React.Fragment>
      <form onSubmit={handleSubmit}>
        <label>
          Имя пользователя в редмайне:
          <input type="text" value={username} onChange={handleNameChange} />
        </label>
        <label>
          Редмайновский пасс:
          <input type="password" value={pass} onChange={handlePassChange} />
        </label>
        <div className="reminder">
          *Эти данные нигде не будут сохранены ( кроме текущей сессии, конечно :P )
        </div>
        <input type="submit" value="Войти" />
      </form>
      {tasks &&
        <React.Fragment>
          <h2>Твои таски:</h2>
          <ul>
            {listOf(tasks, true)}
          </ul>
        </React.Fragment>
      }
      {hunted.length > 0 &&
        <React.Fragment>
          <h2>Текущие таски поставленные в охоту:</h2>
          <ul>
            {listOf(hunted)}
          </ul>
        </React.Fragment>
      }
      {!tasks && loading &&
        <React.Fragment>
          <h1> Я тут фетчу вообще-та... </h1>
        </React.Fragment>
      }
    </React.Fragment>
  )
}

export default MainLayout
