import { event } from "./event";

export const courseInstance = {
   type: "courseInstance",
   subclassOf: event,
   create: ["instanceOf/hasAdmin"],
   show: ["all"],
   props: {
      instanceOf: {
         required: true,
         multiple: false,
         dataType: "node",
         objectClass: "course",
      },
      hasInstructor: {
         required: false,
         multiple: true,
         dataType: "node",
         objectClass: "user",
      },
   },
};
