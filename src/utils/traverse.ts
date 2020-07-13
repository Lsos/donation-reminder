export { traverse };

function traverse(
  obj: object,
  children_key: string | ((obj: object) => object)
) {
  const children_retriever =
    typeof children_key === "string"
      ? (node) => node[children_key]
      : children_key;
  const nodes = [];
  const visited_nodes = [];
  walk(obj, []);

  return nodes;

  function walk(node, ancestors) {
    if (visited_nodes.includes(node)) {
      return;
    }
    visited_nodes.push(node);
    nodes.push({
      node,
      ancestors,
    });
    const children = children_retriever(node);
    if (children) {
      children.forEach((child) => {
        walk(child, [node, ...ancestors]);
      });
    }
  }
}
