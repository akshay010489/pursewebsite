// Simple authentication system using localStorage
// In production, this should use a proper backend with database

export interface User {
  id: string
  email: string
  name: string
  password: string // In production, this should be hashed
  address?: {
    street: string
    city: string
    state: string
    zip: string
    country: string
  }
}

export function signUp(email: string, password: string, name: string): { success: boolean; error?: string } {
  const users = getUsers()
  
  // Check if user already exists
  if (users.find(u => u.email === email)) {
    return { success: false, error: 'Email already registered' }
  }

  // Create new user
  const newUser: User = {
    id: Date.now().toString(),
    email,
    password, // In production, hash this!
    name,
  }

  users.push(newUser)
  localStorage.setItem('users', JSON.stringify(users))
  
  // Auto login after signup
  login(email, password)
  
  return { success: true }
}

export function login(email: string, password: string): { success: boolean; error?: string; user?: User } {
  const users = getUsers()
  const user = users.find(u => u.email === email && u.password === password)

  if (!user) {
    return { success: false, error: 'Invalid email or password' }
  }

  // Store current user (without password)
  const { password: _, ...userWithoutPassword } = user
  localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword))
  
  return { success: true, user: userWithoutPassword as User }
}

export function logout(): void {
  localStorage.removeItem('currentUser')
}

export function getCurrentUser(): User | null {
  const userStr = localStorage.getItem('currentUser')
  if (!userStr) return null
  
  try {
    return JSON.parse(userStr)
  } catch {
    return null
  }
}

export function isAuthenticated(): boolean {
  return getCurrentUser() !== null
}

export function updateUserAddress(address: User['address']): boolean {
  const user = getCurrentUser()
  if (!user) return false

  const users = getUsers()
  const userIndex = users.findIndex(u => u.id === user.id)
  
  if (userIndex === -1) return false

  users[userIndex].address = address
  localStorage.setItem('users', JSON.stringify(users))

  // Update current user
  const updatedUser = { ...user, address }
  localStorage.setItem('currentUser', JSON.stringify(updatedUser))

  return true
}

function getUsers(): User[] {
  const usersStr = localStorage.getItem('users')
  if (!usersStr) return []
  
  try {
    return JSON.parse(usersStr)
  } catch {
    return []
  }
}
