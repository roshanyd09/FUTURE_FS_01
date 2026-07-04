document.addEventListener("DOMContentLoaded", () => {
    const typingElement = document.getElementById("typing");

    if (typingElement) {
        typingElement.textContent = "Aspiring Software Developer";
    }

    const revealTargets = document.querySelectorAll("[data-reveal]");
    const content = document.querySelector(".content");
    const navLinks = Array.from(document.querySelectorAll(".sidebar nav a[href^='#']"));
    const sections = Array.from(document.querySelectorAll("main.content section[id]"));

    if ("IntersectionObserver" in window) {
        revealTargets.forEach((element) => element.classList.add("reveal"));

        const observer = new IntersectionObserver((entries, currentObserver) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    currentObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: "0px 0px -8% 0px"
        });

        revealTargets.forEach((element) => observer.observe(element));
    } else {
        revealTargets.forEach((element) => element.classList.add("reveal", "is-visible"));
    }

    const form = document.getElementById("contactForm");

    if (form) {
        form.addEventListener("submit", (event) => {
            event.preventDefault();

            const name = document.getElementById("name")?.value || "";
            const email = document.getElementById("email")?.value || "";
            const subject = document.getElementById("subject")?.value || "";
            const message = document.getElementById("message")?.value || "";

            if (name === "" || email === "" || subject === "" || message === "") {
                alert("Please fill all fields.");
                return;
            }

            alert("Message Sent Successfully ✅");
            form.reset();
        });
    }

    if (!content || !navLinks.length || !sections.length || !("IntersectionObserver" in window)) {
        return;
    }

    let currentActiveSection = sections[0]?.id;

    const setActiveLink = (sectionId) => {
        navLinks.forEach((link) => {
            const isActive = link.getAttribute("href") === `#${sectionId}`;
            link.classList.toggle("active", isActive);
        });
    };

    navLinks.forEach((link) => {
        link.addEventListener("click", (event) => {
            const targetId = link.getAttribute("href")?.slice(1);
            const targetSection = targetId ? document.getElementById(targetId) : null;

            if (!targetSection) {
                return;
            }

            event.preventDefault();
            targetSection.scrollIntoView({ behavior: "smooth", block: "start" });
            setActiveLink(targetId);
            currentActiveSection = targetId;
        });
    });

    const sectionObserver = new IntersectionObserver((entries) => {
        const visibleEntries = entries.filter((entry) => entry.isIntersecting);

        if (!visibleEntries.length) {
            return;
        }

        const mostVisible = visibleEntries.reduce((best, entry) => {
            return entry.intersectionRatio > best.intersectionRatio ? entry : best;
        }, visibleEntries[0]);

        if (mostVisible.target.id !== currentActiveSection) {
            currentActiveSection = mostVisible.target.id;
            setActiveLink(currentActiveSection);
        }
    }, {
        root: content,
        threshold: [0.35, 0.5, 0.65],
        rootMargin: "-20% 0px -35% 0px"
    });

    sections.forEach((section) => sectionObserver.observe(section));
    setActiveLink(currentActiveSection);
});