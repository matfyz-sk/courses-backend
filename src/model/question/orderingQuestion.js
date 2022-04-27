import { question } from "./question";

export const orderingQuestion = {
   type: ["orderingQuestion"],
   subclassOf: question,
   props: {
      hasAnswer: {
         required: true,
         multiple: true,
         dataType: "node",
         objectClass: "orderingAnswer",
      },
   },
};
