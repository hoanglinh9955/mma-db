import { Email, OpenAPIRoute, Query } from "@cloudflare/itty-router-openapi";
import { users } from "db/schema";
import { drizzle } from 'drizzle-orm/d1';
import { date } from "drizzle-orm/mysql-core";
import { User } from "typesOpenAPI";
import { hashPassword } from "utils";
import { z } from 'zod'

export class AuthRegister extends OpenAPIRoute {
    static schema = {
        tags: ['Auth'],
        summary: 'Register user',
        requestBody: User,
        responses: {
            '200': {
                description: "Successful response",
                schema: {
                    success: Boolean,
                    result: [{
                            email: String,
                            user_name: String,
                            hashPassword: String,
                            date_of_birth: String,
                            image_url: String,
                        }]
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
            
            const { user_name, email, password, date_of_birth, image_url } = data.body;
            const hashedPassword = await hashPassword(password, env.SECRET);
            const db = drizzle(env.DB);
            const results = await db.insert(users).values({ user_name: user_name, email: email, password: hashedPassword, date_of_birth: date_of_birth, image_url: image_url, role: 'USER'}).returning();

            return {
                success: true,
                result: results
            }
        } catch (e) {
            return new Response(e)
        }
        }
    }