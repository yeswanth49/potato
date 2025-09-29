import fs from 'fs';

const getSection = (markdown: string, header: string): string => {
  const headerLine = `## ${header}`;
  const startIndex = markdown.indexOf(headerLine);
  if (startIndex === -1) {
    return '';
  }
  const sectionStart = startIndex;
  const nextHeaderIndex = markdown.indexOf('\n## ', sectionStart + headerLine.length);
  if (nextHeaderIndex === -1) {
    return markdown.slice(sectionStart);
  }
  return markdown.slice(sectionStart, nextHeaderIndex);
};

describe('Repository Guidelines (AGENTS.test.ts)', () => {
  let content: string;
  const filePath = 'AGENTS.md';

  beforeAll(() => {
    expect(fs.existsSync(filePath)).toBe(true);
    content = fs.readFileSync(filePath, 'utf8');
  });

  describe('markdown structure', () => {
    test('starts with top-level title and includes headers', () => {
      const lines = content.split('\n');
      expect(lines[0]).toBe('# Repository Guidelines');

      const headers = content.match(/^#{1,6}\s+.+$/gm) || [];
      expect(headers.length).toBeGreaterThan(0);

      const levels = headers.map(
        header => (header.match(/^#+/) || [''])[0].length
      );
      expect(levels[0]).toBe(1);
      for (let i = 1; i < levels.length; i += 1) {
        expect(levels[i]).toBeGreaterThanOrEqual(levels[i - 1]);
        expect(levels[i] - levels[i - 1]).toBeLessThanOrEqual(1);
      }
    });

    test('contains all expected sections in order', () => {
      const expectedHeaders = [
        'Project Structure & Module Organization',
        'Build, Test, and Development Commands',
        'Coding Style & Naming Conventions',
        'Testing Guidelines',
        'Commit & Pull Request Guidelines'
      ];

      let lastIndex = -1;
      expectedHeaders.forEach(header => {
        const index = content.indexOf(`## ${header}`);
        expect(index).toBeGreaterThan(-1);
        expect(index).toBeGreaterThan(lastIndex);
        lastIndex = index;
      });
    });
  });

  describe('section-specific guidance', () => {
    type SectionSpec = {
      header: string;
      phrases: Array<string | RegExp>;
    };

    const sectionSpecs: SectionSpec[] = [
      {
        header: 'Project Structure & Module Organization',
        phrases: [
          'Next.js App Router lives in',
          '`app/`',
          '`components/`',
          '`hooks/`',
          '`lib/`',
          '`public/`',
          '`docs/`',
          '`references/`'
        ]
      },
      {
        header: 'Build, Test, and Development Commands',
        phrases: [
          'Use pnpm',
          'pnpm dev',
          'pnpm build',
          'pnpm start',
          'pnpm lint',
          'should pass before you push'
        ]
      },
      {
        header: 'Coding Style & Naming Conventions',
        phrases: [
          'TypeScript',
          /2.?space indentation/i,
          'HeroSection.tsx',
          'useCarousel.ts',
          'Tailwind',
          'class-variance-authority'
        ]
      },
      {
        header: 'Testing Guidelines',
        phrases: [
          'React Testing Library',
          '`tests/`',
          '`__tests__`',
          'manual QA steps'
        ]
      },
      {
        header: 'Commit & Pull Request Guidelines',
        phrases: [
          'Conventional Commits',
          'feat:',
          'fix:',
          'chore:',
          'concise summary',
          'screenshots or recordings',
          'linked issues',
          'testing performed'
        ]
      }
    ];

    sectionSpecs.forEach(({ header, phrases }) => {
      test(`${header} section covers critical points`, () => {
        const section = getSection(content, header);
        expect(section).toBeTruthy();

        phrases.forEach(phrase => {
          if (typeof phrase === 'string') {
            expect(section).toContain(phrase);
          } else {
            expect(section).toMatch(phrase);
          }
        });
      });
    });
  });

  describe('quality assurances', () => {
    test('mentions Next.js explicitly', () => {
      expect(content).toMatch(/Next\.js/);
    });

    test('avoids placeholder language', () => {
      const lower = content.toLowerCase();
      ['todo', 'fixme', 'tbd', 'lorem ipsum'].forEach(term => {
        expect(lower).not.toContain(term);
      });
    });

    test('contains balanced inline code fences', () => {
      const backticks = content.match(/`/g) || [];
      expect(backticks.length % 2).toBe(0);
    });

    test('has no trailing whitespace', () => {
      content.split('\n').forEach(line => {
        expect(line).not.toMatch(/\s+$/);
      });
    });

    test('file size remains within expected bounds', () => {
      const size = Buffer.byteLength(content, 'utf8');
      expect(size).toBeGreaterThan(400);
      expect(size).toBeLessThan(5000);
    });
  });
});