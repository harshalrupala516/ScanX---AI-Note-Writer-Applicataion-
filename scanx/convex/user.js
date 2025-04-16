import { mutation } from "./_generated/server";
import { v } from "convex/values";
import{query} from "./_generated/server"
export const createUser = mutation({
  args: {
    email: v.string(),
    userName: v.string(),
    imageUrl: v.string(),
  },
  handler: async (ctx, args) => {
    //if user already exists

    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .collect();

    if (user?.length == 0) {
      await ctx.db.insert("users", {
        email: args.email,
        userName: args.userName,
        imageUrl: args.imageUrl,
        upgrade: false,
      });
      return "inserted new User...";
    }

    return "User already exists...";
  },
});

export const userUpgradePlan = mutation({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const result = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .collect();
    if (result) {
      await ctx.db.patch(result[0]._id, { pricing: true });
      return "updated user...";
    }
    return "User not found...";
  },
});

export const GetUserInfo=query({
  args:{
    userEmail:v.optional(v.string())
  },
  handler:async(ctx,args)=>{
    if(!args.userEmail){
      return;
    }
    const result = await ctx.db
    .query("users")
    .filter((q) => q.eq(q.field("email"), args?.userEmail))
    .collect();
    return result[0];
  }
})