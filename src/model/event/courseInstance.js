import { event } from "./event";

export const courseInstance = {
   type: "courseInstance",
   subclassOf: event,
   create: ["admin"],
   show: ["all"],
   props: {
      instanceOf: {
         required: true,
         multiple: false,
         dataType: "node",
         objectClass: "course",
         change: ["admin"],
      },
      hasInstructor: {
         required: false,
         multiple: true,
         dataType: "node",
         objectClass: "user",
         put: ["admin"],
         patch: ["admin"],
         delete: ["admin"],
      },
   },
};
