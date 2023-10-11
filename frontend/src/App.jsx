import { useState, useEffect } from 'react'
import Notification from './components/Notification'
import Poll from './components/Poll'
import LoginForm from './components/LoginForm'
import SignUpForm from './components/SignUpForm'
import Togglable from './components/Togglable'
import PollForm from './components/PollForm'
import userService from './services/user'
import pollService from './services/polls'

const App = () => {
  const [user, setUser] = useState(null)
  const [loginVisible, setLoginVisible] = useState(false)
  const [signUpVisible, setSignUpVisible] = useState(false)

  const [title, setTitle] = useState('')
  const [opt1, setOpt1] = useState('')
  const [opt2, setOpt2] = useState('')
  const [opt3, setOpt3] = useState('')

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
      if(user) {
        const findPoll = polls.find(p => p.id === poll.id)
        const changedPoll = { ...findPoll }
        console.log(poll)
        console.log(changedPoll.options[option.id-1].likes)
        changedPoll.options[option.id-1].likes += 1
  
        pollService
        .update(poll.id, changedPoll)
        .then(returnedPoll => {
          setPolls(polls.map(p => p.id !== poll.id ? p : returnedPoll))
        })
        .catch(error => {
          setErrorMessage(
            `Poll '${poll.title}' was already removed from server`
          )
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        })
      }
      if(!user){
        setErrorMessage(
          `you must be logged in`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        return;
      }

    }

    const addPoll = (e) => {
      e.preventDefault();
      
      const pollObject = {
        title: title,
        options: [
          {
            id: 1,
            option: opt1,
            likes: 0
          },
          {
            id: 2,
            option: opt2,
            likes: 0
          },
          {
            id: 3,
            option: opt3,
            likes: 0
          }
        ]
      }

      pollService
        .create(pollObject)
        .then(returnedPoll => {
          setPolls(polls.concat(returnedPoll))
        })
    }

    const pollForm = () => (
      <Togglable buttonLabel="new poll">
        <PollForm
          onSubmit={addPoll}
          handleTitleChange={({ target }) => setTitle(target.value)}
          title={title}
          handleOpt1Change={({ target }) => setOpt1(target.value)}
          opt1={opt1}
          handleOpt2Change={({ target }) => setOpt2(target.value)}
          opt2={opt2}
          handleOpt3Change={({ target }) => setOpt3(target.value)}
          opt3={opt3}
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
        <div key={poll.id} className="poll">
          <p>{poll.title}</p>
          <ul>
            {poll.options.map(option => 
              <li key={option.id}>
                <div className="answer">
                  <span>{option.id}.</span>
                  <p>{option.option}</p>
                </div>
                <div className="likes">
                  <p>{option.likes}</p>
                  <button
                    onClick={() => {handleVote(poll, option)}}>vote</button>
                </div>
              </li>
            )}
          </ul>
        </div>
        )}
      </div>
    </div>
  )
}

export default App