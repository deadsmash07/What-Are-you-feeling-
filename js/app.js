function journalApp() {
  return {
    view: 'picker',           // 'picker' | 'prompt' | 'thankYou'
    categories: [],           // loaded from JSON
    currentCategory: null,    // the one the user clicked
    answers: [],              // textarea-bound answers
    isLoading: true,          // loading state for better UX
    currentSessionStats: {    // track session stats
      categoriesCompleted: 0,
      totalCharactersWritten: 0,
      startTime: null
    },

    async init() {
      this.isLoading = true;
      this.currentSessionStats.startTime = new Date();
      
      try {
        const res = await fetch('/questions.json');
        if (!res.ok) {
          throw new Error(`Failed to fetch questions: ${res.status} ${res.statusText}`);
        }
        const text = await res.text();
        try {
          this.categories = JSON.parse(text);
          console.log('Categories loaded:', this.categories);
          
          // Add animation delay indices to categories for staggered appearance
          this.categories.forEach((cat, index) => {
            cat.animationIndex = index;
            // Add style attribute for tailwind animation
            cat.animationStyle = `--index: ${index}`;
          });
          
        } catch (parseError) {
          console.error('JSON parse error:', parseError, 'Raw text:', text);
          alert('Error loading questions: Invalid JSON format');
        }
      } catch (err) {
        console.error('Could not load questions:', err);
        alert('Failed to load questions. Please check the console for details.');
      } finally {
        this.isLoading = false;
      }
    },

    selectCategory(cat) {
      this.currentCategory = cat;
      // initialize blank answers array
      this.answers = Array(cat.questions.length).fill('');
      this.view = 'prompt';
      
      // Add smooth page transition
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // focus first textarea with slight delay for better UX
      this.$nextTick(() => {
        setTimeout(() => {
          const ta = this.$root.querySelector('textarea');
          if (ta) {
            ta.focus();
            // Subtle animation for the textarea
            ta.classList.add('focus-visible');
            setTimeout(() => ta.classList.remove('focus-visible'), 800);
          }
        }, 300);
      });
    },

    submit() {
      // Calculate stats for this session
      this.currentSessionStats.categoriesCompleted++;
      const charsWritten = this.answers.reduce((sum, answer) => sum + answer.length, 0);
      this.currentSessionStats.totalCharactersWritten += charsWritten;
      
      // Enhanced confetti effect based on how much was written
      const particleMultiplier = Math.min(Math.max(charsWritten / 100, 1), 4);
      
      confetti({
        particleCount: Math.round(200 * particleMultiplier),
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#26ccff', '#a25afd', '#ff5e7e', '#88ff5a', '#fcff42', '#ffa62d', '#ff36ff'],
        startVelocity: 30,
        decay: 0.94,
        scalar: 0.8
      });
      
      // show thank‑you, then reset with longer display time
      this.view = 'thankYou';
      
      // Calculate a more meaningful display time (3-5 seconds)
      const displayTime = Math.min(3000 + (charsWritten / 50), 5000);
      
      setTimeout(() => {
        this.view = 'picker';
      }, displayTime);
    },
    
    // Helper function to calculate progress percentage
    // Your getProgress() method is already correct, but let's make sure we're using it properly:
    
    getProgress() {
      if (!this.currentCategory) return 0;
      const answeredQuestions = this.answers.filter(a => a.trim().length > 0).length;
      return (answeredQuestions / this.currentCategory.questions.length) * 100;
    },
    
    // Format time spent on a category
    formatTimeSpent() {
      if (!this.currentSessionStats.startTime) return '0 minutes';
      const now = new Date();
      const diffMs = now - this.currentSessionStats.startTime;
      const minutes = Math.round(diffMs / 60000);
      return minutes <= 1 ? '1 minute' : `${minutes} minutes`;
    },
    
    // Get estimated reading time of answers
    getReadingTime() {
      const totalWords = this.answers
        .join(' ')
        .split(/\s+/)
        .filter(word => word.length > 0).length;
      
      const minutes = Math.max(1, Math.round(totalWords / 200)); // Average reading speed
      return minutes <= 1 ? '1 minute read' : `${minutes} minute read`;
    },
    
    // Returns different motivational messages based on progress
    getMotivationalMessage() {
      const progress = this.getProgress();
      if (progress === 0) return "Ready to begin your reflection journey?";
      if (progress < 25) return "Great start! Keep exploring your thoughts.";
      if (progress < 50) return "You're making progress. Keep going!";
      if (progress < 75) return "You're doing great! Deeper insights await.";
      if (progress < 100) return "Almost there! Finish strong.";
      return "Wonderful job completing your reflection!";
    }
  };
}