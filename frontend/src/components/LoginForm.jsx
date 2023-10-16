const LoginForm = ({
    handleSubmit,
    handleUsernameChange,
    handlePasswordChange,
    username,
    password
   }) => {
   return (
     <div className="box">
       <h2>log in</h2>
  
       <form onSubmit={handleSubmit}>
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
         <button type="submit">log in</button>
       </form>
     </div>
   )
  }
  
  export default LoginForm