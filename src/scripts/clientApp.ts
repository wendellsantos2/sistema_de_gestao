import {
  EMPRESAS_MOCK,
  USUARIOS_MOCK,
  VENCIMENTOS_MOCK,
  FUNCIONARIOS_MOCK,
  OCORRENCIAS_MOCK,
  EPIS_MOCK,
  DOCUMENTOS_MOCK,
  TAREFAS_MOCK,
  LOGS_AUDITORIA_MOCK,
  type VencimentoObrigacao,
  type Ocorrencia,
  type EpiItem,
  type Tarefa,
  type LogAuditoria
} from '../data/mockData';

// Chave do LocalStorage para persistência de dados
const STORAGE_KEY = 'SISTEMA_GESTAO_360_STATE_V1';

class AppState {
  empresas = [...EMPRESAS_MOCK];
  usuarios = [...USUARIOS_MOCK];
  vencimentos: VencimentoObrigacao[] = [...VENCIMENTOS_MOCK];
  funcionarios = [...FUNCIONARIOS_MOCK];
  ocorrencias: Ocorrencia[] = [...OCORRENCIAS_MOCK];
  epis: EpiItem[] = [...EPIS_MOCK];
  documentos = [...DOCUMENTOS_MOCK];
  tarefas: Tarefa[] = [...TAREFAS_MOCK];
  logs: LogAuditoria[] = [...LOGS_AUDITORIA_MOCK];

  currentUserId: string = 'usr_1';
  currentEmpresaId: string = 'consolidada';
  currentTab: string = 'dashboard';
  currentDpSubtab: string = 'prontuarios';

  constructor() {
    this.loadFromStorage();
  }

  loadFromStorage() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        if (data.vencimentos) this.vencimentos = data.vencimentos;
        if (data.ocorrencias) this.ocorrencias = data.ocorrencias;
        if (data.epis) this.epis = data.epis;
        if (data.tarefas) this.tarefas = data.tarefas;
        if (data.logs) this.logs = data.logs;
        if (data.currentUserId) this.currentUserId = data.currentUserId;
        if (data.currentEmpresaId) this.currentEmpresaId = data.currentEmpresaId;
        if (data.currentTab) this.currentTab = data.currentTab;
      }
    } catch (e) {
      console.warn('Erro ao carregar dados do localStorage:', e);
    }
  }

  saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        vencimentos: this.vencimentos,
        ocorrencias: this.ocorrencias,
        epis: this.epis,
        tarefas: this.tarefas,
        logs: this.logs,
        currentUserId: this.currentUserId,
        currentEmpresaId: this.currentEmpresaId,
        currentTab: this.currentTab
      }));
    } catch (e) {
      console.warn('Erro ao salvar no localStorage:', e);
    }
  }

  getCurrentUser() {
    return this.usuarios.find(u => u.id === this.currentUserId) || this.usuarios[0];
  }

  addLog(modulo: string, acao: string, detalhe: string, empresaId = this.currentEmpresaId) {
    const user = this.getCurrentUser();
    const newLog: LogAuditoria = {
      id: 'log_' + Date.now(),
      empresaId: empresaId === 'consolidada' ? 'emp_a' : empresaId,
      usuarioNome: user.nome,
      dataHora: new Date().toISOString().replace('T', ' ').substring(0, 19),
      modulo,
      acao,
      detalhe
    };
    this.logs.unshift(newLog);
    this.saveToStorage();
  }
}

export const state = new AppState();

// Helpers de Formatação e Semáforo
export function getEmpresaBadge(empId: string): string {
  if (empId === 'emp_a') {
    return `<span class="badge-empresa emp_a">Empresa A</span>`;
  }
  return `<span class="badge-empresa emp_b">Empresa B</span>`;
}

export function getStatusBadge(situacao: string): string {
  switch (situacao) {
    case 'concluido':
    case 'regular':
    case 'valido':
      return `<span class="badge-status green">● Regular / Concluído</span>`;
    case 'em_andamento':
      return `<span class="badge-status yellow">▲ Em Andamento</span>`;
    case 'aguardando_terceiros':
      return `<span class="badge-status yellow">▲ Aguardando Terceiros</span>`;
    case 'atencao':
    case 'ca_vencendo':
      return `<span class="badge-status yellow">▲ Atenção</span>`;
    case 'vencido':
      return `<span class="badge-status red">■ Vencido</span>`;
    case 'a_iniciar':
      return `<span class="badge-status red">■ A Iniciar (Crítico)</span>`;
    case 'troca_necessaria':
      return `<span class="badge-status red">■ Troca Necessária</span>`;
    default:
      return `<span class="badge-status blue">${situacao}</span>`;
  }
}

export function formatDateBR(dateStr: string | null): string {
  if (!dateStr) return '-';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateStr;
}
