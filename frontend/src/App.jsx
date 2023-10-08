import { useState, useEffect } from 'react'
import Notification from './components/Notification'
import Poll from './components/Poll'
import LoginForm from './components/LoginForm'
import SignUpForm from './components/SignUpForm'
import Togglable from './components/Togglable'
import PollForm from './components/PollForm'
import userService from './services/user'
import pollService from './services/polls'
import optionService from './services/options'

const App = () => {
  const [user, setUser] = useState(null)
  const [loginVisible, setLoginVisible] = useState(false)
  const [signUpVisible, setSignUpVisible] = useState(false)

  const [title, setTitle] = useState('')
  const [answer, setAnswer] = useState('')
  const [options, setOptions] = useState([])

  const [errorMessage, setErrorMessage] = useState(null)
  const [name, setName] = useState('')
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('')

  const [polls, setPolls] = useState([])

  useEffect(() => {
    pollService
      .getAll()
      .then(data => {
        setPolls(data)
      })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedVotingAppUser')
    if (loggedUserJSON) {
        const user = JSON.parse(loggedUserJSON)
        setUser(user)
        pollService.setToken(user.token)
    }
    }, [])
    
    const logOut = () => (
      <div>
          <button onClick={() => {
              window.localStorage.removeItem('loggedVotingAppUser', JSON.stringify(user))
              setUser(null)
          }}>log-out</button>
      </div>
    )

    const loginForm = () => {
      const hideWhenVisible = { display: loginVisible ? 'none' : '' }
      const showWhenVisible = { display: loginVisible ? '' : 'none' }
  
      return (
        <div>
          <div style={hideWhenVisible}>
            <button onClick={() => {setLoginVisible(true); setSignUpVisible(false)}}>log in</button>
          </div>
          <div style={showWhenVisible}>
            <LoginForm
              username={username}
              password={password}
              handleUsernameChange={({ target }) => setUsername(target.value)}
              handlePasswordChange={({ target }) => setPassword(target.value)}
              handleSubmit={handleLogin}
            />
            <button onClick={() => setLoginVisible(false)}>cancel</button>
          </div>
        </div>
      )
    }

    const signUpForm = () => {
      const hideWhenVisible = { display: signUpVisible ? 'none' : '' }
      const showWhenVisible = { display: signUpVisible ? '' : 'none' }
  
      return (
        <div>
          <div style={hideWhenVisible}>
            <button onClick={() => {setSignUpVisible(true); setLoginVisible(false)}}>sign up</button>
          </div>
          <div style={showWhenVisible}>
            <SignUpForm
              name={name}
              username={username}
              password={password}
              handleNameChange={({target}) => setName(target.value)}
              handleUsernameChange={({ target }) => setUsername(target.value)}
              handlePasswordChange={({ target }) => setPassword(target.value)}
              handleSubmit={handleSignUp}
            />
            <button onClick={() => setSignUpVisible(false)}>cancel</button>
          </div>
        </div>
      )
    }

    const handleSignUp = async (e) => {
      e.preventDefault();
      console.log(name, username, password)
      try {
        const user = await userService.signUp({
          name, username, password,
        })
        setName('')
        setUsername('')
        setPassword('')
      } catch (exception) {
        pollService.setToken(user.token)
        setUser(user)
        setErrorMessage('wrong credentials')
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      }
    }

    const handleLogin = async (e) => {
      e.preventDefault();
      console.log(username, password)
      try {
        const user = await userService.login({
          username, password,
        })
  
        window.localStorage.setItem(
          'loggedVotingAppUser', JSON.stringify(user)
        ) 
        pollService.setToken(user.token)
        setUser(user)
        setUsername('')
        setPassword('')
      } catch (exception) {
        pollService.setToken(user.token)
        setUser(user)
        setErrorMessage('wrong credentials')
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      }
    }

    const handleVote = (poll, option) => {
    }

    const addPoll = (e) => {
      e.preventDefault();
      options.push(answer)

      options.reduce((o, option) => {
        return optionService.create(option)
      })
      
      const pollObject = {
        title: title,
        options,
      }

      pollService
        .create(pollObject)
        .then(returnedPoll => {
          setPolls(polls.concat(returnedPoll))
        })
    }

    const addAnswer = (e) => {
      e.preventDefault()
      if (!answer){return}
      let divElement = document.createElement('div')
      divElement.classList.add('form-options')
      let pElement = document.createElement('p')
      let pT = document.createTextNode(answer)
      pElement.appendChild(pT)
      let bElement = document.createElement('button')
      let bT = document.createTextNode('del')
      bElement.appendChild(bT)
      divElement.appendChild(pElement)
      divElement.appendChild(bElement)
      document.getElementById('answers').appendChild(divElement)
      setAnswer('')
    }

    const pollForm = () => (
      <Togglable buttonLabel="new poll">
        <PollForm
          onSubmit={addPoll}
          handleTitleChange={({ target }) => setTitle(target.value)}
          title={title}
          handleAnswerChange={({ target }) => setAnswer(target.value)}
          answer={answer}
          addAnswer={addAnswer}
        />
      </Togglable>
      )

  return (
    <div className='main'>
      <h3>VotingApp</h3>
      <Notification message={errorMessage} />
      {!user && 
      <div>
        {loginForm()}
        {signUpForm()}
      </div>
      }
      {user && 
        <div>
            <p>{user.name} logged in</p>
            {logOut()}
            {pollForm()}
        </div>
      }
      <h3>Polls</h3>
      <div className='polls'>
        {polls.map(poll => 
          <Poll key={poll.id} poll={poll} />
        )}
      </div>
    </div>
  )
}

export default App