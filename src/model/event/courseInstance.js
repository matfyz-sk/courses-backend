import { event } from "./event";

export const courseInstance = {
   type: "courseInstance",
   subclassOf: event,
   create: ["{this}.instanceOf/hasAdmin.{userURI}"],
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
         show: ["admin", "superAdmin", "instructor"],
      },
   },
};
