
interface ServerData {
  type: string;
}

export interface IssueAbstract {
  id: string;
  title: string;
}

export interface IssueList extends ServerData {
  type: "issues";
  items: IssueAbstract[];
};

export interface Issue extends ServerData {
  type: "issue";
  id: string;
  title: string;
  description: string;
}

declare global {
  interface Window {
    __SERVER_DATA__: IssueList | Issue;
  }
}

