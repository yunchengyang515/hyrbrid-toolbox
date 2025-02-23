import { freePlannerBasePrompt } from './prompts/free-planner-base-prompt'

export class ChatPromptService {
  getFreePlannerBasePrompt() {
    return freePlannerBasePrompt
  }
}
