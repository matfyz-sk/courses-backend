export const peerReviewQuestion = {
   type: ["peerReviewQuestion"],
   props: {
      question: {
         required: true,
         multiple: false,
         dataType: "string",
      },
      rated: {
         required: true,
         multiple: false,
         dataType: "boolean",
      },
      deadline: {
         required: true,
         multiple: false,
         dataType: "integer",
      },
   },
};
