export const course = {
   type: "course",
   create: ["superAdmin"],
   change: ["superAdmin"],
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
      abbreviation: {
         required: false,
         multiple: false,
         dataType: "string",
      },
      hasPrerequisite: {
         required: false,
         multiple: true,
         dataType: "node",
         objectClass: "course",
      },
      mentions: {
         required: false,
         multiple: true,
         dataType: "node",
         objectClass: "topic",
      },
      covers: {
         required: false,
         multiple: true,
         dataType: "node",
         objectClass: "topic",
      },
      hasAdmin: {
         required: false,
         multiple: true,
         dataType: "node",
         objectClass: "user",
      },
   },
};
