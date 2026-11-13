const timelineData = [
    { id: 1, title: "Voter Registration", shortDesc: "Get registered and confirm your eligibility.", longDesc: "The first step in participating in an election is ensuring you are registered to vote. Eligibility requirements, registration methods and deadlines vary by region. Always check the rules published by your official election authority.", details: ["Check the eligibility requirements for your area.", "Gather the identification or supporting documents requested.", "Complete registration through an approved channel before the deadline."] },
    { id: 2, title: "Campaigning", shortDesc: "Candidates introduce their ideas and plans.", longDesc: "Candidates and political parties communicate their priorities and plans to voters. Campaigning can include public meetings, debates, interviews, advertisements and community outreach. It is a useful time to compare proposals and check claims against reliable sources.", details: ["Listen to debates and compare candidate platforms.", "Look for original sources behind important claims.", "Be alert to misleading information and manipulated content."] },
    { id: 3, title: "Election Day (Voting)", shortDesc: "Make your choice and cast your ballot.", longDesc: "On election day, eligible voters cast their ballots through the process established by their election authority. Depending on the jurisdiction, options may include in-person voting, early voting or postal ballots. Voting procedures and identification rules differ by location.", details: ["Confirm your polling location and voting hours in advance.", "Check the official instructions and identification requirements.", "Follow ballot instructions and protect the secrecy of your vote."] },
    { id: 4, title: "Results & Certification", shortDesc: "Votes are counted, checked and certified.", longDesc: "After voting closes, election officials process and count ballots under established procedures. Verification, audits or recounts may take place where required. Preliminary figures are not always final; certification is the formal confirmation by the responsible election authority.", details: ["Understand the difference between preliminary and official results.", "Allow time for verification and any legally required checks.", "Refer to the election authority for certified results."] }
];

document.addEventListener("DOMContentLoaded", () => {
    const timelineContainer = document.querySelector(".timeline");
    const stepDetailsContainer = document.getElementById("step-details");
    const chatForm = document.getElementById("chat-form");
    const chatInput = document.getElementById("chat-input");
    const chatMessages = document.getElementById("chat-messages");

    function renderTimeline() {
        timelineData.forEach((step) => {
            const item = document.createElement("button");
            item.type = "button";
            item.className = "timeline-item";
            item.setAttribute("aria-pressed", "false");
            item.setAttribute("aria-controls", "step-details");
            item.innerHTML = `
                <span class="timeline-marker">${String(step.id).padStart(2, "0")}</span>
                <span class="timeline-content"><h3>${step.title}</h3><p>${step.shortDesc}</p></span>
                <span class="timeline-arrow" aria-hidden="true">→</span>
            `;
            item.addEventListener("click", () => selectStep(step, item));
            timelineContainer.appendChild(item);
        });
    }

    function selectStep(step, itemElement) {
        document.querySelectorAll(".timeline-item").forEach((element) => {
            element.classList.remove("active");
            element.setAttribute("aria-pressed", "false");
        });
        itemElement.classList.add("active");
        itemElement.setAttribute("aria-pressed", "true");

        stepDetailsContainer.replaceChildren();
        const number = document.createElement("span");
        number.className = "detail-number";
        number.textContent = String(step.id).padStart(2, "0");
        const kicker = document.createElement("span");
        kicker.className = "detail-kicker";
        kicker.textContent = `STAGE 0${step.id} · THE ELECTION JOURNEY`;
        const heading = document.createElement("h2");
        heading.id = "assistant-heading";
        heading.textContent = step.title;
        const description = document.createElement("p");
        description.textContent = step.longDesc;
        const list = document.createElement("ul");
        step.details.forEach((detail) => {
            const li = document.createElement("li");
            li.textContent = detail;
            list.appendChild(li);
        });
        stepDetailsContainer.append(number, kicker, heading, description, list);
    }

    function addMessage(content, sender) {
        const message = document.createElement("div");
        message.className = `message ${sender}`;
        const paragraph = document.createElement("p");
        // Render model output as text, not HTML, to prevent markup injection.
        paragraph.textContent = String(content ?? "");
        message.appendChild(paragraph);
        chatMessages.appendChild(message);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    async function sendMessage(rawMessage) {
        const message = rawMessage.trim();
        if (!message || chatInput.disabled) return;
        addMessage(message, "user");
        chatInput.value = "";
        chatInput.disabled = true;
        const sendButton = chatForm.querySelector("button[type='submit']");
        sendButton.disabled = true;
        sendButton.querySelector("span").textContent = "Thinking";
        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Sorry, something went wrong. Please try again.");
            addMessage(data.response || "I couldn't generate a response. Please try again.", "assistant");
        } catch (error) {
            addMessage(error.message || "Unable to connect to the assistant. Please try again later.", "assistant");
        } finally {
            chatInput.disabled = false;
            sendButton.disabled = false;
            sendButton.querySelector("span").textContent = "Send";
            chatInput.focus();
        }
    }

    chatForm.addEventListener("submit", (event) => {
        event.preventDefault();
        sendMessage(chatInput.value);
    });

    document.querySelectorAll(".suggestion").forEach((button) => {
        button.addEventListener("click", () => {
            chatInput.value = button.dataset.prompt || "";
            sendMessage(chatInput.value);
        });
    });

    renderTimeline();
    const firstItem = timelineContainer.querySelector(".timeline-item");
    if (firstItem) selectStep(timelineData[0], firstItem);
});