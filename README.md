# Souhail Bourassi - portfolio

A static portfolio with an enlarged portrait, a stationary photo with static depth shadows, and floating three-dimensional technology badges. Hover or focus the portrait to reveal its Microsoft stack; tap to toggle on mobile. Mobile badges appear below the portrait. Escape dismisses the reveal. Reduced-motion preferences disable floating animation.

The skills grid contains 17 technologies, including Microsoft Intune, Microsoft Purview, SPFx, Office 365 Admin, Microsoft Azure, and PowerShell Scripting. Skills use equal-sized cards and 48 x 48 vector icon viewports (42 x 42 on mobile). Client logos use consistent cards and aspect-preserving logo viewports.

Original portrait source images are retained. Unused template assets and superseded logos have been removed. SVG wrappers under each normalized directory tightly frame visible artwork to remove inconsistent transparent padding. New skills use lightweight custom SVG pictograms. The original portrait matte is removed by a display-time SVG alpha filter; its source file is unchanged.

Serve the directory with any static HTTP server, such as VS Code Live Server. No build step is required. Main implementation: index.html, assets/css/portfolio-motion.css, and assets/js/portfolio-motion.js. The existing contact endpoint is retained. Depth effects use CSS perspective. The unused Three.js, GSAP, jQuery, smooth-scroll, and slider bundles have been removed; interactions use native browser APIs.

Services are presented as eight responsive cards: Full Stack Development, Power Platform & Automation, SharePoint & SPFx, Microsoft 365 Administration, Endpoint Management (Intune), Azure & PowerShell, Data Governance & Protection (Purview), and Daxium-Air Solutions. Cards include technology tags, subtle hover depth, scroll reveals, and links to the contact section. Service copy is based on the skills already supplied for the portfolio.

Experience is a chronological career roadmap with four numbered milestones (2020-2025), an illuminated route that fills as milestones enter view, dated role cards, and a next-chapter contact link. Original companies, roles, locations, and dates are preserved. The neighboring skills heading is now My Toolkit. The roadmap adapts to mobile and reduced-motion settings.


The affected skill icons now use true SVG artwork rather than embedded raster wrappers. Devicon assets are MIT licensed; the license is stored in assets/imgs/freelancer/skills/vector/DEVICON-LICENSE.txt. Skill tiles are flat to avoid perspective blur.

Certifications: Microsoft Power Platform Fundamentals (PL-900), Microsoft Power Platform Developer Associate (PL-400), OpenAI Technical Practitioner, and OpenAI Foundational Knowledge. Credential ownership is supplied by the portfolio owner; no verification URLs or dates have been invented. Official Microsoft title references: https://learn.microsoft.com/en-us/credentials/certifications/power-platform-fundamentals/ and https://learn.microsoft.com/en-us/credentials/certifications/power-platform-developer-associate/.

Contact layout: the legacy negative scroll transform is removed and the contact section stays in normal flow. The existing form action/method/field names are retained. Visible labels, autocomplete, a direct email link sourced from send_email.php, and native required/email validation are included. Browser checks verified layout and validation without submitting a message; actual delivery has not been tested.

Theme: the supplied purple-to-indigo banner informs the global palette. Core colors are purple #ad4bc5, indigo #4b50b9, and lavender #c7a4f5. Buttons use a slightly darker purple endpoint for white-label contrast. Backgrounds, cards, certificates, roadmap markers, focus states, and contact controls use coordinated violet tones. Technology and client logos retain their own brand colors. The portrait remains stationary.

Certificate cards reveal in sequence, with floating issuer logos, a sweeping highlight, and pointer hover depth. Effects pause offscreen and honor reduced motion. Testimonials use a keyboard-focusable native scroll-snap track with labeled previous/next buttons. The portrait never animates.

The loading screen waits for page assets and portrait decoding, with a Continue button and a 12-second fallback for stalled requests. It stays hidden when JavaScript is disabled. The site uses the normal mouse pointer; the custom cursor circle has been removed.
