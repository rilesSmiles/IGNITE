// DOM Elements
const submissionForm = document.getElementById('submission-form');
const memoryImageInput = document.getElementById('memory-image');
const imagePreview = document.getElementById('image-preview');
const previewImg = document.getElementById('preview-img');
const removeImageBtn = document.getElementById('remove-image');
const galleryGrid = document.getElementById('gallery-grid');
const filterButtons = document.querySelectorAll('.filter-btn');
const memoryModal = document.getElementById('memory-modal');
const modalImage = document.getElementById('modal-image');
const modalTitle = document.getElementById('modal-title');
const modalSubmitter = document.getElementById('modal-submitter');
const modalDescription = document.getElementById('modal-description');
const closeModal = document.querySelector('.close-modal');

let memories = [];

function init() {
    const savedMemories = localStorage.getItem('igniteMemories');
    if (savedMemories) {
        memories = JSON.parse(savedMemories);
    } else {
        memories = [...sampleMemories];
        localStorage.setItem('igniteMemories', JSON.stringify(memories));
    }
    
    displayMemories('all');
    
    setupEventListeners();
}
function setupEventListeners() {

    memoryImageInput.addEventListener('change', handleImagePreview);
    
    removeImageBtn.addEventListener('click', removeImage);

    submissionForm.addEventListener('submit', handleSubmission);

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
 
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            displayMemories(button.dataset.filter);
        });
    });

    closeModal.addEventListener('click', () => {
        memoryModal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === memoryModal) {
            memoryModal.style.display = 'none';
        }
    });
}

function handleImagePreview(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        
        reader.onload = function(event) {
            previewImg.src = event.target.result;
            imagePreview.style.display = 'block';
        };
        
        reader.readAsDataURL(file);
    }
}

function removeImage() {
    memoryImageInput.value = '';
    previewImg.src = '#';
    imagePreview.style.display = 'none';
}
function handleSubmission(e) {
    e.preventDefault();
    
    const name = document.getElementById('submitter-name').value;
    const title = document.getElementById('memory-title').value;
    const description = document.getElementById('memory-description').value;
    const imageFile = document.getElementById('memory-image').files[0];
    
    if (!imageFile) {
        alert('Please select an image to upload');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(event) {
        const imageUrl = event.target.result;
        
        const newMemory = {
            id: Date.now(),
            name,
            title,
            description,
            imageUrl,
            type: 'latest',
            timestamp: new Date().getTime()
        };
        
        memories.unshift(newMemory);
        
        localStorage.setItem('igniteMemories', JSON.stringify(memories));
        
        submissionForm.reset();
        removeImage();

        displayMemories('all');

        alert('Your design has been added to the time capsule!');
    };
    
    reader.readAsDataURL(imageFile);
}

function displayMemories(filter) {

    galleryGrid.innerHTML = '';

    let filteredMemories = [...memories];
    if (filter === 'latest') {
        filteredMemories = memories.filter(memory => memory.type === 'latest');
    } else if (filter === 'featured') {
        filteredMemories = memories.filter(memory => memory.type === 'featured');
    }

    filteredMemories.forEach(memory => {
        const galleryItem = createGalleryItem(memory);
        galleryGrid.appendChild(galleryItem);
    });
}


function createGalleryItem(memory) {
    const galleryItem = document.createElement('div');
    galleryItem.className = 'gallery-item';
    galleryItem.dataset.id = memory.id;
    
    galleryItem.innerHTML = `
        <div class="gallery-image-container">
            <img src="${memory.imageUrl}" alt="${memory.title}" class="gallery-image">
        </div>
        <div class="gallery-info">
            <h3 class="gallery-title">${memory.title}</h3>
            <p class="gallery-submitter">By ${memory.name}</p>
            <p class="gallery-description">${memory.description}</p>
        </div>
    `;
    

    galleryItem.addEventListener('click', () => {
        openMemoryModal(memory);
    });
    
    return galleryItem;
}

function openMemoryModal(memory) {
    modalImage.src = memory.imageUrl;
    modalTitle.textContent = memory.title;
    modalSubmitter.textContent = `Submitted by ${memory.name}`;
    modalDescription.textContent = memory.description;
    
    memoryModal.style.display = 'block';
}

document.addEventListener('DOMContentLoaded', init);