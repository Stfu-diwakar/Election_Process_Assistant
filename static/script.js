const timelineData = [
    {
        id: 1,
        title: "Voter Registration",
        shortDesc: "Sign up to vote.",
        longDesc: "The first step in participating in an election is ensuring you are registered to vote. Eligibility requirements vary by region, but generally require you to be a citizen of a certain age. Deadlines to register are often weeks before the actual election day.",
        details: [
            "Check your eligibility requirements.",
            "Gather necessary identification documents.",
            "Submit your registration online, by mail, or in person before the deadline."
        ]
    },
    {
        id: 2,
        title: "Campaigning",
        shortDesc: "Candidates share their platforms.",
        longDesc: "During this phase, candidates and political parties actively campaign to win over voters. This includes public rallies, debates, advertisements, and community outreach. It's a crucial time for voters to research candidate platforms.",
        details: [
            "Watch candidate debates and town halls.",
            "Read official party platforms and candidate websites.",
            "Critically evaluate information and watch out for misinformation."
        ]
    },
    {
        id: 3,
        title: "Election Day (Voting)",
        shortDesc: "Cast your ballot.",
        longDesc: "This is the day voters head to the polls to cast their ballots. Many regions also offer early voting or mail-in voting options. Every eligible citizen has the right to vote secretly and securely.",
        details: [
            "Find your designated polling place.",
            "Bring required identification if applicable in your region.",
            "Follow instructions to mark your ballot clearly and accurately."
        ]
    },
    {
        id: 4,
        title: "Results & Certification",
        shortDesc: "Counting votes and declaring winners.",
        longDesc: "After polls close, election officials begin counting the ballots. Depending on the voting method and closeness of the race, this can take days. Once all valid votes are counted, the results are officially certified.",
        details: [
            "Initial preliminary results are reported by news outlets.",
            "Official counts continue until all mail-in and provisional ballots are verified.",
            "The election authority officially certifies the final results."
        ]
    }
];

document.addEventListener('DOMContentLoaded', () => {
    const timelineContainer = document.querySelector('.timeline');
    const stepDetailsContainer = document.getElementById('step-details');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');


    function renderTimeline() {
        timelineData.forEach((step, index) => {
            const item = document.createElement('div');
            item.className = 'timeline-item';
            item.setAttribute('tabindex', '0');
            item.setAttribute('role', 'button');
            item.setAttribute('aria-expanded', 'false');
            item.setAttribute('aria-controls', 'step-details');
            

            item.innerHTML = `
                <div class="timeline-marker">${step.id}</div>
                <div class="timeline-content">
                    <h3>${step.title}</h3>
                    <p>${step.shortDesc}</p>
                </div>
            `;


            item.addEventListener('click', () => selectStep(step, item));
            item.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    selectStep(step, item);
                }
            });

            timelineContainer.appendChild(item);
        });
    }


    function selectStep(step, itemElement) {

        document.querySelectorAll('.timeline-item').forEach(el => {
            el.classList.remove('active');
            el.setAttribute('aria-expanded', 'false');
        });
        itemElement.classList.add('active');
        itemElement.setAttribute('aria-expanded', 'true');


        let detailsList = step.details.map(d => `<li>${d}</li>`).join('');
        stepDetailsContainer.innerHTML = `
            <h2 id="assistant-heading">${step.title}</h2>
            <p>${step.longDesc}</p>
            <ul>${detailsList}</ul>
        `;
    }


    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const message = chatInput.value.trim();
        if (!message) return;


        addMessage(message, 'user');
        chatInput.value = '';
        

        chatInput.disabled = true;
        chatForm.querySelector('button').disabled = true;

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message })
            });

            const data = await response.json();
            
            if (response.ok) {
                addMessage(data.response, 'assistant');
            } else {
                addMessage(data.error || "Sorry, an error occurred.", 'assistant');
            }
        } catch (error) {
            addMessage("Unable to connect to the assistant. Please try again later.", 'assistant');
        } finally {

            chatInput.disabled = false;
            chatForm.querySelector('button').disabled = false;
            chatInput.focus();
        }
    });


    function addMessage(text, sender) {
        const msgElement = document.createElement('div');
        msgElement.className = `message ${sender}`;
        

        const formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        msgElement.innerHTML = `<p>${formattedText}</p>`;
        
        chatMessages.appendChild(msgElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }


    renderTimeline();
    

    const firstItem = timelineContainer.querySelector('.timeline-item');
    if (firstItem) {
        selectStep(timelineData[0], firstItem);
    }

    const canvas = document.getElementById('bg-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];
        const numParticles = window.innerWidth < 768 ? 40 : 80;
        const maxDistance = 150;
        
        let mouse = {
            x: null,
            y: null,
            radius: 150
        };

        window.addEventListener('mousemove', function(event) {
            mouse.x = event.x;
            mouse.y = event.y;
        });
        
        window.addEventListener('mouseout', function() {
            mouse.x = undefined;
            mouse.y = undefined;
        });

        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        }

        window.addEventListener('resize', () => {
            resize();
            initParticles();
        });

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 1.5;
                this.vy = (Math.random() - 0.5) * 1.5;
                this.radius = Math.random() * 2 + 1;
            }

            update() {
                if (this.x > width || this.x < 0) this.vx = -this.vx;
                if (this.y > height || this.y < 0) this.vy = -this.vy;

                // Mouse interaction
                if (mouse.x != null && mouse.y != null) {
                    let dx = mouse.x - this.x;
                    let dy = mouse.y - this.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < mouse.radius) {
                        const forceDirectionX = dx / distance;
                        const forceDirectionY = dy / distance;
                        const maxDistance = mouse.radius;
                        const force = (maxDistance - distance) / maxDistance;
                        const directionX = forceDirectionX * force * 5;
                        const directionY = forceDirectionY * force * 5;
                        
                        this.x -= directionX;
                        this.y -= directionY;
                    }
                }

                this.x += this.vx;
                this.y += this.vy;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(79, 70, 229, 0.5)';
                ctx.fill();
            }
        }

        function initParticles() {
            particles = [];
            for (let i = 0; i < numParticles; i++) {
                particles.push(new Particle());
            }
        }

        function connect() {
            for (let a = 0; a < particles.length; a++) {
                for (let b = a; b < particles.length; b++) {
                    let dx = particles[a].x - particles[b].x;
                    let dy = particles[a].y - particles[b].y;
                    let distance = dx * dx + dy * dy;

                    if (distance < maxDistance * maxDistance) {
                        let opacity = 1 - (distance / (maxDistance * maxDistance));
                        ctx.strokeStyle = `rgba(236, 72, 153, ${opacity * 0.4})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }
            }
        }

        function animate() {
            requestAnimationFrame(animate);
            ctx.clearRect(0, 0, width, height);

            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
            }
            connect();
        }

        resize();
        initParticles();
        animate();
    }
});
