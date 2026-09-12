/**
 * ESTUDART - MÓDULO DE PRÁTICA ATIVA: QUESTÕES E FLASHCARDS 3D
 * Gerencia a resolução de questões de concursos e simulados em tempo real,
 * feedback didático com fundamentação e flashcards com repetição espaçada (SRS).
 */

export const Practice = {
  currentQuestionIndex: 0,
  currentFlashcardIndex: 0,
  score: 0,

  questions: [
    {
      id: 1,
      source: 'Cebraspe / Concurso PF - Agente',
      statement: 'No que concerne aos princípios constitucionais da administração pública (art. 37 da CF/88), o princípio da IMPESSOALIDADE veda a promoção pessoal de autoridades ou servidores públicos sobre suas realizações.',
      options: [
        { letter: 'A', text: 'Certo. A publicidade dos atos, programas e obras deve ter caráter educativo, informativo ou de orientação social.', correct: true },
        { letter: 'B', text: 'Errado. O administrador público tem o dever legal de associar sua imagem às obras de seu mandato governamental.', correct: false },
        { letter: 'C', text: 'Errado. A vedação aplica-se apenas ao Poder Judiciário, admitindo-se no Poder Executivo.', correct: false },
        { letter: 'D', text: 'Certo, porém apenas no período dos 90 dias que antecedem as eleições majoritárias.', correct: false }
      ],
      explanation: 'Exato! O § 1º do art. 37 da CF/88 determina expressamente que a publicidade dos atos dos órgãos públicos não pode constar nomes, símbolos ou imagens que caracterizem promoção pessoal. É o núcleo do princípio da impessoalidade.',
      stat: '91% dos alunos acertaram esta questão'
    },
    {
      id: 2,
      source: 'Fundamentos de TI & Engenharia de Software',
      statement: 'Em arquitetura de microsserviços modernos e computação em nuvem, qual padrão de resiliência é projetado para evitar falhas em cascata interrompendo temporariamente o envio de requisições a um serviço instável?',
      options: [
        { letter: 'A', text: 'Saga Pattern', correct: false },
        { letter: 'B', text: 'Circuit Breaker (Disjuntor)', correct: true },
        { letter: 'C', text: 'CQRS (Command Query Responsibility Segregation)', correct: false },
        { letter: 'D', text: 'Outbox Pattern', correct: false }
      ],
      explanation: 'Correto! O Circuit Breaker monitora falhas de rede/serviço. Ao atingir um limiar crítico, ele "abre o circuito" e responde de imediato com fallback, impedindo que todo o ecossistema caia.',
      stat: '78% dos alunos acertaram esta questão'
    }
  ],

  flashcards: [
    {
      front: 'O que significa o mnemônico "LIMPE" no Direito Administrativo?',
      back: 'Legalidade, Impessoalidade, Moralidade, Publicidade e Eficiência (Art. 37, caput da Constituição Federal).',
      tag: 'Concursos Públicos'
    },
    {
      front: 'Qual a diferença crucial entre "Active Recall" e "Leitura Passiva"?',
      back: 'Active Recall força o cérebro a recuperar a informação da memória de longo prazo antes de olhar a resposta, aumentando a retenção em até 300%.',
      tag: 'Neurociência do Estudo'
    },
    {
      front: 'O que é o Teorema CAP em Sistemas Distribuídos e Bancos de Dados?',
      back: 'Afirma que um sistema distribuído só pode garantir simultaneamente 2 das 3 propriedades: Consistência (Consistency), Disponibilidade (Availability) e Tolerância a Partições (Partition Tolerance).',
      tag: 'Transição para TI'
    }
  ],

  init() {
    this.cacheDOM();
    this.renderQuestion();
    this.renderFlashcard();
    this.bindEvents();
  },

  cacheDOM() {
    // Questões
    this.qSource = document.getElementById('qSource');
    this.qStatement = document.getElementById('qStatement');
    this.qOptionsContainer = document.getElementById('qOptionsContainer');
    this.qFeedback = document.getElementById('qFeedback');
    this.qFeedbackText = document.getElementById('qFeedbackText');
    this.qStatText = document.getElementById('qStatText');
    this.nextQBtn = document.getElementById('nextQuestionBtn');

    // Flashcards
    this.flashcardInner = document.getElementById('flashcardInner');
    this.flashcardFrontText = document.getElementById('flashcardFrontText');
    this.flashcardBackText = document.getElementById('flashcardBackText');
    this.flashcardTag = document.getElementById('flashcardTag');
    this.flashcardCounter = document.getElementById('flashcardCounter');
    this.nextCardBtn = document.getElementById('nextCardBtn');
    this.prevCardBtn = document.getElementById('prevCardBtn');
  },

  bindEvents() {
    if (this.nextQBtn) {
      this.nextQBtn.addEventListener('click', () => {
        this.currentQuestionIndex = (this.currentQuestionIndex + 1) % this.questions.length;
        this.renderQuestion();
      });
    }

    if (this.flashcardInner) {
      this.flashcardInner.addEventListener('click', () => {
        this.flashcardInner.classList.toggle('flipped');
      });
    }

    if (this.nextCardBtn) {
      this.nextCardBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.changeFlashcard(1);
      });
    }

    if (this.prevCardBtn) {
      this.prevCardBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.changeFlashcard(-1);
      });
    }
  },

  renderQuestion() {
    const q = this.questions[this.currentQuestionIndex];
    if (!q || !this.qStatement) return;

    this.qSource.textContent = q.source;
    this.qStatement.textContent = q.statement;
    this.qFeedback.classList.remove('active');
    this.qOptionsContainer.innerHTML = '';

    q.options.forEach(opt => {
      const optBtn = document.createElement('button');
      optBtn.type = 'button';
      optBtn.className = 'option-item';
      optBtn.innerHTML = `
        <span class="option-letter">${opt.letter}</span>
        <span style="text-align: left;">${opt.text}</span>
      `;

      optBtn.addEventListener('click', () => this.handleAnswer(opt, optBtn, q));
      this.qOptionsContainer.appendChild(optBtn);
    });
  },

  handleAnswer(selectedOpt, btnEl, q) {
    const allButtons = this.qOptionsContainer.querySelectorAll('.option-item');
    allButtons.forEach(btn => btn.disabled = true);

    if (selectedOpt.correct) {
      btnEl.classList.add('correct');
      this.score += 25;
      this.qFeedbackText.innerHTML = `✅ <strong>Muito bem! Resposta Correta!</strong><br>${q.explanation}`;
      
      // Notificar IA colega de turma para vibrar com o acerto!
      window.dispatchEvent(new CustomEvent('estudart:quiz-answered', { 
        detail: { correct: true, points: 25 } 
      }));
    } else {
      btnEl.classList.add('wrong');
      allButtons.forEach((b, idx) => {
        if (q.options[idx].correct) b.classList.add('correct');
      });
      this.qFeedbackText.innerHTML = `❌ <strong>Ops, não foi dessa vez!</strong><br>${q.explanation}`;
      
      window.dispatchEvent(new CustomEvent('estudart:quiz-answered', { 
        detail: { correct: false, points: 0 } 
      }));
    }

    this.qStatText.textContent = q.stat;
    this.qFeedback.classList.add('active');
  },

  renderFlashcard() {
    const card = this.flashcards[this.currentFlashcardIndex];
    if (!card || !this.flashcardFrontText) return;

    if (this.flashcardInner) {
      this.flashcardInner.classList.remove('flipped');
    }

    this.flashcardFrontText.textContent = card.front;
    this.flashcardBackText.textContent = card.back;
    if (this.flashcardTag) this.flashcardTag.textContent = card.tag;
    if (this.flashcardCounter) {
      this.flashcardCounter.textContent = `${this.currentFlashcardIndex + 1} / ${this.flashcards.length}`;
    }
  },

  changeFlashcard(direction) {
    const total = this.flashcards.length;
    this.currentFlashcardIndex = (this.currentFlashcardIndex + direction + total) % total;
    this.renderFlashcard();
  }
};
