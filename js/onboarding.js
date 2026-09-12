/**
 * ESTUDART - MÓDULO DE ONBOARDING & ÁREA DO ASSINANTE
 * Gerencia o fluxo completo de cadastro estruturado em 5 etapas,
 * validações em tempo real, cálculo de força de senha e preferências de estudo.
 */

export const Onboarding = {
  currentStep: 1,
  totalSteps: 5,
  formData: {
    name: '',
    email: '',
    whatsapp: '',
    password: '',
    objective: 'concurso',
    careerArea: 'fiscal',
    dailyHours: '2h',
    studyShift: 'noite',
    theme: 'dark',
    playbackSpeed: '1.25x',
    studyReminders: true,
    plan: 'pro'
  },

  init() {
    this.cacheDOM();
    this.bindEvents();
    this.updateStepUI();
  },

  cacheDOM() {
    this.modal = document.getElementById('subscriberModal');
    this.openBtns = document.querySelectorAll('[data-action="open-subscriber-modal"]');
    this.closeBtn = document.getElementById('closeModalBtn');
    this.prevBtn = document.getElementById('prevStepBtn');
    this.nextBtn = document.getElementById('nextStepBtn');
    this.finishBtn = document.getElementById('finishSignupBtn');
    this.steps = document.querySelectorAll('.wizard-step');
    this.indicators = document.querySelectorAll('.step-indicator');
    this.passwordInput = document.getElementById('regPassword');
    this.passwordBar = document.getElementById('passwordStrengthBar');
    this.choiceCards = document.querySelectorAll('.choice-card');
    this.userStatusBadge = document.getElementById('userProfileBadge');
  },

  bindEvents() {
    // Abrir e Fechar Modal
    this.openBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.openModal();
      });
    });

    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.closeModal());
    }

    if (this.modal) {
      this.modal.addEventListener('click', (e) => {
        if (e.target === this.modal) this.closeModal();
      });
    }

    // Navegação de Etapas
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => this.goToNextStep());
    }

    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => this.goToPrevStep());
    }

    if (this.finishBtn) {
      this.finishBtn.addEventListener('click', (e) => this.handleFormSubmit(e));
    }

    // Indicador de Força de Senha
    if (this.passwordInput) {
      this.passwordInput.addEventListener('input', (e) => this.evaluatePasswordStrength(e.target.value));
    }

    // Seleção de Cards Interativos
    this.choiceCards.forEach(card => {
      card.addEventListener('click', () => {
        const group = card.dataset.group;
        document.querySelectorAll(`.choice-card[data-group="${group}"]`).forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        
        const value = card.dataset.value;
        if (group === 'objective') this.formData.objective = value;
        if (group === 'dailyHours') this.formData.dailyHours = value;
        if (group === 'studyShift') this.formData.studyShift = value;
        if (group === 'plan') this.formData.plan = value;
      });
    });
  },

  openModal() {
    if (this.modal) {
      this.modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      this.currentStep = 1;
      this.updateStepUI();
    }
  },

  closeModal() {
    if (this.modal) {
      this.modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  },

  goToNextStep() {
    if (this.validateCurrentStep()) {
      if (this.currentStep < this.totalSteps) {
        this.currentStep++;
        this.updateStepUI();
      }
    }
  },

  goToPrevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.updateStepUI();
    }
  },

  validateCurrentStep() {
    const activeStepEl = document.querySelector(`.wizard-step[data-step="${this.currentStep}"]`);
    if (!activeStepEl) return true;

    const requiredInputs = activeStepEl.querySelectorAll('input[required], select[required]');
    let isValid = true;

    requiredInputs.forEach(input => {
      if (!input.checkValidity() || !input.value.trim()) {
        input.classList.add('is-invalid');
        isValid = false;
        
        // Foco no primeiro campo inválido
        input.focus();
      } else {
        input.classList.remove('is-invalid');
      }
    });

    if (this.currentStep === 1 && isValid) {
      const pass = document.getElementById('regPassword');
      const passConfirm = document.getElementById('regPasswordConfirm');
      if (pass && passConfirm && pass.value !== passConfirm.value) {
        passConfirm.setCustomValidity('As senhas não conferem.');
        passConfirm.classList.add('is-invalid');
        alert('As senhas digitadas não coincidem. Por favor, verifique.');
        return false;
      } else if (passConfirm) {
        passConfirm.setCustomValidity('');
      }
    }

    return isValid;
  },

  updateStepUI() {
    // Atualizar Telas
    this.steps.forEach(step => {
      const stepNum = parseInt(step.dataset.step, 10);
      step.classList.toggle('active', stepNum === this.currentStep);
    });

    // Atualizar Indicadores
    this.indicators.forEach((ind, index) => {
      const stepNum = index + 1;
      ind.classList.remove('active', 'completed');
      if (stepNum === this.currentStep) {
        ind.classList.add('active');
      } else if (stepNum < this.currentStep) {
        ind.classList.add('completed');
      }
    });

    // Atualizar Botões do Rodapé
    if (this.prevBtn) {
      this.prevBtn.style.visibility = this.currentStep === 1 ? 'hidden' : 'visible';
    }

    if (this.nextBtn && this.finishBtn) {
      if (this.currentStep === this.totalSteps) {
        this.nextBtn.style.display = 'none';
        this.finishBtn.style.display = 'inline-flex';
      } else {
        this.nextBtn.style.display = 'inline-flex';
        this.finishBtn.style.display = 'none';
      }
    }
  },

  evaluatePasswordStrength(password) {
    if (!this.passwordBar) return;
    let score = 0;
    if (password.length >= 6) score += 25;
    if (/[A-Z]/.test(password)) score += 25;
    if (/[0-9]/.test(password)) score += 25;
    if (/[^A-Za-z0-9]/.test(password)) score += 25;

    this.passwordBar.style.width = `${score}%`;
    if (score <= 25) {
      this.passwordBar.style.background = '#f43f5e';
    } else if (score <= 50) {
      this.passwordBar.style.background = '#f59e0b';
    } else if (score <= 75) {
      this.passwordBar.style.background = '#3b82f6';
    } else {
      this.passwordBar.style.background = '#10b981';
    }
  },

  handleFormSubmit(e) {
    e.preventDefault();
    if (!this.validateCurrentStep()) return;

    // Coletar dados restantes
    const nameInput = document.getElementById('regName');
    const emailInput = document.getElementById('regEmail');
    if (nameInput) this.formData.name = nameInput.value.trim();
    if (emailInput) this.formData.email = emailInput.value.trim();

    // Salvar no localStorage
    localStorage.setItem('estudart_user', JSON.stringify({
      ...this.formData,
      isSubscriber: true,
      subscriptionDate: new Date().toISOString(),
      xp: 150,
      streakDays: 4
    }));

    // Feedback Visual Amigável
    alert(`🎉 Parabéns, ${this.formData.name || 'Estudante'}!\nSua matrícula no Plano Pro do Estudart foi ativada com sucesso!\nVocê acaba de ganhar +150 XP de boas-vindas do seu Colega Nota 10.`);

    if (this.userStatusBadge) {
      this.userStatusBadge.textContent = this.formData.name.split(' ')[0] || 'Assinante Pro';
      this.userStatusBadge.classList.add('badge-aperfeicoamento');
    }

    this.closeModal();
  }
};
