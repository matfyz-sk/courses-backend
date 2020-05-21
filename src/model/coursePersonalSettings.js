export const coursePersonalSettings = {
   type: "coursePersonalSettings",
   props: {
      hasUser: {
         required: false,
         multiple: false,
         dataType: "node",
         objectClass: "user",
      },
      nickName: {
         required: false,
         multiple: false,
         dataType: "string",
      },
   },
};
