import polls from '../services/polls';
import pollService from '../services/polls'

const Poll = ({ poll }) => {
    return (
      <div className="poll">
        <p>{poll.title}</p>
        <ul>
          {poll.options.map(option => 
            <li key={option.id}>
              <div className="answer">
                <span>{option.id}.</span>
                <p>{option.answer}</p>
              </div>
              <div className="likes">
                <p>{option.likes}</p>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                  }}
                >vote</button>
              </div>
            </li>
          )
          }
        </ul>
      </div>
    )
  }
  
  export default Poll