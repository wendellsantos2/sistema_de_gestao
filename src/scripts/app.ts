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
  PROPOSTA_COMERCIAL
} from '../data/mockData';

// Inicialização de estado reativo a partir de localStorage ou dados mockados
const STORAGE_KEY = 'SISTEMA_GESTAO_360_STATE_V1';

export function getInitialState() {
  if (typeof window === 'undefined') {
    return {
      empresas: EMPRESAS_MOCK,
      usuarios: USUARIOS_MOCK,
      vencimentos: VENCIMENTOS_MOCK,
      funcionarios: FUNCIONARIOS_MOCK,
      ocorrencias: OCORRENCIAS_MOCK,
      epis: EPIS_MOCK,
      documentos: DOCUMENTOS_MOCK,
      tarefas: TAREFAS_MOCK,
      logs: LOGS_AUDITORIA_MOCK,
      activeUser: USUARIOS_MOCK[0],
      activeEmpresaId: 'consolidada',
      activeTab: 'dashboard',
      filterStatus: 'todos',
      searchQuery: ''
    };
  }

  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      return {
        empresas: parsed.empresas || EMPRESAS_MOCK,
        usuarios: parsed.usuarios || USUARIOS_MOCK,
        vencimentos: parsed.vencimentos || VENCIMENTOS_MOCK,
        funcionarios: parsed.funcionarios || FUNCIONARIOS_MOCK,
        ocorrencias: parsed.ocorrencias || OCORRENCIAS_MOCK,
        epis: parsed.epis || EPIS_MOCK,
        documentos: parsed.documentos || DOCUMENTOS_MOCK,
        tarefas: parsed.tarefas || TAREFAS_MOCK,
        logs: parsed.logs || LOGS_AUDITORIA_MOCK,
        activeUser: parsed.activeUser || USUARIOS_MOCK[0],
        activeEmpresaId: parsed.activeEmpresaId || 'consolidada',
        activeTab: parsed.activeTab || 'dashboard',
        filterStatus: 'todos',
        searchQuery: ''
      };
    } catch (e) {
      console.warn('Erro ao restaurar cache do localStorage:', e);
    }
  }

  return {
    empresas: EMPRESAS_MOCK,
    usuarios: USUARIOS_MOCK,
    vencimentos: VENCIMENTOS_MOCK,
    funcionarios: FUNCIONARIOS_MOCK,
    ocorrencias: OCORRENCIAS_MOCK,
    epis: EPIS_MOCK,
    documentos: DOCUMENTOS_MOCK,
    tarefas: TAREFAS_MOCK,
    logs: LOGS_AUDITORIA_MOCK,
    activeUser: USUARIOS_MOCK[0],
    activeEmpresaId: 'consolidada',
    activeTab: 'dashboard',
    filterStatus: 'todos',
    searchQuery: ''
  };
}

export function saveState(state) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      empresas: state.empresas,
      usuarios: state.usuarios,
      vencimentos: state.vencimentos,
      funcionarios: state.funcionarios,
      ocorrencias: state.ocorrencias,
      epis: state.epis,
      documentos: state.documentos,
      tarefas: state.tarefas,
      logs: state.logs,
      activeUser: state.activeUser,
      activeEmpresaId: state.activeEmpresaId,
      activeTab: state.activeTab
    }));
  }
}
