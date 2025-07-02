import { Hono } from 'hono'
import  { PrismaClient }  from '../generated/prisma/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import {decode, sign, verify} from 'hono/jwt';
import {SigninInputs, SignupInputs} from "@suleman10/common-app"

const basePrisma = new PrismaClient();
const extendedPrisma = basePrisma.$extends(withAccelerate());

// 👇 Type based on extendedPrisma
type AcceleratedPrismaClient = typeof extendedPrisma;

const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string,
    JWT_SECRET: string
  },
  Variables: {
    jwtPayload: string
    prisma: AcceleratedPrismaClient
  }
}>();

userRouter.post('/signup', async (c) => {
  const prisma = c.get('prisma')
  const body = await c.req.json();
  const parsedInputs = SignupInputs.safeParse(body)
  if(!parsedInputs.success){
    return c.json({msg: "send the right inputs!"})
  }
  const {username, fullname, email, password} = body;

try {
    const user = await prisma.user.create({
      data: {
        username,
        fullname,
        email,
        passwrod: password
      }
    })
   
    if(!user){
      return c.json({
        msg: "error while creating an user"
      }, 401);
    }
  
    const token = await sign({id: user.id}, c.env.JWT_SECRET);
  
    return c.json({
      msg: "User successfully created!",
      token
    })
} catch (error) {
  c.status(403);
}
});

userRouter.post('/signin', async (c) => {
  const prisma = c.get('prisma')

    type data = {
      email: string,
      password: string
    }

  const body: data = await c.req.json();
  const parsedInputs = SigninInputs.safeParse(body)
  if(!parsedInputs.success){
    return c.json({msg: "send the right inputs!"})
  }
  const {email, password} = body;

  if(email && password === ""){
    return c.json({msg: "empty fields"});
  }

  console.log(email, password);
  
try {
  const user = await prisma.user.findFirst({where: {
    email: email,
    passwrod: password
  }})

  console.log(user);
  

  if(!user){
    return c.json({
      msg: "user not found"
    }, 401);
  }

  const token = await sign({id: user.id}, c.env.JWT_SECRET);
 
  return c.json({msg: "user signedin successfully", token});
} catch (error) {
  return c.status(403)
}
})

export default userRouter
