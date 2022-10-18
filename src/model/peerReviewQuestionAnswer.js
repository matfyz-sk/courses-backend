export const peerReviewQuestionAnswer = {
   type: ["peerReviewQuestionAnswer"],
   courseInstance: "^hasQuestionAnswer/ofSubmission/ofAssignment/courseInstance",
   props: {
      question: {
         required: true,
         multiple: false,
         dataType: "node",
         objectClass: "peerReviewQuestion",
      },
      answer: {
         required: true,
         multiple: false,
         dataType: "string",
      },
      score: {
         required: false,
         multiple: false,
         dataType: "integer",
      },
   },
};
