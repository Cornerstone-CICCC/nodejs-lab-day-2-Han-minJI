import { Request, Response } from 'express'
import userModel from '../models/user.model'
import { User } from '../types/user'


/**
 * Sign up (add user)
 * 
 * @route POST /signup
 * @param {Request<{}, {}, Omit<User, 'id'>>} req
 * @param {Response} res
 * @returns {void} Respond with success/fail.
 */
const addUser = async (req: Request<{},{}, Omit<User, "id">>, res: Response)=> {
  const {username, password, firstname, lastname} = req.body
  if(!username.trim() || !password.trim()||
  !firstname.trim() || !lastname.trim()) {
    res.status(500).json({
      message: "Missing your info!"
    })
    return
  }

  const isSuccess: boolean = await userModel.createUser({username, password, firstname, lastname})
  if(!isSuccess){
    res.status(409).json({
      message: "username is taken"
    })
    return
  }

  res.status(201).json({
    message: "User successfully added!"
  })

}

/**
 * Login User
 * 
 * @route POST /login
 * @param {Request<{}, {},  Omit<User, "id"| "firstname"|"lastname">>} req
 * @param {Response} res
 * @returns {void} Respond success and cookie
 */
const loginUser = async (req: Request<{}, {}, Omit<User, "id"| "firstname"|"lastname">>, res: Response) => {
  const {username, password} = req.body
  if(!username.trim() || !password.trim()){
    res.status(500).json({
      messsage: "Username or password is empty!"
    })
    return
  }

  const user = await userModel.login({username, password})

  if(!user){
    res.status(500).json({
      message: "Incorrect username or password"
    })
    return
  }

  if(req.session){
    req.session.isLoggedIn = true
    req.session.username = user.username
  }
  res.status(200).json({
    message: "Login Successful"
  })

}


/**
 * Get user by name
 * 
 * @route GET /check-auth
 * @param {Request<{username: string}>} req
 * @param {Response} res
 * @returns {void} Respond with success/fail.
 */

const getUserByUsername = (req: Request, res: Response) => {
  if(!req.session || !req.session.username) {
    res.status(401).json({
      message: "Only logged-in users can access this page!"
    })
    return
  }

  const {username} = req.session
  const user = userModel.findByUsername(username)
  if(!user){
    res.status(404).json({
      message: "User does not exist"
    })
    return
  }

  res.status(200).json({
    username: user.username,
    firstname: user.firstname,
    lastname: user.lastname    
  })
}

/**
 * Logout
 * 
 * @route GET /logout
 * @param {Request} req
 * @param {Response} res
 * @returns {void} CLear session cookie
 */
const logout = (req: Request, res: Response) => {
  if(req.session){
    req.session = null // CLear the session cookie
  }
  res.status(200).json({
    message: "Logout successful"
  })
}



export default{
  getUserByUsername,
  loginUser,
  addUser,
  logout
}