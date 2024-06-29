import { Email, OpenAPIRoute, Query } from "@cloudflare/itty-router-openapi";
import { users, users_sessions } from "db/schema";
import { eq, and } from "drizzle-orm";
import { drizzle } from 'drizzle-orm/d1';
import { User } from "typesOpenAPI";
import { hashPassword } from "utils";
import { z } from 'zod';

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
                        user: User,
                    },
                },
            },
            '400': {
                description: "Error",
                schema: {
                    success: Boolean,
                    error: String,
                },
            },
        },
    };

    async handle(request: Request, env: any, context: any, data: Record<string, any>) {
        const corsHeaders = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET,HEAD,POST,OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        };

        if (request.method === 'OPTIONS') {
            return new Response(null, {
                headers: {
                    ...corsHeaders,
                    'Access-Control-Max-Age': '86400',
                },
            });
        }

        try {
            const { email, password } = data.body;
            const hashedPassword = await hashPassword(password, env.SECRET);
            const db = drizzle(env.DB);

            const results = await db.select().from(users).where(and(eq(users.email, email), eq(users.password, hashedPassword)));

            if (!results[0]) {
                return new Response(JSON.stringify({
                    success: false,
                    message: "Unknown user",
                }), {
                    headers: {
                        ...corsHeaders,
                        'content-type': 'application/json;charset=UTF-8',
                    },
                    status: 400,
                });
            }

            let expiration = new Date();
            expiration.setDate(expiration.getDate() + 7);
            let timeDate = expiration.getTime();
            let token = await hashPassword((Math.random() + 1).toString(3), env.SECRET);
            const session = await db.insert(users_sessions).values({ user_id: results[0].user_id, token: token, expires_at: timeDate }).returning();
            const user = await db.select().from(users).where(eq(users.user_id, session[0].user_id));

            return new Response(JSON.stringify({
                success: true,
                result: {
                    session: {
                        token: session[0].token,
                        expires_at: session[0].expires_at,
                    },
                    user: user[0],
                },
            }), {
                headers: {
                    ...corsHeaders,
                    'content-type': 'application/json;charset=UTF-8',
                },
            });
        } catch (e) {
            return new Response(JSON.stringify({
                success: false,
                error: e.message,
            }), {
                headers: {
                    ...corsHeaders,
                    'content-type': 'application/json;charset=UTF-8',
                },
                status: 400,
            });
        }
    }
}
