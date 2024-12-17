export interface User {
  student_id: string
  firstname: string
  lastname: string
  role: "ADMIN" | "STUDENT" | "VIEWER"
  email: string
}

export const useUserState = () => useState<User | undefined | null>('user-state', () => null)
