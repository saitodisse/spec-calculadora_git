import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { HistoryTreeData } from "@/types/calculator";

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "UNAUTHORIZED", message: "Usuário não autenticado" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name } = body;

    // Validação do campo obrigatório
    if (!name) {
      return NextResponse.json(
        {
          error: "VALIDATION_ERROR",
          message: "Campo obrigatório: name",
          details: {
            name: ["Nome da branch é obrigatório"],
          },
        },
        { status: 400 }
      );
    }

    // Buscar histórico do usuário
    const historyTree = await prisma.historyTree.findUnique({
      where: { userId: session.user.id },
    });

    if (!historyTree) {
      return NextResponse.json(
        { error: "NOT_FOUND", message: "Histórico não encontrado" },
        { status: 404 }
      );
    }

    const historyData = historyTree.data as unknown as HistoryTreeData;

    // Verificar se a branch existe
    if (!historyData.branches[name]) {
      return NextResponse.json(
        { error: "NOT_FOUND", message: "Branch não encontrada" },
        { status: 404 }
      );
    }

    // Remover a branch
    const updatedBranches = { ...historyData.branches };
    delete updatedBranches[name];

    const updatedHistoryData: HistoryTreeData = {
      ...historyData,
      branches: updatedBranches,
    };

    // Salvar no banco
    await prisma.historyTree.update({
      where: { userId: session.user.id },
      data: { data: updatedHistoryData as unknown as any },
    });

    return NextResponse.json({
      success: true,
      message: "Branch deletada com sucesso",
    });
  } catch (error) {
    console.error("Error deleting branch:", error);
    return NextResponse.json(
      { error: "INTERNAL_SERVER_ERROR", message: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
