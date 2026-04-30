/* ===== ATS ANALYZER - MAIN LOGIC ===== */

class ATSAnalyzer {
    constructor() {
        this.commonSkills = [
            'JavaScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust', 'PHP', 'Ruby', 'Swift',
            'Kotlin', 'TypeScript', 'React', 'Vue', 'Angular', 'Next.js', 'Express', 'Django',
            'Spring', 'FastAPI', 'Node.js', 'HTML', 'CSS', 'SQL', 'MongoDB', 'PostgreSQL',
            'MySQL', 'Firebase', 'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Git',
            'Linux', 'Windows', 'MacOS', 'REST API', 'GraphQL', 'WebSocket', 'CRUD',
            'MVC', 'MVVM', 'Microservices', 'Agile', 'Scrum', 'Kanban', 'CI/CD',
            'Jenkins', 'GitLab', 'GitHub', 'Jira', 'Slack', 'Figma', 'Adobe XD',
            'Photoshop', 'Illustrator', 'InDesign', 'Machine Learning', 'Deep Learning',
            'TensorFlow', 'PyTorch', 'NLP', 'Computer Vision', 'Data Science', 'Analytics',
            'Tableau', 'Power BI', 'Excel', 'Google Analytics', 'SEO', 'SEM', 'Content Marketing',
            'Salesforce', 'HubSpot', 'Trello', 'Notion', 'NoSQL', 'Redis', 'Elasticsearch',
            'Solr', 'Message Queue', 'RabbitMQ', 'Kafka', 'SOAP', 'XML', 'JSON',
            'JWT', 'OAuth', 'LDAP', 'SAML', 'API Gateway', 'Load Balancer', 'CDN',
            'Nginx', 'Apache', 'IIS', 'Load Balancing', 'Caching', 'Performance Optimization'
        ];

        this.synonyms = {
            'js': 'javascript',
            'ts': 'typescript',
            'nodejs': 'node.js',
            'node.js': 'nodejs',
            'postgres': 'postgresql',
            'mongo': 'mongodb',
            'k8s': 'kubernetes',
            'ml': 'machine learning',
            'ai': 'artificial intelligence',
            'cv': 'computer vision',
            'ios': 'swift',
            'android': 'kotlin',
            'devops': 'docker',
            'infra': 'infrastructure',
            'backend': 'back-end',
            'frontend': 'front-end',
            'fullstack': 'full-stack',
            'web': 'web development'
        };

        this.atsStructureSections = ['experience', 'education', 'skills', 'projects', 'summary', 'objective'];

        this.seniorityKeywords = {
            'junior': { level: 1, weight: 0.2 },
            'intern': { level: 1, weight: 0.1 },
            'entry-level': { level: 1, weight: 0.2 },
            'pleno': { level: 2, weight: 0.3 },
            'mid-level': { level: 2, weight: 0.3 },
            'senior': { level: 3, weight: 0.5 },
            'lead': { level: 3, weight: 0.6 },
            'principal': { level: 3, weight: 0.7 },
            'staff': { level: 3, weight: 0.6 },
            'architect': { level: 3, weight: 0.7 },
            'manager': { level: 3, weight: 0.5 },
            'director': { level: 4, weight: 0.8 }
        };

        this.stopWords = new Set([
            'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'has', 'he',
            'in', 'is', 'it', 'its', 'of', 'on', 'or', 'that', 'the', 'to', 'was', 'will',
            'with', 'de', 'da', 'do', 'e', 'em', 'o', 'um', 'uma', 'os', 'as', 'com', 'por'
        ]);

        this.initializeEventListeners();
    }

    initializeEventListeners() {
        const analyzeBtn = document.getElementById('analyzeBtn');
        const downloadBtn = document.getElementById('downloadBtn');
        const newAnalysisBtn = document.getElementById('newAnalysisBtn');
        const fileUpload = document.getElementById('fileUpload');
        const uploadArea = document.querySelector('.ats-upload-area');

        analyzeBtn.addEventListener('click', () => this.analyzeResume());

        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => this.downloadReport());
        }

        if (newAnalysisBtn) {
            newAnalysisBtn.addEventListener('click', () => this.resetAnalysis());
        }

        if (fileUpload) {
            fileUpload.addEventListener('change', (e) => this.handleFileUpload(e));
        }

        if (uploadArea) {
            uploadArea.addEventListener('dragover', (e) => this.handleDragOver(e));
            uploadArea.addEventListener('dragleave', (e) => this.handleDragLeave(e));
            uploadArea.addEventListener('drop', (e) => this.handleDrop(e));
            uploadArea.addEventListener('click', () => fileUpload.click());
        }
    }

    handleDragOver(e) {
        e.preventDefault();
        e.stopPropagation();
        document.querySelector('.ats-upload-area').classList.add('dragover');
    }

    handleDragLeave(e) {
        e.preventDefault();
        e.stopPropagation();
        document.querySelector('.ats-upload-area').classList.remove('dragover');
    }

    handleDrop(e) {
        e.preventDefault();
        e.stopPropagation();
        document.querySelector('.ats-upload-area').classList.remove('dragover');

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            document.getElementById('fileUpload').files = files;
            this.handleFileUpload({ target: { files } });
        }
    }

    handleFileUpload(e) {
        const file = e.target.files[0];
        if (!file) return;

        const fileStatus = document.getElementById('fileStatus');
        const maxSize = 10 * 1024 * 1024; // 10MB

        if (file.size > maxSize) {
            fileStatus.textContent = this.getLanguageText('File too large (max 10MB)');
            fileStatus.classList.add('error');
            return;
        }

        if (file.type === 'application/pdf') {
            this.extractPdfText(file);
        } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.type === 'application/msword') {
            this.extractDocxText(file);
        } else if (file.type === 'text/plain') {
            const reader = new FileReader();
            reader.onload = (event) => {
                document.getElementById('resumeText').value = event.target.result;
                fileStatus.textContent = this.getLanguageText('File loaded successfully');
                fileStatus.classList.add('success');
            };
            reader.readAsText(file);
        } else {
            fileStatus.textContent = this.getLanguageText('Unsupported file type');
            fileStatus.classList.add('error');
        }
    }

    async extractPdfText(file) {
        const fileStatus = document.getElementById('fileStatus');
        fileStatus.textContent = this.getLanguageText('Extracting PDF text...');
        fileStatus.className = '';

        try {
            // Ensure pdfjsLib is available
            if (typeof pdfjsLib === 'undefined') {
                throw new Error("PDF.js library is not loaded.");
            }

            // Set worker source (required by PDF.js)
            pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            
            let fullText = '';
            
            // Loop through all pages to extract text
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map(item => item.str).join(' ');
                fullText += pageText + '\n\n';
            }

            document.getElementById('resumeText').value = fullText.trim();
            fileStatus.textContent = this.getLanguageText('PDF loaded successfully');
            fileStatus.classList.add('success');
        } catch (error) {
            console.error("PDF Extraction Error:", error);
            fileStatus.textContent = this.getLanguageText('Error extracting PDF');
            fileStatus.classList.add('error');
        }
    }

    getPdfText(arrayBuffer) {
        // Deprecated: Replaced by async PDF.js extraction inside extractPdfText
        return '';
    }

    extractDocxText(file) {
        const fileStatus = document.getElementById('fileStatus');
        fileStatus.textContent = this.getLanguageText('DOCX files require a library (use copy-paste instead)');
        fileStatus.classList.add('error');
    }

    getLanguageText(text) {
        const lang = document.documentElement.getAttribute('data-lang') || 'en';
        const translations = {
            'File too large (max 10MB)': { en: 'File too large (max 10MB)', pt: 'Arquivo muito grande (máximo 10MB)' },
            'File loaded successfully': { en: 'File loaded successfully', pt: 'Arquivo carregado com sucesso' },
            'Unsupported file type': { en: 'Unsupported file type', pt: 'Tipo de arquivo não suportado' },
            'Extracting PDF text...': { en: 'Extracting PDF text...', pt: 'Extraindo texto do PDF...' },
            'PDF loaded successfully': { en: 'PDF loaded successfully', pt: 'PDF carregado com sucesso' },
            'Error extracting PDF': { en: 'Error extracting PDF', pt: 'Erro ao extrair PDF' },
            'DOCX files require a library (use copy-paste instead)': { en: 'DOCX files require a library (use copy-paste instead)', pt: 'Arquivos DOCX requerem uma biblioteca (use copiar e colar)' }
        };
        return (translations[text] && translations[text][lang]) || text;
    }

    async analyzeResume() {
        const jobDescription = document.getElementById('jobDescription').value.trim();
        const resumeText = document.getElementById('resumeText').value.trim();

        if (!jobDescription || !resumeText) {
            alert(this.getLanguageText('Please fill in both fields'));
            return;
        }

        // Show loading state
        document.getElementById('loadingState').hidden = false;

        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 1000));

        try {
            const analysis = this.performAnalysis(jobDescription, resumeText);
            this.displayResults(analysis);
        } catch (error) {
            console.error('Analysis error:', error);
            alert('Error during analysis. Please try again.');
        } finally {
            document.getElementById('loadingState').hidden = true;
        }
    }

    performAnalysis(jobDescription, resumeText) {
        const jobLower = jobDescription.toLowerCase();
        const resumeLower = resumeText.toLowerCase();

        // Extract keywords from job description
        const jobKeywords = this.extractKeywords(jobLower);
        const resumeKeywords = this.extractKeywords(resumeLower);

        // Calculate metrics
        const keywordAnalysis = this.analyzeKeywords(jobKeywords, resumeKeywords);
        const skillsAnalysis = this.analyzeSkills(jobLower, resumeLower);
        const structureAnalysis = this.analyzeStructure(resumeLower);
        const seniorityAnalysis = this.analyzeSeniority(resumeLower, jobLower);

        // Calculate overall score
        const score = this.calculateScore(keywordAnalysis, skillsAnalysis, structureAnalysis, seniorityAnalysis);

        // Generate suggestions
        const suggestions = this.generateSuggestions(
            keywordAnalysis,
            skillsAnalysis,
            structureAnalysis,
            seniorityAnalysis,
            score,
            jobKeywords,
            resumeKeywords
        );

        return {
            score,
            keywordAnalysis,
            skillsAnalysis,
            structureAnalysis,
            seniorityAnalysis,
            suggestions,
            jobKeywords,
            resumeKeywords
        };
    }

    extractKeywords(text) {
        // Split text into words
        const words = text.match(/\b[\w-]+\b/g) || [];

        // Filter and normalize
        const keywords = new Set();
        words.forEach(word => {
            // Skip stop words
            if (this.stopWords.has(word)) return;
            // Skip very short words
            if (word.length < 3) return;
            // Normalize
            let normalized = word.toLowerCase();
            if (this.synonyms[normalized]) {
                normalized = this.synonyms[normalized];
            }
            if (normalized.length >= 3) {
                keywords.add(normalized);
            }
        });

        return Array.from(keywords);
    }

    analyzeKeywords(jobKeywords, resumeKeywords) {
        const found = jobKeywords.filter(keyword => this.findKeywordInText(keyword, resumeKeywords.join(' ')));
        const total = jobKeywords.length;
        const percentage = total > 0 ? Math.round((found.length / total) * 100) : 0;

        return {
            found: found.length,
            total: Math.max(total, 15), // Minimum 15 keywords
            percentage,
            foundKeywords: found
        };
    }

    findKeywordInText(keyword, text) {
        // Exact match
        if (text.includes(keyword)) return true;

        // Check synonyms
        for (const [key, value] of Object.entries(this.synonyms)) {
            if (value === keyword && text.includes(key)) return true;
            if (key === keyword && text.includes(value)) return true;
        }

        return false;
    }

    analyzeSkills(jobText, resumeText) {
        const foundSkills = [];
        const missingSkills = [];

        this.commonSkills.forEach(skill => {
            const skillLower = skill.toLowerCase();
            const regex = new RegExp(`\\b${skillLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');

            if (regex.test(jobText)) {
                if (regex.test(resumeText)) {
                    foundSkills.push(skill);
                } else {
                    missingSkills.push(skill);
                }
            }
        });

        const total = foundSkills.length + missingSkills.length;
        const percentage = total > 0 ? Math.round((foundSkills.length / total) * 100) : 0;

        return {
            found: foundSkills,
            missing: missingSkills,
            total: foundSkills.length + missingSkills.length,
            percentage: isNaN(percentage) ? 0 : percentage
        };
    }

    analyzeStructure(resumeText) {
        const structure = {};
        let foundCount = 0;

        this.atsStructureSections.forEach(section => {
            const found = new RegExp(`\\b${section}\\b`, 'i').test(resumeText);
            structure[section] = found;
            if (found) foundCount++;
        });

        return {
            sections: structure,
            foundCount,
            totalSections: this.atsStructureSections.length,
            percentage: Math.round((foundCount / this.atsStructureSections.length) * 100)
        };
    }

    analyzeSeniority(resumeText, jobText) {
        let resumeSeniority = 0;
        let jobSeniority = 0;

        // Check resume for seniority keywords
        for (const [keyword, data] of Object.entries(this.seniorityKeywords)) {
            const regex = new RegExp(`\\b${keyword}\\b`, 'i');
            if (regex.test(resumeText)) {
                resumeSeniority = Math.max(resumeSeniority, data.weight);
            }
            if (regex.test(jobText)) {
                jobSeniority = Math.max(jobSeniority, data.weight);
            }
        }

        // Also check for years of experience
        const yearsMatch = resumeText.match(/(\d+)\s*(?:\+)?\s*(?:years?|anos?|yrs?|yr)/gi);
        if (yearsMatch) {
            const yearsNum = parseInt(yearsMatch[0]);
            if (yearsNum >= 10) {
                resumeSeniority = Math.max(resumeSeniority, 0.7);
            } else if (yearsNum >= 5) {
                resumeSeniority = Math.max(resumeSeniority, 0.5);
            } else if (yearsNum >= 2) {
                resumeSeniority = Math.max(resumeSeniority, 0.3);
            }
        }

        return {
            resumeLevel: resumeSeniority,
            jobLevel: jobSeniority,
            match: Math.abs(resumeSeniority - jobSeniority) < 0.3 ? 'good' : 'warning',
            alignment: resumeSeniority >= jobSeniority * 0.8 ? 'aligned' : 'junior'
        };
    }

    calculateScore(keywords, skills, structure, seniority) {
        // Weights: 45% keywords, 25% skills, 15% experience, 10% structure, 5% extras
        const keywordScore = keywords.percentage * 0.45;
        const skillScore = skills.percentage * 0.25;
        const structureScore = structure.percentage * 0.10;
        const seniorityScore = (seniority.match === 'good' ? 85 : 60) * 0.15;
        const bonusScore = 5 * 0.05; // Bonus points

        const totalScore = Math.round(keywordScore + skillScore + structureScore + seniorityScore + bonusScore);
        return Math.min(100, Math.max(0, totalScore));
    }

    generateSuggestions(keywords, skills, structure, seniority, score, jobKeywords, resumeKeywords) {
        const suggestions = [];

        // Keyword suggestions
        if (keywords.percentage < 70) {
            const missingKeywords = jobKeywords.filter(k => !this.findKeywordInText(k, resumeKeywords.join(' '))).slice(0, 3);
            if (missingKeywords.length > 0) {
                suggestions.push({
                    type: 'warning',
                    text: `Add these keywords from the job description: ${missingKeywords.join(', ')}.`
                });
            }
        }

        // Skills suggestions
        if (skills.missing.length > 0) {
            const topMissing = skills.missing.slice(0, 3).join(', ');
            suggestions.push({
                type: 'warning',
                text: `Consider adding "${topMissing}" if you have experience with these technologies.`
            });
        }

        // Structure suggestions
        if (structure.foundCount < 4) {
            const missingSections = this.atsStructureSections.filter(s => !structure.sections[s]);
            suggestions.push({
                type: 'warning',
                text: `Include these sections in your resume: ${missingSections.slice(0, 2).join(', ')}.`
            });
        }

        // Seniority suggestions
        if (seniority.match === 'warning') {
            suggestions.push({
                type: 'warning',
                text: `Your experience level seems ${seniority.alignment === 'junior' ? 'lower' : 'higher'} than required. Adjust your positioning accordingly.`
            });
        }

        // Positive feedback
        if (score >= 80) {
            suggestions.push({
                type: 'positive',
                text: `Excellent alignment! Your resume matches this position very well.`
            });
        } else if (score >= 65) {
            suggestions.push({
                type: 'positive',
                text: `Good match! Your resume covers most requirements. Minor adjustments could improve compatibility.`
            });
        }

        // General tips
        if (score < 50) {
            suggestions.push({
                type: 'warning',
                text: `Use the exact terminology from the job description in your resume.`
            });
        }

        if (keywords.percentage < 60) {
            suggestions.push({
                type: 'warning',
                text: `Optimize for ATS by including more keywords naturally throughout your resume.`
            });
        }

        return suggestions;
    }

    displayResults(analysis) {
        const resultsContainer = document.getElementById('resultsContainer');
        const { score, keywordAnalysis, skillsAnalysis, structureAnalysis, seniorityAnalysis, suggestions } = analysis;

        // Hide inputs, show results
        document.querySelector('.ats-inputs').hidden = true;
        resultsContainer.hidden = false;

        // Animate score
        this.animateScore(score, keywordAnalysis, skillsAnalysis, structureAnalysis);

        // Display metrics
        this.displayKeywords(keywordAnalysis);
        this.displaySkills(skillsAnalysis);
        this.displayStructure(structureAnalysis);
        this.displaySeniority(seniorityAnalysis);

        // Display suggestions
        this.displaySuggestions(suggestions, score);

        // Scroll to results
        setTimeout(() => {
            resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    }

    animateScore(score, keywords, skills, structure) {
        const scoreNumber = document.getElementById('scoreNumber');
        const scoreCircle = document.getElementById('scoreCircle');
        const scoreFeedback = document.getElementById('scoreFeedback');

        // Update circle color
        scoreCircle.classList.remove('score-red', 'score-yellow', 'score-light-green', 'score-green');
        if (score < 50) {
            scoreCircle.classList.add('score-red');
        } else if (score < 70) {
            scoreCircle.classList.add('score-yellow');
        } else if (score < 86) {
            scoreCircle.classList.add('score-light-green');
        } else {
            scoreCircle.classList.add('score-green');
        }

        // Animate number
        let current = 0;
        const increment = Math.ceil(score / 30);
        const numberInterval = setInterval(() => {
            if (current >= score) {
                clearInterval(numberInterval);
                current = score;
            } else {
                current = Math.min(current + increment, score);
            }
            scoreNumber.textContent = current;
        }, 20);

        // Animate circle stroke
        const circumference = 597;
        const strokeDashoffset = circumference - (score / 100) * circumference;
        setTimeout(() => {
            scoreCircle.style.strokeDashoffset = strokeDashoffset;
        }, 100);

        // Feedback text
        if (score >= 85) {
            scoreFeedback.textContent = this.getLanguageText('Excellent match for this position!');
        } else if (score >= 70) {
            scoreFeedback.textContent = this.getLanguageText('Good alignment with the job requirements.');
        } else if (score >= 50) {
            scoreFeedback.textContent = this.getLanguageText('Moderate match. Consider the suggestions below.');
        } else {
            scoreFeedback.textContent = this.getLanguageText('Significant gaps. Review suggestions to improve.');
        }
    }

    displayKeywords(analysis) {
        document.getElementById('keywordsFound').textContent = `${analysis.found} / ${analysis.total}`;
        document.getElementById('keywordsPercent').textContent = `${analysis.percentage}%`;
        const bar = document.getElementById('keywordsBar');
        setTimeout(() => {
            bar.style.width = `${analysis.percentage}%`;
        }, 100);
    }

    displaySkills(analysis) {
        const skillsContent = document.getElementById('skillsContent');
        const skillsHtml = `
            <div class="metric-value">${analysis.found.length + analysis.missing.length} detected</div>
            <div class="skill-tags">
                ${analysis.found.map(skill => `
                    <span class="skill-tag found">
                        <span class="skill-icon">✓</span>
                        ${skill}
                    </span>
                `).join('')}
                ${analysis.missing.slice(0, 3).map(skill => `
                    <span class="skill-tag missing">
                        <span class="skill-icon">✗</span>
                        ${skill}
                    </span>
                `).join('')}
            </div>
        `;
        skillsContent.innerHTML = skillsHtml;
    }

    displayStructure(analysis) {
        const structureContent = document.getElementById('structureContent');
        const items = this.atsStructureSections.map(section => {
            const present = analysis.sections[section];
            return `
                <div class="structure-item ${present ? 'present' : 'missing'}">
                    <span class="status-icon ${present ? 'checkmark' : 'xmark'}">
                        ${present ? '✓' : '✗'}
                    </span>
                    <span>${section.charAt(0).toUpperCase() + section.slice(1)}</span>
                </div>
            `;
        }).join('');
        structureContent.innerHTML = `<div class="structure-items">${items}</div>`;
    }

    displaySeniority(analysis) {
        const seniorityContent = document.getElementById('seniorityContent');
        let level = 'Not detected';
        let color = '#999';

        for (const [keyword, data] of Object.entries(this.seniorityKeywords)) {
            if (data.weight === analysis.resumeLevel) {
                level = keyword.charAt(0).toUpperCase() + keyword.slice(1);
                break;
            }
        }

        if (analysis.resumeLevel > 0) {
            if (analysis.resumeLevel >= 0.7) {
                level = 'Senior/Lead/Principal';
            } else if (analysis.resumeLevel >= 0.5) {
                level = 'Pleno/Mid-Level';
            } else if (analysis.resumeLevel >= 0.3) {
                level = 'Junior/Entry-Level';
            }
        }

        seniorityContent.innerHTML = `<div class="seniority-badge">${level}</div>`;
    }

    displaySuggestions(suggestions, score) {
        const suggestionsContent = document.getElementById('suggestionsContent');
        if (suggestions.length === 0) {
            suggestionsContent.innerHTML = '<div class="suggestion-item positive"><span class="suggestion-icon">✓</span>Your resume is well-optimized!</div>';
            return;
        }

        const html = suggestions.map(suggestion => `
            <div class="suggestion-item ${suggestion.type}">
                <span class="suggestion-icon">${suggestion.type === 'positive' ? '✓' : '⚠'}</span>
                <span>${suggestion.text}</span>
            </div>
        `).join('');

        suggestionsContent.innerHTML = html;
    }

    resetAnalysis() {
        document.getElementById('jobDescription').value = '';
        document.getElementById('resumeText').value = '';
        document.getElementById('fileUpload').value = '';
        document.getElementById('fileStatus').textContent = '';
        document.getElementById('fileStatus').classList.remove('success', 'error');
        document.querySelector('.ats-inputs').hidden = false;
        document.getElementById('resultsContainer').hidden = true;
    }

    downloadReport() {
        const jobDescription = document.getElementById('jobDescription').value;
        const resumeText = document.getElementById('resumeText').value;
        const score = document.getElementById('scoreNumber').textContent;
        const keywords = document.getElementById('keywordsFound').textContent;
        const skills = document.getElementById('skillsContent').innerText;

        const report = `
ATS ANALYSIS REPORT
═════════════════════════════════════

Generated: ${new Date().toLocaleString()}

OVERALL SCORE: ${score}/100

KEY METRICS:
─────────────
Keywords Found: ${keywords}
Skills: See details below
Structure: Check analysis

RESUME ANALYSIS:
─────────────
${resumeText.substring(0, 500)}...

JOB DESCRIPTION:
─────────────
${jobDescription.substring(0, 500)}...

SUGGESTIONS:
─────────────
${document.getElementById('suggestionsContent').innerText}

═════════════════════════════════════
This report was generated by ATS Analyzer
        `;

        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(report));
        element.setAttribute('download', `ATS_Analysis_${Date.now()}.txt`);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }
}

// Initialize analyzer when page loads
document.addEventListener('DOMContentLoaded', () => {
    new ATSAnalyzer();
});
