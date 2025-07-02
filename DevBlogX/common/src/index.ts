import zod, { boolean, string } from "zod";

// type SignupInputs = {
//   fullname: string,
//   username: string
// }

export const SignupInputs = zod.object({
  fullname: string().optional(),
  username: string().nonempty(),
  email: string().email(),
  password: string().nonempty()
})

export type SignupType = zod.infer<typeof SignupInputs>

export const SigninInputs = zod.object({
  email: string().email(),
  password: string().nonempty()
})

export type SigninType = zod.infer<typeof SigninInputs>


export const CreatePost = zod.object({
  title: string(),
  content: string(),
})

export type CreatePostType = zod.infer<typeof CreatePost>;

export const UpdatePost = zod.object({
  title: string().optional(),
  content: string().optional(),
})

export type UpdatePostType = zod.infer<typeof UpdatePost>;