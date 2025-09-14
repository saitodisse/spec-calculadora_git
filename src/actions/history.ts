"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { HistoryTreeData } from "@/types/calculator"

export async function getHistory(): Promise<HistoryTreeData | null> {
  const session = await auth()
  
  if (!session?.user?.id) {
    return null
  }

  try {
    const historyTree = await prisma.historyTree.findUnique({
      where: {
        userId: session.user.id
      }
    })

    if (!historyTree) {
      // Return default empty history tree
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

    return historyTree.data as unknown as HistoryTreeData
  } catch (error) {
    console.error('Error getting history:', error)
    return null
  }
}

export async function saveHistory(tree: HistoryTreeData): Promise<void> {
  const session = await auth()
  
  if (!session?.user?.id) {
    throw new Error('User not authenticated')
  }

  try {
    await prisma.historyTree.upsert({
      where: {
        userId: session.user.id
      },
      update: {
        data: tree as unknown as any
      },
      create: {
        userId: session.user.id,
        data: tree as unknown as any
      }
    })
  } catch (error) {
    console.error('Error saving history:', error)
    throw new Error('Failed to save history')
  }
}
