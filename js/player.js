/**
 * ESTUDART - MÓDULO DO PLAYER DE VÍDEO & STREAMING COGNITIVO
 * Gerencia reprodução simulada, marcadores de timeline para Active Recall,
 * controle de velocidade (0.75x a 2x), anotações sincronizadas e transcrição dinâmica.
 */

export const VideoPlayer = {
  isPlaying: false,
  currentTime: 272, // 04:32 em segundos
  duration: 765,    // 12:45 em segundos
  playbackSpeed: 1,
  timerInterval: null,

  // Marcadores de Compreensão Humana na Linha do Tempo
  markers: [
    { time: 60, title: 'Gancho de Curiosidade', desc: 'Por que 87% erram este princípio em provas?', type: 'curiosity' },
    { time: 270, title: 'Conceito Central', desc: 'A regra de ouro explicada em 3 minutos.', type: 'concept' },
    { time: 510, title: 'Mnemônico Visual', desc: 'Técnica de associação rápida para memorização.', type: 'mnemonic' },
    { time: 660, title: 'Mini-Quiz Ativo', desc: 'Teste de fixação antes de avançar.', type: 'quiz' }
  ],

  notes: [
    { time: '02:15', text: 'Importante: atenção à exceção do artigo 5º no concurso da PF.' },
    { time: '04:30', text: 'Mnemônico LIMPE: Legalidade, Impessoalidade, Moralidade, Publicidade, Eficiência.' }
  ],

  init() {
    this.cacheDOM();
    this.renderMarkers();
    this.renderNotes();
    this.bindEvents();
    this.updateTimeDisplay();
  },

  cacheDOM() {
    this.playBtn = document.getElementById('playPauseBtn');
    this.playIcon = document.getElementById('playPauseIcon');
    this.timelineBar = document.getElementById('timelineBar');
    this.timelineProgress = document.getElementById('timelineProgress');
    this.markersContainer = document.getElementById('timelineMarkers');
    this.timeCurrentEl = document.getElementById('timeCurrent');
    this.timeDurationEl = document.getElementById('timeDuration');
    this.speedSelect = document.getElementById('speedSelector');
    this.theaterBtn = document.getElementById('theaterModeBtn');
    this.playerSection = document.getElementById('playerSection');
    this.lectureTopicBadge = document.getElementById('lectureTopicBadge');
    
    // Anotações & Transcrição
    this.noteInput = document.getElementById('lessonNoteInput');
    this.saveNoteBtn = document.getElementById('saveNoteBtn');
    this.notesList = document.getElementById('savedNotesList');
    this.transcriptSearch = document.getElementById('transcriptSearch');
    this.transcriptItems = document.querySelectorAll('.transcript-paragraph');
  },

  bindEvents() {
    if (this.playBtn) {
      this.playBtn.addEventListener('click', () => this.togglePlay());
    }

    if (this.timelineBar) {
      this.timelineBar.addEventListener('click', (e) => this.seek(e));
    }

    if (this.speedSelect) {
      this.speedSelect.addEventListener('change', (e) => {
        this.playbackSpeed = parseFloat(e.target.value);
      });
    }

    if (this.theaterBtn) {
      this.theaterBtn.addEventListener('click', () => this.toggleTheaterMode());
    }

    if (this.saveNoteBtn && this.noteInput) {
      this.saveNoteBtn.addEventListener('click', () => this.addNote());
      this.noteInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') this.addNote();
      });
    }

    if (this.transcriptSearch) {
      this.transcriptSearch.addEventListener('input', (e) => this.filterTranscript(e.target.value));
    }

    // Abas do Painel Lateral
    const sidebarTabs = document.querySelectorAll('.sidebar-tab');
    sidebarTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        sidebarTabs.forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.sidebar-tab-content').forEach(c => c.classList.remove('active'));
        
        tab.classList.add('active');
        const targetId = tab.dataset.target;
        const targetContent = document.getElementById(targetId);
        if (targetContent) targetContent.classList.add('active');
      });
    });
  },

  togglePlay() {
    this.isPlaying = !this.isPlaying;
    if (this.isPlaying) {
      this.playIcon.textContent = '⏸';
      this.startPlaybackTimer();
    } else {
      this.playIcon.textContent = '▶';
      this.stopPlaybackTimer();
    }
  },

  startPlaybackTimer() {
    this.stopPlaybackTimer();
    this.timerInterval = setInterval(() => {
      if (this.currentTime < this.duration) {
        this.currentTime += 1 * this.playbackSpeed;
        this.updateTimeDisplay();
        this.checkMarkersTrigger();
      } else {
        this.togglePlay();
      }
    }, 1000);
  },

  stopPlaybackTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  },

  seek(e) {
    const rect = this.timelineBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, clickX / rect.width));
    this.currentTime = percentage * this.duration;
    this.updateTimeDisplay();
  },

  updateTimeDisplay() {
    const percent = (this.currentTime / this.duration) * 100;
    if (this.timelineProgress) {
      this.timelineProgress.style.width = `${percent}%`;
    }
    if (this.timeCurrentEl) {
      this.timeCurrentEl.textContent = this.formatTime(this.currentTime);
    }
    if (this.timeDurationEl) {
      this.timeDurationEl.textContent = this.formatTime(this.duration);
    }
  },

  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  },

  renderMarkers() {
    if (!this.markersContainer) return;
    this.markersContainer.innerHTML = '';

    this.markers.forEach(marker => {
      const percent = (marker.time / this.duration) * 100;
      const flag = document.createElement('div');
      flag.className = `timeline-marker-flag ${marker.type === 'quiz' ? 'quiz' : ''}`;
      flag.style.left = `${percent}%`;
      flag.title = `${this.formatTime(marker.time)} - ${marker.title}: ${marker.desc}`;
      
      flag.addEventListener('click', (e) => {
        e.stopPropagation();
        this.currentTime = marker.time;
        this.updateTimeDisplay();
        if (this.lectureTopicBadge) {
          this.lectureTopicBadge.textContent = `📍 ${marker.title}`;
        }
      });

      this.markersContainer.appendChild(flag);
    });
  },

  checkMarkersTrigger() {
    // Disparar aviso visual quando cruzar um marcador
    const current = Math.floor(this.currentTime);
    const hit = this.markers.find(m => Math.abs(m.time - current) <= 1);
    if (hit && this.lectureTopicBadge) {
      this.lectureTopicBadge.textContent = `💡 ${hit.title}: ${hit.desc}`;
    }
  },

  toggleTheaterMode() {
    if (this.playerSection) {
      this.playerSection.classList.toggle('theater-mode');
      const isTheater = this.playerSection.classList.contains('theater-mode');
      this.theaterBtn.title = isTheater ? 'Sair do Modo Teatro' : 'Entrar no Modo Teatro';
      this.theaterBtn.style.color = isTheater ? 'var(--secondary)' : '';
    }
  },

  addNote() {
    const text = this.noteInput.value.trim();
    if (!text) return;

    const timeStr = this.formatTime(this.currentTime);
    this.notes.unshift({ time: timeStr, text });
    this.renderNotes();
    this.noteInput.value = '';
  },

  renderNotes() {
    if (!this.notesList) return;
    this.notesList.innerHTML = '';

    this.notes.forEach(note => {
      const noteItem = document.createElement('div');
      noteItem.className = 'note-item';
      noteItem.style.cssText = `
        background: rgba(255,255,255,0.04);
        border: 1px solid var(--border-glass);
        padding: 0.65rem 0.85rem;
        border-radius: var(--radius-sm);
        margin-bottom: 0.5rem;
        font-size: 0.85rem;
      `;
      noteItem.innerHTML = `
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.2rem;">
          <span style="color: var(--secondary); font-weight: 700; font-size: 0.75rem;">⏱ ${note.time}</span>
        </div>
        <p style="color: var(--text-main); line-height: 1.4;">${note.text}</p>
      `;
      this.notesList.appendChild(noteItem);
    });
  },

  filterTranscript(query) {
    const q = query.toLowerCase().trim();
    this.transcriptItems.forEach(item => {
      const text = item.textContent.toLowerCase();
      if (!q || text.includes(q)) {
        item.style.display = 'block';
        if (q) {
          item.style.background = 'rgba(6, 182, 212, 0.12)';
          item.style.borderRadius = 'var(--radius-sm)';
        } else {
          item.style.background = 'transparent';
        }
      } else {
        item.style.display = 'none';
      }
    });
  }
};
