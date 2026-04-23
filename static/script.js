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

    // 1. Initialize Timeline
    function renderTimeline() {
        timelineData.forEach((step, index) => {
            const item = document.createElement('div');
            item.className = 'timeline-item';
            item.setAttribute('tabindex', '0');
            item.setAttribute('role', 'button');
            item.setAttribute('aria-expanded', 'false');
            item.setAttribute('aria-controls', 'step-details');
            
            // Render HTML for timeline item
            item.innerHTML = `
                <div class="timeline-marker">${step.id}</div>
                <div class="timeline-content">
                    <h3>${step.title}</h3>
                    <p>${step.shortDesc}</p>
                </div>
            `;

            // Event listeners for interaction
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

    // 2. Handle Timeline Selection
    function selectStep(step, itemElement) {
        // Update active class
        document.querySelectorAll('.timeline-item').forEach(el => {
            el.classList.remove('active');
            el.setAttribute('aria-expanded', 'false');
        });
        itemElement.classList.add('active');
        itemElement.setAttribute('aria-expanded', 'true');

        // Update details panel
        let detailsList = step.details.map(d => `<li>${d}</li>`).join('');
        stepDetailsContainer.innerHTML = `
            <h2 id="assistant-heading">${step.title}</h2>
            <p>${step.longDesc}</p>
            <ul>${detailsList}</ul>
        `;
    }

    // 3. Handle Chat Submission
    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const message = chatInput.value.trim();
        if (!message) return;

        // Add user message to UI
        addMessage(message, 'user');
        chatInput.value = '';
        
        // Disable input while loading
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
            // Re-enable input
            chatInput.disabled = false;
            chatForm.querySelector('button').disabled = false;
            chatInput.focus();
        }
    });

    // Utility: Add message to chat box
    function addMessage(text, sender) {
        const msgElement = document.createElement('div');
        msgElement.className = `message ${sender}`;
        
        // Simple markdown parsing for bold text
        const formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        msgElement.innerHTML = `<p>${formattedText}</p>`;
        
        chatMessages.appendChild(msgElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Initial setup
    renderTimeline();
    
    // Select the first item by default
    const firstItem = timelineContainer.querySelector('.timeline-item');
    if (firstItem) {
        selectStep(timelineData[0], firstItem);
    }
});
