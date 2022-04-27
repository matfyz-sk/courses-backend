export const predefinedAnswer = {
   type: ["predefinedAnswer"],
   courseInstance: "^hasAnswer/courseInstance",
   create: ["[questionWithPredefinedAnswer]"],
   props: {
      text: {
         required: true,
         multiple: false,
         dataType: "string",
         change: ["teacher"],
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
