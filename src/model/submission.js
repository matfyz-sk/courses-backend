export const submission = {
   type: "submission",
   courseInstance: "ofAssignment/courseInstance",
   create: ["student"],
   change: ["teacher"],
   show: ["teacher", "creator"],
   // show: ["all"],
   props: {
      ofAssignment: {
         required: true,
         multiple: false,
         dataType: "node",
         objectClass: "assignment",
      },
      submittedField: {
         required: true,
         multiple: true,
         dataType: "node",
         objectClass: "submittedField",
      },
      submittedByStudent: {
         required: false,
         multiple: false,
         dataType: "node",
         objectClass: "user",
      },
      submittedByTeam: {
         required: false,
         multiple: false,
         dataType: "node",
         objectClass: "team",
      },
      hasTeacherComment: {
         required: false,
         multiple: false,
         dataType: "string",
      },
      isComplete: {
         required: false,
         multiple: false,
         dataType: "boolean",
      },
   },
};
