export interface Command {
  type: 'response' | 'command' | 'error';
  text: string;
  inline?: boolean;
  link?: string;
}
