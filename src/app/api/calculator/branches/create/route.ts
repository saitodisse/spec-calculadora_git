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
    const { name, nodeId } = body;

    // Validação dos campos obrigatórios
    if (!name || !nodeId) {
      return NextResponse.json(
        {
          error: "VALIDATION_ERROR",
          message: "Campos obrigatórios: name, nodeId",
          details: {
            name: !name ? ["Nome da branch é obrigatório"] : [],
            nodeId: !nodeId ? ["ID do nó é obrigatório"] : [],
          },
        },
        { status: 400 }
      );
    }

    // Validação do nome da branch
    if (name.trim().length === 0) {
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

    // Verificar se o nó existe
    if (!historyData.nodes[nodeId]) {
      return NextResponse.json(
        { error: "NOT_FOUND", message: "Nó não encontrado" },
        { status: 404 }
      );
    }

    // Verificar se o nome já existe
    if (historyData.branches[name]) {
      return NextResponse.json(
        { error: "CONFLICT", message: "Nome de branch já existe" },
        { status: 409 }
      );
    }

    // Adicionar a nova branch
    const updatedBranches = {
      ...historyData.branches,
      [name]: nodeId,
    };

    const updatedHistoryData: HistoryTreeData = {
      ...historyData,
      branches: updatedBranches,
    };

    // Salvar no banco
    await prisma.historyTree.update({
      where: { userId: session.user.id },
      data: { data: updatedHistoryData as unknown as any },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Branch criada com sucesso",
        branch: {
          name: name,
          nodeId: nodeId,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating branch:", error);
    return NextResponse.json(
      { error: "INTERNAL_SERVER_ERROR", message: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
