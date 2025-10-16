<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->
- [x] Verify that the copilot-instructions.md file in the .github directory is created.

- [x] Clarify Project Requirements
	<!-- Sistema de gerenciamento de salão de beleza com Next.js 14, TypeScript, Tailwind CSS, design glassmorphism, paleta roxo/rosa. -->

- [x] Scaffold the Project
	<!--
	Projeto Next.js criado com TypeScript, Tailwind CSS, ESLint e dependências instaladas.
	-->

- [x] Customize the Project
	<!--
	Dashboard criado com glassmorphism, componentes de UI, tipos TypeScript, sistema de cores e layout responsivo implementados.
	-->

- [x] Install Required Extensions
	<!-- Nenhuma extensão específica necessária para este projeto Next.js. -->

- [x] Compile the Project
	<!--
	Projeto compilado com sucesso. Todas as dependências instaladas e sem erros de build.
	-->

- [x] Create and Run Task
	<!--
	Task de desenvolvimento criada e executada. Servidor Next.js rodando em http://localhost:3000
	-->

- [x] Launch the Project
	<!--
	Projeto já está rodando em modo de desenvolvimento em http://localhost:3000
	-->

- [x] Ensure Documentation is Complete
	<!--
	README.md criado com informações completas do projeto e copilot-instructions.md atualizado.
	SESSÃO RELATÓRIOS IMPLEMENTADA: Sistema completo de analytics e relatórios com dashboard interativo, KPIs, métricas financeiras, operacionais e de clientes. Inclui RelatoriosPage.tsx (6 abas: dashboard geral, financeiro, operacional, clientes, marketing, personalizado), RelatoriosWidget.tsx (widget para dashboard principal), types/relatorios.ts (interfaces TypeScript completas) e ChartComponents.tsx (componentes reutilizáveis para gráficos). Integrado ao MainApp.tsx com roteamento completo.
	
	SISTEMA DE LOGIN CORRIGIDO: Problema de credenciais inválidas resolvido com melhorias no MultiLevelLogin.tsx. Adicionado sistema de debug, validação aprimorada, limpeza de localStorage, botões de preenchimento automático e interface melhorada para mostrar credenciais claramente. Credenciais funcionais: Super Admin (superadmin@agendusalao.com / SuperAdmin@2024), Salão Demo (admin@salao.com / admin123), Salão com Licença (admin@salao.com / admin123 + TEST-1234-ABCD-5678).
	
	SISTEMA DE REGISTRO E LICENÇAS IMPLEMENTADO: Sistema completo de gerenciamento de licenças com registro público, painel administrativo e integração total. Inclui:
	- PublicRegistrationForm.tsx: Formulário multi-step com validação (Empresa → Dados Pessoais → Plano → Confirmação)
	- PlanSelection.tsx: Interface para seleção de planos com 4 tiers de pricing (Starter R$49.90, Professional R$99.90, Premium R$199.90, Enterprise R$399.90)
	- AdminLicensePanel.tsx: Painel administrativo completo para aprovar/rejeitar registros, gerar licenças e gerenciar sistema
	- LicenseManagementApp.tsx: Integrador principal que controla fluxo entre login, registro e painel admin
	- types/license.ts: Sistema de tipos TypeScript completo com interfaces para UserRegistration, LicensePlan, SystemLicense e mock data
	- services/emailService.ts: Sistema de notificações por email para novos registros, aprovações e rejeições
	Integração completa no MainApp.tsx com fluxo: Login → (opção Cadastro) → Seleção de Planos → Admin Approval → Geração de Licenças
	-->

<!--

<!--
## Execution Guidelines
PROGRESS TRACKING:
- If any tools are available to manage the above todo list, use it to track progress through this checklist.
- After completing each step, mark it complete and add a summary.
- Read current todo list status before starting each new step.

COMMUNICATION RULES:
- Avoid verbose explanations or printing full command outputs.
- If a step is skipped, state that briefly (e.g. "No extensions needed").
- Do not explain project structure unless asked.
- Keep explanations concise and focused.

DEVELOPMENT RULES:
- Use '.' as the working directory unless user specifies otherwise.
- Avoid adding media or external links unless explicitly requested.
- Use placeholders only with a note that they should be replaced.
- Use VS Code API tool only for VS Code extension projects.
- Once the project is created, it is already opened in Visual Studio Code—do not suggest commands to open this project in Visual Studio again.
- If the project setup information has additional rules, follow them strictly.

FOLDER CREATION RULES:
- Always use the current directory as the project root.
- If you are running any terminal commands, use the '.' argument to ensure that the current working directory is used ALWAYS.
- Do not create a new folder unless the user explicitly requests it besides a .vscode folder for a tasks.json file.
- If any of the scaffolding commands mention that the folder name is not correct, let the user know to create a new folder with the correct name and then reopen it again in vscode.

EXTENSION INSTALLATION RULES:
- Only install extension specified by the get_project_setup_info tool. DO NOT INSTALL any other extensions.

PROJECT CONTENT RULES:
- If the user has not specified project details, assume they want a "Hello World" project as a starting point.
- Avoid adding links of any type (URLs, files, folders, etc.) or integrations that are not explicitly required.
- Avoid generating images, videos, or any other media files unless explicitly requested.
- If you need to use any media assets as placeholders, let the user know that these are placeholders and should be replaced with the actual assets later.
- Ensure all generated components serve a clear purpose within the user's requested workflow.
- If a feature is assumed but not confirmed, prompt the user for clarification before including it.
- If you are working on a VS Code extension, use the VS Code API tool with a query to find relevant VS Code API references and samples related to that query.

TASK COMPLETION RULES:
- Your task is complete when:
  - Project is successfully scaffolded and compiled without errors
  - copilot-instructions.md file in the .github directory exists in the project
  - README.md file exists and is up to date
  - User is provided with clear instructions to debug/launch the project

Before starting a new task in the above plan, update progress in the plan.
-->
- Work through each checklist item systematically.
- Keep communication concise and focused.
- Follow development best practices.