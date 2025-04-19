function journalApp() {
  return {
    view: 'picker',           // 'picker' | 'prompt' | 'thankYou'
    categories: [],           // loaded from JSON
    currentCategory: null,    // the one the user clicked
    answers: [],              // textarea-bound answers

    async init() {
      // load questions.json from root
      try {
        const res = await fetch('questions.json');
        this.categories = await res.json();
      } catch (err) {
        console.error('Could not load questions:', err);
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
