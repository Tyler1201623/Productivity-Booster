// Quotes array
const quotes = [
    "The only way to do great work is to love what you do.",
    "Every moment is a fresh beginning.",
    "Believe you can and you're halfway there.",
    "Make each day your masterpiece.",
    "Success is not final, failure is not fatal.",
    "Dream big and dare to fail.",
    "The future belongs to those who believe in the beauty of their dreams.",
    "Don't wait. The time will never be just right.",
    "Your time is limited, don't waste it living someone else's life.",
    "Stay hungry, stay foolish."
];

// Font sizes like Microsoft Word
const fontSizes = [11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72];

// Clock functionality
function updateClock() {
    const now = new Date();
    document.getElementById('time').textContent = now.toLocaleTimeString();
    document.getElementById('date').textContent = now.toLocaleDateString();
}

// Quotes functionality
function updateQuote() {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    document.getElementById('quote').textContent = randomQuote;
}
  // Advanced System Performance Monitor
  class SystemMonitor {
      constructor() {
          this.cpuElement = document.getElementById('cpu');
          this.memoryElement = document.getElementById('memory');
          this.storageElement = document.getElementById('disk');
      }

      async getCPUUsage() {
          // Use performance.now() for more accurate CPU measurement
          const startTime = performance.now();
          const startCycles = await this.getCPUCycles();
        
          await new Promise(r => setTimeout(r, 500)); // Longer sampling period
        
          const endTime = performance.now();
          const endCycles = await this.getCPUCycles();
        
          const usage = ((endCycles - startCycles) / (endTime - startTime)) * 100;
          return {
              usage: Math.min(usage, 100).toFixed(1),
              cores: navigator.hardwareConcurrency
          };
      }

      async getCPUCycles() {
          return new Promise(resolve => {
              const work = () => {
                  const start = performance.now();
                  while (performance.now() - start < 5) {} // More intensive measurement
                  resolve(performance.now());
              };
              requestIdleCallback(work);
          });
      }

      async getMemoryInfo() {
          if (performance && performance.memory) {
              const totalRAM = navigator.deviceMemory * 1024 * 1024 * 1024;
              const usedRAM = performance.memory.usedJSHeapSize;
            
              return {
                  used: (usedRAM / (1024 * 1024 * 1024)).toFixed(2),
                  total: (totalRAM / (1024 * 1024 * 1024)).toFixed(2)
              };
          }
          return null;
      }

      async getStorageInfo() {
          if (navigator.storage && navigator.storage.estimate) {
              const {quota, usage} = await navigator.storage.estimate();
              return {
                  used: (usage / (1024 * 1024 * 1024)).toFixed(2),
                  total: (quota / (1024 * 1024 * 1024)).toFixed(2)
              };
          }
          return null;
      }

      async updateStats() {
          const cpuInfo = await this.getCPUUsage();
          const memInfo = await this.getMemoryInfo();
          const storageInfo = await this.getStorageInfo();

          if (cpuInfo) this.cpuElement.textContent = `${cpuInfo.usage}% (${cpuInfo.cores} cores)`;
          if (memInfo) this.memoryElement.textContent = `${memInfo.used}GB / ${memInfo.total}GB`;
          if (storageInfo) this.storageElement.textContent = `${storageInfo.used}GB / ${storageInfo.total}GB`;
      }

      start() {
          this.updateStats();
          setInterval(() => this.updateStats(), 1000);
      }
  }

  // Initialize and start monitoring
  const systemMonitor = new SystemMonitor();
  systemMonitor.start();

// Dev Focus Zone Functionality
class DevFocusZone {
    constructor() {
        this.timeLeft = 25 * 60;
        this.isRunning = false;
        this.streak = parseInt(localStorage.getItem('codingStreak')) || 0;
        this.lastCoded = localStorage.getItem('lastCoded');
        this.progress = parseInt(localStorage.getItem('dailyProgress')) || 0;
        
        this.initializeTimers();
        this.updateStreak();
        this.updateProgress();
    }

    initializeTimers() {
        document.getElementById('startTimer').addEventListener('click', () => this.toggleTimer());
        document.getElementById('resetTimer').addEventListener('click', () => this.resetTimer());
        this.updateTimerDisplay();
    }

    toggleTimer() {
        if (this.isRunning) {
            clearInterval(this.interval);
            document.getElementById('startTimer').textContent = 'Start Focus';
        } else {
            this.interval = setInterval(() => this.updateTimer(), 1000);
            document.getElementById('startTimer').textContent = 'Pause';
        }
        this.isRunning = !this.isRunning;
    }

    updateTimer() {
        if (this.timeLeft > 0) {
            this.timeLeft--;
            this.updateTimerDisplay();
        } else {
            this.completeSession();
        }
    }

    updateTimerDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        document.getElementById('timer').textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    completeSession() {
        this.progress += 25;
        localStorage.setItem('dailyProgress', this.progress);
        this.updateProgress();
        this.updateStreak();
        this.resetTimer();
    }

    resetTimer() {
        clearInterval(this.interval);
        this.timeLeft = 25 * 60;
        this.isRunning = false;
        document.getElementById('startTimer').textContent = 'Start Focus';
        this.updateTimerDisplay();
    }

    updateProgress() {
        const progress = Math.min(this.progress, 100);
        document.getElementById('progressFill').style.width = `${progress}%`;
    }

    updateStreak() {
        const today = new Date().toDateString();
        if (this.lastCoded !== today) {
            this.streak++;
            localStorage.setItem('codingStreak', this.streak);
            localStorage.setItem('lastCoded', today);
        }
        document.getElementById('streakCount').textContent = `${this.streak} days`;
    }
}

// Initialize Dev Focus Zone
const devFocus = new DevFocusZone();// Task functionality
let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');

function addTask() {
    const input = document.getElementById('taskInput');
    if (input.value.trim()) {
        tasks.push({ id: Date.now(), text: input.value, completed: false });
        localStorage.setItem('tasks', JSON.stringify(tasks));
        input.value = '';
        renderTasks();
    }
}

function renderTasks() {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = tasks.map(task => `
        <div class="task">
            <input type="checkbox" ${task.completed ? 'checked' : ''} 
                   onclick="toggleTask(${task.id})">
            <span style="margin-left: 8px; ${task.completed ? 'text-decoration: line-through' : ''}">${task.text}</span>
            <button onclick="deleteTask(${task.id})" class="delete-btn">Delete</button>
        </div>
    `).join('');
}

function toggleTask(id) {
    tasks = tasks.map(task => 
        task.id === id ? {...task, completed: !task.completed} : task
    );
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
}

// Notes functionality with Word-like font size control
let notes = JSON.parse(localStorage.getItem('notes') || '[]');
let currentFontSize = localStorage.getItem('notepadFontSize') || '16';

function initializeNotepad() {
    const notepad = document.getElementById('notepad');
    notepad.style.fontSize = `${currentFontSize}px`;
    notepad.style.minHeight = '300px';
    notepad.style.padding = '15px';
    notepad.style.lineHeight = '1.5';
    notepad.style.border = '1px solid #ddd';
    notepad.style.borderRadius = '5px';
    notepad.style.boxShadow = 'inset 0 1px 3px rgba(0,0,0,0.1)';
    notepad.style.fontFamily = "'Poppins', sans-serif";
    notepad.style.width = '100%';
    notepad.style.resize = 'vertical';
    
    // Add font size dropdown to the UI
    const controls = document.createElement('div');
    controls.innerHTML = `
        <div style="margin-bottom: 10px; display: flex; gap: 10px; align-items: center;">
            <select id="fontSizeSelect" onchange="changeFontSize(this.value)">
                ${fontSizes.map(size => 
                    `<option value="${size}" ${size == currentFontSize ? 'selected' : ''}>${size}</option>`
                ).join('')}
            </select>
            <span>Font Size</span>
        </div>
    `;
    notepad.parentNode.insertBefore(controls, notepad);
}

function changeFontSize(newSize) {
    const notepad = document.getElementById('notepad');
    currentFontSize = newSize;
    localStorage.setItem('notepadFontSize', currentFontSize);
    notepad.style.fontSize = `${currentFontSize}px`;
}

function createNote() {
    const notepad = document.getElementById('notepad');
    const noteText = notepad.value.trim();
    if (noteText) {
        const note = {
            id: Date.now(),
            text: noteText,
            date: new Date().toLocaleString(),
            fontSize: currentFontSize
        };
        notes.unshift(note);
        localStorage.setItem('notes', JSON.stringify(notes));
        notepad.value = '';
        renderNotes();
    }
}

function renderNotes() {
    const savedNotes = document.getElementById('savedNotes');
    savedNotes.innerHTML = notes.map(note => `
        <div class="saved-note">
            <div class="note-header">
                <span>${note.date}</span>
                <span>Font Size: ${note.fontSize}</span>
            </div>
            <div style="white-space: pre-wrap; font-size: ${note.fontSize}px;">${note.text}</div>
            <div class="note-actions">
                <button onclick="editNote(${note.id})" class="edit-btn">Edit</button>
                <button onclick="deleteNote(${note.id})" class="delete-btn">Delete</button>
            </div>
        </div>
    `).join('');
}

function editNote(id) {
    const note = notes.find(n => n.id === id);
    if (note) {
        const notepad = document.getElementById('notepad');
        notepad.value = note.text;
        currentFontSize = note.fontSize;
        notepad.style.fontSize = `${currentFontSize}px`;
        document.getElementById('fontSizeSelect').value = currentFontSize;
        deleteNote(id);
        notepad.focus();
    }
}

function deleteNote(id) {
    notes = notes.filter(note => note.id !== id);
    localStorage.setItem('notes', JSON.stringify(notes));
    renderNotes();
}

function clearNoteForm() {
    document.getElementById('notepad').value = '';
}

function saveNote() {
    const notepad = document.getElementById('notepad');
    localStorage.setItem('currentNote', notepad.value);
}

// Initialize everything
window.onload = () => {
    setInterval(updateClock, 1000); // Clock updates every second
    setInterval(updateQuote, 30000); // Quotes update every 30 seconds
    updateClock();
    updateQuote();
    updateSystemStats(); // Initial stats update
    setInterval(updateSystemStats, 10000); // Update stats every 10 seconds
    renderTasks();
    renderNotes();
    initializeNotepad();
    const savedNote = localStorage.getItem('currentNote');
    if (savedNote) {
        document.getElementById('notepad').value = savedNote;
    }
};
