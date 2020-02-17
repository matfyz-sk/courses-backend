import * as Prefixes from "./prefixes";

export const created = { prefix: Prefixes.courses, value: "created" };
export const type = { prefix: Prefixes.rdf, value: "type" };
export const subclassOf = { prefix: Prefixes.rdfs, value: "subclassOf" };
export const label = { prefix: Prefixes.rdfs, value: "label" };
export const description = { prefix: Prefixes.courses, value: "description" };
export const abbreviation = { prefix: Prefixes.courses, value: "abbreviation" };
export const date = { prefix: Prefixes.courses, value: "date" };
export const year = { prefix: Prefixes.courses, value: "year" };
export const name = { prefix: Prefixes.courses, value: "name" };
export const firstName = { prefix: Prefixes.courses, value: "firstName" };
export const lastName = { prefix: Prefixes.courses, value: "lastName" };
export const email = { prefix: Prefixes.courses, value: "email" };
export const nickname = { prefix: Prefixes.courses, value: "nickname" };
export const location = { prefix: Prefixes.courses, value: "location" };
export const duration = { prefix: Prefixes.courses, value: "duration" };
export const time = { prefix: Prefixes.courses, value: "time" };
export const startDate = { prefix: Prefixes.courses, value: "startDate", inverse: endDate };
export const endDate = { prefix: Prefixes.courses, value: "endDate", inverse: startDate };
export const extraTime = { prefix: Prefixes.courses, value: "extraTime" };
export const comment = { prefix: Prefixes.courses, value: "comment" };
export const commentedText = { prefix: Prefixes.courses, value: "commentedText" };
export const occurance = { prefix: Prefixes.courses, value: "occurance" };
export const filePath = { prefix: Prefixes.courses, value: "filePath" };
export const room = { prefix: Prefixes.courses, value: "room" };
export const hasPrerequisite = { prefix: Prefixes.courses, value: "hasPrerequisite" };
export const mentions = { prefix: Prefixes.courses, value: "mentions" };
export const covers = { prefix: Prefixes.courses, value: "covers" };
export const uses = { prefix: Prefixes.courses, value: "uses" };
export const recommends = { prefix: Prefixes.courses, value: "recommends" };
export const requires = { prefix: Prefixes.courses, value: "requires" };
export const instanceOf = { prefix: Prefixes.courses, value: "instanceOf" };
export const hasInstructor = { prefix: Prefixes.courses, value: "hasInstructor" };
export const hasMember = { prefix: Prefixes.courses, value: "hasMember" };
export const courseInstance = { prefix: Prefixes.courses, value: "courseInstance" };
export const subtopicOf = { prefix: Prefixes.courses, value: "subtopicOf" };
export const memberOf = { prefix: Prefixes.courses, value: "memberOf" };
export const requests = { prefix: Prefixes.courses, value: "requests" };
export const studentOf = { prefix: Prefixes.courses, value: "studentOf" };
export const understands = { prefix: Prefixes.courses, value: "understands" };
export const task = { prefix: Prefixes.courses, value: "task" };
export const subEvent = { prefix: Prefixes.courses, value: "subEvent" };
export const superEvent = { prefix: Prefixes.courses, value: "superEvent" };
export const author = { prefix: Prefixes.courses, value: "author" };
export const hasCodeComment = { prefix: Prefixes.courses, value: "hasCodeComment" };
export const hasGeneralComment = { prefix: Prefixes.courses, value: "hasGeneralComment" };
export const ofAssignment = { prefix: Prefixes.courses, value: "ofAssignment" };
export const submittedField = { prefix: Prefixes.courses, value: "submittedField" };
export const submittedByStudent = { prefix: Prefixes.courses, value: "submittedByStudent" };
export const submittedByTeam = { prefix: Prefixes.courses, value: "submittedByTeam" };
export const submittedAt = { prefix: Prefixes.courses, value: "submittedAt" };
export const hasReview = { prefix: Prefixes.courses, value: "hasReview" };
export const hasTeacherComment = { prefix: Prefixes.courses, value: "hasTeacherComment" };
export const hasCodeReview = { prefix: Prefixes.courses, value: "hasCodeReview" };
export const hasTeamReview = { prefix: Prefixes.courses, value: "hasTeamReview" };
export const isComplete = { prefix: Prefixes.courses, value: "isComplete" };
export const hasSubmission = { prefix: Prefixes.courses, value: "hasSubmission" };
export const avatar = { prefix: Prefixes.courses, value: "avatar" };
export const takingEvent = { prefix: Prefixes.courses, value: "takingEvent" };
export const creationPeriod = { prefix: Prefixes.courses, value: "creationPeriod" };
export const initialSubmissionPeriod = { prefix: Prefixes.courses, value: "initialSubmissionPeriod" };
export const peerReviewPeriod = { prefix: Prefixes.courses, value: "peerReviewPeriod" };
export const improvedSubmissionPeriod = { prefix: Prefixes.courses, value: "improvedSubmissionPeriod" };
export const teamReviewPeriod = { prefix: Prefixes.courses, value: "teamReviewPeriod" };
export const text = { prefix: Prefixes.courses, value: "text" };
export const visibilityIsRestricted = { prefix: Prefixes.courses, value: "visibilityIsRestricted" };
export const hasQuestionState = { prefix: Prefixes.courses, value: "hasQuestionState" };
export const ofTopic = { prefix: Prefixes.courses, value: "ofTopic" };
export const hasAuthor = { prefix: Prefixes.courses, value: "hasAuthor" };
export const hasComment = { prefix: Prefixes.courses, value: "hasComment" };
export const approver = { prefix: Prefixes.courses, value: "approver" };
export const hasChangeEvent = { prefix: Prefixes.courses, value: "hasChangeEvent" };
export const question = { prefix: Prefixes.courses, value: "question" };
export const userAnswer = { prefix: Prefixes.courses, value: "userAnswer" };
export const quizTake = { prefix: Prefixes.courses, value: "quizTake" };
export const next = { prefix: Prefixes.courses, value: "next" };
export const score = { prefix: Prefixes.courses, value: "score" };
export const orderedQuestion = { prefix: Prefixes.courses, value: "orderedQuestion" };
export const position = { prefix: Prefixes.courses, value: "position" };
export const userChoice = { prefix: Prefixes.courses, value: "userChoice" };
export const predefinedAnswer = { prefix: Prefixes.courses, value: "predefinedAnswer" };
export const correct = { prefix: Prefixes.courses, value: "correct" };
export const submitedDate = { prefix: Prefixes.courses, value: "submitedDate" };
export const reviewedDate = { prefix: Prefixes.courses, value: "reviewedDate" };
export const commentText = { prefix: Prefixes.courses, value: "commentText" };
export const useNickName = { prefix: Prefixes.courses, value: "useNickName" };
export const reviews = { prefix: Prefixes.courses, value: "reviews" };
export const creator = { prefix: Prefixes.courses, value: "creator" };
export const commentTime = { prefix: Prefixes.courses, value: "commentTime" };
export const commentedTextFrom = { prefix: Prefixes.courses, value: "commentedTextFrom" };
export const commentedTextTo = { prefix: Prefixes.courses, value: "commentedTextTo" };
export const regexp = { prefix: Prefixes.courses, value: "regexp" };
export const hasAnswer = { prefix: Prefixes.courses, value: "hasAnswer" };
export const password = { prefix: Prefixes.courses, value: "password" };
export const publicProfile = { prefix: Prefixes.courses, value: "publicProfile" };
export const showCourses = { prefix: Prefixes.courses, value: "showCourses" };
export const showBadges = { prefix: Prefixes.courses, value: "showBadges" };
export const allowContact = { prefix: Prefixes.courses, value: "allowContact" };
