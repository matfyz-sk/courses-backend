import { questionQuizAssignment } from "../questionQuizAssignment";

export const quizAssignment = {
   type: ["quizAssignment"],
   subclassOf: questionQuizAssignment,
   subclasses: ["generatedQuizAssignment", "manualQuizAssignment"],
   props: {
      timeLimit: {
         required: true,
         multiple: false,
         dataType: "integer",
      },
      showResult: {
         required: false,
         multiple: false,
         dataType: "boolean"
      },
      showQuestionResult: {
         required: false,
         multiple: false,
         dataType: "boolean"
      },
   },
};
