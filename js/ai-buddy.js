/**
 * ESTUDART - MÓDULO DA IA: "O COLEGA NOTA 10 DA SALA DE AULA"
 * O amigo de turma super inteligente, acolhedor e incentivador que senta ao seu lado,
 * sempre tira 10, vibra com seus acertos, tira dúvidas no timestamp exato e simplifica tudo.
 */

export const AIBuddy = {
  name: 'Nerdinho (Seu Colega Nota 10)',
  messages: [
    {
      sender: 'ai',
      text: 'Fala, parceiro(a)! 🚀 Eu sou seu colega de turma aqui no Estudart. Já fechei o edital e fiz todos os resumos, então qualquer dúvida no vídeo ou na matéria, pode me chamar na hora! O que vamos detonar hoje?'
    }
  ],

  cannedResponses: {
    'mnemonico': 'Com certeza! Pega essa técnica: no Direito Constitucional e Administrativo, lembre-se do **LIMPE** (Legalidade, Impessoalidade, Moralidade, Publicidade, Eficiência). Já para os requisitos do ato administrativo, lembre-se de **COM-FI-FO-MO-OB** (Competência, Finalidade, Forma, Motivo e Objeto). Anota aí no seu caderno sincronizado do player!',
    '10anos': 'Imagina que a Administração Pública é como um síndico de um condomínio gigante. Ele não pode pintar o prédio com a cor favorita dele só porque quer (Impessoalidade), não pode gastar o dinheiro dos moradores sem recibo (Moralidade) e tem que prestar contas no mural para todo mundo ver (Publicidade). Ficou bem mais simples, né?',
    'pegadinha': 'Fica de olho vivo na banca (tipo Cebraspe ou FGV)! A pegadinha mais manjada de todas é trocar o princípio da **Legalidade** pelo da **Reserva Legal**, ou dizer que a motivação do ato é dispensável quando a lei não exigir forma escrita expressa. Quando ver essas palavras no enunciado, acenda o alerta vermelho!',
    'meta': 'Bora pra cima! 🔥 Você já tá na sua ofensiva de 4 dias seguidos! Se a gente assistir mais 1 vídeo de 8 minutos e responder o quiz agora, você fecha a meta diária e ganha o badge de Foco de Titânio. Tô contigo nessa!'
  },

  init() {
    this.cacheDOM();
    this.bindEvents();
    this.renderMessages();
  },

  cacheDOM() {
    this.msgList = document.getElementById('aiMessagesList');
    this.inputField = document.getElementById('aiChatInput');
    this.sendBtn = document.getElementById('aiSendBtn');
    this.quickChips = document.querySelectorAll('.quick-prompt-chip');
  },

  bindEvents() {
    if (this.sendBtn && this.inputField) {
      this.sendBtn.addEventListener('click', () => this.sendMessage());
      this.inputField.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') this.sendMessage();
      });
    }

    this.quickChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const queryType = chip.dataset.query;
        const text = chip.textContent.replace(/^[^\w]+/, '').trim();
        this.inputField.value = text;
        this.sendMessage(queryType);
      });
    });

    // Ouvir eventos do Quiz para comemorar ou incentivar!
    window.addEventListener('estudart:quiz-answered', (e) => {
      const isCorrect = e.detail.correct;
      if (isCorrect) {
        this.addAIMessage('BOA! Mandou bem demais na questão! 🎯 Sabia que você ia acertar de primeira! Esse conceito despenca em prova, já garantiu mais 25 XP!');
      } else {
        this.addAIMessage('Tranquilo, não esquenta a cabeça! Errar no simulado é o que faz a gente gabaritar no dia da prova. Revisa a explicação ali do lado e vamos pra próxima, tô aqui contigo!');
      }
    });
  },

  sendMessage(predefinedKey = null) {
    const text = this.inputField.value.trim();
    if (!text) return;

    // Adiciona mensagem do usuário
    this.messages.push({ sender: 'user', text });
    this.inputField.value = '';
    this.renderMessages();

    // Simulação do Colega Nota 10 respondendo de forma atenciosa
    setTimeout(() => {
      let reply = '';
      const lower = text.toLowerCase();

      if (predefinedKey && this.cannedResponses[predefinedKey]) {
        reply = this.cannedResponses[predefinedKey];
      } else if (lower.includes('mnem') || lower.includes('lembrar') || lower.includes('decorar')) {
        reply = this.cannedResponses['mnemonico'];
      } else if (lower.includes('10 anos') || lower.includes('fácil') || lower.includes('simples') || lower.includes('leigo')) {
        reply = this.cannedResponses['10anos'];
      } else if (lower.includes('pegadinha') || lower.includes('banca') || lower.includes('cai')) {
        reply = this.cannedResponses['pegadinha'];
      } else if (lower.includes('desanim') || lower.includes('cansa') || lower.includes('meta') || lower.includes('ajuda')) {
        reply = this.cannedResponses['meta'];
      } else {
        reply = `Excelente pergunta! Analisando pelo ângulo da prova e da compreensão rápida: foque sempre na essência prática desse conceito antes de tentar memorizar os detalhes de rodapé. Dá uma olhada no mnemônico da nossa timeline aos 08:15 que você vai fixar isso pra sempre! Quer que eu te passe outro exemplo prático?`;
      }

      this.addAIMessage(reply);
    }, 600);
  },

  addAIMessage(text) {
    this.messages.push({ sender: 'ai', text });
    this.renderMessages();
  },

  renderMessages() {
    if (!this.msgList) return;
    this.msgList.innerHTML = '';

    this.messages.forEach(msg => {
      const bubble = document.createElement('div');
      bubble.className = `chat-bubble ${msg.sender}`;
      bubble.innerHTML = msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      this.msgList.appendChild(bubble);
    });

    this.msgList.scrollTop = this.msgList.scrollHeight;
  }
};
