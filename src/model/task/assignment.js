import {task} from "./task";

export const assignment = {
    type: ["assignment"],
    subclassOf: task,
    props: {
        shortDescription: {
            required: false,
            multiple: false,
            dataType: "string",
        },
        hasMaterial: {
            required: false,
            multiple: true,
            dataType: "node",
            objectClass: "material",
        },
        hasField: {
            required: false,
            multiple: true,
            dataType: "node",
            objectClass: "field",
        },
        submissionAnonymousSubmission: {
            required: false,
            multiple: false,
            dataType: "boolean",
        },
        initialSubmissionPeriod: {
            required: false,
            multiple: false,
            dataType: "node",
            objectClass: "assignmentPeriod",
        },
        submissionImprovedSubmission: {
            required: false,
            multiple: false,
            dataType: "boolean",
        },
        improvedSubmissionPeriod: {
            required: false,
            multiple: false,
            dataType: "node",
            objectClass: "assignmentPeriod",
        },
        teamsDisabled: {
            required: false,
            multiple: false,
            dataType: "boolean",
        },
        teamsSubmittedAsTeam: {
            required: false,
            multiple: false,
            dataType: "string",
        },
        teamsMinimumInTeam: {
            required: false,
            multiple: false,
            dataType: "integer",
        },
        teamsMaximumInTeam: {
            required: false,
            multiple: false,
            dataType: "integer",
        },
        teamsMultipleSubmissions: {
            required: false,
            multiple: false,
            dataType: "boolean",
        },
        peerReviewPeriod: {
            required: false,
            multiple: false,
            dataType: "node",
            objectClass: "assignmentPeriod",
        },
        reviewsDisabled: {
            required: false,
            multiple: false,
            dataType: "boolean",
        },
        reviewsPerSubmission: {
            required: false,
            multiple: false,
            dataType: "integer",
        },
        isReviewedByTeam: {
            required: false,
            multiple: false,
            dataType: "boolean",
        },
        reviewsVisibility: {
            required: false,
            multiple: false,
            dataType: "string",
        },
        teamReviewsDisabled: {
            required: false,
            multiple: false,
            dataType: "boolean",
        },
        teamReviewPeriod: {
            required: false,
            multiple: false,
            dataType: "node",
            objectClass: "assignmentPeriod",
        },
        reviewsQuestion: {
            required: false,
            multiple: true,
            dataType: "node",
            objectClass: "peerReviewQuestion",
        },
        hasAssignedReviews: {
            required: false,
            multiple: false,
            dataType: "boolean",
        },
    },
};
