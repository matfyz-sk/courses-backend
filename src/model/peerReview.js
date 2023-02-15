export const peerReview = {
    type: ["peerReview"],
    courseInstance: "ofSubmission/ofAssignment/courseInstance",
    props: {
        hasQuestionAnswer: {
            required: true,
            multiple: true,
            dataType: "node",
            objectClass: "peerReviewQuestionAnswer",
        },
        reviewedByStudent: {
            required: false,
            multiple: false,
            dataType: "node",
            objectClass: "user",
        },
        reviewedByTeam: {
            required: false,
            multiple: false,
            dataType: "node",
            objectClass: "team",
        },
        ofSubmission: {
            required: true,
            multiple: false,
            dataType: "node",
            objectClass: "submission",
        },
    },
};
