import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function UserGuide() {
  const [activeTab, setActiveTab] = useState('framework');

  return (
    <div className="container guide-page">
      {/* Guide Hero */}
      <section className="guide-hero">
        <div className="guide-tag">DOCUMENTATION & MASTERY</div>
        <h1 className="guide-title">Prompt Engineering Handbook & User Guide</h1>
        <p className="guide-subtitle">
          Master the art and science of communicating effectively with modern Large Language Models (LLMs).
          Learn the industry frameworks, model optimizations, and how to craft reusable prompt templates.
        </p>
      </section>

      {/* Guide Navigation Tabs */}
      <div className="guide-tabs">
        <button
          className={`guide-tab-btn ${activeTab === 'framework' ? 'active' : ''}`}
          onClick={() => setActiveTab('framework')}
        >
          🏛️ 1. The 4-Pillar Framework
        </button>
        <button
          className={`guide-tab-btn ${activeTab === 'variables' ? 'active' : ''}`}
          onClick={() => setActiveTab('variables')}
        >
          🧩 2. Prompt Templates & Variables
        </button>
        <button
          className={`guide-tab-btn ${activeTab === 'models' ? 'active' : ''}`}
          onClick={() => setActiveTab('models')}
        >
          🤖 3. Model-Specific Cheat Sheet
        </button>
        <button
          className={`guide-tab-btn ${activeTab === 'platform' ? 'active' : ''}`}
          onClick={() => setActiveTab('platform')}
        >
          ⚡ 4. How to Use PromptVerse
        </button>
      </div>

      {/* Tab 1: The 4-Pillar Framework */}
      {activeTab === 'framework' && (
        <section className="guide-card">
          <h2>The 4-Pillar Prompt Engineering Framework (R-C-I-O)</h2>
          <p className="guide-intro-p">
            Vague prompts yield hallucinated and generic answers. High-impact prompts follow the proven{' '}
            <strong>Role-Context-Instruction-Output (RCIO)</strong> structure:
          </p>

          <div className="pillars-grid">
            <div className="pillar-item">
              <span className="pillar-num">01</span>
              <h3>Role Persona</h3>
              <p>Assign a domain expert role to trigger the LLM's specialized knowledge weights.</p>
              <div className="pillar-example">
                <code>"Act as a Principal Cloud & DevOps Architect with 10+ years in AWS..."</code>
              </div>
            </div>

            <div className="pillar-item">
              <span className="pillar-num">02</span>
              <h3>Context & Background</h3>
              <p>Describe your environment, business constraints, tech stack, and goals.</p>
              <div className="pillar-example">
                <code>"We are containerizing a legacy Node.js Express monolith for deployment onto AWS EC2..."</code>
              </div>
            </div>

            <div className="pillar-item">
              <span className="pillar-num">03</span>
              <h3>Explicit Instructions</h3>
              <p>Enumerate step-by-step tasks, security rules, and what to avoid.</p>
              <div className="pillar-example">
                <code>"Use multi-stage Docker builds. Do NOT run as root user. Expose port 8080 only."</code>
              </div>
            </div>

            <div className="pillar-item">
              <span className="pillar-num">04</span>
              <h3>Output Format</h3>
              <p>Specify the desired syntax: JSON, Markdown tables, Mermaid diagrams, or code blocks.</p>
              <div className="pillar-example">
                <code>"Output only the final Dockerfile and .dockerignore with inline security comments."</code>
              </div>
            </div>
          </div>

          <div className="full-prompt-showcase">
            <h4>💡 Complete Example in Action:</h4>
            <pre className="code-box">
{`Act as a Senior Application Security Engineer.

Context:
We have a MERN stack REST API using JWT tokens and bcrypt password hashing.

Task:
Audit the provided authentication middleware for potential vulnerabilities (token leakage, timing attacks, or unhandled exceptions).

Output Format:
Provide a severity table (Critical / High / Medium), followed by the remediated code block.`}
            </pre>
          </div>
        </section>
      )}

      {/* Tab 2: Prompt Templates & Variables */}
      {activeTab === 'variables' && (
        <section className="guide-card">
          <h2>Designing Reusable Templates with Variables</h2>
          <p className="guide-intro-p">
            The best prompts in PromptVerse are adaptable templates. By using bracketed placeholders{' '}
            <code>[VARIABLE_NAME]</code>, any developer or team member can substitute their own parameters in seconds.
          </p>

          <div className="rules-list">
            <div className="rule-box">
              <h4>1. Use Clear, Capitalized Variable Names</h4>
              <p>
                Place variables in square brackets such as <code>[SERVICE_NAME]</code>, <code>[PORT]</code>, or{' '}
                <code>[DATABASE_URL]</code> so users immediately know what needs to be replaced.
              </p>
            </div>

            <div className="rule-box">
              <h4>2. Provide Sensible Example Defaults</h4>
              <p>
                Include recommended values inside the bracket: e.g.{' '}
                <code>[LANGUAGE, e.g. TypeScript 5.4 / Python 3.12]</code>. This guides the user on expected formatting.
              </p>
            </div>

            <div className="rule-box">
              <h4>3. Few-Shot Prompting (Provide Input/Output Pairs)</h4>
              <p>
                LLMs excel when you show them 1 or 2 examples of desired input and output before asking for the final solution.
              </p>
            </div>
          </div>

          <div className="template-sample">
            <h4>Sample PromptVerse Template:</h4>
            <div className="sample-terminal">
              <code>
                Generate a production Kubernetes manifest for deploying a microservice named "
                <span className="highlight-var">[SERVICE_NAME]</span>" in namespace "
                <span className="highlight-var">[NAMESPACE, e.g. production]</span>".
                Set CPU limits to <span className="highlight-var">[MAX_CPU, e.g. 500m]</span> and replicas to{' '}
                <span className="highlight-var">[REPLICAS, e.g. 3]</span>.
              </code>
            </div>
          </div>
        </section>
      )}

      {/* Tab 3: Model-Specific Cheat Sheet */}
      {activeTab === 'models' && (
        <section className="guide-card">
          <h2>Model-Specific Optimization Cheat Sheet</h2>
          <p className="guide-intro-p">
            Different AI engines have distinct strengths. Tailor your prompts to leverage each model's architectural advantages:
          </p>

          <div className="models-comparison-grid">
            <div className="model-col claude-card">
              <div className="model-badge claude-badge">Anthropic Claude 3.5 Sonnet</div>
              <h4>Superpowers: Complex Logic, Artifacts & Architecture</h4>
              <ul>
                <li><strong>Strengths:</strong> Exceptional nuance, superior code refactoring, and large context comprehension.</li>
                <li><strong>Best Syntax:</strong> Use XML tags like <code>&lt;context&gt;</code>, <code>&lt;rules&gt;</code>, and <code>&lt;instructions&gt;</code> to separate prompt sections.</li>
                <li><strong>Pro Tip:</strong> Ask Claude to "think step-by-step" or provide a Mermaid diagram for complex architectures.</li>
              </ul>
            </div>

            <div className="model-col gpt-card">
              <div className="model-badge gpt-badge">OpenAI ChatGPT (GPT-4o)</div>
              <h4>Superpowers: Speed, Structured JSON & Function Calling</h4>
              <ul>
                <li><strong>Strengths:</strong> Strict JSON schema adherence, quick code generation, and conversational tasks.</li>
                <li><strong>Best Syntax:</strong> Use markdown numbered lists and clear constraint delimiters (### Constraints).</li>
                <li><strong>Pro Tip:</strong> Explicitly specify "Return ONLY valid JSON without markdown wrapping" when building API pipelines.</li>
              </ul>
            </div>

            <div className="model-col midjourney-card">
              <div className="model-badge midjourney-badge">Midjourney v6</div>
              <h4>Superpowers: Photorealism, Cinematic Aesthetics & 3D Renders</h4>
              <ul>
                <li><strong>Strengths:</strong> Lighting, volumetric reflections, and camera optics simulation.</li>
                <li><strong>Best Syntax:</strong> Commas-separated visual cues followed by parameter flags.</li>
                <li><strong>Key Flags:</strong> <code>--ar 16:9</code> (widescreen), <code>--style raw</code> (photorealism), <code>--v 6.1</code>.</li>
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* Tab 4: Platform Guide */}
      {activeTab === 'platform' && (
        <section className="guide-card">
          <h2>How to Use PromptVerse</h2>
          <p className="guide-intro-p">
            PromptVerse is designed to be your team's centralized prompt repository and community exchange platform.
          </p>

          <div className="platform-steps">
            <div className="step-row">
              <div className="step-circle">1</div>
              <div>
                <h4>Explore & Search</h4>
                <p>Browse community prompts filtered by Category (DevOps, Coding, Writing, Art) or Target AI Model (ChatGPT, Claude, etc.).</p>
              </div>
            </div>

            <div className="step-row">
              <div className="step-circle">2</div>
              <div>
                <h4>1-Click Instant Copy</h4>
                <p>Click the <strong>"📋 Copy Prompt"</strong> button on any card. The text is copied to your clipboard ready to paste into your LLM.</p>
              </div>
            </div>

            <div className="step-row">
              <div className="step-circle">3</div>
              <div>
                <h4>Create & Share Your Own Prompts</h4>
                <p>Sign in to your account and click <strong>"+ Create Prompt"</strong>. Save your battle-tested prompts with tags and descriptions for the community.</p>
              </div>
            </div>

            <div className="step-row">
              <div className="step-circle">4</div>
              <div>
                <h4>Manage Personal Workspace</h4>
                <p>Visit <strong>"My Prompts"</strong> to update, refine, or delete your published prompts, and track how many times engineers have copied your work.</p>
              </div>
            </div>
          </div>

          <div className="guide-cta">
            <h3>Ready to put theory into practice?</h3>
            <p>Browse our curated community prompts or submit your own custom template today.</p>
            <div className="cta-buttons">
              <Link to="/" className="btn-primary">
                Explore Community Prompts
              </Link>
              <Link to="/my-prompts" className="btn-secondary">
                Go to My Prompts
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
