import * as Classes from "../../constants/classes";
import { Node, Text, Data } from "virtuoso-sparql-client";
import * as Constants from "../../constants";
import * as Predicates from "../../constants/predicates";
import Question from "./Question";

export default class OpenQuestion extends Question {
    constructor(uri) {
        super(uri);
        this.type = Classes.OpenQuestion;
        this.subclassOf = Classes.Question;
        this.uriPrefix = Constants.openQuestionURI;
        this.predicates.push({ predicate: Predicates.regexp, asNode: false });
    }

    set regexp(value) {
        this._setProperty(Predicates.regexp, new Text(value));
    }

    _fill(data) {
        this._setNewProperty(Predicates.regexp, new Text(data.regexp));
        super._fill(data);
    }
}