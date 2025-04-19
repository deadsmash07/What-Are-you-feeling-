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
      
      // Set CSS variables for consistent styling
      document.documentElement.style.setProperty('--textarea-color', cat.accent + '40'); // 25% opacity
      document.documentElement.style.setProperty('--button-color', cat.accent);
      
      // Create a slightly different shade for gradient
      const buttonColor2 = this.adjustColorBrightness(cat.accent, 20);
      document.documentElement.style.setProperty('--button-color2', buttonColor2);
      
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
    
    // Helper function to adjust color brightness
    adjustColorBrightness(hex, percent) {
      // Convert hex to RGB
      let r = parseInt(hex.substring(1, 3), 16);
      let g = parseInt(hex.substring(3, 5), 16);
      let b = parseInt(hex.substring(5, 7), 16);
      
      // Adjust brightness
      r = Math.min(255, Math.max(0, r + percent));
      g = Math.min(255, Math.max(0, g + percent));
      b = Math.min(255, Math.max(0, b + percent));
      
      // Convert back to hex
      return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    },
    
    submit() {
      // Calculate stats for this session
      this.currentSessionStats.categoriesCompleted++;
      const charsWritten = this.answers.reduce((sum, answer) => sum + answer.length, 0);
      this.currentSessionStats.totalCharactersWritten += charsWritten;
      
      // Enhanced confetti effect based on how much was written
      const particleMultiplier = Math.min(Math.max(charsWritten / 100, 1), 4);
      
      // Create a dynamic confetti color palette based on the category color
      const categoryColor = this.currentCategory?.accent || '#4ade80';
      const baseColors = ['#26ccff', '#a25afd', '#ff5e7e', '#88ff5a', '#fcff42', '#ffa62d', '#ff36ff'];
      const colors = [...baseColors, categoryColor];
      
      // Fire multiple confetti bursts for a more impressive effect
      const burstConfetti = () => {
        confetti({
          particleCount: Math.round(100 * particleMultiplier),
          spread: 70,
          origin: { y: 0.6 },
          colors: colors,
          startVelocity: 30,
          decay: 0.94,
          scalar: 0.8
        });
      };
      
      // Initial burst
      burstConfetti();
      
      // Follow-up burst for longer writing
      if (charsWritten > 300) {
        setTimeout(burstConfetti, 300);
      }
      
      // show thank-you, then reset with longer display time
      this.view = 'thankYou';
      
      // Calculate a more meaningful display time (3-6 seconds)
      const displayTime = Math.min(3000 + (charsWritten / 40), 6000);
      
      setTimeout(() => {
        this.view = 'picker';
        // Reset the header background when returning to the picker
        document.documentElement.style.removeProperty('--textarea-color');
        document.documentElement.style.removeProperty('--button-color');
        document.documentElement.style.removeProperty('--button-color2');
      }, displayTime);
    },
    
    // Helper function to calculate progress percentage
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