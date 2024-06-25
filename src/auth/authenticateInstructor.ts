import { users_sessions } from "db/schema"
import { and, eq, gt, lt } from "drizzle-orm"
import { drizzle } from "drizzle-orm/d1"

export function getBearer(request: Request): null | string {
    const authHeader = request.headers.get('Authorization')
    if (!authHeader || authHeader.substring(0, 6) !== 'Bearer') {
        return null
    }
    return authHeader.substring(6).trim()
}


export async function authenticateUser(request: Request, env: any, context: any) {
    const token = getBearer(request)
    let session
    let checkQuery
    let result
    const db = drizzle(env.DB);

    if (token) {
        let date = Date.now()

        session = await db.select().from(users_sessions).where(and(gt(users_sessions.expires_at, date), eq(users_sessions.token, token)))
        checkQuery = await db.select().from(users_sessions).where(and(lt(users_sessions.expires_at, date), eq(users_sessions.token, token)))
        if(checkQuery.length > 0) {
            await db.delete(users_sessions).where(eq(users_sessions.token, token))
            return new Response(JSON.stringify({
                success: false,
                message: "Token is expired",
                errors: "Authentication error",
            }), {
                headers: {
                    'content-type': 'application/json;charset=UTF-8',
                },
                status: 401,
            })  
        }
    }
    
    if (!token || !session[0].user_id) {
        return new Response(JSON.stringify({
            success: false,
            errors: "Authentication error",
        }), {
            headers: {
                'content-type': 'application/json;charset=UTF-8',
            },
            status: 401,
        })
    }
    
    
    env.user_id = session[0].user_id
}