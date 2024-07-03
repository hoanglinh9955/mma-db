import { Email, OpenAPIRoute, Query, Str } from "@cloudflare/itty-router-openapi";
import { users, users_sessions } from "db/schema";
import { eq, and } from "drizzle-orm";
import { drizzle } from 'drizzle-orm/d1';
import { User } from "typesOpenAPI";
import { hashPassword } from "utils";
import { z } from 'zod';

export class changePassword extends OpenAPIRoute {
    static schema = {
        tags: ['User'],
        summary: 'Change Password',
        requestBody: {
            oldPassword: z.string().min(8).max(16),
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
            const { oldPassword, password } = data.body;
            const hashedPassword = await hashPassword(oldPassword, env.SECRET);
            const db = drizzle(env.DB);

            const results = await db.select().from(users).where(and(eq(users.password, hashedPassword), eq(users.user_id, env.user_id)));
            // return new Response(JSON.stringify({
            //     success: true,
            //     results
            // }), {
            //     headers: {
            //         ...corsHeaders,
            //         'content-type': 'application/json;charset=UTF-8',
            //     },
            // });
            if (!results[0]) {
                return new Response(JSON.stringify({
                    success: false,
                    message: "Old Password incorrect",
                }), {
                    headers: {
                        ...corsHeaders,
                        'Content-Type': 'application/json;charset=UTF-8',
                    },
                });
            }

            const newPassword = await hashPassword(password, env.SECRET);
            const result = await db.update(users).set({ password: newPassword }).where(eq(users.user_id, env.user_id)).returning();

            return new Response(JSON.stringify({
                success: true,
                result
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
            });
        }
    }
}
