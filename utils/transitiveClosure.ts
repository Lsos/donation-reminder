import assert from "assert";

export { transitiveClosure };

function transitiveClosure(parents) {
  validateParents();

  return getAncestors();

  function validateParents() {
    Object.entries(parents).forEach(
      ([node, node_parents]: [string, string[]]) => {
        assert(node.constructor === String);
        node_parents.forEach((parent: string) => {
          assert(parent.constructor === String);
          assert(parents[parent]);
        });
      }
    );
  }

  function getAncestors() {
    const ancestors = {};
    Object.keys(parents).forEach((node) => {
      const node_ancestors = [];
      const visited_nodes: { [key: string]: boolean } = {};
      add_parents(node, visited_nodes, node_ancestors);
      ancestors[node] = node_ancestors;
    });
    return ancestors;
  }

  function add_parents(node, visited_nodes, node_ancestors) {
    visited_nodes[node] = true;
    const node_parents = parents[node];
    node_parents.forEach((parent) => {
      if (visited_nodes[parent]) return;
      node_ancestors.push(parent);
      add_parents(parent, visited_nodes, node_ancestors);
    });
  }
}
