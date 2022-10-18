import { taskEvent } from "./taskEvent";

export const assignmentPeriod = {
   type: ["assignmentPeriod"],
   subclassOf: taskEvent,
   props: {
      openTime: {
         required: true,
         multiple: false,
         dataType: "integer",
      },
      deadline: {
         required: true,
         multiple: false,
         dataType: "integer",
      },
   },
};
