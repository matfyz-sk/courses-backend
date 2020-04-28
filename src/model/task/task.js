export const task = {
   type: "task",
   subclasses: ["assignment"],
   create: ["teacher"],
   show: ["test"],
   props: {
      name: {
         required: true,
         multiple: false,
         dataType: "string",
      },
      description: {
         required: false,
         multiple: false,
         dataType: "string",
      },
      covers: {
         required: false,
         multiple: true,
         dataType: "node",
         objectClass: "topic",
      },
      mentions: {
         required: false,
         multiple: true,
         dataType: "node",
         objectClass: "topic",
      },
      requires: {
         required: false,
         multiple: true,
         dataType: "node",
         objectClass: "topic",
      },
      courseInstance: {
         required: true,
         multiple: false,
         dataType: "node",
         objectClass: "courseInstance",
      },
   },
};
