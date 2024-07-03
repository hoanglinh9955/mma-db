// import { users, users_sessions } from "db/schema"
// import { and, eq, gt, lt } from "drizzle-orm"
// import { drizzle } from "drizzle-orm/d1"

// const corsHeaders = {
//     'Access-Control-Allow-Origin': '*',
//     'Access-Control-Allow-Methods': 'GET,HEAD,POST,OPTIONS',
//     'Access-Control-Allow-Headers': 'Content-Type, Authorization',
// };


// export function getBearer(request: Request): null | string {
//     const authHeader = request.headers.get('Authorization')
//     if (!authHeader || authHeader.substring(0, 6) !== 'Bearer') {
//         return null
//     }
//     return authHeader.substring(6).trim()
// }


// export async function authenticateUser(request: Request, env: any, context: any) {
//     const token = getBearer(request)
//     let session
//     let checkQuery
//     const db = drizzle(env.DB);

//     if (token) {
//         let date = Date.now()
//         session = await db.select().from(users_sessions).where(and(gt(users_sessions.expires_at, date), eq(users_sessions.token, token)))
//         checkQuery = await db.select().from(users_sessions).where(and(lt(users_sessions.expires_at, date), eq(users_sessions.token, token)))
//         if(checkQuery.length > 0) {
//             await db.delete(users_sessions).where(eq(users_sessions.token, token))
//             return new Response(JSON.stringify({
//                 success: false,
//                 message: "Token is expired",
//                 errors: "Authentication error",
//             }), {
//                 headers: {
//                     'content-type': 'application/json;charset=UTF-8',
//                 },
//             })  
//         }
//     }
    
//     if (!token || !session[0].user_id) {
//         return new Response(JSON.stringify({
//             success: false,
//             errors: "Authentication error",
//         }), {
//             headers: {
//                 'content-type': 'application/json;charset=UTF-8',
//             }
//         })
//     }
    
//     env.user_id = session[0].user_id
// }


// export async function authenticateInstructor(request: Request, env: any, context: any) {
//     const token = getBearer(request)
//     let session
//     let checkQuery
//     let result
//     const db = drizzle(env.DB);

//     if (token) {
//         let date = Date.now()

//         session = await db.select().from(users_sessions).where(and(gt(users_sessions.expires_at, date), eq(users_sessions.token, token)))
//         checkQuery = await db.select().from(users_sessions).where(and(lt(users_sessions.expires_at, date), eq(users_sessions.token, token)))
//         if(checkQuery.length > 0) {
//             await db.delete(users_sessions).where(eq(users_sessions.token, token))
//             return new Response(JSON.stringify({
//                 success: false,
//                 message: "Token is expired",
//                 errors: "Authentication error",
//             }), {
//                 headers: {
//                     'content-type': 'application/json;charset=UTF-8',
//                 }
//             })  
//         }
//     }
    
//     if (!token || !session[0].user_id) {
//         return new Response(JSON.stringify({
//             success: false,
//             errors: "Authentication error",
//         }), {
//             headers: {
//                 'content-type': 'application/json;charset=UTF-8',
//             }
//         })
//     }
//     result = await db.select().from(users).where(eq(users.user_id, session[0].user_id))
//     if(result[0].role != "INSTRUCTOR") {
//         return new Response(JSON.stringify({
//             success: false,
//             errors: "Authentication error",
//             message: "You are not an instructor",
//         }), {
//             headers: {
//                 'content-type': 'application/json;charset=UTF-8',
//             }
//         })
//     }
//     env.user_id = session[0].user_id
// }

// export async function authenticateStaff(request: Request, env: any, context: any) {
//     const token = getBearer(request)
//     let session
//     let checkQuery
//     let result
//     const db = drizzle(env.DB);

//     if (token) {
//         let date = Date.now()

//         session = await db.select().from(users_sessions).where(and(gt(users_sessions.expires_at, date), eq(users_sessions.token, token)))
//         checkQuery = await db.select().from(users_sessions).where(and(lt(users_sessions.expires_at, date), eq(users_sessions.token, token)))
//         if(checkQuery.length > 0) {
//             await db.delete(users_sessions).where(eq(users_sessions.token, token))
//             return new Response(JSON.stringify({
//                 success: false,
//                 message: "Token is expired",
//                 errors: "Authentication error",
//             }), {
//                 headers: {
//                     'content-type': 'application/json;charset=UTF-8',
//                 }
//             })  
//         }
//     }
    
//     if (!token || !session[0].user_id) {
//         return new Response(JSON.stringify({
//             success: false,
//             errors: "Authentication error",
//         }), {
//             headers: {
//                 'content-type': 'application/json;charset=UTF-8',
//             }
//         })
//     }
//     result = await db.select().from(users).where(eq(users.user_id, session[0].user_id))
//     if(result[0].role != "STAFF") {
//         return new Response(JSON.stringify({
//             success: false,
//             errors: "Authentication error",
//             message: "You are not an staff",
//         }), {
//             headers: {
//                 'content-type': 'application/json;charset=UTF-8',
//             }
//         })
//     }
//     env.user_id = session[0].user_id
// }



// export async function authenticateAdmin(request: Request, env: any, context: any) {
//     const token = getBearer(request)
//     let session
//     let checkQuery
//     let result
//     const db = drizzle(env.DB);

//     if (token) {
//         let date = Date.now()

//         session = await db.select().from(users_sessions).where(and(gt(users_sessions.expires_at, date), eq(users_sessions.token, token)))
//         checkQuery = await db.select().from(users_sessions).where(and(lt(users_sessions.expires_at, date), eq(users_sessions.token, token)))
//         if(checkQuery.length > 0) {
//             await db.delete(users_sessions).where(eq(users_sessions.token, token))
//             return new Response(JSON.stringify({
//                 success: false,
//                 message: "Token is expired",
//                 errors: "Authentication error",
//             }), {
//                 headers: {
//                     'content-type': 'application/json;charset=UTF-8',
//                 }
//             })  
//         }
//     }
    
//     if (!token || !session[0].user_id) {
//         return new Response(JSON.stringify({
//             success: false,
//             errors: "Authentication error",
//         }), {
//             headers: {
//                 'content-type': 'application/json;charset=UTF-8',
//             }
//         })
//     }
//     result = await db.select().from(users).where(eq(users.user_id, session[0].user_id))
//     if(result[0].role != "ADMIN") {
//         return new Response(JSON.stringify({
//             success: false,
//             errors: "Authentication error",
//             message: "You are not an admin",
//         }), {
//             headers: {
//                 'content-type': 'application/json;charset=UTF-8',
//             }
//         })
//     }
//     env.user_id = session[0].user_id
// }


import { users, users_sessions } from "db/schema";
import { and, eq, gt, lt } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,HEAD,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
};

export function getBearer(request: Request): null | string {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || authHeader.substring(0, 6) !== 'Bearer') {
        return null;
    }
    return authHeader.substring(6).trim();
}

export function handleCors(request: Request) {
    if (request.method === 'OPTIONS') {
        return new Response(null, {
            headers: {
                ...corsHeaders,
                'Access-Control-Max-Age': '86400', // 24 hours
            },
        });
    }
    return null;
}

export async function authenticateUser(request: Request, env: any, context: any) {
    const corsResponse = handleCors(request);
    if (corsResponse) {
        return corsResponse;
    }

    const token = getBearer(request);

    let session;
    let checkQuery;
    const db = drizzle(env.DB);

    
    if (token) {
        let date = Date.now();
        session = await db.select().from(users_sessions).where(and(gt(users_sessions.expires_at, date), eq(users_sessions.token, token)));
        checkQuery = await db.select().from(users_sessions).where(and(lt(users_sessions.expires_at, date), eq(users_sessions.token, token)));
        if (checkQuery.length > 0) {
            await db.delete(users_sessions).where(eq(users_sessions.token, token));
            return new Response(JSON.stringify({
                success: false,
                message: "Token is expired",
                errors: "Authentication error",
            }), {
                headers: {
                    ...corsHeaders,
                    'Content-Type': 'application/json;charset=UTF-8',
                },
            });
        }
    }

    if (!token || !session[0].user_id) {
        return new Response(JSON.stringify({
            success: false,
            errors: "Authentication error",
        }), {
            headers: {
                ...corsHeaders,
                'Content-Type': 'application/json;charset=UTF-8',
            },
        });
    }

    env.user_id = session[0].user_id;
}

export async function authenticateInstructor(request: Request, env: any, context: any) {
    const corsResponse = handleCors(request);
    if (corsResponse) {
        return corsResponse;
    }

    const token = getBearer(request);
    let session;
    let checkQuery;
    let result;
    const db = drizzle(env.DB);
    if (token) {
        let date = Date.now();

        session = await db.select().from(users_sessions).where(and(gt(users_sessions.expires_at, date), eq(users_sessions.token, token)));
        checkQuery = await db.select().from(users_sessions).where(and(lt(users_sessions.expires_at, date), eq(users_sessions.token, token)));
        if (checkQuery.length > 0) {
            await db.delete(users_sessions).where(eq(users_sessions.token, token));
            return new Response(JSON.stringify({
                success: false,
                message: "Token is expired",
                errors: "Authentication error",
            }), {
                headers: {
                    ...corsHeaders,
                    'Content-Type': 'application/json;charset=UTF-8',
                },
            });
        }
    }

    if (!token || !session[0].user_id) {
        return new Response(JSON.stringify({
            success: false,
            errors: "Authentication error",
        }), {
            headers: {
                ...corsHeaders,
                'Content-Type': 'application/json;charset=UTF-8',
            },
        });
    }

    result = await db.select().from(users).where(eq(users.user_id, session[0].user_id));
    if (result[0].role != "INSTRUCTOR") {
        return new Response(JSON.stringify({
            success: false,
            errors: "Authentication error",
            message: "You are not an instructor",
        }), {
            headers: {
                ...corsHeaders,
                'Content-Type': 'application/json;charset=UTF-8',
            },
        });
    }

    env.user_id = session[0].user_id;
}

export async function authenticateStaff(request: Request, env: any, context: any) {
    const corsResponse = handleCors(request);
    if (corsResponse) {
        return corsResponse;
    }

    const token = getBearer(request);
    let session;
    let checkQuery;
    let result;
    const db = drizzle(env.DB);

    if (token) {
        let date = Date.now();

        session = await db.select().from(users_sessions).where(and(gt(users_sessions.expires_at, date), eq(users_sessions.token, token)));
        checkQuery = await db.select().from(users_sessions).where(and(lt(users_sessions.expires_at, date), eq(users_sessions.token, token)));
        if (checkQuery.length > 0) {
            await db.delete(users_sessions).where(eq(users_sessions.token, token));
            return new Response(JSON.stringify({
                success: false,
                message: "Token is expired",
                errors: "Authentication error",
            }), {
                headers: {
                    ...corsHeaders,
                    'Content-Type': 'application/json;charset=UTF-8',
                },
            });
        }
    }

    if (!token || !session[0].user_id) {
        return new Response(JSON.stringify({
            success: false,
            errors: "Authentication error",
        }), {
            headers: {
                ...corsHeaders,
                'Content-Type': 'application/json;charset=UTF-8',
            },
        });
    }
    result = await db.select().from(users).where(eq(users.user_id, session[0].user_id));
    if (result[0].role != "STAFF") {
        return new Response(JSON.stringify({
            success: false,
            errors: "Authentication error",
            message: "You are not a staff",
        }), {
            headers: {
                ...corsHeaders,
                'Content-Type': 'application/json;charset=UTF-8',
            },
        });
    }
    env.user_id = session[0].user_id;
    return new Response(null, { headers: corsHeaders }); // Adjust based on your actual use case
}
