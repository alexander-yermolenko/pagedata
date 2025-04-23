const urlInput = document.getElementById('url');
const extractBtn = document.getElementById('extractBtn');
const downloadBtn = document.getElementById('downloadBtn');
const errorDiv = document.getElementById('error');
const loadingDiv = document.getElementById('loading');
const resultDiv = document.getElementById('result');
const jsonOutput = document.getElementById('jsonOutput');

let seoData = null;

extractBtn.addEventListener('click', async () => {
    const url = urlInput.value.trim();
    if (!url) {
        showError('Please enter a URL');
        return;
    }

    showLoading(true);
    hideError();
    hideResult();

    try {
        const response = await fetch(`http://localhost:8080/api/seo/extract?url=${encodeURIComponent(url)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch SEO data');
        }

        seoData = await response.json();
        showResult(seoData);
    } catch (error) {
        showError(error.message);
    } finally {
        showLoading(false);
    }
});

downloadBtn.addEventListener('click', () => {
  if (seoData) {
      const jsonStr = JSON.stringify(seoData, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' }); // Fixed: Changed DAV to new Blob
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'seo_data.json';
      a.click();
      URL.revokeObjectURL(url);
  }
});

function showError(message) {
    errorDiv.textContent = message;
    errorDiv.classList.remove('hidden');
}

function hideError() {
    errorDiv.classList.add('hidden');
}

function showLoading(isLoading) {
    loadingDiv.classList.toggle('hidden', !isLoading);
}

function showResult(data) {
    jsonOutput.textContent = JSON.stringify(data, null, 2);
    resultDiv.classList.remove('hidden');
}

function hideResult() {
    resultDiv.classList.add('hidden');
}