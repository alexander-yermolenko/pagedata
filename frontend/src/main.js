const urlInput = document.getElementById('url');
const extractBtn = document.getElementById('extractBtn');
const downloadJsonBtn = document.getElementById('downloadJsonBtn');
const downloadXmlBtn = document.getElementById('downloadXmlBtn');
const errorDiv = document.getElementById('error');
const loadingDiv = document.getElementById('loading');
const resultDiv = document.getElementById('result');
const summaryOutput = document.getElementById('summaryOutput');

let pageData = null;

extractBtn.addEventListener('click', async () => {
    const url = urlInput.value.trim();
    if (!url) {
        showError('Please enter a URL');
        return;
    }

    const urlPattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- ./?%&=]*)?$/;
    if (!urlPattern.test(url)) {
        showError('Please enter a valid URL (e.g., example.com)');
        return;
    }

    showLoading(true);
    hideError();
    hideResult();

    try {
        const response = await fetch(`http://localhost:8080/api/page/extract?url=${encodeURIComponent(url)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('❌ Failed to fetch page data. Please check the URL and try again.');
        }

        pageData = await response.json();
        console.log('pageData:', pageData); // Debug
        if (pageData.ipApiData && pageData.ipApiData.status === 'failed') {
            showError('⚠️ IP geolocation data unavailable. Displaying page data only.');
        }
        showResult(pageData);
    } catch (error) {
        showError(error.message);
    } finally {
        showLoading(false);
    }
});

downloadJsonBtn.addEventListener('click', () => {
    if (pageData) {
        const jsonStr = JSON.stringify(pageData, null, 2);
        console.log('JSON Download:', jsonStr); // Debug
        downloadFile(jsonStr, 'page_data.json', 'application/json');
    }
});

downloadXmlBtn.addEventListener('click', () => {
    if (pageData) {
        const xmlStr = generateXML(pageData);
        console.log('XML Download:', xmlStr); // Debug
        downloadFile(xmlStr, 'page_data.xml', 'application/xml');
    }
});

function downloadFile(content, fileName, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
}

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
    summaryOutput.innerHTML = generateSummary(data);
    resultDiv.classList.remove('hidden');
}

function hideResult() {
    resultDiv.classList.add('hidden');
}

function generateSummary(data) {
    let summary = '<h3>📊 Page Data Summary</h3><br>';

    const formatScalar = (label, value, emoji = '') => {
        return value ? `<p><strong>${emoji}${label}:</strong> ${value}</p>` : '';
    };

    const formatList = (label, list, emoji = '') => {
        if (!list || list.length === 0) return '';
        return `<p><strong>${emoji}${label} (${list.length}):</strong></p><ul>${list.map(item => `<li>${item}</li>`).join('')}</ul>`;
    };

    // IP API Data
    if (data.ipApiData) {
        summary += '<h4>🌍 IP and Geolocation Data</h4>';
        summary += formatScalar('IP Address', data.ipApiData.query, '📍 ');
        summary += formatScalar('Status', data.ipApiData.status, '📡 ');
        summary += formatScalar('Continent', data.ipApiData.continent, '🌎 ');
        summary += formatScalar('Country', data.ipApiData.country, '🏳️ ');
        summary += formatScalar('Region', data.ipApiData.regionName, '🏙️ ');
        summary += formatScalar('City', data.ipApiData.city, '🌆 ');
        summary += formatScalar('Latitude', data.ipApiData.lat, '📍 ');
        summary += formatScalar('Longitude', data.ipApiData.lon, '📍 ');
        summary += formatScalar('Timezone', data.ipApiData.timezone, '⏰ ');
        summary += formatScalar('Currency', data.ipApiData.currency, '💰 ');
        summary += formatScalar('ISP', data.ipApiData.isp, '🌐 ');
        summary += formatScalar('Organization', data.ipApiData.org, '🏢 ');
        summary += formatScalar('AS Name', data.ipApiData.asname, '🔌 ');
        summary += formatScalar('Mobile', data.ipApiData.mobile, '📱 ');
        summary += formatScalar('Proxy', data.ipApiData.proxy, '🕵️ ');
        summary += formatScalar('Hosting', data.ipApiData.hosting, '🖥️ ');

        if (data.ipApiData.dns) {
            summary += formatScalar('DNS Geo', data.ipApiData.dns.geo, '📡 ');
            summary += formatScalar('DNS IP', data.ipApiData.dns.ip, '📡 ');
        }
        if (data.ipApiData.edns) {
            summary += formatScalar('EDNS Geo', data.ipApiData.edns.geo, '📡 ');
            summary += formatScalar('EDNS IP', data.ipApiData.edns.ip, '📡 ');
        }
    }

    // Page Data
    summary += '<br><h4>📄 Page Data</h4>';
    summary += formatScalar('Page Title', data.title, '📄 ');
    summary += formatScalar('Meta Description', data.metaNameDescription, '📄 ');
    summary += formatScalar('Meta Keywords', data.metaNameKeywords, '📄 ');
    summary += formatScalar('Meta Robots', data.metaNameRobots, '📄 ');
    summary += formatScalar('Meta Viewport', data.metaNameViewport, '📄 ');
    summary += formatScalar('Meta Charset', data.metaCharset, '📄 ');
    summary += formatScalar('Canonical URL', data.linkRelCanonical, '🔗 ');

    summary += formatScalar('OG Title', data.metaPropertyOgTitle, '🌐 ');
    summary += formatScalar('OG Description', data.metaPropertyOgDescription, '🌐 ');
    summary += formatScalar('OG URL', data.metaPropertyOgUrl, '🌐 ');
    summary += formatScalar('OG Image', data.metaPropertyOgImage, '🌐 ');

    summary += formatList('H1 Tags', data.h1, '✅ ');
    summary += formatList('H2 Tags', data.h2, '✅ ');
    summary += formatList('H3 Tags', data.h3, '✅ ');
    summary += formatList('H4 Tags', data.h4, '✅ ');
    summary += formatList('H5 Tags', data.h5, '✅ ');
    summary += formatList('H6 Tags', data.h6, '✅ ');

    summary += formatList('Article Tags', data.article, '📝 ');
    summary += formatList('Header Tags', data.header, '📝 ');
    summary += formatList('Footer Tags', data.footer, '📝 ');
    summary += formatList('Nav Tags', data.nav, '📝 ');
    summary += formatList('Audio Tags', data.audio, '🎵 ');
    summary += formatList('Video Tags', data.video, '🎥 ');
    summary += formatList('Picture Tags', data.picture, '🖼️ ');
    summary += formatList('Source Tags', data.source, '🖼️ ');
    summary += formatList('SVG Tags', data.svg, '🖼️ ');
    summary += formatList('Time Tags', data.time, '⏰ ');
    summary += formatList('Details Tags', data.details, '📋 ');
    summary += formatList('Dialog Tags', data.dialog, '📋 ');
    summary += formatList('Embed Tags', data.embed, '📋 ');
    summary += formatList('Summary Tags', data.summary, '📋 ');

    summary += formatList('Images (src)', data.img, '🖼️ ');
    summary += formatList('Links (href)', data.a, '🔗 ');

    return summary || '<p>😔 No page data available.</p>';
}

function generateXML(data) {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<PageData>\n';

    const addElement = (key, value, indent = 2) => {
        if (!value) return '';
        if (Array.isArray(value)) {
            let result = `${' '.repeat(indent)}<${key}List>\n`;
            value.forEach(item => {
                result += `${' '.repeat(indent + 2)}<Item>${escapeXML(item)}</Item>\n`;
            });
            result += `${' '.repeat(indent)}</${key}List>\n`;
            return result;
        }
        return `${' '.repeat(indent)}<${key}>${escapeXML(value)}</${key}>\n`;
    };

    // Page Data
    xml += addElement('Title', data.title);
    xml += addElement('MetaDescription', data.metaNameDescription);
    xml += addElement('MetaKeywords', data.metaNameKeywords);
    xml += addElement('MetaRobots', data.metaNameRobots);
    xml += addElement('MetaViewport', data.metaNameViewport);
    xml += addElement('MetaCharset', data.metaCharset);
    xml += addElement('CanonicalURL', data.linkRelCanonical);

    xml += addElement('OgTitle', data.metaPropertyOgTitle);
    xml += addElement('OgDescription', data.metaPropertyOgDescription);
    xml += addElement('OgURL', data.metaPropertyOgUrl);
    xml += addElement('OgImage', data.metaPropertyOgImage);

    xml += addElement('H1', data.h1);
    xml += addElement('H2', data.h2);
    xml += addElement('H3', data.h3);
    xml += addElement('H4', data.h4);
    xml += addElement('H5', data.h5);
    xml += addElement('H6', data.h6);

    xml += addElement('Article', data.article);
    xml += addElement('Header', data.header);
    xml += addElement('Footer', data.footer);
    xml += addElement('Nav', data.nav);
    xml += addElement('Audio', data.audio);
    xml += addElement('Video', data.video);
    xml += addElement('Picture', data.picture);
    xml += addElement('Source', data.source);
    xml += addElement('SVG', data.svg);
    xml += addElement('Time', data.time);
    xml += addElement('Details', data.details);
    xml += addElement('Dialog', data.dialog);
    xml += addElement('Embed', data.embed);
    xml += addElement('Summary', data.summary);

    xml += addElement('Images', data.img);
    xml += addElement('Links', data.a);

    // IP API data
    if (data.ipApiData) {
        xml += '  <IpApiData>\n';
        xml += addElement('Query', data.ipApiData.query, 4);
        xml += addElement('Status', data.ipApiData.status, 4);
        xml += addElement('Continent', data.ipApiData.continent, 4);
        xml += addElement('ContinentCode', data.ipApiData.continentCode, 4);
        xml += addElement('Country', data.ipApiData.country, 4);
        xml += addElement('CountryCode', data.ipApiData.countryCode, 4);
        xml += addElement('Region', data.ipApiData.region, 4);
        xml += addElement('RegionName', data.ipApiData.regionName, 4);
        xml += addElement('City', data.ipApiData.city, 4);
        xml += addElement('District', data.ipApiData.district, 4);
        xml += addElement('Zip', data.ipApiData.zip, 4);
        xml += addElement('Lat', data.ipApiData.lat, 4);
        xml += addElement('Lon', data.ipApiData.lon, 4);
        xml += addElement('Timezone', data.ipApiData.timezone, 4);
        xml += addElement('Offset', data.ipApiData.offset, 4);
        xml += addElement('Currency', data.ipApiData.currency, 4);
        xml += addElement('Isp', data.ipApiData.isp, 4);
        xml += addElement('Org', data.ipApiData.org, 4);
        xml += addElement('As', data.ipApiData.as, 4);
        xml += addElement('Asname', data.ipApiData.asname, 4);
        xml += addElement('Mobile', data.ipApiData.mobile, 4);
        xml += addElement('Proxy', data.ipApiData.proxy, 4);
        xml += addElement('Hosting', data.ipApiData.hosting, 4);

        if (data.ipApiData.dns) {
            xml += '    <Dns>\n';
            xml += addElement('Geo', data.ipApiData.dns.geo, 6);
            xml += addElement('Ip', data.ipApiData.dns.ip, 6);
            xml += '    </Dns>\n';
        }
        if (data.ipApiData.edns) {
            xml += '    <Edns>\n';
            xml += addElement('Geo', data.ipApiData.edns.geo, 6);
            xml += addElement('Ip', data.ipApiData.edns.ip, 6);
            xml += '    </Edns>\n';
        }
        xml += '  </IpApiData>\n';
    }

    xml += '</PageData>';
    return xml;
}

function escapeXML(str) {
    if (!str) return '';
    return str.toString()
             .replace(/&/g, '&amp;')
             .replace(/</g, '&lt;')
             .replace(/>/g, '&gt;')
             .replace(/"/g, '&quot;')
             .replace(/'/g, '&apos;');
}