import os

def create_resume_pdf(filename):
    lines = [
        ("F2", 20, 50, 740, "Yamin Hossain"),
        ("F1", 12, 50, 722, "AI-Native Software Engineer | LangGraph"),
        ("F1", 9.5, 50, 706, "Rajshahi, Bangladesh  |  +880-01706960268  |  Email: contact@yamin.dev  |  GitHub: github.com/yamin  |  LinkedIn: linkedin.com/in/yamin"),
        ("F1", 9, 50, 680, "AI-Native Software Engineer specializing in production LLM agents, LangGraph pipelines, and RAG systems."),
        ("F1", 9, 50, 668, "Ships complete products end-to-end with production reliability practices: async queuing, exponential backoff,"),
        ("F1", 9, 50, 656, "and observable multi-agent pipelines. Ready to own hard problems from day one on early-stage remote teams."),
        
        ("F2", 11, 50, 634, "SKILLS"),
        ("F1", 9, 50, 620, "AI & Agents: LangGraph, LangChain, RAG pipeline, pgvector, Prompt Engineering, Tool Calling, Guardrails"),
        ("F1", 9, 50, 608, "Frontend: React.js, Next.js, TypeScript, Tailwind CSS, HTML, CSS, Zustand"),
        ("F1", 9, 50, 596, "Backend: Python, FastAPI, Node.js, Express.js, TypeScript, BullMQ, REST APIs, WebSocket, SSE"),
        ("F1", 9, 50, 584, "Databases: PostgreSQL, Prisma ORM, Redis, Neon, MySQL"),
        ("F1", 9, 50, 572, "Infrastructure: Docker, Vercel, Render, Turborepo, Git & GitHub, CI/CD pipeline"),
        
        ("F2", 11, 50, 550, "PROJECTS"),
        ("F2", 10, 50, 536, "PR REVIEW AGENT - Full Stack Web Application (June 2026 - Present)"),
        ("F1", 8.5, 50, 524, "Personal Project | Live Demo | GitHub"),
        ("F1", 8.5, 60, 510, "- Built a GitHub App (Marketplace-installable) that ingests 6 months of merged PR history and posts inline"),
        ("F1", 8.5, 60, 498, "  review comments referencing specific past decisions not generic rules making team knowledge searchable."),
        ("F1", 8.5, 60, 486, "- Designed a 6-node LangGraph pipeline with chunked diff processing and pgvector cosine similarity search"),
        ("F1", 8.5, 60, 474, "  across 384-dimensional embeddings, surfacing decisions like 'team rejected this in PR #234'."),
        ("F1", 8.5, 60, 462, "- Architected webhook -> BullMQ/Redis queue -> FastAPI inference layer -> Next.js dashboard with"),
        ("F1", 8.5, 60, 450, "  exponential backoff, rollback handling, and structured logging for incident traceability."),
        ("F1", 8, 50, 438, "Tech: Next.js, TypeScript, Node.js, Express.js, Python, FastAPI, LangGraph, LangChain, pgvector, PostgreSQL, BullMQ, Redis, Docker"),
        
        ("F2", 10, 50, 416, "BUG REPRODUCER - Autonomous End-to-End Debugging API Service (Feb 2026 - Present)"),
        ("F1", 8.5, 50, 404, "Personal Project | Live Demo | GitHub"),
        ("F1", 8.5, 60, 390, "- Built an autonomous agent that takes a GitHub issue URL, reproduces the bug, writes a failing test,"),
        ("F1", 8.5, 60, 378, "  generates a fix, and opens a PR completing the full debugging cycle without human intervention."),
        ("F1", 8.5, 60, 366, "- Designed a 7-node LangGraph pipeline with conditional retry logic: when a test fails for the wrong reason,"),
        ("F1", 8.5, 60, 354, "  the agent parses the error output and rewrites the test using that context rather than retrying blindly."),
        ("F1", 8, 50, 342, "Tech: Next.js, TypeScript, Node.js, Express.js, Python, FastAPI, LangChain, LangGraph, PostgreSQL, Prisma, BullMQ, Docker"),
        
        ("F2", 11, 50, 320, "CONTRIBUTION"),
        ("F2", 9.5, 50, 306, "Remotion - React framework for programmatic video creation (52.6k+ GitHub stars) remotion.dev"),
        ("F1", 8.5, 60, 292, "- Added preserveSilence option to renderMediaOnWeb(), ensuring silent head/tail frames are retained in the"),
        ("F1", 8.5, 60, 280, "  output file fixing timing misalignment when feeding exports into ASR transcription pipelines. (PR #7074)"),
        ("F1", 8.5, 60, 268, "- Extended playbackRate validation in @remotion/player from +-4 to +-10 to match modern browser capabilities (PR #7107)"),
        ("F1", 8, 50, 256, "Tech: TypeScript, React, Web Audio API, Bun"),
        
        ("F2", 11, 50, 234, "EDUCATION"),
        ("F2", 9.5, 50, 220, "Varendra University (Oct 2022 - Mar 2026)"),
        ("F1", 8.5, 50, 208, "Bachelor of Engineering - Electrical and Electronic Engineering"),
    ]
    
    stream_content = []
    for font, size, x, y, text in lines:
        safe_text = text.replace("(", "\\(").replace(")", "\\)")
        stream_content.append(f"BT /{font} {size} Tf {x} {y} Td ({safe_text}) Tj ET")
    
    # Horizontal rule lines
    stream_content.append("0.8 G 50 698 m 562 698 l S")
    stream_content.append("0.2 G 50 630 m 562 630 l S")
    stream_content.append("0.2 G 50 546 m 562 546 l S")
    stream_content.append("0.2 G 50 316 m 562 316 l S")
    stream_content.append("0.2 G 50 230 m 562 230 l S")
    
    stream_data = "\n".join(stream_content).encode("latin1")
    stream_len = len(stream_data)
    
    objects = []
    # 1: Catalog
    objects.append(b"<< /Type /Catalog /Pages 2 0 R >>")
    # 2: Pages
    objects.append(b"<< /Type /Pages /Kids [3 0 R] /Count 1 >>")
    # 3: Page
    objects.append(b"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>")
    # 4: Contents
    objects.append(f"<< /Length {stream_len} >>\nstream\n".encode("latin1") + stream_data + b"\nendstream")
    # 5: Font Helvetica
    objects.append(b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>")
    # 6: Font Helvetica-Bold
    objects.append(b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>")
    
    out = [b"%PDF-1.4\n"]
    offsets = []
    
    for i, obj in enumerate(objects, 1):
        offsets.append(sum(len(x) for x in out))
        out.append(f"{i} 0 obj\n".encode("latin1"))
        out.append(obj)
        out.append(b"\nendobj\n")
        
    xref_pos = sum(len(x) for x in out)
    out.append(f"xref\n0 {len(objects)+1}\n0000000000 65535 f \n".encode("latin1"))
    for off in offsets:
        out.append(f"{off:010d} 00000 n \n".encode("latin1"))
    
    out.append(f"trailer\n<< /Size {len(objects)+1} /Root 1 0 R >>\nstartxref\n{xref_pos}\n%%EOF".encode("latin1"))
    
    os.makedirs(os.path.dirname(os.path.abspath(filename)), exist_ok=True)
    with open(filename, "wb") as f:
        f.write(b"".join(out))
    print(f"Generated {filename} ({sum(len(x) for x in out)} bytes)")

if __name__ == "__main__":
    create_resume_pdf("public/Yamin_Hossain_Resume.pdf")
    create_resume_pdf("public/Resume.pdf")
