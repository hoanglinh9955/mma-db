import { Email, OpenAPIRoute, Query } from "@cloudflare/itty-router-openapi";
import { users } from "db/schema";
import { eq } from "drizzle-orm";
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
            
            const { user_name, email, password } = data.body;
            const hashedPassword = await hashPassword(password, env.SECRET);
            const db = drizzle(env.DB);

            // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            // if (!emailRegex.test(email)) {
            //     return {
            //         success: false,
            //         message: 'Invalid email format'
            //     };
            // }

            const checkUserName = await db.select().from(users).where(eq(users.user_name, user_name)).all();
            if(checkUserName.length > 0){
                return {
                    success: false,
                    error: 'Username already exists'
                }
            }


            const checkMail = await db.select().from(users).where(eq(users.email, email.toLowerCase())).all();
            if(checkMail.length > 0){
                return {
                    success: false,
                    error: 'Email already exists'
                }
            }

            const results = await db.insert(users).values({ user_name: user_name, email: email, password: hashedPassword, image_url: 'https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1677509740.jpg', role: 'USER'}).returning();

            return {
                success: true,
                result: results
            }
        } catch (e) {
            return new Response(e)
        }
        }
    }