import { OpenAPIRoute, Query } from "@cloudflare/itty-router-openapi";
import { getBearer } from "auth/authenticateUser";
import { users, users_sessions } from "db/schema";
import { and, eq, gt } from "drizzle-orm";
import { drizzle } from 'drizzle-orm/d1';
export class GetUsers extends OpenAPIRoute {
    static schema = {
        tags: ["Admin"],
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
        const corsHeaders = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET,HEAD,POST,OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        };

        // if (request.method === 'OPTIONS') {
        //     return new Response(null, {
        //         headers: {
        //             ...corsHeaders,
        //             'Access-Control-Max-Age': '86400',
        //         },
        //     });
        // }

        try {

            const db = drizzle(env.DB);
            const results = await db.select().from(users).all() 
            // let date = new Date()
        // const session = await db.select().from(users_sessions).all()
        // .where(and(gt(users_sessions.expires_at, date), eq(users_sessions.token, token)))
        
            return new Response(JSON.stringify({ success: true, results }), {
                headers: {
                    'Content-Type': 'application/json',
                    ...corsHeaders,
                },
            });
        } catch (e) {
            return new Response(e)
        }

      
    }
}