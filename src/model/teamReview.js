export const teamReview = {
   type: "teamReview",
   courseInstance: "ofSubmission/ofAssignment/courseInstance",
   create: ["student"],
   show: ["reviewedStudent", "teacher", "creator"],
   props: {
      percentage: {
         required: true,
         multiple: false,
         dataType: "float",
      },
      reviewedStudent: {
         required: true,
         multiple: false,
         type: "node",
         objectClass: "user",
      },
      studentComment: {
         required: false,
         multiple: false,
         type: "string",
      },
      privateComment: {
         required: false,
         multiple: false,
         type: "string",
      },
      ofSubmission: {
         required: true,
         multiple: false,
         dataType: "node",
         objectClass: "submission",
      },
      isImproved: {
         required: false,
         multiple: false,
         dataType: "boolean",
      },
   },
};
