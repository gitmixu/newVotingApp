const SignUpForm = ({
    name,
    username,
    password,
    handleNameChange,
    handleUsernameChange,
    handlePasswordChange,
    handleSubmit
    }) => {
   return (
     <div className="box">
       <h2>sign up</h2>
  
       <form onSubmit={handleSubmit}>
        <div>
           name
           <input
             value={name}
             onChange={handleNameChange}
           />
         </div>
         <div>
           username
           <input
             value={username}
             onChange={handleUsernameChange}
           />
         </div>
         <div>
           password
           <input
             type="password"
             value={password}
             onChange={handlePasswordChange}
           />
       </div>
         <button type="submit">sign up</button>
       </form>
     </div>
   )
  }
  
  export default SignUpForm