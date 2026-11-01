import os
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import parse_xml
from docx.oxml.ns import nsdecls

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
        "Add in-memory caching to the Task Management backend using node-cache, "
        "Cache the response of GET /tasks (all tasks) with a reasonable TTL (e.g., 60 seconds), "
        "Invalidate the cache on any write operation POST, PUT, or DELETE so stale data is never served, "
        "Record and compare API response times with and without caching using Postman or Thunder Client, "
        "Document the measured difference with at least 3 sample readings for each case (cached vs uncached)."
    )

    # Screenshots Heading
    p_ss = doc.add_paragraph()
    p_ss.paragraph_format.space_before = Pt(6)
    p_ss.paragraph_format.space_after = Pt(8)
    r_ss = p_ss.add_run("Screenshots :")
    r_ss.bold = True
    r_ss.font.size = Pt(12)

    # Helper function to add figures
    screenshots_dir = r'C:\Users\Abc\Downloads\AWDF-PR6-FullStack\docs\screenshots_p9'

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

    # Figure 1: Uncached GET /tasks (Cache MISS)
    add_figure('fig1_uncached_get_miss.png', 'Figure 1: Uncached GET /tasks Request in Postman (X-Cache: MISS - 12.98 ms)', 6.2)

    # Page Break for Page 2
    doc.add_page_break()

    # Header on Page 2
    p_id2 = doc.add_paragraph()
    r_id2 = p_id2.add_run("Student ID:-D25IT136")
    r_id2.bold = True
    p_id2.paragraph_format.space_after = Pt(8)

    # Figure 2: Cached GET /tasks (Cache HIT)
    add_figure('fig2_cached_get_hit.png', 'Figure 2: In-Memory Cached GET /tasks Request in Postman (X-Cache: HIT - 3.10 ms)', 6.2)

    # Figure 3: Single Task Caching GET /tasks/:id
    add_figure('fig3_single_task_cached.png', 'Figure 3: Single-Task Caching on GET /tasks/:id (Supplementary Problem 1)', 6.2)

    # Page Break for Page 3
    doc.add_page_break()

    # Header on Page 3
    p_id3 = doc.add_paragraph()
    r_id3 = p_id3.add_run("Student ID:-D25IT136")
    r_id3.bold = True
    p_id3.paragraph_format.space_after = Pt(8)

    # Figure 4: Cache Invalidation on Mutation
    add_figure('fig4_cache_invalidation_post.png', 'Figure 4: Cache Invalidation Upon Write Operation (POST /tasks)', 6.2)

    # Figure 5: Debug Endpoint GET /cache/stats
    add_figure('fig5_debug_cache_stats.png', 'Figure 5: Cache Health & Hit/Miss Statistics Debug Endpoint (GET /cache/stats)', 6.2)

    # Figure 6: Terminal Benchmark Run
    add_figure('fig6_benchmark_terminal.png', 'Figure 6: Empirical Response Time Benchmark (3 Samples Comparison in Terminal)', 6.2)

    # Page Break for Page 4 (Key Questions)
    doc.add_page_break()

    # Header on Page 4
    p_id4 = doc.add_paragraph()
    r_id4 = p_id4.add_run("Student ID:-D25IT136")
    r_id4.bold = True
    p_id4.paragraph_format.space_after = Pt(10)

    # Figure 7: GitHub Repo
    add_figure('fig7_github_repo_p9.png', 'Figure 7: GitHub Repository (AWDF-PR6-FullStack) Practical 9 Caching Commit', 6.2)

    # Heading: Key Questions
    p_kq = doc.add_paragraph()
    p_kq.paragraph_format.space_before = Pt(8)
    p_kq.paragraph_format.space_after = Pt(10)
    r_kq = p_kq.add_run("Key Questions:-")
    r_kq.bold = True
    r_kq.font.size = Pt(12)

    # Question 1
    p_q1 = doc.add_paragraph()
    p_q1.paragraph_format.space_after = Pt(4)
    r_q1 = p_q1.add_run("1. Why must the cache be invalidated on every write operation, and what would happen to data correctness if it were not?")
    r_q1.bold = True

    p_a1 = doc.add_paragraph()
    p_a1.paragraph_format.line_spacing = 1.15
    p_a1.paragraph_format.space_after = Pt(12)
    p_a1.add_run(
        "In a server-side caching architecture, when a client performs a write operation (POST, PUT, or DELETE), the persistent data "
        "stored in MongoDB is updated or deleted immediately. If the cache is not explicitly invalidated (e.g., using cache.del('all_tasks')), "
        "the in-memory cache will continue serving the outdated snapshot of the task list for the entire duration of the Time-To-Live (TTL) window.\n\n"
        "If cache invalidation were omitted, data correctness would be severely compromised:\n"
        "• Newly created tasks would not appear in subsequent GET /tasks requests, confusing the user into believing the creation failed.\n"
        "• Edited task titles, descriptions, or completed statuses would revert to outdated values upon page reload.\n"
        "• Deleted tasks would still be returned to the client as 'ghost tasks' until the TTL expires.\n"
        "Invalidating cache keys immediately after a successful database mutation guarantees strong consistency, ensuring that subsequent "
        "read requests trigger a fresh database query and repopulate the cache with accurate, up-to-date records."
    )

    # Question 2
    p_q2 = doc.add_paragraph()
    p_q2.paragraph_format.space_after = Pt(4)
    r_q2 = p_q2.add_run("2. What is a reasonable TTL (time-to-live) for cached data in a task management context, and what trade-off does TTL length represent?")
    r_q2.bold = True

    p_a2 = doc.add_paragraph()
    p_a2.paragraph_format.line_spacing = 1.15
    p_a2.paragraph_format.space_after = Pt(12)
    p_a2.add_run(
        "In a task management system, a reasonable TTL is typically between 30 and 60 seconds. Because task management applications involve "
        "interactive user updates paired with high-frequency reads, 60 seconds provides an optimal balance between cache utilization and data freshness.\n\n"
        "The TTL length represents a fundamental trade-off between Data Freshness and Database Offloading:\n"
        "• Short TTL (e.g., 5-15 seconds): Prioritizes data freshness and reduces the risk of serving stale data if write-invalidation hooks fail. "
        "However, it results in a lower cache hit-rate and causes frequent database roundtrips.\n"
        "• Long TTL (e.g., 5-15 minutes): Maximizes cache hit-rate and dramatically reduces database I/O and server CPU overhead under heavy load. "
        "However, it increases the risk of serving stale data if out-of-band updates occur (e.g., background cron jobs or direct DB writes), and consumes "
        "server RAM holding inactive records."
    )

    # Page Break for Page 5 (Question 3 + Supplementary + Outcomes)
    doc.add_page_break()

    # Header on Page 5
    p_id5 = doc.add_paragraph()
    r_id5 = p_id5.add_run("Student ID:-D25IT136")
    r_id5.bold = True
    p_id5.paragraph_format.space_after = Pt(10)

    # Question 3
    p_q3 = doc.add_paragraph()
    p_q3.paragraph_format.space_after = Pt(4)
    r_q3 = p_q3.add_run("3. Why is in-memory caching (node-cache) not suitable for a multi-server/multi-instance deployment, even though it works fine in this lab?")
    r_q3.bold = True

    p_a3 = doc.add_paragraph()
    p_a3.paragraph_format.line_spacing = 1.15
    p_a3.paragraph_format.space_after = Pt(14)
    p_a3.add_run(
        "node-cache is a process-local in-memory caching library, meaning the cached keys and values reside strictly inside the heap memory "
        "of a single running Node.js process. While this operates flawlessly in single-server lab environments, it fails in horizontally scaled, "
        "multi-server deployments (such as multiple Docker containers, PM2 cluster workers, or Kubernetes pods behind a load balancer):\n"
        "1. Cache Inconsistency / Desynchronization: If a user sends a write request (POST /tasks) routed to Server Instance A, Server A invalidates "
        "its local cache. However, Server Instance B and Server Instance C still hold the old cached data in their respective memory heaps. "
        "Subsequent requests routed to Server B or C will return stale data, creating inconsistent user experiences.\n"
        "2. Redundant Memory Consumption: Each server instance duplicates the exact same cached data in its local RAM rather than sharing a unified pool.\n"
        "3. Distributed Alternative: In production multi-server architectures, a centralized external cache like Redis or Memcached is used, "
        "allowing all application instances to read and invalidate a single, globally synchronized cache store."
    )

    # Supplementary Problems Section
    p_sup = doc.add_paragraph()
    p_sup.paragraph_format.space_before = Pt(8)
    p_sup.paragraph_format.space_after = Pt(8)
    r_sup = p_sup.add_run("Supplementary Problems & Optimization Analysis:-")
    r_sup.bold = True
    r_sup.font.size = Pt(12)

    # Supp 1
    p_s1 = doc.add_paragraph()
    p_s1.paragraph_format.space_after = Pt(3)
    r_s1 = p_s1.add_run("• Single-Task Endpoint Caching (GET /tasks/:id):")
    r_s1.bold = True
    p_s1_txt = doc.add_paragraph()
    p_s1_txt.paragraph_format.line_spacing = 1.15
    p_s1_txt.paragraph_format.space_after = Pt(8)
    p_s1_txt.add_run(
        "Implemented dedicated item-level caching using the key format task_${id}. When GET /tasks/:id is invoked, the cache is checked "
        "first. If present, it responds with X-Cache: HIT in ~2.4ms. When a specific task is updated (PUT) or deleted (DELETE), both the "
        "collection key ('all_tasks') and the individual item key ('task_${id}') are invalidated synchronously."
    )

    # Supp 2
    p_s2 = doc.add_paragraph()
    p_s2.paragraph_format.space_after = Pt(3)
    r_s2 = p_s2.add_run("• Cache Hit/Miss Metrics Endpoint (GET /cache/stats):")
    r_s2.bold = True
    p_s2_txt = doc.add_paragraph()
    p_s2_txt.paragraph_format.line_spacing = 1.15
    p_s2_txt.paragraph_format.space_after = Pt(8)
    p_s2_txt.add_run(
        "An instrumentation wrapper was added to node-cache tracking hits, misses, total queries, and calculating live hit-rate. "
        "A dedicated debug endpoint GET /cache/stats was implemented, returning real-time metrics including active keys count, "
        "cached key names, and memory utilization statistics."
    )

    # Supp 3
    p_s3 = doc.add_paragraph()
    p_s3.paragraph_format.space_after = Pt(3)
    r_s3 = p_s3.add_run("• Empirical Response Time Comparison (3 Sample Readings):")
    r_s3.bold = True
    p_s3_txt = doc.add_paragraph()
    p_s3_txt.paragraph_format.line_spacing = 1.15
    p_s3_txt.paragraph_format.space_after = Pt(14)
    p_s3_txt.add_run(
        "Conducted empirical benchmarking comparing uncached database reads against cached in-memory responses across 3 consecutive runs:\n"
        "• Uncached (MongoDB Read): Sample 1 = 12.98 ms, Sample 2 = 8.07 ms, Sample 3 = 7.97 ms (Average = 9.67 ms).\n"
        "• Cached (node-cache HIT): Sample 1 = 5.18 ms, Sample 2 = 3.53 ms, Sample 3 = 3.10 ms (Average = 3.94 ms).\n"
        "Result: In-memory caching yielded a 2.5x speedup and a 59.3% reduction in response latency."
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
        "Students will be able to implement in-memory caching for a REST API, ensure cache correctness through invalidation, "
        "and measure the performance impact using real response time data."
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
    output_path1 = r'C:\Users\Abc\Downloads\AWDF_Practical_9_D25IT136.docx'
    output_path2 = r'C:\Users\Abc\Downloads\AWDF-PR6-FullStack\AWDF_Practical_9_D25IT136.docx'

    doc.save(output_path1)
    doc.save(output_path2)
    print(f"Practical 9 Document created successfully at:\n1. {output_path1}\n2. {output_path2}")

if __name__ == '__main__':
    create_document()
