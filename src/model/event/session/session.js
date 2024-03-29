import {event} from "../event.js";

export const session = {
    type: ["session"],
    subclassOf: event,
    subclasses: ["lecture", "lab"],
    props: {
        hasInstructor: {
            required: false,
            multiple: true,
            dataType: "node",
            objectClass: "user",
        },
    },
};
