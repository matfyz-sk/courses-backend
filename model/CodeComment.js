import * as Classes from "../constants/classes";
import { Node, Text, Data } from "virtuoso-sparql-client";
import Thing from "./Thing";
import * as Constants from "../constants";
import * as Predicates from "../constants/predicates";

export default class CodeComment extends Thing {
    constructor(id) {
        super(id);
        this.uriPrefix = Constants.codeCommentURI;
        this.subject = new Node(this.uriPrefix + this.id);
        this.type = Classes.CodeComment;
        this.subclassOf = Classes.Thing;
        [Predicates.creator.value] = { required: false, multiple: false, type: Node, primitive: false };
        [Predicates.commentTime.value] = { required: false, multiple: false, type: Text, primitive: true };
        [Predicates.commentText.value] = { required: false, multiple: false, type: Text, primitive: true };
        [Predicates.commentedText.value] = { required: false, multiple: false, type: Text, primitive: true };
        [Predicates.commentedTextFrom.value] = {
            required: false,
            multiple: false,
            type: Data,
            dataType: "xsd:integer",
            primitive: true
        };
        [Predicates.commentedTextTo.value] = {
            required: false,
            multiple: false,
            type: Data,
            dataType: "xsd:integer",
            primitive: true
        };
        [Predicates.filePath.value] = { required: false, multiple: false, type: Text, primitive: true };
    }
}
