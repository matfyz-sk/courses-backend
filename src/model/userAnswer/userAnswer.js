export const userAnswer = {
   type: "userAnswer",
   subclasses: ["directAnswer", "orderedAnswer", "orderingUserAnswer", "matchPairUserAnswer"],
   courseInstance: "^userAnswer/^orderedQuestion/^quizAssignment/courseInstance",
   create: ["[orderedQuestion]"],
   show: ["teacher", "creator"],
   props: {
      score: {
         required: false,
         multiple: false,
         dataType: "float",
      },
   },
};
