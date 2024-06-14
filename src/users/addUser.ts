import { OpenAPIRoute, Query } from "@cloudflare/itty-router-openapi";
import { users } from "db/schema";
import { drizzle } from 'drizzle-orm/d1';
import { User } from "typesOpenAPI";
export class AddUser extends OpenAPIRoute {
    static schema = {
        tags: ["AddUser"],
        summary: "add Users",
        requestBody: User,
        responses: {
            "200": {
              description: "Post Successful",
              schema: {
                success: Boolean,
              },
            },
          },
    };

 
    async handle(request: Request, env: any, context: any, data: Record<string, any>) {
        try {
            if (!data || !data.body) {
                throw new Error('Request body is missing');
            }
            const { name, email, password } = data.body;
            const db = drizzle(env.DB);
            const results = await db.insert(users).values({ name, email, password }).returning();
            
            return results
        } catch (e) {
            return new Response(e)
        }
    }
}