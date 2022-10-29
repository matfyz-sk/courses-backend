package org.hypergraphql.mutation;

import graphql.language.*;
import io.micrometer.core.lang.NonNull;
import org.hypergraphql.config.schema.FieldOfTypeConfig;
import org.hypergraphql.config.schema.TypeConfig;
import org.hypergraphql.datafetching.services.SPARQLEndpointService;
import org.hypergraphql.datafetching.services.Service;
import org.hypergraphql.datamodel.HGQLSchema;

import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

import static org.hypergraphql.config.schema.HGQLVocabulary.*;
import static org.hypergraphql.query.converters.SPARQLServiceConverter.*;

/**
 * Provides methods to translate GraphQL mutations to corresponding SPARQL actions.
 */
public class SPARQLMutationConverter {
    private final HGQLSchema schema;
    private static final String rdf_type = "a";
    private static final String GENERIC_GRAPH = "test";

    public enum MUTATION_ACTION {INSERT, UPDATE, DELETE}

    public SPARQLMutationConverter(HGQLSchema schema) {
        this.schema = schema;
    }

    /**
     * Translates a given GraphQL mutation into corresponding SPARQL actions.
     * If the given mutation is an insert mutation a SPARQL insert action is created.
     * If the given mutation is a delete mutation a SPARQL delete action is created
     *
     * @param mutation GraphQL mutation
     * @return SPARQL action
     */
    public String translateMutation(Field mutation) {
        MUTATION_ACTION action = decideAction(mutation.getName());

        if (action == null) {
            return "";
        }

        switch (action) {
            case INSERT:
                return translateInsertMutation(mutation);
            case UPDATE:
                return translateUpdateMutation(mutation);
            case DELETE:
                return translateDeleteMutation(mutation);
            default:
                return "";
        }
    }

    /**
     * Translates a given mutation into an SPARQL delete action using the provided information.
     *
     * @param mutation GraphQL delete mutation
     * @return SPARQL delete action
     */
    private String translateDeleteMutation(Field mutation) {
        TypeConfig rootObject = this.schema.getTypes().get(this.schema.getMutationFields().get(mutation.getName()));
        final List<Argument> args = mutation.getArguments();   // containing the mutation information
        Optional<String> optionalID = args.stream()
                .filter(argument -> argument.getName().equals("_id") && argument.getValue() instanceof StringValue)
                .map(argument -> ((StringValue) argument.getValue()).getValue())
                .findFirst();
        boolean hasID = optionalID.isPresent();
        // all arguments that are not _id
        boolean hasOtherFields = args.stream().anyMatch(argument -> !argument.getName().equals("_id"));  // has at least one field different from _id

        if (hasID && hasOtherFields) {
            String result = "";
            result += args.stream()
                    .filter(argument -> !argument.getName().equals("_id"))
                    .map(argument -> translateArgument(rootObject, optionalID.get(), argument, MUTATION_ACTION.DELETE))
                    .collect(Collectors.joining("\n"));
            return addSPARQLDeleteWrapper(result, null, getGraphName(getMutationService()));

        } else if (hasID && !hasOtherFields) {
            String id_uri = uriToResource(optionalID.get());
            String delete_field_type = toTriple(id_uri, rdf_type, uriToResource(rootObject.getId()));
            AtomicInteger i = new AtomicInteger(1);
            String delete_all_type_fields = rootObject.getFields().values().stream()
                    .filter(fieldOfTypeConfig -> !fieldOfTypeConfig.getId().equals(RDF_TYPE))
                    .map(fieldOfTypeConfig -> toTriple(id_uri, uriToResource(fieldOfTypeConfig.getId()), toVar("o_" + i.getAndIncrement())))
                    .collect(Collectors.joining("\n"));
            i.set(1);  // reset SPARQL variable id -> //ToDo: CHECK: separated handling could lead to different sorted lists and therefore incorrect assignment of the variables
            String delete_all_type_fields_optional = rootObject.getFields().values().stream()
                    .filter(fieldOfTypeConfig -> !fieldOfTypeConfig.getId().equals(RDF_TYPE))
                    .map(fieldOfTypeConfig -> optionalClause(toTriple(id_uri, uriToResource(fieldOfTypeConfig.getId()), toVar("o_" + i.getAndIncrement()))))
                    .collect(Collectors.joining("\n"));

            return addSPARQLDeleteWrapper(delete_all_type_fields + "\n" + delete_field_type + "\n", delete_all_type_fields_optional, getGraphName(getMutationService()));

        } else if (!hasID && hasOtherFields) {
            // ID not defined but other fields
            String var_root = rootObject.getName();
            String delete_all_with_id = toTriple(toVar(rootObject.getName()), toVar("p_1"), toVar("o")) + "\n"
                    + toTriple(toVar("s"), toVar("p_2"), toVar(rootObject.getName()));
            String delete_all_with_id_optional = optionalClause(toTriple(toVar(rootObject.getName()), toVar("p_1"), toVar("o"))) + "\n"
                    + optionalClause(toTriple(toVar("s"), toVar("p_2"), toVar(rootObject.getName())));
            String triple = toTriple(toVar(var_root), rdf_type, uriToResource(rootObject.getId())) + "\n";
            triple += args.stream()
                    .filter(argument -> !argument.getName().equals("_id"))
                    .map(argument -> translateArgument(rootObject, null, argument, MUTATION_ACTION.DELETE))
                    .collect(Collectors.joining("\n"));
            triple += "\n" + delete_all_with_id_optional;
            return addSPARQLDeleteWrapper(delete_all_with_id + "\n", triple, getGraphName(getMutationService()));
        } else {
            // No arguments were given only perform the selectionSet
            return null;
        }
    }

    private String addSPARQLInsertWrapper(String triples, @NonNull String graph) {
        return String.format("INSERT DATA{\n%s\n}", getGraphPart(triples, graph));
    }

    private String addSPARQLUpdateWrapper(String deleteTriples, String insertTriples, String where, @NonNull String graph) {
        if (where != null) {
            return String.format("WITH<%s>\nDELETE{\n%s}\nINSERT{\n%s}\nWHERE{\n%s\n}", graph, deleteTriples, insertTriples, where);
        }
        return String.format("WITH<%s>\nDELETE{\n%s}\nINSERT{\n%s}", graph, deleteTriples, insertTriples);
    }

    /**
     * Add the SPARQL DELETE clause around the given triples
     *
     * @param triples SPARQL term that is suited inside the DELETE clause
     * @param where   SPARQL where part that is suited inside the DELETE clause
     * @return DELETE clause containing given input
     */
    private String addSPARQLDeleteWrapper(String triples, String where, @NonNull String graph) {
        if (where != null) {
            return String.format("WITH<%s>\nDELETE{\n%s}\nWHERE{\n%s\n}", graph, triples, where);
        }
        return String.format("WITH<%s>\nDELETE{\n%s}", graph, triples);
    }

    private String getGraphPart(String triples, @NonNull String graph) {
        return String.format("GRAPH <%s>{\n%s\n}", graph, triples);
    }

    /**
     * Translates a given mutation into an SPARQL insert containing all information that were provided as triples.
     *
     * @param mutation GraphQL insert mutation
     * @return SPARQL insert action
     */
    private String translateInsertMutation(Field mutation) {
        TypeConfig rootObject = this.schema.getTypes().get(this.schema.getMutationFields().get(mutation.getName()));
        final List<Argument> args = mutation.getArguments();   // containing the mutation information
        String result = "";
        Optional<String> id = args.stream()
                .filter(argument -> argument.getName().equals("_id") && argument.getValue() instanceof StringValue)
                .map(argument -> ((StringValue) argument.getValue()).getValue())
                .findFirst();
        if (id.isPresent()) {
            result = toTriple(uriToResource(id.get()), rdf_type, uriToResource(rootObject.getId())) + "\n";
            result += args.stream()
                    .filter(argument -> !argument.getName().equals("_id"))
                    .map(argument -> translateArgument(rootObject, id.get(), argument, MUTATION_ACTION.INSERT))
                    .collect(Collectors.joining("\n"));
        } else {
            //error id must be defined for insertion
            //type validation should already reject this mutation
        }
        return addSPARQLInsertWrapper(result, getGraphName(getMutationService()));
    }

    /**
     * Translates a given mutation into an SPARQL update containing all information that were provided as triples.
     *
     * @param mutation GraphQL update mutation
     * @return SPARQL update action
     */
    private String translateUpdateMutation(Field mutation) {
        TypeConfig rootObject = this.schema.getTypes().get(this.schema.getMutationFields().get(mutation.getName()));
        final List<Argument> args = mutation.getArguments();   // containing the mutation information
        String updateResult = "";
        String deleteResult = "";
        String where = "";

        Optional<String> id = args.stream()
                .filter(argument -> argument.getName().equals("_id") && argument.getValue() instanceof StringValue)
                .map(argument -> ((StringValue) argument.getValue()).getValue())
                .findFirst();

        if (id.isPresent()) {
            String id_uri = uriToResource(id.get());

            updateResult = toTriple(id_uri, rdf_type, uriToResource(rootObject.getId())) + "\n";

            updateResult += args.stream()
                    .filter(argument -> !argument.getName().equals("_id"))
                    .map(argument -> translateArgument(rootObject, id.get(), argument, MUTATION_ACTION.UPDATE))
                    .collect(Collectors.joining("\n"));

            List<String> argsToDelete = args.stream().map(Argument::getName).filter(name -> !name.equals("_id")).collect(Collectors.toList());

            AtomicInteger i = new AtomicInteger(1);

            List<FieldOfTypeConfig> listOfFieldsToUpdate = rootObject.getFields().values().stream().filter(fieldOfTypeConfig -> !fieldOfTypeConfig.getId().equals(RDF_TYPE) && argsToDelete.contains(fieldOfTypeConfig.getName())).collect(Collectors.toList());
            deleteResult += listOfFieldsToUpdate.stream().map(fieldOfTypeConfig -> toTriple(id_uri, uriToResource(fieldOfTypeConfig.getId()), toVar("o_" + i.getAndIncrement())))
                    .collect(Collectors.joining("\n"));

            AtomicInteger i2 = new AtomicInteger(1);
            where += listOfFieldsToUpdate.stream().map(fieldOfTypeConfig -> optionalClause(toTriple(id_uri, uriToResource(fieldOfTypeConfig.getId()), toVar("o_" + i2.getAndIncrement()))))
                    .collect(Collectors.joining("\n"));
        } else {
            //error id must be defined for update
            //type validation should already reject this mutation
        }
        return addSPARQLUpdateWrapper(deleteResult, updateResult, where, getGraphName(getMutationService()));
    }

    private Service getMutationService() {
        return schema.getServiceList().values().stream().findFirst().orElse(null);
    }

    private String getGraphName(Service service) {
        if (!(service instanceof SPARQLEndpointService)) {
            return GENERIC_GRAPH;
        }
        return ((SPARQLEndpointService) service).getGraph();
    }

    /**
     * Translates a argument of and mutation field to corresponding triples
     *
     * @param root TypeConfig of the output type of the mutation field
     * @param id   IRI of the object to be inserted
     * @param arg  Argument to be translated
     * @return triples representing the relations between the given id and the values given in the argument.
     */
    private String translateArgument(TypeConfig root, String id, Argument arg, MUTATION_ACTION action) {
        return translateValue(root, id, arg.getName(), arg.getValue(), action);
    }

    /**
     * Checks the type of the value and calls the corresponding handler
     *
     * @param root  TypeConfig of the object
     * @param id    IRI of object instance of type given in root
     * @param field Field name
     * @param value value associated with the given id via the given field
     * @return triples representing the relations between the given parameters
     */
    private String translateValue(TypeConfig root, String id, String field, Value value, MUTATION_ACTION action) {
        if (value instanceof ArrayValue) {
            return translateArrayValue(root, id, field, (ArrayValue) value, action);
        } else if (value instanceof ObjectValue) {
            return translateObjectValue(root, id, field, (ObjectValue) value, action);
        } else if (value instanceof StringValue) {
            return translateStringValue(root, id, field, (StringValue) value, action);
        } else {
            //ToDo: Check if there are more possible values and handle them
            return "";
        }
    }


    /**
     * Translates every item of the given array to corresponding triples.
     *
     * @param root  TypeConfig of the object
     * @param id    IRI of object of type given in root
     * @param field Field name
     * @param value array of values associated with the given id via given field
     * @return triples representing the relations between the given parameters
     */
    private String translateArrayValue(TypeConfig root, String id, String field, ArrayValue value, MUTATION_ACTION action) {
        return value.getValues().stream()
                .map(val -> translateValue(root, id, field, val, action))
                .collect(Collectors.joining("\n"));
    }

    /**
     * Translates the given ObjectValue as the relation of the given id and the ObjectValue to corresponding triples.
     * If the given ObjectValue only contains the literal placeholders object, then the Strings in the ObjectValue are
     * directly translated to associations between the given id an the strings.
     *
     * @param root  TypeConfig of the object
     * @param id    IRI of object of type given in root
     * @param field Field name
     * @param value ObjectValue linking the given id to another object
     * @return triples representing the relations between the given id and the object given in value as the value it self.
     */
    private String translateObjectValue(TypeConfig root, String id, String field, ObjectValue value, MUTATION_ACTION action) {
        String field_id = this.schema.getFields().get(this.schema.getInputFields().get(field)).getId();
        List<ObjectField> valueFields = value.getObjectFields();
        if (this.schema.getinputFieldsOutput().get(field).equals(HGQL_SCALAR_LITERAL_GQL_NAME)) {
            //given field has the literal placeholder as output -> only insert the string value
            Value literal_values = valueFields.stream()
                    .filter(objectField -> objectField.getName().equals(HGQL_SCALAR_LITERAL_VALUE_GQL_NAME))
                    .findFirst()
                    .get().getValue();
            return translateValue(root, id, field, literal_values, action);
        }
        final Optional<ObjectField> optional_id = valueFields.stream()
                .filter(objectField -> objectField.getName().equals("_id"))
                .findFirst();
        if (!optional_id.isPresent()) {
            // error id must be present
        }
        String sub_id = ((StringValue) optional_id.get().getValue()).getValue();
        TypeConfig subObject = this.schema.getTypes().get(this.schema.getinputFieldsOutput().get(field));   //output object of the field
        String results = "";
        if (id == null) {
            results += toTriple(toVar(root.getName()), uriToResource(field_id), uriToResource(sub_id)) + "\n";
        } else {
            results += toTriple(uriToResource(id), uriToResource(field_id), uriToResource(sub_id)) + "\n";
        }
        if (action == MUTATION_ACTION.INSERT || action == MUTATION_ACTION.UPDATE) {
            results += toTriple(uriToResource(sub_id), rdf_type, uriToResource(subObject.getId())) + "\n";
        }
        results += valueFields.stream()
                .filter(objectField -> !objectField.getName().equals("_id"))
                .map(objectField -> translateValue(subObject, sub_id, objectField.getName(), objectField.getValue(), action))
                .collect(Collectors.joining("\n"));
        return results;
    }

    /**
     * Creates a RDF triple linking a Literal to the given object with the given field/predicate
     *
     * @param subject object IRI
     * @param field   predicate IRI
     * @param value   String literal
     * @return RDF triple
     */
    private String translateStringValue(TypeConfig root, String subject, String field, StringValue value, MUTATION_ACTION action) {
        String field_id = this.schema.getFields().get(this.schema.getInputFields().get(field)).getId();
        if (subject == null) {
            return toTriple(toVar(root.getName()), uriToResource(field_id), "\"" + value.getValue() + "\"");
        } else {
            return toTriple(uriToResource(subject), uriToResource(field_id), "\"" + value.getValue() + "\"");
        }

    }

    /**
     * Checks which kind of action the given mutation field should perform. The decision is based on the prefix of the field
     *
     * @param mutationField mutation field with an action prefix
     * @return Action the mutation should perform
     */
    private MUTATION_ACTION decideAction(String mutationField) {
        if (mutationField.startsWith(HGQL_MUTATION_INSERT_PREFIX)) {
            return MUTATION_ACTION.INSERT;
        } else if (mutationField.startsWith(HGQL_MUTATION_UPDATE_PREFIX)) {
            return MUTATION_ACTION.UPDATE;
        } else if (mutationField.startsWith(HGQL_MUTATION_DELETE_PREFIX)) {
            return MUTATION_ACTION.DELETE;
        } else {
            // unknown mutation action
            return null;
        }
    }
}
