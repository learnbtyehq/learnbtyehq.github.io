/* ========================================
   LearnByte SEO Control Center
   Admin JavaScript
   ======================================== */


/* ========================================
   STORAGE
   ======================================== */

const STORAGE_KEYS = {
    links: "learnbyte_internal_links",
    redirects: "learnbyte_redirects",
    keywords: "learnbyte_keywords"
};


function loadData(key) {

    try {

        return JSON.parse(
            localStorage.getItem(key)
        ) || [];

    } catch (error) {

        console.error(
            "Could not load data:",
            error
        );

        return [];

    }

}


function saveData(key, data) {

    localStorage.setItem(
        key,
        JSON.stringify(data)
    );

}


/* ========================================
   DATA
   ======================================== */

let links = loadData(
    STORAGE_KEYS.links
);

let redirects = loadData(
    STORAGE_KEYS.redirects
);

let keywords = loadData(
    STORAGE_KEYS.keywords
);


/* ========================================
   ELEMENTS
   ======================================== */

const navItems =
    document.querySelectorAll(
        ".nav-item"
    );

const sections =
    document.querySelectorAll(
        ".admin-section"
    );

const pageTitle =
    document.getElementById(
        "pageTitle"
    );

const mobileMenu =
    document.getElementById(
        "mobileMenu"
    );

const sidebar =
    document.getElementById(
        "sidebar"
    );

const toast =
    document.getElementById(
        "toast"
    );


/* ========================================
   SECTION TITLES
   ======================================== */

const sectionTitles = {

    dashboard:
        "SEO Control Center",

    links:
        "Internal Links",

    redirects:
        "Redirect Manager",

    keywords:
        "Keyword Tracker",

    pages:
        "LearnByte Pages"

};


/* ========================================
   NAVIGATION
   ======================================== */

function openSection(sectionId) {

    navItems.forEach(
        item => {

            item.classList.toggle(
                "active",
                item.dataset.section === sectionId
            );

        }
    );


    sections.forEach(
        section => {

            section.classList.toggle(
                "active",
                section.id === sectionId
            );

        }
    );


    if (pageTitle) {

        pageTitle.textContent =
            sectionTitles[sectionId] ||
            "SEO Control Center";

    }


    sidebar.classList.remove(
        "open"
    );


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


navItems.forEach(
    item => {

        item.addEventListener(
            "click",
            () => {

                openSection(
                    item.dataset.section
                );

            }
        );

    }
);


/* ========================================
   QUICK ACTIONS
   ======================================== */

document.querySelectorAll(
    "[data-open]"
).forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                openSection(
                    button.dataset.open
                );

            }
        );

    }
);


/* ========================================
   MOBILE MENU
   ======================================== */

if (mobileMenu) {

    mobileMenu.addEventListener(
        "click",
        () => {

            sidebar.classList.toggle(
                "open"
            );

        }
    );

}


/* ========================================
   TOAST
   ======================================== */

let toastTimer;


function showToast(message) {

    if (!toast) {
        return;
    }

    toast.textContent = message;

    toast.classList.add(
        "show"
    );


    clearTimeout(
        toastTimer
    );


    toastTimer = setTimeout(
        () => {

            toast.classList.remove(
                "show"
            );

        },
        2400
    );

}


/* ========================================
   ESCAPE HTML
   ======================================== */

function escapeHTML(value) {

    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


/* ========================================
   INTERNAL LINKS
   ======================================== */

const linkForm =
    document.getElementById(
        "linkForm"
    );

const linksTableBody =
    document.getElementById(
        "linksTableBody"
    );

const linksEmpty =
    document.getElementById(
        "linksEmpty"
    );

const linksTableWrapper =
    document.getElementById(
        "linksTableWrapper"
    );


function renderLinks() {

    if (!linksTableBody) {
        return;
    }


    linksTableBody.innerHTML = "";


    if (links.length === 0) {

        linksEmpty.classList.remove(
            "hidden"
        );

        linksTableWrapper.classList.add(
            "hidden"
        );

        return;

    }


    linksEmpty.classList.add(
        "hidden"
    );

    linksTableWrapper.classList.remove(
        "hidden"
    );


    links.forEach(
        (link, index) => {

            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>
                    ${escapeHTML(link.from)}
                </td>

                <td>
                    ${escapeHTML(link.to)}
                </td>

                <td>
                    ${escapeHTML(link.anchor)}
                </td>

                <td>

                    <button
                        type="button"
                        class="delete-button"
                        data-delete-link="${index}"
                    >
                        Delete
                    </button>

                </td>

            `;


            linksTableBody.appendChild(
                row
            );

        }
    );

}


if (linkForm) {

    linkForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const formData =
                new FormData(
                    linkForm
                );


            const newLink = {

                from:
                    formData.get(
                        "linkFrom"
                    ).trim(),

                to:
                    formData.get(
                        "linkTo"
                    ).trim(),

                anchor:
                    formData.get(
                        "anchorText"
                    ).trim(),

                createdAt:
                    new Date().toISOString()

            };


            links.push(
                newLink
            );


            saveData(
                STORAGE_KEYS.links,
                links
            );


            linkForm.reset();

            renderLinks();

            updateStats();

            showToast(
                "Internal link saved."
            );

        }
    );

}


if (linksTableBody) {

    linksTableBody.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(
                    "[data-delete-link]"
                );


            if (!button) {
                return;
            }


            const index =
                Number(
                    button.dataset.deleteLink
                );


            if (
                !Number.isInteger(index) ||
                index < 0 ||
                index >= links.length
            ) {
                return;
            }


            links.splice(
                index,
                1
            );


            saveData(
                STORAGE_KEYS.links,
                links
            );


            renderLinks();

            updateStats();

            showToast(
                "Internal link deleted."
            );

        }
    );

}


/* ========================================
   REDIRECTS
   ======================================== */

const redirectForm =
    document.getElementById(
        "redirectForm"
    );

const redirectsTableBody =
    document.getElementById(
        "redirectsTableBody"
    );

const redirectsEmpty =
    document.getElementById(
        "redirectsEmpty"
    );

const redirectsTableWrapper =
    document.getElementById(
        "redirectsTableWrapper"
    );


function renderRedirects() {

    if (!redirectsTableBody) {
        return;
    }


    redirectsTableBody.innerHTML = "";


    if (redirects.length === 0) {

        redirectsEmpty.classList.remove(
            "hidden"
        );

        redirectsTableWrapper.classList.add(
            "hidden"
        );

        return;

    }


    redirectsEmpty.classList.add(
        "hidden"
    );

    redirectsTableWrapper.classList.remove(
        "hidden"
    );


    redirects.forEach(
        (redirect, index) => {

            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>
                    ${escapeHTML(redirect.oldUrl)}
                </td>

                <td>
                    ${escapeHTML(redirect.newUrl)}
                </td>

                <td>
                    ${escapeHTML(
                        redirect.reason || "—"
                    )}
                </td>

                <td>

                    <button
                        type="button"
                        class="delete-button"
                        data-delete-redirect="${index}"
                    >
                        Delete
                    </button>

                </td>

            `;


            redirectsTableBody.appendChild(
                row
            );

        }
    );

}


if (redirectForm) {

    redirectForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const formData =
                new FormData(
                    redirectForm
                );


            const oldUrl =
                formData
                    .get("oldUrl")
                    .trim();

            const newUrl =
                formData
                    .get("newUrl")
                    .trim();

            const reason =
                formData
                    .get("redirectReason")
                    .trim();


            if (
                oldUrl === "" ||
                newUrl === ""
            ) {

                showToast(
                    "Old and new URLs are required."
                );

                return;

            }


            if (
                oldUrl === newUrl
            ) {

                showToast(
                    "Old and new URLs cannot be the same."
                );

                return;

            }


            const duplicate =
                redirects.some(
                    item =>
                        item.oldUrl === oldUrl
                );


            if (duplicate) {

                showToast(
                    "This old URL already exists."
                );

                return;

            }


            redirects.push({

                oldUrl,
                newUrl,
                reason,

                createdAt:
                    new Date().toISOString()

            });


            saveData(
                STORAGE_KEYS.redirects,
                redirects
            );


            redirectForm.reset();

            renderRedirects();

            updateStats();

            showToast(
                "Redirect saved."
            );

        }
    );

}


if (redirectsTableBody) {

    redirectsTableBody.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(
                    "[data-delete-redirect]"
                );


            if (!button) {
                return;
            }


            const index =
                Number(
                    button.dataset.deleteRedirect
                );


            if (
                !Number.isInteger(index) ||
                index < 0 ||
                index >= redirects.length
            ) {
                return;
            }


            redirects.splice(
                index,
                1
            );


            saveData(
                STORAGE_KEYS.redirects,
                redirects
            );


            renderRedirects();

            updateStats();

            showToast(
                "Redirect deleted."
            );

        }
    );

}


/* ========================================
   KEYWORDS
   ======================================== */

const keywordForm =
    document.getElementById(
        "keywordForm"
    );

const keywordsTableBody =
    document.getElementById(
        "keywordsTableBody"
    );

const keywordsEmpty =
    document.getElementById(
        "keywordsEmpty"
    );

const keywordsTableWrapper =
    document.getElementById(
        "keywordsTableWrapper"
    );


function renderKeywords() {

    if (!keywordsTableBody) {
        return;
    }


    keywordsTableBody.innerHTML = "";


    if (keywords.length === 0) {

        keywordsEmpty.classList.remove(
            "hidden"
        );

        keywordsTableWrapper.classList.add(
            "hidden"
        );

        return;

    }


    keywordsEmpty.classList.add(
        "hidden"
    );

    keywordsTableWrapper.classList.remove(
        "hidden"
    );


    keywords.forEach(
        (item, index) => {

            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>
                    <strong>
                        ${escapeHTML(
                            item.keyword
                        )}
                    </strong>
                </td>

                <td>
                    ${escapeHTML(
                        item.volume || "—"
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        item.competition || "Unknown"
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        item.priority || "Medium"
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        item.page || "—"
                    )}
                </td>

                <td>

                    <button
                        type="button"
                        class="delete-button"
                        data-delete-keyword="${index}"
                    >
                        Delete
                    </button>

                </td>

            `;


            keywordsTableBody.appendChild(
                row
            );

        }
    );

}


if (keywordForm) {

    keywordForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const formData =
                new FormData(
                    keywordForm
                );


            const keyword =
                formData
                    .get("keyword")
                    .trim();


            if (!keyword) {

                showToast(
                    "Keyword is required."
                );

                return;

            }


            const duplicate =
                keywords.some(
                    item =>
                        item.keyword
                            .toLowerCase() ===
                        keyword.toLowerCase()
                );


            if (duplicate) {

                showToast(
                    "This keyword already exists."
                );

                return;

            }


            keywords.push({

                keyword,

                volume:
                    formData
                        .get("volume")
                        .trim(),

                competition:
                    formData
                        .get("competition"),

                priority:
                    formData
                        .get("priority"),

                page:
                    formData
                        .get("keywordPage")
                        .trim(),

                createdAt:
                    new Date().toISOString()

            });


            saveData(
                STORAGE_KEYS.keywords,
                keywords
            );


            keywordForm.reset();

            renderKeywords();

            updateStats();

            showToast(
                "Keyword saved."
            );

        }
    );

}


if (keywordsTableBody) {

    keywordsTableBody.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(
                    "[data-delete-keyword]"
                );


            if (!button) {
                return;
            }


            const index =
                Number(
                    button.dataset.deleteKeyword
                );


            if (
                !Number.isInteger(index) ||
                index < 0 ||
                index >= keywords.length
            ) {
                return;
            }


            keywords.splice(
                index,
                1
            );


            saveData(
                STORAGE_KEYS.keywords,
                keywords
            );


            renderKeywords();

            updateStats();

            showToast(
                "Keyword deleted."
            );

        }
    );

}


/* ========================================
   STATISTICS
   ======================================== */

function updateStats() {

    const linkCount =
        document.getElementById(
            "linkCount"
        );

    const redirectCount =
        document.getElementById(
            "redirectCount"
        );

    const keywordCount =
        document.getElementById(
            "keywordCount"
        );

    const pageCount =
        document.getElementById(
            "pageCount"
        );


    if (linkCount) {

        linkCount.textContent =
            links.length;

    }


    if (redirectCount) {

        redirectCount.textContent =
            redirects.length;

    }


    if (keywordCount) {

        keywordCount.textContent =
            keywords.length;

    }


    if (pageCount) {

        /*
         * Current known pages:
         * Home
         * Education
         * Technology
         * SEO
         * Gaming
         *
         * More pages can be added later.
         */

        pageCount.textContent =
            document.querySelectorAll(
                ".page-item"
            ).length;

    }

}


/* ========================================
   INITIAL RENDER
   ======================================== */

renderLinks();

renderRedirects();

renderKeywords();

updateStats();


/* ========================================
   KEYBOARD SHORTCUT
   ======================================== */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape"
        ) {

            sidebar.classList.remove(
                "open"
            );

        }

    }
);


/* ========================================
   PREVENT ACCIDENTAL DATA LOSS
   ======================================== */

window.addEventListener(
    "beforeunload",
    () => {

        /*
         * Data is already saved to localStorage
         * after every change.
         */

    }
);
