const PollForm = ({ 
    onSubmit, 
    handleTitleChange, 
    title,
    handleAnswerChange,
    answer,
    addAnswer
    }) => {
    return (
      <div className="pollForm">
        <h3>Create a new poll</h3>
  
        <form onSubmit={onSubmit}>
          <p>title</p>
          <div className="title">
            <input 
              id="title"
              value={title}
              onChange={handleTitleChange}
              />
          </div>
          <p>options</p>
          <div id="answers">

          </div>
          <div className="pollAnswer">
            <input
              value={answer}
              onChange={handleAnswerChange}
            />
            <button type="button" onClick={addAnswer}>add</button>
          </div>
          <button type="submit">post</button>
        </form>
      </div>
    )
  }
  
  export default PollForm