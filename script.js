(() => {
  'use strict';

  const output = document.querySelector('#terminal-output');
  const form = document.querySelector('#command-form');
  const input = document.querySelector('#command-input');
  const bootSequence = document.querySelector('#boot-sequence');
  const loginDate = document.querySelector('#login-date');

  const history = [];
  let historyIndex = 0;
  let booted = false;

  const ASCII_ART = String.raw`  ______                  _                 _   ____        _   _ _           _
 / ____/___  ____  _____(_)___  ____      | | |  _ \ _   _| |_| (_) ___ _ __| |
/ /_  / __ \/ __ \/ ___/ / __ \/ __ \     | | | |_) | | | | __| | |/ _ \ '__| |
/ __/ / /_/ / / / (__  ) / / / / /_/ /     | | |  __/| |_| | |_| | |  __/ |  |_|
/_/    \____/_/ /_/____/_/_/ /_/\____/      |_| |_|    \__, |\__|_|_|\___|_|  (_)
                                                       |___/`;

  const COMMANDS = {
    help: {
      description: 'show available commands',
      render: () => `
        <div class="section-heading">available commands</div>
        <div class="help-grid">
          <span class="help-command">whoami</span><span class="help-description">who is Tony Outlier?</span>
          <span class="help-command">ls -la ~/experience</span><span class="help-description">career timeline</span>
          <span class="help-command">cat ~/skills.txt</span><span class="help-description">technical toolkit</span>
          <span class="help-command">tree ~/projects</span><span class="help-description">selected projects &amp; ventures</span>
          <span class="help-command">contact</span><span class="help-description">open a communication channel</span>
          <span class="help-command">banner</span><span class="help-description">replay the welcome screen</span>
          <span class="help-command">clear</span><span class="help-description">clear terminal output</span>
          <span class="help-command">help</span><span class="help-description">this list</span>
        </div>`
    },
    whoami: {
      description: 'show profile',
      render: () => `
        <div class="section-heading">whoami</div>
        <div class="hero-grid">
          <div>
            <p class="eyebrow">AI product architect · builder · outlier</p>
            <h1 class="hero-title">Tony <span>Outlier</span></h1>
            <p class="hero-copy">周黄金，<strong>41</strong> 岁，拥有 <strong>19 年</strong>工程与产品经验。<br>从 Unreal 游戏开发出发，穿越 Web2、Web3、公链研究与技术管理，<strong>现在把复杂系统变成可用的 AI 产品。</strong></p>
          </div>
          <div class="hero-meta">
            <div>BASE<span class="meta-value">上海 · UTC+8</span></div>
            <div>STATUS<span class="meta-value">open to build</span></div>
            <div>EDUCATION<span class="meta-value">CS + AI / parallel</span></div>
            <div>GITHUB<span class="meta-value">@forchain</span></div>
          </div>
        </div>`
    },
    experience: {
      description: 'list career experience',
      render: () => `
        <div class="section-heading">~/experience</div>
        <ul class="experience-list">
          <li class="experience-row"><span class="experience-year">2023—now</span><span class="experience-company">煦象 AI</span><span class="experience-role">产品研发架构师 · AI 教育应用 / LangChain / Dify</span></li>
          <li class="experience-row"><span class="experience-year">2021—2023</span><span class="experience-company">光追网络</span><span class="experience-role">技术经理 · Web3 / GameFi / Merlin Chain / Space Kill / PopSocial</span></li>
          <li class="experience-row"><span class="experience-year">2018—2021</span><span class="experience-company">链者科技</span><span class="experience-role">联合创始人 · Qitmeer 公链 / DAGfans 社区</span></li>
          <li class="experience-row"><span class="experience-year">2015—2018</span><span class="experience-company">巨人网络</span><span class="experience-role">技术经理 · 游戏研发与团队管理</span></li>
          <li class="experience-row"><span class="experience-year">2011—2015</span><span class="experience-company">Epic Games China</span><span class="experience-role">Unreal 开发 · 游戏引擎与实时 3D</span></li>
          <li class="experience-row"><span class="experience-year">2009—now</span><span class="experience-company">乐匠互联网</span><span class="experience-role">联合创始人 · 链者量化策略平台</span></li>
        </ul>`
    },
    skills: {
      description: 'cat technical skills',
      render: () => `
        <div class="section-heading">~/skills.txt</div>
        <ul class="skill-list">
          <li class="skill-row"><span class="skill-number">01</span><span class="skill-name">AI 工程</span><span class="skill-detail">LLM Agent / Dify / LangChain / FastAPI</span></li>
          <li class="skill-row"><span class="skill-number">02</span><span class="skill-name">量化交易</span><span class="skill-detail">backtrader / SvelteKit / strategy platforms</span></li>
          <li class="skill-row"><span class="skill-number">03</span><span class="skill-name">Web3 / 区块链</span><span class="skill-detail">公链架构 / 智能合约 / Solidity / Cosmos SDK</span></li>
          <li class="skill-row"><span class="skill-number">04</span><span class="skill-name">游戏开发</span><span class="skill-detail">Unity / Unreal / Godot / real-time 3D</span></li>
          <li class="skill-row"><span class="skill-number">05</span><span class="skill-name">全栈开发</span><span class="skill-detail">Python / Java / TypeScript / C# / Go</span></li>
          <li class="skill-row"><span class="skill-number">06</span><span class="skill-name">运维 / DevOps</span><span class="skill-detail">AWS / K8s / Cloudflare / 阿里云 / 华为云</span></li>
          <li class="skill-row"><span class="skill-number">07</span><span class="skill-name">团队与社区</span><span class="skill-detail">国际化团队管理 / 开源社区运营</span></li>
        </ul>`
    },
    projects: {
      description: 'show selected projects',
      render: () => `
        <div class="section-heading">~/projects</div>
        <pre class="tree"><span class="tree-accent">~/projects</span>
├── <span class="tree-accent">qitmeer/</span>
│   ├── dag-consensus.md
│   ├── node-architecture.md
│   └── community/
├── <span class="tree-accent">dagfans/</span>
│   ├── open-community
│   └── ecosystem-tools
├── <span class="tree-accent">chain-quant/</span>
│   ├── strategy-engine.py
│   └── dashboard.svelte
├── <span class="tree-accent">ai-education/</span>
│   ├── agent-orchestration
│   └── learning-workflows
└── <span class="tree-accent">gamefi-lab/</span>
    ├── merlin-chain
    └── space-kill</pre>`
    },
    contact: {
      description: 'show contact channels',
      render: () => `
        <div class="section-heading">contact</div>
        <ul class="contact-list">
          <li><span class="contact-key">github</span><a href="https://github.com/forchain" target="_blank" rel="noreferrer">github.com/forchain ↗</a></li>
          <li><span class="contact-key">email</span><a href="mailto:tony@forchain.io">tony@forchain.io</a><span class="dim-line">&nbsp; (replace me)</span></li>
          <li><span class="contact-key">location</span><span>Shanghai, China · open to meaningful problems</span></li>
        </ul>`
    }
  };

  function promptMarkup(command) {
    return `<span class="prompt-user">tony</span><span class="prompt-at">@</span><span class="prompt-host">forchain</span><span class="prompt-path">:~</span><span class="prompt-symbol">›</span> ${escapeHtml(command)}`;
  }

  function escapeHtml(value) {
    return value.replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character]));
  }

  function appendEntry(command, content) {
    const entry = document.createElement('article');
    entry.className = 'output-entry';
    entry.innerHTML = `<div class="output-command">${promptMarkup(command)}</div>${content}`;
    output.appendChild(entry);
    entry.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }

  function bannerMarkup() {
    return `<pre class="ascii-art">${escapeHtml(ASCII_ART)}</pre>
      <div class="hero-grid">
        <div>
          <p class="eyebrow">welcome to the source</p>
          <h1 class="hero-title">Build <span>the improbable.</span></h1>
          <p class="hero-copy">你好，我是 <strong>周黄金 / Tony Outlier</strong>。<br>这不是一个普通的简历页面——输入命令，探索我的经历、能力与正在构建的东西。</p>
        </div>
        <div class="hero-meta"><div>ROLE<span class="meta-value">AI architect</span></div><div>EXP<span class="meta-value">19 years</span></div><div>BASE<span class="meta-value">Shanghai</span></div><div>MODE<span class="meta-value">terminal / online</span></div></div>
      </div>`;
  }

  function showBanner(withCommand = true) {
    if (withCommand) appendEntry('banner', bannerMarkup());
    else {
      const entry = document.createElement('article');
      entry.className = 'output-entry';
      entry.innerHTML = bannerMarkup();
      output.appendChild(entry);
    }
  }

  function normalizeCommand(raw) {
    return raw.trim().replace(/\s+/g, ' ');
  }

  function resolveCommand(command) {
    const normalized = normalizeCommand(command).toLowerCase();
    if (normalized === 'clear') return 'clear';
    if (normalized === 'banner') return 'banner';
    if (normalized === 'whoami') return 'whoami';
    if (normalized === 'help') return 'help';
    if (normalized === 'contact') return 'contact';
    if (normalized === 'cat ~/skills.txt' || normalized === 'cat skills.txt') return 'skills';
    if (normalized === 'tree ~/projects' || normalized === 'tree projects') return 'projects';
    if (normalized === 'ls -la ~/experience' || normalized === 'ls -l ~/experience' || normalized === 'ls ~/experience') return 'experience';
    return null;
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
    if (resolved === 'banner') {
      appendEntry(command, bannerMarkup());
      return;
    }
    if (resolved && COMMANDS[resolved]) {
      appendEntry(command, COMMANDS[resolved].render());
      return;
    }
    appendEntry(command, `<p class="error-line">zsh: command not found: ${escapeHtml(command.split(' ')[0])}</p><p class="dim-line">type <button type="button" class="inline-command" data-command="help">help</button> to see what is available.</p>`);
  }

  function boot() {
    const now = new Date();
    loginDate.textContent = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    window.setTimeout(() => {
      bootSequence.classList.add('is-complete');
      showBanner(false);
      booted = true;
      input.focus();
    }, 1050);
  }

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
      const options = ['whoami', 'ls -la ~/experience', 'cat ~/skills.txt', 'tree ~/projects', 'contact', 'help', 'clear', 'banner'];
      const match = options.find((option) => option.startsWith(partial) && option !== partial);
      if (match) input.value = match;
    }
  });

  document.addEventListener('click', (event) => {
    const commandButton = event.target.closest('[data-command]');
    if (commandButton) {
      execute(commandButton.dataset.command);
      input.focus();
    } else if (booted && !event.target.closest('a, button')) {
      input.focus();
    }
  });

  boot();
})();
