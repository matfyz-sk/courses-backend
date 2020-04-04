import runQuery from "../query";

export async function createResource(resource, data) {
   await resource.setInputPredicates(data);
   await resource.isAbleToCreate();
   await resource.store();
}

export async function updateResource(resource, data) {
   for (var predicateName in data) {
      if (data.hasOwnProperty(predicateName)) {
         await resource.setPredicate(predicateName, data[predicateName]);
      }
   }
   await resource.update();
}

export async function deleteResource(resource, attributeName, attributeValue) {
   if (attributeName != undefined) {
      await resource.setPredicateToDelete(attributeName, attributeValue);
      await resource.delete();
   } else {
      await resource.completeDelete();
   }
}

export async function getResource(resource, filters) {
   return await runQuery(resource, filters);
}
