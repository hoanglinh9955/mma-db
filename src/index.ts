import { OpenAPIRouter } from "@cloudflare/itty-router-openapi";
import { authenticateAdmin, authenticateInstructor, authenticateUser } from "auth/authenticateUser";
import { AuthLogin } from "auth/authLogin";
import { AuthRegister } from "auth/authResgister";
import { AddComment } from "comment/addComment";
import { AddCommentInstructor } from "instructor/addCommentInstructor";
import { getCommentByCourseId } from "comment/getCommentByCourseId";

import { deleteCompleteCourse } from "course/deleteCompleteChapter";
import { GetCourseById } from "course/getCourseById";
import { GetCoursesByInstrucId } from "instructor/getCourseByInstrucId";
import { GetCoursesByInstructorId } from "course/getCourseByInstructorId";
import { GetCourses } from "course/getCourses";
import { GetCoursesByInstructor } from "course/getInstructors";
import { GetMartCourse } from "course/getMartCourse";
import { MartCourse } from "course/markCourse";
import { AddEnroll } from "enroll/addEnroll";
import { GetEnroll } from "enroll/getEnroll";
import { GetOrderByInstructor } from "instructor/getOrderByInstructor";
import { UpdateCustomerProfile } from "users/updateCustomerProfile";
import { AutoRouter, cors } from 'itty-router'
import { AuthCheck } from "auth/authCheck";
import { EditComment } from "comment/editCommentByCommentId";
import { DeleteComment } from "comment/deleteCommentByComId";
import { changePassword } from "auth/changePassword";
import { ForgetPassword } from "auth/forgetPassword";
import { changePasswordWithResetToken } from "auth/changePasswordWithResetToken";
import { AddCourse } from "instructor/addCourse";
import { UpdateInstructorProfile } from "instructor/updateInstructorProfile";
import { GetCourseDetail } from "instructor/getCourseDetail";
import { DeleteCommentInstructor } from "instructor/deleteCommentByCommentId";
import { EditCommentInstructor } from "instructor/editcomment";
import { GetUsers } from "admin/getAllUsers";
import { GetAllCourses } from "admin/getCourses";

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
router.get("/api/instructor/getCourseDetail", GetCourseDetail);
router.delete("/api/instructor/deleteComment", DeleteCommentInstructor);
router.put("/api/instructor/editComment", EditCommentInstructor);

router.all('/api/admin/*', authenticateAdmin)
router.get("/api/admin/getAllUsers", GetUsers);
router.get("/api/admin/getAllCourses", GetAllCourses);

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
