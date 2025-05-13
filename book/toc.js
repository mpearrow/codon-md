// Populate the sidebar
//
// This is a script, and not included directly in the page, to control the total size of the book.
// The TOC contains an entry for each page, so if each page includes a copy of the TOC,
// the total size of the page becomes O(n**2).
class MDBookSidebarScrollbox extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = '<ol class="chapter"><li class="chapter-item expanded "><a href="index.html"><strong aria-hidden="true">1.</strong> Welcome to Codon</a></li><li class="chapter-item expanded "><a href="intro/intro.html"><strong aria-hidden="true">2.</strong> Getting started</a></li><li class="chapter-item expanded "><a href="intro/faq.html"><strong aria-hidden="true">3.</strong> Frequently asked questions</a></li><li class="chapter-item expanded "><a href="intro/differences.html"><strong aria-hidden="true">4.</strong> Differences with Python</a></li><li class="chapter-item expanded "><a href="intro/releases.html"><strong aria-hidden="true">5.</strong> Release notes</a></li><li class="chapter-item expanded "><a href="intro/roadmap.html"><strong aria-hidden="true">6.</strong> Roadmap</a></li><li class="chapter-item expanded "><a href="language/basics.html"><strong aria-hidden="true">7.</strong> Basics</a></li><li class="chapter-item expanded "><a href="language/collections.html"><strong aria-hidden="true">8.</strong> Collections</a></li><li class="chapter-item expanded "><a href="language/functions.html"><strong aria-hidden="true">9.</strong> Functions</a></li><li class="chapter-item expanded "><a href="language/classes.html"><strong aria-hidden="true">10.</strong> Classes</a></li><li class="chapter-item expanded "><a href="language/generators.html"><strong aria-hidden="true">11.</strong> Generators</a></li><li class="chapter-item expanded "><a href="language/statics.html"><strong aria-hidden="true">12.</strong> Statics</a></li><li class="chapter-item expanded "><a href="language/extra.html"><strong aria-hidden="true">13.</strong> Other types and features</a></li><li class="chapter-item expanded "><a href="language/ffi.html"><strong aria-hidden="true">14.</strong> Foreign function interface</a></li><li class="chapter-item expanded "><a href="language/llvm.html"><strong aria-hidden="true">15.</strong> Inline LLVM IR</a></li><li class="chapter-item expanded "><a href="interop/numpy.html"><strong aria-hidden="true">16.</strong> NumPy support</a></li><li class="chapter-item expanded "><a href="interop/python.html"><strong aria-hidden="true">17.</strong> Python integration</a></li><li class="chapter-item expanded "><a href="interop/decorator.html"><strong aria-hidden="true">18.</strong> Python decorator</a></li><li class="chapter-item expanded "><a href="interop/pyext.html"><strong aria-hidden="true">19.</strong> Python extensions</a></li><li class="chapter-item expanded "><a href="interop/cpp.html"><strong aria-hidden="true">20.</strong> C/C++ integration</a></li><li class="chapter-item expanded "><a href="interop/jupyter.html"><strong aria-hidden="true">21.</strong> Jupyter integration</a></li><li class="chapter-item expanded "><a href="advanced/parallel.html"><strong aria-hidden="true">22.</strong> Parallelism and multithreading</a></li><li class="chapter-item expanded "><a href="advanced/gpu.html"><strong aria-hidden="true">23.</strong> GPU programming</a></li><li class="chapter-item expanded "><a href="advanced/pipelines.html"><strong aria-hidden="true">24.</strong> Pipelines</a></li><li class="chapter-item expanded "><a href="advanced/ir.html"><strong aria-hidden="true">25.</strong> Intermediate representation</a></li><li class="chapter-item expanded "><a href="advanced/build.html"><strong aria-hidden="true">26.</strong> Building from source</a></li></ol>';
        // Set the current, active page, and reveal it if it's hidden
        let current_page = document.location.href.toString().split("#")[0].split("?")[0];
        if (current_page.endsWith("/")) {
            current_page += "index.html";
        }
        var links = Array.prototype.slice.call(this.querySelectorAll("a"));
        var l = links.length;
        for (var i = 0; i < l; ++i) {
            var link = links[i];
            var href = link.getAttribute("href");
            if (href && !href.startsWith("#") && !/^(?:[a-z+]+:)?\/\//.test(href)) {
                link.href = path_to_root + href;
            }
            // The "index" page is supposed to alias the first chapter in the book.
            if (link.href === current_page || (i === 0 && path_to_root === "" && current_page.endsWith("/index.html"))) {
                link.classList.add("active");
                var parent = link.parentElement;
                if (parent && parent.classList.contains("chapter-item")) {
                    parent.classList.add("expanded");
                }
                while (parent) {
                    if (parent.tagName === "LI" && parent.previousElementSibling) {
                        if (parent.previousElementSibling.classList.contains("chapter-item")) {
                            parent.previousElementSibling.classList.add("expanded");
                        }
                    }
                    parent = parent.parentElement;
                }
            }
        }
        // Track and set sidebar scroll position
        this.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                sessionStorage.setItem('sidebar-scroll', this.scrollTop);
            }
        }, { passive: true });
        var sidebarScrollTop = sessionStorage.getItem('sidebar-scroll');
        sessionStorage.removeItem('sidebar-scroll');
        if (sidebarScrollTop) {
            // preserve sidebar scroll position when navigating via links within sidebar
            this.scrollTop = sidebarScrollTop;
        } else {
            // scroll sidebar to current active section when navigating via "next/previous chapter" buttons
            var activeSection = document.querySelector('#sidebar .active');
            if (activeSection) {
                activeSection.scrollIntoView({ block: 'center' });
            }
        }
        // Toggle buttons
        var sidebarAnchorToggles = document.querySelectorAll('#sidebar a.toggle');
        function toggleSection(ev) {
            ev.currentTarget.parentElement.classList.toggle('expanded');
        }
        Array.from(sidebarAnchorToggles).forEach(function (el) {
            el.addEventListener('click', toggleSection);
        });
    }
}
window.customElements.define("mdbook-sidebar-scrollbox", MDBookSidebarScrollbox);
