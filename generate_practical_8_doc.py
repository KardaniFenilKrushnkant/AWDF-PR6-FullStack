import os
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

def create_document():
    doc = docx.Document()

    # Page Margins
    for section in doc.sections:
        section.top_margin = Inches(0.8)
        section.bottom_margin = Inches(0.8)
        section.left_margin = Inches(0.8)
        section.right_margin = Inches(0.8)

    # Base styling
    normal_style = doc.styles['Normal']
    normal_style.font.name = 'Times New Roman'
    normal_style.font.size = Pt(11.5)
    normal_style.font.color.rgb = RGBColor(0x11, 0x18, 0x27)
    normal_style.paragraph_format.line_spacing = 1.15
    normal_style.paragraph_format.space_after = Pt(4)

    # Student ID Header Line
    p_id = doc.add_paragraph()
    r_id = p_id.add_run("Student ID:-D25IT136")
    r_id.bold = True
    r_id.font.size = Pt(12)
    p_id.paragraph_format.space_after = Pt(8)

    # University Header Table (Logos + Title)
    logo_cspit = r'C:\Users\Abc\Downloads\AWDF-PR6-FullStack\docs\extracted_logos\image_1.png'
    logo_depstar = r'C:\Users\Abc\Downloads\AWDF-PR6-FullStack\docs\extracted_logos\image_7.png'

    table = doc.add_table(rows=1, cols=3)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False

    # Widths: 1.4 in, 4.2 in, 1.4 in
    widths = [Inches(1.3), Inches(4.3), Inches(1.3)]
    for cell, w in zip(table.rows[0].cells, widths):
        cell.width = w
        cell.vertical_alignment = WD_ALIGN_VERTICAL.CENTER

    # Left Logo
    if os.path.exists(logo_cspit):
        p_left = table.rows[0].cells[0].paragraphs[0]
        p_left.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_left.add_run().add_picture(logo_cspit, width=Inches(1.15))

    # Center Text
    p_center = table.rows[0].cells[1].paragraphs[0]
    p_center.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_c1 = p_center.add_run("CHAROTAR UNIVERSITY OF SCIENCE AND TECHNOLOGY\n")
    r_c1.bold = True
    r_c1.font.size = Pt(11)
    r_c2 = p_center.add_run("FACULTY OF TECHNOLOGY AND ENGINEERING\n")
    r_c2.bold = True
    r_c2.font.size = Pt(10.5)
    r_c3 = p_center.add_run("B. TECH (IT/CE/CSE/AIML)")
    r_c3.bold = True
    r_c3.font.size = Pt(10.5)

    # Right Logo
    if os.path.exists(logo_depstar):
        p_right = table.rows[0].cells[2].paragraphs[0]
        p_right.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_right.add_run().add_picture(logo_depstar, width=Inches(1.15))

    # Remove borders from table
    for cell in table.rows[0].cells:
        tcPr = cell._tc.get_or_add_tcPr()
        borders = parse_xml(
            f'<w:tcBorders {nsdecls("w")}>'
            f'<w:top w:val="none"/>'
            f'<w:left w:val="none"/>'
            f'<w:bottom w:val="none"/>'
            f'<w:right w:val="none"/>'
            f'</w:tcBorders>'
        )
        tcPr.append(borders)

    # Subject line
    p_sub = doc.add_paragraph()
    p_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_sub.paragraph_format.space_before = Pt(8)
    p_sub.paragraph_format.space_after = Pt(14)
    r_sub = p_sub.add_run("Subject: Advanced Web Development Frameworks (ITUE301) | Semester: 5th")
    r_sub.bold = True
    r_sub.font.size = Pt(11.5)

    # Practical Statement
    p_stmt = doc.add_paragraph()
    p_stmt.paragraph_format.space_after = Pt(12)
    p_stmt.paragraph_format.line_spacing = 1.2
    r_stmt_lbl = p_stmt.add_run("Practical Statement: ")
    r_stmt_lbl.bold = True
    p_stmt.add_run(
        "Optimize the React frontend of the Task Management application by implementing lazy loading "
        "for route-based components. Apply React.lazy() and Suspense to at least the Projects and Contact routes "
        "(or equivalent route-based components). Provide a meaningful fallback UI while a lazy-loaded chunk is loading. "
        "Measure and compare bundle size and load time before and after optimization using browser developer tools. "
        "Document the before/after comparison with screenshots or recorded values."
    )

    # Screenshots Heading
    p_ss = doc.add_paragraph()
    p_ss.paragraph_format.space_before = Pt(6)
    p_ss.paragraph_format.space_after = Pt(8)
    r_ss = p_ss.add_run("Screenshots :")
    r_ss.bold = True
    r_ss.font.size = Pt(12)

    # Helper function to add images cleanly
    screenshots_dir = r'C:\Users\Abc\Downloads\AWDF-PR6-FullStack\docs\screenshots'

    def add_figure(img_name, caption_text, width_inches=6.0):
        img_path = os.path.join(screenshots_dir, img_name)
        if os.path.exists(img_path):
            p_cap = doc.add_paragraph()
            p_cap.paragraph_format.space_before = Pt(8)
            p_cap.paragraph_format.space_after = Pt(4)
            r_cap = p_cap.add_run(caption_text)
            r_cap.bold = True
            r_cap.font.size = Pt(11)

            p_img = doc.add_paragraph()
            p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p_img.paragraph_format.space_after = Pt(12)
            p_img.add_run().add_picture(img_path, width=Inches(width_inches))

    # Figure 1: Task Manager Dashboard (Home Route /)
    add_figure('fig2_dashboard_home.png', 'Figure 1: TaskPulse Executive Dashboard (Home View - Route /)', 6.2)

    # Page Break for clean presentation
    doc.add_page_break()

    # Header on Page 2
    p_id2 = doc.add_paragraph()
    r_id2 = p_id2.add_run("Student ID:-D25IT136")
    r_id2.bold = True
    p_id2.paragraph_format.space_after = Pt(8)

    # Figure 2: Projects Route (/projects)
    add_figure('fig3_projects_lazy.png', 'Figure 2: Lazy-Loaded Course Projects View (Route /projects)', 6.2)

    # Figure 3: Analytics & Chart.js Lazy Loading (/analytics)
    add_figure('fig4_analytics_chart.png', 'Figure 3: Interactive Analytics Visualizer with Lazy-Loaded Chart.js (Route /analytics)', 6.2)

    # Page Break for Page 3
    doc.add_page_break()

    # Header on Page 3
    p_id3 = doc.add_paragraph()
    r_id3 = p_id3.add_run("Student ID:-D25IT136")
    r_id3.bold = True
    p_id3.paragraph_format.space_after = Pt(8)

    # Figure 4: Suspense Fallback UI
    add_figure('fig5_suspense_fallback.png', 'Figure 4: Suspense Fallback UI Rendering During Dynamic Chunk Loading (Slow 3G Simulation)', 5.5)

    # Figure 5: Terminal Build Output
    add_figure('fig6_terminal_build.png', 'Figure 5: Production Build Output (npm run build) Confirming Route & Vendor Code Splitting', 6.2)

    # Figure 6: GitHub Repository Commit
    add_figure('fig7_github_repo.png', 'Figure 6: GitHub Repository (AWDF-PR6-FullStack) Commit Verification', 6.2)

    # Page Break for Page 4 (Key Questions)
    doc.add_page_break()

    # Header on Page 4
    p_id4 = doc.add_paragraph()
    r_id4 = p_id4.add_run("Student ID:-D25IT136")
    r_id4.bold = True
    p_id4.paragraph_format.space_after = Pt(10)

    # Heading: Key Questions
    p_kq = doc.add_paragraph()
    p_kq.paragraph_format.space_after = Pt(10)
    r_kq = p_kq.add_run("Key Questions:-")
    r_kq.bold = True
    r_kq.font.size = Pt(12)

    # Question 1
    p_q1 = doc.add_paragraph()
    p_q1.paragraph_format.space_after = Pt(4)
    r_q1 = p_q1.add_run("1. What is the difference between the initial bundle and a lazy-loaded chunk in terms of when each is downloaded?")
    r_q1.bold = True

    p_a1 = doc.add_paragraph()
    p_a1.paragraph_format.line_spacing = 1.15
    p_a1.paragraph_format.space_after = Pt(12)
    p_a1.add_run(
        "The initial bundle (main bundle, e.g., index.js) is downloaded immediately and synchronously when the user first "
        "lands on the web application. It contains the essential application runtime, React core libraries, the client-side router, "
        "and root styling necessary to render the initial viewport and navigation shell.\n\n"
        "In contrast, a lazy-loaded chunk (e.g., Projects.chunk.js, Contact.chunk.js) is not downloaded during initial page load. "
        "Its download is deferred until a dynamic import trigger occurs—specifically when the user navigates to the associated route "
        "or renders that specific component. The browser dynamically injects an asynchronous script tag or issues a fetch request "
        "only on demand. This separation significantly lowers initial bandwidth consumption and reduces initial main-thread JavaScript "
        "parsing time."
    )

    # Question 2
    p_q2 = doc.add_paragraph()
    p_q2.paragraph_format.space_after = Pt(4)
    r_q2 = p_q2.add_run("2. Why does lazy loading improve perceived performance even though the total amount of code downloaded eventually stays the same?")
    r_q2.bold = True

    p_a2 = doc.add_paragraph()
    p_a2.paragraph_format.line_spacing = 1.15
    p_a2.paragraph_format.space_after = Pt(12)
    p_a2.add_run(
        "Perceived performance is primarily determined by how quickly the user observes meaningful visual content on screen "
        "(First Contentful Paint - FCP) and how quickly buttons, inputs, and interactive controls respond to user events "
        "(Time to Interactive - TTI).\n\n"
        "Without code splitting, the browser is forced to download, decompress, parse, and compile the entire monolithic JavaScript bundle "
        "upfront before displaying the first pixel. Even though the cumulative amount of code downloaded across an entire session might "
        "remain identical if a user eventually visits all pages, lazy loading distributes the network and compilation workload into small, "
        "non-blocking increments requested over time. Furthermore, in real-world scenarios, a large majority of users never navigate to "
        "every single page, meaning that code for unvisited routes is never downloaded, resulting in net bandwidth and CPU savings."
    )

    # Question 3
    p_q3 = doc.add_paragraph()
    p_q3.paragraph_format.space_after = Pt(4)
    r_q3 = p_q3.add_run("3. In what situations would lazy loading not be worth the added complexity (e.g., a very small app)?")
    r_q3.bold = True

    p_a3 = doc.add_paragraph()
    p_a3.paragraph_format.line_spacing = 1.15
    p_a3.paragraph_format.space_after = Pt(14)
    p_a3.add_run(
        "Lazy loading introduces additional architectural complexity and network round-trips that may not be justified in several scenarios:\n"
        "1. Small Applications: In applications with an initial bundle under 50-100 kB, the network overhead of multiple HTTP request handshakes "
        "(DNS lookup, TLS negotiation, and HTTP headers) outweighs any parsing time benefits.\n"
        "2. Critical Landing Workflows: Core views that all users immediately interact with should not be delayed behind a network fallback spinner.\n"
        "3. Offline or Poorly Connected Environments: If a user enters an area of unstable connectivity after landing on the site, attempting to navigate "
        "to a lazy route can fail with a network error unless sophisticated Service Worker offline caching is configured.\n"
        "4. Component Architecture Overhead: Lazy loading requires maintaining Suspense boundaries, fallback components, and error boundaries, "
        "which increases codebase maintenance."
    )

    # Page Break for Page 5 (Supplementary & Outcomes)
    doc.add_page_break()

    # Header on Page 5
    p_id5 = doc.add_paragraph()
    r_id5 = p_id5.add_run("Student ID:-D25IT136")
    r_id5.bold = True
    p_id5.paragraph_format.space_after = Pt(10)

    # Supplementary Problems Section
    p_sup = doc.add_paragraph()
    p_sup.paragraph_format.space_after = Pt(8)
    r_sup = p_sup.add_run("Supplementary Problems & Optimization Analysis:-")
    r_sup.bold = True
    r_sup.font.size = Pt(12)

    # Supp 1
    p_s1 = doc.add_paragraph()
    p_s1.paragraph_format.space_after = Pt(3)
    r_s1 = p_s1.add_run("• Lazy Loading Heavy Third-Party Library (Chart.js):")
    r_s1.bold = True
    p_s1_txt = doc.add_paragraph()
    p_s1_txt.paragraph_format.line_spacing = 1.15
    p_s1_txt.paragraph_format.space_after = Pt(8)
    p_s1_txt.add_run(
        "The charting visualizer incorporates Chart.js and react-chartjs-2, which adds approximately 180 kB to the JavaScript payload. "
        "To prevent this heavy library from polluting the main application chunk, TaskAnalyticsChart.jsx was implemented and dynamically "
        "imported using React.lazy() inside Analytics.jsx. Vite manualChunks was configured to isolate chart-vendor into its own chunk, "
        "reducing the primary bundle from 457.34 kB to 263.07 kB (a 42.6% reduction in upfront payload)."
    )

    # Supp 2
    p_s2 = doc.add_paragraph()
    p_s2.paragraph_format.space_after = Pt(3)
    r_s2 = p_s2.add_run("• Minimum-Delay Fallback (Flicker Prevention):")
    r_s2.bold = True
    p_s2_txt = doc.add_paragraph()
    p_s2_txt.paragraph_format.line_spacing = 1.15
    p_s2_txt.paragraph_format.space_after = Pt(8)
    p_s2_txt.add_run(
        "On high-speed broadband connections, dynamic chunks often resolve within 20-50ms. Immediately rendering a loading spinner "
        "causes an annoying visual flash where the spinner pops in and out within milliseconds. To solve this, DelayedFallback.jsx "
        "was created with a 200-300ms threshold timer. If the chunk loads within this timeframe, no fallback is displayed, ensuring "
        "a smooth transition. If the network is throttled (e.g., Slow 3G), the fallback UI appears gracefully."
    )

    # Supp 3
    p_s3 = doc.add_paragraph()
    p_s3.paragraph_format.space_after = Pt(3)
    r_s3 = p_s3.add_run("• React DevTools Profiler Analysis & Re-render Elimination:")
    r_s3.bold = True
    p_s3_txt = doc.add_paragraph()
    p_s3_txt.paragraph_format.line_spacing = 1.15
    p_s3_txt.paragraph_format.space_after = Pt(14)
    p_s3_txt.add_run(
        "Using the React DevTools Profiler, an unnecessary re-render was identified: whenever a user typed into the Task Title form input, "
        "the parent component state updated on every keystroke, causing all task items in the list to re-render repeatedly. "
        "To optimize this, individual task cards were extracted into TaskItem.jsx and memoized using React.memo(TaskItem), while callback "
        "handlers (toggleCompleted, startEditing, handleDelete) were wrapped with useCallback. Profiling confirmed zero re-renders of existing "
        "task cards during form input typing."
    )

    # Learning Outcome
    p_lo = doc.add_paragraph()
    p_lo.paragraph_format.space_before = Pt(8)
    p_lo.paragraph_format.space_after = Pt(4)
    r_lo = p_lo.add_run("Learning Outcome:")
    r_lo.bold = True
    r_lo.font.size = Pt(12)

    p_lo_txt = doc.add_paragraph()
    p_lo_txt.paragraph_format.line_spacing = 1.15
    p_lo_txt.paragraph_format.space_after = Pt(16)
    p_lo_txt.add_run(
        "Students will be able to apply code splitting and lazy loading in React to reduce initial bundle size, "
        "provide accessible Suspense fallback feedback, and measure and explain the resulting performance impact using browser developer tools."
    )

    # GitHub Repo Link
    p_git = doc.add_paragraph()
    p_git.paragraph_format.space_before = Pt(8)
    p_git.paragraph_format.space_after = Pt(4)
    r_git = p_git.add_run("Github Repo Link: ")
    r_git.bold = True
    r_git.font.size = Pt(11.5)
    r_url = p_git.add_run("https://github.com/KardaniFenilKrushnkant/AWDF-PR6-FullStack")
    r_url.font.color.rgb = RGBColor(0x1d, 0x4e, 0xd8)
    r_url.underline = True

    # Save to both target locations
    output_path1 = r'C:\Users\Abc\Downloads\AWDF_Practical_8_D25IT136.docx'
    output_path2 = r'C:\Users\Abc\Downloads\AWDF-PR6-FullStack\AWDF_Practical_8_D25IT136.docx'

    doc.save(output_path1)
    doc.save(output_path2)
    print(f"Document created successfully at:\n1. {output_path1}\n2. {output_path2}")

if __name__ == '__main__':
    create_document()
