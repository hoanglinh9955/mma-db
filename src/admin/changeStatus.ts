import { Bool, Email, Num, OpenAPIRoute, Query, Str } from "@cloudflare/itty-router-openapi";
import { users } from "db/schema";
import { eq } from "drizzle-orm";
import { drizzle } from 'drizzle-orm/d1';
import { Resend } from 'resend';

export class ChangeStatus extends OpenAPIRoute {
    static schema = {
        tags: ['Admin'],
        summary: 'Change Status',
        requestBody: {
            user_id: new Num(),
            status: new Bool(),
            email: new Email(),
        },
        responses: {
            '200': {
                description: "Successful response",
                schema: {
                    success: Boolean,
                    token: String,
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
            const { user_id, status, email } = data.body;
            // let randomString = (Math.random().toString(36) + '0000000').substring(2, 10);
            // await env.mma_kv.put(email, randomString, {expirationTtl: 60*30 });

            const updateStatus = await db.update(users).set({status: status}).where(eq(users.user_id, user_id)).returning();

            if(updateStatus.length === 0) {
                return new Response(JSON.stringify({
                    success: false,
                    error: 'User Not Found',
                }), {
                    headers: {
                        ...corsHeaders,
                        'Content-Type': 'application/json;charset=UTF-8',
                    },
                });
            }

            // const resend = new Resend(env.RESEND_API_KEY);

            // const result = await resend.emails.send({
            //     from: 'mma-web@1st-store.uk',
            //     to: email,
            //     subject: 'Reset Password',
                // html: `
                //     <div style="font-family: Arial, sans-serif; color: #333;">
                //         <h2 style="color: #007bff;">Password Reset Request</h2>
                //         <p>Hello,</p>
                //         <p>You recently requested to reset your password for your account. Use the Token below to reset it. <strong>This Token reset is only valid for the next 30 minute.</strong></p>
                //         <p>Token: <strong>${randomString}</strong></p>
                //         <p>If you did not request a password reset, please ignore this email or contact support if you have questions.</p>
                //         <p>Thanks,<br>The Mma Team</p>
                //     </div>
                // `,
            // });

            const result = await fetch('https://api.postmarkapp.com/email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Postmark-Server-Token': env.POSTMARK_API_TOKEN,
                },
                body: JSON.stringify({
                    From: 'mma-web@1st-store.uk',
                    To: email,
                    Subject: `Account is ${status ? 'Activated' : 'Blocked'}`,
                    HtmlBody:  
                    `
                    <div style="font-family: Arial, sans-serif; color: #333;">
                        <h2 style="color: #007bff;">Account ${status ? 'Activated' : 'Blocked'}</h2>
                        <p>Hello,</p>
                        <p>Your account has been ${status ? 'activated' : 'blocked'} by the admin in Mma-web.</p>
                        <p>If you have any questions or concerns, please contact support.</p>
                        <p>Email: linhlhse160751@fpt.edu.vn</p>
                        <p>Thanks,<br>The Mma Team</p>
                    </div>
                    `,
                }),
            });
        

            return new Response(JSON.stringify({
                success: true,
                result: updateStatus[0]
            }), {
                headers: {
                    ...corsHeaders,
                    'Content-Type': 'application/json;charset=UTF-8',
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
