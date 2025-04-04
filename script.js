document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const fileInput = document.getElementById('fileInput');
    const uploadBtn = document.getElementById('uploadBtn');
    const dropArea = document.getElementById('dropArea');
    const originalImage = document.getElementById('originalImage');
    const enhancedImage = document.getElementById('enhancedImage');
    const comparisonSlider = document.getElementById('comparisonSlider');
    const enhanceBtn = document.getElementById('enhanceBtn');
    const resetBtn = document.getElementById('resetBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const originalSize = document.getElementById('originalSize');
    const originalDimensions = document.getElementById('originalDimensions');
    
    // Enhancement controls
    const brightness = document.getElementById('brightness');
    const contrast = document.getElementById('contrast');
    const saturation = document.getElementById('saturation');
    const sharpness = document.getElementById('sharpness');
    
    // Value displays
    const brightnessValue = document.getElementById('brightnessValue');
    const contrastValue = document.getElementById('contrastValue');
    const saturationValue = document.getElementById('saturationValue');
    const sharpnessValue = document.getElementById('sharpnessValue');
    
    // Preset buttons
    const presetButtons = document.querySelectorAll('.preset-btn');
    
    // Example sliders
    const exampleSliders = document.querySelectorAll('.slider-control');
    
    // Initialize all sliders
    function initSliders() {
        // Main comparison slider
        comparisonSlider.addEventListener('input', function() {
            const value = this.value;
            enhancedImage.style.clipPath = `inset(0 ${100 - value}% 0 0)`;
            enhancedImage.style.WebkitClipPath = `inset(0 ${100 - value}% 0 0)`;
        });
        
        // Example sliders
        exampleSliders.forEach(slider => {
            slider.addEventListener('input', function() {
                const container = this.closest('.before-after');
                const afterImg = container.querySelector('img:last-child');
                const value = this.value;
                afterImg.style.clipPath = `inset(0 ${100 - value}% 0 0)`;
                afterImg.style.WebkitClipPath = `inset(0 ${100 - value}% 0 0)`;
            });
        });
    }
    
    // Initialize the tool
    function init() {
        initSliders();
        
        // File upload handling
        uploadBtn.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', handleFileSelect);
        
        // Drag and drop
        dropArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropArea.classList.add('dragover');
        });
        
        dropArea.addEventListener('dragleave', () => {
            dropArea.classList.remove('dragover');
        });
        
        dropArea.addEventListener('drop', (e) => {
            e.preventDefault();
            dropArea.classList.remove('dragover');
            
            if (e.dataTransfer.files.length) {
                fileInput.files = e.dataTransfer.files;
                handleFileSelect({ target: fileInput });
            }
        });
        
        // Enhancement controls
        brightness.addEventListener('input', updateValueDisplay);
        contrast.addEventListener('input', updateValueDisplay);
        saturation.addEventListener('input', updateValueDisplay);
        sharpness.addEventListener('input', updateValueDisplay);
        
        // Action buttons
        enhanceBtn.addEventListener('click', enhanceImage);
        resetBtn.addEventListener('click', resetImage);
        downloadBtn.addEventListener('click', downloadImage);
        
        // Preset buttons
        presetButtons.forEach(btn => {
            btn.addEventListener('click', applyPreset);
        });
    }
    
    // Handle file selection
    function handleFileSelect(e) {
        const file = e.target.files[0];
        
        if (!file) return;
        
        // Check file type
        if (!file.type.match('image.*')) {
            alert('Please select an image file (JPEG, PNG, WEBP)');
            return;
        }
        
        // Check file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            alert('File size exceeds 5MB limit');
            return;
        }
        
        const reader = new FileReader();
        
        reader.onload = function(event) {
            originalImage.src = event.target.result;
            enhancedImage.src = event.target.result;
            
            // Enable buttons
            enhanceBtn.disabled = false;
            resetBtn.disabled = false;
            downloadBtn.disabled = true;
            
            // Reset enhancement controls
            resetControls();
            
            // Display file info
            originalSize.textContent = formatFileSize(file.size);
            
            // Get image dimensions
            const img = new Image();
            img.onload = function() {
                originalDimensions.textContent = `${this.width} × ${this.height} px`;
            };
            img.src = event.target.result;
        };
        
        reader.readAsDataURL(file);
    }
    
    // Update control value displays
    function updateValueDisplay(e) {
        const target = e.target;
        const valueDisplay = document.getElementById(`${target.id}Value`);
        valueDisplay.textContent = target.value;
    }
    
    // Reset all controls
    function resetControls() {
        brightness.value = 0;
        contrast.value = 0;
        saturation.value = 0;
        sharpness.value = 0;
        
        brightnessValue.textContent = '0';
        contrastValue.textContent = '0';
        saturationValue.textContent = '0';
        sharpnessValue.textContent = '0';
    }
    
    // Apply preset enhancements
    function applyPreset(e) {
        const preset = e.target.dataset.preset;
        
        switch(preset) {
            case 'auto':
                brightness.value = 15;
                contrast.value = 20;
                saturation.value = 10;
                sharpness.value = 30;
                break;
            case 'portrait':
                brightness.value = 10;
                contrast.value = 15;
                saturation.value = -10;
                sharpness.value = 25;
                break;
            case 'landscape':
                brightness.value = 20;
                contrast.value = 25;
                saturation.value = 30;
                sharpness.value = 40;
                break;
        }
        
        // Update value displays
        brightnessValue.textContent = brightness.value;
        contrastValue.textContent = contrast.value;
        saturationValue.textContent = saturation.value;
        sharpnessValue.textContent = sharpness.value;
    }
    
    // Enhance the image
    function enhanceImage() {
        if (!originalImage.src || enhanceBtn.disabled) return;
        
        enhanceBtn.disabled = true;
        enhanceBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        
        // Simulate processing (in a real app, this would be actual image processing)
        setTimeout(() => {
            // Create canvas for processing
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            
            img.onload = function() {
                canvas.width = this.width;
                canvas.height = this.height;
                
                // Apply filters
                ctx.filter = `
                    brightness(${1 + brightness.value / 100})
                    contrast(${1 + contrast.value / 100})
                    saturate(${1 + saturation.value / 100})
                `;
                
                ctx.drawImage(img, 0, 0);
                
                // Apply sharpness (simplified)
                if (sharpness.value > 0) {
                    ctx.globalCompositeOperation = 'overlay';
                    ctx.filter = `blur(${1 - sharpness.value / 100}px)`;
                    ctx.drawImage(canvas, 0, 0);
                    ctx.globalCompositeOperation = 'source-over';
                }
                
                // Set enhanced image
                enhancedImage.src = canvas.toDataURL('image/jpeg', 0.9);
                
                // Enable download
                downloadBtn.disabled = false;
                
                // Reset button
                enhanceBtn.disabled = false;
                enhanceBtn.innerHTML = '<i class="fas fa-magic"></i> Enhance Image';
            };
            
            img.src = originalImage.src;
        }, 1500);
    }
    
    // Reset to original image
    function resetImage() {
        if (!originalImage.src) return;
        
        enhancedImage.src = originalImage.src;
        resetControls();
        comparisonSlider.value = 50;
        enhancedImage.style.clipPath = 'inset(0 50% 0 0)';
        downloadBtn.disabled = true;
    }
    
    // Download enhanced image
    function downloadImage() {
        if (!enhancedImage.src) return;
        
        const link = document.createElement('a');
        link.href = enhancedImage.src;
        link.download = `enhanced_${Date.now()}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    
    // Format file size
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i];
    }
    
    // Start the application
    init();
});