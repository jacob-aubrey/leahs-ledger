'use strict';

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const esc = escapeHtml;
const icons = {
  snapshot:'<rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="11" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="18" width="7" height="3" rx="1"/>',
  transactions:'<path d="M4 7h15m-4-4 4 4-4 4M20 17H5m4-4-4 4 4 4"/>',
  documents:'<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6M8 13h8M8 17h5"/>',
  reports:'<path d="M5 3h10l4 4v14H5zM14 3v5h5M9 16v-3m3 3v-6m3 6v-4"/>',
  settings:'<path d="m10 3-.6 2.1-2 .9-2.1-.5-2 3.5 1.5 1.6v2.8L3.3 15l2 3.5 2.1-.5 2 .9.6 2.1h4l.6-2.1 2-.9 2.1.5 2-3.5-1.5-1.6v-2.8L20.7 9l-2-3.5-2.1.5-2-.9L14 3z"/><circle cx="12" cy="12" r="3"/>',
  help:'<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 4.5 1.5c-1 1-2 1-2 3M12 17h.01"/>',
  lock:'<rect x="5" y="10" width="14" height="11" rx="3"/><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3"/>',
  logout:'<path d="M9 5H4v14h5M12 12h9m-4-4 4 4-4 4"/>',
  search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  arrowUp:'<path d="M6 18 18 6M6 6h12v12"/>',
  arrowDown:'<path d="M6 6 18 18M6 18h12V6"/>',
  arrowRight:'<path d="M5 12h14m-5-5 5 5-5 5"/>',
  wallet:'<path d="M20 8V6a2 2 0 0 0-2-2H6a3 3 0 0 0 0 6h14v10H6a3 3 0 0 1-3-3V7M20 12h-5v4h5"/>',
  sparkles:'<path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5zM21 3v4M19 5h4"/>',
  calendar:'<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M7 3v4m10-4v4M3 11h18M7 15h2m4 0h2m-8 3h2"/>',
  upload:'<path d="M12 16V3M7 8l5-5 5 5M4 15v6h16v-6"/>',
  download:'<path d="M12 3v13m-5-5 5 5 5-5M4 16v5h16v-5"/>',
  receipt:'<path d="m5 3 3 2 4-2 4 2 3-2v18l-3-2-4 2-4-2-3 2zM9 9h6M9 13h6M9 16h3"/>',
  crown:'<path d="m3 6 4 5 5-7 5 7 4-5-3 12H6zM7 21h10"/>',
  bag:'<path d="M5 7h14l2 14H3zM8 8V6a4 4 0 0 1 8 0v2"/>',
  check:'<path d="m5 12 4 4L19 6"/>',
  close:'<path d="m6 6 12 12M18 6 6 18"/>',
  info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7h.01"/>',
  alert:'<path d="m12 3 10 18H2zM12 9v5M12 17h.01"/>',
  paperclip:'<path d="m8 13 7-7a3 3 0 0 1 4 4L9 20a5 5 0 0 1-7-7L13 2M5 14l9-9"/>',
  folder:'<path d="M3 7V4h7l3 3h8v14H3zM3 10h18"/>',
  eye:'<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  trash:'<path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7m4-7v7"/>',
  history:'<path d="M3 10a9 9 0 1 1 1 7M3 4v6h6M12 7v5l3 2"/>',
  heart:'<path d="M12 21 3.5 12.5A5.5 5.5 0 0 1 12 5a5.5 5.5 0 0 1 8.5 7.5z"/>',
  chart:'<path d="M3 3v18h18M7 15l5-6 4 3 5-7"/>',
};
const icon = (name, cls = '') => `<svg class="icon ${cls}" viewBox="0 0 24 24" aria-hidden="true">${icons[name] || icons.documents}</svg>`;
const actionTips = {'close-modal':'Close this dialog. Unsaved changes will be discarded.','add-income':'Record a payment you received.','add-expense':'Record a business purchase and attach its receipt.','save-settings':'Save the name used in your workspace and reports.','apply-range':'Update the snapshot using both selected dates.','confirm-upload':'Copy these original files into your ledger.','confirm-exit':'Save a local recovery backup and stop the app.','confirm-restore':'Replace this PC’s ledger with the selected backup after saving a recovery copy.'};
const button = (label, action, iconName, cls = '', tip = '', extra = '') => `<button type="button" class="button ${cls}" data-action="${action}" data-tip="${esc(tip || actionTips[action] || label)}" ${extra}>${iconName ? icon(iconName) : ''}${label}</button>`;
const help = text => `<button type="button" class="help-dot" data-tip="${esc(text)}" aria-label="${esc(text)}">?</button>`;
const fieldLabel = (label, id, tip) => `<label for="${id}">${label} ${tip ? help(tip) : ''}</label>`;
const info = (text, warning = false) => `<div class="info-box ${warning ? 'warning' : ''}">${icon(warning ? 'alert' : 'info')}<p>${text}</p></div>`;
const currency = cents => new Intl.NumberFormat('en-US', {style:'currency', currency:'USD'}).format((cents || 0)/100);
const localISO = value => { const d = value || new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; };
const today = () => localISO(new Date());
const parseISO = text => new Date(`${text}T12:00:00`);
const shortDate = text => parseISO(text).toLocaleDateString('en-US',{month:'short',day:'numeric'});
const longDate = text => parseISO(text).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});
const amountBusiness = entry => Math.floor((entry.amount_cents * Math.round(entry.business_percent * 100) + 5000) / 10000);
const readFile = file => new Promise((resolve,reject) => {const reader = new FileReader();reader.onload=()=>resolve(String(reader.result).split(',')[1]);reader.onerror=()=>reject(new Error('This file could not be read. Please choose it again.'));reader.readAsDataURL(file);});
let token = new URLSearchParams(location.hash.slice(1)).get('token') || sessionStorage.getItem('ledger-token') || '';
if (token) sessionStorage.setItem('ledger-token',token);
if(location.hash.includes('token=')) history.replaceState(null,'',location.pathname);
let state, page = 'snapshot', range = 'ytd', customRange = {start:today(),end:today()};
let filters = {search:'', type:'all', source:'all', attention:false, year:'all'};
let documentFilter = {search:'', kind:'all', year:'all', unlinked:false};
let reportOptions = {year:new Date().getFullYear(),period:'year',start:`${new Date().getFullYear()}-01-01`,end:`${new Date().getFullYear()}-12-31`};
let selectedDocuments=[], editorId=null, uploadContext='documents', importSession=null, saveInProgress=false;
const modal = $('#modal');

async function api(path, data) {
  const response=await fetch(path,{method:data === undefined?'GET':'POST',headers:{'X-Ledger-Token':token,...(data === undefined?{}:{'Content-Type':'application/json'})},body:data === undefined?undefined:JSON.stringify(data)});
  const result=await response.json();
  if(!response.ok) throw new Error(result.error || 'Something went wrong. Please try again.');
  return result;
}

async function refresh(render=true) { state=await api('/api/state'); if(render) renderPage(); }
function toast(message, error=false, action=null) {
  const el=document.createElement('div');el.className=`toast ${error?'error':''}`;
  el.innerHTML=`${icon(error?'alert':'check')}<span>${esc(message)}</span>`;
  if(action){const b=document.createElement('button');b.textContent=action.label;b.addEventListener('click',async()=>{try{await action.run();el.remove();}catch(e){toast(e.message,true);}});el.append(b);}
  $('#toasts').append(el);setTimeout(()=>el.remove(),action?15000:error?10000:5500);
}

function rangeDates(which=range) {
  const now = new Date(); let start, end=localISO(now);
  if(which==='ytd') start=`${now.getFullYear()}-01-01`;
  if(which==='month') start=localISO(new Date(now.getFullYear(),now.getMonth(),1));
  if(which==='quarter') start=localISO(new Date(now.getFullYear(),Math.floor(now.getMonth()/3)*3,1));
  if(which==='lastmonth'){start=localISO(new Date(now.getFullYear(),now.getMonth()-1,1));end=localISO(new Date(now.getFullYear(),now.getMonth(),0));}
  if(which==='week'){const date=new Date(now);date.setDate(date.getDate()-6);start=localISO(date);}
  if(which==='custom')return {...customRange};
  return {start,end};
}

function periodEntries(dates) {return state.transactions.filter(e=>e.date>=dates.start&&e.date<=dates.end);}
function totals(entries) {
  const t={gross:0,fees:0,refunds:0,purchases:0,business:0,attention:0};
  entries.forEach(e=>{if(e.type==='income'){t.gross+=e.amount_cents;t.fees+=e.fees_cents;t.refunds+=e.refunds_cents;}else{t.purchases+=e.amount_cents;t.business+=amountBusiness(e);}if(e.attention.length)t.attention++;});
  t.earnings=t.gross-t.refunds;t.spending=t.business+t.fees;t.net=t.earnings-t.spending;t.deposits=t.earnings-t.fees;
  return t;
}

function sourceBadge(name, type='income') {
  if(type==='expense')return `<span class="source-badge expense">${icon('receipt')}</span>`;
  if(name.includes('Amazon'))return '<span class="source-badge amazon">a</span>';
  if(name.includes('ShopMy'))return `<span class="source-badge shopmy">${icon('bag')}</span>`;
  if(name.includes('Royals')||name.includes('Olivia'))return `<span class="source-badge">${icon('crown')}</span>`;
  return `<span class="source-badge">${icon('wallet')}</span>`;
}

function empty(title, text, iconName='sparkles', action='', compact=false) {
  return `<div class="empty-state ${compact?'compact':''}"><div class="empty-icon">${icon(iconName)}</div><h3>${title}</h3><p>${text}</p>${action}</div>`;
}

function renderNavigation() {
  const pages=[['snapshot','Snapshot','snapshot','See your earnings, spending, and net income for a chosen period.'],['transactions','Transactions','transactions','Add, review, and edit money coming in and going out.'],['documents','Documents','documents','Keep receipts, screenshots, bank statements, and tax forms together.'],['reports','Reports','reports','Preview and export quarterly, yearly, or custom reports.']];
  $('#navigation').innerHTML=pages.map(([id,label,ico,tip])=>`<button class="nav-item ${page===id?'active':''}" data-page="${id}" aria-label="${label}" data-tip="${tip}" ${page===id?'aria-current="page"':''}>${icon(ico)}<span>${label}</span></button>`).join('');
  $('#page-name').textContent=pages.find(p=>p[0]===page)?.[1]||'Snapshot';
  $('#avatar').textContent=(state.settings.owner||'Leah').slice(0,1).toUpperCase();
}

function renderPage() {
  hideTooltip();renderNavigation();
  const renderers={snapshot:renderSnapshot,transactions:renderTransactions,documents:renderDocuments,reports:renderReports};
  $('#content').innerHTML=(renderers[page]||renderSnapshot)();
  $$('[data-icon]').forEach(e=>{e.innerHTML=icon(e.dataset.icon);});
  installFieldTooltips();
  installDropZones();
}

function heading(eyebrow,title,subtitle,actions='') {
  return `<div class="page-heading"><div><div class="eyebrow">${eyebrow}</div><h1>${title}</h1><p>${subtitle}</p></div>${actions?`<div class="heading-actions">${actions}</div>`:''}</div>`;
}

function renderSnapshot() {
  const dates=rangeDates(), entries=periodEntries(dates), t=totals(entries);
  const ranges=[['ytd','Year to date'],['month','This month'],['quarter','This quarter'],['lastmonth','Last month'],['week','Past 7 days'],['custom','Custom dates']];
  const actions=button('Add expense','add-expense','plus','','Record a purchase, its business purpose, and any receipts.')+button('Add income','add-income','plus','primary','Record earnings received from a platform or campaign.');
  const stat=(label,value,ico,cls,caption,tip,decoration)=>`<section class="stat ${cls}" aria-label="${label}: ${currency(value)}"><div class="stat-header"><span>${label} ${help(tip)}</span><span class="stat-icon">${icon(ico)}</span></div><div class="stat-value">${currency(value)}</div><div class="stat-caption">${icon('info')}${caption}</div><span class="stat-decoration">${decoration}</span></section>`;
  const recent=[...entries].sort((a,b)=>b.date.localeCompare(a.date)||b.created_at.localeCompare(a.created_at)).slice(0,4);
  const sources=[...new Set([...state.sources.filter(s=>s!=='Other'),...entries.filter(e=>e.type==='income').map(e=>e.source||'Other')])];
  const sourceTotals=Object.fromEntries(sources.map(s=>[s,entries.filter(e=>e.type==='income'&&(e.source||'Other')===s).reduce((sum,e)=>sum+e.amount_cents-e.refunds_cents,0)]));
  return heading(`HELLO, ${esc((state.settings.owner||'Leah').toUpperCase())} ✧`,'Financial snapshot','Earnings, spending, and net income for the selected period.',actions)+
    `<div class="range-bar"><div class="range-pills" aria-label="Snapshot time period">${ranges.map(([id,label])=>`<button type="button" class="range-pill ${id===range?'active':''}" data-range="${id}" aria-pressed="${id===range}" data-tip="${esc(id==='ytd'?'January 1 through today.':id==='quarter'?'The current calendar quarter, through today.':id==='month'?'The first of this month through today.':id==='lastmonth'?'The complete previous calendar month.':id==='week'?'Today and the six preceding days.':'Choose any date range, including a single day or a past year. You can also select full years in Reports.')}">${label}</button>`).join('')}</div><div class="date-range">${icon('calendar')}${longDate(dates.start)} — ${longDate(dates.end)}</div></div>`+
    `<div class="stats">${stat('Earnings',t.earnings,'arrowUp','','Gross income, less refunds','Gross income received during the selected dates, minus recorded refunds. Platform fees are included under Spending.','↗')}${stat('Spending',t.spending,'bag','peach','Business share of purchases + fees','The recorded business-use portion of purchases, plus fees withheld from income. Personal-use portions are excluded. These records do not establish tax deductibility.','↘')}${stat('Net income',t.net,'sparkles','sage','Before tax adjustments','Earnings minus Spending. Purchases marked for preparer review are included at their recorded business-use percentage. This is a bookkeeping result before tax adjustments.','✧')}</div>`+
    `<div class="dashboard-middle"><section class="panel panel-padding"><div class="panel-head"><div><h2>Earnings and spending</h2><p>Activity over the selected period.</p></div><div class="legend"><span><i></i>Earnings</span><span><i></i>Spending</span></div></div>${chart(entries,dates)}<div class="chart-footer"><span>${icon('info')}Uses the selected date range.</span><span>USD · Before tax adjustments</span></div></section><section class="quick-panel"><span class="quick-star">✧</span><span class="quick-orbit"></span><div class="eyebrow">QUICK ACTIONS</div><h2>Add income<br>or documents.</h2><p>Record a payment or save supporting documents.</p><div class="quick-buttons">${quickButton('Add a receipt','upload-documents','receipt','Save an original receipt, screenshot, or other document.')}${quickButton('Add income','add-income','arrowUp','Add a payment you have received, with direct deposit preselected.')}</div></section></div>`+
    `<div class="dashboard-bottom"><section class="panel recent-panel"><div class="panel-head"><div><h2>Recent transactions</h2><p>Most recent entries in this period.</p></div>${button('See all','all-transactions','arrowRight','ghost','Open all transactions for these same dates.')}</div>${recent.length?recent.map(e=>`<button class="transaction-row" data-edit="${e.id}" data-tip="Review or edit this ${e.type==='income'?'payment':'purchase'}.">${sourceBadge(e.source,e.type)}<span class="row-details"><strong>${esc(e.name)}</strong><small>${esc(e.type==='income'?e.source||'Income':e.category||'Choose a category')} · ${shortDate(e.date)}</small></span><span class="row-amount ${e.type}">${e.type==='income'?'+':'−'}${currency(e.type==='income'?e.amount_cents-e.fees_cents-e.refunds_cents:e.amount_cents)}</span></button>`).join(''):empty('No transactions in this period','Add income or an expense to get started.','heart',button('Add your first entry','add-income','plus','ghost'),true)}</section><section class="panel panel-padding"><div class="panel-head"><div><h2>Income by source</h2><p>Earnings by source, after refunds.</p></div>${icon('sparkles')}</div><div class="sources-list">${sources.slice(0,5).map(s=>`<div class="source-row">${sourceBadge(s)}<div class="row-details"><strong>${esc(s.replace(' · Royals',''))}</strong><div class="source-progress"><span style="width:${t.earnings?Math.max(0,Math.min(100,sourceTotals[s]/t.earnings*100)):0}%"></span></div></div><span class="source-total">${currency(sourceTotals[s])}</span></div>`).join('')}</div></section></div>`+
    (t.attention?`<div class="attention-strip">${icon('alert')}<span><strong>${t.attention} ${t.attention===1?'entry needs':'entries need'} attention.</strong> A missing receipt or a question for your preparer.</span>${button('Review entries','attention','arrowRight','ghost','Review entries needing attention in this date range.')}</div>`:'')+
    (t.purchases!==t.business?`<p class="form-note">Total purchases: ${currency(t.purchases)}. Recorded business-use portion: ${currency(t.business)}.</p>`:'');
}

function quickButton(label,action,ico,tip){return `<button class="button" type="button" data-action="${action}" data-tip="${tip}"><span>${icon(ico)}${label}</span>${icon('arrowRight')}</button>`;}

function chart(entries,dates) {
  const first=parseISO(dates.start),last=parseISO(dates.end),days=Math.round((last-first)/86400000)+1;
  const byMonth=days>62;let buckets=[];
  if(byMonth){let d=new Date(first.getFullYear(),first.getMonth(),1);while(d<=last&&buckets.length<120){buckets.push({key:localISO(d).slice(0,7),label:d.toLocaleDateString('en-US',{month:'short',...(days>366?{year:'2-digit'}:{})}),earnings:0,spending:0});d.setMonth(d.getMonth()+1);}}
  else{for(let i=0;i<days;i++){let d=new Date(first);d.setDate(d.getDate()+i);buckets.push({key:localISO(d),label:days<=8?d.toLocaleDateString('en-US',{weekday:'short'}):`${d.getMonth()+1}/${d.getDate()}`,earnings:0,spending:0});}}
  // Bound long custom ranges by combining adjacent periods rather than clipping data.
  if(byMonth&&buckets.length===120&&last>parseISO(buckets.at(-1).key+'-01')){
    buckets=[];for(let y=first.getFullYear();y<=last.getFullYear();y++)buckets.push({key:String(y),label:String(y),earnings:0,spending:0});
  }
  const lookup=new Map(buckets.map(b=>[b.key,b]));
  entries.forEach(e=>{let b=lookup.get(e.date.slice(0,buckets[0]?.key.length||10));if(!b)return;if(e.type==='income'){b.earnings+=e.amount_cents-e.refunds_cents;b.spending+=e.fees_cents;}else b.spending+=amountBusiness(e);});
  if(buckets.length>12){const size=Math.ceil(buckets.length/12);let combined=[];for(let i=0;i<buckets.length;i+=size){let part=buckets.slice(i,i+size);combined.push({label:part[0].label,earnings:part.reduce((s,b)=>s+b.earnings,0),spending:part.reduce((s,b)=>s+b.spending,0)});}buckets=combined;}
  const width=560,height=190,left=47,bottom=162,top=14,plotWidth=width-left-7;
  let maximum=Math.max(10000,...buckets.flatMap(b=>[b.earnings,b.spending]));maximum=Math.ceil(maximum/10000)*10000;
  let svg=`<svg class="chart" viewBox="0 0 ${width} ${height}" role="img" aria-label="Earnings and spending over the selected period"><title>Earnings and spending from ${dates.start} to ${dates.end}</title>`;
  for(let i=0;i<=3;i++){const y=top+(bottom-top)*i/3;const value=maximum*(3-i)/3;svg+=`<line x1="${left}" y1="${y}" x2="${width}" y2="${y}" stroke="#e9e9df" stroke-dasharray="3 4"/><text x="${left-9}" y="${y+3}" text-anchor="end">${value>=100000?'$'+(value/100000).toFixed(value%100000?1:0)+'k':'$'+Math.round(value/100)}</text>`;}
  const slot=plotWidth/Math.max(1,buckets.length),barWidth=Math.min(15,slot*.23);
  buckets.forEach((b,i)=>{const x=left+slot*(i+.5);const earnHeight=b.earnings/maximum*(bottom-top),spendHeight=b.spending/maximum*(bottom-top);svg+=`<rect x="${x-barWidth-2}" y="${bottom-earnHeight}" width="${barWidth}" height="${earnHeight}" rx="3" fill="#95ac8e"><title>${esc(b.label)} earnings: ${currency(b.earnings)}</title></rect><rect x="${x+2}" y="${bottom-spendHeight}" width="${barWidth}" height="${spendHeight}" rx="3" fill="#c4a78d"><title>${esc(b.label)} spending: ${currency(b.spending)}</title></rect><text x="${x}" y="${bottom+20}" text-anchor="middle">${esc(b.label)}</text>`;});
  if(!entries.length)svg+=`<text class="empty-chart-text" x="${(width+left)/2}" y="85" text-anchor="middle">No activity in this period</text><text x="${(width+left)/2}" y="105" text-anchor="middle">Add income or expenses to see the chart.</text>`;
  return svg+'</svg>';
}

function filteredTransactions(){
  const query=filters.search.toLowerCase().trim();
  return state.transactions.filter(e=>(filters.type==='all'||e.type===filters.type)&&(filters.source==='all'||e.source===filters.source)&&(!filters.attention||e.attention.length)&&(filters.year==='all'||e.date.startsWith(filters.year))&&(!filters.dates||(e.date>=filters.dates.start&&e.date<=filters.dates.end))&&(!query||[e.name,e.source,e.category,e.campaign,e.notes,e.account].join(' ').toLowerCase().includes(query)));
}

function renderTransactions(){
  const years=[...new Set([String(new Date().getFullYear()),...state.transactions.map(e=>e.date.slice(0,4))])].sort().reverse();
  const sources=[...new Set([...state.sources,...state.transactions.map(e=>e.source).filter(Boolean)])];
  return heading('INCOME AND EXPENSES','Transactions','Record, review, and search your income and expenses.',button('Import CSV','import-csv','upload','','Review a bank or platform CSV before adding entries.')+button('Add expense','add-expense','plus')+button('Add income','add-income','plus','primary'))+
    (filters.dates?`<div class="notice">Showing ${longDate(filters.dates.start)} – ${longDate(filters.dates.end)} from your snapshot. <button type="button" class="inline-link" data-action="clear-date-filter">Show all dates</button></div>`:'')+
    `<section class="panel"><div class="filters"><div class="search-input">${icon('search')}<input id="transaction-search" type="search" value="${esc(filters.search)}" placeholder="Search a name, campaign, or note…" aria-label="Search transactions" data-tip="Search by payer, vendor, source, category, campaign, account label, or notes."></div><select id="transaction-type" aria-label="Transaction type" data-tip="Show all activity, only earnings, or only purchases."><option value="all">All activity</option><option value="income" ${filters.type==='income'?'selected':''}>Money in</option><option value="expense" ${filters.type==='expense'?'selected':''}>Money out</option></select><select id="transaction-year" aria-label="Transaction year" data-tip="Filter entries by the year they were received or paid."><option value="all">All years</option>${years.map(y=>`<option ${filters.year===y?'selected':''}>${y}</option>`).join('')}</select><select id="transaction-source" aria-label="Income source" data-tip="Find transactions associated with a particular platform or campaign source."><option value="all">All sources</option>${sources.map(s=>`<option value="${esc(s)}" ${filters.source===s?'selected':''}>${esc(s)}</option>`).join('')}</select><button class="filter-chip ${filters.attention?'active':''}" data-action="toggle-attention" aria-pressed="${filters.attention}" data-tip="Show entries with missing receipts, missing categories, or questions for your tax preparer.">${icon('alert')}Needs attention</button></div><div id="transaction-results">${transactionResults()}</div></section>`;
}

function transactionResults(){
  const entries=filteredTransactions();const t=totals(entries);
  return entries.length?`<div class="table-wrap"><table><thead><tr><th>WHO / WHAT</th><th>DATE</th><th>CATEGORY / SOURCE</th><th>STATUS</th><th class="text-right">AMOUNT</th><th></th></tr></thead><tbody>${entries.map(e=>`<tr data-edit="${e.id}" tabindex="0" role="button" aria-label="Edit ${esc(e.name)}, ${currency(e.amount_cents)}, ${e.date}"><td><div class="cell-main">${sourceBadge(e.source,e.type)}<div><strong>${esc(e.name)}</strong><small>${esc(e.campaign||e.type==='income'&&e.source||'Business purchase')}</small></div></div></td><td class="nowrap muted">${shortDate(e.date)}<div class="amount-detail">${e.date.slice(0,4)}</div></td><td>${esc(e.category||'Uncategorized')}<div class="amount-detail">${esc(e.source||'General business')}</div></td><td>${e.attention.length?`<span class="tag warning" data-tip="${esc(e.attention.join('; '))}" tabindex="0">${icon('alert')}Needs attention</span>`:`<span class="tag green">${icon('check')}Recorded</span>`}</td><td class="text-right"><div class="row-amount ${e.type}">${e.type==='income'?'+':'−'}${currency(e.type==='income'?e.amount_cents-e.fees_cents-e.refunds_cents:e.amount_cents)}</div><div class="amount-detail">${e.type==='income'?'Net deposit':`${e.business_percent}% business use`}</div></td><td><button type="button" class="table-action" data-edit="${e.id}" aria-label="Edit ${esc(e.name)}" data-tip="Open the full details and linked documents.">${icon('arrowRight')}</button></td></tr>`).join('')}</tbody></table></div><div class="table-summary"><span>${entries.length} ${entries.length===1?'entry':'entries'} shown</span><span>Earnings ${currency(t.earnings)} · Spending ${currency(t.spending)}</span></div>`:empty(state.transactions.length?'No matching transactions':'No transactions recorded',state.transactions.length?'Try another search or filter.':'Add money you’ve received, record a purchase, or import a CSV.','transactions',button('Add an entry','add-income','plus','primary'));
}

function renderDocuments(){
  return heading('RECEIPTS AND STATEMENTS','Documents','Store and link original receipts, screenshots, photos, and statements.',button('Add documents','upload-documents','plus','primary','Choose files from this PC. Original files are copied into your ledger.'))+
    `<div class="drop-zone" id="main-drop" tabindex="0" role="button" aria-label="Drop files here or press Enter to choose documents" data-action="upload-documents">${icon('upload')}<h2>Add documents</h2><p>Drag in receipts, screenshots, statements, or other files. Up to 25 MB each.</p>${button('Choose files','upload-documents','folder','','Add original files from your computer.')}</div><div class="documents-toolbar"><div class="search-input">${icon('search')}<input type="search" id="document-search" value="${esc(documentFilter.search)}" placeholder="Find a document…" aria-label="Search documents"></div><select id="document-kind" aria-label="Filter document type"><option value="all">All document types</option>${['Receipt','Bank statement','Platform statement','Tax form','Contract','Other'].map(k=>`<option value="${k}" ${k===documentFilter.kind?'selected':''}>${k}</option>`).join('')}</select><select id="document-year" aria-label="Filter document year"><option value="all">All years</option>${[...new Set([new Date().getFullYear(),...state.documents.map(d=>d.tax_year)])].sort().reverse().map(y=>`<option value="${y}" ${String(y)===documentFilter.year?'selected':''}>${y}</option>`).join('')}</select><button class="filter-chip ${documentFilter.unlinked?'active':''}" data-action="toggle-unlinked" aria-pressed="${documentFilter.unlinked}" data-tip="Show documents that are not linked to a transaction. Statements and tax forms can remain unlinked and still appear in reports for their assigned year.">Not linked yet</button></div><div id="document-results">${documentResults()}</div>`;
}

function fileURL(ident,download=false){return `/api/documents/${encodeURIComponent(ident)}?token=${encodeURIComponent(token)}${download?'&download=1':''}`;}
function documentResults(){
  const docs=state.documents.filter(d=>(!documentFilter.search||d.name.toLowerCase().includes(documentFilter.search.toLowerCase()))&&(documentFilter.kind==='all'||d.kind===documentFilter.kind)&&(documentFilter.year==='all'||String(d.tax_year)===documentFilter.year)&&(!documentFilter.unlinked||!d.transaction_ids.length));
  return docs.length?`<div class="documents-grid">${docs.map(d=>`<article class="document-card"><button type="button" class="document-preview" data-preview="${d.id}" data-tip="Preview ${esc(d.name)}." aria-label="Preview ${esc(d.name)}">${['image/png','image/jpeg','image/webp','image/gif'].includes(d.mime)?`<img src="${fileURL(d.id)}" alt="" loading="lazy">`:icon(d.kind==='Bank statement'?'wallet':d.kind==='Tax form'?'reports':'documents')}<span class="document-kind">${esc(d.kind)} · ${d.tax_year}</span></button><div class="document-details"><h3 data-tip="${esc(d.name)}" tabindex="0">${esc(d.name)}</h3><p>${d.size<1048576?(d.size/1024).toFixed(0)+' KB':(d.size/1048576).toFixed(1)+' MB'} · Original file saved</p><div class="document-actions"><span class="tag ${d.transaction_ids.length?'green':'warning'}" data-tip="${d.transaction_ids.length?'This file is attached to '+d.transaction_ids.length+' transaction(s).':'Not attached to a transaction. Yearly statements and tax forms are still included in reports for their assigned year.'}" tabindex="0">${icon(d.transaction_ids.length?'paperclip':'info')}${d.transaction_ids.length?d.transaction_ids.length+' linked':'Not linked'}</span><button type="button" class="button" data-link-document="${d.id}" data-tip="Link this document to an existing entry, or create an entry using it.">${icon('paperclip')}Link to entry</button></div></div></article>`).join('')}</div>`:empty('No documents found','Add a file above. Original documents are copied into your ledger, so moving the original won’t break the link.','folder');
}

function getReportDates(){
  if(reportOptions.period==='custom')return {start:reportOptions.start,end:reportOptions.end};
  const y=Number(reportOptions.year);
  if(reportOptions.period==='year')return {start:`${y}-01-01`,end:`${y}-12-31`};
  const q=Number(reportOptions.period.replace('q',''));
  return {start:localISO(new Date(y,(q-1)*3,1)),end:localISO(new Date(y,q*3,0))};
}

function renderReports(){
  const dates=getReportDates(),t=totals(periodEntries(dates));
  const years=[...new Set([new Date().getFullYear(),...state.transactions.map(e=>Number(e.date.slice(0,4)))])].sort().reverse();
  return heading('EXPORTS','Reports','Export summaries, transaction details, and supporting documents.')+
    `<div class="reports-layout"><section class="panel panel-padding report-options"><div class="field">${fieldLabel('Which year?','report-year','Choose the calendar year for your report.')}<select id="report-year">${years.map(y=>`<option value="${y}" ${y===Number(reportOptions.year)?'selected':''}>${y}</option>`).join('')}</select></div><div class="field">${fieldLabel('Which period?','report-period','Calendar quarters are January–March, April–June, July–September, and October–December. These are reporting periods, not estimated-tax payment deadlines.')}<select id="report-period">${[['year','Full year'],['q1','Quarter 1 · Jan–Mar'],['q2','Quarter 2 · Apr–Jun'],['q3','Quarter 3 · Jul–Sep'],['q4','Quarter 4 · Oct–Dec'],['custom','Custom dates']].map(([v,l])=>`<option value="${v}" ${v===reportOptions.period?'selected':''}>${l}</option>`).join('')}</select></div>${reportOptions.period==='custom'?`<div class="field">${fieldLabel('Start date','report-start')}<input type="date" id="report-start" value="${reportOptions.start}"></div><div class="field">${fieldLabel('End date','report-end')}<input type="date" id="report-end" value="${reportOptions.end}"></div>`:''}${info('Reports include recorded payments and purchases. A complete package also includes linked original files, plus statements and tax forms for the selected year(s).')}</section><section class="panel report-preview"><div class="eyebrow">YOUR BUSINESS REPORT</div><h2>${esc(state.settings.owner)}’s financial report</h2><p class="report-period">${longDate(dates.start)} – ${longDate(dates.end)} · ${periodEntries(dates).length} entries</p>${reportSummary(t)}${t.attention?info(`${t.attention} ${t.attention===1?'entry needs':'entries need'} attention. Reports include these entries and show their review flags.`,true):''}<p class="report-footnote">Amounts reflect the business-use percentages you recorded. Purchases marked for review are included before tax adjustments. Your preparer can determine their tax treatment.</p><div class="export-buttons">${button('Save as PDF','export-pdf','download','','A formatted report with summaries, transaction details, review flags, and a document index.')}${button('Save as Word','export-docx','download','','An editable .docx report. Microsoft Word is not required to create the file.')}${button('Save as CSV','export-csv','download','','A spreadsheet-friendly list of all transactions and supporting details.')}${button('Preview PDF','preview-report','eye','','Open a PDF preview before you save it.')}</div>${button('Save complete report package','export-zip','folder','primary export-package','Download a ZIP containing PDF, Word, CSV, and supporting original documents.')}<p class="form-note">Your original records stay in your ledger. Report exports are copies.</p></section></div>`;
}

function reportSummary(t){return `<div class="report-total"><span>Gross income</span><strong>${currency(t.gross)}</strong></div><div class="report-total"><span>Refunds</span><strong>${currency(t.refunds)}</strong></div><div class="report-total"><span>Earnings after refunds</span><strong>${currency(t.earnings)}</strong></div><div class="report-total"><span>Fees withheld</span><strong>${currency(t.fees)}</strong></div><div class="report-total"><span>Net deposits recorded</span><strong>${currency(t.deposits)}</strong></div><div class="report-total"><span>All purchases, including personal share</span><strong>${currency(t.purchases)}</strong></div><div class="report-total"><span>Recorded business share of purchases</span><strong>${currency(t.business)}</strong></div><div class="report-total result"><span>Net income · before tax adjustments</span><strong>${currency(t.net)}</strong></div>`;}

function openModal(title,subtitle,body,footer='',wide=false,eyebrow='LEAH’S LEDGER'){
  if(modal.open)modal.close();hideTooltip();modal.className=wide?'wide':'';
  modal.innerHTML=`<div class="modal-header"><div><div class="eyebrow">${eyebrow}</div><h2 id="modal-title">${title}</h2>${subtitle?`<p>${subtitle}</p>`:''}</div><button type="button" class="icon-button" data-action="close-modal" aria-label="Close dialog" data-tip="Close this window. Unsaved changes will be discarded.">${icon('close')}</button></div>${body}${footer?`<div class="modal-footer">${footer}</div>`:''}`;
  modal.showModal();installDropZones();installFieldTooltips();
}

function installFieldTooltips(){
  const filters={'document-kind':'Show documents of a specific type.','document-year':'Show documents assigned to a tax year.','document-search':'Search saved documents by filename.','report-start':'Include transactions on or after this date.','report-end':'Include transactions on or before this date.','custom-start':'The first date to include in your snapshot.','custom-end':'The last date to include in your snapshot.','upload-year':'The tax year this document supports.'};
  $$('input:not([type="hidden"]):not([type="file"]), select, textarea').forEach(input=>{
    if(input.dataset.tip)return;
    const explained=input.closest('.field')?.querySelector('.help-dot')?.dataset.tip;
    if(explained||filters[input.id])input.dataset.tip=explained||filters[input.id];
  });
  const save=$('#save-entry');if(save)save.dataset.tip='Save this transaction and its selected document links.';
}

function showFormError(error){const target=$('#form-error',modal);if(target){target.textContent=error.message||String(error);target.scrollIntoView({block:'nearest'});}else toast(error.message||String(error),true);}

function options(values,selected,emptyLabel){return `${emptyLabel?`<option value="">${emptyLabel}</option>`:''}${[...new Set([...values,...(selected?[selected]:[])])].map(value=>`<option value="${esc(value)}" ${value===selected?'selected':''}>${esc(value)}</option>`).join('')}`;}

function openEditor(kind,entry=null,docId=null){
  editorId=entry?.id||null;selectedDocuments=[...(entry?.document_ids||[]),...(docId?[docId]:[])];
  const e=entry||{type:kind,date:today(),name:'',source:'',category:kind==='income'?'Affiliate commission':'',campaign:'',notes:'',amount_cents:0,fees_cents:0,refunds_cents:0,business_percent:100,payment_method:kind==='income'?'Direct deposit':'Card / bank',account:'',tax_review:false,receipt_not_needed:false};
  const income=kind==='income';
  const names=[...new Set(state.transactions.filter(t=>t.type===kind).map(t=>t.name))];
  const campaigns=[...new Set(state.transactions.map(t=>t.campaign).filter(Boolean))];
  const accounts=[...new Set(state.transactions.map(t=>t.account).filter(Boolean))];
  const sources=[...new Set([...state.sources,...state.transactions.map(t=>t.source).filter(Boolean)])];
  const content=`<form id="entry-form"><div class="modal-body"><p id="form-error" class="form-error" role="alert"></p><input type="hidden" name="type" value="${kind}"><div class="field-grid"><div class="field">${fieldLabel(income?'Who paid you?':'Where did you buy it?','entry-name',income?'The company or person who sent the payment. You can use the platform name if it paid you directly.':'The vendor or person you paid. Previous vendors are suggested as you type.')}<input id="entry-name" name="name" list="known-names" value="${esc(e.name)}" placeholder="${income?'e.g. ShopMy':'e.g. Olivia Rose James'}" maxlength="200" required autocomplete="off"><datalist id="known-names">${names.map(n=>`<option value="${esc(n)}">`).join('')}</datalist></div><div class="field">${fieldLabel(income?'Date received':'Date paid','entry-date','Use the date the money actually arrived or the purchase was paid.')}<input id="entry-date" type="date" name="date" value="${e.date}" required></div><div class="field">${fieldLabel(income?'Gross amount earned':'Total purchase amount','entry-amount',income?'The amount before any platform fees or refunds. If the only amount you know is the deposit, enter it and flag the entry for preparer review.':'The full amount paid, including any tax or shipping. Business use is set separately below.')}<div class="money-input"><span>$</span><input id="entry-amount" name="amount" type="number" min="0.01" step="0.01" max="999999999.99" value="${e.amount_cents?(e.amount_cents/100).toFixed(2):''}" placeholder="0.00" required></div></div><div class="field">${fieldLabel(income?'Where did you earn it?':'Related income source (optional)','entry-source',income?'Choose Amazon Associates, ShopMy, Royals, or add another source. This is separate from how you were paid.':'Choose a source if this purchase supports a specific platform or brand. Leave blank for general business spending.')}<input id="entry-source" name="source" list="known-sources" value="${esc(e.source)}" placeholder="${income?'Choose or type a source':'General business'}" maxlength="200" autocomplete="off"><datalist id="known-sources">${sources.map(s=>`<option value="${esc(s)}">`).join('')}</datalist></div></div>${income?`<div class="field-grid mt"><div class="field">${fieldLabel('Fees withheld','entry-fees','Fees kept by the platform or payment processor from this payment. Do not also enter the same fees as a separate expense.')}<div class="money-input"><span>$</span><input id="entry-fees" name="fees" type="number" min="0" step="0.01" value="${(e.fees_cents/100).toFixed(2)}"></div></div><div class="field">${fieldLabel('Refunds','entry-refunds','Refunds deducted from the gross earnings in this same entry. Do not enter the same refund twice.')}<div class="money-input"><span>$</span><input id="entry-refunds" name="refunds" type="number" min="0" step="0.01" value="${(e.refunds_cents/100).toFixed(2)}"></div></div></div><div class="net-deposit"><span>What arrived in your bank</span><strong id="net-deposit-value">${currency(e.amount_cents-e.fees_cents-e.refunds_cents)}</strong></div>`:''}<div class="section-label">THE DETAILS</div><div class="field-grid"><div class="field">${fieldLabel('Category','entry-category','A simple grouping for reports. Save an uncategorized entry if you are unsure; it will appear in Needs attention.')}<select name="category" id="entry-category">${options(income?state.income_categories:state.expense_categories,e.category,'Choose later')}</select></div><div class="field">${fieldLabel('Campaign or painting (optional)','entry-campaign','Use the same name on a painting purchase and its related earnings to find them together. A campaign link does not establish tax deductibility.')}<input id="entry-campaign" name="campaign" value="${esc(e.campaign)}" list="known-campaigns" placeholder="e.g. Royals · The Reader" maxlength="200"><datalist id="known-campaigns">${campaigns.map(s=>`<option value="${esc(s)}">`).join('')}</datalist></div><div class="field">${fieldLabel(income?'How were you paid?':'How did you pay?','entry-payment','Record the payment method. A bank deposit and a platform payout can be the same earnings; enter them only once.')}<select id="entry-payment" name="payment_method">${options(['Direct deposit','Card / bank','PayPal','Check','Cash','Other'],e.payment_method)}</select></div><div class="field">${fieldLabel('Account label (optional)','entry-account','A label such as Business checking. Account numbers and bank logins are not needed.')}<input name="account" id="entry-account" value="${esc(e.account)}" list="known-accounts" placeholder="e.g. Business checking" maxlength="200"><datalist id="known-accounts">${accounts.map(s=>`<option value="${esc(s)}">`).join('')}</datalist></div>${!income?`<div class="field">${fieldLabel('Business use %','entry-business','Your recorded business-use share, from 0 to 100%. Your tax preparer determines whether and how the purchase can be deducted.')}<input id="entry-business" type="number" min="0" max="100" step="0.01" name="business_percent" value="${e.business_percent}"><p class="hint">Personal use? Record only the business share.</p></div>`:''}<div class="field ${income?'full':''}">${fieldLabel(income?'Notes (optional)':'What was it for?','entry-notes',income?'Add context, a reference number, or a question for your preparer.':'Describe the business purpose in your own words. For art purchases, explain the content you planned to create and any personal use.')}<textarea id="entry-notes" name="notes" maxlength="4000" placeholder="${income?'Add a reference number or payment details.':'e.g. Bought a print to feature in a promotional video.'}">${esc(e.notes)}</textarea></div></div><div id="artwork-note" class="mt" ${!income&&['Artwork & content purchases','Equipment'].includes(e.category)?'':'hidden'}>${info('Record the purchase now and let your preparer review its tax treatment. Creating content with an item does not automatically make its full cost deductible.',true)}</div><div class="section-label">ATTACHMENTS</div><div id="attachment-list">${attachmentList()}</div><div class="attach-controls">${button('Add files','editor-upload','paperclip','','Copy new original files into your ledger and attach them here.')}${button('Choose saved documents','pick-documents','folder','','Attach a receipt or statement already in Documents.')}</div><div class="dialog-drop" id="editor-drop">${icon('upload')}Or drag files here. You can also paste a screenshot with Ctrl + V.<input type="file" id="editor-file-input" multiple aria-label="Attach receipt files"></div><div class="mt stack"><label class="checkbox-field"><input type="checkbox" name="tax_review" ${e.tax_review?'checked':''}><span><strong>Ask my tax preparer about this</strong><small>Keep a visible reminder and include the question in reports.</small></span></label>${!income?`<label class="checkbox-field"><input type="checkbox" name="receipt_not_needed" ${e.receipt_not_needed?'checked':''}><span><strong>No separate receipt available</strong><small>Clears the receipt reminder. Add another supporting document or explain in your notes.</small></span></label>`:''}</div><p class="form-note">You can save now and fill in missing categories or documents later.</p></div><div class="modal-footer">${entry?button('Remove','remove-entry','trash','danger left','Remove this entry from reports. You can undo the removal immediately.'):''}${button('Cancel','close-modal',null,'ghost','Close without saving this entry.')}<button class="button primary" type="submit" id="save-entry">${icon('check')}${entry?'Save changes':'Save entry'}</button></div></form>`;
  openModal(entry?'Edit transaction':income?'Add income':'Add expense',income?'Record a payment you have received.':'Record the purchase, its business purpose, and supporting documents.',content);
  // Keep the common workflow short. Optional accounting detail stays available.
  const firstGrid=$('.field-grid',modal);
  const categoryField=$('#entry-category').closest('.field');
  const detailGrid=categoryField.parentElement;
  firstGrid.append(categoryField,$('#entry-campaign').closest('.field'));
  if(!income){const purpose=$('#entry-notes').closest('.field');purpose.classList.add('full');firstGrid.append(purpose);}
  const advanced=document.createElement('details');advanced.className='advanced-details';
  advanced.innerHTML='<summary data-tip="Payment method, an optional account label, business-use percentage, and extra notes. You can leave these for later.">More details <span>optional</span></summary>';
  $('.section-label',modal).replaceWith(advanced);advanced.append(detailGrid);
  if(income){
    const feeGrid=$('#entry-fees').closest('.field-grid');
    const feeDetails=document.createElement('details');feeDetails.className='advanced-details fees-details';
    feeDetails.innerHTML='<summary data-tip="Add any fees or refunds withheld from this payment. These reduce the amount deposited in your bank.">Fees or refunds? <span>optional</span></summary>';
    if(e.fees_cents||e.refunds_cents)feeDetails.open=true;
    feeGrid.replaceWith(feeDetails);feeDetails.append(feeGrid);
  }
  $('#entry-name').focus();
}

function attachmentList(){return selectedDocuments.length?`<div class="attachment-list">${selectedDocuments.map(id=>{const d=state.documents.find(d=>d.id===id);return `<div class="attachment-item">${icon('paperclip')}<span>${esc(d?.name||'Document')}</span><button type="button" data-unattach="${id}" aria-label="Unlink ${esc(d?.name||'document')}" data-tip="Remove this document from the entry. The original remains in Documents.">${icon('close')}</button></div>`;}).join('')}</div>`:'<p class="hint form-note">No documents linked yet. Add one now or come back later.</p>';}

async function saveEntry(form){
  if(saveInProgress)return;
  if(!form.reportValidity())return;
  const payload=Object.fromEntries(new FormData(form));
  payload.tax_review=form.elements.tax_review.checked;
  payload.receipt_not_needed=!!form.elements.receipt_not_needed?.checked;
  payload.document_ids=[...selectedDocuments];if(editorId)payload.id=editorId;
  const similar=state.transactions.find(e=>e.id!==editorId&&e.type===payload.type&&e.date===payload.date&&e.name.trim().toLowerCase()===payload.name.trim().toLowerCase()&&e.amount_cents===Math.round(Number(payload.amount)*100));
  if(similar&&!form.dataset.duplicateConfirmed){showFormError(new Error('A matching date, name, and amount is already recorded. Check it in Transactions. If this really is a separate payment or purchase, choose Save again.'));form.dataset.duplicateConfirmed='true';return;}
  saveInProgress=true;$('#save-entry').disabled=true;
  try{await api('/api/transactions',payload);modal.close();await refresh();toast(editorId?'Changes saved.':'Entry saved.');}
  catch(error){showFormError(error);}finally{saveInProgress=false;const b=$('#save-entry');if(b)b.disabled=false;}
}

function uploadDialog(files){
  if(!files.length)return;
  window.pendingFiles=[...files];
  openModal('Save documents','Original files are copied into your ledger.',`<div class="modal-body"><p id="form-error" class="form-error" role="alert"></p><div class="attachment-list">${files.map(f=>`<div class="attachment-item">${icon('documents')}<span>${esc(f.name)}</span><small>${(f.size/1024/1024).toFixed(1)} MB</small></div>`).join('')}</div><div class="field-grid mt"><div class="field">${fieldLabel('Document type','upload-kind','Statements and tax forms are included in reports for their assigned year, even without a transaction link.')}<select id="upload-kind">${options(['Receipt','Bank statement','Platform statement','Tax form','Contract','Other'],'Receipt')}</select></div><div class="field">${fieldLabel('Which tax year?','upload-year','The year this document supports. It can differ from the year the file was uploaded.')}<input type="number" id="upload-year" min="2000" max="2100" value="${new Date().getFullYear()}"></div></div><p class="form-note">Link receipts to their transactions after uploading. Statements and tax forms can support the whole year.</p><div id="upload-progress" class="progress-message" aria-live="polite"></div></div>`,button('Cancel','close-modal',null,'ghost')+button('Save documents','confirm-upload','check','primary'));
}

async function uploadFiles(files,context='documents',kind='Receipt',year=new Date().getFullYear()){
  let saved=0,duplicates=0;
  for(const file of files){
    if(!file.size||file.size>25*1024*1024)throw new Error(`${file.name}: choose a non-empty file up to 25 MB. ${saved} earlier file(s) were saved.`);
    const result=await api('/api/documents',{name:file.name,base64:await readFile(file),kind,tax_year:year});
    if(context==='editor'&&!selectedDocuments.includes(result.id))selectedDocuments.push(result.id);
    result.duplicate?duplicates++:saved++;
    const progress=$('#upload-progress');if(progress)progress.textContent=`${saved+duplicates} of ${files.length} files handled…`;
  }
  await refresh(false);
  if(context==='editor'){if($('#attachment-list'))$('#attachment-list').innerHTML=attachmentList();}
  else{modal.close();renderPage();}
  toast(`${saved} ${saved===1?'document':'documents'} saved${duplicates?`; ${duplicates} already in your ledger`:''}.`);
}

function pickDocuments(){
  const picker=document.createElement('div');picker.className='document-picker';picker.id='document-picker';
  picker.innerHTML=state.documents.length?state.documents.map(d=>`<label class="checkbox-field"><input type="checkbox" value="${d.id}" ${selectedDocuments.includes(d.id)?'checked':''}><span><strong>${esc(d.name)}</strong><small>${esc(d.kind)} · ${d.tax_year}</small></span></label>`).join(''):'<p class="form-note">No saved files yet. Use Add files to save your first document.</p>';
  const original=$('#attachment-list');original.replaceChildren(picker);
  const done=document.createElement('button');done.type='button';done.className='button mt';done.textContent='Done choosing';
  done.onclick=()=>{selectedDocuments=$$('#document-picker input:checked').map(e=>e.value);original.innerHTML=attachmentList();done.remove();};original.append(done);
}

function previewDocument(id){
  const d=state.documents.find(d=>d.id===id);if(!d)return;
  const images=['image/png','image/jpeg','image/gif','image/webp'];
  const body=images.includes(d.mime)?`<img class="preview-image" src="${fileURL(id)}" alt="${esc(d.name)}">`:d.mime==='application/pdf'||d.mime==='text/plain'?`<iframe class="preview-frame" src="${fileURL(id)}" title="${esc(d.name)}"></iframe>`:empty('Your original file is saved.','Download this file to open it in its usual Windows app.','documents');
  openModal('Document preview',esc(d.name),`<div class="modal-body">${body}</div>`,button('Close','close-modal',null,'ghost')+`<a class="button primary" href="${fileURL(id,true)}" download>${icon('download')}Save original file</a>`,true);
}

function linkDocument(id){
  const d=state.documents.find(d=>d.id===id);if(!d)return;
  openModal('Link document to a transaction',esc(d.name),`<div class="modal-body"><p id="form-error" class="form-error" role="alert"></p><div class="field">${fieldLabel('Choose an entry','link-entry','A document can support more than one transaction. Existing links are preserved.')}<select id="link-entry"><option value="">Choose a transaction…</option>${state.transactions.map(e=>`<option value="${e.id}">${e.date} · ${esc(e.name)} · ${currency(e.amount_cents)}</option>`).join('')}</select></div><p class="form-note">Need to record the purchase first?</p><div class="settings-actions mt">${button('New expense using this file','new-expense-with-doc','plus','','Create a purchase with this document attached.',`data-document-id="${id}"`)}${button('New income using this file','new-income-with-doc','plus','','Create a payment with this document attached.',`data-document-id="${id}"`)}</div></div>`,button('Cancel','close-modal',null,'ghost')+button('Link document','confirm-link','paperclip','primary','Attach this original document to the selected entry.',`data-document-id="${id}"`));
}

function transactionPayload(e){return {...e,amount:(e.amount_cents/100).toFixed(2),fees:(e.fees_cents/100).toFixed(2),refunds:(e.refunds_cents/100).toFixed(2)};}

function settingsDialog(){
  openModal('Settings and backups','Manage your name, local records, and backup files.',`<div class="modal-body"><p id="form-error" class="form-error" role="alert"></p><section class="settings-section"><div class="field">${fieldLabel('Name','settings-owner','Personalize your greeting and exported reports.')}<input id="settings-owner" value="${esc(state.settings.owner)}" maxlength="80"></div></section><section class="settings-section"><h3>Backups</h3><p>Automatic backups are saved on this PC when you open the app and once each day you make changes. “Save & exit” saves another. Keep an exported ZIP on another drive or in your own cloud folder for protection if this PC fails.</p><div class="settings-actions">${button('Export full backup','export-backup','download','primary','Download all records, edit history, and original documents in one ZIP.')}${button('Save a local backup now','backup-now','history','','Save another recovery copy in this PC’s backup folder.')}</div><p class="form-note">Last local backup: ${state.last_backup?esc(new Date(state.last_backup).toLocaleString()):'No backup yet'}. The most recent 30 local backups are kept.</p></section><section class="settings-section"><h3>Restore a backup</h3><p>Export a full backup here, copy it to the other PC, and choose Restore there. Restoring replaces that PC’s ledger. A recovery backup is saved first.</p>${button('Restore from a backup','restore','history','','Choose a ZIP created by Leah’s Ledger. You will review the replacement before it happens.')}</section><section class="settings-section"><h3>Data location</h3><p>The app works offline. Financial records, original documents, and local backups stay outside the app’s installation and GitHub source folders. Records are protected by your Windows account; the app does not add its own encryption.</p><div class="path-box">${esc(state.data_folder)}</div></section><section class="settings-section"><h3>Version 0.1.0</h3><p>A personal creator ledger. Reports organize the details for your preparer; they do not calculate your final tax or determine deductions.</p></section></div>`,button('Close','close-modal',null,'ghost')+button('Save settings','save-settings','check','primary'));
}

function helpDialog(){
  const steps=[['View your snapshot','Choose a time period to see earnings, spending, and net income before tax adjustments. Everything on that screen uses the same dates.'],['Add income','Add income when you receive it. Keep gross earnings, withheld fees, and refunds together. A platform payment and its matching bank deposit are the same money.'],['Add expenses','Record the vendor, amount paid, and what the purchase was for. For artwork, use a campaign or painting name to connect the purchase to later earnings. Flag questions for your preparer.'],['Attach documents','Add a screenshot, photo, PDF, or other original file. Link receipts to entries. Assign statements and tax forms to the right year. You can paste screenshots while adding an entry.'],['Review incomplete entries','Needs attention shows missing categories, missing receipts, and preparer questions. You can save an entry before every detail is complete.'],['Export reports','Choose a quarter or year in Reports. Save a PDF, editable Word document, CSV, or a complete package with supporting files. Export a full backup regularly, too.']];
  openModal('Help, whenever you need it.','How to use your ledger.',`<div class="modal-body">${steps.map(([title,text],i)=>`<div class="guide-step"><span>${i+1}</span><div><h3>${title}</h3><p>${text}</p></div></div>`).join('')}${info('Hover over buttons and ? icons for explanations. Keyboard users can focus them; clicking a ? also opens its explanation. Ctrl + K searches transactions.')}</div>`,button('Close','close-modal','check','primary'));
}

function customRangeDialog(){
  const dates=range==='custom'?customRange:rangeDates();
  openModal('Custom date range','Choose the start and end dates for your snapshot.',`<div class="modal-body"><p id="form-error" class="form-error" role="alert"></p><div class="field-grid"><div class="field">${fieldLabel('From','custom-start')}<input type="date" id="custom-start" value="${dates.start}" min="2000-01-01" max="2100-12-31"></div><div class="field">${fieldLabel('Through','custom-end')}<input type="date" id="custom-end" value="${dates.end}" min="2000-01-01" max="2100-12-31"></div></div><p class="form-note">Both dates are included. Set the same date twice for a single day.</p></div>`,button('Cancel','close-modal',null,'ghost')+button('Update snapshot','apply-range','check','primary'));
}

function validDates(dates){if(!/^\d{4}-\d{2}-\d{2}$/.test(dates.start)||!/^\d{4}-\d{2}-\d{2}$/.test(dates.end)||Number.isNaN(parseISO(dates.start).valueOf())||Number.isNaN(parseISO(dates.end).valueOf()))throw new Error('Choose a start date and an end date.');if(dates.start>dates.end)throw new Error('The end date must be on or after the start date.');if(dates.start<'2000-01-01'||dates.end>'2100-12-31')throw new Error('Choose dates between 2000 and 2100.');return dates;}

async function downloadURL(path,filename){
  toast('Getting your file ready…');
  const response=await fetch(path,{headers:{'X-Ledger-Token':token}});
  if(!response.ok){const body=await response.json();throw new Error(body.error||'The file could not be created.');}
  const blob=await response.blob(),url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download=filename;document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);toast('Your file is ready. Check Downloads.');
}

async function exportReport(format,preview=false){
  const dates=validDates(getReportDates());
  const path=`/api/report?${new URLSearchParams({...dates,format})}`;
  if(preview){
    toast('Preparing your preview…');const response=await fetch(path,{headers:{'X-Ledger-Token':token}});if(!response.ok){const error=await response.json();throw new Error(error.error);}
    const url=URL.createObjectURL(await response.blob());
    openModal('Your report, ready to review.',`${longDate(dates.start)} – ${longDate(dates.end)}`,`<div class="modal-body"><iframe class="preview-frame" src="${url}" title="Business report PDF preview"></iframe></div>`,button('Close','close-modal',null,'ghost')+button('Save PDF','export-pdf','download','primary'),true);
    modal.addEventListener('close',()=>URL.revokeObjectURL(url),{once:true});return;
  }
  return downloadURL(path,`Leahs-Ledger-${dates.start}-to-${dates.end}.${format}`);
}

function importDialog(csv){
  const match=names=>csv.headers.find(h=>names.includes(h.toLowerCase().trim()))||'';
  importSession={...csv,mapping:{date:match(['date','transaction date','posted date','payment date']),name:match(['name','description','vendor','payer','merchant']),amount:match(['amount','total','gross','gross amount']),type:match(['type','transaction type']),source:match(['source','platform']),category:match(['category']),campaign:match(['campaign','painting']),notes:match(['notes','memo'])},mode:'signed'};
  renderImportDialog();
}

function renderImportDialog(){
  const s=importSession;
  const mapFields=[['date','Date *'],['name','Payer / vendor *'],['amount','Amount *'],['type','Type (optional)'],['source','Source (optional)'],['category','Category (optional)'],['campaign','Campaign (optional)'],['notes','Notes (optional)']];
  openModal('Import transactions','Match the columns, then review before anything is saved.',`<div class="modal-body"><p id="form-error" class="form-error" role="alert"></p>${info('Import payments OR their matching bank deposits, not both. This importer uses a single amount column. For gross income with withheld fees, use the platform’s gross amount and add the fees when editing the entry afterward. Flag unclear entries for review.')}<div class="import-mapping">${mapFields.map(([id,label])=>`<div class="field">${fieldLabel(label,'map-'+id)}<select id="map-${id}" data-map="${id}"><option value="">Choose a column…</option>${s.headers.map(h=>`<option value="${esc(h)}" ${s.mapping[id]===h?'selected':''}>${esc(h)}</option>`).join('')}</select></div>`).join('')}<div class="field">${fieldLabel('How to read amounts','import-mode','For signed bank amounts, positive is income and negative is expense. If your bank uses the opposite convention, change the option. A mapped Type column overrides the sign.')}<select id="import-mode">${[['signed','Positive = income'],['reverse','Negative = income'],['income','All rows are income'],['expense','All rows are expenses']].map(([v,l])=>`<option value="${v}" ${s.mode===v?'selected':''}>${l}</option>`).join('')}</select></div></div><label class="checkbox-field"><input type="checkbox" id="skip-duplicates" checked><span><strong>Skip matching entries</strong><small>A matching date, type, name, and amount is treated as a possible duplicate. Uncheck only if these are separate transactions.</small></span></label><div id="import-review">${importReview()}</div></div>`,button('Cancel','close-modal',null,'ghost')+button('Import reviewed entries','confirm-import','check','primary','Save the reviewed rows. Invalid rows must be corrected in the CSV first.'),true);
}

function parseImportRows(){
  const s=importSession,m=s.mapping;
  if(!m.date||!m.name||!m.amount)return {entries:[],errors:[],unmapped:true};
  const entries=[],errors=[];
  s.rows.forEach((r,i)=>{
    try{
      if(!r[m.name]?.trim())throw new Error('Missing payer / vendor');
      let raw=String(r[m.amount]||'').trim().replace(/[$,\s]/g,'');if(/^\(.*\)$/.test(raw))raw='-'+raw.slice(1,-1);
      if(!/^[+-]?\d+(\.\d{1,2})?$/.test(raw)||!Number.isFinite(Number(raw))||Number(raw)===0||Math.abs(Number(raw))>999999999.99)throw new Error('Invalid amount');
      const amount=Number(raw);let kind=s.mode==='income'?'income':s.mode==='expense'?'expense':s.mode==='reverse'?(amount<0?'income':'expense'):(amount>0?'income':'expense');
      if(m.type&&r[m.type]){const val=r[m.type].toLowerCase().trim();if(['income','credit','deposit','money in'].includes(val))kind='income';else if(['expense','debit','withdrawal','money out'].includes(val))kind='expense';else throw new Error('Type must be income/expense or credit/debit');}
      let rawDate=String(r[m.date]||'').trim(),dateText;
      if(/^\d{4}-\d{2}-\d{2}$/.test(rawDate))dateText=rawDate;
      else{const parts=rawDate.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);if(!parts)throw new Error('Use YYYY-MM-DD or MM/DD/YYYY dates');dateText=`${parts[3]}-${parts[1].padStart(2,'0')}-${parts[2].padStart(2,'0')}`;}
      if(localISO(parseISO(dateText))!==dateText)throw new Error('Invalid date');
      const category=m.category?String(r[m.category]||'').trim():'';
      const entry={date:dateText,type:kind,name:r[m.name].trim(),amount:Math.abs(amount).toFixed(2),source:m.source?r[m.source]||'':'',category,campaign:m.campaign?r[m.campaign]||'':'',notes:m.notes?r[m.notes]||'':'',payment_method:kind==='income'?'Direct deposit':'Card / bank',business_percent:100,tax_review:['Artwork & content purchases','Equipment'].includes(category),fees:0,refunds:0};
      entries.push(entry);
    }catch(error){errors.push({row:i+2,error:error.message});}
  });
  return {entries,errors,unmapped:false};
}

function importReview(){
  const result=parseImportRows();
  if(result.unmapped)return '<p class="form-note">Choose Date, Payer / vendor, and Amount columns to preview the import.</p>';
  return `<div class="import-summary"><span class="tag green">${result.entries.length} valid rows</span><span class="tag ${result.errors.length?'warning':''}">${result.errors.length} errors</span><span>Nothing is saved yet.</span></div><div class="import-review"><table><thead><tr><th>DATE / ROW</th><th>WHO / WHAT</th><th>TYPE</th><th class="text-right">AMOUNT</th></tr></thead><tbody>${result.errors.slice(0,20).map(e=>`<tr class="bad"><td>Row ${e.row}</td><td colspan="3">${esc(e.error)}</td></tr>`).join('')}${result.entries.slice(0,100).map(e=>`<tr><td>${e.date}</td><td>${esc(e.name)}</td><td>${e.type==='income'?'Money in':'Money out'}</td><td class="text-right">${currency(Math.round(Number(e.amount)*100))}</td></tr>`).join('')}</tbody></table></div>${result.entries.length>100?'<p class="form-note">Previewing the first 100 valid entries. All valid rows will be imported.</p>':''}`;
}

function installDropZones(){
  for(const selector of ['#main-drop','#editor-drop']){
    const zone=$(selector);if(!zone||zone.dataset.installed)continue;zone.dataset.installed='1';
    zone.addEventListener('dragover',e=>{e.preventDefault();zone.classList.add('drag-over');});
    zone.addEventListener('dragleave',()=>zone.classList.remove('drag-over'));
    zone.addEventListener('drop',async e=>{e.preventDefault();zone.classList.remove('drag-over');if(!e.dataTransfer.files.length)return;try{if(selector==='#editor-drop')await uploadFiles([...e.dataTransfer.files],'editor');else uploadDialog([...e.dataTransfer.files]);}catch(error){await refresh(false);if($('#attachment-list'))$('#attachment-list').innerHTML=attachmentList();showFormError(error);}});
  }
}

let tooltipTarget=null,tooltipTimer;
function hideTooltip(){clearTimeout(tooltipTimer);$('#tooltip').hidden=true;tooltipTarget=null;}
function showTooltip(target){
  if(!target?.dataset.tip)return;tooltipTarget=target;const tip=$('#tooltip');tip.textContent=target.dataset.tip;tip.hidden=false;
  const r=target.getBoundingClientRect(),box=tip.getBoundingClientRect();let left=Math.max(10,Math.min(innerWidth-box.width-10,r.left+r.width/2-box.width/2));let top=r.bottom+9;if(top+box.height>innerHeight-10)top=Math.max(10,r.top-box.height-9);tip.style.left=left+'px';tip.style.top=top+'px';
}
document.addEventListener('pointerover',e=>{const target=e.target.closest('[data-tip]');if(target&&target!==tooltipTarget){hideTooltip();tooltipTimer=setTimeout(()=>showTooltip(target),550);}});
document.addEventListener('pointerout',e=>{if(e.target.closest('[data-tip]')&&!e.target.closest('[data-tip]')?.contains(e.relatedTarget))hideTooltip();});
document.addEventListener('focusin',e=>{const target=e.target.closest('[data-tip]');if(target){target.setAttribute('aria-describedby','tooltip');showTooltip(target);}});
document.addEventListener('focusout',hideTooltip);document.addEventListener('scroll',hideTooltip,true);

document.addEventListener('submit',async e=>{if(e.target.id==='entry-form'){e.preventDefault();await saveEntry(e.target);}});
document.addEventListener('input',e=>{
  if(e.target.id==='transaction-search'){filters.search=e.target.value;$('#transaction-results').innerHTML=transactionResults();}
  if(e.target.id==='document-search'){documentFilter.search=e.target.value;$('#document-results').innerHTML=documentResults();}
  if(['entry-amount','entry-fees','entry-refunds'].includes(e.target.id)&&$('#net-deposit-value'))$('#net-deposit-value').textContent=currency(Math.round((Number($('#entry-amount').value)-Number($('#entry-fees').value)-Number($('#entry-refunds').value))*100));
  if(e.target.closest('#entry-form'))delete $('#entry-form').dataset.duplicateConfirmed;
});

document.addEventListener('change',async e=>{
  const id=e.target.id;
  try{
    const transactionFilters={'transaction-type':'type','transaction-source':'source','transaction-year':'year'};
    if(transactionFilters[id]){filters[transactionFilters[id]]=e.target.value;$('#transaction-results').innerHTML=transactionResults();}
    if(id==='document-kind'||id==='document-year'){documentFilter[id==='document-kind'?'kind':'year']=e.target.value;$('#document-results').innerHTML=documentResults();}
    if(id==='entry-category'){
      const needsReview=['Artwork & content purchases','Equipment'].includes(e.target.value);$('#artwork-note').hidden=!needsReview;if(needsReview)$('#entry-form').elements.tax_review.checked=true;
    }
    if(id==='entry-source'&&!$('#entry-name').value)$('#entry-name').value=e.target.value.replace(' · Royals','');
    if(id==='document-upload'){const files=[...e.target.files];e.target.value='';uploadDialog(files);}
    if(id==='editor-file-input'){await uploadFiles([...e.target.files],'editor');e.target.value='';}
    if(id==='csv-upload'){const file=e.target.files[0];e.target.value='';if(!file)return;if(file.size>5*1024*1024)throw new Error('Choose a CSV file under 5 MB.');const result=await api('/api/import/preview',{text:await file.text()});importDialog(result);}
    if(id==='report-year'||id==='report-period'){reportOptions[id==='report-year'?'year':'period']=e.target.value;renderPage();}
    if(id==='report-start'||id==='report-end'){reportOptions[id==='report-start'?'start':'end']=e.target.value;if(reportOptions.start&&reportOptions.end)renderPage();}
    if(e.target.dataset.map){importSession.mapping[e.target.dataset.map]=e.target.value;$('#import-review').innerHTML=importReview();}
    if(id==='import-mode'){importSession.mode=e.target.value;$('#import-review').innerHTML=importReview();}
    if(id==='restore-upload'){
      const file=e.target.files[0];e.target.value='';if(!file)return;if(file.size>2*1024*1024*1024)throw new Error('Choose a backup up to 2 GB.');window.pendingRestore=file;
      openModal('Replace this PC’s ledger?','Restore a backup you previously exported.',`<div class="modal-body"><p id="form-error" class="form-error" role="alert"></p><p class="confirm-copy">Restore <strong>${esc(file.name)}</strong>? This replaces all current entries and documents on this PC. A local recovery backup of the current ledger is saved first.</p>${info('This operation affects only this PC. The backup ZIP you selected is not changed.',true)}</div>`,button('Cancel','close-modal',null,'ghost')+button('Restore this backup','confirm-restore','history','danger'));
    }
  }catch(error){if(id==='editor-file-input'){await refresh(false);if($('#attachment-list'))$('#attachment-list').innerHTML=attachmentList();}showFormError(error);}
});

document.addEventListener('click',async e=>{
  const target=e.target.closest('button,a,[data-page],[data-edit],[data-action]');if(!target)return;
  if(target.classList.contains('help-dot')){showTooltip(target);return;}
  if(target.dataset.page){e.preventDefault();page=target.dataset.page;renderPage();$('#content').focus();return;}
  if(target.dataset.range){if(target.dataset.range==='custom')customRangeDialog();else{range=target.dataset.range;renderPage();}return;}
  if(target.dataset.edit){const entry=state.transactions.find(t=>t.id===target.dataset.edit);if(entry)openEditor(entry.type,entry);return;}
  if(target.dataset.preview){previewDocument(target.dataset.preview);return;}
  if(target.dataset.linkDocument){linkDocument(target.dataset.linkDocument);return;}
  if(target.dataset.unattach){selectedDocuments=selectedDocuments.filter(id=>id!==target.dataset.unattach);$('#attachment-list').innerHTML=attachmentList();return;}
  const action=target.dataset.action;if(!action)return;hideTooltip();
  try{
    if(action==='add-income')return openEditor('income');
    if(action==='add-expense')return openEditor('expense');
    if(action==='close-modal')return modal.close();
    if(action==='settings')return settingsDialog();
    if(action==='help')return helpDialog();
    if(action==='search'){page='transactions';filters.search='';renderPage();$('#transaction-search').focus();return;}
    if(action==='all-transactions'||action==='attention'){filters={search:'',type:'all',source:'all',year:'all',attention:action==='attention',dates:rangeDates()};page='transactions';renderPage();return;}
    if(action==='toggle-attention'){filters.attention=!filters.attention;renderPage();return;}
    if(action==='clear-date-filter'){delete filters.dates;renderPage();return;}
    if(action==='toggle-unlinked'){documentFilter.unlinked=!documentFilter.unlinked;renderPage();return;}
    if(action==='upload-documents'){$('#document-upload').click();return;}
    if(action==='editor-upload'){$('#editor-file-input').click();return;}
    if(action==='pick-documents')return pickDocuments();
    if(action==='new-expense-with-doc'||action==='new-income-with-doc')return openEditor(action.includes('expense')?'expense':'income',null,target.dataset.documentId);
    if(action==='confirm-upload'){
      const year=$('#upload-year');if(!year.reportValidity())return;target.disabled=true;
      try{await uploadFiles(window.pendingFiles,'documents',$('#upload-kind').value,Number(year.value));window.pendingFiles=null;}finally{target.disabled=false;}return;
    }
    if(action==='confirm-link'){
      const entry=state.transactions.find(e=>e.id===$('#link-entry').value);if(!entry)throw new Error('Choose an entry to link this document to.');
      const payload=transactionPayload(entry);payload.document_ids=[...new Set([...entry.document_ids,target.dataset.documentId])];await api('/api/transactions',payload);modal.close();await refresh();toast('Document and entry linked.');return;
    }
    if(action==='save-settings'){target.disabled=true;await api('/api/settings',{owner:$('#settings-owner').value});modal.close();await refresh();toast('Your settings are saved.');return;}
    if(action==='apply-range'){customRange=validDates({start:$('#custom-start').value,end:$('#custom-end').value});range='custom';modal.close();renderPage();return;}
    if(action==='remove-entry'){
      const id=editorId;if(!id)return;await api('/api/transactions/remove',{id});modal.close();await refresh();toast('Entry removed. Original documents are kept.',false,{label:'Undo',run:async()=>{await api('/api/transactions/undo',{id});await refresh();toast('Entry restored.');}});return;
    }
    if(action.startsWith('export-')&&['pdf','docx','csv','zip'].includes(action.slice(7))){target.disabled=true;try{await exportReport(action.slice(7));}finally{target.disabled=false;}return;}
    if(action==='preview-report'){target.disabled=true;try{await exportReport('pdf',true);}finally{target.disabled=false;}return;}
    if(action==='export-backup'){target.disabled=true;try{await downloadURL('/api/backup',`Leahs-Ledger-backup-${today()}.zip`);}finally{target.disabled=false;}return;}
    if(action==='backup-now'){target.disabled=true;await api('/api/backup-now',{});await refresh(false);settingsDialog();toast('A fresh local backup is saved.');return;}
    if(action==='restore'){$('#restore-upload').click();return;}
    if(action==='confirm-restore'){target.disabled=true;try{const response=await fetch('/api/restore',{method:'POST',headers:{'X-Ledger-Token':token,'Content-Type':'application/zip'},body:window.pendingRestore});const result=await response.json();if(!response.ok)throw new Error(result.error||'This backup could not be restored.');window.pendingRestore=null;modal.close();await refresh();toast('Backup restored.');}finally{target.disabled=false;}return;}
    if(action==='import-csv'){$('#csv-upload').click();return;}
    if(action==='confirm-import'){
      const review=parseImportRows();if(review.unmapped)throw new Error('Match the three required columns first.');if(review.errors.length)throw new Error('Fix the invalid rows in your CSV and choose the corrected file. Nothing has been imported.');if(!review.entries.length)throw new Error('There are no entries to import.');target.disabled=true;
      try{const result=await api('/api/import',{entries:review.entries,skip_duplicates:$('#skip-duplicates').checked});modal.close();page='transactions';filters={search:'',type:'all',source:'all',year:'all',attention:false};await refresh();toast(`${result.imported} entries imported. ${result.skipped} matching entries skipped.`);}finally{target.disabled=false;}return;
    }
    if(action==='exit'){
      openModal('Save and exit','A local recovery backup will be saved before closing.',`<div class="modal-body"><p id="form-error" class="form-error" role="alert"></p><p class="confirm-copy">Your records are already saved. Choose Save & exit to save another local backup and stop the app. Then close this window.</p></div>`,button('Keep working','close-modal',null,'ghost')+button('Save & exit','confirm-exit','check','primary'));return;
    }
    if(action==='confirm-exit'){target.disabled=true;await api('/api/shutdown',{});modal.close();$('#content').innerHTML=empty('Records saved','Your records and backup are saved. You can close this window now.','heart');$$('button').forEach(b=>b.disabled=true);return;}
  }catch(error){target.disabled=false;showFormError(error);}
});

document.addEventListener('keydown',e=>{
  if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'&&!modal.open){e.preventDefault();page='transactions';renderPage();$('#transaction-search').focus();}
  if(e.key==='Escape')hideTooltip();
  const row=e.target.closest('tr[data-edit]');if(row&&e.target===row&&(e.key==='Enter'||e.key===' ')){e.preventDefault();const entry=state.transactions.find(t=>t.id===row.dataset.edit);if(entry)openEditor(entry.type,entry);}
  if(e.target.id==='main-drop'&&(e.key==='Enter'||e.key===' ')){e.preventDefault();$('#document-upload').click();}
});
document.addEventListener('paste',async e=>{
  if(!modal.open||!$('#entry-form'))return;const files=[...(e.clipboardData?.files||[])];if(!files.length)return;e.preventDefault();try{await uploadFiles(files,'editor');}catch(error){showFormError(error);}
});
modal.addEventListener('click',e=>{if(e.target===modal){const r=modal.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)modal.close();}});
modal.addEventListener('close',hideTooltip);

refresh().catch(error=>{$('#content').innerHTML=empty('Unable to open your records',esc(error.message),'lock');});
