export const teamReview = {
   type: "teamReview",
   courseInstance: "ofSubmission/ofAssignment/courseInstance",
   create: [""],
   show: ["teacher", "creator"],
   props: {
      percentage: {
         required: true,
         multiple: false,
         dataType: "float",
         change: ["teacher"],
      },
      reviewedStudent: {
         required: true,
         multiple: false,
         type: "node",
         objectClass: "user",
         change: ["admin"],
      },
      studentComment: {
         required: false,
         multiple: false,
         type: "string",
         change: ["teacher"],
      },
      privateComment: {
         required: false,
         multiple: false,
         type: "string",
         change: "[this].ofSubmission/ofAssignment/courseInstance/^instructorOf.{userURI}",
      },
      ofSubmission: {
         required: true,
         multiple: false,
         dataType: "node",
         objectClass: "submission",
         change: "admin",
      },
   },
};
