import * as models from "../model/index.js";

export class ModelJsonExporter {

    replacer(key, value) {
        if (key === "subclassOf" && typeof value === "object") {
            return [value.type[0]];
        }
        return value;
    }

    getAllModelsToJson() {
        return "{" + Object.values(models).map((model) => {
            return "\"" + model.type[0] + "\":" + JSON.stringify(model, this.replacer, "\t");
        }).join(',') + "}";
    }

}
