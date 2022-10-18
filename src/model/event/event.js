export const event = {
   type: ["event"],
   subclasses: ["courseInstance", "block", "session", "taskEvent"],
   create: ["teacher"],
   props: {
      name: {
         required: false,
         multiple: false,
         dataType: "string",
      },
      location: {
         required: false,
         multiple: false,
         dataType: "string",
      },
      description: {
         required: false,
         multiple: false,
         dataType: "string",
      },
      startDate: {
         required: true,
         multiple: false,
         dataType: "dateTime",
      },
      endDate: {
         required: true,
         multiple: false,
         dataType: "dateTime",
      },
      uses: {
         required: false,
         multiple: true,
         dataType: "node",
         objectClass: "material",
      },
      recommends: {
         required: false,
         multiple: true,
         dataType: "node",
         objectClass: "material",
      },
      documentReference: {
         required: false,
         multiple: true,
         dataType: "node",
         objectClass: "documentReference",
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
         required: false,
         multiple: false,
         dataType: "node",
         objectClass: "courseInstance",
      },
   },
};
