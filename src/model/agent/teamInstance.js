export const teamInstance = {
   type: "teamInstance",
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
