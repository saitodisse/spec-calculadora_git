import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { HistoryTreeData } from "@/types/calculator";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "UNAUTHORIZED", message: "Usuário não autenticado" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { oldName, newName, nodeId } = body;

    // Validação dos campos obrigatórios
    if (!oldName || !newName || !nodeId) {
      return NextResponse.json(
        {
          error: "VALIDATION_ERROR",
          message: "Campos obrigatórios: oldName, newName, nodeId",
          details: {
            oldName: !oldName ? ["Nome atual da branch é obrigatório"] : [],
            newName: !newName ? ["Novo nome da branch é obrigatório"] : [],
            nodeId: !nodeId ? ["ID do nó é obrigatório"] : [],
          },
        },
        { status: 400 }
      );
    }

    // Validação do nome da branch
    if (newName.trim().length === 0) {
      return NextResponse.json(
        {
          error: "VALIDATION_ERROR",
          message: "Nome da branch não pode ser vazio",
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
    if (!historyData.branches[oldName]) {
      return NextResponse.json(
        { error: "NOT_FOUND", message: "Branch não encontrada" },
        { status: 404 }
      );
    }

    // Verificar se o nó existe
    if (!historyData.nodes[nodeId]) {
      return NextResponse.json(
        { error: "NOT_FOUND", message: "Nó não encontrado" },
        { status: 404 }
      );
    }

    // Verificar se o novo nome já existe (exceto se for o mesmo nome)
    if (oldName !== newName && historyData.branches[newName]) {
      return NextResponse.json(
        { error: "CONFLICT", message: "Nome de branch já existe" },
        { status: 409 }
      );
    }

    // Verificar se a branch atual aponta para o nó correto
    if (historyData.branches[oldName] !== nodeId) {
      return NextResponse.json(
        { error: "CONFLICT", message: "Branch não aponta para o nó especificado" },
        { status: 409 }
      );
    }

    // Atualizar o histórico
    const updatedBranches = { ...historyData.branches };
    
    // Se o nome mudou, remover o nome antigo e adicionar o novo
    if (oldName !== newName) {
      delete updatedBranches[oldName];
      updatedBranches[newName] = nodeId;
    }

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
      message: "Branch renomeada com sucesso",
      branch: {
        name: newName,
        nodeId: nodeId,
      },
    });
  } catch (error) {
    console.error("Error renaming branch:", error);
    return NextResponse.json(
      { error: "INTERNAL_SERVER_ERROR", message: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
