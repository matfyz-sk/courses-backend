import { userAnswer } from "./userAnswer";

export const orderingUserAnswer = {
   type: "orderingUserAnswer",
   subclassOf: userAnswer,
   props: {
      userChoice: {
         required: true,
         multiple: false,
         dataType: "integer"
      },
      orderingAnswer: {
         required: true,
         multiple: false,
         dataType: "node",
         objectClass: "orderingAnswer"
      }
   }
};
