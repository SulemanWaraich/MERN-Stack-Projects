import { Hono } from 'hono'
import  { PrismaClient }  from './generated/prisma/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import {decode, sign, verify} from 'hono/jwt';
import { JWTPayload } from 'hono/utils/jwt/types';
import userRouter from './routes/userRoute';
import blogRouter from './routes/blogRoute';

const basePrisma = new PrismaClient();
const extendedPrisma = basePrisma.$extends(withAccelerate());

// 👇 Type based on extendedPrisma
type AcceleratedPrismaClient = typeof extendedPrisma;

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string,
    JWT_SECRET: string
  },
  Variables: {
    jwtPayload: string
    prisma: AcceleratedPrismaClient
  }
}>();

app.use('*', async (c, next) => {
   const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  c.set('prisma', prisma)
  await next();
})

app.use('/api/v1/book/blog/*', async (c, next) => {
  const authToken = c.req.header('Authorization');
  const token = authToken?.replace('Bearer', '').trim(); 
  if(!token){
    return c.json({msg: "user isn't authorized"});
  }
  
  console.log(token);
  
  let payload: JWTPayload;
try {
    payload = await verify(token, c.env.JWT_SECRET);
  
} catch (error) {
    return c.json({msg: "invalid token"}, 402)
}  

  console.log(payload.id);

  c.set('jwtPayload', payload.id);
  await next();
})

app.route('/api/v1/user', userRouter)
app.route('/api/v1/book', blogRouter)

export default app