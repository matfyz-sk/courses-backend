export const teamInstance = {
   type: "teamInstance",
   courseInstance: "instanceOf/courseInstance",
   create: ["student"],
   change: ["teacher"],
   props: {
      name: {
         required: true,
         multiple: false,
         dataType: "string",
      },
      approved: {
         required: true,
         multiple: false,
         dataType: "boolean",
      },
      notApprovedDescription: {
         required: false,
         multiple: false,
         dataType: "string",
      },
      instanceOf: {
         required: true,
         multiple: false,
         dataType: "node",
         objectClass: "team",
      },
   },
};
