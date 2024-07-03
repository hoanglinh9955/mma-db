import { Email, OpenAPIRoute, Query, Str } from "@cloudflare/itty-router-openapi";
import { users, users_sessions } from "db/schema";
import { eq, and } from "drizzle-orm";
import { drizzle } from 'drizzle-orm/d1';
import { User } from "typesOpenAPI";
import { hashPassword } from "utils";
import { z } from 'zod';

export class changePasswordWithResetToken extends OpenAPIRoute {
    static schema = {
        tags: ['User'],
        summary: 'Change Password With Reset Token step 2',
        requestBody: {
            token: z.string(),
            email: new Email(),
            password: z.string().min(8).max(16),
        },
        responses: {
            '200': {
                description: "Successful response",
                schema: {
                    success: Boolean,
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
            const { token, email, password } = data.body;
            const hashedPassword = await hashPassword(password, env.SECRET);
            const db = drizzle(env.DB);

            const results = await db.select().from(users).where(eq(users.email, email));
            if (!results[0]) {
                return new Response(JSON.stringify({
                    success: false,
                    message: "Invalid Email",
                }), {
                    headers: {
                        ...corsHeaders,
                        'Content-Type': 'application/json;charset=UTF-8',
                    },
                });
            }

            const value = await env.mma_kv.get(email);
            if (value === null) {
                return new Response(JSON.stringify({
                    success: false,
                    message: "Invalid Token",
                }), {
                    headers: {
                        ...corsHeaders,
                        'Content-Type': 'application/json;charset=UTF-8',
                    },
                });
            }

            if (value !== token) {
                return new Response(JSON.stringify({
                    success: false,
                    message: "Invalid Token",
                }), {
                    headers: {
                        ...corsHeaders,
                        'Content-Type': 'application/json;charset=UTF-8',
                    },
                });
            }
            if (value === token) {
                const result = await db.update(users).set({ password: hashedPassword }).where(eq(users.email, email)).returning();
                if(result[0]) {
                    await env.mma_kv.delete(email);
                    return new Response(JSON.stringify({
                        success: true,
                        result
                    }), {
                        headers: {
                            ...corsHeaders,
                            'Content-Type': 'application/json;charset=UTF-8',
                        },
                    });
                }
            }
 

        } catch (e) {
            return new Response(JSON.stringify({
                success: false,
                error: e.message,
            }), {
                headers: {
                    ...corsHeaders,
                    'content-type': 'application/json;charset=UTF-8',
                },
            });
        }
    }
}
