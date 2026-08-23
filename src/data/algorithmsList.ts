import type { ComponentType } from "react";
import { bubbleSort } from "../algorithms/sorting/bubbleSort";
import { insertionSort } from "../algorithms/sorting/insertionSort";
import { mergeSort } from "../algorithms/sorting/mergeSort";
import { selectionSort } from "../algorithms/sorting/selectionSort";
import { quickSort } from "../algorithms/sorting/quickSort";
import { heapSort } from "../algorithms/sorting/heapSort";
import { kadane } from "../algorithms/arrays/kadane";
import { binarySearch } from "../algorithms/searching/binarySearch";
import { linearSearch } from "../algorithms/searching/linearSearch";
import { linkedListOps } from "../algorithms/linkedList/linkedListOps";
import { reverseLinkedList } from "../algorithms/linkedList/reverseLinkedList";
import { bst } from "../algorithms/trees/bst";
import { bfs } from "../algorithms/graphs/bfs";
import { dfs } from "../algorithms/graphs/dfs";
import { dijkstra } from "../algorithms/graphs/dijkstra";
import { knapsack } from "../algorithms/dp/knapsack";
import { fibonacci } from "../algorithms/dp/fibonacci";
import { coinChange } from "../algorithms/dp/coinChange";
import { lcs } from "../algorithms/dp/lcs";
import { kmeans } from "../algorithms/ml/kmeans";
import { knn } from "../algorithms/ml/knn";
import { linearRegression } from "../algorithms/ml/linearRegression";
import { BubbleSortVisualizer } from "../visualizers/BubbleSortVisualizer";
import { InsertionSortVisualizer } from "../visualizers/InsertionSortVisualizer";
import { MergeSortVisualizer } from "../visualizers/MergeSortVisualizer";
import { SelectionSortVisualizer } from "../visualizers/SelectionSortVisualizer";
import { QuickSortVisualizer } from "../visualizers/QuickSortVisualizer";
import { HeapSortVisualizer } from "../visualizers/HeapSortVisualizer";
import { KadaneVisualizer } from "../visualizers/KadaneVisualizer";
import { BinarySearchVisualizer } from "../visualizers/BinarySearchVisualizer";
import { LinearSearchVisualizer } from "../visualizers/LinearSearchVisualizer";
import { LinkedListVisualizer } from "../visualizers/LinkedListVisualizer";
import { LinkedListReversalVisualizer } from "../visualizers/LinkedListReversalVisualizer";
import { BSTVisualizer } from "../visualizers/BSTVisualizer";
import { BFSVisualizer } from "../visualizers/BFSVisualizer";
import { DFSVisualizer } from "../visualizers/DFSVisualizer";
import { DijkstraVisualizer } from "../visualizers/DijkstraVisualizer";
import { KnapsackVisualizer } from "../visualizers/KnapsackVisualizer";
import { FibonacciVisualizer } from "../visualizers/FibonacciVisualizer";
import { CoinChangeVisualizer } from "../visualizers/CoinChangeVisualizer";
import { LCSVisualizer } from "../visualizers/LCSVisualizer";
import { KMeansVisualizer } from "../visualizers/KMeansVisualizer";
import { KNNVisualizer } from "../visualizers/KNNVisualizer";
import { LinearRegressionVisualizer } from "../visualizers/LinearRegressionVisualizer";
import type { AlgorithmMetadataBase } from "../types/algorithm";

export interface AlgorithmEntry {
  meta: AlgorithmMetadataBase;
  Visualizer: ComponentType;
  primitive: string;
}

export const ALGORITHMS: AlgorithmEntry[] = [
  { meta: bubbleSort, Visualizer: BubbleSortVisualizer, primitive: "1D array" },
  { meta: selectionSort, Visualizer: SelectionSortVisualizer, primitive: "1D array" },
  { meta: insertionSort, Visualizer: InsertionSortVisualizer, primitive: "1D array" },
  { meta: mergeSort, Visualizer: MergeSortVisualizer, primitive: "1D array" },
  { meta: quickSort, Visualizer: QuickSortVisualizer, primitive: "1D array" },
  { meta: heapSort, Visualizer: HeapSortVisualizer, primitive: "1D array" },
  { meta: kadane, Visualizer: KadaneVisualizer, primitive: "1D array" },
  { meta: binarySearch, Visualizer: BinarySearchVisualizer, primitive: "1D array" },
  { meta: linearSearch, Visualizer: LinearSearchVisualizer, primitive: "1D array" },
  { meta: linkedListOps, Visualizer: LinkedListVisualizer, primitive: "Node-and-arrow graph" },
  { meta: reverseLinkedList, Visualizer: LinkedListReversalVisualizer, primitive: "Node-and-arrow graph" },
  { meta: bst, Visualizer: BSTVisualizer, primitive: "Node-link tree" },
  { meta: bfs, Visualizer: BFSVisualizer, primitive: "Node-link graph" },
  { meta: dfs, Visualizer: DFSVisualizer, primitive: "Node-link graph" },
  { meta: dijkstra, Visualizer: DijkstraVisualizer, primitive: "Node-link graph" },
  { meta: knapsack, Visualizer: KnapsackVisualizer, primitive: "Grid / table" },
  { meta: fibonacci, Visualizer: FibonacciVisualizer, primitive: "Grid / table" },
  { meta: coinChange, Visualizer: CoinChangeVisualizer, primitive: "Grid / table" },
  { meta: lcs, Visualizer: LCSVisualizer, primitive: "Grid / table" },
  { meta: kmeans, Visualizer: KMeansVisualizer, primitive: "Coordinate plane" },
  { meta: knn, Visualizer: KNNVisualizer, primitive: "Coordinate plane" },
  { meta: linearRegression, Visualizer: LinearRegressionVisualizer, primitive: "Coordinate plane" },
];

export function getAlgorithm(id: string): AlgorithmEntry | undefined {
  return ALGORITHMS.find((a) => a.meta.id === id);
}