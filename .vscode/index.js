let currentUser = null;
let notes = [];
let folders = [];
let editingNoteIndex = null;

// Declare variables
// Load user details, notes, and folders on page load
window.onload = function() {
    loadUserDetails();
    loadNotes();
    loadFolders();
};

function loadUserDetails() {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
        currentUser = JSON.parse(storedUser);
        document.getElementById('user-display').innerText = currentUser;
        document.getElementById('login-container').style.display = 'none';
        document.getElementById('notes-container').style.display = 'block';
    }
}

function loadNotes() {
    const storedNotes = localStorage.getItem('notes');
    notes = storedNotes ? JSON.parse(storedNotes) : [];
}

function loadFolders() {
    const storedFolders = localStorage.getItem('folders');
    folders = storedFolders ? JSON.parse(storedFolders) : [];
}

function saveUserDetails() {
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
}

function saveNotes() {
    localStorage.setItem('notes', JSON.stringify(notes));
}

function saveFolders() {
    localStorage.setItem('folders', JSON.stringify(folders));
}

function login() {
    // After successful login, save user details and load other data
    saveUserDetails();
    loadNotes();
    loadFolders();
}

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Check if the user exists in localStorage
    const storedUser = localStorage.getItem(username);

    if (storedUser) {
        const userObj = JSON.parse(storedUser);
        if (userObj.password === password) {
            currentUser = username;
            document.getElementById('user-display').innerText = currentUser;
            document.getElementById('login-container').style.display = 'none';
            document.getElementById('notes-container').style.display = 'block';
            loadNotes();
            loadFolders(); // Load folders along with notes
        } else {
            alert('Invalid password');
        }
    } else {
        alert('User not found. Please register.');
    }
}


function register() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Check if the user already exists
    if (!localStorage.getItem(username)) {
        const userObj = {
            username,
            password
        };
        localStorage.setItem(username, JSON.stringify(userObj));
        alert('Registration successful! You can now log in.');
    } else {
        alert('Username already exists. Please choose a different username.');
    }
}

function logout() {
    currentUser = null;
    document.getElementById('login-container').style.display = 'block';
    document.getElementById('notes-container').style.display = 'none';
}

function showCreateFolderForm() {
    const folderForms = document.getElementById('folder-forms');
    folderForms.style.display = 'block';
}

function createFolder() {
    const folderName = document.getElementById('folder-name').value.trim();
    if (folderName) {
        folders.push({
            name: folderName,
            notes: []
        });
        saveFoldersToLocalStorage();
        loadFolders();
        document.getElementById('folder-name').value = '';
    }
}

function showAddNoteToFolderForm() {
    const folderSelector = document.getElementById('folder-selector');
    folderSelector.innerHTML = '<option value="" selected disabled>Select a Folder</option>';

    for (const folder of folders) {
        const option = document.createElement('option');
        option.value = folder.name;
        option.innerText = folder.name;
        folderSelector.appendChild(option);
    }

    const folderForms = document.getElementById('folder-forms');
    folderForms.style.display = 'block';
}

function addNoteToFolder() {
    const selectedNoteIndex = getSelectedNote();
    const selectedFolderName = document.getElementById('folder-selector').value;

    if (selectedNoteIndex !== null && selectedFolderName) {
        const selectedFolder = folders.find(folder => folder.name === selectedFolderName);
        if (selectedFolder) {
            const selectedNote = notes[selectedNoteIndex];
            selectedFolder.notes.push(selectedNote);
            saveFoldersToLocalStorage();
            loadFolders();
        }
    } else {
        alert('Please select a note and a folder.');
    }
}

function getSelectedNote() {
    const notesList = document.getElementById('notes-list');
    const selectedNoteIndex = notesList.selectedIndex;

    return selectedNoteIndex !== -1 ? selectedNoteIndex : null;
}

function saveFoldersToLocalStorage() {
    localStorage.setItem('folders', JSON.stringify(folders));
}

function loadFolders() {
    const storedFolders = localStorage.getItem('folders');
    folders = storedFolders ? JSON.parse(storedFolders) : [];
}

function showCreateNoteForm() {
    editingNoteIndex = null;
    showNoteForm('Create Note', '');
}

function showNoteForm(title = '', text = '') {
    const formTitle = document.getElementById('form-title');
    const noteInput = document.getElementById('note-input');
    const noteForm = document.getElementById('note-form');

    formTitle.innerText = title;
    noteInput.value = text || ''; 

    noteForm.style.display = 'block';
}

function showEditNoteForm() {
    const selectedNoteIndex = getSelectedNote();
    if (selectedNoteIndex !== null && selectedNoteIndex < notes.length) {
        const selectedNote = notes[selectedNoteIndex];
        if (selectedNote) {
            editingNoteIndex = selectedNoteIndex;
            showNoteForm('Edit Note', selectedNote.text);
        } else {
            alert('Selected note is undefined. Please select a valid note.');
        }
    } else {
        alert('Please select a note to edit.');
    }
}

function saveNote() {
    const noteInput = document.getElementById('note-input');
    const noteText = noteInput.value.trim();

    if (noteText) {
        const newNote = {
            user: currentUser,
            text: noteText
        };

        if (editingNoteIndex !== null) {
            notes[editingNoteIndex] = newNote;
        } else {
            notes.push(newNote);
        }

        editingNoteIndex = null;
        cancelNote();
        loadNotes();
    }
}


function cancelNote() {
    const noteForm = document.getElementById('note-form');
    noteForm.style.display = 'none';
    document.getElementById('note-input').value = '';
}

function deleteNote() {
    const selectedNote = getSelectedNote();
    if (selectedNote !== null) {
        const confirmation = confirm('Are you sure you want to delete this note?');
        if (confirmation) {
            notes.splice(selectedNote, 1);
            loadNotes();
        }
    } else {
        alert('Please select a note to delete.');
    }
}

function getSelectedNote() {
    const notesList = document.getElementById('notes-list');
    const selectedNoteIndex = notesList.selectedIndex;

    return selectedNoteIndex !== -1 ? selectedNoteIndex : null;
}

function loadNotes() {
    const notesList = document.getElementById('notes-list');
    notesList.innerHTML = '';

    for (const note of notes.filter(note => note.user === currentUser)) {
        const li = document.createElement('li');
        li.className = 'note-item';
        li.innerText = note.text;
        notesList.appendChild(li);
    }
}