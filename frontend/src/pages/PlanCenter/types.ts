export interface AgentAction {
    agentName: string;
    role: string;
    action: string;
    status: 'working' | 'idle' | 'done';
}

export interface StepData {
    title: string;
    icon: React.ReactNode;
    description: string;
    status?: 'idle' | 'loading' | 'completed'; // Step execution status
}

export interface PlanItem {
    id: string;
    name: string;
    indication: string;
    phase: string;
    sponsor: string;
    createdAt: string;
    status: 'draft' | 'in-progress' | 'completed';
}

export interface Message {
    role: 'user' | 'assistant';
    content: string;
    agentName?: string; // Optional agent name, defaults to "系统"
    typing?: boolean; // Whether to show typing animation
    todoList?: { text: string; completed: boolean }[]; // If present, show as todo list
}

export interface ExpertRole {
    value: string;
    label: string;
    description: string;
}

export interface Command {
    value: string;
    label: string;
    description: string;
    expert?: string; // Which expert this command belongs to
}

export interface RFPProposal {
    id: string;
    title: string;
    indication: string;
    phase: string;
    description: string;
    sponsor: string;
}
