import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";


export const userRouter = createTRPCRouter({
  getToken: protectedProcedure.query(async ({ ctx }) => {
    // console.log('User ID: ', ctx.session.user.id)
    const record = await ctx.prisma.account.findFirst({
      where: {
        userId: ctx.session.user.id
      }
    })
    // console.log('Record:', record)
    return record?.access_token;
  }),
})