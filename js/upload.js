// PopApp - Upload Module (Connected to Backend)

const UploadModule = {
    modal: null,
    fileInput: null,
    apiUrl: 'http://localhost:5000/api/videos',
    
    init: function() {
        this.createModal();
        this.addEventListeners();
        console.log('UploadModule: Ready (Backend Connected)');
    },
    
    createModal: function() {
        if (document.getElementById('uploadModal')) return;
        
        const phone = document.querySelector('.phone');
        if (!phone) return;
        
        const modalDiv = document.createElement('div');
        modalDiv.id = 'uploadModal';
        modalDiv.style.cssText = 'display:none;position:absolute;top:0;left:0;right:0;bottom:70px;background:rgba(0,0,0,0.95);z-index:300;align-items:center;justify-content:center;';
        modalDiv.innerHTML = `
            <div style="background:#1c1c1c;border-radius:24px;padding:24px;width:280px;text-align:center;border:1px solid #FF4F2E;">
                <h3 style="color:white;margin-bottom:20px;">Upload Video</h3>
                <input type="text" id="videoTitle" placeholder="Video title" style="width:100%;padding:10px;margin-bottom:12px;border-radius:8px;border:none;background:#2a2a2a;color:white;">
                <textarea id="videoDesc" placeholder="Description" style="width:100%;padding:10px;margin-bottom:12px;border-radius:8px;border:none;background:#2a2a2a;color:white;resize:none;" rows="2"></textarea>
                <button id="selectVideoBtn" style="background:#FF4F2E;color:white;border:none;padding:14px;border-radius:40px;font-size:16px;font-weight:bold;width:100%;margin-bottom:12px;cursor:pointer;">Choose Video</button>
                <button id="closeModalBtn" style="background:transparent;color:#888;border:none;padding:8px;cursor:pointer;">Cancel</button>
                <div id="uploadProgress" style="display:none;margin-top:12px;color:#FF4F2E;">Uploading...</div>
            </div>
        `;
        phone.appendChild(modalDiv);
        
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'video/*';
        fileInput.id = 'videoInput';
        fileInput.style.display = 'none';
        phone.appendChild(fileInput);
        
        this.modal = modalDiv;
        this.fileInput = fileInput;
    },
    
    addEventListeners: function() {
        const selectBtn = document.getElementById('selectVideoBtn');
        const closeBtn = document.getElementById('closeModalBtn');
        
        if (selectBtn) {
            selectBtn.addEventListener('click', () => {
                this.fileInput.click();
            });
        }
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.modal.style.display = 'none';
            });
        }
        
        if (this.fileInput) {
            this.fileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file && file.type.startsWith('video/')) {
                    this.uploadVideo(file);
                } else if (file) {
                    alert('Please select a video file');
                }
                this.fileInput.value = '';
            });
        }
        
        if (this.modal) {
            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal) {
                    this.modal.style.display = 'none';
                }
            });
        }
    },
    
    uploadVideo: async function(file) {
        const titleInput = document.getElementById('videoTitle');
        const descInput = document.getElementById('videoDesc');
        const progressDiv = document.getElementById('uploadProgress');
        
        const title = titleInput?.value || file.name.replace(/\.[^/.]+$/, "");
        const description = descInput?.value || "";
        
        const formData = new FormData();
        formData.append('video', file);
        formData.append('title', title);
        formData.append('description', description);
        
        if (progressDiv) {
            progressDiv.style.display = 'block';
        }
        
        try {
            console.log('Uploading to backend...');
            const response = await fetch(this.apiUrl + '/upload', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            if (result.success) {
                alert('✅ "' + title + '" uploaded successfully!');
                
                if (titleInput) titleInput.value = '';
                if (descInput) descInput.value = '';
                
                this.modal.style.display = 'none';
                
                if (window.FeedModule && window.FeedModule.loadVideos) {
                    window.FeedModule.loadVideos();
                }
            } else {
                alert('Upload failed: ' + (result.error || 'Unknown error'));
            }
        } catch (error) {
            console.error('Upload error:', error);
            alert('Upload failed. Make sure backend is running on port 5000');
        } finally {
            if (progressDiv) {
                progressDiv.style.display = 'none';
            }
        }
    },
    
    show: function() {
        if (this.modal) {
            const titleInput = document.getElementById('videoTitle');
            const descInput = document.getElementById('videoDesc');
            if (titleInput) titleInput.value = '';
            if (descInput) descInput.value = '';
            
            this.modal.style.display = 'flex';
            console.log('Upload modal opened');
        } else {
            console.log('Modal not ready yet');
            alert('Upload system loading, please wait a moment');
        }
    }
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => UploadModule.init());
} else {
    UploadModule.init();
}

window.UploadModule = UploadModule;