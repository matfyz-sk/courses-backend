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
         required: false,
         multiple: true,
         dataType: "node",
         objectClass: "userAnswer",
      },
      position: {
         required: true,
         multiple: false,
         dataType: "integer",
      },
      points: {
         required: true,
         multiple: false,
         dataType: "integer",
      },
   },
};
