# GESTÃO 360 | Sistema de Gestão Administrativa e Controle de Obrigações (Multiempresas)

> Solução administrativa multiempresas desenvolvida em **Astro**, responsiva, segura e com controle preventivo de obrigações legais, prontuários funcionais, EPIs, biblioteca de procedimentos e fluxo de tarefas rotineiras com dados mocados completos.

---

## 📌 Escopo e Objetivos Atendidos (Memorial Descritivo)

1. **Operação Multiempresas Nativa (Item 2)**
   - Suporte inicial a duas empresas: **Empresa A (Alpha Engenharia)** e **Empresa B (Beta Logística)** com isolamento lógico de registros (`empresaId`).
   - Seletor de empresa ativa no topo com suporte a **Visão Consolidada** para diretoria e gerência autorizada.
   - Segregação de acesso estrita: usuários sem permissão em uma empresa são impedidos de visualizar seus dados.

2. **Perfis de Acesso & Simulador de Usuários (Item 3)**
   - Configuração para até 10 usuários individuais com papéis específicos (Diretoria, Gerente de DP/RH, SESMT/Segurança, Analistas Administrativos, Auditoria).
   - Simulador interativo no cabeçalho permitindo alternar de perfil em 1 clique para testar permissões.
   - Sinalização visual com semáforo: **Verde** (Regular/Concluído), **Amarelo** (Atenção/Em Renovação) e **Vermelho** (Atrasado/Urgente/A Iniciar).
   - Painel com tarefas do dia e conclusão direta de atividades rotineiras sem aprovação.

3. **Departamento Pessoal & Ocorrências (Item 4)**
   - Prontuário e acompanhamento de colaboradores com controle de férias (limite legal), exames ocupacionais (ASO admissional, periódico e validade) e treinamentos de NRs.
   - Livro interno de ocorrências disciplinares (atrasos, faltas, ausência de ponto biométrico e descumprimento de EPI).
   - Acesso restrito ao DP e Diretoria com bloqueio visual para outros perfis.

4. **Controle de EPIs & Fichas de Custódia (Item 5)**
   - Controle separado de validade do **CA (Certificado de Aprovação do MTE)** vs validade/vida útil do equipamento.
   - Rastreamento de histórico de movimentações: entrega inicial, devolução, troca por desgaste, registro de dano e extravio.
   - Alertas preventivos automáticos.

5. **Documentos e Procedimentos (Item 6)**
   - Biblioteca de POPs, ITs e Manuais por departamento e empresa com identificação da versão oficial vigente.
   - Priorização de metadados e links diretos para Google Drive e servidores corporativos.

6. **Controle Preventivo de Vencimentos & Renovações Cíclicas (Item 7)**
   - Gestão de AVCB, Alvarás de Funcionamento, Certificados Digitais, Licenças Ambientais, Certidões (CND) e Contratos.
   - Antecedência de aviso configurável (ex: 45 dias antes).
   - **Fluxo automatizado**: ao homologar a renovação, arquiva o ciclo anterior no histórico e gera automaticamente o próximo ciclo com a nova validade.

7. **Gestão de Tarefas & Trilha de Auditoria (Item 8)**
   - Checklist de rotina operacional com conclusão direta em 1 clique.
   - Trilha de auditoria em tempo real registrando usuário, timestamp, módulo e detalhes de cada alteração.

8. **Proposta Técnica & Comercial (Item 11)**
   - Seção dedicada e formatada para impressão/PDF apresentando a proposta formal com preços de implantação, mensalidade para 10 usuários, custos de expansão e políticas de backup/SLA.

---

## 🛠️ Tecnologias Utilizadas

- **Framework**: [Astro v7+](https://astro.build) (Arquitetura moderna baseada em componentes, zero overhead e alto desempenho)
- **Linguagem**: TypeScript / JavaScript Vanilla
- **Estilização**: CSS Vanilla com Design System executivo (Glassmorphism, Modo Escuro Profissional, Semáforo Visual e Responsividade Mobile)
- **Persistência**: LocalStorage Client-Side (as ações realizadas na interface persistem localmente no navegador)
- **Exportação**: Geração de relatórios em CSV compatíveis com Excel e suporte a impressão/PDF

---

## 🚀 Como Executar Localmente

### Pré-requisitos
- Node.js versão 20 ou superior
- npm versão 10 ou superior

### Passos

```bash
# 1. Instalar as dependências
npm install

# 2. Iniciar o servidor de desenvolvimento
npm run dev

# 3. Acessar a aplicação no navegador
# Abra http://localhost:4321
```

### Comandos Úteis

| Comando | Descrição |
| :--- | :--- |
| `npm run dev` | Inicia o servidor local de desenvolvimento |
| `npm run build` | Compila o projeto estático na pasta `./dist/` |
| `npm run preview` | Executa o preview do bundle compilado |

---

## 📄 Licença e Propriedade

Desenvolvido para atender à solicitação de proposta técnica e comercial do Memorial Descritivo de Sistema de Gestão Administrativa e Controle de Obrigações.
