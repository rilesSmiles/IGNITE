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

// Store submitted memories
let memories = [];

// For demo purposes, add some sample memories
const sampleMemories = [
    {
        id: 1,
        name: "Alex Johnson",
        title: "Opening Ceremony",
        description: "Incredible lighting display at the IGNITE Awards opening ceremony.",
        imageUrl: "https://source.unsplash.com/random/800x600/?ceremony",
        type: "featured",
        timestamp: new Date('2025-01-15').getTime()
    },
    {
        id: 2,
        name: "Jordan Smith",
        title: "Innovation Award Winner",
        description: "The moment our team received the Innovation Award for our clean energy project.",
        imageUrl: "https://source.unsplash.com/random/800x600/?award",
        type: "latest",
        timestamp: new Date('2025-02-20').getTime()
    },
    {
        id: 3,
        name: "Taylor Wilson",
        title: "Backstage Moments",
        description: "Behind the scenes with the production team making everything possible.",
        imageUrl: "https://source.unsplash.com/random/800x600/?backstage",
        type: "featured",
        timestamp: new Date('2025-02-01').getTime()
    },
    {
        id: 4,
        name: "Casey Zhang",
        title: "Networking Event",
        description: "Making new connections at the post-awards networking event.",
        imageUrl: "https://source.unsplash.com/random/800x600/?networking",
        type: "latest",
        timestamp: new Date('2025-02-28').getTime()
    }
];

// Initialize the gallery
function init() {
    // Load saved memories from localStorage if available
    const savedMemories = localStorage.getItem('igniteMemories');
    if (savedMemories) {
        memories = JSON.parse(savedMemories);
    } else {
        // Use sample memories for demonstration
        memories = [...sampleMemories];
        localStorage.setItem('igniteMemories', JSON.stringify(memories));
    }
    
    // Display memories in gallery
    displayMemories('all');
    
    // Setup event listeners
    setupEventListeners();
}

// Setup event listeners
function setupEventListeners() {
    // Image preview
    memoryImageInput.addEventListener('change', handleImagePreview);
    
    // Remove image
    removeImageBtn.addEventListener('click', removeImage);
    
    // Form submission
    submissionForm.addEventListener('submit', handleSubmission);
    
    // Filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active class
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filter gallery
            displayMemories(button.dataset.filter);
        });
    });
    
    // Close modal
    closeModal.addEventListener('click', () => {
        memoryModal.style.display = 'none';
    });
    
    // Click outside to close modal
    window.addEventListener('click', (e) => {
        if (e.target === memoryModal) {
            memoryModal.style.display = 'none';
        }
    });
}

// Handle image preview
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

// Remove selected image
function removeImage() {
    memoryImageInput.value = '';
    previewImg.src = '#';
    imagePreview.style.display = 'none';
}

// Handle form submission
function handleSubmission(e) {
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById('submitter-name').value;
    const title = document.getElementById('memory-title').value;
    const description = document.getElementById('memory-description').value;
    const imageFile = document.getElementById('memory-image').files[0];
    
    if (!imageFile) {
        alert('Please select an image to upload');
        return;
    }
    
    // Convert image to base64 for storage
    const reader = new FileReader();
    reader.onload = function(event) {
        const imageUrl = event.target.result;
        
        // Create new memory object
        const newMemory = {
            id: Date.now(),
            name,
            title,
            description,
            imageUrl,
            type: 'latest',
            timestamp: new Date().getTime()
        };
        
        // Add to memories array
        memories.unshift(newMemory);
        
        // Save to localStorage
        localStorage.setItem('igniteMemories', JSON.stringify(memories));
        
        // Reset form
        submissionForm.reset();
        removeImage();
        
        // Update gallery
        displayMemories('all');
        
        // Show success message
        alert('Your design has been added to the time capsule!');
    };
    
    reader.readAsDataURL(imageFile);
}

// Display memories based on filter
function displayMemories(filter) {
    // Clear gallery
    galleryGrid.innerHTML = '';
    
    // Filter memories
    let filteredMemories = [...memories];
    if (filter === 'latest') {
        filteredMemories = memories.filter(memory => memory.type === 'latest');
    } else if (filter === 'featured') {
        filteredMemories = memories.filter(memory => memory.type === 'featured');
    }
    
    // Create and append gallery items
    filteredMemories.forEach(memory => {
        const galleryItem = createGalleryItem(memory);
        galleryGrid.appendChild(galleryItem);
    });
}

// Create gallery item
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
    
    // Add click event to open modal
    galleryItem.addEventListener('click', () => {
        openMemoryModal(memory);
    });
    
    return galleryItem;
}

// Open memory modal
function openMemoryModal(memory) {
    modalImage.src = memory.imageUrl;
    modalTitle.textContent = memory.title;
    modalSubmitter.textContent = `Submitted by ${memory.name}`;
    modalDescription.textContent = memory.description;
    
    memoryModal.style.display = 'block';
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', init);