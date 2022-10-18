export const courseGrading = {
   type: ["courseGrading"],
   props: {
      grade: {
         required: false,
         multiple: false,
         dataType: "string",
      },
      minPoints: {
         required: false,
         multiple: false,
         dataType: "integer",
      },
   },
};
