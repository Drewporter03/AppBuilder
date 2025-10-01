import Project from "../../models/Project.js";
import { Groq } from "groq-sdk";

export async function getAllProjects(_, res) {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.status(200).json(projects);
  } catch (error) {
    console.error("Error in getAllProjects Controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getProjectById(req, res) {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    return res.status(200).json({ project });
  } catch (error) {
    console.error("Error in getProjectById Controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function createProject(req, res) {
  try {
    const { title, prompt } = req.body;
    const project = new Project({ title, prompt });
    const savedProject = await project.save();
    res.status(201).json({ savedProject });
  } catch (error) {
    console.error("Error in createProject Controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function updateProject(req, res) {
  const { id } = req.params;
  const { title, prompt } = req.body;

  try {
    const project = await Project.findById(id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    if (
      typeof prompt === "string" &&
      prompt.trim() &&
      prompt !== project.prompt
    ) {
      const extracted = await extractRequirements(prompt);
      project.appName = extracted?.appName ?? project.appName;
      project.entities = extracted?.entities ?? project.entities;
      project.roles = extracted?.roles ?? project.roles;
      project.features = extracted?.features ?? project.features;

      project.title = extracted?.appName ?? title ?? project.title;

      project.prompt = prompt;
    } else {
      if (typeof title === "string") project.title = title;
      if (typeof prompt === "string") project.prompt = prompt;
    }

    await project.save();
    return res.status(200).json(project);
  } catch (error) {
    console.error("Error in updateProject", error);
    return res.status(500).json({ error: "Failed to update project" });
  }
}

export async function deleteProject(req, res) {
  try {
    const deletedProject = await Project.findByIdAndDelete(req.params.id);
    if (!deletedProject)
      return res.status(404).json({ message: "Note not found" });
    res.status(200).json({ message: "note deleted", deletedProject });
  } catch (error) {
    console.error("Error in deleteProject Controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function generateUIMockup(userPrompt) {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

  const systemPrompt = `You are a UI generator assistant. Follow these rules exactly when generating a UI mockup:

1. ROLE & OUTPUT FORMAT
- You must generate ONLY a single complete HTML document (including CSS). The entire assistant response must be exactly the HTML file and nothing else.
- The response MUST start with:
  <!DOCTYPE html>
  <html>
  <head>...</head>
  <body>...</body>
  </html>
- Do not include any "ground tags", "comprehend tags", explanation comments, or any text outside the HTML structure.

2. CONTENT & STRUCTURE REQUIREMENTS
- Include a top-level navigation bar (menu/tabs) implemented with anchor links to indicate Roles/Features.
- All content that would normally appear under those tabs must still be displayed on the main page, grouped under clear headings or sections (so navigation is not required to view them).
- For every extracted Entity, include a simple form with a few labeled input fields and a submit button (non-functional).
- Use semantic HTML where appropriate (nav, main, section, form, label, input, button).
- Include sample placeholder data in the markup (not generated dynamically).

3. STYLING & UX
- Default styling: dark mode, clean and minimal, with subtle hover/focus micro-interactions.
- Do not use any external CSS frameworks or JS. All CSS must be embedded in a <style> block in the <head>.
- Provide a responsive layout that looks reasonable on desktop and narrow widths.
- Icons/emoji are allowed inline (no external icon libraries).
- If the user *explicitly requests* a different style (e.g., light mode, glassmorphism, brand color), follow that request and reflect it in the CSS.

4. LENGTH & COMPLETENESS
- Keep the UI concise — suitable for a short demo. Prioritise clarity and aesthetics over replicating every feature.
- Make the HTML well-structured and easy to scan (clear class names, logical sections).

5. SAFETY & REFUSAL
- If the user prompt requests content that facilitates illegal activity, violent wrongdoing, instructions to bypass security, or other disallowed content, refuse. Instead of producing HTML, respond with the single line (and nothing else):
  "That request is disallowed. I cannot assist with that."
- Do not attempt to work around refusals by providing a UI that simulates or instructs disallowed content.

6. PARSING & OVERRIDES
- If the user provides an app description, extract App Name, Entities, Roles, and Features from their text and base the UI on those. If any part is missing, make a reasonable minimal assumption (e.g., 2–3 entities, 2–3 roles) and proceed.
- If the user explicitly gives a CSS color scheme, font, layout preference, or mode (light/dark), override the default with their choice.

7. EXAMPLE BEHAVIOR
- When given: "I want an app called Pulse Studio for Designers, Managers, and Clients. Entities: Project, Task, User. Features: Project board, Task list, Progress view."
  -> Produce a single HTML document with a dark, modern UI, role tabs (Designer | Manager | Client), AND display all their respective content sections (forms and boards) directly on the same page.

8. STRICTNESS
- If any part of the generation would require non-HTML output (images, binary files, downloads), approximate visually with HTML/CSS only (e.g., SVG or faux previews).
- Always obey the "only HTML document" rule. If you cannot comply, output the single-line refusal above.

End of system prompt.

`;

  const chatCompletion = await groq.chat.completions.create({
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    model: "openai/gpt-oss-120b",
    temperature: 0.7,
    max_completion_tokens: 4096,
    top_p: 1,
    stream: false,
  });
  return chatCompletion.choices[0].message.content;
}

export async function captureRequirements(req, res) {
  const { description } = req.body;
  try {
    const extracted = await extractRequirements(description);
    const uiMockup = await generateUIMockup(description);

    const projectTitle =
      extracted && extracted.appName ? extracted.appName : "Untitled Project";

    const newProject = new Project({
      title: projectTitle,
      prompt: description,
      ...extracted,
      uiMockup,
    });

    await newProject.save();
    res.status(201).json(newProject);
  } catch (error) {
    console.error("Error in captureRequirements", error);
    res.status(500).json({ error: "Failed to capture requirements" });
  }
}

export async function updateUIMockup(req, res) {
  const { id } = req.params;
  try {
    const project = await Project.findById(id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const uiMockup = await generateUIMockup(project.prompt);
    project.uiMockup = uiMockup;
    await project.save();

    return res.status(200).json(project);
  } catch (error) {
    console.error("Error in updateUIMockup", error);
    return res.status(500).json({ error: "Failed to update UI mockup" });
  }
}

export async function downloadUIMockup(req, res) {
  const { id } = req.params;
  try {
    const project = await Project.findById(id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    if (!project.uiMockup)
      return res.status(404).json({ message: "No UI mockup available" });

    const baseName = (project.appName || project.title || "project")
      .toString()
      .trim();
    const filename = baseName.replace(/[^\w\-_.]/g, "_") + ".html";

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    return res.send(project.uiMockup);
  } catch (error) {
    console.error("Error in downloadUIMockup", error);
    return res.status(500).json({ error: "Failed to download UI mockup" });
  }
}

async function extractRequirements(userPrompt) {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  const systemPrompt = `Extract from the app description: App Name, Entities (array), Roles (array), Features (array). Respond with valid JSON only, no explanations.
Example:
{"appName":"My App","entities":["Student","Course"],"roles":["Teacher","Student"],"features":["Enroll","Add courses"]}`;

  const chatCompletion = await groq.chat.completions.create({
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    model: "openai/gpt-oss-120b",
    temperature: 0.0,
    max_completion_tokens: 500,
    top_p: 1,
    stream: false,
  });

  const content = chatCompletion.choices?.[0]?.message?.content?.trim() ?? "{}";

  try {
    const parsed = JSON.parse(content);
    return {
      appName: parsed.appName ?? parsed.title ?? "",
      entities: Array.isArray(parsed.entities)
        ? parsed.entities
        : parsed.entities
          ? [parsed.entities]
          : [],
      roles: Array.isArray(parsed.roles)
        ? parsed.roles
        : parsed.roles
          ? [parsed.roles]
          : [],
      features: Array.isArray(parsed.features)
        ? parsed.features
        : parsed.features
          ? [parsed.features]
          : [],
    };
  } catch (err) {
    console.error("Failed to parse extracted requirements JSON:", content, err);
    return {
      appName: "",
      entities: [],
      roles: [],
      features: [],
    };
  }
}
