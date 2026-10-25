/*jslint browser */

function createGallery(root) {
    "use strict";
    const track = root.querySelector(".gallery-track");
    const slides = track.querySelectorAll(".slide");
    const prev = root.querySelector(".arrow-prev");
    const next = root.querySelector(".arrow-next");
    const text = document.getElementById("pager-text");
    const dots = document.getElementById("pager-dots");
    const query = window.matchMedia("(min-width: 768px)");
    let index = 0;
    let startX = 0;

    function perView() {
        return (
            query.matches
            ? 3
            : 1
        );
    }

    function pageCount() {
        return slides.length - perView() + 1;
    }

    function buildDots() {
        dots.textContent = "";
        Array.from({"length": pageCount()}).forEach(function (ignore, page) {
            const dot = document.createElement("button");
            dot.type = "button";
            dot.className = "dot";
            dot.setAttribute("aria-label", "Страница " + (page + 1));
            dot.addEventListener("click", function () {
                index = page;
                render();
            });
            dots.appendChild(dot);
        });
    }

    function render() {
        const pages = pageCount();
        index = Math.max(0, Math.min(index, pages - 1));
        track.style.transform = (
            "translateX(" + (-index * 100 / perView()) + "%)"
        );
        prev.disabled = (index === 0);
        next.disabled = (index === pages - 1);
        text.textContent = "Страница " + (index + 1) + " из " + pages;
        dots.querySelectorAll(".dot").forEach(function (dot, page) {
            dot.classList.toggle("active", page === index);
            dot.setAttribute("aria-current", (
                page === index
                ? "true"
                : "false"
            ));
        });
    }

    function onResize() {
        buildDots();
        render();
    }

    prev.addEventListener("click", function () {
        index -= 1;
        render();
    });
    next.addEventListener("click", function () {
        index += 1;
        render();
    });
    root.addEventListener("touchstart", function (event) {
        startX = event.changedTouches[0].clientX;
    }, {"passive": true});
    root.addEventListener("touchend", function (event) {
        const shift = event.changedTouches[0].clientX - startX;
        if (Math.abs(shift) > 40) {
            index += (
                shift < 0
                ? 1
                : -1
            );
            render();
        }
    });
    query.addEventListener("change", onResize);

    onResize();
}

window.addEventListener("DOMContentLoaded", function () {
    "use strict";
    createGallery(document.getElementById("gallery"));
});
