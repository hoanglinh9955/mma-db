import { OpenAPIRouter } from "@cloudflare/itty-router-openapi";
import { authenticateInstructor, authenticateUser } from "auth/authenticateUser";
import { AuthLogin } from "auth/authLogin";
import { AuthRegister } from "auth/authResgister";
import { AddComment } from "comment/addComment";
import { AddCommentInstructor } from "comment/addCommentInstructor";
import { getCommentByCourseId } from "comment/getCommentByCourseId";
import { AddCourse } from "course/addCourse";
import { deleteCompleteCourse } from "course/deleteCompleteChapter";
import { GetCourseById } from "course/getCourseById";
import { GetCoursesByInstrucId } from "course/getCourseByInstrucId";
import { GetCoursesByInstructorId } from "course/getCourseByInstructorId";
import { GetCourses } from "course/getCourses";
import { GetCoursesByInstructor } from "course/getInstructors";
import { GetMartCourse } from "course/getMartCourse";
import { MartCourse } from "course/markCourse";
import { AddEnroll } from "enroll/addEnroll";
import { GetEnroll } from "enroll/getEnroll";
import { get } from "http";
import { GetUser } from "users/getAllUsers";
import { UpdateCustomerProfile } from "users/updateCustomerProfile";
import { UpdateInstructorProfile } from "users/updateInstructorProfile";



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

//user
router.all('/api/*', authenticateUser)

router.get("/api/user", GetUser);
router.put("/api/updateCustomerProfile", UpdateCustomerProfile);
router.get("/api/getCourse", GetCourses);
router.get("/api/getCourseById", GetCourseById);
router.get("/api/getCourseByInstructorId", GetCoursesByInstructorId);
router.get("/api/getInstructors", GetCoursesByInstructor);
router.post("/api/addCompleteChapter", MartCourse);
router.get("/api/getCompleteChapter", GetMartCourse);
router.delete("/api/deleteCompleteChapter", deleteCompleteCourse);

router.post("/api/addEnroll", AddEnroll);
router.get("/api/getEnroll", GetEnroll);
router.post("/api/addComment", AddComment);
router.get("/api/getCommentByCourseId", getCommentByCourseId);

//Instructor
router.all('/api/instructor/*', authenticateInstructor)
router.post("/api/instructor/course", AddCourse);
router.get("/api/instructor/getCourseByInstructorId", GetCoursesByInstrucId);
router.post("/api/instructor/addComment", AddCommentInstructor);
router.put("/api/instructor/updateInstructorProfile", UpdateInstructorProfile);
router.get("/api/instructor/getCommentByCourseId", getCommentByCourseId);
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
