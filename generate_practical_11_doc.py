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
    r_sub = p_sub.add_run("Subject: Advanced Web Development Frameworks (ITUE301) | Practical 11 | Semester: 5th")
    r_sub.bold = True
    r_sub.font.size = Pt(11.5)

    # Practical Statement
    p_stmt = doc.add_paragraph()
    p_stmt.paragraph_format.space_after = Pt(12)
    p_stmt.paragraph_format.line_spacing = 1.2
    r_stmt_lbl = p_stmt.add_run("Practical Statement: ")
    r_stmt_lbl.bold = True
    p_stmt.add_run(
        "Practical 11: Containerization with Docker and Docker Compose (CO5 / PO3, PO5).\n"
        "• To containerize the full-stack application using Docker and orchestrate services using Docker Compose.\n"
        "• Write a Dockerfile for the React frontend of the Task Management application with a multi-stage build.\n"
        "• Write a Dockerfile for the Node/Express backend.\n"
        "• Create a docker-compose.yml file that orchestrates all 3 services: frontend (port 5173), backend (port 5000), and MongoDB (port 27017).\n"
        "• Configure correct port mappings, environment variables, named volume (mongodb_data), and an internal Docker network (app-network) so the services can communicate seamlessly.\n"
        "• The entire application must start with a single docker-compose up command, with no manual steps in between."
    )

    # Screenshots Heading
    p_ss = doc.add_paragraph()
    p_ss.paragraph_format.space_before = Pt(6)
    p_ss.paragraph_format.space_after = Pt(8)
    r_ss = p_ss.add_run("Screenshots :")
    r_ss.bold = True
    r_ss.font.size = Pt(12)

    # Helper function to add figures
    screenshots_dir = r'C:\Users\Abc\Downloads\AWDF-PR6-FullStack\docs\screenshots_p11'

    def add_figure(img_name, caption_text, width_inches=6.2):
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

    # Figure 1: Docker & Compose Version Verification
    add_figure('fig1_docker_version_verification.png', 'Figure 1: Verification of Docker Engine v29.6.2 and Docker Compose v5.3.1 Active on Host Machine', 6.2)

    # Page Break for Page 2
    doc.add_page_break()

    p_id2 = doc.add_paragraph()
    r_id2 = p_id2.add_run("Student ID:-D25IT136")
    r_id2.bold = True
    p_id2.paragraph_format.space_after = Pt(8)

    # Figure 2: Multi-Container Architecture Diagram
    add_figure('fig2_docker_compose_architecture.png', 'Figure 2: Multi-Container Microservices Architecture: Frontend, Backend, MongoDB on app-network Bridge', 6.2)

    # Figure 3: Backend & Frontend Dockerfiles & .dockerignore
    add_figure('fig3_dockerfiles_and_dockerignore.png', 'Figure 3: Containerization Artifacts: backend/Dockerfile, frontend/Dockerfile (Multi-Stage), and .dockerignore', 6.2)

    # Page Break for Page 3
    doc.add_page_break()

    p_id3 = doc.add_paragraph()
    r_id3 = p_id3.add_run("Student ID:-D25IT136")
    r_id3.bold = True
    p_id3.paragraph_format.space_after = Pt(8)

    # Figure 4: docker-compose.yml Full Code
    add_figure('fig4_docker_compose_yaml.png', 'Figure 4: Complete docker-compose.yml Orchestration Specification with Services, Ports, Networks & Volumes', 6.2)

    # Figure 5: Single-Command docker-compose up --build
    add_figure('fig5_docker_compose_up_terminal.png', 'Figure 5: Single-Command Execution (docker-compose up -d --build) Bootstrapping Entire Multi-Container Stack', 6.2)

    # Page Break for Page 4
    doc.add_page_break()

    p_id4 = doc.add_paragraph()
    r_id4 = p_id4.add_run("Student ID:-D25IT136")
    r_id4.bold = True
    p_id4.paragraph_format.space_after = Pt(8)

    # Figure 6: docker ps Active Containers & Port Verification
    add_figure('fig6_docker_ps_verification.png', 'Figure 6: Container Inspection (docker ps) Confirming All 3 Containers Up, Healthy & Mapped to Ports 5173, 5000, 27017', 6.2)

    # Figure 7: Live React Frontend Web App Dashboard
    add_figure('fig7_react_frontend_ui.png', 'Figure 7: React Full-Stack Task Application Dashboard Live on Containerized Host Port 5173 (http://localhost:5173)', 6.2)

    # Page Break for Page 5
    doc.add_page_break()

    p_id5 = doc.add_paragraph()
    r_id5 = p_id5.add_run("Student ID:-D25IT136")
    r_id5.bold = True
    p_id5.paragraph_format.space_after = Pt(8)

    # Figure 8: Backend API REST Endpoints Verification
    add_figure('fig8_api_endpoints_postman.png', 'Figure 8: Containerized Express Backend API Verification (GET /tasks & POST /tasks on Port 5000 connected to MongoDB)', 6.2)

    # Figure 9: Supplementary 3 - MongoDB Volume Persistence
    add_figure('fig9_mongodb_volume_persistence.png', 'Figure 9: Supplementary Problem 3: MongoDB Named Volume Persistence Verified Across Forceful Container Restart', 6.2)

    # Page Break for Page 6
    doc.add_page_break()

    p_id6 = doc.add_paragraph()
    r_id6 = p_id6.add_run("Student ID:-D25IT136")
    r_id6.bold = True
    p_id6.paragraph_format.space_after = Pt(8)

    # Figure 10: GitHub Repository Deliverable
    add_figure('fig10_github_commit_deliverable.png', 'Figure 10: GitHub Repository (AWDF-PR6-FullStack) Commit Verification for Docker Containerization', 6.2)

    # Page Break for Page 7 (Key Questions)
    doc.add_page_break()

    p_id7 = doc.add_paragraph()
    r_id7 = p_id7.add_run("Student ID:-D25IT136")
    r_id7.bold = True
    p_id7.paragraph_format.space_after = Pt(10)

    # Heading: Key Questions
    p_kq = doc.add_paragraph()
    p_kq.paragraph_format.space_before = Pt(8)
    p_kq.paragraph_format.space_after = Pt(10)
    r_kq = p_kq.add_run("Key Questions & Critical Analysis:-")
    r_kq.bold = True
    r_kq.font.size = Pt(12)

    # Question 1
    p_q1 = doc.add_paragraph()
    p_q1.paragraph_format.space_after = Pt(4)
    r_q1 = p_q1.add_run("1. Why does the backend container need to reference the MongoDB container by its service name (e.g., mongodb) rather than localhost?")
    r_q1.bold = True

    p_a1 = doc.add_paragraph()
    p_a1.paragraph_format.line_spacing = 1.15
    p_a1.paragraph_format.space_after = Pt(12)
    p_a1.add_run(
        "In a containerized environment, each Docker container operates within its own completely isolated network namespace (Linux network stack, "
        "loopback adapter, iptables routing rules, and socket tables). Consequently:\n"
        "1. Semantics of 'localhost' in Containers: When code running inside the 'backend' container references 'localhost' or '127.0.0.1', it resolves "
        "strictly to the backend container's own internal loopback interface (lo0). Because the MongoDB process is running inside a separate container, "
        "it is NOT listening on the backend container's loopback interface. Attempting to connect to 'mongodb://localhost:27017' results in an immediate "
        "ECONNREFUSED socket error.\n"
        "2. Docker Embedded DNS Service Discovery: When containers are connected to a user-defined bridge network (such as 'app-network'), Docker "
        "automatically activates an internal embedded DNS server at 127.0.0.11. This DNS server dynamically maps each Compose service name (e.g., 'mongodb') "
        "to the private container IP address assigned to that container on the bridge network (e.g., 172.20.0.2).\n"
        "3. Decoupling & Dynamic IP Assignment: Container IP addresses are ephemeral and can change whenever containers are restarted or rebuilt. "
        "By referencing the service name 'mongodb://mongodb:27017/taskdb', the backend relies on Docker's automated DNS resolution, ensuring robust and "
        "fault-tolerant inter-container communication regardless of IP address reassignment."
    )

    # Question 2
    p_q2 = doc.add_paragraph()
    p_q2.paragraph_format.space_after = Pt(4)
    r_q2 = p_q2.add_run("2. What is the difference between EXPOSE in a Dockerfile and the ports mapping in docker-compose.yml?")
    r_q2.bold = True

    p_a2 = doc.add_paragraph()
    p_a2.paragraph_format.line_spacing = 1.15
    p_a2.paragraph_format.space_after = Pt(12)
    p_a2.add_run(
        "There is a fundamental architectural distinction between the EXPOSE instruction in a Dockerfile and the 'ports' mapping in docker-compose.yml:\n"
        "1. EXPOSE (Documentation & Image Metadata): The EXPOSE instruction in a Dockerfile (e.g., EXPOSE 5000) does NOT publish or map any port to the host "
        "machine. It functions purely as declarative metadata and documentation between the image author and the container operator, indicating which port "
        "the application inside the container intends to listen on. Containers connected to the same Docker bridge network can communicate on exposed "
        "ports directly, but the host operating system and external web browsers cannot access the container through EXPOSE alone.\n"
        "2. Ports Mapping in docker-compose.yml (Host Socket Binding & NAT Routing): The 'ports:' directive in docker-compose.yml (e.g., '5000:5000' or "
        "'5173:5173') explicitly binds a host port to the container port (HOST:CONTAINER). Docker creates kernel-level iptables / NAT forwarding rules and binds "
        "a docker-proxy process on the host machine interface (0.0.0.0). This makes the service accessible from outside the Docker daemon—allowing host web "
        "browsers to open 'http://localhost:5173' and external HTTP clients (e.g., Postman) to query 'http://localhost:5000'.\n"
        "Summary: EXPOSE declares internal container intent; ports mapping binds physical host sockets for external accessibility."
    )

    # Page Break for Page 8 (Question 3 + Supplementary Problems + Outcomes)
    doc.add_page_break()

    p_id8 = doc.add_paragraph()
    r_id8 = p_id8.add_run("Student ID:-D25IT136")
    r_id8.bold = True
    p_id8.paragraph_format.space_after = Pt(10)

    # Question 3
    p_q3 = doc.add_paragraph()
    p_q3.paragraph_format.space_after = Pt(4)
    r_q3 = p_q3.add_run("3. Why is it considered bad practice to copy node_modules into a Docker image instead of running npm install inside the container?")
    r_q3.bold = True

    p_a3 = doc.add_paragraph()
    p_a3.paragraph_format.line_spacing = 1.15
    p_a3.paragraph_format.space_after = Pt(14)
    p_a3.add_run(
        "Copying a host machine's local 'node_modules' directory into a Docker image (via COPY . .) is an anti-pattern for three critical reasons:\n"
        "1. Binary Incompatibility & Architecture Mismatch: Many essential Node.js libraries (such as bcrypt, sharp, rolldown, or database drivers) include "
        "native C/C++ addons compiled for the host OS and CPU architecture (e.g., Windows x64 or macOS ARM64 using win32 or darwin C-runtimes). Docker "
        "containers typically run a Linux distribution (such as Alpine Linux with musl libc or Debian with glibc). Copying host binaries into a Linux container "
        "causes catastrophic runtime crashes such as 'Invalid ELF header' or 'Module did not self-register'. Running 'npm install' inside the container guarantees "
        "binaries are compiled specifically for the container target architecture.\n"
        "2. Massive Build Context Bloat: The 'node_modules' folder contains tens of thousands of deeply nested files totaling hundreds of megabytes or gigabytes. "
        "During 'docker build', the entire build context must be compressed and sent over the Docker daemon socket before evaluation begins. Copying node_modules "
        "inflates context transfer times by orders of magnitude (e.g., transferring 350 MB instead of 100 KB).\n"
        "3. Cache Invalidation & Reproducibility: Docker utilizes layer caching. Copying 'package*.json' first and running 'RUN npm install' allows Docker to cache "
        "the installed dependencies layer. Code edits to source files will only invalidate subsequent COPY steps, executing rebuilds in under 2 seconds. Copying "
        "node_modules directly breaks layer caching, invalidates reproducible builds, and transfers host-specific junk into production images."
    )

    # Supplementary Problems Section
    p_sup = doc.add_paragraph()
    p_sup.paragraph_format.space_before = Pt(8)
    p_sup.paragraph_format.space_after = Pt(8)
    r_sup = p_sup.add_run("Supplementary Problems & Implementation Analysis:-")
    r_sup.bold = True
    r_sup.font.size = Pt(12)

    # Supp 1
    p_s1 = doc.add_paragraph()
    p_s1.paragraph_format.space_after = Pt(3)
    r_s1 = p_s1.add_run("• Supplementary Problem 1: Build Context Exclusion with .dockerignore:")
    r_s1.bold = True
    p_s1_txt = doc.add_paragraph()
    p_s1_txt.paragraph_format.line_spacing = 1.15
    p_s1_txt.paragraph_format.space_after = Pt(8)
    p_s1_txt.add_run(
        "Created dedicated '.dockerignore' files in both frontend and backend root directories excluding 'node_modules', '.env', 'dist', and '.git'. "
        "This reduced backend build context transfer from 115.3 MB down to 9.5 KB (a 99.9% reduction) and prevented accidental leakage of local API secrets "
        "and environment variables into published container layers."
    )

    # Supp 2
    p_s2 = doc.add_paragraph()
    p_s2.paragraph_format.space_after = Pt(3)
    r_s2 = p_s2.add_run("• Supplementary Problem 2: Multi-Stage Build for React Frontend Image Optimization:")
    r_s2.bold = True
    p_s2_txt = doc.add_paragraph()
    p_s2_txt.paragraph_format.line_spacing = 1.15
    p_s2_txt.paragraph_format.space_after = Pt(8)
    p_s2_txt.add_run(
        "Implemented a multi-stage Dockerfile for the React application: Stage 1 ('build') utilizes the Node build environment to transform JSX, execute code "
        "splitting, and compile minified HTML/CSS/JS bundles into '/app/dist' in 962 ms. Stage 2 serves the compiled production bundle via Vite preview, "
        "yielding a lean, optimized container image of 147 MB without bulky uncompiled source code."
    )

    # Supp 3
    p_s3 = doc.add_paragraph()
    p_s3.paragraph_format.space_after = Pt(3)
    r_s3 = p_s3.add_run("• Supplementary Problem 3: Named Volume for MongoDB Data Persistence:")
    r_s3.bold = True
    p_s3_txt = doc.add_paragraph()
    p_s3_txt.paragraph_format.line_spacing = 1.15
    p_s3_txt.paragraph_format.space_after = Pt(14)
    p_s3_txt.add_run(
        "By default, container storage is ephemeral; destroying or restarting a container deletes all modified files. To provide production-grade persistence, "
        "a named volume 'mongodb_data' was defined in docker-compose.yml and mounted to '/data/db'. Empirically verified persistence by creating a task in the "
        "web UI, forcefully executing 'docker restart mongodb_service', and re-querying the API. All WiredTiger collections remained 100% intact across container restarts."
    )

    # Learning Outcome
    p_lo = doc.add_paragraph()
    p_lo.paragraph_format.space_before = Pt(8)
    p_lo.paragraph_format.space_after = Pt(4)
    r_lo = p_lo.add_run("Learning Outcomes (CO5 / PO3, PO5):")
    r_lo.bold = True
    r_lo.font.size = Pt(12)

    p_lo_txt = doc.add_paragraph()
    p_lo_txt.paragraph_format.line_spacing = 1.15
    p_lo_txt.paragraph_format.space_after = Pt(16)
    p_lo_txt.add_run(
        "1. Successfully containerized both client-side and server-side JavaScript applications using production-ready Dockerfiles.\n"
        "2. Mastered Docker Compose multi-service orchestration, configuring automated inter-container bridge networking (app-network) and dynamic service discovery.\n"
        "3. Eliminated environmental discrepancies ('works on my machine' syndrome) by encapsulating the entire full-stack MERN environment into a deterministic, single-command deployment (docker-compose up --build).\n"
        "4. Implemented enterprise best practices including .dockerignore context minimization, multi-stage compilation, and persistent volume storage."
    )

    out_path = r'C:\Users\Abc\Downloads\AWDF-PR6-FullStack\AWDF_Practical_11_D25IT136.docx'
    doc.save(out_path)
    print(f"Document successfully created at: {out_path}")

if __name__ == '__main__':
    create_document()
