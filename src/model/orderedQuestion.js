export const orderedQuestion = {
   type: "orderedQuestion",
   courseInstance: "^orderedQuestion/ofQuizAssignment/courseInstance",
   create: ["[quizTakePrototype]", "[quizTake]"],
   show: ["teacher", "creator"],
   props: {
      question: {
         required: true,
         multiple: false,
         dataType: "node",
         objectClass: "question",
      },
      userAnswer: {
         required: true,
         multiple: true,
         dataType: "node",
         objectClass: "userAnswer",
      },
      position: {
         required: true,
         multiple: false,
         dataType: "integer",
      },
   },
};
