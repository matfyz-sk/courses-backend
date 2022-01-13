from rdflib import Namespace
from rdflib.namespace import FOAF, DCTERMS, RDF, SDO
from enum import Enum

class Format(Enum):
    XML = 'xml'
    TTL = 'ttl'


def get_namespace():
    return Namespace('http://example.org/')


def create_graph():
    EX = get_namespace()

    bob = EX['Bob']
    alice = EX['Alice']

    from rdflib import Graph
    graph = Graph()

    # Bind prefix to namespace
    graph.bind('ex', EX)
    graph.bind('foaf', FOAF)
    graph.bind('schema', SDO)
    graph.bind('dcterms', DCTERMS)

    graph.add((bob, RDF.type, FOAF.Person))
    graph.add((bob, FOAF.knows, alice))

    return graph.serialize(format=Format.XML.value).encode('u8')

if __name__ == '__main__':
    print(create_graph())
