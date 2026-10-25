import { state, getEmpresaBadge, getStatusBadge, formatDateBR } from './clientApp';

export function setupUI() {
  const sidebar = document.getElementById('mainSidebar');
  const userSelect = document.getElementById('userSimulatorSelect');
  const userAvatar = document.getElementById('userAvatarBadge');
  const companyBtns = document.querySelectorAll('.company-btn');
  const navItems = document.querySelectorAll('.nav-item');
  const views = document.querySelectorAll('.view-section');

  // 1. Atualizar Simulador de Usuário e Permissões Multiempresas
  function updateUserPermissions() {
    const user = state.getCurrentUser();
    if (!user) return;

    userAvatar.textContent = user.avatar;
    userSelect.value = user.id;

    // Verificar se o usuário tem permissão para visão consolidada
    const tabConsolidada = document.getElementById('tabEmpConsolidada');
    const tabEmpA = document.getElementById('tabEmpA');
    const tabEmpB = document.getElementById('tabEmpB');

    const canEmpA = user.empresasAutorizadas.includes('emp_a');
    const canEmpB = user.empresasAutorizadas.includes('emp_b');
    const canConsolidada = user.podeVisaoConsolidada && canEmpA && canEmpB;

    // Configurar estado dos botões de empresa
    if (tabConsolidada) {
      if (!canConsolidada) {
        tabConsolidada.classList.add('disabled');
        tabConsolidada.setAttribute('title', 'Usuário não tem autorização para visão consolidada');
      } else {
        tabConsolidada.classList.remove('disabled');
        tabConsolidada.setAttribute('title', 'Visão agregada de todas as empresas');
      }
    }

    if (tabEmpA) {
      if (!canEmpA) {
        tabEmpA.classList.add('disabled');
        tabEmpA.setAttribute('title', 'Usuário não tem acesso à Empresa A');
      } else {
        tabEmpA.classList.remove('disabled');
        tabEmpA.setAttribute('title', 'Empresa A - Alpha Engenharia');
      }
    }

    if (tabEmpB) {
      if (!canEmpB) {
        tabEmpB.classList.add('disabled');
        tabEmpB.setAttribute('title', 'Usuário não tem acesso à Empresa B');
      } else {
        tabEmpB.classList.remove('disabled');
        tabEmpB.setAttribute('title', 'Empresa B - Beta Logística');
      }
    }

    // Se a empresa ativa atual não for permitida, forçar para a permitida
    if (state.currentEmpresaId === 'consolidada' && !canConsolidada) {
      state.currentEmpresaId = canEmpA ? 'emp_a' : 'emp_b';
    } else if (state.currentEmpresaId === 'emp_a' && !canEmpA) {
      state.currentEmpresaId = 'emp_b';
    } else if (state.currentEmpresaId === 'emp_b' && !canEmpB) {
      state.currentEmpresaId = 'emp_a';
    }

    // Atualizar classe ativa dos botões de empresa
    companyBtns.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-empresa') === state.currentEmpresaId);
    });

    // Verificar restrição da aba de Ocorrências no DP (Item 4: restrito ao DP e Diretoria)
    const dpRestricaoAviso = document.getElementById('dpRestricaoAviso');
    const dpOcorrenciasPanel = document.getElementById('dpOcorrenciasPanel');
    const canAccessOcorrencias = user.perfil === 'diretoria' || user.perfil === 'gerente_dp';

    if (dpRestricaoAviso && dpOcorrenciasPanel) {
      if (canAccessOcorrencias) {
        dpRestricaoAviso.style.display = 'none';
        dpOcorrenciasPanel.style.display = 'flex';
      } else {
        dpRestricaoAviso.style.display = 'block';
        dpOcorrenciasPanel.style.display = 'none';
      }
    }

    renderAll();
  }

  // Listener para troca de usuário simulado
  userSelect?.addEventListener('change', (e) => {
    state.currentUserId = e.target.value;
    state.addLog('Segurança & Autenticação', 'Troca de Usuário Simulado', `Sessão alternada para ${state.getCurrentUser().nome} (${state.getCurrentUser().cargo})`);
    state.saveToStorage();
    updateUserPermissions();
  });

  // Listener para troca de empresa ativa
  companyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.classList.contains('disabled')) {
        alert('Acesso Restrito: Seu perfil de usuário não possui permissão para consultar os dados desta empresa.');
        return;
      }
      const empId = btn.getAttribute('data-empresa');
      if (empId) {
        state.currentEmpresaId = empId;
        companyBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.addLog('Navegação Multiempresas', 'Filtro de Empresa', `Visão alterada para: ${empId.toUpperCase()}`);
        state.saveToStorage();
        renderAll();
      }
    });
  });

  // Listener para navegação entre abas
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const tab = item.getAttribute('data-tab');
      if (tab) {
        switchTab(tab);
      }
    });
  });

  document.getElementById('btnOpenPropostaFooter')?.addEventListener('click', () => {
    switchTab('proposta');
  });

  function switchTab(tabName) {
    state.currentTab = tabName;
    navItems.forEach(n => n.classList.toggle('active', n.getAttribute('data-tab') === tabName));
    views.forEach(v => {
      v.style.display = v.id === `view-${tabName}` ? 'block' : 'none';
    });
    // Se no mobile, fecha a sidebar
    sidebar?.classList.remove('open');
    state.saveToStorage();
    renderAll();
  }

  // Mobile toggle sidebar
  document.getElementById('btnToggleMobileSidebar')?.addEventListener('click', () => {
    sidebar?.classList.toggle('open');
  });

  // DP Sub-tabs
  const subtabProntuarios = document.getElementById('subtabDpProntuarios');
  const subtabOcorrencias = document.getElementById('subtabDpOcorrencias');
  const dpProntuarios = document.getElementById('dpContentProntuarios');
  const dpOcorrencias = document.getElementById('dpContentOcorrencias');

  subtabProntuarios?.addEventListener('click', () => {
    state.currentDpSubtab = 'prontuarios';
    subtabProntuarios.classList.add('active-subtab');
    subtabProntuarios.style.background = 'var(--bg-surface-elevated)';
    subtabProntuarios.style.borderColor = 'var(--primary)';
    subtabOcorrencias.classList.remove('active-subtab');
    subtabOcorrencias.style.background = 'transparent';
    subtabOcorrencias.style.borderColor = 'var(--bg-card-border)';
    dpProntuarios.style.display = 'block';
    dpOcorrencias.style.display = 'none';
  });

  subtabOcorrencias?.addEventListener('click', () => {
    state.currentDpSubtab = 'ocorrencias';
    subtabOcorrencias.classList.add('active-subtab');
    subtabOcorrencias.style.background = 'var(--bg-surface-elevated)';
    subtabOcorrencias.style.borderColor = 'var(--primary)';
    subtabProntuarios.classList.remove('active-subtab');
    subtabProntuarios.style.background = 'transparent';
    subtabProntuarios.style.borderColor = 'var(--bg-card-border)';
    dpProntuarios.style.display = 'none';
    dpOcorrencias.style.display = 'block';
  });

  // Botões de navegação rápida
  document.getElementById('btnVerVencimentosUrgentes')?.addEventListener('click', () => switchTab('vencimentos'));
  document.getElementById('btnIrParaVencimentos')?.addEventListener('click', () => switchTab('vencimentos'));

  // Modais - Abertura e Fechamento
  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('open');
  }

  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('open');
  }

  document.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const modal = e.target.closest('.modal-overlay');
      if (modal) modal.classList.remove('open');
    });
  });

  // Fechar ao clicar fora
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.classList.remove('open');
    });
  });

  // Botões que abrem modais
  document.getElementById('btnQuickAdd')?.addEventListener('click', () => openModal('modalNovoVencimento'));
  document.getElementById('btnNovoVencimentoModal')?.addEventListener('click', () => openModal('modalNovoVencimento'));
  document.getElementById('btnNovaOcorrenciaModal')?.addEventListener('click', () => openModal('modalNovaOcorrencia'));
  document.getElementById('btnNovoEpiModal')?.addEventListener('click', () => openModal('modalNovoEpi'));
  document.getElementById('btnNovaTarefaRapida')?.addEventListener('click', () => openModal('modalNovaTarefa'));
  document.getElementById('btnNovaTarefaCompletaModal')?.addEventListener('click', () => openModal('modalNovaTarefa'));
  document.getElementById('btnNovoFuncionarioModal')?.addEventListener('click', () => {
    alert('Cadastrar Colaborador: Integração com folha e prontuário digital. Preencha na simulação de ocorrências ou tarefas.');
  });
  document.getElementById('btnNovoDocumentoModal')?.addEventListener('click', () => {
    alert('Cadastro de Documento/POP: Forneça o link oficial do Google Drive corporativo e versão para catalogação.');
  });

  // Formulário 1: Novo Vencimento
  document.getElementById('formNovoVencimento')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const vencimentoStr = fd.get('dataVencimento');
    const antecedencia = parseInt(fd.get('antecedenciaDias') || '45', 10);
    
    // Cálculo data prevista inicio (vencimento - antecedencia dias)
    const vencDate = new Date(vencimentoStr);
    const prevDate = new Date(vencDate);
    prevDate.setDate(prevDate.getDate() - antecedencia);
    const dataPrevistaInicio = prevDate.toISOString().split('T')[0];

    const novo = {
      id: 'venc_' + Date.now(),
      empresaId: fd.get('empresaId'),
      tipo: fd.get('tipo'),
      descricao: fd.get('descricao'),
      responsavel: fd.get('responsavel'),
      responsavelId: state.currentUserId,
      departamento: fd.get('departamento'),
      dataVencimento: vencimentoStr,
      antecedenciaDias: antecedencia,
      dataPrevistaInicio,
      dataEfetivaInicio: null,
      situacao: 'a_iniciar',
      orgaoEmissor: fd.get('orgaoEmissor') || 'Órgão Competente',
      numeroProtocolo: fd.get('numeroProtocolo') || 'PROT-' + Math.floor(1000 + Math.random() * 9000),
      observacoes: fd.get('observacoes') || '',
      linkDocumentoDrive: fd.get('linkDocumentoDrive') || 'https://drive.google.com',
      cicloAtual: 1,
      historicoRenovacoes: []
    };

    state.vencimentos.unshift(novo);
    state.addLog('Vencimentos & Renovações', 'Inclusão de Obrigação', `Cadastrada obrigação ${novo.tipo} para ${novo.empresaId.toUpperCase()}`);
    state.saveToStorage();
    closeModal('modalNovoVencimento');
    e.target.reset();
    renderAll();
    alert('Obrigação cadastrada com sucesso! Alerta de antecedência configurado.');
  });

  // Formulário 2: Renovar Ciclo de Obrigação (Item 7)
  document.getElementById('formRenovarCiclo')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const id = fd.get('vencimentoId');
    const item = state.vencimentos.find(v => v.id === id);
    if (!item) return;

    const novaValidade = fd.get('novaValidade');
    const custo = fd.get('custoOuTaxa') || 'Não informado';
    const responsavel = fd.get('responsavel');
    const observacoes = fd.get('observacoes');

    // Registrar no histórico de renovações
    item.historicoRenovacoes.push({
      ciclo: item.cicloAtual,
      concluidoEm: new Date().toISOString().split('T')[0],
      validadeAnterior: item.dataVencimento,
      novaValidade,
      responsavel,
      custoOuTaxa: custo
    });

    // Gerar automaticamente o próximo ciclo conforme Item 7 do Memorial!
    item.cicloAtual += 1;
    item.dataVencimento = novaValidade;
    
    // Recalcular data prevista de início do novo ciclo
    const nDate = new Date(novaValidade);
    const pDate = new Date(nDate);
    pDate.setDate(pDate.getDate() - item.antecedenciaDias);
    item.dataPrevistaInicio = pDate.toISOString().split('T')[0];
    item.dataEfetivaInicio = null;
    item.situacao = 'concluido'; // Marcado como concluído para o ciclo atual
    item.observacoes = `Ciclo ${item.cicloAtual} gerado automaticamente. ${observacoes}`;

    state.addLog('Vencimentos & Renovações', 'Renovação de Ciclo', `Obrigação ${item.tipo} renovada para ${formatDateBR(novaValidade)}. Ciclo ${item.cicloAtual} iniciado.`);
    state.saveToStorage();
    closeModal('modalRenovarCiclo');
    renderAll();
    alert(`Sucesso! Ciclo anterior arquivado com histórico e Ciclo ${item.cicloAtual} gerado automaticamente até ${formatDateBR(novaValidade)}!`);
  });

  // Formulário 3: Nova Ocorrência Disciplinar
  document.getElementById('formNovaOcorrencia')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const funcSelect = document.getElementById('ocorrenciaFuncionarioSelect');
    const selectedOpt = funcSelect.options[funcSelect.selectedIndex];
    const funcNome = selectedOpt ? selectedOpt.getAttribute('data-nome') : 'Colaborador';

    const nova = {
      id: 'oco_' + Date.now(),
      empresaId: fd.get('empresaId'),
      funcionarioId: fd.get('funcionarioId'),
      funcionarioNome: funcNome,
      data: fd.get('data'),
      categoria: fd.get('categoria'),
      descricao: fd.get('descricao'),
      justificativaFuncionario: fd.get('justificativa') || 'Não apresentada.',
      registradoPor: state.getCurrentUser().nome,
      registradoPorId: state.currentUserId,
      status: fd.get('status'),
      observacoesInternas: 'Registrado via sistema de gestão.'
    };

    state.ocorrencias.unshift(nova);
    state.addLog('Departamento Pessoal', 'Registro de Ocorrência', `Ocorrência disciplinar (${nova.categoria}) registrada para ${nova.funcionarioNome}`);
    state.saveToStorage();
    closeModal('modalNovaOcorrencia');
    e.target.reset();
    renderAll();
    alert('Ocorrência registrada no livro interno com acesso restrito a DP e Diretoria!');
  });

  // Formulário 4: Novo EPI / Movimentação
  document.getElementById('formNovoEpi')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const empId = fd.get('empresaId');
    const funcId = fd.get('funcionarioId');
    const func = state.funcionarios.find(f => f.id === funcId);

    const novo = {
      id: 'epi_' + Date.now(),
      empresaId: empId,
      nome: fd.get('nome'),
      tipoEquipamento: 'Equipamento de Proteção Individual',
      caNumero: fd.get('caNumero'),
      validadeCa: fd.get('validadeCa'),
      validadeEquipamento: 'Conforme manual do fabricante',
      proximaInspecao: new Date(Date.now() + 180 * 86400000).toISOString().split('T')[0],
      funcionarioVinculadoId: funcId,
      funcionarioNome: func ? func.nome : 'Colaborador',
      dataEntrega: fd.get('dataMovimentacao'),
      quantidadeEntregue: 1,
      situacao: 'regular',
      historicoMovimentacoes: [
        {
          data: fd.get('dataMovimentacao'),
          tipo: fd.get('tipoMovimentacao'),
          motivo: fd.get('motivo') || 'Fornecimento regular',
          responsavelEntrega: state.getCurrentUser().nome
        }
      ]
    };

    state.epis.unshift(novo);
    state.addLog('Controle de EPIs', 'Movimentação de EPI', `${novo.nome} (CA ${novo.caNumero}) entregue a ${novo.funcionarioNome}`);
    state.saveToStorage();
    closeModal('modalNovoEpi');
    e.target.reset();
    renderAll();
    alert('Movimentação de EPI registrada na ficha do colaborador com sucesso!');
  });

  // Formulário 5: Nova Tarefa
  document.getElementById('formNovaTarefa')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);

    const nova = {
      id: 'tar_' + Date.now(),
      empresaId: fd.get('empresaId'),
      departamento: fd.get('departamento'),
      titulo: fd.get('titulo'),
      descricao: fd.get('descricao') || '',
      responsavel: fd.get('responsavel'),
      responsavelId: state.currentUserId,
      prazo: fd.get('prazo'),
      prioridade: fd.get('prioridade'),
      situacao: 'pendente',
      eAtividadeRotineira: fd.get('eAtividadeRotineira') === 'true',
      dataCriacao: new Date().toISOString().split('T')[0]
    };

    state.tarefas.unshift(nova);
    state.addLog('Gestão de Tarefas', 'Criação de Tarefa', `Tarefa "${nova.titulo}" atribuída a ${nova.responsavel}`);
    state.saveToStorage();
    closeModal('modalNovaTarefa');
    e.target.reset();
    renderAll();
    alert('Tarefa cadastrada com sucesso!');
  });

  // Exportar Relatório em CSV (Item 9: Exportação de cadastros e dados em formatos utilizáveis)
  document.getElementById('btnExportData')?.addEventListener('click', () => {
    exportToCSV();
  });

  document.getElementById('btnPrintReport')?.addEventListener('click', () => {
    window.print();
  });

  // Filtros de Vencimentos
  document.getElementById('filterVencSearch')?.addEventListener('input', renderVencimentosTable);
  document.getElementById('filterVencSituacao')?.addEventListener('change', renderVencimentosTable);
  document.getElementById('filterVencTipo')?.addEventListener('change', renderVencimentosTable);

  // Iniciar
  updateUserPermissions();
  switchTab(state.currentTab);
}

// ================= RENDERIZADORES DE TABELAS & COMPONENTES =================

export function renderAll() {
  renderDashboard();
  renderVencimentosTable();
  renderDpTables();
  renderEpisTable();
  renderDocumentosTable();
  renderTarefasTable();
  renderLogsAuditoria();
  updateSidebarBadges();
}

function filterByCompany(items) {
  if (state.currentEmpresaId === 'consolidada') {
    const user = state.getCurrentUser();
    return items.filter(item => user.empresasAutorizadas.includes(item.empresaId));
  }
  return items.filter(item => item.empresaId === state.currentEmpresaId);
}

function updateSidebarBadges() {
  const venc = filterByCompany(state.vencimentos);
  const vencCriticos = venc.filter(v => v.situacao === 'vencido' || v.situacao === 'a_iniciar').length;
  const badgeVenc = document.getElementById('badgeVencimentos');
  if (badgeVenc) badgeVenc.textContent = vencCriticos.toString();

  const oco = filterByCompany(state.ocorrencias);
  const badgeDp = document.getElementById('badgeDp');
  if (badgeDp) badgeDp.textContent = oco.length.toString();

  const epis = filterByCompany(state.epis);
  const epiAlertas = epis.filter(e => e.situacao === 'ca_vencendo' || e.situacao === 'troca_necessaria').length;
  const badgeEpis = document.getElementById('badgeEpis');
  if (badgeEpis) badgeEpis.textContent = epiAlertas.toString();

  const tarefas = filterByCompany(state.tarefas);
  const tarefasPendentes = tarefas.filter(t => t.situacao !== 'concluida').length;
  const badgeTarefas = document.getElementById('badgeTarefas');
  if (badgeTarefas) badgeTarefas.textContent = tarefasPendentes.toString();
}

// 1. DASHBOARD
function renderDashboard() {
  const venc = filterByCompany(state.vencimentos);
  const tarefas = filterByCompany(state.tarefas);

  // Semáforo Visual Obrigatório
  const regulares = venc.filter(v => v.situacao === 'concluido').length;
  const emAndamentoOuAtencao = venc.filter(v => v.situacao === 'em_andamento' || v.situacao === 'aguardando_terceiros').length;
  const urgentes = venc.filter(v => v.situacao === 'vencido' || v.situacao === 'a_iniciar').length;
  const tarefasPendentes = tarefas.filter(t => t.situacao !== 'concluida').length;

  const kpiRegular = document.getElementById('kpiRegular');
  const kpiAtencao = document.getElementById('kpiAtencao');
  const kpiUrgente = document.getElementById('kpiUrgente');
  const kpiTarefas = document.getElementById('kpiTarefas');

  if (kpiRegular) kpiRegular.textContent = regulares.toString();
  if (kpiAtencao) kpiAtencao.textContent = emAndamentoOuAtencao.toString();
  if (kpiUrgente) kpiUrgente.textContent = urgentes.toString();
  if (kpiTarefas) kpiTarefas.textContent = tarefasPendentes.toString();

  // Tabela de Vencimentos no Dashboard (Top 4)
  const tbody = document.getElementById('dashVencimentosTableBody');
  if (tbody) {
    tbody.innerHTML = '';
    const sliceVenc = venc.slice(0, 4);
    if (sliceVenc.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:var(--text-dim);">Nenhuma obrigação vinculada para a empresa selecionada.</td></tr>`;
    } else {
      sliceVenc.forEach(v => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${getEmpresaBadge(v.empresaId)}</td>
          <td>
            <strong>${v.tipo}</strong>
            <div style="font-size:0.74rem; color:var(--text-muted);">${v.descricao}</div>
          </td>
          <td><strong style="color:#fff;">${formatDateBR(v.dataVencimento)}</strong></td>
          <td><span style="font-size:0.75rem; color:var(--text-muted);">${v.antecedenciaDias} dias antes</span></td>
          <td>${getStatusBadge(v.situacao)}</td>
          <td style="text-align:right;">
            <button class="action-btn-sm btn-dash-renovar" data-id="${v.id}">Tratar &rarr;</button>
          </td>
        `;
        tbody.appendChild(tr);
      });

      tbody.querySelectorAll('.btn-dash-renovar').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-id');
          abrirModalRenovacao(id);
        });
      });
    }
  }

  // Lista de Tarefas do Dia no Dashboard
  const taskList = document.getElementById('dashTaskList');
  if (taskList) {
    taskList.innerHTML = '';
    const sliceTarefas = tarefas.slice(0, 4);
    if (sliceTarefas.length === 0) {
      taskList.innerHTML = `<div style="text-align:center; color:var(--text-dim); padding:16px;">Sem tarefas registradas.</div>`;
    } else {
      sliceTarefas.forEach(t => {
        const isCompleted = t.situacao === 'concluida';
        const div = document.createElement('div');
        div.className = `task-item ${isCompleted ? 'completed' : ''}`;
        div.innerHTML = `
          <div class="task-left">
            <button type="button" class="task-checkbox ${isCompleted ? 'checked' : ''}" data-task-id="${t.id}" title="${t.eAtividadeRotineira ? 'Conclusão direta de atividade rotineira' : 'Concluir'}">
              ${isCompleted ? '✓' : ''}
            </button>
            <div class="task-details">
              <span class="task-title">${t.titulo}</span>
              <span class="task-sub">
                ${getEmpresaBadge(t.empresaId)} • Prazo: <strong>${formatDateBR(t.prazo)}</strong> • Resp: ${t.responsavel}
              </span>
            </div>
          </div>
          <div>
            ${t.prioridade === 'alta' ? '<span class="badge-status red">Alta</span>' : t.prioridade === 'media' ? '<span class="badge-status yellow">Média</span>' : '<span class="badge-status blue">Baixa</span>'}
          </div>
        `;
        taskList.appendChild(div);
      });

      taskList.querySelectorAll('.task-checkbox').forEach(chk => {
        chk.addEventListener('click', () => {
          const id = chk.getAttribute('data-task-id');
          toggleTaskStatus(id);
        });
      });
    }
  }
}

// 2. TABELA COMPLETA DE VENCIMENTOS
function renderVencimentosTable() {
  const tbody = document.getElementById('vencimentosFullTableBody');
  if (!tbody) return;

  const search = (document.getElementById('filterVencSearch')?.value || '').toLowerCase();
  const situacao = document.getElementById('filterVencSituacao')?.value || 'todas';
  const tipo = document.getElementById('filterVencTipo')?.value || 'todos';

  let list = filterByCompany(state.vencimentos);

  if (search) {
    list = list.filter(v => 
      v.tipo.toLowerCase().includes(search) || 
      v.descricao.toLowerCase().includes(search) ||
      v.orgaoEmissor.toLowerCase().includes(search) ||
      (v.numeroProtocolo && v.numeroProtocolo.toLowerCase().includes(search))
    );
  }

  if (situacao !== 'todas') {
    list = list.filter(v => v.situacao === situacao);
  }

  if (tipo !== 'todos') {
    list = list.filter(v => v.tipo.toLowerCase().includes(tipo.toLowerCase()));
  }

  tbody.innerHTML = '';
  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9" style="text-align:center; color:var(--text-dim); padding:20px;">Nenhum registro encontrado para os filtros selecionados.</td></tr>`;
    return;
  }

  list.forEach(v => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${getEmpresaBadge(v.empresaId)}</td>
      <td>
        <strong>${v.tipo}</strong>
        <div style="font-size:0.75rem; color:var(--text-muted);">${v.descricao}</div>
        <div style="font-size:0.72rem; color:var(--text-dim);">Órgão: ${v.orgaoEmissor} • Prot: ${v.numeroProtocolo || '-'}</div>
      </td>
      <td><span style="font-size:0.8rem; font-weight:600;">${v.responsavel}</span></td>
      <td><strong style="color:#fff;">${formatDateBR(v.dataVencimento)}</strong></td>
      <td><span style="font-size:0.78rem; color:var(--text-muted);">${v.antecedenciaDias} dias</span></td>
      <td><span style="font-size:0.78rem; color:#60a5fa;">${formatDateBR(v.dataPrevistaInicio)}</span></td>
      <td>${getStatusBadge(v.situacao)}</td>
      <td><span class="badge-status blue">Ciclo #${v.cicloAtual}</span></td>
      <td style="text-align:right; white-space:nowrap;">
        <button type="button" class="action-btn-sm btn-renovar-ciclo" data-id="${v.id}" style="color:#34d399; border-color:rgba(16,185,129,0.3);">
          ↻ Renovar Ciclo
        </button>
        <button type="button" class="action-btn-sm btn-avancar-situacao" data-id="${v.id}" title="Alternar status do fluxo">
          &rarr; Avançar
        </button>
        <button type="button" class="action-btn-sm btn-ver-historico" data-id="${v.id}" title="Ver histórico de ciclos anteriores">
          Logs
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  tbody.querySelectorAll('.btn-renovar-ciclo').forEach(btn => {
    btn.addEventListener('click', () => abrirModalRenovacao(btn.getAttribute('data-id')));
  });

  tbody.querySelectorAll('.btn-avancar-situacao').forEach(btn => {
    btn.addEventListener('click', () => avancarSituacaoVencimento(btn.getAttribute('data-id')));
  });

  tbody.querySelectorAll('.btn-ver-historico').forEach(btn => {
    btn.addEventListener('click', () => verHistoricoVencimento(btn.getAttribute('data-id')));
  });
}

function abrirModalRenovacao(id) {
  const item = state.vencimentos.find(v => v.id === id);
  if (!item) return;

  const modal = document.getElementById('modalRenovarCiclo');
  const inputId = document.getElementById('renovarVencimentoId');
  const nomeElem = document.getElementById('renovarObrigacaoNome');
  const valAtualElem = document.getElementById('renovarValidadeAtual');
  const cicloElem = document.getElementById('renovarCicloNum');
  const respInput = document.getElementById('renovarResponsavelInput');

  if (inputId) inputId.value = item.id;
  if (nomeElem) nomeElem.textContent = `${item.tipo} (${item.empresaId.toUpperCase()})`;
  if (valAtualElem) valAtualElem.textContent = formatDateBR(item.dataVencimento);
  if (cicloElem) cicloElem.textContent = item.cicloAtual.toString();
  if (respInput) respInput.value = state.getCurrentUser().nome;

  if (modal) modal.classList.add('open');
}

function avancarSituacaoVencimento(id) {
  const item = state.vencimentos.find(v => v.id === id);
  if (!item) return;

  const fluxo = ['a_iniciar', 'em_andamento', 'aguardando_terceiros', 'concluido'];
  let nextIdx = fluxo.indexOf(item.situacao) + 1;
  if (nextIdx >= fluxo.length || nextIdx === 0) nextIdx = 0;

  item.situacao = fluxo[nextIdx];
  if (item.situacao === 'em_andamento' && !item.dataEfetivaInicio) {
    item.dataEfetivaInicio = new Date().toISOString().split('T')[0];
  }

  state.addLog('Vencimentos & Renovações', 'Alteração de Status', `Situação de "${item.tipo}" alterada para "${item.situacao.replace('_', ' ').toUpperCase()}"`);
  state.saveToStorage();
  renderAll();
}

function verHistoricoVencimento(id) {
  const item = state.vencimentos.find(v => v.id === id);
  if (!item) return;

  const modal = document.getElementById('modalHistoricoDetalhes');
  const titulo = document.getElementById('modalHistoricoTitulo');
  const conteudo = document.getElementById('modalHistoricoConteudo');

  if (titulo) titulo.textContent = `Histórico de Ciclos: ${item.tipo}`;
  if (conteudo) {
    if (!item.historicoRenovacoes || item.historicoRenovacoes.length === 0) {
      conteudo.innerHTML = `
        <div style="background:var(--bg-surface-elevated); padding:16px; border-radius:var(--radius-md); text-align:center; color:var(--text-muted);">
          Este registro encontra-se em seu <strong>Ciclo Inicial (#1)</strong>. Nenhum ciclo anterior arquivado.
        </div>
      `;
    } else {
      conteudo.innerHTML = `
        <div style="display:flex; flex-direction:column; gap:12px;">
          ${item.historicoRenovacoes.map(h => `
            <div style="background:var(--bg-surface-elevated); padding:14px; border-radius:var(--radius-md); border-left:3px solid var(--status-green);">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                <strong style="color:#fff;">Ciclo #${h.ciclo} Concluído</strong>
                <span style="font-size:0.75rem; color:var(--text-dim);">${formatDateBR(h.concluidoEm)}</span>
              </div>
              <div style="font-size:0.8rem; color:var(--text-muted);">
                Validade Anterior: <strong>${formatDateBR(h.validadeAnterior)}</strong> &rarr; Nova Validade: <strong style="color:#34d399;">${formatDateBR(h.novaValidade)}</strong>
              </div>
              <div style="font-size:0.75rem; color:var(--text-dim); margin-top:4px;">
                Responsável: ${h.responsavel} • Custo/Taxa: ${h.custoOuTaxa || 'Sem custos'}
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }
  }

  if (modal) modal.classList.add('open');
}

// 3. TABELAS DO DP (Prontuários & Ocorrências)
function renderDpTables() {
  // Prontuários
  const tbodyFunc = document.getElementById('dpFuncionariosTableBody');
  if (tbodyFunc) {
    const list = filterByCompany(state.funcionarios);
    tbodyFunc.innerHTML = '';
    list.forEach(f => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${getEmpresaBadge(f.empresaId)}</td>
        <td>
          <strong>${f.nome}</strong>
          <div style="font-size:0.75rem; color:var(--text-muted);">${f.cargo} • CPF: ${f.cpfMascarado}</div>
        </td>
        <td><span style="font-size:0.8rem;">${f.departamento}</span></td>
        <td><span style="font-size:0.8rem;">${formatDateBR(f.dataAdmissao)}</span></td>
        <td>
          <div style="font-size:0.8rem; font-weight:600;">Saldo: ${f.proximasFerias.diasSaldo} dias</div>
          <div style="font-size:0.72rem; color:var(--text-dim);">Limite: ${formatDateBR(f.proximasFerias.limiteConcessao)}</div>
        </td>
        <td>
          <div>${f.aso.tipo} • <strong>${formatDateBR(f.aso.dataVencimento)}</strong></div>
          <div style="margin-top:2px;">${getStatusBadge(f.aso.situacao)}</div>
        </td>
        <td>
          <div style="font-size:0.74rem; color:var(--text-muted);">
            ${f.treinamentos.map(t => `<div>• ${t.nome}: <strong>${getStatusBadge(t.situacao)}</strong></div>`).join('')}
          </div>
        </td>
        <td>
          ${f.status === 'ativo' ? '<span class="badge-status green">Ativo</span>' : f.status === 'ferias' ? '<span class="badge-status yellow">Férias</span>' : '<span class="badge-status red">Afastado</span>'}
        </td>
      `;
      tbodyFunc.appendChild(tr);
    });
  }

  // Ocorrências Internas
  const tbodyOco = document.getElementById('dpOcorrenciasTableBody');
  if (tbodyOco) {
    const list = filterByCompany(state.ocorrencias);
    tbodyOco.innerHTML = '';
    if (list.length === 0) {
      tbodyOco.innerHTML = `<tr><td colspan="8" style="text-align:center; color:var(--text-dim); padding:16px;">Nenhuma ocorrência registrada.</td></tr>`;
      return;
    }
    list.forEach(o => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${formatDateBR(o.data)}</strong></td>
        <td>${getEmpresaBadge(o.empresaId)}</td>
        <td><strong style="color:#fff;">${o.funcionarioNome}</strong></td>
        <td><span class="badge-status yellow">${o.categoria}</span></td>
        <td style="max-width:280px; font-size:0.8rem; color:var(--text-muted);">${o.descricao}</td>
        <td style="max-width:240px; font-size:0.78rem; color:var(--text-dim);">${o.justificativaFuncionario}</td>
        <td><span style="font-size:0.75rem;">${o.registradoPor}</span></td>
        <td><span class="badge-status ${o.status.includes('Advertência') ? 'red' : 'green'}">${o.status}</span></td>
      `;
      tbodyOco.appendChild(tr);
    });
  }
}

// 4. TABELA DE EPIS
function renderEpisTable() {
  const tbody = document.getElementById('episTableBody');
  if (!tbody) return;

  const list = filterByCompany(state.epis);
  tbody.innerHTML = '';

  const caVencendo = list.filter(e => e.situacao === 'ca_vencendo').length;
  const trocaNecessaria = list.filter(e => e.situacao === 'troca_necessaria').length;
  const regulares = list.filter(e => e.situacao === 'regular').length;

  const kpiCa = document.getElementById('kpiEpiCaVencendo');
  const kpiTroca = document.getElementById('kpiEpiTrocaNecessaria');
  const kpiReg = document.getElementById('kpiEpiRegulares');

  if (kpiCa) kpiCa.textContent = caVencendo.toString();
  if (kpiTroca) kpiTroca.textContent = trocaNecessaria.toString();
  if (kpiReg) kpiReg.textContent = regulares.toString();

  list.forEach(e => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${getEmpresaBadge(e.empresaId)}</td>
      <td>
        <strong>${e.nome}</strong>
        <div style="font-size:0.74rem; color:var(--text-muted);">${e.tipoEquipamento}</div>
      </td>
      <td><span style="font-weight:600; color:#fff;">${e.funcionarioNome || 'Estoque Central'}</span></td>
      <td>
        <strong>CA: ${e.caNumero}</strong>
        <div style="font-size:0.72rem; color:var(--text-dim);">Validade: ${formatDateBR(e.validadeCa)}</div>
      </td>
      <td><span style="font-size:0.78rem;">${e.validadeEquipamento}</span></td>
      <td><span style="font-size:0.78rem; color:#60a5fa;">${formatDateBR(e.proximaInspecao)}</span></td>
      <td>${getStatusBadge(e.situacao)}</td>
      <td style="text-align:right;">
        <button type="button" class="action-btn-sm btn-ver-mov-epi" data-id="${e.id}">
          Movimentações (${e.historicoMovimentacoes.length})
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  tbody.querySelectorAll('.btn-ver-mov-epi').forEach(btn => {
    btn.addEventListener('click', () => verMovimentacoesEpi(btn.getAttribute('data-id')));
  });
}

function verMovimentacoesEpi(id) {
  const epi = state.epis.find(e => e.id === id);
  if (!epi) return;

  const modal = document.getElementById('modalHistoricoDetalhes');
  const titulo = document.getElementById('modalHistoricoTitulo');
  const conteudo = document.getElementById('modalHistoricoConteudo');

  if (titulo) titulo.textContent = `Ficha de Movimentação de EPI: ${epi.nome}`;
  if (conteudo) {
    conteudo.innerHTML = `
      <div style="margin-bottom:12px; background:var(--bg-surface-elevated); padding:12px; border-radius:var(--radius-md);">
        <div>Colaborador Custodiante: <strong>${epi.funcionarioNome}</strong> • CA MTE: <strong>${epi.caNumero}</strong></div>
        <div style="font-size:0.78rem; color:var(--text-muted); margin-top:2px;">Validade CA: ${formatDateBR(epi.validadeCa)} • Vida Útil: ${epi.validadeEquipamento}</div>
      </div>
      <div style="display:flex; flex-direction:column; gap:10px;">
        ${epi.historicoMovimentacoes.map(m => `
          <div style="background:var(--bg-surface-elevated); padding:12px; border-radius:var(--radius-md); border-left:3px solid var(--primary);">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <strong style="color:#fff;">${m.tipo}</strong>
              <span style="font-size:0.75rem; color:var(--text-dim);">${formatDateBR(m.data)}</span>
            </div>
            <div style="font-size:0.8rem; color:var(--text-muted); margin-top:3px;">${m.motivo}</div>
            <div style="font-size:0.72rem; color:var(--text-dim); margin-top:3px;">Responsável: ${m.responsavelEntrega}</div>
          </div>
        `).join('')}
      </div>
    `;
  }

  if (modal) modal.classList.add('open');
}

// 5. TABELA DE DOCUMENTOS
function renderDocumentosTable() {
  const tbody = document.getElementById('documentosTableBody');
  if (!tbody) return;

  const list = filterByCompany(state.documentos);
  tbody.innerHTML = '';

  list.forEach(d => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${getEmpresaBadge(d.empresaId)}</td>
      <td>
        <strong>${d.codigo}</strong>
        <div style="font-size:0.82rem; color:#fff;">${d.titulo}</div>
        <div style="font-size:0.74rem; color:var(--text-muted);">${d.descricaoBreve}</div>
      </td>
      <td><span style="font-size:0.8rem;">${d.departamento}</span></td>
      <td><span class="badge-status green">${d.versaoOficial}</span></td>
      <td><span style="font-size:0.8rem;">${d.responsavelElaboracao}</span></td>
      <td><span style="font-size:0.8rem;">${formatDateBR(d.dataUltimaRevisao)}</span></td>
      <td><span class="badge-status blue">${d.nivelAcesso}</span></td>
      <td style="text-align:right; white-space:nowrap;">
        <a href="${d.linkGoogleDriveOuServidor}" target="_blank" rel="noopener" class="action-btn-sm" style="color:#60a5fa; border-color:rgba(59,130,246,0.3); text-decoration:none;">
          Abrir no Drive ↗
        </a>
        <button type="button" class="action-btn-sm btn-ver-versoes-doc" data-id="${d.id}">
          Versões (${d.historicoVersoes.length})
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  tbody.querySelectorAll('.btn-ver-versoes-doc').forEach(btn => {
    btn.addEventListener('click', () => verVersoesDocumento(btn.getAttribute('data-id')));
  });
}

function verVersoesDocumento(id) {
  const doc = state.documentos.find(d => d.id === id);
  if (!doc) return;

  const modal = document.getElementById('modalHistoricoDetalhes');
  const titulo = document.getElementById('modalHistoricoTitulo');
  const conteudo = document.getElementById('modalHistoricoConteudo');

  if (titulo) titulo.textContent = `Rastreabilidade de Versões: ${doc.codigo}`;
  if (conteudo) {
    conteudo.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:10px;">
        ${doc.historicoVersoes.map(v => `
          <div style="background:var(--bg-surface-elevated); padding:12px; border-radius:var(--radius-md); border-left:3px solid var(--secondary);">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <strong style="color:#fff;">Versão Oficial: ${v.versao}</strong>
              <span style="font-size:0.75rem; color:var(--text-dim);">${formatDateBR(v.data)}</span>
            </div>
            <div style="font-size:0.8rem; color:var(--text-muted); margin-top:3px;">${v.resumoAlteracao}</div>
            <div style="font-size:0.72rem; color:var(--text-dim); margin-top:2px;">Autor da Revisão: ${v.autor}</div>
          </div>
        `).join('')}
      </div>
    `;
  }

  if (modal) modal.classList.add('open');
}

// 6. TABELA DE TAREFAS
function renderTarefasTable() {
  const listElem = document.getElementById('tarefasFullList');
  if (!listElem) return;

  const list = filterByCompany(state.tarefas);
  listElem.innerHTML = '';

  if (list.length === 0) {
    listElem.innerHTML = `<div style="text-align:center; color:var(--text-dim); padding:20px;">Nenhuma tarefa cadastrada para o filtro atual.</div>`;
    return;
  }

  list.forEach(t => {
    const isCompleted = t.situacao === 'concluida';
    const div = document.createElement('div');
    div.className = `task-item ${isCompleted ? 'completed' : ''}`;
    div.innerHTML = `
      <div class="task-left">
        <button type="button" class="task-checkbox ${isCompleted ? 'checked' : ''}" data-task-id="${t.id}" title="${t.eAtividadeRotineira ? 'Conclusão direta de rotina sem necessidade de aprovação superior' : 'Concluir atividade'}">
          ${isCompleted ? '✓' : ''}
        </button>
        <div class="task-details">
          <span class="task-title">${t.titulo}</span>
          <div style="font-size:0.75rem; color:var(--text-dim); margin-top:2px;">${t.descricao}</div>
          <span class="task-sub">
            ${getEmpresaBadge(t.empresaId)} • Depto: <strong>${t.departamento}</strong> • Prazo: <strong>${formatDateBR(t.prazo)}</strong> • Responsável: <strong>${t.responsavel}</strong>
          </span>
        </div>
      </div>
      <div style="display:flex; align-items:center; gap:8px;">
        ${t.eAtividadeRotineira ? '<span class="badge-status blue" style="font-size:0.68rem;">Rotineira</span>' : ''}
        ${t.prioridade === 'alta' ? '<span class="badge-status red">Alta</span>' : t.prioridade === 'media' ? '<span class="badge-status yellow">Média</span>' : '<span class="badge-status green">Baixa</span>'}
        <span class="badge-status ${isCompleted ? 'green' : 'yellow'}">${isCompleted ? 'Concluída' : 'Pendente'}</span>
      </div>
    `;
    listElem.appendChild(div);
  });

  listElem.querySelectorAll('.task-checkbox').forEach(chk => {
    chk.addEventListener('click', () => {
      const id = chk.getAttribute('data-task-id');
      toggleTaskStatus(id);
    });
  });
}

function toggleTaskStatus(id) {
  const task = state.tarefas.find(t => t.id === id);
  if (!task) return;

  task.situacao = task.situacao === 'concluida' ? 'pendente' : 'concluida';
  state.addLog('Gestão de Tarefas', 'Conclusão de Tarefa', `Tarefa "${task.titulo}" marcada como ${task.situacao.toUpperCase()}`);
  state.saveToStorage();
  renderAll();
}

// 7. LOGS DE AUDITORIA
function renderLogsAuditoria() {
  const tbody = document.getElementById('logsAuditoriaTableBody');
  if (!tbody) return;

  const list = filterByCompany(state.logs);
  tbody.innerHTML = '';

  list.slice(0, 10).forEach(l => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><span style="font-family:var(--font-mono); font-size:0.76rem; color:#60a5fa;">${l.dataHora}</span></td>
      <td>${getEmpresaBadge(l.empresaId)}</td>
      <td><strong style="color:#fff;">${l.usuarioNome}</strong></td>
      <td><span class="badge-status blue">${l.modulo}</span></td>
      <td><strong>${l.acao}</strong></td>
      <td style="font-size:0.8rem; color:var(--text-muted);">${l.detalhe}</td>
    `;
    tbody.appendChild(tr);
  });
}

// 8. EXPORTAÇÃO CSV
function exportToCSV() {
  const venc = filterByCompany(state.vencimentos);
  let csv = 'ID;Empresa;Tipo;Descricao;Responsavel;Vencimento;AntecedenciaDias;DataInicioPrevista;Situacao;Orgao;Protocolo;CicloAtual\n';

  venc.forEach(v => {
    csv += `"${v.id}";"${v.empresaId}";"${v.tipo}";"${v.descricao.replace(/"/g, '""')}";"${v.responsavel}";"${v.dataVencimento}";${v.antecedenciaDias};"${v.dataPrevistaInicio}";"${v.situacao}";"${v.orgaoEmissor}";"${v.numeroProtocolo || ''}";${v.cicloAtual}\n`;
  });

  const blob = new Blob(["\uFEFF" + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `relatorio_obrigacoes_${state.currentEmpresaId}_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  state.addLog('Segurança & Exportação', 'Download de Relatório', `Exportação de dados CSV da empresa ${state.currentEmpresaId.toUpperCase()}`);
}
