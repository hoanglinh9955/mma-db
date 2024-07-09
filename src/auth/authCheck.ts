import { Email, OpenAPIRoute, Query, Str } from "@cloudflare/itty-router-openapi";
import { users, users_sessions } from "db/schema";
import { eq, and } from "drizzle-orm";
import { drizzle } from 'drizzle-orm/d1';
import { User } from "typesOpenAPI";
import { hashPassword } from "utils";
import { z } from 'zod';

export class AuthCheck extends OpenAPIRoute {
    static schema = {
        tags: ['Auth'],
        summary: 'check user session',
        parameters: {
            tokenSession: Query(Str, {
              description: 'input session token',
            }),
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
            const { tokenSession } = data.query;
            const db = drizzle(env.DB);

            const results = await db.select().from(users_sessions).where(eq(users_sessions.token, tokenSession));

            if (!results[0]) {
                return new Response(JSON.stringify({
                    success: false,
                    message: "Token not found",
                }), {
                    headers: {
                        ...corsHeaders,
                        'content-type': 'application/json;charset=UTF-8',
                    },
                });
            }

            const userCheckStatus = await db.select().from(users).where(eq(users.user_id, results[0].user_id)).all();

            if(userCheckStatus[0].status === false){
                return new Response(JSON.stringify({
                    success: false,
                    message: "User is blocked",
                }), {
                    headers: {
                        ...corsHeaders,
                        'content-type': 'application/json;charset=UTF-8',
                    },
                });
            }
            
            return new Response(JSON.stringify({
                success: true,
                results
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
