export const predefinedAnswer = {
   type: "predefinedAnswer",
   create: ["[questionWithPredefinedAnswer]"],
   props: {
      text: {
         required: true,
         multiple: false,
         dataType: "string",
      },
      position: {
         required: true,
         multiple: false,
         dataType: "integer",
      },
      correct: {
         required: true,
         multiple: false,
         dataType: "boolean",
      },
   },
};
