export const peerReviewQuestionAnswer = {
   type: "peerReviewQuestionAnswer",
   props: {
      question: {
         required: true,
         multiple: false,
         dataType: "node",
         objectClass: "questionAssignment",
      },
      answer: {
         required: true,
         multiple: false,
         dataType: "string",
      },
   },
};
