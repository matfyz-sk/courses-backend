export const topicAppearance = {
   type: ["topicAppearance"],
   create: ["[generatedQuizAssignment]"],
   props: {
      questionsAmount: {
         required: false,
         multiple: false,
         dataType: "integer",
      },
      topic: {
         required: true,
         multiple: false,
         dataType: "node",
         objectClass: "topic",
      },
      hasTypeAppearance: {
         required: false,
         multiple: true,
         dataType: "node",
         objectClass: "typeAppearance",
      },
   },
};
