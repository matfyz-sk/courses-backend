import { quizAssignment } from "./quizAssignment";

export const manualQuizAssignment = {
   type: ["manualQuizAssignment"],
   subclassOf: quizAssignment,
   props: {
      shuffleAnswer: {
         required: true,
         multiple: false,
         dataType: "boolean",
      },
      shuffleQuestion: {
         required: true,
         multiple: false,
         dataType: "boolean",
      },
      hasQuizTakePrototype: {
         required: true,
         multiple: false,
         dataType: "node",
         objectClass: "quizTakePrototype",
      },
   },
};
