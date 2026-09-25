export interface FSFile {
  name: string
  type: 'file'
  content: string
  extension: 'md' | 'txt' | 'pdf'
}

export interface FSFolder {
  name: string
  type: 'folder'
    children: (FSFile | FSFolder)[];
}

export type FSNode = FSFile | FSFolder

export const filesystem: FSFolder = {
    name: 'yamin',
    type: 'folder',
    children: [
        {
            name: 'About',
            type: 'folder',
            children: [
                { name: 'about.md', type: 'file', extension: 'md', content: '' },
                { name: 'stack.md', type: 'file', extension: 'md', content: '' },
                { name: 'philosophy.md', type: 'file', extension: 'md', content: '' },
            ],
        },
        {
            name: 'Projects',
            type: 'folder',
            children: [
                { name: 'pr-review-agent.md', type: 'file', extension: 'md', content: '' },
                { name: 'bug-reproducer.md', type: 'file', extension: 'md', content: '' },
                { name: 'remotion-contribution.md', type: 'file', extension: 'md', content: '' },
            ],
        },
        {
            name: 'Resume',
            type: 'folder',
            children: [
                { name: 'yamin_resume.pdf', type: 'file', extension: 'pdf', content: '' },
            ],
        },
    ],
};