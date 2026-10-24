import {
  IAgentMessage,
  IAgentToolDefinition,
  IAgentRunResult,
  IToolExecution,
} from '@ai-jobpilot/types';
import { AIProvider, AIOptions, AgentLoopOptions } from './provider.interface.js';

export class MockAIProvider implements AIProvider {
  readonly name = 'MockAIProvider';

  async generateStructuredOutput<T>(
    prompt: string,
    schema: Record<string, unknown>,
    _options?: AIOptions
  ): Promise<T> {
    console.log(`[MockAIProvider] Generating structured output for schema:`, Object.keys(schema));

    // Heuristics to return relevant structured mocks based on prompt context
    if (prompt.toLowerCase().includes('resume') || prompt.toLowerCase().includes('candidate')) {
      const mockResumeData = {
        fullName: 'Alex Morgan',
        headline: 'Senior Full Stack Engineer',
        summary: 'Experienced Full Stack Engineer specializing in TypeScript, Node.js, React, and AI agents.',
        yearsOfExperience: 5,
        skills: {
          languages: ['TypeScript', 'JavaScript', 'Python', 'SQL'],
          frameworks: ['React', 'Next.js', 'Express', 'Tailwind CSS'],
          databases: ['MongoDB', 'PostgreSQL', 'Redis'],
          cloud: ['AWS', 'Docker'],
          ai: ['OpenAI API', 'LangChain', 'Vector DBs'],
          tools: ['Git', 'BullMQ', 'Jest'],
        },
        experiences: [
          {
            id: 'exp-1',
            company: 'TechFlow Systems',
            title: 'Senior Software Engineer',
            startDate: '2022-01-01',
            isCurrent: true,
            description: 'Architected scalable microservices and automated workflows.',
            technologies: ['Node.js', 'React', 'MongoDB', 'BullMQ', 'Redis'],
          },
        ],
        education: [
          {
            id: 'edu-1',
            institution: 'State University',
            degree: 'B.S. in Computer Science',
            startDate: '2016-09-01',
            endDate: '2020-05-30',
          },
        ],
        projects: [
          {
            id: 'proj-1',
            name: 'AI Workflow Engine',
            description: 'Autonomous job matching and workflow execution engine.',
            technologies: ['TypeScript', 'BullMQ', 'Next.js'],
          },
        ],
        certifications: ['AWS Certified Solutions Architect'],
        achievements: ['Decreased workflow processing latency by 45%'],
      };
      return mockResumeData as unknown as T;
    }

    if (prompt.toLowerCase().includes('match') || prompt.toLowerCase().includes('job description')) {
      const mockMatchData = {
        matchScore: 88,
        breakdown: {
          skillsScore: 92,
          experienceScore: 85,
          locationScore: 90,
          roleScore: 88,
          semanticScore: 85,
        },
        matchingSkills: ['TypeScript', 'React', 'Node.js', 'MongoDB', 'Redis'],
        missingSkills: ['GraphQL', 'Kubernetes'],
        strengths: ['Extensive full-stack TypeScript background', 'Hands-on queue and Redis expertise'],
        gaps: ['Requires deeper container orchestration (K8s) knowledge'],
        explanation: 'Candidate meets 90% of core technical competencies and aligns with salary/workplace requirements.',
        recommendation: 'strong_match',
      };
      return mockMatchData as unknown as T;
    }

    // Default fallback
    return {
      message: 'Mock structured output generated successfully',
      timestamp: new Date().toISOString(),
    } as unknown as T;
  }

  async generateText(prompt: string, _options?: AIOptions): Promise<string> {
    if (prompt.toLowerCase().includes('cover letter')) {
      return `Dear Hiring Team,

I am writing to express my strong enthusiasm for the role. With over 5 years of experience building resilient distributed systems with TypeScript, Node.js, Express, and React, I have a track record of driving scalable architecture.

In my recent projects, I developed event-driven automation pipelines utilizing Redis and BullMQ, delivering measurable performance gains and rock-solid reliability.

I would welcome the opportunity to discuss how my background matches your team's objectives.

Sincerely,
Alex Morgan`;
    }

    return `[MockAI Response] Processed prompt: "${prompt.slice(0, 50)}..." at ${new Date().toISOString()}`;
  }

  async generateEmbedding(text: string): Promise<number[]> {
    // Generate a deterministic 64-dimensional pseudo-embedding vector
    const vector: number[] = [];
    for (let i = 0; i < 64; i++) {
      const charCode = text.charCodeAt(i % text.length) || 42;
      vector.push(parseFloat(((charCode * (i + 1)) % 100 / 100).toFixed(4)));
    }
    return vector;
  }

  async executeToolCallingLoop(
    messages: IAgentMessage[],
    tools: IAgentToolDefinition[],
    options?: AgentLoopOptions
  ): Promise<IAgentRunResult> {
    const latestUserMessage = [...messages].reverse().find((m) => m.role === 'user')?.content || '';
    const toolExecutions: IToolExecution[] = [];

    // Simulate multi-step tool execution if relevant tools are available
    if (options?.toolExecutor && tools.length > 0) {
      if (latestUserMessage.toLowerCase().includes('search') || latestUserMessage.toLowerCase().includes('job')) {
        const searchTool = tools.find((t) => t.name === 'searchJobs');
        if (searchTool) {
          const args = { query: 'TypeScript Engineer', limit: 3 };
          try {
            const result = await options.toolExecutor(searchTool.name, args);
            toolExecutions.push({
              id: `tool-${Date.now()}-1`,
              toolName: searchTool.name,
              arguments: args,
              result,
              status: 'completed',
              executedAt: new Date(),
            });
          } catch (err) {
            toolExecutions.push({
              id: `tool-${Date.now()}-1`,
              toolName: searchTool.name,
              arguments: args,
              status: 'failed',
              error: (err as Error).message,
              executedAt: new Date(),
            });
          }
        }
      }
    }

    return {
      response: `I searched for the top matching jobs based on your prompt: "${latestUserMessage}". Found high-alignment opportunities fitting your skills.`,
      toolExecutions,
      iterations: toolExecutions.length > 0 ? 2 : 1,
      tokensUsed: {
        promptTokens: 140,
        completionTokens: 85,
        totalTokens: 225,
      },
    };
  }
}
