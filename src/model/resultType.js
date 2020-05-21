export const resultType = {
   type: "resultType",
   props: {
      name: {
         required: false,
         multiple: false,
         dataType: "string",
      },
      minPoints: {
         required: false,
         multiple: false,
         dataType: "float",
      },
      description: {
         required: false,
         multiple: false,
         dataType: "string",
      },
      correctionFor: {
         required: false,
         multiple: false,
         dataType: "node",
         objectClass: "resultType",
      },
   },
};
