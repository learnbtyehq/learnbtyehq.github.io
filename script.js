/* ========================================
   LearnByte - Main JavaScript
   ======================================== */

document.addEventListener("DOMContentLoaded", function () {

    /* ========================================
       Mobile Navigation
       ======================================== */

    const menuToggle =
        document.getElementById("menuToggle");

    const navMenu =
        document.getElementById("navMenu");


    if (menuToggle && navMenu) {

        const navLinks =
            navMenu.querySelectorAll("a");


        function closeMenu() {

            navMenu.classList.remove("active");

            menuToggle.setAttribute(
                "aria-expanded",
                "false"
            );

            menuToggle.setAttribute(
                "aria-label",
                "Open navigation menu"
            );

        }


        function openMenu() {

            navMenu.classList.add("active");

            menuToggle.setAttribute(
                "aria-expanded",
                "true"
            );

            menuToggle.setAttribute(
                "aria-label",
                "Close navigation menu"
            );

        }


        /* Toggle menu */

        menuToggle.addEventListener(
            "click",
            function (event) {

                event.stopPropagation();

                const isOpen =
                    navMenu.classList.contains("active");

                if (isOpen) {
                    closeMenu();
                } else {
                    openMenu();
                }

            }
        );


        /* Close after selecting a navigation link */

        navLinks.forEach(function (link) {

            link.addEventListener(
                "click",
                function () {

                    closeMenu();

                }
            );

        });


        /* Close when clicking outside */

        document.addEventListener(
            "click",
            function (event) {

                const clickedInsideMenu =
                    navMenu.contains(event.target);

                const clickedToggle =
                    menuToggle.contains(event.target);


                if (
                    !clickedInsideMenu &&
                    !clickedToggle &&
                    navMenu.classList.contains("active")
                ) {

                    closeMenu();

                }

            }
        );


        /* Close with Escape key */

        document.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key === "Escape" &&
                    navMenu.classList.contains("active")
                ) {

                    closeMenu();

                    menuToggle.focus();

                }

            }
        );


        /* Close mobile menu when returning to desktop */

        window.addEventListener(
            "resize",
            function () {

                if (window.innerWidth > 680) {

                    closeMenu();

                }

            }
        );

    }


    /* ========================================
       Dynamic Footer Year
       ======================================== */

    const yearElement =
        document.querySelector(".footer-bottom p");


    if (yearElement) {

        const currentYear =
            new Date().getFullYear();


        yearElement.textContent =
            `© ${currentYear} LearnByte. All rights reserved.`;

    }

});
