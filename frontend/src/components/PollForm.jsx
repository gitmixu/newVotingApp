const PollForm = ({ 
    onSubmit, 
    handleTitleChange, 
    title,
    handleOpt1Change,
    opt1,
    handleOpt2Change,
    opt2,
    handleOpt3Change,
    opt3
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
            <div className="pollAnswer">
              <input
                value={opt1}
                onChange={handleOpt1Change}
              />
            </div>
            <div className="pollAnswer">
              <input
                value={opt2}
                onChange={handleOpt2Change}
              />
            </div>
            <div className="pollAnswer">
              <input
                value={opt3}
                onChange={handleOpt3Change}
              />
            </div>
          </div>
          <button type="submit">post</button>
        </form>
      </div>
    )
  }
  
  export default PollForm