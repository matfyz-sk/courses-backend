import { Team, Topic, Course, CourseInstance, Session, Event, Task, Agent, ReviewComment, Submission, Quiz } from "../controllers";
import express from "express";
import * as Validators from "../constants/requestValidators";
const router = express.Router();

import User from "../model/Agent/User";
import Query from "../query/Query";

router.post("/user", Agent.createUser);

router.put("/user/:id/:predicateName");

router.post("/team", Agent.createTeam);
router.post("/lecture", Event.createLecture);
router.post("/lab", Event.createLab);
router.post("/course", Course.createCourse);
router.post("/courseInstance", Event.createCourseInstance);
router.post("/topic", Topic.createTopic);
// router.post("/material", Topic.createTopic);
router.post("/assignment", Task.createAssignment);
router.post("/questionAssignment", Task.createQuestionAssignment);
router.post("/quizAssignment", Task.createQuizAssignment);
// router.post("/block", Validators.createTopic, Topic.createTopic);
// router.post("/oralExam", Validators.createTopic, Topic.createTopic);
// router.post("/testTake", Validators.createTopic, Topic.createTopic);
// router.post("/assignmentPeriod", Validators.createTopic, Topic.createTopic);
router.post("/codeComment", ReviewComment.createCodeComment);
router.post("/generalComment", ReviewComment.createGeneralComment);
router.post("/submission", Submission.createSubmission);
// router.post("/review", foo);
// router.post("/teamReview", foo);

router.post("/quizTake", Quiz.createQuizTake);
router.post("/quizTakePrototype", Quiz.createQuizTakePrototype);
router.post("/questionComment", Quiz.createQuestionComment);
router.post("/essayQuestion", Quiz.createEssayQuestion);
router.post("/openQuestion", Quiz.createOpenQuestion);
router.post("/questionWithPredefinedAnswer", Quiz.createQuestionWithPredefinedAnswer);
router.post("/orderedQuestion", Quiz.createOrderedQuestion);
router.post("/directAnswer", Quiz.createDirectAnswer);
router.post("/orderedAnswer", Quiz.createOrderedAnswer);
router.post("/predefinedAnswer", Quiz.createPredefinedAnswer);

// router.delete("/user/:id", Agent.deleteUser);
// router.delete("/team/:id", Agent.deleteTeam);
// router.delete("/lecture/:id", Event.deleteLecture);
// router.delete("/lab/:id", Event.deleteLab);
router.delete("/topic/:id", Topic.deleteTopic);
router.delete("/course/:id", Course.deleteCourse);

router.delete("/quizTake/:id/:attributeName?", Quiz.deleteQuizTake);

// router.patch("/team/:id", Agent.patchTeam);
// router.patch("/user/:id", Agent.patchUser);
// router.patch("/lecture/:id", Event.patchLecture);
// router.patch("/lab/:id", Event.patchLab);
router.patch("/topic/:id", Topic.patchTopic);
router.patch("/course/:id", Course.patchCourse);

router.get("/user", Agent.getAllUsers);
router.get("/user/:id", Agent.getUser);
// router.get("/team", Team.getAllTeams);
// router.get("/team/:id", Team.getTeam);
// router.get("/course", Course.getAllCourses);
// router.get("/course/:id", Course.getCourse);
// router.post("/user/requestCourseInstance", User.requestCourseInstanceValidation, validate, User.requestCourseInstance);
// router.post("/user/setCourseInstance", User.requestCourseInstanceValidation, validate, User.setCourseInstance);
// router.post("/user/setTeam", User.setTeamValidation, validate, User.setTeam);
// router.get("/topic", Topic.getAllTopics);
// router.get("/topic/:id", Topic.getTopic);
// router.put("/topic/:id", Topic.idValidation, validate, Topic.putTopic);
// router.get("/courseInstance", CourseInstance.getAllCourseInstances);
// router.get("/courseInstance/:id", CourseInstance.getCourseInstance);

router.get("/quizTake/:id?", Quiz.getQuizTake);
router.get("/quizTakePrototype/:id?", Quiz.getQuizTakePrototype);
router.get("/orderedQuestion/:id?", Quiz.getOrderedQuestion);
router.get("/essayQuestion/:id?", Quiz.getEssayQuestion);
router.get("/openQuestion/:id?", Quiz.getOpenQuestion);
router.get("/questionWithPredefinedAnswer/:id?", Quiz.getQwpa);
router.get("/directAnswer/:id?", Quiz.getDirectAnswer);
router.get("/orderedAnswer/:id?", Quiz.getOrderedAnswer);
router.get("/predefinedAnswer/:id?", Quiz.getPredefinedAnswer);

export default router;
