import { OpenAPIRoute, Query } from "@cloudflare/itty-router-openapi";
import { getBearer } from "auth/authenticateUser";
import { users, users_sessions } from "db/schema";
import { and, eq, gt } from "drizzle-orm";
import { drizzle } from 'drizzle-orm/d1';
export class GetUser extends OpenAPIRoute {
    static schema = {
        tags: ["GetUsers"],
        summary: "Get All Users",
        
        responses: {
            "200": {
                description: "Get Users Successful",
                schema: {
                    success: Boolean,
                    results: Boolean,
                },
            },
            "401": {
                description: "Unauthorized",
            },
        },
    };

 
    async handle(request: Request, env: any, context: any, data: Record<string, any>) {
        try {

            const db = drizzle(env.DB);
            const results = await db.select().from(users).all() 
            // let date = new Date()
        // const session = await db.select().from(users_sessions).all()
        // .where(and(gt(users_sessions.expires_at, date), eq(users_sessions.token, token)))
        
            return results
        } catch (e) {
            return new Response(e)
        }

      
    }
}