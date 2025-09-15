"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { HistoryEntry, HistoryResponse } from "@/types/history";

export async function getHistory(limit: number = 20, offset: number = 0): Promise<HistoryResponse | null> {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  try {
    const [histories, total] = await Promise.all([
      prisma.history.findMany({
        where: {
          userId: session.user.id,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: limit,
        skip: offset,
      }),
      prisma.history.count({
        where: {
          userId: session.user.id,
        },
      }),
    ]);

    return {
      data: histories,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + histories.length < total,
      },
    };
  } catch (error) {
    console.error("Error getting history:", error);
    return null;
  }
}

export async function saveHistory(expression: string, result: string): Promise<HistoryEntry | null> {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("User not authenticated");
  }

  try {
    const historyEntry = await prisma.history.create({
      data: {
        userId: session.user.id,
        expression,
        result,
      },
    });

    return historyEntry;
  } catch (error) {
    console.error("Error saving history:", error);
    throw new Error("Failed to save history");
  }
}
