import { User } from "../types/user";
import bcrypt from 'bcrypt'
import {v4 as uuidv4} from 'uuid'

class UserModel{
  private users: User[] = []

  //create User
  async createUser(newUser: Omit<User, "id">){
    const {username, password, firstname, lastname} = newUser
    const foundIndex = this.users.findIndex(u => u.username.toLowerCase() === username.toLowerCase())

    if(foundIndex !== -1) return false
    const hashedPassword = await bcrypt.hash(password, 12)

    this.users.push({
      id: uuidv4(),
      username,
      password: hashedPassword,
      firstname,
      lastname
    })
    return true

  }

  // Login 
  async login(details: Omit<User, "id"| "firstname"|"lastname">){
    const {username, password} = details
    const found = this.users.find(u => u.username === username)
    if(!found) return false
    const isMatch = await bcrypt.compare(password, found.password)
    if (!isMatch) return false
    return found
  }

  //Get user data
  findByUsername(username: string){
    const user = this.users.find(u => u.username === username)
    if(!user) return false
    return user
  }


}

export default new UserModel