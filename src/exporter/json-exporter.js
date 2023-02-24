import * as models from "../model";

export class JsonExporter {

    replacer(key, value) {
        if (key === "subclassOf" && typeof value === "object") {
            return [value.type[0]];
        }
        return value;
    }

    getAllModelsToJson() {
        return Object.values(models).map((model) => {
            return JSON.stringify(model, this.replacer);
        })
    }

}
