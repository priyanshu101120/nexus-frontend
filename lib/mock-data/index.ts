export type Priority='LOW'|'MEDIUM'|'HIGH';
export type Task={id:string;title:string;description?:string;priority:Priority;status:string;assignee:string;dueDate:string;labels:string[];comments:number;project:string};
export const members=[['Priyanshu','you@nexus.dev','OWNER'],['Rahul','rahul@nexus.dev','ADMIN'],['Aditi','aditi@nexus.dev','MEMBER'],['Aman','aman@nexus.dev','MEMBER'],['Maya','maya@nexus.dev','MEMBER']].map(([name,email,role],i)=>({id:`m${i}`,name,email,role,initials:name.split(' ').map(x=>x[0]).join('')}));
export const projects=[{id:'website',name:'Website Redesign',description:'Reimagine the marketing experience.',progress:74,color:'#6D5DFB',tasks:16,due:'Sep 18',members:5},{id:'mobile',name:'Mobile App',description:'A focused mobile workspace.',progress:52,color:'#55B6FF',tasks:28,due:'Oct 02',members:8},{id:'launch',name:'Q4 Launch',description:'Coordinate the next product chapter.',progress:87,color:'#FFB84D',tasks:21,due:'Aug 30',members:6},{id:'brand',name:'Brand System',description:'A flexible visual language for Nexus.',progress:38,color:'#65C98A',tasks:12,due:'Oct 21',members:4}];
export const tasks:Task[]=[
{id:'t1',title:'Redesign onboarding',description:'Create a calmer first-run experience.',priority:'HIGH',status:'IN PROGRESS',assignee:'Priyanshu',dueDate:'Today',labels:['Design','UX'],comments:6,project:'Website Redesign'},
{id:'t2',title:'Fix mobile navigation',priority:'HIGH',status:'TODO',assignee:'Aditi',dueDate:'Tomorrow',labels:['Frontend'],comments:3,project:'Website Redesign'},
{id:'t3',title:'Create dashboard',priority:'MEDIUM',status:'REVIEW',assignee:'Rahul',dueDate:'Aug 28',labels:['Product'],comments:8,project:'Mobile App'},
{id:'t4',title:'Write documentation',priority:'LOW',status:'DONE',assignee:'Aman',dueDate:'Aug 26',labels:['Docs'],comments:2,project:'Brand System'},
{id:'t5',title:'Connect analytics',priority:'MEDIUM',status:'IN PROGRESS',assignee:'Maya',dueDate:'Aug 29',labels:['Growth'],comments:4,project:'Q4 Launch'},
{id:'t6',title:'Review empty states',priority:'LOW',status:'TODO',assignee:'Priyanshu',dueDate:'Sep 01',labels:['UI'],comments:1,project:'Website Redesign'},
{id:'t7',title:'Prepare launch checklist',priority:'HIGH',status:'DONE',assignee:'Rahul',dueDate:'Aug 24',labels:['Launch'],comments:5,project:'Q4 Launch'},
];
export const activities=[['Priyanshu','created','Website Redesign','2m ago'],['Rahul','moved','Homepage UI to Review','18m ago'],['Aditi','commented','on Dashboard','42m ago'],['Aman','joined','the workspace','1h ago'],['Maya','completed','Connect analytics','2h ago']];
export const notifications=[['Task assigned','You were assigned “Redesign onboarding”','2m ago'],['Comment mention','Aditi mentioned you in Dashboard','18m ago'],['Project update','Q4 Launch reached 87%','1h ago'],['Invitation','Maya joined Nexus Studio','Yesterday']];
