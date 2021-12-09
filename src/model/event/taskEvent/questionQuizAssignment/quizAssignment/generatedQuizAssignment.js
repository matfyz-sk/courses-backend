import { quizAssignment } from "./quizAssignment";

export const generatedQuizAssignment = {
   type: "generatedQuizAssignment",
   subclassOf: quizAssignment,
   props: {
      pointsPerQuestion: {
         required: true,
         multiple: false,
         dataType: "integer",
      },
      questionsAmount: {
         required: false,
         multiple: false,
         dataType: "integer",
      },
      excludeEssay: {
         required: false,
         multiple: false,
         dataType: "boolean"
      },
      hasTopicAppearance: {
         required: false,
         multiple: true,
         dataType: "node",
         objectClass: "topicAppearance",
      },
      hasTypeAppearance:{
         required: false,
         multiple: true,
         dataType: "node",
         objectClass: "typeAppearance",
      },
   }
};
