import { OpenAPIRouter } from "@cloudflare/itty-router-openapi";
import { authenticateUser } from "auth/authenticateUser";
import { AuthLogin } from "auth/authLogin";
import { AuthRegister } from "auth/authResgister";
import { AddComment } from "comment/addComment";
import { getCommentByCourseId } from "comment/getCommentByCourseId";
import { AddCourse } from "course/addCourse";
import { deleteCompleteCourse } from "course/deleteCompleteChapter";
import { GetCourseById } from "course/getCourseById";
import { GetCoursesByInstructorId } from "course/getCourseByInstructorId";
import { GetCourses } from "course/getCourses";
import { GetCoursesByInstructor } from "course/getInstructors";
import { GetMartCourse } from "course/getMartCourse";
import { MartCourse } from "course/markCourse";
import { AddEnroll } from "enroll/addEnroll";
import { GetEnroll } from "enroll/getEnroll";
import { get } from "http";
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


router.all('/api/*', authenticateUser)

router.get("/api/user", GetUser);
router.post("/api/course", AddCourse);
router.get("/api/getCourse", GetCourses);
router.get("/api/getCourseById", GetCourseById);
router.get("/api/getCourseByInstructorId", GetCoursesByInstructorId);
router.get("/api/getInstructors", GetCoursesByInstructor);
router.post("/api/addCompleteChapter", MartCourse);
router.get("/api/getCompleteChapter", GetMartCourse);
router.delete("/api/deleteCompleteChapter", deleteCompleteCourse);


router.post("/api/addEnroll", AddEnroll);
router.get("/api/getEnroll", GetEnroll);
router.get("/api/getEnrollasdfasdf", GetEnroll);
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
