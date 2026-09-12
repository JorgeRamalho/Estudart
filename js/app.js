/**
 * ESTUDART - APLICAÇÃO PRINCIPAL & CONTROLADOR
 * Orquestração de módulos, filtros de catálogo, alternância de cursos no player,
 * gerenciamento de estado global e pontuação do usuário.
 */

import { Onboarding } from './onboarding.js';
import { VideoPlayer } from './player.js';
import { Practice } from './practice.js';
import { AIBuddy } from './ai-buddy.js';

export const App = {
  userXP: 380,
  userStreak: 5,
  activeFilter: 'all',

  // Catálogo de Cursos & Streams
  courses: [
    {
      id: 'dir-adm-concurso',
      category: 'concurso',
      badgeClass: 'badge-concurso',
      badgeText: 'Concurso Público',
      duration: '12:45 min',
      title: 'Direito Constitucional & Administrativo Descomplicado',
      desc: 'Domine os princípios do Art. 37 da CF/88, jurisprudência recente e resoluções de questões da banca Cebraspe.',
      instructor: 'Profª. Dra. Mariana Rios',
      instructorInitial: 'MR',
      topicMarker: 'Princípio da Impessoalidade e Eficiência'
    },
    {
      id: 'fullstack-ia-transicao',
      category: 'transicao',
      badgeClass: 'badge-transicao',
      badgeText: 'Transição de Carreira',
      duration: '15:20 min',
      title: 'Do Zero a Engenheiro de Software com Inteligência Artificial',
      desc: 'Aprenda lógica computacional, arquiteturas distribuídas e integração prática com APIs de Large Language Models.',
      instructor: 'Eng. Lucas Santana',
      instructorInitial: 'LS',
      topicMarker: 'Arquitetura de Microsserviços & Resiliência'
    },
    {
      id: 'logica-matematica-nivelamento',
      category: 'nivelamento',
      badgeClass: 'badge-nivelamento',
      badgeText: 'Nivelamento Essencial',
      duration: '09:50 min',
      title: 'Raciocínio Lógico & Matemática sem Traumas',
      desc: 'Elimine as lacunas do ensino básico com métodos visuais, equivalências lógicas e tabelas-verdade intuitivas.',
      instructor: 'Prof. Carlos Eduardo',
      instructorInitial: 'CE',
      topicMarker: 'Tabela Verdade e Diagramas de Venn'
    },
    {
      id: 'lideranca-gestao-aperfeicoamento',
      category: 'aperfeicoamento',
      badgeClass: 'badge-aperfeicoamento',
      badgeText: 'Aperfeiçoamento',
      duration: '11:10 min',
      title: 'Comunicação Assertiva, Alta Gestão & Resolução de Conflitos',
      desc: 'Técnicas de oratória, negociação moderna e inteligência interpessoal para líderes de alta performance.',
      instructor: 'Camila Albuquerque',
      instructorInitial: 'CA',
      topicMarker: 'Feedback Estruturado e Matriz de Eisenhower'
    },
    {
      id: 'portugues-redacao-concurso',
      category: 'concurso',
      badgeClass: 'badge-concurso',
      badgeText: 'Concurso Público',
      duration: '13:30 min',
      title: 'Língua Portuguesa & Redação Oficial para Bancas',
      desc: 'Gramática aplicada, interpretação de texto e redação oficial segundo o Manual de Redação da Presidência, com foco nas bancas Cebraspe e FCC.',
      instructor: 'Profª. Ana Cláudia Melo',
      instructorInitial: 'AM',
      topicMarker: 'Coesão, Coerência e Atos Normativos'
    },
    {
      id: 'data-science-transicao',
      category: 'transicao',
      badgeClass: 'badge-transicao',
      badgeText: 'Transição de Carreira',
      duration: '14:05 min',
      title: 'Ciência de Dados & Machine Learning na Prática',
      desc: 'Do tratamento de dados com Python e Pandas até modelos preditivos com Scikit-learn, aplicados a casos reais de mercado.',
      instructor: 'Dr. Rafael Monteiro',
      instructorInitial: 'RM',
      topicMarker: 'Regressão, Classificação e Validação Cruzada'
    }
  ],

  init() {
    console.log('🚀 Estudart: Plataforma EAD & Streaming iniciada com sucesso.');
    
    // Inicializar submódulos
    Onboarding.init();
    VideoPlayer.init();
    Practice.init();
    AIBuddy.init();

    this.cacheDOM();
    this.bindEvents();
    this.setupHeroInteractions();
    this.startHeroLiveFeed();
    this.loadPersistedUserData();
    this.renderCoursesGrid();
  },

  cacheDOM() {
    this.filterButtons = document.querySelectorAll('.filter-btn');
    this.coursesGrid = document.getElementById('coursesGrid');
    this.playerTitle = document.getElementById('playerLectureTitle');
    this.playerDesc = document.getElementById('playerLectureDesc');
    this.playerBadge = document.getElementById('playerLectureBadge');
    this.playerInstructor = document.getElementById('playerInstructorName');
    this.themeToggleBtn = document.getElementById('themeToggleBtn');
    this.userStreakDisplay = document.getElementById('userStreakCount');
    this.userXPDisplay = document.getElementById('userXPCount');
    this.heroPlayPulseBtn = document.getElementById('heroPlayPulseBtn');
    this.heroToggleLiveRoom = document.getElementById('heroToggleLiveRoom');
    this.heroToggleLecture = document.getElementById('heroToggleLecture');
    this.heroPreviewScreen = document.getElementById('heroPreviewScreen');
    this.heroTopicLabel = document.getElementById('heroTopicLabel');
    this.heroLiveFeedBubble = document.getElementById('heroLiveFeedBubble');
  },

  bindEvents() {
    // Filtros de Cursos
    this.filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        this.filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.activeFilter = btn.dataset.filter;
        this.renderCoursesGrid();
      });
    });

    // Alternância de Tema (Normal / Alto Contraste)
    if (this.themeToggleBtn) {
      this.themeToggleBtn.addEventListener('click', () => {
        const isHighContrast = document.body.getAttribute('data-theme') === 'high-contrast';
        if (isHighContrast) {
          document.body.removeAttribute('data-theme');
          this.themeToggleBtn.textContent = '👁️ Alto Contraste';
        } else {
          document.body.setAttribute('data-theme', 'high-contrast');
          this.themeToggleBtn.textContent = '🌙 Tema Escuro';
        }
      });
    }

    // Ouvir acréscimos de XP
    window.addEventListener('estudart:quiz-answered', (e) => {
      if (e.detail.points > 0) {
        this.userXP += e.detail.points;
        this.updateStatsUI();
      }
    });
  },

  setupHeroInteractions() {
    // Clique no botão de Play do Hero -> Rola até o player e inicia reprodução
    if (this.heroPlayPulseBtn) {
      this.heroPlayPulseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const playerSection = document.getElementById('playerSection');
        if (playerSection) {
          playerSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        if (!VideoPlayer.isPlaying) {
          VideoPlayer.togglePlay();
        }
      });
    }

    // Alternador de visão do Hero: Sala de Estudos vs. Aula Gravada
    if (this.heroToggleLiveRoom && this.heroToggleLecture) {
      this.heroToggleLiveRoom.addEventListener('click', () => {
        this.heroToggleLiveRoom.classList.add('active');
        this.heroToggleLecture.classList.remove('active');
        if (this.heroPreviewScreen) {
          this.heroPreviewScreen.style.backgroundImage = "url('assets/students-hero.jpg')";
        }
        if (this.heroTopicLabel) {
          this.heroTopicLabel.textContent = 'Ao Vivo • Transição para Tech & Carreiras Federais';
        }
      });

      this.heroToggleLecture.addEventListener('click', () => {
        this.heroToggleLecture.classList.add('active');
        this.heroToggleLiveRoom.classList.remove('active');
        if (this.heroPreviewScreen) {
          this.heroPreviewScreen.style.backgroundImage = "linear-gradient(135deg, #091a38 0%, #1e1035 100%)";
        }
        if (this.heroTopicLabel) {
          this.heroTopicLabel.textContent = 'Quadro Interativo • Art. 37 da Constituição Federal';
        }
      });
    }
  },

  startHeroLiveFeed() {
    if (!this.heroLiveFeedBubble) return;

    const liveEvents = [
      { avatar: '🎓', name: 'Mariana R.', action: 'fixou o', item: 'Mnemônico LIMPE', xp: '+50 XP' },
      { avatar: '⚡', name: 'Lucas S.', action: 'acertou 3', item: 'Flashcards seguidos', xp: '🔥 Ofensiva' },
      { avatar: '📚', name: 'Beatriz F.', action: 'iniciou o módulo', item: 'Engenharia de Software', xp: '+30 XP' },
      { avatar: '🏆', name: 'Carlos E.', action: 'completou o simulado com', item: '100% de acertos', xp: '+100 XP' },
      { avatar: '💡', name: 'Aline M.', action: 'perguntou à IA sobre', item: 'Jurisprudência do STF', xp: 'Resolvido' }
    ];

    let currentIndex = 0;
    setInterval(() => {
      currentIndex = (currentIndex + 1) % liveEvents.length;
      const ev = liveEvents[currentIndex];
      this.heroLiveFeedBubble.innerHTML = `
        <div class="student-avatar-ring">${ev.avatar}</div>
        <div class="feed-bubble-text">
          <strong>${ev.name}</strong> ${ev.action} <em>${ev.item}</em> (${ev.xp})
        </div>
      `;
    }, 4500);
  },

  loadPersistedUserData() {
    const saved = localStorage.getItem('estudart_user');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.xp) this.userXP = data.xp;
        if (data.streakDays) this.userStreak = data.streakDays;
        
        const badge = document.getElementById('userProfileBadge');
        if (badge && data.name) {
          badge.textContent = data.name.split(' ')[0] || 'Assinante';
          badge.classList.add('badge-aperfeicoamento');
        }
      } catch (err) {
        console.error('Erro ao ler dados do usuário:', err);
      }
    }
    this.updateStatsUI();
  },

  updateStatsUI() {
    if (this.userStreakDisplay) {
      this.userStreakDisplay.textContent = `${this.userStreak} Dias`;
    }
    if (this.userXPDisplay) {
      this.userXPDisplay.textContent = `${this.userXP} XP`;
    }
  },

  renderCoursesGrid() {
    if (!this.coursesGrid) return;
    this.coursesGrid.innerHTML = '';

    const filtered = this.courses.filter(c => {
      return this.activeFilter === 'all' || c.category === this.activeFilter;
    });

    filtered.forEach(course => {
      const card = document.createElement('article');
      card.className = 'course-card';
      card.innerHTML = `
        <div class="card-thumb">
          <div class="card-thumb-bg" style="background-image: linear-gradient(135deg, rgba(15,21,39,0.8), rgba(6,182,212,0.2));">
            <button class="btn btn-secondary btn-icon" aria-label="Assistir aula preview">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </button>
          </div>
          <div class="card-badges">
            <span class="badge ${course.badgeClass}">${course.badgeText}</span>
          </div>
          <span class="card-duration">⏱ ${course.duration}</span>
        </div>
        <div class="card-content">
          <span class="card-category">Streaming Exclusivo</span>
          <h3 class="card-title">${course.title}</h3>
          <p class="card-desc">${course.desc}</p>
          <div class="card-footer">
            <div class="instructor-info">
              <div class="instructor-avatar">${course.instructorInitial}</div>
              <span class="instructor-name">${course.instructor}</span>
            </div>
            <button class="btn btn-primary btn-sm play-course-btn" data-id="${course.id}">
              Assistir
            </button>
          </div>
        </div>
      `;

      // Ao clicar em assistir, carregar no player
      const playBtn = card.querySelector('.play-course-btn');
      playBtn.addEventListener('click', () => this.loadCourseIntoPlayer(course));

      this.coursesGrid.appendChild(card);
    });
  },

  loadCourseIntoPlayer(course) {
    if (this.playerTitle) this.playerTitle.textContent = course.title;
    if (this.playerDesc) this.playerDesc.textContent = course.desc;
    if (this.playerBadge) {
      this.playerBadge.className = `badge ${course.badgeClass}`;
      this.playerBadge.textContent = course.badgeText;
    }
    if (this.playerInstructor) this.playerInstructor.textContent = course.instructor;

    // Rolar suavemente até o player
    const playerSection = document.getElementById('playerSection');
    if (playerSection) {
      playerSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Iniciar reprodução
    VideoPlayer.currentTime = 0;
    VideoPlayer.updateTimeDisplay();
    if (!VideoPlayer.isPlaying) {
      VideoPlayer.togglePlay();
    }
  }
};

// Inicialização após carregamento do DOM
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
