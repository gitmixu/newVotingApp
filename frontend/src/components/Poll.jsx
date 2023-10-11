import handleVoting from '../App'

const Poll = ({ poll, vote }) => {
    return (
      <div className="poll">
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
                  onClick={vote}>vote</button>
              </div>
            </li>
          )}
        </ul>
      </div>
    )
  }
export default Poll