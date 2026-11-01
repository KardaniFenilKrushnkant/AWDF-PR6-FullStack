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
        "Practical 10: Asynchronous Processing with Event-Driven Architecture.\n"
        "• Add a background notification system to the Task Management application using Node.js built-in EventEmitter.\n"
        "• When a new task is created via the API, emit a task-created event handled asynchronously.\n"
        "• The event handler must log a notification (task title, timestamp, assigned user) without blocking the main response.\n"
        "• The main API response must return immediately, before the event handler finishes executing.\n"
        "• Demonstrate the difference between synchronous and asynchronous handling by logging timestamps at both the API response point and the event handler execution point."
    )

    # Screenshots Heading
    p_ss = doc.add_paragraph()
    p_ss.paragraph_format.space_before = Pt(6)
    p_ss.paragraph_format.space_after = Pt(8)
    r_ss = p_ss.add_run("Screenshots :")
    r_ss.bold = True
    r_ss.font.size = Pt(12)

    # Helper function to add figures
    screenshots_dir = r'C:\Users\Abc\Downloads\AWDF-PR6-FullStack\docs\screenshots_p10'

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

    # Figure 1: Postman POST /tasks (Immediate 201 Created Response)
    add_figure('fig1_api_response_postman.png', 'Figure 1: Client POST /tasks Request in Postman Returning 201 Created in 20.87 ms', 6.2)

    # Page Break for Page 2
    doc.add_page_break()

    # Header on Page 2
    p_id2 = doc.add_paragraph()
    r_id2 = p_id2.add_run("Student ID:-D25IT136")
    r_id2.bold = True
    p_id2.paragraph_format.space_after = Pt(8)

    # Figure 2: Terminal Timestamp Ordering Verification
    add_figure('fig2_event_timestamp_ordering.png', 'Figure 2: Terminal Console Log Showing Immediate Response (T) Preceding Background Worker (+2017 ms)', 6.2)

    # Figure 3: Supplementary 1 - DELETE /tasks/:id & Audit Log
    add_figure('fig3_task_deleted_audit.png', 'Figure 3: Supplementary Problem 1: DELETE /tasks/:id with Decoupled task-deleted Audit Event', 6.2)

    # Page Break for Page 3
    doc.add_page_break()

    # Header on Page 3
    p_id3 = doc.add_paragraph()
    r_id3 = p_id3.add_run("Student ID:-D25IT136")
    r_id3.bold = True
    p_id3.paragraph_format.space_after = Pt(8)

    # Figure 4: Supplementary 2 - Error Event Handling
    add_figure('fig4_error_event_handling.png', 'Figure 4: Supplementary Problem 2: EventEmitter Error Handling Intercepting Exception without Server Crash', 6.2)

    # Figure 5: Architecture Comparison Flowchart
    add_figure('fig5_architecture_event_loop.png', 'Figure 5: Architecture Comparison: Synchronous Request Blocking vs. Asynchronous EventEmitter Decoupling', 6.2)

    # Page Break for Page 4 (GitHub Commit + Key Questions)
    doc.add_page_break()

    # Header on Page 4
    p_id4 = doc.add_paragraph()
    r_id4 = p_id4.add_run("Student ID:-D25IT136")
    r_id4.bold = True
    p_id4.paragraph_format.space_after = Pt(10)

    # Figure 6: GitHub Repo Commit
    add_figure('fig6_github_commit.png', 'Figure 6: GitHub Repository (AWDF-PR6-FullStack) Practical 10 EventEmitter Commit Verification', 6.2)

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
    r_q1 = p_q1.add_run("1. Why does emitting an event not block the API response, even though both run on the same Node.js process?")
    r_q1.bold = True

    p_a1 = doc.add_paragraph()
    p_a1.paragraph_format.line_spacing = 1.15
    p_a1.paragraph_format.space_after = Pt(12)
    p_a1.add_run(
        "In Node.js, taskEvents.emit('task-created', task) executes registered listener functions on the call stack synchronously at the moment "
        "of invocation. However, emitting the event does not block the API response because:\n"
        "1. Immediate HTTP Response Flushing: In the route handler, the HTTP response status and JSON payload are committed to the client socket "
        "via res.status(201).json(task) before the event emission or concurrently without waiting for a return value.\n"
        "2. Asynchronous I/O & Timer Delegation: Inside the listener handler, slow background tasks (e.g., SMTP email transmission, webhook notifications, "
        "or file logging) are wrapped inside asynchronous operations (such as setTimeout or Libuv async primitives). The listener registers the timer "
        "and immediately returns control back to the call stack.\n"
        "3. Event Loop Phase Separation: The main JavaScript thread finishes handling the HTTP request tick in ~20 ms. The slow notification logic "
        "is queued into the Libuv Timers Phase of the event loop, executing 2000 ms later without holding the client HTTP connection open."
    )

    # Question 2
    p_q2 = doc.add_paragraph()
    p_q2.paragraph_format.space_after = Pt(4)
    r_q2 = p_q2.add_run("2. What would happen to API response time if the notification logic were placed directly inside the POST route instead of in an event handler?")
    r_q2.bold = True

    p_a2 = doc.add_paragraph()
    p_a2.paragraph_format.line_spacing = 1.15
    p_a2.paragraph_format.space_after = Pt(12)
    p_a2.add_run(
        "If the notification logic were placed directly inside the POST /tasks route synchronously:\n"
        "1. Severe Latency Inflation: The client would be forced to wait for the entire 2000 ms notification dispatch to complete before receiving "
        "the HTTP 201 response. Perceived API latency would surge from ~20.87 ms to over 2020 ms (a ~9700% increase in response time).\n"
        "2. Throughput & Concurrency Bottleneck: Because Node.js utilizes a single-threaded event loop for JavaScript execution, holding request handlers "
        "open for heavy side effects starves the event loop. Under concurrent client traffic (e.g., 50 simultaneous requests), the backlog of waiting "
        "sockets would quickly exhaust operating system connection pools, causing request timeouts (HTTP 504) and degraded user experience.\n"
        "3. Single Point of Failure: If the third-party email provider or notification service experienced high latency or threw an error, the primary "
        "task creation request would fail, even though the database record was already successfully written to MongoDB."
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
    r_q3 = p_q3.add_run("3. Why is EventEmitter a reasonable choice for this scale of application, but not for a production system handling millions of events per day?")
    r_q3.bold = True

    p_a3 = doc.add_paragraph()
    p_a3.paragraph_format.line_spacing = 1.15
    p_a3.paragraph_format.space_after = Pt(14)
    p_a3.add_run(
        "While Node.js native EventEmitter provides an elegant, zero-dependency mechanism for single-process decoupling in educational applications, "
        "it is unsuited for enterprise production systems processing millions of daily events due to four structural limitations:\n"
        "1. In-Memory Process Boundary: EventEmitter operates strictly inside the V8 heap memory of a single Node.js process. In modern microservices "
        "or multi-instance deployments (PM2 clusters, Docker containers, Kubernetes pods), an event emitted on Pod A is invisible to listeners on Pod B.\n"
        "2. Zero Persistence & Crash Vulnerability: EventEmitter has no persistence mechanism. If a worker process crashes, restarts, or runs out of memory, "
        "all queued and uncompleted event notifications are permanently lost with no recovery path.\n"
        "3. Absence of Backpressure & Flow Control: Emitting millions of events into in-memory EventEmitter queues without rate limiting will rapidly cause "
        "memory leaks and catastrophic Out-Of-Memory (OOM) crashes.\n"
        "4. Enterprise Alternative: Production environments require dedicated distributed message brokers (such as RabbitMQ, Apache Kafka, Redis Streams / "
        "BullMQ, or AWS SQS) that provide cross-server message routing, disk persistence, consumer acknowledgments (ACK/NACK), and automatic dead-letter queues."
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
    r_s1 = p_s1.add_run("• Supplementary Problem 1: Second Custom Event ('task-deleted') with Audit Logging:")
    r_s1.bold = True
    p_s1_txt = doc.add_paragraph()
    p_s1_txt.paragraph_format.line_spacing = 1.15
    p_s1_txt.paragraph_format.space_after = Pt(8)
    p_s1_txt.add_run(
        "Implemented a dedicated audit event on the DELETE /tasks/:id endpoint. When a task is deleted from MongoDB, the route immediately responds "
        "with HTTP 200 (12.95 ms) and emits taskEvents.emit('task-deleted', task). An audit logging listener consumes this event and asynchronously records "
        "the deleted task's title, unique ObjectID, and ISO-8601 timestamp without adding overhead to the client deletion cycle."
    )

    # Supp 2
    p_s2 = doc.add_paragraph()
    p_s2.paragraph_format.space_after = Pt(3)
    r_s2 = p_s2.add_run("• Supplementary Problem 2: Error Event Handling Listener (Process Crash Protection):")
    r_s2.bold = True
    p_s2_txt = doc.add_paragraph()
    p_s2_txt.paragraph_format.line_spacing = 1.15
    p_s2_txt.paragraph_format.space_after = Pt(8)
    p_s2_txt.add_run(
        "Node.js EventEmitter has a critical built-in behavior: emitting an unhandled 'error' event throws an uncaught exception that forcefully "
        "crashes the entire server process. To guarantee resilience, an error handler was registered via taskEvents.on('error', (err) => ...). "
        "When background operations encounter errors (simulated via POST /test-event-error), the error event is caught, logged to the Error Monitor "
        "with timestamps, and safely contained, ensuring 100% server uptime."
    )

    # Supp 3
    p_s3 = doc.add_paragraph()
    p_s3.paragraph_format.space_after = Pt(3)
    r_s3 = p_s3.add_run("• Empirical Timestamp Ordering Proof (2000 ms Simulated Delay):")
    r_s3.bold = True
    p_s3_txt = doc.add_paragraph()
    p_s3_txt.paragraph_format.line_spacing = 1.15
    p_s3_txt.paragraph_format.space_after = Pt(14)
    p_s3_txt.add_run(
        "Empirically validated non-blocking execution using high-resolution millisecond timestamps:\n"
        "• API Response Sent: 2026-11-01T14:06:06.446Z (Duration: 20.87 ms, Status: 201 Created).\n"
        "• Background Worker Completion: 2026-11-01T14:06:08.463Z (Finished at T + 2017 ms).\n"
        "Conclusion: The API response returned to the client 2.017 seconds before the background listener finished executing, providing concrete "
        "empirical evidence of non-blocking, decoupled event-driven architecture."
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
        "Students will be able to implement non-blocking, event-driven background processing using Node's built-in EventEmitter, "
        "explain how it keeps the main request-response cycle fast, safeguard Node.js processes from unhandled error exceptions, "
        "and empirically verify asynchronous execution using precise timestamp evidence."
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
    output_path1 = r'C:\Users\Abc\Downloads\AWDF_Practical_10_D25IT136.docx'
    output_path2 = r'C:\Users\Abc\Downloads\AWDF-PR6-FullStack\AWDF_Practical_10_D25IT136.docx'

    doc.save(output_path1)
    doc.save(output_path2)
    print(f"Practical 10 Document created successfully at:\n1. {output_path1}\n2. {output_path2}")

if __name__ == '__main__':
    create_document()
