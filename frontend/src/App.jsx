import { useState, useEffect } from 'react'
import axios from 'axios'
import Poll from './components/Poll'
import pollService from './services/polls'

const App = () => {

  const [polls, setPolls] = useState([])

  useEffect(() => {
    pollService
      .getAll()
      .then(data => {
        setPolls(data)
      })
  }, [])

  return (
    <div className='main'>
      <h3>VotingApp</h3>
      <h3>Polls</h3>
      <ul>
        {polls.map(poll => 
          <Poll key={poll.id} poll={poll} />
        )}
      </ul>
    </div>
  )
}

export default App