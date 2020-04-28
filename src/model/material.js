export const material = {
   type: "material",
   props: {
      name: {
         required: true,
         multiple: false,
         dataType: "string",
      },
      covers: {
         required: false,
         multiple: false,
         dataType: "node",
         objectClass: "topic",
      },
   },
};
