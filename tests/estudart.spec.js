// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Estudart - Validações de SEO, Semântica e Metatags', () => {
  test('Deve conter título otimizado e meta tags essenciais para SEO', async ({ page }) => {
    await page.goto('/');

    // 1. Título e Descrição
    await expect(page).toHaveTitle(/Estudart \| Streaming Educacional/);
    
    const metaDesc = page.locator('meta[name="description"]');
    await expect(metaDesc).toHaveAttribute('content', /Aprenda rápido e com empatia cognitiva/);

    // 2. Open Graph
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', /Estudart/);
    await expect(page.locator('meta[property="og:type"]')).toHaveAttribute('content', 'website');

    // 3. Hierarquia Semântica
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBe(1);

    const h2Count = await page.locator('h2').count();
    expect(h2Count).toBeGreaterThanOrEqual(3);

    // 4. Schema.org JSON-LD
    const jsonLd = await page.locator('script[type="application/ld+json"]').textContent();
    expect(jsonLd).toContain('EducationalOrganization');
    expect(jsonLd).toContain('Estudart');
  });
});

test.describe('Estudart - Área do Assinante & Formulário de Cadastro', () => {
  test('Deve executar o fluxo completo de cadastro em 5 etapas', async ({ page }) => {
    await page.goto('/');

    // Aceitar diálogos/alertas
    page.on('dialog', async dialog => {
      expect(dialog.message()).toContain('Parabéns');
      await dialog.accept();
    });

    // 1. Abrir Modal de Matrícula
    const openBtn = page.locator('#openSubscriberModalBtn');
    await openBtn.click();

    const modal = page.locator('#subscriberModal');
    await expect(modal).toBeVisible();

    // 2. Etapa 1: Dados Pessoais
    await page.fill('#regName', 'Jorge Assinante Exemplo');
    await page.fill('#regEmail', 'jorge.estudos@estudart.com.br');
    await page.fill('#regPhone', '(11) 99887-6655');
    await page.fill('#regPassword', 'SenhaForte123!');
    await page.fill('#regPasswordConfirm', 'SenhaForte123!');

    // Verificar medidor de força de senha
    const meterFill = page.locator('#passwordStrengthBar');
    await expect(meterFill).toHaveCSS('width', /^(50|75|100)%|px/);

    // Avançar para Etapa 2
    await page.click('#nextStepBtn');
    const step2 = page.locator('.wizard-step[data-step="2"]');
    await expect(step2).toHaveClass(/active/);

    // 3. Etapa 2: Seleção de Objetivo
    await page.locator('.choice-card[data-group="objective"][data-value="concurso"]').click();
    await page.selectOption('#careerSubArea', 'policial');

    // Avançar para Etapa 3
    await page.click('#nextStepBtn');
    const step3 = page.locator('.wizard-step[data-step="3"]');
    await expect(step3).toHaveClass(/active/);

    // 4. Etapa 3: Rotina e Disponibilidade
    await page.locator('.choice-card[data-group="dailyHours"][data-value="2h"]').click();
    await page.locator('.choice-card[data-group="studyShift"][data-value="noite"]').click();

    // Avançar para Etapa 4
    await page.click('#nextStepBtn');
    const step4 = page.locator('.wizard-step[data-step="4"]');
    await expect(step4).toHaveClass(/active/);

    // 5. Etapa 4: Acessibilidade & Preferências
    await page.selectOption('#prefSpeed', '1.25');

    // Avançar para Etapa 5
    await page.click('#nextStepBtn');
    const step5 = page.locator('.wizard-step[data-step="5"]');
    await expect(step5).toHaveClass(/active/);

    // 6. Etapa 5: Selecionar Plano e Finalizar
    await page.locator('.choice-card[data-group="plan"][data-value="pro"]').click();

    const finishBtn = page.locator('#finishSignupBtn');
    await expect(finishBtn).toBeVisible();
    await finishBtn.click();

    // Modal deve fechar após submissão bem-sucedida
    await expect(modal).not.toHaveClass(/active/);
  });
});

test.describe('Estudart - Streaming & Player Interativo', () => {
  test('Deve controlar reprodução, alternar velocidades e salvar anotações com timestamp', async ({ page }) => {
    await page.goto('/');

    // 1. Play / Pause
    const playBtn = page.locator('#playPauseBtn');
    await playBtn.click();
    await expect(page.locator('#playPauseIcon')).toHaveText('⏸');

    // 2. Marcadores na Linha do Tempo
    const markers = page.locator('.timeline-marker-flag');
    await expect(markers).toHaveCount(4);

    // 3. Alternância de Velocidade
    await page.selectOption('#speedSelector', '1.5');
    await expect(page.locator('#speedSelector')).toHaveValue('1.5');

    // 4. Anotações Sincronizadas
    await page.click('#tabNotesBtn');
    await page.fill('#lessonNoteInput', 'Revisar jurisprudência do STF sobre moralidade administrativa.');
    await page.click('#saveNoteBtn');

    const noteSaved = page.locator('#savedNotesList .note-item');
    await expect(noteSaved.first()).toContainText('moralidade administrativa');

    // 5. Transcrição Dinâmica e Busca
    await page.click('#tabTranscriptBtn');
    await page.fill('#transcriptSearch', 'LIMPE');
    const visibleParagraphs = page.locator('.transcript-paragraph:visible');
    await expect(visibleParagraphs).toHaveCount(1);
    await expect(visibleParagraphs.first()).toContainText('LIMPE');
  });
});

test.describe('Estudart - Prática Ativa & Neurociência', () => {
  test('Deve responder questão, validar acerto e virar flashcard 3D', async ({ page }) => {
    await page.goto('/');

    // 1. Responder Questão
    const questionStatement = page.locator('#qStatement');
    await expect(questionStatement).not.toBeEmpty();

    const optionA = page.locator('#qOptionsContainer .option-item').first();
    await optionA.click();

    // Verificar Feedback
    const feedbackBox = page.locator('#qFeedback');
    await expect(feedbackBox).toHaveClass(/active/);
    await expect(page.locator('#qFeedbackText')).toContainText('Resposta Correta');

    // 2. Flashcards 3D
    const flashcardInner = page.locator('#flashcardInner');
    await expect(flashcardInner).not.toHaveClass(/flipped/);

    // Clicar para virar (flip 3D)
    await page.locator('#flashcardArena').click();
    await expect(flashcardInner).toHaveClass(/flipped/);

    // Trocar de flashcard
    await page.click('#nextCardBtn');
    await expect(page.locator('#flashcardCounter')).toHaveText('2 / 3');
  });
});

test.describe('Estudart - IA Colega de Turma Nota 10', () => {
  test('Deve interagir e fornecer respostas amigáveis e mnemônicos', async ({ page }) => {
    await page.goto('/');

    // Garantir que a aba do Colega Nota 10 está ativa
    await page.click('#tabAiBuddyBtn');

    // Clicar em um chip rápido de pergunta
    const chipMnemonico = page.locator('.quick-prompt-chip[data-query="mnemonico"]');
    await chipMnemonico.click();

    // Aguardar resposta da IA
    const aiMessages = page.locator('.chat-bubble.ai');
    await expect(aiMessages).toHaveCount(2); // Mensagem de boas-vindas + resposta
    await expect(aiMessages.last()).toContainText('LIMPE');
  });
});

test.describe('Estudart - Catálogo de Cursos & Filtros', () => {
  test('Deve filtrar cursos por categoria e carregá-los no player', async ({ page }) => {
    await page.goto('/');

    // Filtrar por Concursos
    await page.click('.filter-btn[data-filter="concurso"]');
    const cards = page.locator('.course-card');
    await expect(cards).toHaveCount(1);

    // Resetar para Todos
    await page.click('.filter-btn[data-filter="all"]');
    await expect(cards).toHaveCount(4);

    // Clicar em "Assistir" no segundo curso (TI / Transição)
    const playCourseBtn = page.locator('.play-course-btn').nth(1);
    await playCourseBtn.click();

    // Player deve ser atualizado com o título do curso selecionado
    await expect(page.locator('#playerLectureTitle')).toContainText('Engenheiro de Software');
  });
});

test.describe('Estudart - Tema Claro, Hero Ampliado & Foto de Estudantes', () => {
  test('Deve renderizar fundo claro, imagem de estudantes no hero e alternar visões', async ({ page }) => {
    await page.goto('/');

    // 1. Validar Fundo Claro Principal
    const bodyBg = await page.evaluate(() => window.getComputedStyle(document.body).backgroundColor);
    expect(bodyBg).toBe('rgb(255, 255, 255)');

    // 2. Validar Imagem de Estudantes no Hero
    const heroScreen = page.locator('#heroPreviewScreen');
    await expect(heroScreen).toBeVisible();
    const heroBg = await heroScreen.evaluate((el) => window.getComputedStyle(el).backgroundImage);
    expect(heroBg).toContain('students-hero.jpg');

    // 3. Validar Botão Primário com Gradiente e Botão Secundário Preto
    const primaryBtn = page.locator('#heroSubscriberCTA');
    await expect(primaryBtn).toBeVisible();

    const secondaryBtn = page.locator('#heroPlayPreviewCTA');
    await expect(secondaryBtn).toBeVisible();

    // 4. Validar Ticker de Atividade em Tempo Real
    const liveFeed = page.locator('#heroLiveFeedBubble');
    await expect(liveFeed).toBeVisible();
    await expect(liveFeed).toContainText('Mariana R.');

    // 5. Testar Alternância de Visão no Hero
    const toggleLecture = page.locator('#heroToggleLecture');
    await toggleLecture.click();
    await expect(toggleLecture).toHaveClass(/active/);
    await expect(page.locator('#heroTopicLabel')).toContainText('Quadro Interativo');

    const toggleLive = page.locator('#heroToggleLiveRoom');
    await toggleLive.click();
    await expect(toggleLive).toHaveClass(/active/);
    await expect(page.locator('#heroTopicLabel')).toContainText('Ao Vivo');
  });
});
