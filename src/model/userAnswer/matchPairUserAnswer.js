import { userAnswer } from "./userAnswer";

export const matchPairUserAnswer = {
   type: ["matchPairUserAnswer"],
   subclassOf: userAnswer,
   props: {
      position: {
         required: true,
         multiple: false,
         dataType: "integer"
      },
      userChoice: {
         required: true,
         multiple: false,
         dataType: "string",
      },
      matchPair: {
         required: true,
         multiple: false,
         dataType: "node",
         objectClass: "matchPair"
      }
   }
};
