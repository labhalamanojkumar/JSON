declare module 'bcryptjs' {
  export function hash(s: string, saltOrRounds: number | string): Promise<string>
  export function compare(s: string, hash: string): Promise<boolean>
  export function hashSync(s: string, saltOrRounds: number | string): string
  export function compareSync(s: string, hash: string): boolean
  export function genSaltSync(rounds?: number): string
  export function genSalt(rounds?: number): Promise<string>
  const bcrypt: any
  export default bcrypt
}
