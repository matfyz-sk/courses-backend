import runQuery from "../query/index.js";
import {ONTOLOGY_IRI} from "../constants/index.js";
import RequestError from "../helpers/RequestError.js";
import {changeFirstCharCase, getResourceObject} from "../helpers/index.js";

export async function createResource(resource, data) {
    if (resource.resource.subclasses != undefined) {
        if (!data.hasOwnProperty("_type")) {
            throw new RequestError(
                "You cannot create resource containing subclasses. Specify attribute _type or send request to subclass",
                400
            );
        }
        resource.setResourceObject(getResourceObject(data._type));
    }

    await resource.setInputPredicates(data);
    // await resource.authorizeCreate();
    await resource.store();
}

export async function updateResource(resource, data) {
    for (let predicateName of Object.keys(data)) {
        // await resource.authorizeChange(predicateName);
        await resource.setPredicate(predicateName, data[predicateName]);
    }
    await resource.store();
}

export async function deleteResource(resource, attributeName, attributeValue) {
    if (attributeName != undefined) {
        // await resource.authorizeChange(attributeName);
        await resource.setPredicateToDelete(attributeName, attributeValue);
        await resource.store();
    } else {
        await resource.completeDelete();
    }
}

export async function getResource(resource, filters, user) {
    return await runQuery(resource, filters, user);
}

export function getResourceSubclasses(resource) {
    return resource.subclasses == undefined
        ? []
        : resource.subclasses.map((e) =>
            ONTOLOGY_IRI + changeFirstCharCase(e, true)
        );

}
