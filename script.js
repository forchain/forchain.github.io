(() => {
  'use strict';

  const output = document.querySelector('#terminal-output');
  const form = document.querySelector('#command-form');
  const input = document.querySelector('#command-input');
  const bootSequence = document.querySelector('#boot-sequence');
  const loginDate = document.querySelector('#login-date');
  const bootCommand = document.querySelector('#boot-command');
  const root = document.documentElement;

  const history = [];
  let historyIndex = 0;
  let booted = false;

  const ASCII_ART = String.raw`  ___     _   _   _______   _         ___     _____    ____
 / _ \   | | | |  |_   _|  | |       |_ _|   | ____|  |  _ \
| | | |  | | | |    | |    | |        | |    |  _|    | |_) |
| |_| |  | |_| |    | |    | |___     | |    | |___   |    /
 \___/    \___/     |_|    |_____|   |___|   |_____|  |_|_\_\ `;

  /* i18n bundles --------------------------------------------------- */
  const I18N = {
    en: {
      htmlLang: 'en',
      metaDesc: 'Tony Zhou — Developer / Architect. Human is just a brief algorithm.',
      menu: {
        whoami: 'whoami',
        experience: 'experience',
        skills: 'skills',
        projects: 'projects',
        contact: 'contact',
        clear: 'clear',
        help: 'help'
      },
      boot: {
        lastLogin: 'Last login:',
        onTty: 'on ttys001'
      },
      hint: {
        type: 'type',
        forCommands: 'for available commands',
        tab: 'TAB',
        autocomplete: 'autocomplete',
        history: 'history'
      },
      footer: {
        location: 'Shanghai · UTC+8'
      },
      contact: {
        eyebrow: 'WELCOME TO MY CYBER HOME',
        title: '<accent>10,247</accent> lines of algorithm.',
        intro: 'Hi, I\'m <strong>Tony Zhou</strong>. Please type <inline data-command="help">help</inline> to know more about me.',
        meta: {
          role: 'ROLE',
          roleValue: 'Developer / Architect',
          linkedin: 'LINKEDIN',
          linkedinHandle: '@tony-zhou',
          mail: 'MAIL',
          mailHandle: 'outlier@chainer.tech',
          github: 'GITHUB',
          githubHandle: '@forchain'
        }
      },
      whoami: {
        eyebrow: 'AI product architect · builder · outlier',
        title: 'Tony <span>Zhou</span>',
        copy: '<strong>Tony Zhou</strong>, with <strong>19 years</strong> of engineering and product experience.<br>Started from Unreal game development, crossed Web2, Web3, public-chain research and technical leadership, <strong>now turning complex systems into usable AI products.</strong>',
        meta: {
          base: 'BASE',
          baseValue: 'Shanghai · UTC+8',
          status: 'STATUS',
          statusValue: 'open to build',
          edu: 'EDUCATION',
          eduValue: 'Master of Computer Engineering',
          lang: 'LANGUAGE',
          langValue: 'Chinese / English'
        }
      },
      experience: {
        heading: '~/experience',
        items: [
          { year: '2026—now', company: '乐匠互联网', role: '全栈工程师（创业） · 链者量化策略平台' },
          { year: '2024—2025', company: '煦象 AI', role: '研发架构师 · AI 教育应用 / LangChain / Dify' },
          { year: '2023—2024', company: 'PopSocial', role: 'CTO · SocialFi 协议 / Web3 社交' },
          { year: '2021—2023', company: '光追网络', role: '技术经理 · Web3 / GameFi / Merlin Chain / Space Kill' },
          { year: '2018—2021', company: '链者科技', role: '研究员（创业） · Qitmeer 公链 / DAGfans 社区' },
          { year: '2012—2014', company: 'Epic Games China', role: 'Unreal 开发 · 游戏引擎与实时 3D' },
          { year: '2010—2012', company: '巨人网络', role: '技术经理 · 游戏研发与团队管理' }
        ]
      },
      skills: {
        heading: '~/skills.txt',
        items: [
          { n: '01', name: 'AI 工程', detail: 'LLM Agent / Dify / LangChain / FastAPI' },
          { n: '02', name: '量化交易', detail: 'backtrader / SvelteKit / strategy platforms' },
          { n: '03', name: 'Web3 / 区块链', detail: '公链架构 / 智能合约 / Solidity / Cosmos SDK' },
          { n: '04', name: '游戏开发', detail: 'Unity / Unreal / Godot / real-time 3D' },
          { n: '05', name: '全栈开发', detail: 'Python / Java / TypeScript / C# / Go' },
          { n: '06', name: '运维 / DevOps', detail: 'AWS / K8s / Cloudflare / 阿里云 / 华为云' },
          { n: '07', name: '团队与社区', detail: '国际化团队管理 / 开源社区运营' }
        ]
      },
      projects: {
        heading: '~/projects',
        tree:
`├── <accent>qitmeer/</accent>
│   ├── dag-consensus.md
│   ├── node-architecture.md
│   └── community/
├── <accent>dagfans/</accent>
│   ├── open-community
│   └── ecosystem-tools
├── <accent>chain-quant/</accent>
│   ├── strategy-engine.py
│   └── dashboard.svelte
├── <accent>ai-education/</accent>
│   ├── agent-orchestration
│   └── learning-workflows
└── <accent>gamefi-lab/</accent>
    ├── merlin-chain
    └── space-kill`
      },
      help: {
        heading: 'available commands',
        items: [
          { cmd: 'whoami', desc: 'who is Tony Zhou?' },
          { cmd: 'ls -la ~/experience', desc: 'career timeline' },
          { cmd: 'cat ~/skills.txt', desc: 'technical toolkit' },
          { cmd: 'tree ~/projects', desc: 'selected projects & ventures' },
          { cmd: 'contact', desc: 'open a communication channel' },
          { cmd: 'help', desc: 'this list' }
        ],
        unknown: 'command not found',
        unknownHint: 'type <inline data-command="help">help</inline> to see what is available.'
      },
      theme: {
        current: 'current theme',
        usage: 'usage: theme dark | theme light | theme (toggle)',
        unknown: 'unknown argument'
      },
      notFound: {
        msg: 'zsh: command not found:',
        hint: 'type <inline data-command="help">help</inline> to see what is available.'
      }
    },
    zh: {
      htmlLang: 'zh-CN',
      metaDesc: 'Tony Zhou — 开发者 / 架构师。人只是一段简短的算法。',
      menu: {
        whoami: 'whoami',
        experience: '经历',
        skills: '技能',
        projects: '项目',
        contact: '联系',
        theme: '主题',
        clear: '清屏',
        help: '帮助'
      },
      boot: {
        lastLogin: '上次登录：',
        onTty: '于 ttys001'
      },
      hint: {
        type: '输入',
        forCommands: '查看可用命令',
        tab: 'TAB',
        autocomplete: '自动补全',
        history: '历史'
      },
      footer: {
        location: '上海 · UTC+8'
      },
      contact: {
        eyebrow: 'WELCOME TO MY CYBER HOME',
        title: '<accent>10,247</accent> 行的算法。',
        intro: '你好，我是 <strong>Tony Zhou</strong>。请输入 <inline data-command="help">help</inline> 了解更多。',
        meta: {
          role: '角色',
          roleValue: '开发者 / 架构师',
          linkedin: '领英',
          linkedinHandle: '@tony-zhou',
          mail: '邮箱',
          mailHandle: 'outlier@chainer.tech',
          github: 'GitHub',
          githubHandle: '@forchain'
        }
      },
      whoami: {
        eyebrow: 'AI 产品架构师 · 创造者 · 异类',
        title: 'Tony <span>Zhou</span>',
        copy: '<strong>Tony Zhou</strong>，拥有 <strong>19 年</strong>工程与产品经验。<br>从 Unreal 游戏开发出发，穿越 Web2、Web3、公链研究与技术管理，<strong>现在把复杂系统变成可用的 AI 产品。</strong>',
        meta: {
          base: '所在地',
          baseValue: '上海 · UTC+8',
          status: '状态',
          statusValue: '开放接活',
          edu: '教育',
          eduValue: '计算机工程硕士',
          lang: '语言',
          langValue: '中文 / 英文'
        }
      },
      experience: {
        heading: '~/经历',
        items: [
          { year: '2026—至今', company: '乐匠互联网', role: '全栈工程师（创业） · 链者量化策略平台' },
          { year: '2024—2025', company: '煦象 AI', role: '研发架构师 · AI 教育应用 / LangChain / Dify' },
          { year: '2023—2024', company: 'PopSocial', role: 'CTO · SocialFi 协议 / Web3 社交' },
          { year: '2021—2023', company: '光追网络', role: '技术经理 · Web3 / GameFi / Merlin Chain / Space Kill' },
          { year: '2018—2021', company: '链者科技', role: '研究员（创业） · Qitmeer 公链 / DAGfans 社区' },
          { year: '2012—2014', company: 'Epic Games China', role: 'Unreal 开发 · 游戏引擎与实时 3D' },
          { year: '2010—2012', company: '巨人网络', role: '技术经理 · 游戏研发与团队管理' }
        ]
      },
      skills: {
        heading: '~/技能.txt',
        items: [
          { n: '01', name: 'AI 工程', detail: 'LLM Agent / Dify / LangChain / FastAPI' },
          { n: '02', name: '量化交易', detail: 'backtrader / SvelteKit / 策略平台' },
          { n: '03', name: 'Web3 / 区块链', detail: '公链架构 / 智能合约 / Solidity / Cosmos SDK' },
          { n: '04', name: '游戏开发', detail: 'Unity / Unreal / Godot / 实时 3D' },
          { n: '05', name: '全栈开发', detail: 'Python / Java / TypeScript / C# / Go' },
          { n: '06', name: '运维 / DevOps', detail: 'AWS / K8s / Cloudflare / 阿里云 / 华为云' },
          { n: '07', name: '团队与社区', detail: '国际化团队管理 / 开源社区运营' }
        ]
      },
      projects: {
        heading: '~/项目',
        tree:
`├── <accent>qitmeer/</accent>
│   ├── dag-consensus.md
│   ├── node-architecture.md
│   └── community/
├── <accent>dagfans/</accent>
│   ├── open-community
│   └── ecosystem-tools
├── <accent>chain-quant/</accent>
│   ├── strategy-engine.py
│   └── dashboard.svelte
├── <accent>ai-education/</accent>
│   ├── agent-orchestration
│   └── learning-workflows
└── <accent>gamefi-lab/</accent>
    ├── merlin-chain
    └── space-kill`
      },
      help: {
        heading: '可用命令',
        items: [
          { cmd: 'whoami', desc: 'Tony Zhou 是谁？' },
          { cmd: 'ls -la ~/experience', desc: '职业时间线' },
          { cmd: 'cat ~/skills.txt', desc: '技术工具箱' },
          { cmd: 'tree ~/projects', desc: '项目与创业' },
          { cmd: 'contact', desc: '打开沟通渠道' },
          { cmd: 'help', desc: '本帮助' }
        ],
        unknown: '未找到命令',
        unknownHint: '输入 <inline data-command="help">help</inline> 查看可用命令。'
      },
      theme: {
        current: '当前主题',
        usage: '用法：theme dark | theme light | theme（切换）',
        unknown: '未知参数'
      },
      notFound: {
        msg: 'zsh：未找到命令：',
        hint: '输入 <inline data-command="help">help</inline> 查看可用命令。'
      }
    }
  };

  /* ---------------- i18n helpers ---------------- */
  function currentLang() {
    return root.dataset.lang || 'en';
  }

  function t(path) {
    const lang = I18N[currentLang()];
    return path.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : null), lang);
  }

  function applyI18nStatic() {
    const lang = I18N[currentLang()];
    document.documentElement.lang = lang.htmlLang;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', lang.metaDesc);

    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      const value = t(key);
      if (value != null) el.textContent = value;
    });

    document.querySelectorAll('.menu-command[data-label-key]').forEach((btn) => {
      const key = btn.getAttribute('data-label-key');
      const value = t(key);
      if (value != null) btn.textContent = value;
    });

    document.querySelectorAll('.lang-btn').forEach((btn) => {
      btn.classList.toggle('is-active', btn.dataset.lang === currentLang());
    });

    document.querySelectorAll('.theme-btn').forEach((btn) => {
      btn.classList.toggle('is-active', btn.dataset.themeValue === getTheme());
    });
  }

  /* ---------------- string helpers ---------------- */
  function escapeHtml(value) {
    return value.replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character]));
  }

  function inlineCommand(command, label) {
    return `<button type="button" class="inline-command" data-command="${escapeHtml(command)}">${escapeHtml(label)}</button>`;
  }

  function compileTemplate(template) {
    return template.replace(/<inline data-command="([^"]+)">([^<]+)<\/inline>/g, (_, command, label) => inlineCommand(command, label));
  }

  function compileAccent(template) {
    return template.replace(/<accent>([^<]+)<\/accent>/g, (_, label) => `<span class="accent">${escapeHtml(label)}</span>`);
  }

  function compileTree(tree) {
    return tree.replace(/<accent>([^<]+)<\/accent>/g, (_, label) => `<span class="tree-accent">${escapeHtml(label)}</span>`);
  }

  /* ---------------- command renderers ---------------- */
  function contactMarkup() {
    const c = t('contact');
    return `
        <pre class="ascii-art">${escapeHtml(ASCII_ART)}</pre>
        <div class="hero-grid">
          <div>
            <p class="eyebrow">${escapeHtml(c.eyebrow)}</p>
            <h1 class="hero-title hero-title-banner">${compileAccent(c.title)}</h1>
            <p class="hero-copy">${compileTemplate(c.intro)}</p>
          </div>
          <div class="hero-meta">
            <div>${escapeHtml(c.meta.role)}<span class="meta-value">${escapeHtml(c.meta.roleValue)}</span></div>
            <div>${escapeHtml(c.meta.linkedin)}<a class="meta-value meta-link" href="https://www.linkedin.com/in/tony-outlier-zhou/" target="_blank" rel="noreferrer">${escapeHtml(c.meta.linkedinHandle)} ↗</a></div>
            <div>${escapeHtml(c.meta.mail)}<a class="meta-value meta-link" href="mailto:${escapeHtml(c.meta.mailHandle)}">${escapeHtml(c.meta.mailHandle)}</a></div>
            <div>${escapeHtml(c.meta.github)}<a class="meta-value meta-link" href="https://github.com/forchain" target="_blank" rel="noreferrer">${escapeHtml(c.meta.githubHandle)} ↗</a></div>
          </div>
        </div>`;
  }

  function whoamiMarkup() {
    const w = t('whoami');
    return `
        <div class="section-heading">whoami</div>
        <div class="hero-grid">
          <div>
            <p class="eyebrow">${escapeHtml(w.eyebrow)}</p>
            <h1 class="hero-title">${compileTemplate(w.title)}</h1>
            <p class="hero-copy">${compileTemplate(w.copy)}</p>
          </div>
          <div class="hero-meta">
            <div>${escapeHtml(w.meta.base)}<span class="meta-value">${escapeHtml(w.meta.baseValue)}</span></div>
            <div>${escapeHtml(w.meta.status)}<span class="meta-value">${escapeHtml(w.meta.statusValue)}</span></div>
            <div>${escapeHtml(w.meta.edu)}<span class="meta-value">${escapeHtml(w.meta.eduValue)}</span></div>
            <div>${escapeHtml(w.meta.lang)}<span class="meta-value">${escapeHtml(w.meta.langValue)}</span></div>
          </div>
        </div>`;
  }

  function experienceMarkup() {
    const e = t('experience');
    const items = e.items.map((row) => `
          <li class="experience-row"><span class="experience-year">${escapeHtml(row.year)}</span><span class="experience-company">${escapeHtml(row.company)}</span><span class="experience-role">${escapeHtml(row.role)}</span></li>`).join('');
    return `
        <div class="section-heading">${escapeHtml(e.heading)}</div>
        <ul class="experience-list">${items}
        </ul>`;
  }

  function skillsMarkup() {
    const s = t('skills');
    const items = s.items.map((row) => `
          <li class="skill-row"><span class="skill-number">${escapeHtml(row.n)}</span><span class="skill-name">${escapeHtml(row.name)}</span><span class="skill-detail">${escapeHtml(row.detail)}</span></li>`).join('');
    return `
        <div class="section-heading">${escapeHtml(s.heading)}</div>
        <ul class="skill-list">${items}
        </ul>`;
  }

  function projectsMarkup() {
    const p = t('projects');
    return `
        <div class="section-heading">${escapeHtml(p.heading)}</div>
        <pre class="tree"><span class="tree-accent">${escapeHtml(p.heading.startsWith('~/') ? p.heading : ('~/' + p.heading))}</span>
${compileTree(p.tree)}</pre>`;
  }

  function helpMarkup() {
    const h = t('help');
    const items = h.items.map((row) => `<button type="button" class="inline-command" data-command="${escapeHtml(row.cmd)}">${escapeHtml(row.cmd)}</button><span class="help-description">${escapeHtml(row.desc)}</span>`).join('');
    return `
        <div class="section-heading">${escapeHtml(h.heading)}</div>
        <div class="help-grid">${items}
        </div>`;
  }

  const COMMANDS = {
    contact: { description: 'open a communication channel', render: contactMarkup },
    whoami: { description: 'who is Tony Zhou?', render: whoamiMarkup },
    experience: { description: 'career timeline', render: experienceMarkup },
    skills: { description: 'technical toolkit', render: skillsMarkup },
    projects: { description: 'selected projects & ventures', render: projectsMarkup },
    help: { description: 'this list', render: helpMarkup }
  };

  /* ---------------- output / command handling ---------------- */
  function promptMarkup(command) {
    return `<span class="prompt-user">outlier</span><span class="prompt-at">@</span><span class="prompt-host">chainer.tech</span><span class="prompt-path">:~</span><span class="prompt-symbol">›</span> ${escapeHtml(command)}`;
  }

  function appendEntry(command, content) {
    const entry = document.createElement('article');
    entry.className = 'output-entry';
    entry.innerHTML = `<div class="output-command">${promptMarkup(command)}</div>${content}`;
    output.appendChild(entry);
    entry.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }

  function showBanner(withCommand = true) {
    if (withCommand) appendEntry('contact', contactMarkup());
    else {
      const entry = document.createElement('article');
      entry.className = 'output-entry';
      entry.innerHTML = contactMarkup();
      output.appendChild(entry);
    }
  }

  function normalizeCommand(raw) {
    return raw.trim().replace(/\s+/g, ' ');
  }

  function resolveCommand(command) {
    const normalized = normalizeCommand(command).toLowerCase();
    if (normalized === 'clear') return 'clear';
    if (normalized === 'whoami') return 'whoami';
    if (normalized === 'help') return 'help';
    if (normalized === 'contact' || normalized === 'banner') return 'contact';
    if (normalized.startsWith('theme')) return 'theme';
    if (normalized === 'cat ~/skills.txt' || normalized === 'cat skills.txt') return 'skills';
    if (normalized === 'tree ~/projects' || normalized === 'tree projects') return 'projects';
    if (normalized === 'ls -la ~/experience' || normalized === 'ls -l ~/experience' || normalized === 'ls ~/experience') return 'experience';
    return null;
  }

  function getTheme() {
    return root.dataset.theme || 'dark';
  }

  function setTheme(theme) {
    const next = theme === 'light' ? 'light' : 'dark';
    root.dataset.theme = next;
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.content = next === 'light' ? '#f4f6f4' : '#070a08';
    }
  }

  function toggleTheme() {
    setTheme(getTheme() === 'dark' ? 'light' : 'dark');
  }

  function themeDescription() {
    const desc = t('theme');
    return `${desc.current}: ${getTheme()}. ${desc.usage}`;
  }

  function execute(rawCommand, record = true) {
    const command = normalizeCommand(rawCommand);
    if (!command) return;
    if (record) {
      history.push(command);
      historyIndex = history.length;
    }

    const resolved = resolveCommand(command);
    if (resolved === 'clear') {
      output.innerHTML = '';
      return;
    }
    if (resolved === 'theme') {
      const args = command.split(' ').slice(1).filter(Boolean);
      const arg = args[0] && args[0].toLowerCase();
      const unknown = t('theme.unknown');
      if (arg === 'dark' || arg === 'light') {
        setTheme(arg);
      } else if (args.length === 0) {
        toggleTheme();
      } else {
        appendEntry(command, `<p class="error-line">theme: ${escapeHtml(unknown)} &quot;${escapeHtml(args[0])}&quot;</p><p class="dim-line">${escapeHtml(t('theme.usage'))}</p>`);
        return;
      }
      appendEntry(command, `<p class="dim-line">${escapeHtml(themeDescription())}</p>`);
      return;
    }
    if (resolved === 'contact') {
      appendEntry(command, contactMarkup());
      return;
    }
    if (resolved && COMMANDS[resolved]) {
      appendEntry(command, COMMANDS[resolved].render());
      return;
    }
    const nf = t('notFound');
    appendEntry(command, `<p class="error-line">${escapeHtml(nf.msg)} ${escapeHtml(command.split(' ')[0])}</p><p class="dim-line">${compileTemplate(nf.hint)}</p>`);
  }

  /* ---------------- typewriter / boot ---------------- */
  function typeWriter(element, text, speed = 45) {
    return new Promise((resolve) => {
      let index = 0;
      element.textContent = '';
      function step() {
        if (index < text.length) {
          element.textContent += text.charAt(index);
          index += 1;
          window.setTimeout(step, speed);
        } else {
          resolve();
        }
      }
      step();
    });
  }

  function boot() {
    applyI18nStatic();
    const now = new Date();
    loginDate.textContent = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    typeWriter(bootCommand, './resume.sh', 40).then(() => {
      window.setTimeout(() => {
        bootSequence.classList.add('is-complete');
        showBanner(false);
        booted = true;
        input.focus();
      }, 600);
    });
  }

  /* ---------------- events ---------------- */
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    execute(input.value);
    input.value = '';
  });

  input.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (history.length) {
        historyIndex = Math.max(0, historyIndex - 1);
        input.value = history[historyIndex] || '';
      }
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      historyIndex = Math.min(history.length, historyIndex + 1);
      input.value = history[historyIndex] || '';
    } else if (event.key === 'Tab') {
      event.preventDefault();
      const partial = input.value.trim().toLowerCase();
      const options = ['whoami', 'ls -la ~/experience', 'cat ~/skills.txt', 'tree ~/projects', 'contact', 'help', 'clear'];
      const match = options.find((option) => option.startsWith(partial) && option !== partial);
      if (match) input.value = match;
    }
  });

  const menuToggle = document.querySelector('.menu-toggle');
  if (menuToggle) {
    menuToggle.addEventListener('click', (event) => {
      event.stopPropagation();
      const menu = menuToggle.closest('.command-menu');
      const isOpen = menu.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  document.querySelectorAll('.lang-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      root.dataset.lang = btn.dataset.lang;
      applyI18nStatic();
      // re-render current output with new language
      output.innerHTML = '';
      const entry = document.createElement('article');
      entry.className = 'output-entry';
      entry.innerHTML = contactMarkup();
      output.appendChild(entry);
    });
  });

  document.querySelectorAll('.theme-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const value = btn.dataset.themeValue;
      if (value === 'dark' || value === 'light') {
        setTheme(value);
        applyI18nStatic();
      }
    });
  });

  document.addEventListener('click', (event) => {
    const commandButton = event.target.closest('[data-command]');
    if (commandButton) {
      execute(commandButton.dataset.command);
      input.focus();
      const menu = commandButton.closest('.command-menu');
      if (menu) {
        menu.classList.remove('open');
        menu.querySelector('.menu-toggle')?.setAttribute('aria-expanded', 'false');
      }
    } else if (booted && !event.target.closest('a, button, .lang-switch, .theme-switch')) {
      input.focus();
    }

    if (!event.target.closest('.command-menu')) {
      document.querySelectorAll('.command-menu.open').forEach((menu) => {
        menu.classList.remove('open');
        menu.querySelector('.menu-toggle')?.setAttribute('aria-expanded', 'false');
      });
    }
  });

  boot();
})();