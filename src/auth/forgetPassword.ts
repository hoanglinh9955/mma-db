import { Email, OpenAPIRoute, Query, Str } from "@cloudflare/itty-router-openapi";
import { drizzle } from 'drizzle-orm/d1';
import { Resend } from 'resend';

export class ForgetPassword extends OpenAPIRoute {
    static schema = {
        tags: ['User'],
        summary: 'Forget Password step 1 ',
        requestBody: {
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

        if (request.method === 'OPTIONS') {
            return new Response(null, {
                headers: {
                    ...corsHeaders,
                    'Access-Control-Max-Age': '86400',
                },
            });
        }

        try {
            
            const db = drizzle(env.DB);
            const { email } = data.body;
            let randomString = (Math.random().toString(36) + '0000000').substring(2, 10);
            await env.mma_kv.put(email, randomString, {expirationTtl: 60*30 });

            const resend = new Resend(env.RESEND_API_KEY);

            const { data: dataEmail, error } = await resend.emails.send({
                from: 'mma-web@1st-store.uk',
                to: email,
                subject: 'Reset Password',
                html: `
                    <div style="font-family: Arial, sans-serif; color: #333;">
                        <h2 style="color: #007bff;">Password Reset Request</h2>
                        <p>Hello,</p>
                        <p>You recently requested to reset your password for your account. Use the Token below to reset it. <strong>This Token reset is only valid for the next 30 minute.</strong></p>
                        <p>Token: <strong>${randomString}</strong></p>
                        <p>If you did not request a password reset, please ignore this email or contact support if you have questions.</p>
                        <p>Thanks,<br>The Mma Team</p>
                    </div>
                `,
            });


            return new Response(JSON.stringify({
                success: true,
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
