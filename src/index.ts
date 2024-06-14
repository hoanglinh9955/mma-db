import { OpenAPIRouter } from "@cloudflare/itty-router-openapi";
import { authenticateUser } from "auth/authenticateUser";
import { AuthLogin } from "auth/authLogin";
import { AuthRegister } from "auth/authResgister";
import { AddComment } from "comment/addComment";
import { getCommentByCourseId } from "comment/getCommentByCourseId";
import { AddCourse } from "course/addCourse";
import { GetCourseById } from "course/getCourseById";
import { GetCourses } from "course/getCourses";
import { GetMartCourse } from "course/getMartCourse";
import { MartCourse } from "course/markCourse";
import { AddEnroll } from "enroll/addEnroll";
import { AddUser } from "users/addUser";
import { GetUser } from "users/getAllUsers";

  export const router = OpenAPIRouter({
    schema: {
       info: {
          title: "Authentication using D1",
           version: '1.0',
       },
       security: [
          {
             bearerAuth: [],
          },
       ],
    },
    docs_url: "/",
});


router.registry.registerComponent('securitySchemes', 'bearerAuth', {
    type: 'http',
    scheme: 'bearer',
})

router.post('/api/auth/register', AuthRegister);
router.post('/api/auth/login', AuthLogin);


// router.all('/api/*', authenticateUser)

router.get("/api/user", GetUser);
router.post("/api/course", AddCourse);
router.get("/api/getCourse", GetCourses);
router.get("/api/getCourseById", GetCourseById);
router.post("/api/martCourse", MartCourse);
router.get("/api/getMartCourse", GetMartCourse);

router.post("/api/addEnroll", AddEnroll);

router.post("/api/addComment", AddComment);
router.get("/api/getCommentByCourseId", getCommentByCourseId);


// 404 for everything else
router.all("*", () =>
	Response.json(
		{
			success: false,
			error: "Route not found",
		},
		{ status: 404 }
	)
);

export default {
	fetch: router.handle,
};
