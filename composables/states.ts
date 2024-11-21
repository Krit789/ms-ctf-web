export interface User {
  student_id: number
  firstname: string
  lastname: string
  role: "ADMIN" | "STUDENT" | "VIEWER"
  email: string
}

export const useUserState = () => useState<User | undefined | null>('user-state', () => null)
