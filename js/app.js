function journalApp() {
  return {
    view: 'picker',           // 'picker' | 'prompt' | 'thankYou'
    categories: [],           // loaded from JSON
    currentCategory: null,    // the one the user clicked
    answers: [],              // textarea-bound answers

    // filepath: /home/arnav/Documents/Webdev/self_care/js/app.js
    async init() {
      try {
        const res = await fetch('/questions.json');
        if (!res.ok) {
          throw new Error(`Failed to fetch questions: ${res.status} ${res.statusText}`);
        }
        const text = await res.text();
        try {
          this.categories = JSON.parse(text);
          console.log('Categories loaded:', this.categories);
        } catch (parseError) {
          console.error('JSON parse error:', parseError, 'Raw text:', text);
          alert('Error loading questions: Invalid JSON format');
        }
      } catch (err) {
        console.error('Could not load questions:', err);
        alert('Failed to load questions. Please check the console for details.');
      }
    },

    selectCategory(cat) {
      this.currentCategory = cat;
      // initialize blank answers array
      this.answers = Array(cat.questions.length).fill('');
      this.view = 'prompt';
      // focus first textarea
      this.$nextTick(() => {
        const ta = this.$root.querySelector('textarea');
        ta && ta.focus();
      });
    },

    submit() {
      // celebrate!
      confetti({
        particleCount: 200,
        spread: 60,
        origin: { y: 0.6 }
      });
      // show thank‑you, then reset
      this.view = 'thankYou';
      setTimeout(() => {
        this.view = 'picker';
      }, 2000);
    }
  }
}
