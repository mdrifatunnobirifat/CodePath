// CodePath Quizzes & Timed Quiz Mode (FR-Q1, FR-Q3, FR-Q4)
const QuizzesView = {
  currentQuizId: 'quiz-js-1',
  userAnswers: {},
  submittedFeedback: null,
  isTimedMode: false,
  timerSecondsRemaining: 900, // 15 mins
  timerInterval: null,

  async render(params = {}) {
    const app = document.getElementById('app');
    if (params.quizId) this.currentQuizId = params.quizId;

    app.innerHTML = '<div class="notice">Loading quiz questions...</div>';

    try {
      const res = await Store.api(`/quizzes/${this.currentQuizId}`);
      const quiz = res.quiz;

      app.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 16px;">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
            <div>
              <h2>${quiz.title}</h2>
              <p class="tag">${quiz.description}</p>
            </div>
            <div style="display: flex; gap: 8px;">
              <button class="btn ${this.isTimedMode ? 'p' : ''}" onclick="QuizzesView.toggleTimedMode()">
                ⏱️ ${this.isTimedMode ? `Timer: ${Math.floor(this.timerSecondsRemaining / 60)}:${('0' + (this.timerSecondsRemaining % 60)).slice(-2)}` : 'Start Timed Mode'}
              </button>
            </div>
          </div>

          <!-- Quiz Selector Pills -->
          <div class="chips">
            ${[
              { id: 'quiz-js-1', label: 'JavaScript Core' },
              { id: 'quiz-react-1', label: 'React Components' },
              { id: 'quiz-python-1', label: 'Python Systems' },
              { id: 'quiz-sql-1', label: 'Relational SQL' },
              { id: 'quiz-dotnet-1', label: 'C# & .NET' }
            ].map(q => `
              <button class="chip" aria-pressed="${q.id === this.currentQuizId}" onclick="QuizzesView.switchQuiz('${q.id}')">${q.label}</button>
            `).join('')}
          </div>

          <!-- Quiz Questions Form -->
          <div style="display: flex; flex-direction: column; gap: 14px;">
            ${quiz.questions.map((q, qIndex) => {
              const fb = this.submittedFeedback?.feedback?.find(f => f.questionId === q.id);
              return `
                <div class="card" style="border-left: 4px solid ${fb ? (fb.isCorrect ? 'var(--ok)' : 'var(--bad)') : 'var(--line)'};">
                  <h4 style="margin-bottom: 10px;">${qIndex + 1}. ${CodeEditor.escapeHtml(q.prompt)}</h4>
                  <div style="display: flex; flex-direction: column; gap: 8px;">
                    ${q.options.map((opt, optIndex) => {
                      const isSelected = this.userAnswers[q.id] === optIndex;
                      let optClass = '';
                      if (fb) {
                        if (optIndex === fb.correctAnswer) optClass = 'style="background: rgba(27, 138, 75, 0.15); font-weight: bold;"';
                        else if (isSelected && !fb.isCorrect) optClass = 'style="background: rgba(192, 57, 43, 0.15); text-decoration: line-through;"';
                      }
                      return `
                        <label ${optClass} style="display: flex; align-items: center; gap: 10px; padding: 8px 12px; border-radius: 6px; border: 1px solid var(--line); cursor: pointer;">
                          <input type="radio" name="question_${q.id}" value="${optIndex}" ${isSelected ? 'checked' : ''} onchange="QuizzesView.selectAnswer('${q.id}', ${optIndex})" ${this.submittedFeedback ? 'disabled' : ''} style="accent-color: var(--acc);" />
                          <span>${CodeEditor.escapeHtml(opt)}</span>
                        </label>
                      `;
                    }).join('')}
                  </div>
                  ${fb ? `
                    <div style="margin-top: 10px; padding: 10px; border-radius: 6px; background: var(--code); font-size: 14px;">
                      <b>${fb.isCorrect ? '✓ Correct!' : '✗ Needs Review:'}</b> ${CodeEditor.escapeHtml(fb.explanation)}
                    </div>
                  ` : ''}
                </div>
              `;
            }).join('')}
          </div>

          <!-- Score Card / Submit Button -->
          <div class="card" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
            <div>
              ${this.submittedFeedback ? `
                <h3>Score: ${this.submittedFeedback.score} / ${this.submittedFeedback.total} (${this.submittedFeedback.percent}%)</h3>
                <span class="tag">Missed questions have been added to your Spaced Repetition Revision Queue.</span>
              ` : `
                <span class="tag">${Object.keys(this.userAnswers).length} of ${quiz.questions.length} answered</span>
              `}
            </div>
            <div style="display: flex; gap: 10px;">
              ${this.submittedFeedback ? `
                <button class="btn p" onclick="QuizzesView.retake()">Retake Quiz 🔄</button>
              ` : `
                <button class="btn p" onclick="QuizzesView.submitAttempt()">Submit Answers ✓</button>
              `}
            </div>
          </div>
        </div>
      `;
    } catch (err) {
      app.innerHTML = `<div class="res"><div class="no">Error loading quiz: ${err.message}</div></div>`;
    }
  },

  selectAnswer(qId, val) {
    this.userAnswers[qId] = val;
  },

  switchQuiz(quizId) {
    this.currentQuizId = quizId;
    this.userAnswers = {};
    this.submittedFeedback = null;
    this.render();
  },

  toggleTimedMode() {
    this.isTimedMode = !this.isTimedMode;
    if (this.isTimedMode) {
      this.timerSecondsRemaining = 900;
      this.timerInterval = setInterval(() => {
        this.timerSecondsRemaining--;
        if (this.timerSecondsRemaining <= 0) {
          clearInterval(this.timerInterval);
          Store.toast('Time is up! Auto-submitting quiz.', 'warning');
          this.submitAttempt();
        }
        const timerBtn = document.querySelector('.btn.p');
        if (timerBtn && this.isTimedMode) {
          timerBtn.innerHTML = `⏱️ Timer: ${Math.floor(this.timerSecondsRemaining / 60)}:${('0' + (this.timerSecondsRemaining % 60)).slice(-2)}`;
        }
      }, 1000);
      Store.toast('15-Minute Timed Quiz started! Good luck!', 'info');
    } else {
      clearInterval(this.timerInterval);
    }
    this.render();
  },

  async submitAttempt() {
    clearInterval(this.timerInterval);
    try {
      const res = await Store.api(`/quizzes/${this.currentQuizId}/attempt`, 'POST', {
        answers: this.userAnswers
      });
      this.submittedFeedback = res;
      Store.toast(`Quiz finished! Score: ${res.score}/${res.total} (${res.percent}%)`, res.percent >= 75 ? 'success' : 'info');
      this.render();
    } catch (e) {
      Store.toast('Failed to submit quiz attempt', 'error');
    }
  },

  retake() {
    this.userAnswers = {};
    this.submittedFeedback = null;
    this.render();
  }
};

