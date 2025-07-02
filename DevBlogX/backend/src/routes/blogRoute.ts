import { Hono } from 'hono'
import  { PrismaClient }  from '../generated/prisma/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { UpdatePost, CreatePost } from '@suleman10/common-app';

const basePrisma = new PrismaClient();
const extendedPrisma = basePrisma.$extends(withAccelerate());

// 👇 Type based on extendedPrisma
type AcceleratedPrismaClient = typeof extendedPrisma;

const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string,
    JWT_SECRET: string
  },
  Variables: {
    jwtPayload: string
    prisma: AcceleratedPrismaClient
  }
}>();

blogRouter.post('/blog', async (c) => {
  const prisma = c.get('prisma')
  const userId = c.get('jwtPayload')
  console.log(userId);
  
  const body = await c.req.json();
  const parsedInputs = CreatePost.safeParse(body)
  if(!parsedInputs.success){
    return c.json({msg: "invalid inputs!"})
  }
  const {title, content} = body;
  
  console.log(body);
  
  let post;
try {
    post = await prisma.post.create({data: {title, content, publish: true, authorId: userId}});
    console.log(post);
    if(!post){
      return c.json({msg: "error while creating a blog post"});
    }
} catch (error) {
  c.status(403)
  return c.json({msg: "error"}) 
}

  return c.json({msg: "successfully created a blog post", post});
})

blogRouter.put('/blog', async (c) => {
  const prisma = c.get('prisma')
  const userId = c.get('jwtPayload')
  console.log(userId);
  
  const body = await c.req.json();
  const parsedInputs = UpdatePost.safeParse(body)
  if(!parsedInputs.success){
    return c.json({msg: "invalid inputs!"})
  }
  const {title, content, id} = body;
  
  let post;
  try {
      post = await prisma.post.update({where: {authorId: userId, id: id}, data: {title, content}, select: {title: true, content: true} })
    
      if(!post){
        return c.json({msg: "error while updating a post!"})
      }

} catch (error) {
  c.status(403)
  return c.json({msg: "error"})
} 
  
  return c.json({msg: "successfully updated a post", post});
})

blogRouter.get('/blog/bulk', async (c) => {
  const prisma = c.get('prisma')
  const userId = c.get('jwtPayload')
  console.log(userId);

  const posts = await prisma.post.findMany({})
  if(!posts){
    return c.json({msg: "error while fetching all the posts"})
  }

  return c.json({msg: "successfully fetching all the posts", posts})
})

blogRouter.get('/blog/:id', async (c) => {
  const prisma = c.get('prisma')
  const postId = c.req.param('id');
  console.log(postId);
  
  if(!postId){
    return c.json({msg: "post id is required"}, 400)
  }  
  const post = await prisma.post.findUnique({where: {id: postId}});
  if(!post){
    return c.json({msg: "error"})
  }

  return c.json({msg: "success", post});
})
 
export default blogRouter
