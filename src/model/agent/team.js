import { agent } from "./agent";

export const team = {
   type: "team",
   subclassOf: agent,
   create: ["teacher"],
   change: ["teacher"],
   props: {
      name: {
         required: true,
         multiple: false,
         dataType: "string",
      },
      courseInstance: {
         required: true,
         multiple: false,
         dataType: "node",
         objectClass: "courseInstance",
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
};
