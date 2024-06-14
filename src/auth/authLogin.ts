import { Email, OpenAPIRoute, Query } from "@cloudflare/itty-router-openapi";
import { users, users_sessions } from "db/schema";
import { eq, and } from "drizzle-orm";
import { drizzle } from 'drizzle-orm/d1';
import { User } from "typesOpenAPI";
import { hashPassword } from "utils";
import { z } from 'zod'

  
export class AuthLogin extends OpenAPIRoute {
    static schema = {
        tags: ['Auth'],
        summary: 'Login user',
        requestBody: {
            email: new Email(),
            password: z.string().min(8).max(16),
        },
        responses: {
            '200': {
                description: "Successful response",
                schema: {
                    success: Boolean,
                    result: {
                        session: {
                            token: String,
                            expires_at: String,

                        },
                        user: {
                            User
                        }
                    }
                },
            },
            '400': {
                description: "Error",
                schema: {
                    success: Boolean,
                    error: String
                },
            },
        },
    };

 
    async handle(request: Request, env: any, context: any, data: Record<string, any>) {
        try {
            
            const { name, email, password } = data.body;
            const hashedPassword = await hashPassword(password, env.SECRET);
            const db = drizzle(env.DB);


            const results = await db.select().from(users).where(and(eq(users.email, email), eq(users.password, hashedPassword)))     
            
            if (!results[0] || !results[0] == undefined || !results[0] == null) {
                return new Response(JSON.stringify({
                    success: false,
                    errors: "Unknown user"
                }), {
                    headers: {
                        'content-type': 'application/json;charset=UTF-8',
                    },
                    status: 400,
                })
            }

            let expiration = new Date();
            // Set the new session expiration to 7 days in the future
            expiration.setDate(expiration.getDate() + 7);
            let timeDate = expiration.getTime()
            let token = await hashPassword((Math.random() + 1).toString(3), env.SECRET);
            const session = await db.insert(users_sessions).values({ user_id: results[0].user_id, token: token, expires_at: timeDate }).returning();
            const user = await db.select().from(users).where(eq(users.user_id, session[0].user_id))
            return {
                success: true,
                result: {
                    session: {
                        token: session[0].token,
                        time: session[0].expires_at
                    },
                    user: user[0]
                }
            }
        } catch (e) {
            return new Response(e)
        }
        }
    }
