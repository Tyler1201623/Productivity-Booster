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

// Enhanced System Stats functionality
async function updateSystemStats() {
    const cpuElement = document.getElementById('cpu');
    const memoryElement = document.getElementById('memory');
    const diskElement = document.getElementById('disk');

    // CPU Usage (Live Percentage)
    try {
        if ('performance' in window && performance.now) {
            const start = performance.now();
            for (let i = 0; i < 1e7; i++) {} // CPU-intensive task for measurement
            const end = performance.now();
            const usagePercentage = Math.min(100, ((end - start) / 10).toFixed(2)); // Simulated usage percentage
            cpuElement.textContent = `${usagePercentage}% (${navigator.hardwareConcurrency || 'Unknown'} cores)`;
        } else {
            cpuElement.textContent = "Live CPU Data Not Available";
        }
    } catch (error) {
        cpuElement.textContent = "Error Fetching CPU Data";
    }
    cpuElement.style.color = "white";

    // Memory Usage
    try {
        if (navigator.deviceMemory) {
            const usedMemory = (navigator.deviceMemory * 1024); // Approximate memory in MB
            const totalMemory = `${navigator.deviceMemory}GB`;
            memoryElement.textContent = `${usedMemory.toFixed(2)}MB / ${totalMemory}`;
        } else {
            memoryElement.textContent = "Memory Data Not Available";
        }
    } catch (error) {
        memoryElement.textContent = "Error Fetching Memory Data";
    }
    memoryElement.style.color = "white";

    // Storage Usage
    try {
        if (navigator.storage && navigator.storage.estimate) {
            const estimate = await navigator.storage.estimate();
            const used = (estimate.usage / (1024 * 1024)).toFixed(2); // Convert bytes to MB
            const total = (estimate.quota / (1024 * 1024)).toFixed(2); // Convert bytes to MB
            diskElement.textContent = `${used}MB / ${total}MB`;
        } else {
            diskElement.textContent = "Storage Data Not Available";
        }
    } catch (error) {
        diskElement.textContent = "Error Fetching Storage Data";
    }
    diskElement.style.color = "white";
}

// Task functionality
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
                <button onclick="editNote(${note.id})">Edit</button>
                <button onclick="deleteNote(${note.id})">Delete</button>
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
};
