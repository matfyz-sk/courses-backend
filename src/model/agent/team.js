import { agent } from "./agent";

export const team = {
   type: "team",
   subclassOf: agent,
   props: {
      name: {
         required: true,
         multiple: false,
         dataType: "string",
         change: ["admin"],
      },
      courseInstance: {
         required: true,
         multiple: false,
         dataType: "node",
         objectClass: "courseInstance",
         change: ["admin"],
      },
      minUsers: {
         required: true,
         multiple: false,
         dataType: "integer",
      },
      maxUsers: {
         required: true,
         multiple: false,
         dataType: "integer",
      },
      dateFrom: {
         required: true,
         multiple: false,
         dataType: "dateTime",
      },
      dateTo: {
         required: true,
         multiple: false,
         dataType: "dateTime",
      },
   },
   create: ["[this].courseInstance/^studentOf.{userURI}"],
};
