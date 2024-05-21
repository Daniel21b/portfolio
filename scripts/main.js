'use strict';

(function() {
    document.addEventListener('DOMContentLoaded', () => {

        // Setup smooth scrolling
        const setupSmoothScrolling = () => {
            const anchors = document.querySelectorAll('nav a');

            if (anchors.length === 0) {
                console.error('No navigation links found.');
                return;
            }

            anchors.forEach(anchor => {
                anchor.addEventListener('click', function(e) {
                    e.preventDefault();

                    const targetId = this.getAttribute('href');
                    const targetElement = document.querySelector(targetId);

                    if (!targetElement) {
                        console.error(`Target element not found for: ${targetId}`);
                        return;
                    }

                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                });
            });
        };

        // Smooth scroll on page load if hash is present
        const smoothScrollOnLoad = () => {
            if (window.location.hash) {
                const targetElement = document.querySelector(window.location.hash);

                if (targetElement) {
                    setTimeout(() => {
                        targetElement.scrollIntoView({
                            behavior: 'smooth'
                        });
                    }, 100);
                }
            }
        };

        // Setup dark mode toggle and persistence
        const setupDarkModeToggle = () => {
            const toggleSwitch = document.querySelector('#dark-mode-toggle');
            const currentTheme = localStorage.getItem('theme') || 'light';

            if (currentTheme === 'dark') {
                document.body.classList.add('dark-mode');
            }

            toggleSwitch.addEventListener('click', () => {
                document.body.classList.toggle('dark-mode');
                const theme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
                localStorage.setItem('theme', theme);
            });
        };

        // Setup scroll to top button
        const setupScrollToTopButton = () => {
            const scrollToTopBtn = document.querySelector('#scroll-to-top');

            if (!scrollToTopBtn) {
                console.error('Scroll to top button not found.');
                return;
            }

            window.addEventListener('scroll', () => {
                if (window.scrollY > 300) {
                    scrollToTopBtn.style.display = 'block';
                } else {
                    scrollToTopBtn.style.display = 'none';
                }
            });

            scrollToTopBtn.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        };

        // Setup form validation
        const setupFormValidation = () => {
            const form = document.querySelector('#contact-form');

            if (!form) {
                console.error('Contact form not found.');
                return;
            }

            form.addEventListener('submit', (e) => {
                const email = form.querySelector('input[name="email"]').value;
                const message = form.querySelector('textarea[name="message"]').value;

                if (!email || !message) {
                    e.preventDefault();
                    alert('Please fill out all fields.');
                }
            });
        };

        // Setup skills progress bars
        const setupSkillsProgressBars = () => {
            const skills = document.querySelectorAll('.skill');

            if (skills.length === 0) {
                console.error('No skills found.');
                return;
            }

            const animateSkills = () => {
                skills.forEach(skill => {
                    const skillTop = skill.getBoundingClientRect().top;
                    const windowHeight = window.innerHeight;

                    if (skillTop < windowHeight - 50) {
                        skill.style.width = skill.getAttribute('data-progress') + '%';
                    }
                });
            };

            window.addEventListener('scroll', animateSkills);
        };

        // Setup project filtering
        const setupProjectFiltering = () => {
            const filterButtons = document.querySelectorAll('.filter-button');
            const projects = document.querySelectorAll('.project');

            if (filterButtons.length === 0 || projects.length === 0) {
                console.error('No filter buttons or projects found.');
                return;
            }

            filterButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const category = button.getAttribute('data-category');

                    projects.forEach(project => {
                        if (category === 'all' || project.classList.contains(category)) {
                            project.style.display = 'block';
                        } else {
                            project.style.display = 'none';
                        }
                    });
                });
            });
        };

        // Setup responsive navigation menu
        const setupResponsiveMenu = () => {
            const menuToggle = document.querySelector('#menu-toggle');
            const navMenu = document.querySelector('nav ul');

            if (!menuToggle || !navMenu) {
                console.error('Menu toggle button or navigation menu not found.');
                return;
            }

            menuToggle.addEventListener('click', () => {
                navMenu.classList.toggle('visible');
            });
        };

        const init = () => {
            try {
                setupSmoothScrolling();
                smoothScrollOnLoad();
                setupDarkModeToggle();
                setupScrollToTopButton();
                setupFormValidation();
                setupSkillsProgressBars();
                setupProjectFiltering();
                setupResponsiveMenu();
                console.log('All features initialized successfully.');
            } catch (error) {
                console.error('Error initializing application:', error);
            }
        };

        init();
    });
})();
