        // --- 1. 原有的輪播邏輯 ---
        const track = document.getElementById('testimonial-track');
        const dots = document.querySelectorAll('.dot');
        const originalSlides = document.querySelectorAll('.testimonial-slide');
        
        const firstClone = originalSlides[0].cloneNode(true);
        const lastClone = originalSlides[originalSlides.length - 1].cloneNode(true);
        track.appendChild(firstClone);
        track.prepend(lastClone);

        const allSlides = document.querySelectorAll('.testimonial-slide');
        let slideIndex = 1;
        let isTransitioning = false;

        track.style.transition = 'none';
        track.style.transform = `translateX(-${slideIndex * 100}%)`;

        function updateCarousel(animate = true) {
            track.style.transition = animate ? 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)' : 'none';
            track.style.transform = `translateX(-${slideIndex * 100}%)`;
            let dotIndex = slideIndex - 1;
            if (slideIndex >= allSlides.length - 1) dotIndex = 0;
            if (slideIndex <= 0) dotIndex = originalSlides.length - 1;
            dots.forEach(dot => dot.classList.remove('active'));
            if (dots[dotIndex]) dots[dotIndex].classList.add('active');
        }

        function moveSlide(n) { if (!isTransitioning) { isTransitioning = true; slideIndex += n; updateCarousel(true); } }
        track.addEventListener('transitionend', () => {
            isTransitioning = false;
            if (slideIndex >= allSlides.length - 1) { slideIndex = 1; updateCarousel(false); }
            if (slideIndex <= 0) { slideIndex = allSlides.length - 2; updateCarousel(false); }
        });
        function currentSlide(n) { if (!isTransitioning) { slideIndex = n + 1; updateCarousel(true); } }

        // --- 2. 新增：測驗邏輯 ---
        let currentQuizData = [];
        let questionIndex = 0;
        let score = 0;
        let canAnswer = true;

        // 綁定頁面上所有的進入測驗按鈕
        document.querySelector('.btn-quiz').addEventListener('click', openQuiz);
        document.querySelector('.btn-quiz-nav').addEventListener('click', (e) => { 
            e.preventDefault(); 
            openQuiz(); 
        });
        function openQuiz() {
            document.getElementById('quiz-modal').style.display = 'flex';
            startQuiz();
        }

        function closeQuiz() {
            document.getElementById('quiz-modal').style.display = 'none';
        }

        function startQuiz() {
            // 從 questions.js 的 questionBank 隨機挑 10 題
            const shuffled = [...questionBank].sort(() => 0.5 - Math.random());
            currentQuizData = shuffled.slice(0, 10);
            questionIndex = 0;
            score = 0;
            document.getElementById('quiz-main').style.display = 'block';
            document.getElementById('result-content').style.display = 'none';
            showQuestion();
        }

        function showQuestion() {
            canAnswer = true;
            const data = currentQuizData[questionIndex];
            document.getElementById('progress').innerText = `題目 ${questionIndex + 1} / 10`;
            document.getElementById('question-text').innerText = data.q;
            document.getElementById('feedback').innerText = '';
            document.getElementById('next-btn').style.display = 'none';

            const optionsGrid = document.getElementById('options-grid');
            optionsGrid.innerHTML = '';

            data.options.forEach((opt, index) => {
                const btn = document.createElement('button');
                btn.classList.add('option-btn');
                btn.innerText = opt;
                btn.onclick = () => checkAnswer(index, btn);
                optionsGrid.appendChild(btn);
            });
        }

        function checkAnswer(selectedIndex, btnElement) {
            if (!canAnswer) return;
            canAnswer = false;
            const correctIndex = currentQuizData[questionIndex].a;
            const allButtons = document.querySelectorAll('.option-btn');

            if (selectedIndex === correctIndex) {
                btnElement.classList.add('correct');
                document.getElementById('feedback').innerText = '✅ 太棒了！答對了';
                document.getElementById('feedback').style.color = '#28a745';
                score += 10;
            } else {
                btnElement.classList.add('wrong');
                allButtons[correctIndex].classList.add('correct');
                document.getElementById('feedback').innerText = `❌ 答錯了！`;
                document.getElementById('feedback').style.color = '#dc3545';
            }
            document.getElementById('next-btn').style.display = 'inline-block';
        }

        function nextQuestion() {
            questionIndex++;
            if (questionIndex < 10) showQuestion();
            else showResult();
        }

        function showResult() {
            document.getElementById('quiz-main').style.display = 'none';
            document.getElementById('result-content').style.display = 'block';
            document.getElementById('final-score').innerText = score;
        }