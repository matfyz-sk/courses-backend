export const topicRelated = {
    type: ["topicRelated"],
    subclasses: ["event", "material",  "task"],
    props: {
        covers: {
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
        mentions: {
            required: false,
            multiple: true,
            dataType: "node",
            objectClass: "topic",
        },
    },
};
