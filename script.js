// Enhanced CTF Challenge Script with Modern UI
class CTFChallenge {
    constructor() {
        this.challenges = {
            1: { completed: false, name: 'Hidden Directory' },
            2: { completed: false, name: 'Hash Cracking' },
            3: { completed: false, name: 'Base64 Decoding' },
            4: { completed: false, name: 'Service Discovery' }
        };
        
        // Correct answers - some stored in Base64 for obfuscation
        this.correctAnswers = {
            hiddenDir: "294de3557d9d00b3d2d8a1e6aab028cf", // MD5 hash of "anonymous"
            crackstation: "YW5vbnltb3Vz", // Base64: "anonymous"
            base64: "ZmxhZ3tZb3VfbmFpbGVkX2l0fQ==", // Base64: "flag{You_nailed_it}"
            service: "cGFydGljbGUxNA==" // Base64: "particle14"
        };
        
        // Secret flag stored Base64 (only decoded if input is correct)
        this.hiddenFlag = "U3VjY2Vzc3wgeW91J3ZlIGdvdCBpdCEK"; // "Success| you've got it!"
        
        this.init();
    }
    
    init() {
        this.updateProgress();
        this.addKeyboardListeners();
        this.addAnimationEffects();
    }
    
    // Decode helper
    decodeBase64(b64) {
        try {
            return atob(b64);
        } catch (e) {
            console.error('Base64 decode error:', e);
            return '';
        }
    }
    
    // Update progress bar and counter
    updateProgress() {
        const completed = Object.values(this.challenges).filter(c => c.completed).length;
        const total = Object.keys(this.challenges).length;
        const percentage = (completed / total) * 100;
        
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');
        
        if (progressFill) {
            progressFill.style.width = `${percentage}%`;
        }
        
        if (progressText) {
            progressText.textContent = `${completed}/${total} Challenges Completed`;
        }
        
        // Add completion celebration
        if (completed === total && completed > 0) {
            setTimeout(() => {
                this.showCompletionCelebration();
            }, 1000);
        }
    }
    
    // Mark challenge as completed
    markChallengeCompleted(challengeId) {
        this.challenges[challengeId].completed = true;
        
        // Update UI
        const challengeCard = document.querySelector(`[data-challenge="${challengeId}"]`);
        const statusIcon = document.getElementById(`status${challengeId}`);
        
        if (challengeCard) {
            challengeCard.classList.add('completed');
        }
        
        if (statusIcon) {
            statusIcon.innerHTML = '<i class="fas fa-check"></i>';
            statusIcon.classList.add('completed');
        }
        
        this.updateProgress();
        this.addSuccessAnimation(challengeCard);
    }
    
    // Add success animation to challenge card
    addSuccessAnimation(element) {
        if (!element) return;
        
        element.style.animation = 'none';
        element.offsetHeight; // Trigger reflow
        element.style.animation = 'pulse 0.6s ease-in-out';
        
        setTimeout(() => {
            element.style.animation = '';
        }, 600);
    }
    
    // General check function with enhanced UI feedback
    checkAnswer(userInput, correctAnswer, challengeId, inputEl, buttonEl) {
        const userValue = userInput.value.trim();
        
        // Determine if we need to decode Base64 based on the challenge
        let correctValue;
        if (challengeId === 1) {
            // Hidden directory - direct string comparison
            correctValue = correctAnswer.trim();
        } else {
            // Other challenges use Base64 encoded answers
            correctValue = this.decodeBase64(correctAnswer).trim();
        }
        
        // Show loading state
        this.showLoadingState(buttonEl);
        
        setTimeout(() => {
            if (userValue.toLowerCase() === correctValue.toLowerCase()) {
                this.handleCorrectAnswer(challengeId, inputEl, buttonEl);
            } else {
                this.handleIncorrectAnswer(inputEl, buttonEl);
            }
        }, 800); // Simulate processing time
    }
    
    // Handle correct answer
    handleCorrectAnswer(challengeId, inputEl, buttonEl) {
        // Disable input and button
        inputEl.disabled = true;
        inputEl.classList.add('completed');
        
        buttonEl.disabled = true;
        buttonEl.innerHTML = '<i class="fas fa-check"></i><span>COMPLETED</span>';
        buttonEl.classList.add('completed');
        
        // Mark challenge as completed
        this.markChallengeCompleted(challengeId);
        
        // Show success message
        const successMessage = this.decodeBase64(this.hiddenFlag);
        this.showModal('successModal', successMessage);
        
        // Add success sound effect (optional)
        this.playSuccessSound();
    }
    
    // Handle incorrect answer
    handleIncorrectAnswer(inputEl, buttonEl) {
        // Reset button state
        this.resetButtonState(buttonEl);
        
        // Add error animation
        inputEl.classList.add('error-shake');
        setTimeout(() => {
            inputEl.classList.remove('error-shake');
        }, 600);
        
        // Show error modal
        this.showModal('errorModal');
        
        // Focus back to input
        setTimeout(() => {
            inputEl.focus();
        }, 100);
    }
    
    // Show loading state
    showLoadingState(buttonEl) {
        const originalContent = buttonEl.innerHTML;
        buttonEl.innerHTML = '<div class="loading"></div><span>CHECKING...</span>';
        buttonEl.disabled = true;
        buttonEl.dataset.originalContent = originalContent;
    }
    
    // Reset button state
    resetButtonState(buttonEl) {
        const originalContent = buttonEl.dataset.originalContent;
        if (originalContent) {
            buttonEl.innerHTML = originalContent;
        }
        buttonEl.disabled = false;
    }
    
    // Show modal
    showModal(modalId, message = '') {
        const modal = document.getElementById(modalId);
        if (!modal) return;
        
        if (message && modalId === 'successModal') {
            const messageEl = document.getElementById('successMessage');
            if (messageEl) {
                messageEl.textContent = message;
            }
        }
        
        modal.classList.add('show');
        
        // Auto-close after 3 seconds for success modal
        if (modalId === 'successModal') {
            setTimeout(() => {
                this.closeModal();
            }, 3000);
        }
    }
    
    // Close modal
    closeModal() {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.classList.remove('show');
        });
    }
    
    // Add keyboard listeners
    addKeyboardListeners() {
        // Enter key submission
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const focusedElement = document.activeElement;
                if (focusedElement && focusedElement.classList.contains('cyber-input')) {
                    const inputId = focusedElement.id;
                    const buttonId = inputId.replace('Input', 'Btn');
                    const button = document.getElementById(buttonId);
                    if (button && !button.disabled) {
                        button.click();
                    }
                }
            }
            
            // Escape key to close modals
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    }
    
    // Add animation effects
    addAnimationEffects() {
        // Add CSS for error shake animation
        if (!document.getElementById('errorShakeStyle')) {
            const style = document.createElement('style');
            style.id = 'errorShakeStyle';
            style.textContent = `
                .error-shake {
                    animation: shake 0.6s ease-in-out;
                    border-color: var(--error-color) !important;
                }
                
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                    20%, 40%, 60%, 80% { transform: translateX(5px); }
                }
                
                .cyber-input.completed {
                    border-color: var(--success-color);
                    background: rgba(0, 255, 65, 0.1);
                }
                
                .cyber-btn.completed {
                    background: var(--success-color);
                    color: var(--bg-dark);
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // Play success sound (optional)
    playSuccessSound() {
        // Using Web Audio API for a simple beep
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.1);
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.2);
        } catch (e) {
            // Fallback or ignore if Web Audio API is not supported
            console.log('Audio feedback not available');
        }
    }
    
    // Show completion celebration
    showCompletionCelebration() {
        const message = "🎉 Congratulations! You've completed all challenges! 🎉";
        this.showModal('successModal', message);
        
        // Add celebration animation to the whole page
        document.body.style.animation = 'celebrationPulse 2s ease-in-out';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 2000);
    }
}

// Initialize CTF Challenge system
const ctf = new CTFChallenge();

// Challenge check functions (maintain original API)
function checkHiddenDir() {
    const input = document.getElementById("hiddenDirInput");
    const button = document.getElementById("hiddenDirBtn");
    ctf.checkAnswer(input, ctf.correctAnswers.hiddenDir, 1, input, button);
}

function checkCrackstation() {
    const input = document.getElementById("crackHashInput");
    const button = document.getElementById("crackHashBtn");
    ctf.checkAnswer(input, ctf.correctAnswers.crackstation, 2, input, button);
}

function checkBase64() {
    const input = document.getElementById("base64Input");
    const button = document.getElementById("base64Btn");
    ctf.checkAnswer(input, ctf.correctAnswers.base64, 3, input, button);
}

function checkService() {
    const input = document.getElementById("serviceInput");
    const button = document.getElementById("serviceBtn");
    ctf.checkAnswer(input, ctf.correctAnswers.service, 4, input, button);
}

// Modal close function
function closeModal() {
    ctf.closeModal();
}

// Add celebration animation CSS
document.addEventListener('DOMContentLoaded', () => {
    const celebrationStyle = document.createElement('style');
    celebrationStyle.textContent = `
        @keyframes celebrationPulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.02); }
        }
    `;
    document.head.appendChild(celebrationStyle);
});

// Add click outside modal to close
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        ctf.closeModal();
    }
});

// Add responsive touch events for mobile
if ('ontouchstart' in window) {
    document.addEventListener('touchstart', () => {
        // Enable touch feedback
    });
}

// Export for potential testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CTFChallenge, ctf };
}
