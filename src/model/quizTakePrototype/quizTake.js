export const quizTake = {
   type: "quizTake",
   courseInstance: "quizAssignment/courseInstance",
   create: ["quizAssignment/assignedTo"],
   show: ["test"],
   props: {
      submittedDate: {
         required: true,
         multiple: false,
         dataType: "dateTime",
      },
      endDate: {
         required: true,
         multiple: false,
         dataType: "dateTime",
      },
      reviewedDate: {
         required: false,
         multiple: false,
         dataType: "dateTime",
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
