export const topicAppearance = {
   type: "topicAppearance",
   create: ["[generatedQuizAssignment]"],
   props: {
      amount: {
         required: false,
         multiple: false,
         dataType: "integer",
      },
      topic: {
         required: false,
         multiple: false,
         dataType: "node",
         objectClass: "topic",
      },
   },
};
