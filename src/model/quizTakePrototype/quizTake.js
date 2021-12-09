export const quizTake = {
   type: "quizTake",
   courseInstance: "quizAssignment/courseInstance",
   create: ["quizAssignment/assignedTo"],
   props: {
      submittedDate: {
         required: false,
         multiple: false,
         dataType: "dateTime",
      },
      endDate: {
         required: false,
         multiple: false,
         dataType: "dateTime",
      },
      reviewedDate: {
         required: false,
         multiple: false,
         dataType: "dateTime",
      },
      publishedReview: {
         required: false,
         multiple: false,
         dataType: "boolean"
      },
      score: {
         required: false,
         multiple: false,
         dataType: "float"
      },
      quizAssignment: {
         required: true,
         multiple: false,
         dataType: "node",
         objectClass: "quizAssignment",
      },
      orderedQuestion: {
         required: true,
         multiple: true,
         dataType: "node",
         objectClass: "orderedQuestion",
      },
   },
};
