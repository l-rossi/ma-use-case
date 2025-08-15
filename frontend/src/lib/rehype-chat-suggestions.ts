import type { Plugin } from 'unified';
import type { ElementContent, Properties, Root, RootContent, Element } from 'hast';
import { visit } from 'unist-util-visit';
import { Raw } from 'mdast-util-to-hast';
import { toast } from 'sonner';
import { location } from 'vfile-location';
import { VFile } from 'vfile';

// Careful, you are about to withness some code written by someone who doesn't know what they are doing.
export const rehypeChatSuggestionPlugin: Plugin<[], Root> = () => {
  return (tree, file) => {
    visit(
      tree,
      'raw',
      (node, index, parent) => {
        if (!parent || index === undefined) {
          return;
        }

        if (node.value.startsWith('<suggestion')) {
          const target = node.value.match(/<suggestion\s+target="([^"]+)"/)?.[1];
          return handleTag('suggestion', node, index, parent, undefined, {
            target,
          });
        }

        if (node.value === '<explanation>') {
          return handleTag('explanation', node, index, parent);
        }

        if (node.value === '<action>') {
          return handleTag('action', node, index, parent, file);
        }
      },
      true
    );
  };
};

/**
 * Handles a custom tag in the AST, replacing it with an element node.
 * @param type - The type of the tag (e.g., 'suggestion', 'explanation', 'action').
 * @param node - The raw node representing the tag.
 * @param index - The index of the node in the parent.
 * @param parent - The parent node in the AST (either Root or Element).
 * @param file - The VFile associated with the AST, used for location information. If provided, it will be used to extract the original text of the tag.
 * @param props - Additional properties to add to the element node.
 */
function handleTag(
  type: string,
  node: Raw,
  index: number,
  parent: Root | Element,
  file?: VFile,
  props?: Properties
) {
  let i = index;
  while (i < parent.children.length && !isEndTag(parent.children[i], type)) {
    i++;
  }

  if (i === parent.children.length) {
    toast.error(
      `Missing closing </${type}> tag. This is a problem with the LLM response and cannot be recovered from.`
    );
    return;
  }

  const position = {
    start: node.position?.start,
    end: parent.children[i].position?.end,
  };
  let originalText;
  if (file && position) {
    const loc = location(file);
    originalText = file.value.slice(loc.toOffset(position.start), loc.toOffset(position.end));
  }

  parent.children.splice(index, i - index + 1, {
    type: 'element',
    tagName: type,
    properties: {
      ...props,
      text: originalText,
    },
    children: parent.children.slice(index + 1, i),
    position: position,
  } as ElementContent);
}

function isEndTag(el: RootContent | ElementContent, tag: string): boolean {
  return el.type === 'raw' && el.value.endsWith(`</${tag}>`);
}
