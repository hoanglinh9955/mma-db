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
import { GetOrderByInstructor } from "enroll/getOrderByInstructor";
import { GetUser } from "users/getAllUsers";
import { UpdateCustomerProfile } from "users/updateCustomerProfile";
import { UpdateInstructorProfile } from "users/updateInstructorProfile";
import { AutoRouter, cors } from 'itty-router'
import { AuthCheck } from "auth/authCheck";
import { EditComment } from "comment/editCommentByCommentId";
import { DeleteComment } from "comment/deleteCommentByComId";
import { changePassword } from "auth/changePassword";
import { ForgetPassword } from "auth/forgetPassword";
import { changePasswordWithResetToken } from "auth/changePasswordWithResetToken";

const { preflight, corsify } = cors()


export const router = OpenAPIRouter({
    schema: {
       info: {
          title: "E-Learning API Cloudfare Worker drizzle-orm D1", 
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
router.all('*', preflight)

router.post('/api/auth/register', AuthRegister);
router.post('/api/auth/login', AuthLogin);
router.get('/api/auth/check', AuthCheck);
router.post('/api/auth/forgetPassword', ForgetPassword);
router.post('/api/auth/changePasswordWithResetToken', changePasswordWithResetToken);

//user
router.all('/api/user/*', authenticateUser)
router.put('/api/user/changePassword', changePassword);
// router.get("/api/user/getUser", GetUser);
router.put("/api/user/updateCustomerProfile", UpdateCustomerProfile);
router.get("/api/user/getCourse", GetCourses);
router.get("/api/user/getCourseById", GetCourseById);
router.get("/api/user/getCourseByInstructorId", GetCoursesByInstructorId);
router.get("/api/user/getInstructors", GetCoursesByInstructor);
router.post("/api/user/addCompleteChapter", MartCourse);
router.get("/api/user/getCompleteChapter", GetMartCourse);
router.delete("/api/user/deleteCompleteChapter", deleteCompleteCourse);

router.post("/api/user/addEnroll", AddEnroll);
router.get("/api/user/getEnroll", GetEnroll);

router.post("/api/user/addComment", AddComment);
router.put("/api/user/editComment", EditComment);
router.get("/api/user/getCommentByCourseId", getCommentByCourseId);
router.delete("/api/user/deleteComment", DeleteComment);
//Instructor
router.all('/api/instructor/*', authenticateInstructor)
router.post("/api/instructor/course", AddCourse);
router.get("/api/instructor/getCourseByInstructorId", GetCoursesByInstrucId);
router.post("/api/instructor/addComment", AddCommentInstructor);
router.put("/api/instructor/updateInstructorProfile", UpdateInstructorProfile);
router.get("/api/instructor/getCommentByCourseId", getCommentByCourseId);
router.get("/api/instructor/getOrderByInstructor", GetOrderByInstructor);


router.all('*', corsify)

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
