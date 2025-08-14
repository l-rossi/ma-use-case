'use client';

import { useSelectedRegulationFragmentId } from '@/hooks/useSelectedRegulationFragment';
import { useAtoms } from '@/hooks/useAtoms';
import { useRules } from '@/hooks/useRules';
import { GraphCanvas, GraphEdge, GraphNode, lightTheme, Theme } from 'reagraph';
import { useHoveredAtom } from '@/hooks/useHoveredAtom';
import { useMemo } from 'react';

interface Props {
  className?: string;
}

const theme: Theme = {
  ...lightTheme,
  canvas: {
    ...lightTheme.canvas,
    background: '#f9fafb',
  },
};

// Helper function to extract predicate name from a predicate string
const extractPredicateName = (predicate: string): string => {
  const match = predicate.match(/^[a-z0-9_]+/);
  // We want the first match here, anything before ( starts
  return match ? match[0] : predicate;
};

const extractPredicates = (definition: string): string[] => {
  // TODO, quick primitive implementation, ignores "conjunctions" and negations, only for demo. TODO replace
  //  This will also extract Prolog atoms (not to be confused with our atoms)
  return Array.from(
    definition
      .split(':-')
      .at(-1)!
      .matchAll(/[a-z0-9_]+/g)
      .map(it => it[0])
  );
};

// A larger node size seems to reduce label overlap.
const NODE_SIZE = 50;

export function GraphVisualization({}: Readonly<Props>) {
  const [selectedFragmentId] = useSelectedRegulationFragmentId();

  const {
    data: atoms = [],
    // isPending: atomsLoading,
    // isError: atomsError,
  } = useAtoms(selectedFragmentId);
  const {
    data: rules = [],
    // isPending: rulesLoading,
    // isError: rulesError,
  } = useRules(selectedFragmentId);

  const atomNodes: GraphNode[] = useMemo(
    () =>
      atoms.map(it => {
        return {
          size: NODE_SIZE,
          id: it.id.toString(),
          label: it.predicate,
          fill: '#4299e1',
          data: {
            type: 'atom',
          },
        };
      }),
    [atoms]
  );

  const headPredicateToRuleNodes = useMemo(
    () =>
      rules.reduce<Record<string, GraphNode>>((acc, el) => {
        const head = el.definition.split(':-')[0].trim();
        return {
          ...acc,
          [head]: {
            size: NODE_SIZE,
            id: el.id.toString(),
            label: head,
            fill: '#ed64a6',
            data: {
              type: 'rule',
            },
          },
        };
      }, {}),
    [rules]
  );

  const headPredicateNameToRuleNodes = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(headPredicateToRuleNodes).map(([key, node]) => [
          extractPredicateName(key),
          node,
        ])
      ),
    [headPredicateToRuleNodes]
  );

  const atomPredicatesToNodeId = useMemo(
    () =>
      atomNodes.reduce<Record<string, string>>(
        (acc, node) =>
          node.label
            ? {
                ...acc,
                [extractPredicateName(node.label)]: node.id,
              }
            : acc,
        {}
      ),
    [atomNodes]
  );

  const rulesToAtoms: GraphEdge[] = useMemo(
    () =>
      rules.flatMap(rule => {
        const body = extractPredicates(rule.definition);
        return body
          .map(predicate => {
            const atomId = atomPredicatesToNodeId[predicate];
            return atomId
              ? {
                  id: `${rule.id}-${atomId}`,
                  source: headPredicateToRuleNodes[rule.definition.split(':-')[0].trim()].id,
                  target: atomId,
                }
              : null;
          })
          .filter(it => it !== null);
      }),
    [rules, atomPredicatesToNodeId, headPredicateToRuleNodes]
  );

  const rulesToRules: GraphEdge[] = useMemo(
    () =>
      rules
        .flatMap(rule => {
          const predicatesInBody = extractPredicates(rule.definition.split(':-').at(-1)!.trim());
          return predicatesInBody.map(predicate => {
            const target = headPredicateNameToRuleNodes[extractPredicateName(predicate)];
            if (!target) {
              return null;
            }

            return {
              id: `${rule.id}-${target.id}`,
              source: headPredicateToRuleNodes[rule.definition.split(':-')[0].trim()].id,
              target: target.id,
            };
          });
        })
        .filter(it => it !== null),
    [rules, headPredicateNameToRuleNodes, headPredicateToRuleNodes]
  );

  const nodes = useMemo(
    () => [...atomNodes, ...Object.values(headPredicateToRuleNodes)],
    [atomNodes, headPredicateToRuleNodes]
  );

  const edges = useMemo(() => [...rulesToAtoms, ...rulesToRules], [rulesToAtoms, rulesToRules]);

  const [, setHoveredAtomId] = useHoveredAtom();

  return (
    <div className="flex-1 overflow-hidden relative mask-x-from-95% mask-x-to-100% mask-y-from-95% mask-y-to-100%">
      <GraphCanvas
        theme={theme}
        nodes={nodes}
        edges={edges}
        // selections={selections}
        // actives={actives}
        // onNodeClick={onNodeClick}
        // onCanvasClick={onCanvasClick}
        layoutType="treeTd2d"
        onNodePointerOver={(node: GraphNode) => {
          if (node.data?.type === 'atom') {
            return setHoveredAtomId(parseInt(node.id));
          }
        }}
        onNodePointerOut={() => {
          return setHoveredAtomId(null);
        }}
        layoutOverrides={{
          type: 'treeTd2d',
          // linkDistance: 500,
          // nodeSeparation: 1e,
          // nodeStrength: 2e4,
          nodeLevelRatio: 2,
          nodeSeparation: 0.3,
          // nodeStrength: 1e5
        }}
        // labelType="all"
        // nodeLabelPosition="bottom"
        // edgeLabelPosition="above"
        // nodeColor={node => (node.data?.type === 'atom' ? '#4299e1' : '#ed64a6')}
        // edgeArrowPosition="end"
        renderNode={({ size, color, opacity, node }) => (
          <group>
            {/*{node.data.type === 'atom' && (*/}
            {/*  <lineSegments>*/}
            {/*    <edgesGeometry args={[new CircleGeometry(size)]} />*/}
            {/*    <lineBasicMaterial color={getHighlightColor(node.id)[active ? 1 : 0]} linewidth={4} />*/}
            {/*  </lineSegments>*/}
            {/*)}*/}
            <mesh>
              {node.data.type === 'atom' ? (
                <sphereGeometry args={[size, 32, 32]} />
              ) : (
                <boxGeometry args={[2 * size, 2 * size, 0]} />
              )}
              <meshBasicMaterial attach="material" color={color} opacity={opacity} transparent />
            </mesh>
          </group>
        )}
      />
    </div>
  );
}
