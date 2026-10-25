export interface Empresa {
  id: string;
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
  inscricaoEstadual: string;
  cidadeUf: string;
  responsavelPrincipal: string;
  corTag: string;
  ativa: boolean;
}

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  cargo: string;
  departamento: string;
  avatar: string;
  empresasAutorizadas: string[]; // ['emp_a', 'emp_b'] ou apenas ['emp_a']
  podeVisaoConsolidada: boolean;
  perfil: 'diretoria' | 'gerente_dp' | 'sesmt' | 'administrativo' | 'auditor';
}

export interface VencimentoObrigacao {
  id: string;
  empresaId: string;
  tipo: string; // 'AVCB', 'Alvará de Funcionamento', 'Certificado Digital', 'Licença Ambiental', 'CND', 'Contrato de Locação', etc.
  descricao: string;
  responsavel: string;
  responsavelId: string;
  departamento: string;
  dataVencimento: string; // YYYY-MM-DD
  antecedenciaDias: number; // ex: 45
  dataPrevistaInicio: string; // YYYY-MM-DD (calculado vencimento - antecedencia)
  dataEfetivaInicio: string | null;
  situacao: 'a_iniciar' | 'em_andamento' | 'aguardando_terceiros' | 'concluido' | 'vencido';
  orgaoEmissor: string;
  numeroProtocolo?: string;
  observacoes: string;
  linkDocumentoDrive: string;
  cicloAtual: number;
  historicoRenovacoes: {
    ciclo: number;
    concluidoEm: string;
    validadeAnterior: string;
    novaValidade: string;
    responsavel: string;
    custoOuTaxa?: string;
  }[];
}

export interface Funcionario {
  id: string;
  empresaId: string;
  nome: string;
  cargo: string;
  departamento: string;
  dataAdmissao: string;
  cpfMascarado: string;
  status: 'ativo' | 'ferias' | 'afastado';
  proximasFerias: {
    periodoAquisitivo: string;
    limiteConcessao: string;
    diasSaldo: number;
  };
  aso: {
    tipo: 'Admissional' | 'Periódico' | 'Mudança de Risco' | 'Retorno ao Trabalho';
    dataRealizacao: string;
    dataVencimento: string;
    situacao: 'valido' | 'atencao' | 'vencido';
    clinica: string;
  };
  integracao: {
    realizada: boolean;
    data: string;
    responsavel: string;
  };
  treinamentos: {
    nome: string;
    dataVencimento: string;
    situacao: 'valido' | 'atencao' | 'vencido';
  }[];
}

export interface Ocorrencia {
  id: string;
  empresaId: string;
  funcionarioId: string;
  funcionarioNome: string;
  data: string;
  categoria: 'Atraso' | 'Falta Não Justificada' | 'Ausência de Marcação de Ponto' | 'Descumprimento de Procedimento / EPI' | 'Outros';
  descricao: string;
  justificativaFuncionario: string;
  registradoPor: string;
  registradoPorId: string;
  status: 'Em Análise' | 'Justificado' | 'Advertência Verbal' | 'Advertência Escrita' | 'Arquivado';
  observacoesInternas: string;
}

export interface EpiItem {
  id: string;
  empresaId: string;
  nome: string;
  tipoEquipamento: string; // 'Capacete c/ Carneira', 'Óculos de Proteção UV', 'Calçado de Segurança com Biqueira', 'Protetor Auditivo tipo Concha', 'Luva de Vaqueta'
  caNumero: string;
  validadeCa: string; // YYYY-MM-DD
  validadeEquipamento: string; // Vida útil
  proximaInspecao: string;
  funcionarioVinculadoId?: string;
  funcionarioNome?: string;
  dataEntrega?: string;
  quantidadeEntregue?: number;
  situacao: 'regular' | 'ca_vencendo' | 'troca_necessaria' | 'devolvido';
  historicoMovimentacoes: {
    data: string;
    tipo: 'Entrega Inicial' | 'Devolução' | 'Troca por Desgaste' | 'Registro de Dano' | 'Perda / Extravio' | 'Substituição Programada';
    motivo: string;
    responsavelEntrega: string;
  }[];
}

export interface DocumentoProcedimento {
  id: string;
  empresaId: string;
  departamento: string;
  titulo: string;
  codigo: string; // Ex: POP-RH-002, IT-SEG-015
  versaoOficial: string; // Ex: v2.3
  responsavelElaboracao: string;
  dataUltimaRevisao: string;
  linkGoogleDriveOuServidor: string;
  descricaoBreve: string;
  nivelAcesso: 'Livre / Todos' | 'Restrito RH / DP' | 'Restrito SESMT' | 'Restrito Diretoria';
  historicoVersoes: {
    versao: string;
    data: string;
    autor: string;
    resumoAlteracao: string;
  }[];
}

export interface Tarefa {
  id: string;
  empresaId: string;
  departamento: string;
  titulo: string;
  descricao: string;
  responsavel: string;
  responsavelId: string;
  prazo: string;
  prioridade: 'alta' | 'media' | 'baixa';
  situacao: 'pendente' | 'em_andamento' | 'concluida' | 'cancelada';
  eAtividadeRotineira: boolean; // Conclusão direta sem aprovação
  dataCriacao: string;
}

export interface LogAuditoria {
  id: string;
  empresaId: string;
  usuarioNome: string;
  dataHora: string;
  acao: string;
  modulo: string;
  detalhe: string;
}

// ================= DADOS MOCADOS INICIAIS =================

export const EMPRESAS_MOCK: Empresa[] = [
  {
    id: 'emp_a',
    razaoSocial: 'Empresa A - Alpha Soluções em Engenharia & Serviços Ltda',
    nomeFantasia: 'Alpha Engenharia',
    cnpj: '14.283.940/0001-52',
    inscricaoEstadual: '112.449.002.110',
    cidadeUf: 'São Paulo/SP',
    responsavelPrincipal: 'Carlos Mendes',
    corTag: '#2563eb', // Blue
    ativa: true
  },
  {
    id: 'emp_b',
    razaoSocial: 'Empresa B - Beta Logística e Distribuição Especializada S/A',
    nomeFantasia: 'Beta Logística',
    cnpj: '28.194.839/0001-83',
    inscricaoEstadual: '334.829.119.008',
    cidadeUf: 'Campinas/SP',
    responsavelPrincipal: 'Carlos Mendes',
    corTag: '#059669', // Emerald
    ativa: true
  }
];

export const USUARIOS_MOCK: Usuario[] = [
  {
    id: 'usr_1',
    nome: 'Carlos Eduardo Mendes',
    email: 'carlos.mendes@grupoalpha.com.br',
    cargo: 'Diretor Geral Executivo',
    departamento: 'Diretoria Executiva',
    avatar: 'CM',
    empresasAutorizadas: ['emp_a', 'emp_b'],
    podeVisaoConsolidada: true,
    perfil: 'diretoria'
  },
  {
    id: 'usr_2',
    nome: 'Mariana Souza Prado',
    email: 'mariana.prado@grupoalpha.com.br',
    cargo: 'Gerente de RH & Departamento Pessoal',
    departamento: 'Departamento Pessoal',
    avatar: 'MP',
    empresasAutorizadas: ['emp_a', 'emp_b'],
    podeVisaoConsolidada: true,
    perfil: 'gerente_dp'
  },
  {
    id: 'usr_3',
    nome: 'Rodrigo Silveira Lima',
    email: 'rodrigo.lima@grupoalpha.com.br',
    cargo: 'Técnico em Segurança do Trabalho (SESMT)',
    departamento: 'SESMT / Segurança',
    avatar: 'RL',
    empresasAutorizadas: ['emp_a', 'emp_b'],
    podeVisaoConsolidada: true,
    perfil: 'sesmt'
  },
  {
    id: 'usr_4',
    nome: 'Camila Duarte Ramos',
    email: 'camila.ramos@alphaengenharia.com.br',
    cargo: 'Analista Administrativo Pleno',
    departamento: 'Administrativo',
    avatar: 'CR',
    empresasAutorizadas: ['emp_a'],
    podeVisaoConsolidada: false,
    perfil: 'administrativo'
  },
  {
    id: 'usr_5',
    nome: 'Felipe Albuquerque Silva',
    email: 'felipe.silva@betalogistica.com.br',
    cargo: 'Supervisor de Operações e Frotas',
    departamento: 'Operações / Logística',
    avatar: 'FA',
    empresasAutorizadas: ['emp_b'],
    podeVisaoConsolidada: false,
    perfil: 'administrativo'
  },
  {
    id: 'usr_6',
    nome: 'Juliana Costa Tavares',
    email: 'juliana.tavares@grupoalpha.com.br',
    cargo: 'Assistente de Departamento Pessoal',
    departamento: 'Departamento Pessoal',
    avatar: 'JT',
    empresasAutorizadas: ['emp_a', 'emp_b'],
    podeVisaoConsolidada: true,
    perfil: 'gerente_dp'
  },
  {
    id: 'usr_7',
    nome: 'Marcelo Vianna Neto',
    email: 'marcelo.vianna@grupoalpha.com.br',
    cargo: 'Coordenador Jurídico & Compliance',
    departamento: 'Jurídico / Compliance',
    avatar: 'MV',
    empresasAutorizadas: ['emp_a', 'emp_b'],
    podeVisaoConsolidada: true,
    perfil: 'administrativo'
  },
  {
    id: 'usr_8',
    nome: 'Beatriz Fonseca Dias',
    email: 'beatriz.fonseca@grupoalpha.com.br',
    cargo: 'Gestora Documental e Qualidade',
    departamento: 'Qualidade & Processos',
    avatar: 'BF',
    empresasAutorizadas: ['emp_a', 'emp_b'],
    podeVisaoConsolidada: true,
    perfil: 'administrativo'
  },
  {
    id: 'usr_9',
    nome: 'Ricardo Barreto Santos',
    email: 'ricardo.barreto@alphaengenharia.com.br',
    cargo: 'Auxiliar Administrativo de Suporte',
    departamento: 'Administrativo',
    avatar: 'RB',
    empresasAutorizadas: ['emp_a'],
    podeVisaoConsolidada: false,
    perfil: 'administrativo'
  },
  {
    id: 'usr_10',
    nome: 'Vanessa Guimarães Lins',
    email: 'vanessa.lins@consultoriaexterna.com.br',
    cargo: 'Auditora Governança & Riscos',
    departamento: 'Controladoria & Auditoria',
    avatar: 'VL',
    empresasAutorizadas: ['emp_a', 'emp_b'],
    podeVisaoConsolidada: true,
    perfil: 'auditor'
  }
];

export const VENCIMENTOS_MOCK: VencimentoObrigacao[] = [
  {
    id: 'venc_1',
    empresaId: 'emp_a',
    tipo: 'AVCB - Auto de Vistoria do Corpo de Bombeiros',
    descricao: 'Renovação do AVCB do Galpão Industrial e Sede Administrativa',
    responsavel: 'Rodrigo Silveira Lima (SESMT)',
    responsavelId: 'usr_3',
    departamento: 'SESMT / Segurança',
    dataVencimento: '2026-12-10',
    antecedenciaDias: 45,
    dataPrevistaInicio: '2026-10-26',
    dataEfetivaInicio: '2026-10-25',
    situacao: 'em_andamento',
    orgaoEmissor: 'Corpo de Bombeiros Militar do Estado de SP',
    numeroProtocolo: 'CB-2026-88194',
    observacoes: 'Engenheiro terceirizado realizou laudo de para-raios e teste de hidrantes. Projeto preventivo aprovado.',
    linkDocumentoDrive: 'https://drive.google.com/drive/folders/empresa-a-avcb-2026',
    cicloAtual: 3,
    historicoRenovacoes: [
      {
        ciclo: 2,
        concluidoEm: '2023-12-05',
        validadeAnterior: '2023-12-10',
        novaValidade: '2026-12-10',
        responsavel: 'Rodrigo Silveira Lima',
        custoOuTaxa: 'R$ 3.850,00'
      }
    ]
  },
  {
    id: 'venc_2',
    empresaId: 'emp_b',
    tipo: 'Alvará de Funcionamento e Localização',
    descricao: 'Renovação anual da licença de funcionamento municipal do centro logístico',
    responsavel: 'Marcelo Vianna Neto (Jurídico)',
    responsavelId: 'usr_7',
    departamento: 'Jurídico / Compliance',
    dataVencimento: '2026-11-15',
    antecedenciaDias: 30,
    dataPrevistaInicio: '2026-10-16',
    dataEfetivaInicio: '2026-10-18',
    situacao: 'aguardando_terceiros',
    orgaoEmissor: 'Secretaria Municipal de Urbanismo e Finanças de Campinas',
    numeroProtocolo: 'PMC-ALV-2026-5520',
    observacoes: 'Taxa municipal quitada. Aguardando emissão da certidão de zoneamento pelos auditores fiscais.',
    linkDocumentoDrive: 'https://drive.google.com/drive/folders/empresa-b-alvara-2026',
    cicloAtual: 4,
    historicoRenovacoes: [
      {
        ciclo: 3,
        concluidoEm: '2025-11-10',
        validadeAnterior: '2025-11-15',
        novaValidade: '2026-11-15',
        responsavel: 'Marcelo Vianna Neto',
        custoOuTaxa: 'R$ 1.420,00'
      }
    ]
  },
  {
    id: 'venc_3',
    empresaId: 'emp_a',
    tipo: 'Certificado Digital e-CNPJ A1',
    descricao: 'Certificado da Matriz para emissão de NF-e, DCTFWeb, e-Social e SPED',
    responsavel: 'Camila Duarte Ramos (Adm)',
    responsavelId: 'usr_4',
    departamento: 'Administrativo',
    dataVencimento: '2026-11-02',
    antecedenciaDias: 15,
    dataPrevistaInicio: '2026-10-18',
    dataEfetivaInicio: null,
    situacao: 'a_iniciar',
    orgaoEmissor: 'Certisign / ICP-Brasil',
    numeroProtocolo: 'PENDENTE',
    observacoes: 'URGENTE: Restam apenas 8 dias para o vencimento do token/arquivo A1. Agendar videoconferência com o diretor Carlos Mendes.',
    linkDocumentoDrive: 'https://drive.google.com/drive/folders/empresa-a-certificados',
    cicloAtual: 2,
    historicoRenovacoes: [
      {
        ciclo: 1,
        concluidoEm: '2025-10-30',
        validadeAnterior: '2025-11-02',
        novaValidade: '2026-11-02',
        responsavel: 'Camila Duarte Ramos',
        custoOuTaxa: 'R$ 225,00'
      }
    ]
  },
  {
    id: 'venc_4',
    empresaId: 'emp_b',
    tipo: 'Licença Ambiental de Operação (LO)',
    descricao: 'Licença Cetesb para armazenamento e movimentação de cargas químicas não perigosas',
    responsavel: 'Rodrigo Silveira Lima (SESMT)',
    responsavelId: 'usr_3',
    departamento: 'SESMT / Segurança',
    dataVencimento: '2027-01-20',
    antecedenciaDias: 60,
    dataPrevistaInicio: '2026-11-21',
    dataEfetivaInicio: null,
    situacao: 'a_iniciar',
    orgaoEmissor: 'CETESB - Companhia Ambiental do Estado de SP',
    numeroProtocolo: 'LO-SP-77189/22',
    observacoes: 'Monitoramento de efluentes sanitários e plano de gerenciamento de resíduos sólidos (PGRS) em dia.',
    linkDocumentoDrive: 'https://drive.google.com/drive/folders/empresa-b-licenca-cetesb',
    cicloAtual: 1,
    historicoRenovacoes: []
  },
  {
    id: 'venc_5',
    empresaId: 'emp_a',
    tipo: 'CND Conjunta Federal (PGFN / Receita Federal)',
    descricao: 'Certidão Negativa de Débitos Relativos a Créditos Tributários Federais e à Dívida Ativa da União',
    responsavel: 'Camila Duarte Ramos (Adm)',
    responsavelId: 'usr_4',
    departamento: 'Administrativo',
    dataVencimento: '2026-10-28',
    antecedenciaDias: 10,
    dataPrevistaInicio: '2026-10-18',
    dataEfetivaInicio: '2026-10-24',
    situacao: 'concluido',
    orgaoEmissor: 'Receita Federal do Brasil / PGFN',
    numeroProtocolo: 'CND-8829.1102.4419',
    observacoes: 'Certidão renovada via e-CAC com sucesso. Válida por 180 dias até 26/04/2027.',
    linkDocumentoDrive: 'https://drive.google.com/drive/folders/empresa-a-cnd-federal',
    cicloAtual: 6,
    historicoRenovacoes: [
      {
        ciclo: 5,
        concluidoEm: '2026-10-24',
        validadeAnterior: '2026-10-28',
        novaValidade: '2027-04-26',
        responsavel: 'Camila Duarte Ramos',
        custoOuTaxa: 'Gratuito'
      }
    ]
  },
  {
    id: 'venc_6',
    empresaId: 'emp_b',
    tipo: 'Apólice de Seguro Predial & Cargas',
    descricao: 'Seguro patrimonial das instalações físicas de armazenamento e frotas de transbordo',
    responsavel: 'Felipe Albuquerque (Operações)',
    responsavelId: 'usr_5',
    departamento: 'Operações / Logística',
    dataVencimento: '2026-10-20',
    antecedenciaDias: 20,
    dataPrevistaInicio: '2026-09-30',
    dataEfetivaInicio: '2026-10-15',
    situacao: 'em_andamento',
    orgaoEmissor: 'Porto Seguro Cia de Seguros',
    numeroProtocolo: 'PROP-SEG-99120',
    observacoes: 'ATENÇÃO: Vencido há 5 dias, porém com renovação em andamento sob termo de cobertura provisória da seguradora.',
    linkDocumentoDrive: 'https://drive.google.com/drive/folders/empresa-b-seguros',
    cicloAtual: 2,
    historicoRenovacoes: [
      {
        ciclo: 1,
        concluidoEm: '2025-10-18',
        validadeAnterior: '2025-10-20',
        novaValidade: '2026-10-20',
        responsavel: 'Felipe Albuquerque',
        custoOuTaxa: 'R$ 8.900,00'
      }
    ]
  },
  {
    id: 'venc_7',
    empresaId: 'emp_a',
    tipo: 'Contrato de Locação Galpão Administrativo',
    descricao: 'Contrato imobiliário trienal do imóvel sede com a Imobiliária Central',
    responsavel: 'Carlos Eduardo Mendes (Diretoria)',
    responsavelId: 'usr_1',
    departamento: 'Diretoria Executiva',
    dataVencimento: '2026-12-31',
    antecedenciaDias: 90,
    dataPrevistaInicio: '2026-10-02',
    dataEfetivaInicio: '2026-10-05',
    situacao: 'em_andamento',
    orgaoEmissor: 'Imobiliária Central & Participações SPE',
    numeroProtocolo: 'LOC-2023-SP-04',
    observacoes: 'Minuta de aditivo contratual com reajuste IPCA em análise no departamento jurídico.',
    linkDocumentoDrive: 'https://drive.google.com/drive/folders/empresa-a-contrato-locacao',
    cicloAtual: 1,
    historicoRenovacoes: []
  }
];

export const FUNCIONARIOS_MOCK: Funcionario[] = [
  {
    id: 'func_1',
    empresaId: 'emp_a',
    nome: 'João Pedro Carvalho',
    cargo: 'Eletricista de Manutenção Industrial',
    departamento: 'Manutenção / Engenharia',
    dataAdmissao: '2023-03-15',
    cpfMascarado: '334.***.***-82',
    status: 'ativo',
    proximasFerias: {
      periodoAquisitivo: '15/03/2025 a 14/03/2026',
      limiteConcessao: '2027-02-14',
      diasSaldo: 30
    },
    aso: {
      tipo: 'Periódico',
      dataRealizacao: '2025-11-20',
      dataVencimento: '2026-11-20',
      situacao: 'atencao',
      clinica: 'MedSeg Medicina Ocupacional'
    },
    integracao: {
      realizada: true,
      data: '2023-03-15',
      responsavel: 'Mariana Souza Prado'
    },
    treinamentos: [
      { nome: 'NR-10 Segurança em Instalações Elétricas', dataVencimento: '2026-12-05', situacao: 'valido' },
      { nome: 'NR-35 Trabalho em Altura', dataVencimento: '2026-11-10', situacao: 'atencao' },
      { nome: 'NR-06 Uso Correto e Guarda de EPIs', dataVencimento: '2027-03-15', situacao: 'valido' }
    ]
  },
  {
    id: 'func_2',
    empresaId: 'emp_a',
    nome: 'Ana Cláudia Ferreira',
    cargo: 'Engenheira de Planejamento de Obras',
    departamento: 'Engenharia Civil',
    dataAdmissao: '2022-08-01',
    cpfMascarado: '281.***.***-45',
    status: 'ativo',
    proximasFerias: {
      periodoAquisitivo: '01/08/2025 a 31/07/2026',
      limiteConcessao: '2027-06-30',
      diasSaldo: 20
    },
    aso: {
      tipo: 'Periódico',
      dataRealizacao: '2026-04-10',
      dataVencimento: '2027-04-10',
      situacao: 'valido',
      clinica: 'MedSeg Medicina Ocupacional'
    },
    integracao: {
      realizada: true,
      data: '2022-08-01',
      responsavel: 'Mariana Souza Prado'
    },
    treinamentos: [
      { nome: 'NR-18 Segurança na Indústria da Construção', dataVencimento: '2027-05-18', situacao: 'valido' },
      { nome: 'NR-06 Uso Correto de EPIs', dataVencimento: '2027-08-01', situacao: 'valido' }
    ]
  },
  {
    id: 'func_3',
    empresaId: 'emp_a',
    nome: 'Lucas Gabriel Martins',
    cargo: 'Soldador Montador Caldeiraria',
    departamento: 'Operações / Fábrica',
    dataAdmissao: '2024-01-10',
    cpfMascarado: '492.***.***-19',
    status: 'ativo',
    proximasFerias: {
      periodoAquisitivo: '10/01/2025 a 09/01/2026',
      limiteConcessao: '2026-12-09',
      diasSaldo: 30
    },
    aso: {
      tipo: 'Periódico',
      dataRealizacao: '2025-10-15',
      dataVencimento: '2026-10-15',
      situacao: 'vencido', // Vencido!
      clinica: 'MedSeg Medicina Ocupacional'
    },
    integracao: {
      realizada: true,
      data: '2024-01-10',
      responsavel: 'Rodrigo Silveira Lima'
    },
    treinamentos: [
      { nome: 'NR-33 Espaços Confinados', dataVencimento: '2026-10-12', situacao: 'vencido' },
      { nome: 'NR-35 Trabalho em Altura', dataVencimento: '2026-10-12', situacao: 'vencido' }
    ]
  },
  {
    id: 'func_4',
    empresaId: 'emp_b',
    nome: 'Roberto Carlos Silveira',
    cargo: 'Operador de Empilhadeira e Transpaleteira',
    departamento: 'Armazém / Logística',
    dataAdmissao: '2023-06-20',
    cpfMascarado: '109.***.***-63',
    status: 'ativo',
    proximasFerias: {
      periodoAquisitivo: '20/06/2025 a 19/06/2026',
      limiteConcessao: '2027-05-20',
      diasSaldo: 30
    },
    aso: {
      tipo: 'Periódico',
      dataRealizacao: '2026-06-18',
      dataVencimento: '2027-06-18',
      situacao: 'valido',
      clinica: 'Clinilife Saúde Ocupacional Campinas'
    },
    integracao: {
      realizada: true,
      data: '2023-06-20',
      responsavel: 'Felipe Albuquerque'
    },
    treinamentos: [
      { nome: 'NR-11 Transporte e Movimentação de Cargas', dataVencimento: '2027-06-20', situacao: 'valido' },
      { nome: 'Direção Defensiva em Pátio Fechado', dataVencimento: '2027-06-20', situacao: 'valido' }
    ]
  },
  {
    id: 'func_5',
    empresaId: 'emp_b',
    nome: 'Patrícia Nogueira Rocha',
    cargo: 'Conferente de Carga e Descarga',
    departamento: 'Expedição',
    dataAdmissao: '2024-04-02',
    cpfMascarado: '518.***.***-70',
    status: 'ferias',
    proximasFerias: {
      periodoAquisitivo: '02/04/2024 a 01/04/2025',
      limiteConcessao: '2026-03-02',
      diasSaldo: 0 // Em gozo
    },
    aso: {
      tipo: 'Periódico',
      dataRealizacao: '2026-04-01',
      dataVencimento: '2027-04-01',
      situacao: 'valido',
      clinica: 'Clinilife Saúde Ocupacional Campinas'
    },
    integracao: {
      realizada: true,
      data: '2024-04-02',
      responsavel: 'Mariana Souza Prado'
    },
    treinamentos: [
      { nome: 'NR-17 Ergonomia na Movimentação Manual', dataVencimento: '2027-04-02', situacao: 'valido' }
    ]
  },
  {
    id: 'func_6',
    empresaId: 'emp_b',
    nome: 'Danilo Henrique Santos',
    cargo: 'Motorista Rodoviário Carreteiro Categoria E',
    departamento: 'Transporte Rodoviário',
    dataAdmissao: '2022-11-14',
    cpfMascarado: '820.***.***-34',
    status: 'ativo',
    proximasFerias: {
      periodoAquisitivo: '14/11/2024 a 13/11/2025',
      limiteConcessao: '2026-10-14', // Limite prestes a vencer
      diasSaldo: 30
    },
    aso: {
      tipo: 'Periódico / Toxicológico',
      dataRealizacao: '2025-11-10',
      dataVencimento: '2026-11-10',
      situacao: 'atencao',
      clinica: 'Clinilife Saúde Ocupacional Campinas'
    },
    integracao: {
      realizada: true,
      data: '2022-11-14',
      responsavel: 'Felipe Albuquerque'
    },
    treinamentos: [
      { nome: 'MOPP - Movimentação Operacional de Produtos Perigosos', dataVencimento: '2027-02-15', situacao: 'valido' },
      { nome: 'NR-20 Segurança com Inflamáveis e Combustíveis', dataVencimento: '2026-11-15', situacao: 'atencao' }
    ]
  }
];

export const OCORRENCIAS_MOCK: Ocorrencia[] = [
  {
    id: 'oco_1',
    empresaId: 'emp_a',
    funcionarioId: 'func_3',
    funcionarioNome: 'Lucas Gabriel Martins',
    data: '2026-10-22',
    categoria: 'Descumprimento de Procedimento / EPI',
    descricao: 'Flagrado na área de caldeiraria operando esmerilhadeira sem o protetor facial de policarbonato e sem os óculos de proteção ampla visão.',
    justificativaFuncionario: 'Alegou que a máscara de proteção estava embaçada devido ao calor e pretendia realizar apenas um acabamento rápido de 2 minutos.',
    registradoPor: 'Rodrigo Silveira Lima (SESMT)',
    registradoPorId: 'usr_3',
    status: 'Advertência Escrita',
    observacoesInternas: 'Reincidência leve. Funcionário orientado formalmente sobre os riscos graves de projeção de partículas nos olhos conforme NR-06 e NR-18.'
  },
  {
    id: 'oco_2',
    empresaId: 'emp_b',
    funcionarioId: 'func_4',
    funcionarioNome: 'Roberto Carlos Silveira',
    data: '2026-10-24',
    categoria: 'Ausência de Marcação de Ponto',
    descricao: 'Não efetuou o registro de retorno do intervalo intrajornada (almoço) no relógio eletrônico de ponto biométrico da guarita B.',
    justificativaFuncionario: 'Esquecimento involuntário ao ser chamado com urgência para descarregar uma carreta que chegara com atraso.',
    registradoPor: 'Juliana Costa Tavares (DP)',
    registradoPorId: 'usr_6',
    status: 'Justificado',
    observacoesInternas: 'Supervisor Felipe Albuquerque atestou a presença física no armazém no horário citado. Inclusão manual autorizada no espelho do ponto.'
  },
  {
    id: 'oco_3',
    empresaId: 'emp_a',
    funcionarioId: 'func_1',
    funcionarioNome: 'João Pedro Carvalho',
    data: '2026-10-18',
    categoria: 'Atraso',
    descricao: 'Atraso de 1 hora e 25 minutos no início da jornada matinal sem aviso prévio à coordenação de manutenção.',
    justificativaFuncionario: 'Apresentou comprovante de paralisação temporária na Linha 9 da CPTM e lentidão no tráfego.',
    registradoPor: 'Mariana Souza Prado (RH)',
    registradoPorId: 'usr_2',
    status: 'Justificado',
    observacoesInternas: 'Atestado de perturbação de transporte público acolhido conforme política interna da Empresa A.'
  },
  {
    id: 'oco_4',
    empresaId: 'emp_b',
    funcionarioId: 'func_6',
    funcionarioNome: 'Danilo Henrique Santos',
    data: '2026-10-14',
    categoria: 'Falta Não Justificada',
    descricao: 'Ausência injustificada na escala de sábado para vistoria preventiva de tacógrafo da frota.',
    justificativaFuncionario: 'Não apresentou comprovante médico ou documental tempestivamente.',
    registradoPor: 'Felipe Albuquerque (Operações)',
    registradoPorId: 'usr_5',
    status: 'Advertência Verbal',
    observacoesInternas: 'Convocado para reunião de alinhamento com a gerência. Desconto em folha processado pelo DP.'
  }
];

export const EPIS_MOCK: EpiItem[] = [
  {
    id: 'epi_1',
    empresaId: 'emp_a',
    nome: 'Capacete de Segurança Classe B com Jugular',
    tipoEquipamento: 'Proteção para a Cabeça',
    caNumero: '35791',
    validadeCa: '2027-08-15',
    validadeEquipamento: '5 anos após fabricação',
    proximaInspecao: '2026-12-01',
    funcionarioVinculadoId: 'func_1',
    funcionarioNome: 'João Pedro Carvalho',
    dataEntrega: '2023-03-15',
    quantidadeEntregue: 1,
    situacao: 'regular',
    historicoMovimentacoes: [
      {
        data: '2023-03-15',
        tipo: 'Entrega Inicial',
        motivo: 'Admissão e integração no setor elétrico',
        responsavelEntrega: 'Rodrigo Silveira Lima (SESMT)'
      }
    ]
  },
  {
    id: 'epi_2',
    empresaId: 'emp_a',
    nome: 'Máscara Facial Inteira para Solda com Filtro Auto-Escurecimento',
    tipoEquipamento: 'Proteção Facial e Visual',
    caNumero: '41209',
    validadeCa: '2026-11-18', // CA Vencendo em breve!
    validadeEquipamento: '3 anos',
    proximaInspecao: '2026-11-05',
    funcionarioVinculadoId: 'func_3',
    funcionarioNome: 'Lucas Gabriel Martins',
    dataEntrega: '2024-01-10',
    quantidadeEntregue: 1,
    situacao: 'ca_vencendo',
    historicoMovimentacoes: [
      {
        data: '2024-01-10',
        tipo: 'Entrega Inicial',
        motivo: 'Fornecimento para bancada de soldagem',
        responsavelEntrega: 'Rodrigo Silveira Lima (SESMT)'
      },
      {
        data: '2024-08-14',
        tipo: 'Troca por Desgaste',
        motivo: 'Substituição das lentes acrílicas frontais anti-respingo',
        responsavelEntrega: 'Rodrigo Silveira Lima (SESMT)'
      }
    ]
  },
  {
    id: 'epi_3',
    empresaId: 'emp_a',
    nome: 'Botina de Segurança com Biqueira de Composite e Solado PU Bidensidade',
    tipoEquipamento: 'Proteção dos Membros Inferiores',
    caNumero: '28405',
    validadeCa: '2028-04-20',
    validadeEquipamento: '12 meses em uso severo',
    proximaInspecao: '2026-10-30',
    funcionarioVinculadoId: 'func_3',
    funcionarioNome: 'Lucas Gabriel Martins',
    dataEntrega: '2025-10-10',
    quantidadeEntregue: 1,
    situacao: 'troca_necessaria', // Completou 12 meses, necessita troca
    historicoMovimentacoes: [
      {
        data: '2025-10-10',
        tipo: 'Substituição Programada',
        motivo: 'Troca anual regulamentar por desgaste no piso de usinagem',
        responsavelEntrega: 'Rodrigo Silveira Lima (SESMT)'
      }
    ]
  },
  {
    id: 'epi_4',
    empresaId: 'emp_b',
    nome: 'Colete Refletivo Fluorescente de Alta Visibilidade Classe 2',
    tipoEquipamento: 'Sinalização e Alta Visibilidade',
    caNumero: 'Dispensado de CA (Norma NBR 15292)',
    validadeCa: '2030-01-01',
    validadeEquipamento: '2 anos',
    proximaInspecao: '2027-01-15',
    funcionarioVinculadoId: 'func_4',
    funcionarioNome: 'Roberto Carlos Silveira',
    dataEntrega: '2024-06-20',
    quantidadeEntregue: 2,
    situacao: 'regular',
    historicoMovimentacoes: [
      {
        data: '2024-06-20',
        tipo: 'Entrega Inicial',
        motivo: 'Trabalho no pátio de manobras de carretas',
        responsavelEntrega: 'Felipe Albuquerque (Operações)'
      }
    ]
  },
  {
    id: 'epi_5',
    empresaId: 'emp_b',
    nome: 'Protetor Auditivo tipo Concha Atenuação 24dB',
    tipoEquipamento: 'Proteção Auditiva',
    caNumero: '19714',
    validadeCa: '2027-10-02',
    validadeEquipamento: '2 anos com higienização periódica',
    proximaInspecao: '2026-11-20',
    funcionarioVinculadoId: 'func_4',
    funcionarioNome: 'Roberto Carlos Silveira',
    dataEntrega: '2024-01-05',
    quantidadeEntregue: 1,
    situacao: 'regular',
    historicoMovimentacoes: [
      {
        data: '2024-01-05',
        tipo: 'Entrega Inicial',
        motivo: 'Atenuação acústica em galpão com empilhadeiras a combustão',
        responsavelEntrega: 'Rodrigo Silveira Lima (SESMT)'
      }
    ]
  }
];

export const DOCUMENTOS_MOCK: DocumentoProcedimento[] = [
  {
    id: 'doc_1',
    empresaId: 'emp_a',
    departamento: 'SESMT / Segurança',
    titulo: 'PGR - Programa de Gerenciamento de Riscos Operacionais',
    codigo: 'PGR-ENG-2026-V3',
    versaoOficial: 'v3.1 (Oficial Vigente)',
    responsavelElaboracao: 'Rodrigo Silveira Lima (SESMT)',
    dataUltimaRevisao: '2026-02-15',
    linkGoogleDriveOuServidor: 'https://drive.google.com/file/d/pgr-empresa-a-2026-oficial/view',
    descricaoBreve: 'Inventário completo de riscos físicos, químicos, biológicos e ergonômicos da fábrica e matriz.',
    nivelAcesso: 'Livre / Todos',
    historicoVersoes: [
      { versao: 'v3.1', data: '2026-02-15', autor: 'Rodrigo Lima', resumoAlteracao: 'Revisão das fichas de espaço confinado e novas bancadas de usinagem.' },
      { versao: 'v3.0', data: '2025-01-20', autor: 'Rodrigo Lima', resumoAlteracao: 'Atualização anual obrigatória conforme NR-01.' }
    ]
  },
  {
    id: 'doc_2',
    empresaId: 'emp_a',
    departamento: 'Departamento Pessoal',
    titulo: 'POP 004 - Procedimento de Integração e Admissão de Novos Colaboradores',
    codigo: 'POP-DP-004',
    versaoOficial: 'v2.0 (Oficial Vigente)',
    responsavelElaboracao: 'Mariana Souza Prado (RH)',
    dataUltimaRevisao: '2026-05-10',
    linkGoogleDriveOuServidor: 'https://drive.google.com/file/d/pop-dp-admissao-v2/view',
    descricaoBreve: 'Checklist obrigatório de documentos, exames admissionais, entrega de kit de acolhimento e treinamento inicial.',
    nivelAcesso: 'Restrito RH / DP',
    historicoVersoes: [
      { versao: 'v2.0', data: '2026-05-10', autor: 'Mariana Prado', resumoAlteracao: 'Inclusão do protocolo digital de coleta de dados conforme LGPD.' }
    ]
  },
  {
    id: 'doc_3',
    empresaId: 'emp_b',
    departamento: 'Operações / Logística',
    titulo: 'Instrução de Trabalho IT 012 - Padrão de Carga, Descarga e Amarração Segura',
    codigo: 'IT-LOG-012',
    versaoOficial: 'v1.4 (Oficial Vigente)',
    responsavelElaboracao: 'Felipe Albuquerque (Operações)',
    dataUltimaRevisao: '2026-07-22',
    linkGoogleDriveOuServidor: 'https://drive.google.com/file/d/it-log-amarracao-cargas/view',
    descricaoBreve: 'Regras de segurança para travamento de carretas, calços pneumáticos e esteiras de roletes.',
    nivelAcesso: 'Livre / Todos',
    historicoVersoes: [
      { versao: 'v1.4', data: '2026-07-22', autor: 'Felipe Albuquerque', resumoAlteracao: 'Adequação à resolução CONTRAN sobre cintas de amarração sintéticas.' }
    ]
  },
  {
    id: 'doc_4',
    empresaId: 'emp_b',
    departamento: 'Jurídico / Compliance',
    titulo: 'Código de Conduta Ética, Integridade e Prevenção de Desvios',
    codigo: 'COD-COMP-2026',
    versaoOficial: 'v2.0 (Oficial Vigente)',
    responsavelElaboracao: 'Marcelo Vianna Neto (Jurídico)',
    dataUltimaRevisao: '2026-01-05',
    linkGoogleDriveOuServidor: 'https://drive.google.com/file/d/codigo-etica-grupo-2026/view',
    descricaoBreve: 'Diretrizes corporativas de integridade, canal de denúncias e proteção de dados confidenciais.',
    nivelAcesso: 'Livre / Todos',
    historicoVersoes: [
      { versao: 'v2.0', data: '2026-01-05', autor: 'Marcelo Vianna', resumoAlteracao: 'Capítulo sobre proteção de dados e privacidade LGPD ampliado.' }
    ]
  }
];

export const TAREFAS_MOCK: Tarefa[] = [
  {
    id: 'tar_1',
    empresaId: 'emp_a',
    departamento: 'Administrativo',
    titulo: 'Agendar videoconferência para renovação do Certificado Digital A1',
    descricao: 'Emitir novo e-CNPJ na Certisign com o diretor Carlos Mendes antes do vencimento em 02/11.',
    responsavel: 'Camila Duarte Ramos',
    responsavelId: 'usr_4',
    prazo: '2026-10-27',
    prioridade: 'alta',
    situacao: 'pendente',
    eAtividadeRotineira: true,
    dataCriacao: '2026-10-24'
  },
  {
    id: 'tar_2',
    empresaId: 'emp_a',
    departamento: 'SESMT / Segurança',
    titulo: 'Emitir ordem de compra para reposição de óculos ampla visão e protetor facial',
    descricao: 'Repor estoque de EPIs de proteção visual após ocorrência com soldador Lucas Martins.',
    responsavel: 'Rodrigo Silveira Lima',
    responsavelId: 'usr_3',
    prazo: '2026-10-28',
    prioridade: 'alta',
    situacao: 'em_andamento',
    eAtividadeRotineira: true,
    dataCriacao: '2026-10-23'
  },
  {
    id: 'tar_3',
    empresaId: 'emp_b',
    departamento: 'Departamento Pessoal',
    titulo: 'Convocação para agendamento de exame médico ASO periódico e toxicológico',
    descricao: 'Agendar clínica MedSeg para o motorista Danilo Henrique Santos (vencimento do ASO em 10/11).',
    responsavel: 'Juliana Costa Tavares',
    responsavelId: 'usr_6',
    prazo: '2026-10-29',
    prioridade: 'media',
    situacao: 'pendente',
    eAtividadeRotineira: true,
    dataCriacao: '2026-10-25'
  },
  {
    id: 'tar_4',
    empresaId: 'emp_b',
    departamento: 'Jurídico / Compliance',
    titulo: 'Cobrar protocolo de emissão do Alvará Municipal na Prefeitura de Campinas',
    descricao: 'Verificar status do parecer técnico do alvará de funcionamento no portal da prefeitura.',
    responsavel: 'Marcelo Vianna Neto',
    responsavelId: 'usr_7',
    prazo: '2026-10-30',
    prioridade: 'alta',
    situacao: 'em_andamento',
    eAtividadeRotineira: true,
    dataCriacao: '2026-10-20'
  },
  {
    id: 'tar_5',
    empresaId: 'emp_a',
    departamento: 'Administrativo',
    titulo: 'Download da nova CND Federal no portal e-CAC e arquivamento no Drive',
    descricao: 'Certidão Negativa emitida e validada. Salvar PDF na pasta oficial e notificar diretoria.',
    responsavel: 'Camila Duarte Ramos',
    responsavelId: 'usr_4',
    prazo: '2026-10-25',
    prioridade: 'baixa',
    situacao: 'concluida',
    eAtividadeRotineira: true,
    dataCriacao: '2026-10-24'
  }
];

export const LOGS_AUDITORIA_MOCK: LogAuditoria[] = [
  {
    id: 'log_1',
    empresaId: 'emp_a',
    usuarioNome: 'Camila Duarte Ramos',
    dataHora: '2026-10-24 16:45:10',
    modulo: 'Vencimentos & Renovações',
    acao: 'Conclusão e Registro de Novo Ciclo',
    detalhe: 'CND Federal renovada com sucesso para 26/04/2027. Ciclo anterior arquivado.'
  },
  {
    id: 'log_2',
    empresaId: 'emp_a',
    usuarioNome: 'Rodrigo Silveira Lima',
    dataHora: '2026-10-22 14:12:00',
    modulo: 'Ocorrências Internas',
    acao: 'Registro de Ocorrência Disciplinar',
    detalhe: 'Registrada advertência por falta de uso de EPI para o funcionário Lucas Gabriel Martins.'
  },
  {
    id: 'log_3',
    empresaId: 'emp_b',
    usuarioNome: 'Felipe Albuquerque',
    dataHora: '2026-10-20 09:30:25',
    modulo: 'Controle de EPIs',
    acao: 'Inspeção e Registro',
    detalhe: 'Vistoria em 14 conjuntos de coletes e botinas de segurança do pátio logístico.'
  },
  {
    id: 'log_4',
    empresaId: 'emp_a',
    usuarioNome: 'Mariana Souza Prado',
    dataHora: '2026-10-18 11:20:41',
    modulo: 'Departamento Pessoal',
    acao: 'Programação de Férias',
    detalhe: 'Programado período aquisitivo de férias da funcionária Patrícia Rocha.'
  }
];

// ================= DADOS DA PROPOSTA TÉCNICA E COMERCIAL =================

export const PROPOSTA_COMERCIAL = {
  titulo: 'Proposta Técnica & Comercial | Sistema de Gestão Administrativa e Controle de Obrigações',
  versao: 'Versão 1.0 - Resposta ao Memorial Descritivo',
  fornecedor: 'Solução Customizada sob Medida (Astro + SSR Híbrido + Arquitetura Segura)',
  dataEnvio: '25 de Outubro de 2026',
  validadeProposta: '30 dias',
  
  resumoExecutivo: 'A solução proposta contempla um sistema administrativo moderno, responsivo, seguro e intuitivo, operando com arquitetura multiempresas nativa para a Empresa A e Empresa B, com suporte a até 10 usuários simultâneos no lançamento e facilidade de expansão.',
  
  justificativaTecnologica: [
    {
      topico: 'Arquitetura Sob Medida vs Plataformas Low-Code Fechadas',
      detalhe: 'Optamos por desenvolvimento personalizado com base em Astro e padrões web abertos modernos. Ao contrário de plataformas low-code proprietárias (ex: PowerApps, Bubble), a empresa contratante não fica refém de reajustes abusivos de licença por assento em dólar nem de limitações de customização. O código é 100% dos contratantes.'
    },
    {
      topico: 'Desempenho Extremo e Custo de Nuvem Quase Zero',
      detalhe: 'O Astro gera páginas hiperotimizadas com baixíssimo consumo de memória e CPU. Pode ser hospedado em servidores VPS nacionais acessíveis ou instâncias Docker em nuvem (ex: AWS, Oracle Cloud ou Hostinger Corporativa) por frações do custo de um ERP tradicional.'
    },
    {
      topico: 'Segregação Lógica Estrita e Segurança LGPD',
      detalhe: 'Todos os registros (funcionários, EPIs, tarefas, documentos e vencimentos) possuem tenant isolation (empresaId). Um usuário vinculado exclusivamente à Empresa A é impedido pela camada lógica de visualizar ou modificar registros da Empresa B, preservando sigilo societário.'
    }
  ],

  tabelaPrecos: {
    fase1: {
      implantacao: {
        descricao: 'Setup, parametrização dos 10 usuários, migração/carga inicial dos dados das 2 empresas, customização de fluxos de renovação preventiva, treinamento da equipe e publicação em produção.',
        valorTotal: 'R$ 6.800,00',
        condicoes: '30% de entrada, 35% na homologação e 35% no go-live operacional'
      },
      mensalidade: {
        descricao: 'Suporte técnico nível 2/3, manutenção preventiva, monitoramento de disponibilidade, backups diários automatizados e hospedagem em nuvem de alta segurança.',
        valorTotal: 'R$ 580,00 / mês',
        incluso: 'Até 10 usuários individuais e as 2 empresas contratantes (Empresa A e B)'
      }
    },
    expansao: {
      usuarioAdicional: 'R$ 38,00 / usuário adicional por mês',
      empresaAdicional: 'R$ 190,00 / empresa adicional por mês (inclui parametrização e suporte)',
      personalizacoesFuturas: 'R$ 140,00 / hora técnica sob demanda'
    }
  },

  cronogramaImplantacao: [
    { semana: 'Semana 1', atividade: 'Alinhamento fino de regras, importação da base de funcionários e cadastro de usuários/perfis' },
    { semana: 'Semana 2', atividade: 'Cadastro das obrigações legais, AVCBs, alvarás, CAs de EPIs e parametrização de prazos de antecedência' },
    { semana: 'Semana 3', atividade: 'Treinamento prático de 4 horas para os 10 usuários (Diretoria, DP, SESMT e Administrativo) em ambiente de teste' },
    { semana: 'Semana 4', atividade: 'Entrada em operação assistida (Go-Live) e suporte intensivo de primeiro ciclo' }
  ],

  garantiasEPoliticas: {
    sla: 'SLA de 4 horas para incidentes críticos e 24 horas para dúvidas rotineiras de operação.',
    backup: 'Backups diários automatizados com retenção de 90 dias e replicação geográfica independente.',
    portabilidade: 'Sem vendor lock-in: a qualquer momento os dados podem ser exportados em CSV, JSON ou backup completo SQL sem custos adicionais de rescisão.'
  }
};
