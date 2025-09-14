import { HistoryTreeData, CalculationNode } from "@/types/calculator"

export class CalculatorCore {
  private historyTree: HistoryTreeData

  constructor(initialTree?: HistoryTreeData) {
    this.historyTree = initialTree || this.createDefaultTree()
  }

  private createDefaultTree(): HistoryTreeData {
    return {
      nodes: {
        root: {
          id: 'root',
          parentId: null,
          timestamp: Date.now(),
          expression: '0',
          result: 0
        }
      },
      head: 'root',
      branches: {}
    }
  }

  getState(): HistoryTreeData {
    return this.historyTree
  }

  getCurrentResult(): number {
    const headNode = this.historyTree.nodes[this.historyTree.head]
    return headNode ? headNode.result : 0
  }

  getCurrentExpression(): string {
    const headNode = this.historyTree.nodes[this.historyTree.head]
    return headNode ? headNode.expression : '0'
  }

  evaluateExpression(expression: string): HistoryTreeData {
    try {
      // Clean and validate expression
      const cleanExpression = this.cleanExpression(expression)
      const result = this.calculate(cleanExpression)
      
      // Create new node
      const newNodeId = this.generateNodeId()
      const newNode: CalculationNode = {
        id: newNodeId,
        parentId: this.historyTree.head,
        timestamp: Date.now(),
        expression: cleanExpression,
        result
      }

      // Update history tree
      const newTree: HistoryTreeData = {
        ...this.historyTree,
        nodes: {
          ...this.historyTree.nodes,
          [newNodeId]: newNode
        },
        head: newNodeId
      }

      this.historyTree = newTree
      return newTree
    } catch (error) {
      throw new Error(`Invalid expression: ${expression}`)
    }
  }

  checkout(nodeId: string): HistoryTreeData {
    if (!this.historyTree.nodes[nodeId]) {
      throw new Error(`Node ${nodeId} not found`)
    }

    const newTree: HistoryTreeData = {
      ...this.historyTree,
      head: nodeId
    }

    this.historyTree = newTree
    return newTree
  }

  createBranch(nodeId: string, branchName: string): HistoryTreeData {
    if (!this.historyTree.nodes[nodeId]) {
      throw new Error(`Node ${nodeId} not found`)
    }

    if (this.historyTree.branches[branchName]) {
      throw new Error(`Branch ${branchName} already exists`)
    }

    const newTree: HistoryTreeData = {
      ...this.historyTree,
      branches: {
        ...this.historyTree.branches,
        [branchName]: nodeId
      }
    }

    this.historyTree = newTree
    return newTree
  }

  private cleanExpression(expression: string): string {
    // Remove extra spaces and validate characters
    return expression.replace(/\s+/g, '').replace(/[^0-9+\-*/().]/g, '')
  }

  private calculate(expression: string): number {
    // Simple expression evaluator that handles basic arithmetic and parentheses
    // This is a simplified version - in production you might want to use a proper math parser
    
    try {
      // Replace common mathematical symbols
      let processedExpression = expression
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/\(/g, '(')
        .replace(/\)/g, ')')

      // Basic validation
      if (!this.isValidExpression(processedExpression)) {
        throw new Error('Invalid expression')
      }

      // Use Function constructor for safe evaluation
      // Note: In production, consider using a proper math expression parser
      const result = Function(`"use strict"; return (${processedExpression})`)()
      
      if (typeof result !== 'number' || !isFinite(result)) {
        throw new Error('Invalid result')
      }

      return result
    } catch (error) {
      throw new Error(`Calculation error: ${error}`)
    }
  }

  private isValidExpression(expression: string): boolean {
    // Basic validation for mathematical expressions
    const validChars = /^[0-9+\-*/().\s]+$/
    if (!validChars.test(expression)) {
      return false
    }

    // Check for balanced parentheses
    let parenCount = 0
    for (const char of expression) {
      if (char === '(') parenCount++
      if (char === ')') parenCount--
      if (parenCount < 0) return false
    }

    return parenCount === 0
  }

  private generateNodeId(): string {
    return `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  clear(): HistoryTreeData {
    this.historyTree = this.createDefaultTree()
    return this.historyTree
  }

  clearAll(): HistoryTreeData {
    this.historyTree = this.createDefaultTree()
    return this.historyTree
  }
}
